import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';
import {Drawing} from '../Drawing';
import { IPoint} from "../../Graphics/ChartPoint";
import {Geometry} from "../../Graphics/Geometry";
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {ThemedDrawing} from '../ThemedDrawing';

export class BandDrawing extends ThemedDrawing<FilledShapeDrawingTheme>{
    static get className(): string{
        return 'band';
    }

    get pointsNeeded(): number {
        return 2;
    }

    private _markerPoints(points: IPoint[]): BandPoints {
        let frame = this.chartPanel.contentFrame;
        return {
            firstLineTopPoint: {x: points[0].x, y: frame.top},
            firstLineBottomPoint: {x: points[0].x, y: frame.bottom},
            secondLineTopPoint: {x: points[1].x, y: frame.top},
            secondLineBottomPoint: {x: points[1].x, y: frame.bottom}
        };
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints(),
            markerPoints: BandPoints = this._markerPoints(points);

        if (points.length < this.pointsNeeded) {
            return false;
        }
        if (Geometry.isPointNearLine(point, markerPoints.firstLineTopPoint, markerPoints.firstLineBottomPoint)
            || Geometry.isPointNearLine(point, markerPoints.secondLineTopPoint, markerPoints.secondLineBottomPoint)) {
            return true;
        }
        return this.selected && Geometry.isPointNearPoint(point, points);
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        //Same as _handlePanGesture in FibonacciTimeZonesDrawing.ts
        switch (gesture.state) {
            case GestureState.STARTED:
                let points = this.cartesianPoints();
                if (points.length > 1) {
                    for (let i = 0; i < points.length; i++) {
                        if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                            this._setDragPoint(i);
                            return true;
                        }
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
        }
        return false;
    }

     /**
     * @inheritdoc
     */

    public draw() {
         if (!this.visible) {
             return;
         }

         let points = this.cartesianPoints();
         if (points.length === 0)
             return;

         if (points.length > 1) {
             let markerPoints: BandPoints = this._markerPoints(points);
             let context = this.context;
             context.beginPath();
             context.moveTo(markerPoints.firstLineTopPoint.x , markerPoints.firstLineTopPoint.y);
             context.lineTo(markerPoints.firstLineBottomPoint.x , markerPoints.firstLineBottomPoint.y);
             context.moveTo(markerPoints.secondLineTopPoint.x , markerPoints.secondLineTopPoint.y);
             context.lineTo(markerPoints.secondLineBottomPoint.x , markerPoints.secondLineBottomPoint.y);
             context.scxStroke(this.getDrawingTheme().line);
             context.scxFillPolyLine([markerPoints.secondLineBottomPoint, markerPoints.firstLineBottomPoint,
                 markerPoints.firstLineTopPoint, markerPoints.secondLineTopPoint], this.getDrawingTheme().fill);
         }

         if (this.selected) {
             this._drawSelectionMarkers(points);
         }
     }
}

interface BandPoints{
    firstLineTopPoint: IPoint,
    firstLineBottomPoint: IPoint,
    secondLineTopPoint: IPoint,
    secondLineBottomPoint: IPoint
}

Drawing.register(BandDrawing);
