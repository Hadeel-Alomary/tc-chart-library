var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Drawing, DrawingDragPoint } from '../Drawing';
import { TextBase } from './TextBase';
import { GestureState } from '../../Gestures/Gesture';
import { Geometry } from '../../Graphics/Geometry';
import { DummyCanvasContext } from '../../Utils/DummyCanvasContext';
var CalloutDrawing = (function (_super) {
    __extends(CalloutDrawing, _super);
    function CalloutDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._draggedWrappingPoint = null;
        _this.callout = new Callout();
        return _this;
    }
    Object.defineProperty(CalloutDrawing, "className", {
        get: function () {
            return 'callout';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CalloutDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    CalloutDrawing.prototype.bounds = function () {
        var textBounds = this.textBounds();
        var paddingRight = 20;
        var paddingLeft = 10;
        return {
            left: textBounds.left - paddingLeft,
            top: textBounds.top - paddingLeft,
            width: textBounds.width + paddingRight,
            height: textBounds.height + paddingRight
        };
    };
    CalloutDrawing.prototype.textBounds = function () {
        var headPoint = this.cartesianPoints()[1];
        return {
            left: headPoint.x - (this.textWidth() / 2),
            top: headPoint.y - (this.lineHeight() / 2) * this.lineLength(),
            width: this.textWidth(),
            height: this.lineHeight() * this.lineLength()
        };
    };
    CalloutDrawing.prototype.lineHeight = function () {
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        return DummyCanvasContext.measureText(this.lines[0], this.getDrawingTheme().text).height;
    };
    CalloutDrawing.prototype.textWidth = function () {
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        if (this.getDrawingTheme().text.textWrapEnabled) {
            return this.textWrapWidth;
        }
        else {
            return this.getLongestLineSize().width;
        }
    };
    CalloutDrawing.prototype.lineLength = function () {
        if (this.getDrawingTheme().text.textWrapEnabled) {
            return this.getWrappedLines().length;
        }
        else {
            return this.lines.length;
        }
    };
    CalloutDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return points.length > 1 && Geometry.isPointNearPoint(point, points[0]) || Geometry.isPointInsideOrNearRect(point, this.bounds());
    };
    CalloutDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var rightPoint = this.rightCenterBorderPoint();
                if (Geometry.isPointNearPoint(event.pointerPosition, rightPoint)) {
                    this._draggedWrappingPoint = rightPoint;
                }
                else {
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
                    var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    return true;
                }
                if (this._draggedWrappingPoint != null) {
                    var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
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
    };
    CalloutDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var lines = this.lines;
        if (lines.length === 0)
            return;
        var points = this.cartesianPoints();
        if (points.length > 1) {
            this.checkTailDirection();
            this.drawCallout();
            this.drawText();
        }
        if (this.selected)
            this._drawSelectionMarkers(this.getMarkerPoints());
    };
    CalloutDrawing.prototype.drawCallout = function () {
        var context = this.context;
        var callout = this.callout;
        var radius = 8;
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
        if (this.getDrawingTheme().text.textBackgroundEnabled) {
            this.context.scxFill(this.getDrawingTheme().fill);
        }
        if (this.getDrawingTheme().text.textBorderEnabled) {
            this.context.scxStroke(this.getDrawingTheme().borderLine);
        }
    };
    CalloutDrawing.prototype.checkTailDirection = function () {
        this.tailInBottom();
        this.tailInTop();
        this.tailInSide();
    };
    CalloutDrawing.prototype.tailInBottom = function () {
        var points = this.cartesianPoints();
        if (points[0].y >= points[1].y + (this.bounds().height / 2)) {
            this.tailInCenterBottom();
            if (points[0].x >= points[1].x + (this.bounds().width / 2)) {
                this.tailInRightBottom();
            }
            if (points[0].x <= points[1].x - (this.bounds().width / 2)) {
                this.tailInLeftBottom();
            }
        }
    };
    CalloutDrawing.prototype.tailInCenterBottom = function () {
        var points = this.cartesianPoints();
        var callout = this.callout;
        var radius = 8;
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
    };
    CalloutDrawing.prototype.tailInRightBottom = function () {
        var points = this.cartesianPoints();
        var callout = this.callout;
        var radius = 8;
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
    };
    CalloutDrawing.prototype.tailInLeftBottom = function () {
        var points = this.cartesianPoints();
        var callout = this.callout;
        var radius = 8;
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
    };
    CalloutDrawing.prototype.tailInTop = function () {
        var points = this.cartesianPoints();
        if (points[0].y < points[1].y + (this.bounds().height / 2)) {
            this.tailInCenterTop();
            if (points[0].x >= points[1].x + (this.bounds().width / 2)) {
                this.tailInRightTop();
            }
            if (points[0].x <= points[1].x - (this.bounds().width / 2)) {
                this.tailInLeftTop();
            }
        }
    };
    CalloutDrawing.prototype.tailInCenterTop = function () {
        var points = this.cartesianPoints();
        var callout = this.callout;
        var radius = 8;
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
    };
    CalloutDrawing.prototype.tailInRightTop = function () {
        var points = this.cartesianPoints();
        var callout = this.callout;
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
    };
    CalloutDrawing.prototype.tailInLeftTop = function () {
        var points = this.cartesianPoints();
        var callout = this.callout;
        var radius = 8;
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
    };
    CalloutDrawing.prototype.tailInSide = function () {
        var points = this.cartesianPoints();
        if (points[0].y < points[1].y + (this.bounds().height / 2) && points[0].y > points[1].y - (this.bounds().height / 2)) {
            this.noTail();
            if (points[0].x >= points[1].x + (this.bounds().width / 2)) {
                this.tailInSideRight();
            }
            if (points[0].x <= points[1].x - (this.bounds().width / 2)) {
                this.tailInSideLeft();
            }
        }
    };
    CalloutDrawing.prototype.noTail = function () {
        var points = this.cartesianPoints();
        var callout = this.callout;
        var radius = 8;
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
    };
    CalloutDrawing.prototype.tailInSideRight = function () {
        var points = this.cartesianPoints();
        var callout = this.callout;
        var radius = 8;
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
    };
    CalloutDrawing.prototype.tailInSideLeft = function () {
        var points = this.cartesianPoints();
        var callout = this.callout;
        var radius = 8;
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
    };
    CalloutDrawing.prototype.drawText = function () {
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        var textHeight = this.cartesianPoints()[1].y - (this.bounds().height / 2) + 10;
        for (var _i = 0, _a = this.getLines(); _i < _a.length; _i++) {
            var line = _a[_i];
            this.context.fillText(line, this.xByTextDirection(), textHeight);
            textHeight += this.lineHeight();
        }
    };
    CalloutDrawing.prototype.xByTextDirection = function () {
        var point = this.cartesianPoint(1);
        var x;
        this.context.scxApplyTextTheme(this.getDrawingTheme().text);
        var width = this.textWidth();
        if (this.context.textAlign == 'right') {
            x = point.x + width / 2;
        }
        else if (this.context.textAlign == 'left') {
            x = point.x - width / 2;
        }
        else {
            x = point.x;
        }
        return x;
    };
    CalloutDrawing.prototype.rightCenterBorderPoint = function () {
        var point = this.cartesianPoint(1);
        var rect = this.bounds();
        return {
            x: point.x + rect.width / 2,
            y: point.y
        };
    };
    CalloutDrawing.prototype.getMarkerPoints = function () {
        var markers = [this.cartesianPoints()[0]];
        if (this.getDrawingTheme().text.textWrapEnabled) {
            markers.push(this.rightCenterBorderPoint());
        }
        return markers;
    };
    return CalloutDrawing;
}(TextBase));
export { CalloutDrawing };
Drawing.register(CalloutDrawing);
var Callout = (function () {
    function Callout() {
    }
    return Callout;
}());
//# sourceMappingURL=CalloutDrawing.js.map