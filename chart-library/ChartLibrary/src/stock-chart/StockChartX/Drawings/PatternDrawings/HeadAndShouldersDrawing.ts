import {Drawing, DrawingDragPoint} from '../Drawing';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {IPoint} from '../../Graphics/ChartPoint';
import {ChartAccessorService} from '../../../../services/chart';
import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export class HeadAndShouldersDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string {
        return 'headAndShoulders';
    }

    get pointsNeeded(): number {
        return 7;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearPolyline(point, points) ||
            Geometry.isPointNearPolyline(point, [this.infinityPoints()[0], this.infinityPoints()[1]]);
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                let points = this.cartesianPoints();
                for (let i = 0; i < points.length; i++) {
                    if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                        this._setDragPoint(i);
                        return true;
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    return true;
                }
                break;
            case GestureState.FINISHED:
                if (this._dragPoint) {
                    this._setDragPoint(DrawingDragPoint.NONE);
                    return true;
                }
                break;
        }
        return false;
    }

    draw() {
        if (!this.visible)
            return;
        let points = this.cartesianPoints();

        if (points.length > 1) {
            this.context.beginPath();
            this.context.scxStrokePolyline([points[0], points[1]], this.getDrawingTheme().line);
            this.drawWordInBox(points[1], this.getText('الكتف الأيسر'), points[0].y > points[1].y);
            let remainingPoints: number = this.pointsNeeded - points.length;
            if (remainingPoints <= 4) {
                this.context.scxStrokePolyline([points[1], points[2]], this.getDrawingTheme().line);
            }
            if (remainingPoints <= 3) {
                this.context.scxStrokePolyline([points[2], points[3]], this.getDrawingTheme().line);
                this.drawWordInBox(points[3], this.getText('الرأس'), points[2].y > points[3].y);
            }
            if (remainingPoints <= 2) {
                this.context.scxStrokePolyline([points[3], points[4]], this.getDrawingTheme().line);
                this.context.scxFillPolyLine([points[2], points[3], points[4]], this.getDrawingTheme().fill);
                this.drawBeamLine();
            }
            if (remainingPoints <= 1) {
                this.context.scxStrokePolyline([points[4], points[5]], this.getDrawingTheme().line);
                this.drawWordInBox(points[5],this.getText('الكتف الأيمن'), points[4].y > points[5].y);
            }
            if (remainingPoints == 0) {
                this.context.scxStrokePolyline([points[5], points[6]], this.getDrawingTheme().line);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private slope(point1: IPoint, point2: IPoint): number {
        return (point2.y - point1.y) / (point2.x - point1.x);
    }

    private drawLine(point1: IPoint, point2: IPoint) {
        this.context.beginPath();
        this.context.moveTo(point1.x, point1.y);
        this.context.lineTo(point2.x, point2.y);
    }

    private infinityPoints() {
        let points = this.cartesianPoints();
        let linearSegment1: LinearSegment = new LinearSegment(points[2], points[4]);
        let x = points[2].x < points[4].x ? -1000000 : 1000000;
        return [
            {x: x, y: linearSegment1.getY(x)},
            {x: -1 * x, y: linearSegment1.getY(-1 * x)}
        ];
    }


    private drawWordInBox(point: IPoint, text: string, abovePoint: boolean): void {
        this.drawTextInBox(this.getDrawingTheme().line, point, text, abovePoint, ChartAccessorService.instance.isArabic() ? 15 : 12);
    }

    private drawBeamLine() {

        let points = this.cartesianPoints();
        let infinityPoints = this.infinityPoints();

        let zeroToOneLinearSegment:LinearSegment = new LinearSegment(points[0], points[1]);
        let infinitySegment:LinearSegment = new LinearSegment(infinityPoints[0], infinityPoints[1]);

        let firstPoint:IPoint = zeroToOneLinearSegment.doesIntersect(infinitySegment) ? zeroToOneLinearSegment.intersectionPoint(infinitySegment) : infinityPoints[0];
        let secondPoint:IPoint = infinityPoints[1];

        if (points[6]) {
            let fiveToSixLinearSegment:LinearSegment = new LinearSegment(points[5], points[6]);
            secondPoint = fiveToSixLinearSegment.doesIntersect(infinitySegment) ? fiveToSixLinearSegment.intersectionPoint(infinitySegment) : infinityPoints[1];
        }

        this.drawLine(firstPoint, secondPoint);
        this.context.scxStroke(this.getDrawingTheme().line);

        if(firstPoint != infinityPoints[0]){
            this.context.scxFillPolyLine([points[1], points[2], firstPoint], this.getDrawingTheme().fill);
        }

        if(secondPoint != infinityPoints[1]) {
            this.context.scxFillPolyLine([points[4], points[5], secondPoint], this.getDrawingTheme().fill);
        }

    }

    private getText(arabic:string):string {
        return ChartAccessorService.instance.translate(arabic);
    }

}


class LinearSegment {

    private slope: number;
    private intercept: number;
    private point1: IPoint;
    private point2: IPoint;

    constructor(point1: IPoint, point2: IPoint) {
        this.point1 = point1;
        this.point2 = point2;
        this.slope = (point2.y - point1.y) / (point2.x - point1.x);
        this.intercept = point1.y - this.slope * point1.x;
    }

    intersectionPoint(linearSegment: LinearSegment): IPoint {

        if (linearSegment.slope == this.slope) {
            return null;
        }

        let intersectX: number = (linearSegment.getIntercept() - this.getIntercept()) / (this.getSlope() - linearSegment.getSlope());
        let intersectY: number = this.getY(intersectX);

        return {x: intersectX, y: intersectY};

    }

    doesIntersect(linearSegment: LinearSegment): boolean {
        if (linearSegment.getSlope() == this.getSlope()) {
            return false;
        }
        let intersectionPoint: IPoint = this.intersectionPoint(linearSegment);
        return Math.min(this.point1.x, this.point2.x) <= intersectionPoint.x && intersectionPoint.x <= Math.max(this.point1.x, this.point2.x);
    }

    getY(x: number): number {
        return this.slope * x + this.intercept;
    }

    getIntercept(): number {
        return this.intercept;
    }

    getSlope(): number {
        return this.slope;
    }

}


Drawing.register(HeadAndShouldersDrawing);
