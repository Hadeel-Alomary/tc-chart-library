import {Drawing} from '../Drawing';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {LineDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export class SineLineDrawing extends ThemedDrawing<LineDrawingTheme> {
    static get className(): string {
        return 'sineLine';
    }

    get pointsNeeded(): number {
        return 2;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        if (points.length < 2)
            return false;

        let sineAngle = this.angle();
        let y = this.amplitude() + this.amplitude() * Math.cos((point.x - points[0].x) / sineAngle);

        if (Geometry.isValueNearValue(point.y, (points[1].y + y)))
            return true;
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
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

        if (points.length == this.pointsNeeded) {
            this.drawSine();
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private frequency() {
        let points = this.cartesianPoints();
        let width = this.context.canvas.clientWidth;
        return (width / ((points[0].x - points[1].x)));
    }

    private amplitude() {
        let points = this.cartesianPoints();
        return (points[0].y - points[1].y) / 2;
    }

    private angle() {
        let width = this.context.canvas.clientWidth;
        let frequency = this.frequency();
        return width / (Math.PI * (frequency));
    }

    private drawSine() {
        let points = this.cartesianPoints();
        let amplitude = this.amplitude();
        let sineAngle = this.angle();
        let y = amplitude + amplitude * Math.cos((points[0].x) / sineAngle);
        let rightContentFrame = this.chartPanel.contentFrame.right;

        this.context.beginPath();
        this.context.moveTo(this.chartPanel.contentFrame.left, points[1].y + y);
        for (let i = 0; i < this.context.canvas.clientWidth; i++) {
            if(i < rightContentFrame ) {
                y = amplitude + amplitude * Math.cos((i - points[0].x) / sineAngle);
                this.context.lineTo(i, points[1].y + y);
            }
        }
        this.context.scxStroke(this.getDrawingTheme().line);
    }
}

Drawing.register(SineLineDrawing);
