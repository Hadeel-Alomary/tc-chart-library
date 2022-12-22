import {Drawing, DrawingDragPoint} from '../Drawing';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {IPoint} from '../../Graphics/ChartPoint';
import {LineDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export class ThreeDrivesPatternDrawing extends ThemedDrawing<LineDrawingTheme> {

    static get className(): string {
        return 'threeDrivesPattern';
    }

    get pointsNeeded(): number {
        return 7;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearPolyline(point, points) ||
            Geometry.isPointNearPolyline(point, [points[1], points[3]]) ||
            Geometry.isPointNearPolyline(point, [points[3], points[5]]);
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
            let numberOfRemainingPoints = this.pointsNeeded - points.length;
            if (numberOfRemainingPoints <= 4) {
                this.context.scxStrokePolyline([points[1], points[2]], this.getDrawingTheme().line);
            }
            if (numberOfRemainingPoints <= 3) {
                this.context.scxStrokePolyline([points[2], points[3]], this.getDrawingTheme().line);
                this.drawLineWithBoxNumber(this.getDrawingTheme().line, points[1], points[3], this.calculateNumber(2, 3, 1).toString());
            }
            if (numberOfRemainingPoints <= 2) {
                this.context.scxStrokePolyline([points[3], points[4]], this.getDrawingTheme().line);
            }
            if (numberOfRemainingPoints <= 1) {
                this.context.scxStrokePolyline([points[4], points[5]], this.getDrawingTheme().line);
                this.drawLineWithBoxNumber(this.getDrawingTheme().line, points[3], points[5], this.calculateNumber(4, 5, 3).toString());
            }
            if (numberOfRemainingPoints === 0) {
                this.context.scxStrokePolyline([points[5], points[6]], this.getDrawingTheme().line);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private calculateNumber(anglePoint: number, point1: number, point2: number): number {
        let diff1 = this.chartPoints[anglePoint].value - this.chartPoints[point1].value;
        let diff2 = this.chartPoints[anglePoint].value - this.chartPoints[point2].value;

        return Math.roundToDecimals(Math.abs(diff1 / diff2), 3);
    }

}

Drawing.register(ThreeDrivesPatternDrawing);
