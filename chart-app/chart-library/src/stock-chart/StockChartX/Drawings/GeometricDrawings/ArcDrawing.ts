import {Drawing, DrawingDragPoint} from '../Drawing';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {AbstractCurvedPathDrawing} from './AbstractCurvedPathDrawing';


export class ArcDrawing extends AbstractCurvedPathDrawing {
    static get className(): string {
        return 'arc';
    }

    private distanceBeforeRotate: number = 0;
    private rotateState: boolean = false;

    get pointsNeeded(): number {
        return 3;
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
                        this.distanceBeforeRotate = this.distance();
                        this.rotateState = i < 2;
                        return true;
                    }
                }

                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    this.setHeadPoint();
                    return true;
                }
                break;

            case GestureState.FINISHED:
                if (this._dragPoint) {
                    this._setDragPoint(DrawingDragPoint.NONE);
                    this.setHeadPoint();
                    this.rotateState = false;
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
            context.beginPath();

            if (points.length > 2) {
                let controlPoints = this.curveControlPoint();
                context.moveTo(points[0].x, points[0].y);
                context.quadraticCurveTo(controlPoints.x, controlPoints.y, points[1].x, points[1].y);
                // change point[2] to be on the head for the selection marker
                let headPoint = this.curveHeadPoint();
                points[2] = {x: headPoint.x, y: headPoint.y};
            } else {
                context.moveTo(points[0].x, points[0].y);
                context.lineTo(points[1].x, points[1].y);
            }

            context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
            if (points.length > 2) {
                this.savePath(this.curveControlPoint());
            }
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private curveControlPoint() {
        let points = this.cartesianPoints();
        let controlPointX, controlPointY;
        // this condition will draw the Arc when points[1].y = points[0].y , otherwise it will not draw anything in this case .
        if (points[1].y == points[0].y) {
            controlPointX = (points[0].x + points[1].x) / 2;
            controlPointY = 2 * points[2].y - points[0].y;
        } else {
            controlPointX = (4 * this.curveHeadPoint().x - points[0].x - points[1].x) / 2;
            controlPointY = (4 * this.curveHeadPoint().y - points[0].y - points[1].y) / 2;
        }

        return {x: controlPointX, y: controlPointY};
    }

    private curveHeadPoint() {
        let points = this.cartesianPoints();
        let lineEquation = this.lineEquation();
        let headPointX, headPointY;

        // this condition will draw the Arc when points[1].y = points[0].y , otherwise it will not draw anything in this case (Because it is exceptional)
        if (points[1].y == points[0].y) {
            headPointX = (points[0].x + points[1].x) / 2;
            headPointY = points[2].y;
        } else {
            headPointX = (lineEquation > 0) ? this.calculateHeadPointX(true) : this.calculateHeadPointX(false);
            headPointY = (-1 / this.slope()) * (headPointX - ((points[0].x) + points[1].x) / 2) + ((points[0].y + points[1].y) / 2);
        }

        return {x: headPointX, y: headPointY};
    }

    private calculateHeadPointX(pointAboveLine: boolean): number {
        let points = this.cartesianPoints();
        let tendToTheTop = (points[0].x + points[1].x) / 2 + Math.sqrt((Math.pow(this.distance(), 2) / (1 + (1 / (Math.pow(this.slope(), 2))))));
        let tendToTheBottom = ((points[0].x + points[1].x) / 2) - Math.sqrt((Math.pow(this.distance(), 2) / (1 + (1 / (Math.pow(this.slope(), 2))))));
        let headPointX;
        if (pointAboveLine) {
            headPointX = ((points[0].x < points[1].x && points[0].y < points[1].y) || (points[0].x > points[1].x && points[0].y > points[1].y)) ? tendToTheTop : tendToTheBottom;
        } else {
            headPointX = ((points[0].x < points[1].x && points[0].y < points[1].y) || (points[0].x > points[1].x && points[0].y > points[1].y)) ? tendToTheBottom : tendToTheTop;
        }
        return headPointX;
    }

    private distance() {
        let A = this.slope();
        let B = -1;
        return this.rotateState ? this.distanceBeforeRotate : Math.abs((this.lineEquation()) / Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2)));
    }

    private slope() {
        let points = this.cartesianPoints();
        return (points[1].y - points[0].y) / (points[1].x - points[0].x);
    }

    private lineEquation() {
        let points = this.cartesianPoints();
        let A = this.slope();
        let B = -1;
        let C = points[0].y - (this.slope() * points[0].x);
        return A * points[2].x + B * points[2].y + C;
    }

    private setHeadPoint() {
        this.chartPoints[2].moveToPoint(this.curveHeadPoint(), this.projection);
    }

    _finishUserDrawing() {
        super._finishUserDrawing();
        this.setHeadPoint();
    }

    canControlPointsBeManuallyChanged(): boolean {
        return false;
    }


}

Drawing.register(ArcDrawing);
