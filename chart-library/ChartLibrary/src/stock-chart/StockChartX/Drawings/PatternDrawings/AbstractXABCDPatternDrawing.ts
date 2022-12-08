import {Drawing, DrawingDragPoint} from '../Drawing';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {IPoint} from '../../Graphics/ChartPoint';
import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export abstract class AbstractXABCDPatternDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {

    get pointsNeeded(): number {
        return 5;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        return this.pointsCompleted() &&
            (Geometry.isPointNearPolyline(point, points) ||
                Geometry.isPointNearPolyline(point, [points[0], points[4]]) ||
                Geometry.isPointNearPolyline(point, [points[0], points[2]]) ||
                Geometry.isPointNearPolyline(point, [points[1], points[3]]) ||
                Geometry.isPointNearPolyline(point, [points[2], points[4]]));

    }

    protected abstract calculatePointZeroToFourRatio():number;

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
        let points = this.cartesianPoints(),
            context = this.context,
            theme = this.getDrawingTheme();

        if (points.length > 1) {
            context.beginPath();
            this.context.scxStrokePolyline([points[0], points[1]], this.getDrawingTheme().line);
            this.drawTextInBox(this.getDrawingTheme().line, points[0], 'X', points[1].y > points[0].y);
            this.drawTextInBox(this.getDrawingTheme().line, points[1], 'A', points[0].y > points[1].y);
            if (points.length == this.pointsNeeded - 2 || points.length == this.pointsNeeded || points.length == this.pointsNeeded - 1) {
                this.context.scxStrokePolyline([points[1], points[2]], this.getDrawingTheme().line);
                this.context.scxStrokePolyline([points[0], points[2]], this.getDrawingTheme().line);
                this.drawTextInBox(this.getDrawingTheme().line, points[2], 'B', points[1].y > points[2].y);
                context.scxFillPolyLine([points[0], points[1], points[2]], theme.fill);
                this.drawBoxNumberOnAnExistingLine(this.getDrawingTheme().line, points[0], points[2], this.calculateRatio(1, 2, 0).toString());
            }
            if (points.length == this.pointsNeeded - 1 || points.length == this.pointsNeeded) {
                this.context.scxStrokePolyline([points[2], points[3]], this.getDrawingTheme().line);
                this.drawTextInBox(this.getDrawingTheme().line, points[3], 'C', points[2].y > points[3].y);
                this.drawLineWithBoxNumber(this.getDrawingTheme().line, points[1], points[3], this.calculateRatio(2, 3, 1).toString());
            }
            if (points.length == this.pointsNeeded) {
                this.context.scxStrokePolyline([points[3], points[4]], this.getDrawingTheme().line);
                this.context.scxStrokePolyline([points[2], points[4]], this.getDrawingTheme().line);
                this.drawLineWithBoxNumber(this.getDrawingTheme().line, points[0], points[4], this.calculatePointZeroToFourRatio().toString());
                context.scxFillPolyLine([points[2], points[3], points[4]], theme.fill);
                this.drawBoxNumberOnAnExistingLine(this.getDrawingTheme().line, points[2], points[4], this.calculateRatio(3, 4, 2).toString());
                this.drawTextInBox(this.getDrawingTheme().line, points[4], 'D', points[3].y > points[4].y);
            }
        }
        if (this.selected)
            this._drawSelectionMarkers(points);
    }

    protected calculateRatio(anglePoint: number, point1: number, point2: number):number {
        let diff1 = this.chartPoints[anglePoint].value - this.chartPoints[point1].value;
        let diff2 = this.chartPoints[anglePoint].value - this.chartPoints[point2].value;
        return Math.roundToDecimals(Math.abs(diff1 / diff2),3);
    }

}

