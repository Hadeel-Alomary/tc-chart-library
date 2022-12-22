import {Drawing, DrawingDragPoint} from '../Drawing';
import {ChartPoint, IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {AbstractCurvedPathDrawing} from './AbstractCurvedPathDrawing';

export class CurveDrawing extends AbstractCurvedPathDrawing {
    static get className(): string {
        return 'curve';
    }

    get pointsNeeded(): number {
        return 2;
    }

    hitTest(point: IPoint): boolean {
        return this.curveHitTest(point);
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

        let points = this.cartesianPoints(),
            context = this.context;

        if (points.length > 1) {
            let controlPoints = this.curveControlPoints();
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.quadraticCurveTo(controlPoints.x, controlPoints.y, points[1].x, points[1].y);

            context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
            if (points.length > 2) {
                this.savePath(this.curveControlPoints());
            }
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private curveControlPoints() {
        let points = this.cartesianPoints();
        let controlPoint_x = (4 * this.headPoint().x - points[0].x - points[1].x) / 2;
        let controlPoint_y = (4 * this.headPoint().y - points[0].y - points[1].y) / 2;

        return {x: controlPoint_x, y: controlPoint_y};
    }

    private headPoint() {
        let points = this.cartesianPoints();

        let x = this.calculateHeadPointX();
        let y = (-1 / this.slope()) * (x - ((points[0].x) + points[1].x) / 2) + ((points[0].y + points[1].y) / 2);

        if (points.length > 2)
            return {x: points[2].x, y: points[2].y};
        return {x, y};
    }

    private calculateHeadPointX() {
        let points = this.cartesianPoints();
        let centerX = (points[0].x + points[1].x) / 2;
        let headPoint_x;
        if (points[0].x < points[1].x) {
            if (points[0].y > points[1].y) {
                headPoint_x = centerX + Math.sqrt(Math.pow(this.distance(), 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            } else {
                headPoint_x = centerX - Math.sqrt(Math.pow(this.distance(), 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            }
        } else {
            if (points[0].y < points[1].y) {
                headPoint_x = centerX - Math.sqrt(Math.pow(this.distance(), 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            } else {
                headPoint_x = centerX + Math.sqrt(Math.pow(this.distance(), 2) / (1 + (1 / Math.pow(this.slope(), 2))));
            }
        }
        return headPoint_x;
    }

    private distance() {
        let points = this.cartesianPoints();
        return Math.sqrt(Math.pow((points[0].x - points[1].x), 2) + Math.pow((points[0].y - points[1].y), 2)) / 6;

    }

    private slope() {
        let points = this.cartesianPoints();
        return (points[1].y - points[0].y) / (points[1].x - points[0].x);
    }

    _finishUserDrawing() {
        super._finishUserDrawing();

        let point = ChartPoint.convert({
            x: this.headPoint().x,
            y: this.headPoint().y
        }, this.createPointBehavior, this.projection);
        this.appendChartPoint(point);
    }


}

Drawing.register(CurveDrawing);
