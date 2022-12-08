import {Drawing} from '../Drawing';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export class RotatedRectangleDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {

    distanceBeforeRotate: number = 0;
    rotateState: boolean = false;

    static get className(): string {
        return 'rotatedRectangle';
    }

    get pointsNeeded(): number {
        return 3;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        if (points.length < this.pointsNeeded) {
            return false;
        }
        let distance = this.calculateDistance();
        let topPoints: IPoint[] = this.getTopPoints(distance);
        let bottomPoints: IPoint[] = this.getBottomPoints(distance);
        return Geometry.isPointNearPolyline(point, [points[0], points[1]]) ||
            Geometry.isPointNearPolyline(point, topPoints) ||
            Geometry.isPointNearPolyline(point, bottomPoints) ||
            Geometry.isPointNearPolyline(point, [topPoints[1], bottomPoints[1]]) ||
            Geometry.isPointNearPolyline(point, [topPoints[0], bottomPoints[0]]);
    }

    private _markerPoints(): IPoint[] {
        let points: IPoint[] = this.cartesianPoints();
        if(points.length < 2) {
            return points;
        }
        let distance = this.rotateState ? this.distanceBeforeRotate : this.calculateDistance();
        let topPoints: IPoint[] = this.getTopPoints(distance);
        let bottomPoints: IPoint[] = this.getBottomPoints(distance);
        return [points[0], points[1], topPoints[0], topPoints[1], bottomPoints[0], bottomPoints[1]];
    }

    private calculateDistance(): number {
        let points: IPoint[] = this.cartesianPoints();
        if(points.length != this.pointsNeeded) {
            return 0;
        }
        return Math.abs(this.slope() * points[2].x - points[2].y - this.slope() * points[0].x + points[0].y) / Math.sqrt(Math.pow(this.slope(), 2) + 1);
    }

    private slope(): number {
        let points: IPoint[] = this.cartesianPoints();
        return (points[1].y - points[0].y) / (points[1].x - points[0].x);
    }

    draw() {
        if (!this.visible) {
            return;
        }
        let points = this.cartesianPoints(),
            context = this.context,
            theme = this.getDrawingTheme();
        if (1 < points.length) {
            if (points.length == this.pointsNeeded) {
                this.drawRectangle(context, points, theme);
            } else {
                this.drawLine(context, points, theme);
            }
        }

        if (this.selected) {
            this._drawSelectionMarkers(this._markerPoints());
        }
    }

    private drawLine(context: CanvasRenderingContext2D, points: IPoint[], theme: FilledShapeDrawingTheme) {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
        context.scxStroke(theme.line);
    }

    private drawRectangle(context: CanvasRenderingContext2D, points: IPoint[], theme: FilledShapeDrawingTheme) {
        let distance = this.rotateState ? this.distanceBeforeRotate : this.calculateDistance();
        let topPoints: IPoint[] = this.getTopPoints(distance);
        let bottomPoints: IPoint[] = this.getBottomPoints(distance);
        context.beginPath();

        context.moveTo(topPoints[1].x, topPoints[1].y);
        context.lineTo(topPoints[0].x, topPoints[0].y);

        context.moveTo(topPoints[0].x, topPoints[0].y);
        context.lineTo(bottomPoints[0].x, bottomPoints[0].y);

        context.moveTo(bottomPoints[0].x, bottomPoints[0].y);
        context.lineTo(bottomPoints[1].x, bottomPoints[1].y);

        context.moveTo(bottomPoints[1].x, bottomPoints[1].y);
        context.lineTo(topPoints[1].x, topPoints[1].y);

        context.scxStroke(theme.line);

        context.scxFillPolyLine([bottomPoints[1], bottomPoints[0], topPoints[0], topPoints[1]], theme.fill);

    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                let points = this._markerPoints();
                for (let i = 0; i < points.length; i++) {
                    if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                        this._setDragPoint(i);
                        this.rotateState = i < 2;
                        this.distanceBeforeRotate = this.calculateDistance();
                        return true;
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    if (this._dragPoint >= 2) {
                        this.chartPoints[2].moveToPoint(magnetChartPoint, this.projection);
                    } else {
                        this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    }
                    return true;
                }
                break;
            case GestureState.FINISHED:
                if(this.rotateState) {
                    let point = this._markerPoints()[2];
                    this.chartPoints[2].moveTo(point.x, point.y, this.projection);
                    this.rotateState = false;
                }


                break;
        }
    }

    private getTopPoints(distance:number): IPoint[] {
        let points: IPoint[] = this.cartesianPoints();
        if (this.slope() == 0) {
            return [
                {x: points[1].x, y: points[1].y + distance},
                {x: points[0].x, y: points[0].y + distance}
            ];
        } else {
            let x3 = points[1].x + Math.sqrt(Math.pow(distance, 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            let y3 = (-1 / this.slope()) * (x3 - points[1].x) + points[1].y;
            let x4 = points[0].x + Math.sqrt(Math.pow(distance, 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            let y4 = (-1 / this.slope()) * (x4 - points[0].x) + points[0].y;
            return [
                {x: x3, y: y3},
                {x: x4, y: y4}
            ];
        }
    }

    private getBottomPoints(distance:number): IPoint[] {
        let points: IPoint[] = this.cartesianPoints();
        if (this.slope() == 0) {
            return [
                {x: points[1].x, y: points[1].y - distance},
                {x: points[0].x, y: points[0].y - distance}
            ];
        } else {
            let x5 = points[1].x - Math.sqrt(Math.pow(distance, 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            let y5 = (-1 / this.slope()) * (x5 - points[1].x) + points[1].y;
            let x6 = points[0].x - Math.sqrt(Math.pow(distance, 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            let y6 = (-1 / this.slope()) * (x6 - points[0].x) + points[0].y;
            return [
                {x: x5, y: y5},
                {x: x6, y: y6}
            ];
        }
    }

    canControlPointsBeManuallyChanged() : boolean {
        return false;
    }

}

Drawing.register(RotatedRectangleDrawing);


