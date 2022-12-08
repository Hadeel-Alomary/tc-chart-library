import {Drawing, DrawingDragPoint, IDrawingOptions} from '../Drawing';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {ChartPoint, IPoint} from '../../Graphics/ChartPoint';
import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';
import {Theme} from '../../Theme';
import {ThemedDrawing} from '../ThemedDrawing';


export class TimeCyclesDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string {
        return 'timeCycles';
    }

    get pointsNeeded(): number {
        return 2;
    }

    inDrawingState: boolean = true;

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        if (points.length < 2)
            return false;

        let hoverCycleCenterPoint = this.hoverCycleCenterPoint(point);
        return Geometry.isPointNearPoint(point, points) || this.isPointNearTimeCycles(point, hoverCycleCenterPoint, this.radius());
    }

    private isPointNearTimeCycles(point: IPoint, centerPoint: IPoint, radius: number | IPoint): boolean {
        let r1 = Geometry.length(centerPoint, point);
        let r2 = typeof radius === 'number' ? radius : Geometry.length(centerPoint, radius);
        if(point.y < centerPoint.y) {
            return Geometry.isValueNearValue(r1, r2);
        }
    }

    private hoverCycleCenterPoint(point: IPoint): IPoint {
        let points = this.cartesianPoints();
        let centerPoint = this.centerPoint();
        let x;
        let x_minPoint = Math.min(points[0].x,points[1].x);
        if (point.x > x_minPoint) {
            let numberOfPassedCycles = Math.floor(Math.abs((x_minPoint - point.x)) / Math.abs((points[1].x - points[0].x)));
            x = centerPoint.x + this.diameter() * numberOfPassedCycles;
        } else {
            let numberOfPassedCycles = Math.ceil(Math.abs((x_minPoint - point.x)) / Math.abs((points[1].x - points[0].x)));
            x = centerPoint.x - this.diameter() * numberOfPassedCycles;
        }

        return {
            x: x,
            y: centerPoint.y
        };
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
                    if (this._dragPoint == 1)
                        this.chartPoints[0].moveToY(magnetChartPoint.y, this.projection);
                    if (this._dragPoint == 0)
                        this.chartPoints[1].moveToY(magnetChartPoint.y, this.projection);
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
            this.drawCycles();
        }

        if (this.selected) {
            this._drawSelectionMarkers(this.getMarkerPoints());
        }
    }

    startUserDrawing() {
        super.startUserDrawing();
        this.inDrawingState = false;
    }

    private radius(): number {
        let points = this.cartesianPoints();
        return Math.abs((points[1].x - points[0].x) / 2);
    }

    private diameter(): number {
        let points = this.cartesianPoints();
        return Math.abs(points[1].x - points[0].x);
    }

    private centerPoint(): IPoint {
        let points = this.cartesianPoints();
        return {
            x: (points[0].x + points[1].x) / 2,
            y: points[0].y
        };
    }

    private getMarkerPoints(): IPoint[] {
        let markers = [this.cartesianPoints()[0]];
        if (this.inDrawingState) {
            markers.push(this.cartesianPoints()[1]);
        }
        return markers;
    }

    private drawCycles(): void {
        let points = this.cartesianPoints();
        let radius = this.radius();
        let diameter = this.diameter();
        for (let i = 0; i <= this.context.canvas.clientWidth; i++) {
            this.drawRightCycle(i, points, radius, diameter);
            this.drawLeftCycle(i, points, radius);
        }
    }

    private drawRightCycle(i: number, points: IPoint[], radius: number, diameter: number): void {
        let lastPoint = ((points[0].x + points[1].x) / 2) + 2 * radius * (i) - diameter;
        if (lastPoint < this.chartPanel.contentFrame.right) {
            this.context.beginPath();
            this.context.arc(((points[0].x + points[1].x) / 2) + 2 * radius * (i), points[0].y, radius, Math.PI, 0);
            this.context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
        }
    }

    private drawLeftCycle(i: number, points: IPoint[], radius: number): void {
        let firstPoint = ((points[0].x + points[1].x) / 2) - 2 * radius * (i);
        if (firstPoint > this.chartPanel.contentFrame.left) {
            this.context.beginPath();
            this.context.arc(((points[0].x + points[1].x) / 2) - 2 * radius * (i + 1), points[0].y, radius, Math.PI, 0);
            this.context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
        }
    }

    _finishUserDrawing() {
        super._finishUserDrawing();
        this.inDrawingState = true;
        this.chartPoints[1].moveToPoint({x: this.cartesianPoints()[1].x, y: this.cartesianPoints()[0].y}, this.projection);
    }


}

Drawing.register(TimeCyclesDrawing);
