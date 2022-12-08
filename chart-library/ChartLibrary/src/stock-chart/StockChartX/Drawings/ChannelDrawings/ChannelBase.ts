import {ThemedDrawing} from '../ThemedDrawing';
import {LineDrawingTheme} from '../DrawingThemeTypes';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';

export class ChannelBase extends ThemedDrawing<LineDrawingTheme> {

    protected _drawingPoints: IPoint[];

    get pointsNeeded(): number {
        return 2;
    }

    hitTest(point: IPoint): boolean {
        if (this.chartPoints.length < this.pointsNeeded)
            return false;

        let p = this._drawingPoints;

        return Geometry.isPointNearLine(point, p[0], p[1]) ||
            Geometry.isPointNearLine(point, p[2], p[3]) ||
            Geometry.isPointNearLine(point, p[4], p[5]);
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                this.moveChartPointsToMainLinePoints();
                if (Geometry.isPointNearPoint(this.cartesianPoint(0), event.pointerPosition))
                    this._setDragPoint(0);
                else if (Geometry.isPointNearPoint(this.cartesianPoint(1), event.pointerPosition))
                    this._setDragPoint(1);
                else
                    return false;

                return true;
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

    draw() {
        if (!this.visible)
            return;

        let points = this.cartesianPoints();
        if (points.length === 0)
            return;

        if (points.length > 1) {
            this.drawLines();
            points = this._getMainLinePoints();
        }
        if (this.selected)
            this._drawSelectionMarkers(points);
    }

    protected drawLines() {
        let points = this.cartesianPoints();
        let theme = this.getDrawingTheme();
        let context = this.context;
        let p = this._drawingPoints = this._calculateDrawingPoints(points);
        this._moveMainLineYPoint(p[2].y, p[3].y);

        context.beginPath();
        context.moveTo(p[0].x, p[0].y);
        context.lineTo(p[1].x, p[1].y);

        context.moveTo(p[2].x, p[2].y);
        context.lineTo(p[3].x, p[3].y);

        context.moveTo(p[4].x, p[4].y);
        context.lineTo(p[5].x, p[5].y);

        context.scxStroke(theme.line);
    }

    protected moveChartPointsToMainLinePoints() {
        let points = this._getMainLinePoints();
        this.chartPoints[0].moveToPoint(points[0], this.projection);
        this.chartPoints[1].moveToPoint(points[1], this.projection);
    }

    protected _getMainLinePoints(): IPoint[] {
        return [
            this._drawingPoints[2],
            this._drawingPoints[3]
        ];
    }

    protected _moveMainLineYPoint(y1: number, y2: number): void {
        this.chartPoints[0].moveToY(y1, this.projection);
        this.chartPoints[1].moveToY(y2, this.projection);
    }

    protected _calculateDrawingPoints(points: IPoint[]): IPoint[] {
        return [];
    }
}
