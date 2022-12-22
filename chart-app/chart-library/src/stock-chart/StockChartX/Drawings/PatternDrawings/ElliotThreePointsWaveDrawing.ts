import {Drawing, DrawingDragPoint} from '../Drawing';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {IPoint} from '../../Graphics/ChartPoint';
import {LineDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export abstract class ElliottThreePointsWaveDrawing extends ThemedDrawing<LineDrawingTheme> {

    protected abstract getLabels():string[];

    get pointsNeeded(): number {
        return 4;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearPolyline(point, points) ||
            Geometry.isPointNearPolyline(point, [points[0], points[2]]) ||
            Geometry.isPointNearPolyline(point, [points[1], points[3]]);
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

        let labels = this.getLabels();

        if (points.length > 1) {
            this.context.beginPath();
            this.context.scxStrokePolyline([points[0], points[1]], this.getDrawingTheme().line);
            this.drawBowsWithLetters(this.getDrawingTheme().line, points[1], labels[1], this.bowsPosition(points[1], 'top'));
            if (points.length == this.pointsNeeded - 1 || points.length == this.pointsNeeded) {
                this.context.scxStrokePolyline([points[1], points[2]], this.getDrawingTheme().line);
                this.drawBowsWithLetters(this.getDrawingTheme().line, points[2], labels[2], this.bowsPosition(points[2], 'bottom'));
            }
            if (points.length == this.pointsNeeded) {
                this.context.scxStrokePolyline([points[2], points[3]], this.getDrawingTheme().line);
                this.drawBowsWithLetters(this.getDrawingTheme().line, points[3], labels[3], this.bowsPosition(points[3], 'top'));
            }
            this.context.scxStroke(this.getDrawingTheme().line);
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
            this.drawBowsWithLetters(this.getDrawingTheme().line, points[0], labels[0], this.bowsPosition(points[0], 'bottom'));
        }
    }
}

