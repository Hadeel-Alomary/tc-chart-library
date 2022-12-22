import {Drawing, DrawingDragPoint} from '../Drawing';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {CyclicLinesDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export class CyclicLinesDrawing extends ThemedDrawing<CyclicLinesDrawingTheme> {
    static get className(): string {
        return 'cyclicLines';
    }

    get pointsNeeded(): number {
        return 2;
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        if (points.length < 2)
            return false;

        if (Geometry.isPointNearLine(point, points[0], points[1]) || this.isNearLines(point))
            return true;
    }

    private isNearLines(point: IPoint) {
        let points = this.cartesianPoints();
        let x;
        if (points[0].x > points[1].x) {
            x = points[0].x - this.distance() * Math.ceil(Math.abs((points[0].x - point.x)) / Math.abs((points[1].x - points[0].x)));
        } else {
            x = points[0].x + this.distance() * Math.floor(Math.abs((points[0].x - point.x)) / Math.abs((points[1].x - points[0].x)));
        }
        let point1 = {x: x, y: this.chartPanel.contentFrame.top},
            point2 = {x: x, y: this.chartPanel.contentFrame.bottom};

        if (Geometry.isPointNearLine(point, point1, point2))
            return true;
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
            if (this.ThereIsADistanceBetweenTheTwoPoints()) {
                this.drawLines();
                this.drawDashedLine();
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private distance() {
        let points = this.cartesianPoints();
        return Math.abs(points[0].x - points[1].x);
    }

    private ThereIsADistanceBetweenTheTwoPoints() {
        return this.distance() > 1;
    }

    private drawDashedLine() {
        let points = this.cartesianPoints();
        this.context.beginPath();
        this.context.moveTo(points[0].x, points[0].y);
        this.context.lineTo(points[1].x, points[1].y);
        this.context.scxStroke(this.getDrawingTheme().dashedLine);
    }

    private drawLines() {
        let points = this.cartesianPoints();

        if (points[0].x > points[1].x) {
            this.drawLeftLines();
        } else if (points[0].x < points[1].x) {
            this.drawRightLines();
        }
    }

    private drawLeftLines() {
        let dimension = 0,
            frame = this.chartPanel.contentFrame,
            points = this.cartesianPoints(),
            distance = this.distance();

        this.context.beginPath();
        for (let i = 0; i < this.context.canvas.clientWidth; i++) {
            if(points [0].x - dimension > this.chartPanel.contentFrame.left) {
                this.context.moveTo(points [0].x - dimension, frame.top);
                this.context.lineTo(points [0].x - dimension, frame.bottom);
            }
            dimension = dimension +  distance;
        }
        this.context.scxStroke(this.getDrawingTheme().line);
    }

    private drawRightLines() {
        let dimension = 0,
            frame = this.chartPanel.contentFrame,
            points = this.cartesianPoints(),
            distance = this.distance();

        this.context.beginPath();
        for (let i = 0; i < this.context.canvas.clientWidth; i++) {
            if(points[0].x + dimension < this.chartPanel.contentFrame.right) {
                this.context.moveTo(points[0].x + dimension, frame.top);
                this.context.lineTo(points[0].x + dimension, frame.bottom);
            }
            dimension = dimension + distance;
        }
        this.context.scxStroke(this.getDrawingTheme().line);
    }

}

Drawing.register(CyclicLinesDrawing);
