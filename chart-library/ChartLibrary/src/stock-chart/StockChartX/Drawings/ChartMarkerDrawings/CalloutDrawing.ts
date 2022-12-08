import {Drawing, DrawingDragPoint} from '../Drawing';
import {TextBase} from './TextBase';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {Geometry} from '../../Graphics/Geometry';
import {ChartPoint, IPoint} from '../../Graphics/ChartPoint';
import {DummyCanvasContext} from '../../Utils/DummyCanvasContext';
import {IRect} from '../../Graphics/Rect';
import {ITextTheme} from '../../Theme';


export class CalloutDrawing extends TextBase {

    private _draggedWrappingPoint:IPoint = null;

    static get className(): string {
        return 'callout';
    }

    get pointsNeeded(): number {
        return 2;
    }

    callout = new Callout();

    bounds(): IRect {
        let textBounds = this.textBounds();
        let paddingRight = 20;
        let paddingLeft = 10;
        return {
            left: textBounds.left - paddingLeft,
            top: textBounds.top - paddingLeft,
            width: textBounds.width + paddingRight,
            height: textBounds.height + paddingRight
        };
    }

    textBounds() {
        let headPoint = this.cartesianPoints()[1];
        return {
            left: headPoint.x - (this.textWidth() / 2),
            top: headPoint.y - (this.lineHeight() / 2) * this.lineLength(),
            width: this.textWidth(),
            height: this.lineHeight() * this.lineLength()
        };
    }

    lineHeight() {
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        return DummyCanvasContext.measureText(this.lines[0], this.getDrawingTheme().text as ITextTheme).height;
    }

    textWidth() {
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        if (this.getDrawingTheme().text.textWrapEnabled) {
            return this.textWrapWidth;
        } else {
            return this.getLongestLineSize().width;
        }
    }

    lineLength() {
        if (this.getDrawingTheme().text.textWrapEnabled) {
            return this.getWrappedLines().length;
        } else {
            return this.lines.length;
        }
    }

    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();

        return points.length > 1 && Geometry.isPointNearPoint(point, points[0]) || Geometry.isPointInsideOrNearRect(point, this.bounds());
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                let rightPoint:IPoint = this.rightCenterBorderPoint();
                if(Geometry.isPointNearPoint(event.pointerPosition, rightPoint)) {
                    this._draggedWrappingPoint = rightPoint;
                } else {
                    if (Geometry.isPointInsideOrNearRect(event.pointerPosition, this.bounds()))
                        this._setDragPoint(1);
                    else if (Geometry.isPointNearPoint(this.cartesianPoint(0), event.pointerPosition))
                        this._setDragPoint(0);
                    else
                        return false;
                }
                return true;
            case GestureState.CONTINUED:
                if (this._dragPoint !== DrawingDragPoint.NONE) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    return true;
                }
                if(this._draggedWrappingPoint != null) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.textWrapWidth = this.textWrapWidth + (magnetChartPoint.x - this.rightCenterBorderPoint().x);
                    if (this.textWrapWidth <= 120) {
                        this.textWrapWidth = 120;
                    }
                    return true;
                }

                break;
            case GestureState.FINISHED:
                this._draggedWrappingPoint = null;
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

        let lines = this.lines;
        if (lines.length === 0) return;

        let points = this.cartesianPoints();

        if (points.length > 1) {

            this.checkTailDirection();
            this.drawCallout();
            this.drawText();
        }

        if (this.selected)
            this._drawSelectionMarkers(this.getMarkerPoints());
    }

    // draw Shape
    private drawCallout() {
        let context = this.context;
        let callout = this.callout;
        let radius = 8;
        context.beginPath();
        context.moveTo(callout.X_topLeft, callout.Y_topLeft);
        context.lineTo(callout.X_topRight, callout.Y_topRight);
        context.arcTo(callout.X_angleTopRight, callout.Y_angleTopRight, callout.X_centerRightTop, callout.Y_centerRightTop, radius);
        context.lineTo(callout.X_centerRightBottom, callout.Y_centerRightBottom);
        context.arcTo(callout.X_angleBottomRight, callout.Y_angleBottomRight, callout.X_bottomRight, callout.Y_bottomRight, radius);
        context.lineTo(callout.X_bottomCenterRight, callout.Y_bottomCenterRight);
        context.lineTo(callout.X_tailPoint, callout.Y_tailPoint);
        context.lineTo(callout.X_bottomCenterLeft, callout.Y_bottomCenterLeft);
        context.lineTo(callout.X_bottomLeft, callout.Y_bottomLeft);
        context.arcTo(callout.X_angleBottomLeft, callout.Y_angleBottomLeft, callout.X_leftBottom, callout.Y_leftBottom, radius);
        context.lineTo(callout.X_leftTop, callout.Y_leftTop);
        context.arcTo(callout.X_angleTopLeft, callout.Y_angleTopLeft, callout.X_topLeft, callout.Y_topLeft, radius);
        context.closePath();
        if(this.getDrawingTheme().text.textBackgroundEnabled) {
            this.context.scxFill(this.getDrawingTheme().fill);
        }
        if(this.getDrawingTheme().text.textBorderEnabled) {
            this.context.scxStroke(this.getDrawingTheme().borderLine);
        }

    }

    // tail Position
    private checkTailDirection() {
        this.tailInBottom();
        this.tailInTop();
        this.tailInSide();
    }

    // tail in bottom
    private tailInBottom() {
        let points = this.cartesianPoints();

        if (points[0].y >= points[1].y + (this.bounds().height / 2)) {
            this.tailInCenterBottom();
            if (points[0].x >= points[1].x + (this.bounds().width / 2)) {
                this.tailInRightBottom();
            }
            if (points[0].x <= points[1].x - (this.bounds().width / 2)) {
                this.tailInLeftBottom();
            }
        }
    }

    private tailInCenterBottom() {
        let points = this.cartesianPoints();
        let callout = this.callout;
        let radius = 8;

        callout.X_topLeft = points[1].x - (this.bounds().width / 2) + radius;
        callout.Y_topLeft = points[1].y - (this.bounds().height / 2);
        callout.X_topRight = points[1].x + (this.bounds().width / 2) - radius;
        callout.Y_topRight = callout.Y_topLeft;
        callout.X_angleTopRight = points[1].x + (this.bounds().width / 2);
        callout.Y_angleTopRight = callout.Y_topLeft;
        callout.X_centerRightTop = callout.X_angleTopRight;
        callout.Y_centerRightTop = callout.Y_topLeft + radius;
        callout.X_centerRightBottom = callout.X_centerRightTop;
        callout.Y_centerRightBottom = callout.Y_topLeft + this.bounds().height - radius;
        callout.X_angleBottomRight = callout.X_centerRightTop;
        callout.Y_angleBottomRight = callout.Y_angleTopRight + this.bounds().height;
        callout.X_bottomRight = callout.X_topRight;
        callout.Y_bottomRight = callout.Y_angleBottomRight;
        callout.X_bottomCenterRight = points[1].x + 7.5;
        callout.Y_bottomCenterRight = callout.Y_angleBottomRight;
        callout.X_tailPoint = points[0].x;
        callout.Y_tailPoint = points[0].y;
        callout.X_bottomCenterLeft = points[1].x - 7.5;
        callout.Y_bottomCenterLeft = callout.Y_angleBottomRight;
        callout.X_bottomLeft = callout.X_topLeft;
        callout.Y_bottomLeft = callout.Y_angleBottomRight;
        callout.X_angleBottomLeft = points[1].x - (this.bounds().width / 2);
        callout.Y_angleBottomLeft = callout.Y_angleBottomRight;
        callout.X_leftBottom = callout.X_angleBottomLeft;
        callout.Y_leftBottom = callout.Y_angleBottomLeft - radius;
        callout.X_leftTop = callout.X_angleBottomLeft;
        callout.Y_leftTop = callout.Y_angleBottomLeft - this.bounds().height + radius;
        callout.X_angleTopLeft = callout.X_angleBottomLeft;
        callout.Y_angleTopLeft = callout.Y_angleBottomLeft - this.bounds().height;

    }

    private tailInRightBottom() {
        let points = this.cartesianPoints();
        let callout = this.callout;
        let radius = 8;

        callout.X_topLeft = points[1].x - (this.bounds().width / 2);
        callout.Y_topLeft = points[1].y + (this.bounds().height / 2) - radius;
        callout.X_topRight = callout.X_topLeft;
        callout.Y_topRight = points[1].y - (this.bounds().height / 2) + radius;
        callout.X_angleTopRight = callout.X_topLeft;
        callout.Y_angleTopRight = points[1].y - (this.bounds().height / 2);
        callout.X_centerRightTop = callout.X_angleTopRight + radius;
        callout.Y_centerRightTop = callout.Y_angleTopRight;
        callout.X_centerRightBottom = callout.X_angleTopRight + this.bounds().width - radius;
        callout.Y_centerRightBottom = callout.Y_angleTopRight;
        callout.X_angleBottomRight = callout.X_angleTopRight + this.bounds().width;
        callout.Y_angleBottomRight = callout.Y_angleTopRight;
        callout.X_bottomRight = callout.X_angleBottomRight;
        callout.Y_bottomRight = callout.Y_angleBottomRight + radius;
        callout.X_bottomCenterRight = callout.X_bottomRight;
        callout.Y_bottomCenterRight = points[1].y + (this.bounds().height / 2) - 7.5;
        callout.X_tailPoint = points[0].x;
        callout.Y_tailPoint = points[0].y;
        callout.X_bottomCenterLeft = callout.X_bottomCenterRight - 7.5;
        callout.Y_bottomCenterLeft = points[1].y + (this.bounds().height / 2);
        callout.X_bottomLeft = callout.X_bottomCenterLeft;
        callout.Y_bottomLeft = callout.Y_bottomCenterLeft;
        callout.X_angleBottomLeft = callout.X_bottomCenterLeft;
        callout.Y_angleBottomLeft = callout.Y_bottomCenterLeft;
        callout.X_leftBottom = callout.X_bottomCenterLeft;
        callout.Y_leftBottom = callout.Y_bottomCenterLeft;
        callout.X_leftTop = points[1].x - (this.bounds().width / 2) + radius;
        callout.Y_leftTop = callout.Y_bottomCenterLeft;
        callout.X_angleTopLeft = points[1].x - (this.bounds().width / 2);
        callout.Y_angleTopLeft = callout.Y_bottomCenterLeft;
    }

    private tailInLeftBottom() {
        let points = this.cartesianPoints();
        let callout = this.callout;
        let radius = 8;

        callout.X_bottomCenterRight = callout.X_topLeft;
        callout.Y_bottomCenterRight = callout.Y_angleBottomRight;
        callout.X_tailPoint = points[0].x;
        callout.Y_tailPoint = points[0].y;
        callout.X_bottomCenterLeft = points[1].x - (this.bounds().width / 2);
        callout.Y_bottomCenterLeft = callout.Y_centerRightBottom;
        callout.X_bottomLeft = callout.X_bottomCenterLeft;
        callout.Y_bottomLeft = callout.Y_bottomCenterLeft;
        callout.X_angleBottomLeft = callout.X_bottomCenterLeft;
        callout.Y_angleBottomLeft = callout.Y_bottomCenterLeft;
        callout.X_leftBottom = callout.X_bottomCenterLeft;
        callout.Y_leftBottom = callout.Y_bottomCenterLeft;
        callout.X_leftTop = callout.X_bottomCenterLeft;
        callout.Y_leftTop = callout.Y_topLeft + radius;
        callout.X_angleTopLeft = callout.X_bottomCenterLeft;
        callout.Y_angleTopLeft = callout.Y_topLeft;
    }

    // tail in top
    private tailInTop() {
        let points = this.cartesianPoints();

        if (points[0].y < points[1].y + (this.bounds().height / 2)) {
            this.tailInCenterTop();
            if (points[0].x >= points[1].x + (this.bounds().width / 2)) {
                this.tailInRightTop();
            }
            if (points[0].x <= points[1].x - (this.bounds().width / 2)) {
                this.tailInLeftTop();
            }
        }
    }

    private tailInCenterTop() {
        let points = this.cartesianPoints();
        let callout = this.callout;
        let radius = 8;

        callout.X_topLeft = points[1].x + (this.bounds().width / 2) - radius;
        callout.Y_topLeft = points[1].y + (this.bounds().height / 2);
        callout.X_topRight = points[1].x - (this.bounds().width / 2) + radius;
        callout.Y_topRight = callout.Y_topLeft;
        callout.X_angleTopRight = points[1].x - (this.bounds().width / 2);
        callout.Y_angleTopRight = callout.Y_topLeft;
        callout.X_centerRightTop = callout.X_angleTopRight;
        callout.Y_centerRightTop = callout.Y_topLeft - radius;
        callout.X_centerRightBottom = callout.X_centerRightTop;
        callout.Y_centerRightBottom = callout.Y_topLeft - this.bounds().height + radius;
        callout.X_angleBottomRight = callout.X_centerRightTop;
        callout.Y_angleBottomRight = callout.Y_angleTopRight - this.bounds().height;
        callout.X_bottomRight = callout.X_topRight;
        callout.Y_bottomRight = callout.Y_angleBottomRight;
        callout.X_bottomCenterRight = points[1].x - 7.5;
        callout.Y_bottomCenterRight = callout.Y_angleBottomRight;
        callout.X_tailPoint = points[0].x;
        callout.Y_tailPoint = points[0].y;
        callout.X_bottomCenterLeft = points[1].x + 7.5;
        callout.Y_bottomCenterLeft = callout.Y_angleBottomRight;
        callout.X_bottomLeft = callout.X_topLeft;
        callout.Y_bottomLeft = callout.Y_angleBottomRight;
        callout.X_angleBottomLeft = points[1].x + (this.bounds().width / 2);
        callout.Y_angleBottomLeft = callout.Y_angleBottomRight;
        callout.X_leftBottom = callout.X_angleBottomLeft;
        callout.Y_leftBottom = callout.Y_angleBottomLeft + radius;
        callout.X_leftTop = callout.X_angleBottomLeft;
        callout.Y_leftTop = callout.Y_angleBottomLeft + this.bounds().height - radius;
        callout.X_angleTopLeft = callout.X_angleBottomLeft;
        callout.Y_angleTopLeft = callout.Y_angleBottomLeft + this.bounds().height;

    }

    private tailInRightTop() {
        let points = this.cartesianPoints();
        let callout = this.callout;

        callout.X_bottomCenterRight = callout.X_topLeft;
        callout.Y_bottomCenterRight = callout.Y_angleBottomRight;
        callout.X_tailPoint = points[0].x;
        callout.Y_tailPoint = points[0].y;
        callout.X_bottomCenterLeft = points[1].x + (this.bounds().width / 2);
        callout.Y_bottomCenterLeft = callout.Y_centerRightBottom;
        callout.X_bottomLeft = callout.X_bottomCenterLeft;
        callout.Y_bottomLeft = callout.Y_bottomCenterLeft;
        callout.X_angleBottomLeft = callout.X_bottomCenterLeft;
        callout.Y_angleBottomLeft = callout.Y_bottomCenterLeft;
        callout.X_leftBottom = callout.X_bottomCenterLeft;
        callout.Y_leftBottom = callout.Y_bottomCenterLeft;
        callout.X_leftTop = callout.X_bottomCenterLeft;
        callout.Y_leftTop = callout.Y_centerRightTop;
        callout.X_angleTopLeft = callout.X_bottomCenterLeft;
        callout.Y_angleTopLeft = callout.Y_angleTopRight;
    }

    private tailInLeftTop() {
        let points = this.cartesianPoints();
        let callout = this.callout;
        let radius = 8;

        callout.X_topLeft = points[1].x + (this.bounds().width / 2);
        callout.Y_topLeft = points[1].y - (this.bounds().height / 2) + radius;
        callout.X_topRight = callout.X_topLeft;
        callout.Y_topRight = points[1].y + (this.bounds().height / 2) - radius;
        callout.X_angleTopRight = callout.X_topLeft;
        callout.Y_angleTopRight = points[1].y + (this.bounds().height / 2);
        callout.X_centerRightTop = callout.X_angleTopRight - radius;
        callout.Y_centerRightTop = callout.Y_angleTopRight;
        callout.X_centerRightBottom = callout.X_angleTopRight - this.bounds().width + radius;
        callout.Y_centerRightBottom = callout.Y_angleTopRight;
        callout.X_angleBottomRight = callout.X_angleTopRight - this.bounds().width;
        callout.Y_angleBottomRight = callout.Y_angleTopRight;
        callout.X_bottomRight = callout.X_angleBottomRight;
        callout.Y_bottomRight = callout.Y_angleBottomRight - radius;
        callout.X_bottomCenterRight = callout.X_angleBottomRight;
        callout.Y_bottomCenterRight = points[1].y - (this.bounds().height / 2) + radius;
        callout.X_tailPoint = points[0].x;
        callout.Y_tailPoint = points[0].y;
        callout.X_bottomCenterLeft = callout.X_centerRightBottom;
        callout.Y_bottomCenterLeft = points[1].y - (this.bounds().height / 2);
        callout.X_bottomLeft = callout.X_bottomCenterLeft;
        callout.Y_bottomLeft = callout.Y_bottomCenterLeft;
        callout.X_angleBottomLeft = callout.X_bottomCenterLeft;
        callout.Y_angleBottomLeft = callout.Y_bottomCenterLeft;
        callout.X_leftBottom = callout.X_bottomCenterLeft;
        callout.Y_leftBottom = callout.Y_bottomCenterLeft;
        callout.X_leftTop = callout.X_centerRightTop;
        callout.Y_leftTop = callout.Y_bottomCenterLeft;
        callout.X_angleTopLeft = callout.X_angleTopRight;
        callout.Y_angleTopLeft = callout.Y_bottomCenterLeft;
    }

    // tail In Side
    private tailInSide() {
        let points = this.cartesianPoints();

        if (points[0].y < points[1].y + (this.bounds().height / 2) && points[0].y > points[1].y - (this.bounds().height / 2)) {
            this.noTail();
            if (points[0].x >= points[1].x + (this.bounds().width / 2)) {
                this.tailInSideRight();
            }
            if (points[0].x <= points[1].x - (this.bounds().width / 2)) {
                this.tailInSideLeft();
            }
        }

    }

    private noTail() {
        let points = this.cartesianPoints();
        let callout = this.callout;
        let radius = 8;

        callout.X_topLeft = points[1].x - (this.bounds().width / 2);
        callout.Y_topLeft = points[1].y + (this.bounds().height / 2) - radius;
        callout.X_topRight = callout.X_topLeft;
        callout.Y_topRight = points[1].y - (this.bounds().height / 2) + radius;
        callout.X_angleTopRight = callout.X_topLeft;
        callout.Y_angleTopRight = points[1].y - (this.bounds().height / 2);
        callout.X_centerRightTop = callout.X_angleTopRight + radius;
        callout.Y_centerRightTop = callout.Y_angleTopRight;
        callout.X_centerRightBottom = callout.X_angleTopRight + this.bounds().width - radius;
        callout.Y_centerRightBottom = callout.Y_angleTopRight;
        callout.X_angleBottomRight = callout.X_angleTopRight + this.bounds().width;
        callout.Y_angleBottomRight = callout.Y_angleTopRight;
        callout.X_bottomRight = callout.X_angleBottomRight;
        callout.Y_bottomRight = callout.Y_angleBottomRight + radius;
        callout.X_bottomCenterRight = callout.X_angleBottomRight;
        callout.Y_bottomCenterRight = points[1].y + (this.bounds().height / 2) - radius;
        callout.X_tailPoint = callout.X_bottomCenterRight;
        callout.Y_tailPoint = callout.Y_bottomCenterRight;
        callout.X_bottomCenterLeft = callout.X_bottomCenterRight;
        callout.Y_bottomCenterLeft = callout.Y_bottomCenterRight;
        callout.X_bottomLeft = callout.X_bottomCenterRight;
        callout.Y_bottomLeft = callout.Y_bottomCenterRight;
        callout.X_angleBottomLeft = callout.X_angleBottomRight;
        callout.Y_angleBottomLeft = callout.Y_angleBottomRight + this.bounds().height;
        callout.X_leftBottom = callout.X_angleBottomLeft - radius;
        callout.Y_leftBottom = callout.Y_angleBottomLeft;
        callout.X_leftTop = callout.X_angleBottomLeft - this.bounds().width + radius;
        callout.Y_leftTop = callout.Y_angleBottomLeft;
        callout.X_angleTopLeft = callout.X_angleBottomLeft - this.bounds().width;
        callout.Y_angleTopLeft = callout.Y_angleBottomLeft;
    }

    private tailInSideRight() {
        let points = this.cartesianPoints();
        let callout = this.callout;
        let radius = 8;

        callout.X_topLeft = points[1].x - (this.bounds().width / 2);
        callout.Y_topLeft = points[1].y + (this.bounds().height / 2) - radius;
        callout.X_topRight = callout.X_topLeft;
        callout.Y_topRight = points[1].y - (this.bounds().height / 2) + radius;
        callout.X_angleTopRight = callout.X_topLeft;
        callout.Y_angleTopRight = points[1].y - (this.bounds().height / 2);
        callout.X_centerRightTop = callout.X_angleTopRight + radius;
        callout.Y_centerRightTop = callout.Y_angleTopRight;
        callout.X_centerRightBottom = callout.X_angleTopRight + this.bounds().width - radius;
        callout.Y_centerRightBottom = callout.Y_angleTopRight;
        callout.X_angleBottomRight = callout.X_angleTopRight + this.bounds().width;
        callout.Y_angleBottomRight = callout.Y_angleTopRight;
        callout.X_bottomRight = callout.X_angleBottomRight;
        callout.Y_bottomRight = callout.Y_angleBottomRight + radius;
        callout.X_bottomCenterRight = callout.X_angleBottomRight;
        callout.Y_bottomCenterRight = points[1].y - 7.5;
        callout.X_tailPoint = points[0].x;
        callout.Y_tailPoint = points[0].y;
        callout.X_bottomCenterLeft = callout.X_angleBottomRight;
        callout.Y_bottomCenterLeft = points[1].y + 7.5;
        callout.X_bottomLeft = callout.X_angleBottomRight;
        callout.Y_bottomLeft = callout.Y_angleBottomRight + this.bounds().height - radius;
        callout.X_angleBottomLeft = callout.X_angleBottomRight;
        callout.Y_angleBottomLeft = callout.Y_angleBottomRight + this.bounds().height;
        callout.X_leftBottom = callout.X_angleBottomLeft - radius;
        callout.Y_leftBottom = callout.Y_angleBottomLeft;
        callout.X_leftTop = callout.X_angleBottomLeft - this.bounds().width + radius;
        callout.Y_leftTop = callout.Y_angleBottomLeft;
        callout.X_angleTopLeft = callout.X_angleBottomLeft - this.bounds().width;
        callout.Y_angleTopLeft = callout.Y_angleBottomLeft;
    }

    private tailInSideLeft() {
        let points = this.cartesianPoints();
        let callout = this.callout;
        let radius = 8;

        callout.X_topLeft = points[1].x + (this.bounds().width / 2);
        callout.Y_topLeft = points[1].y - (this.bounds().height / 2) + radius;
        callout.X_topRight = callout.X_topLeft;
        callout.Y_topRight = points[1].y + (this.bounds().height / 2) - radius;
        callout.X_angleTopRight = callout.X_topLeft;
        callout.Y_angleTopRight = points[1].y + (this.bounds().height / 2);
        callout.X_centerRightTop = callout.X_angleTopRight - radius;
        callout.Y_centerRightTop = callout.Y_angleTopRight;
        callout.X_centerRightBottom = callout.X_angleTopRight - this.bounds().width + radius;
        callout.Y_centerRightBottom = callout.Y_angleTopRight;
        callout.X_angleBottomRight = callout.X_angleTopRight - this.bounds().width;
        callout.Y_angleBottomRight = callout.Y_angleTopRight;
        callout.X_bottomRight = callout.X_angleBottomRight;
        callout.Y_bottomRight = callout.Y_angleBottomRight - radius;
        callout.X_bottomCenterRight = callout.X_angleBottomRight;
        callout.Y_bottomCenterRight = points[1].y + 7.5;
        callout.X_tailPoint = points[0].x;
        callout.Y_tailPoint = points[0].y;
        callout.X_bottomCenterLeft = callout.X_angleBottomRight;
        callout.Y_bottomCenterLeft = points[1].y - 7.5;
        callout.X_bottomLeft = callout.X_angleBottomRight;
        callout.Y_bottomLeft = callout.Y_angleBottomRight - this.bounds().height + radius;
        callout.X_angleBottomLeft = callout.X_angleBottomRight;
        callout.Y_angleBottomLeft = callout.Y_angleBottomRight - this.bounds().height;
        callout.X_leftBottom = callout.X_angleBottomLeft + radius;
        callout.Y_leftBottom = callout.Y_angleBottomLeft;
        callout.X_leftTop = callout.X_angleBottomLeft + this.bounds().width - radius;
        callout.Y_leftTop = callout.Y_angleBottomLeft;
        callout.X_angleTopLeft = callout.X_angleBottomLeft + this.bounds().width;
        callout.Y_angleTopLeft = callout.Y_angleBottomLeft;
    }

    // Text
    drawText() {
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        let textHeight = this.cartesianPoints()[1].y - (this.bounds().height / 2) + 10;
        for (let line of this.getLines()) {
            this.context.fillText(line, this.xByTextDirection(), textHeight);
            textHeight += this.lineHeight();
        }
    }

    private xByTextDirection(): number {
        let point = this.cartesianPoint(1);
        let x;
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        let width = this.textWidth();
        if (this.context.textAlign == 'right') {
            x = point.x + width / 2;
        } else if (this.context.textAlign == 'left') {
            x = point.x - width / 2;
        } else {
            x = point.x;
        }
        return x;
    }

    private rightCenterBorderPoint(): IPoint {
        let point = this.cartesianPoint(1);
        let rect: IRect = this.bounds();

        return {
            x: point.x + rect.width / 2,
            y: point.y
        };

    }

    private getMarkerPoints() {
        let markers = [this.cartesianPoints()[0]];
        if (this.getDrawingTheme().text.textWrapEnabled) {
            markers.push(this.rightCenterBorderPoint());
        }
        return markers;
    }

}

Drawing.register(CalloutDrawing);

class Callout {
    X_topLeft: number;
    Y_topLeft: number;
    X_topRight: number;
    Y_topRight: number;
    X_angleTopRight: number;
    Y_angleTopRight: number;
    X_centerRightTop: number;
    Y_centerRightTop: number;
    X_centerRightBottom: number;
    Y_centerRightBottom: number;
    X_angleBottomRight: number;
    Y_angleBottomRight: number;
    X_bottomRight: number;
    Y_bottomRight: number;
    X_bottomCenterRight: number;
    Y_bottomCenterRight: number;
    X_tailPoint: number;
    Y_tailPoint: number;
    X_bottomCenterLeft: number;
    Y_bottomCenterLeft: number;
    X_bottomLeft: number;
    Y_bottomLeft: number;
    X_angleBottomLeft: number;
    Y_angleBottomLeft: number;
    X_leftBottom: number;
    Y_leftBottom: number;
    X_leftTop: number;
    Y_leftTop: number;
    X_angleTopLeft: number;
    Y_angleTopLeft: number;
}
