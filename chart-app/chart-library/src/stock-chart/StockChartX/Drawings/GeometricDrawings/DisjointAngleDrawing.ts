import {Drawing, DrawingDragPoint, IDrawingOptions} from '../Drawing';
import {ChartPoint, IChartPoint, IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {FilledShapeDrawingTheme, LineWithLabelDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export class DisjointAngleDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {

    private beforeDraggingCartesianPoints:IPoint[];

    static get className(): string {
        return 'disjointAngle';
    }

    get pointsNeeded(): number {
        return 3;
    }

    protected onMoveChartPointInUserDrawingState():void{
        if(this.pointsCompleted()) {
            this.chartPoints[2].date = this.chartPoints[1].date;
        }
    }

    protected onAddNewChartPointInUserDrawingState():void{
        if(this.pointsCompleted()) {
            this.chartPoints[2].date = this.chartPoints[1].date;
        }
    }

    hitTest(point: IPoint): boolean {
        if (!this.pointsCompleted()) {
            return false;
        }
        let markerPoints: IPoint[] = this._markerPoints();
        return Geometry.isPointNearPolyline(point, [markerPoints[0], markerPoints[1]]) ||
            Geometry.isPointNearPolyline(point, [markerPoints[2], markerPoints[3]]);
    }


    private _markerPoints(): IPoint[] {
        let points: IPoint[] = this.cartesianPoints();
        if (this.pointsCompleted()) {
            let distance = points[1].y - points[0].y;
            return [
                {x: points[0].x, y: points[0].y},
                {x: points[1].x, y: points[1].y},
                {x: points[2].x, y: points[2].y},
                {x: points[0].x, y: points[2].y + distance},
            ];
        } else {
            return points;
        }

    }

    draw() {
        if (!this.visible) {
            return;
        }
        let points = this._markerPoints(),
            context = this.context,
            theme = this.getDrawingTheme();

        if (1 < points.length) {
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineTo(points[1].x, points[1].y);

            if (this.pointsCompleted()) {
                context.moveTo(points[2].x, points[2].y);
                context.lineTo(points[3].x, points[3].y);
                context.scxStroke(this.getDrawingTheme().line);
                context.scxFillPolyLine(points, this.getDrawingTheme().fill);
            } else {
                context.scxStroke(this.getDrawingTheme().line);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(this._markerPoints());
        }
    }


    private savePointsBeforeDragging(points:IPoint[]): void {
        this.beforeDraggingCartesianPoints = [];
        points.forEach(point => {
            this.beforeDraggingCartesianPoints.push({x: point.x, y:point.y});
        })
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                let points = this._markerPoints();
                let cartesianPoints = this._markerPoints();
                for (let i = 0; i < points.length; i++) {
                    if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                        this._setDragPoint(i);
                        this.savePointsBeforeDragging(this._markerPoints());
                        return true;
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    if (this._dragPoint >= 0) {
                        switch (this._dragPoint) {
                            case 0 :
                                this.chartPoints[0].moveToPoint(magnetChartPoint, this.projection);
                                break;
                            case 1 :
                                this.chartPoints[1].moveToPoint(magnetChartPoint, this.projection);
                                let point1YDiff: number = this.beforeDraggingCartesianPoints[1].y - this.cartesianPoints()[1].y;
                                this.chartPoints[2].moveToX(magnetChartPoint.x, this.projection);
                                this.chartPoints[2].moveToY(this.beforeDraggingCartesianPoints[2].y + point1YDiff, this.projection);
                                break;
                            case 2 :
                                this.chartPoints[2].moveToY(magnetChartPoint.y, this.projection);
                                break;
                            case 3 :
                                let point3YDiff: number = this.beforeDraggingCartesianPoints[3].y - magnetChartPoint.y;
                                this.chartPoints[0].moveToY(this.beforeDraggingCartesianPoints[0].y + point3YDiff, this.projection);
                                break;
                        }
                    }
                    return true;
                }
                break;
            case GestureState.FINISHED:
                this._setDragPoint(DrawingDragPoint.NONE);
                break;
        }
    }

    canControlPointsBeManuallyChanged() : boolean {
        return false;
    }

}

Drawing.register(DisjointAngleDrawing);


