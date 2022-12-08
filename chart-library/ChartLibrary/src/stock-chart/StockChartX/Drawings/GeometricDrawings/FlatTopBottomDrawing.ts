import {Drawing, DrawingDragPoint} from '../Drawing';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';


export class FlatTopBottomDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {

    static get className(): string {
        return 'flatTopBottom';
    }

    get pointsNeeded(): number {
        return 3;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        if (points.length < this.pointsNeeded) {
            return false;
        }
        let extendedLinePoints: IPoint[] = this.getExtendedLinePoints();
        return Geometry.isPointNearPolyline(point, extendedLinePoints) ||
               Geometry.isPointNearPolyline(point, [points[0], points[1]]) ||
               Geometry.isPointNearPolyline(point, [extendedLinePoints[0], extendedLinePoints[1]]);
    }

    private _markerPoints(): IPoint[] {
        let points: IPoint[] = this.cartesianPoints();
        if (this.pointsCompleted()) {
            let extendedLinePoints: IPoint[] = this.getExtendedLinePoints();
            return [
                {x: points[0].x, y: points[0].y},
                {x: points[1].x, y: points[1].y},
                {x: extendedLinePoints[0].x, y: extendedLinePoints[0].y},
                {x: extendedLinePoints[1].x, y: extendedLinePoints[1].y},
            ];
        } else {
            return points;
        }
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                let points = this._markerPoints();
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
                    if (this._dragPoint >= 2) {
                        switch (this._dragPoint) {
                            case 2:
                                this.chartPoints[2].moveToPoint(magnetChartPoint, this.projection);
                                break;
                            case 3 :
                                this.chartPoints[2].moveToX(magnetChartPoint.x, this.projection);
                                this.chartPoints[0].moveToX(magnetChartPoint.x, this.projection);
                                break;
                        }
                    } else {
                        this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    }
                    return true;
                }
                break;
            case GestureState.FINISHED:
                this._setDragPoint(DrawingDragPoint.NONE);
                break;
        }
    }

    draw() {
        if (!this.visible) {
            return;
        }
        let points = this.cartesianPoints(),
            context = this.context,
            theme = this.getDrawingTheme();

        if (1 < points.length) {
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineTo(points[1].x, points[1].y);
            context.scxStroke(this.getDrawingTheme().line);

            if (points.length == this.pointsNeeded) {
                let extendedLinePoints: IPoint[] = this.getExtendedLinePoints();
                context.moveTo(extendedLinePoints[0].x, extendedLinePoints[0].y);
                context.lineTo(extendedLinePoints[1].x, extendedLinePoints[1].y);
                context.scxStroke(this.getDrawingTheme().line);
                context.scxFillPolyLine([points[0], points[1], extendedLinePoints[0], extendedLinePoints[1]], this.getDrawingTheme().fill);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(this._markerPoints());
        }
    }

    private getExtendedLinePoints(): IPoint[] {
        let points: IPoint[] = this.cartesianPoints();

        if (points[2] == null) {
            points[2] = points[1];
        }
        return [
            {x: points[1].x, y: points[2].y},
            {x: points[0].x, y: points[2].y}
        ];
    }

    canControlPointsBeManuallyChanged(): boolean {
        return false;
    }
}

Drawing.register(FlatTopBottomDrawing);
