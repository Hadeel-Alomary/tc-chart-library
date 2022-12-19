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
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { AbstractCurvedPathDrawing } from './AbstractCurvedPathDrawing';
var ArcDrawing = (function (_super) {
    __extends(ArcDrawing, _super);
    function ArcDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.distanceBeforeRotate = 0;
        _this.rotateState = false;
        return _this;
    }
    Object.defineProperty(ArcDrawing, "className", {
        get: function () {
            return 'arc';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArcDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 3;
        },
        enumerable: false,
        configurable: true
    });
    ArcDrawing.prototype.hitTest = function (point) {
        return this.curveHitTest(point);
    };
    ArcDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var points = this.cartesianPoints();
                for (var i = 0; i < points.length; i++) {
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
                    var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
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
    };
    ArcDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints(), context = this.context;
        if (points.length > 1) {
            context.beginPath();
            if (points.length > 2) {
                var controlPoints = this.curveControlPoint();
                context.moveTo(points[0].x, points[0].y);
                context.quadraticCurveTo(controlPoints.x, controlPoints.y, points[1].x, points[1].y);
                var headPoint = this.curveHeadPoint();
                points[2] = { x: headPoint.x, y: headPoint.y };
            }
            else {
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
    };
    ArcDrawing.prototype.curveControlPoint = function () {
        var points = this.cartesianPoints();
        var controlPointX, controlPointY;
        if (points[1].y == points[0].y) {
            controlPointX = (points[0].x + points[1].x) / 2;
            controlPointY = 2 * points[2].y - points[0].y;
        }
        else {
            controlPointX = (4 * this.curveHeadPoint().x - points[0].x - points[1].x) / 2;
            controlPointY = (4 * this.curveHeadPoint().y - points[0].y - points[1].y) / 2;
        }
        return { x: controlPointX, y: controlPointY };
    };
    ArcDrawing.prototype.curveHeadPoint = function () {
        var points = this.cartesianPoints();
        var lineEquation = this.lineEquation();
        var headPointX, headPointY;
        if (points[1].y == points[0].y) {
            headPointX = (points[0].x + points[1].x) / 2;
            headPointY = points[2].y;
        }
        else {
            headPointX = (lineEquation > 0) ? this.calculateHeadPointX(true) : this.calculateHeadPointX(false);
            headPointY = (-1 / this.slope()) * (headPointX - ((points[0].x) + points[1].x) / 2) + ((points[0].y + points[1].y) / 2);
        }
        return { x: headPointX, y: headPointY };
    };
    ArcDrawing.prototype.calculateHeadPointX = function (pointAboveLine) {
        var points = this.cartesianPoints();
        var tendToTheTop = (points[0].x + points[1].x) / 2 + Math.sqrt((Math.pow(this.distance(), 2) / (1 + (1 / (Math.pow(this.slope(), 2))))));
        var tendToTheBottom = ((points[0].x + points[1].x) / 2) - Math.sqrt((Math.pow(this.distance(), 2) / (1 + (1 / (Math.pow(this.slope(), 2))))));
        var headPointX;
        if (pointAboveLine) {
            headPointX = ((points[0].x < points[1].x && points[0].y < points[1].y) || (points[0].x > points[1].x && points[0].y > points[1].y)) ? tendToTheTop : tendToTheBottom;
        }
        else {
            headPointX = ((points[0].x < points[1].x && points[0].y < points[1].y) || (points[0].x > points[1].x && points[0].y > points[1].y)) ? tendToTheBottom : tendToTheTop;
        }
        return headPointX;
    };
    ArcDrawing.prototype.distance = function () {
        var A = this.slope();
        var B = -1;
        return this.rotateState ? this.distanceBeforeRotate : Math.abs((this.lineEquation()) / Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2)));
    };
    ArcDrawing.prototype.slope = function () {
        var points = this.cartesianPoints();
        return (points[1].y - points[0].y) / (points[1].x - points[0].x);
    };
    ArcDrawing.prototype.lineEquation = function () {
        var points = this.cartesianPoints();
        var A = this.slope();
        var B = -1;
        var C = points[0].y - (this.slope() * points[0].x);
        return A * points[2].x + B * points[2].y + C;
    };
    ArcDrawing.prototype.setHeadPoint = function () {
        this.chartPoints[2].moveToPoint(this.curveHeadPoint(), this.projection);
    };
    ArcDrawing.prototype._finishUserDrawing = function () {
        _super.prototype._finishUserDrawing.call(this);
        this.setHeadPoint();
    };
    ArcDrawing.prototype.canControlPointsBeManuallyChanged = function () {
        return false;
    };
    return ArcDrawing;
}(AbstractCurvedPathDrawing));
export { ArcDrawing };
Drawing.register(ArcDrawing);
//# sourceMappingURL=ArcDrawing.js.map