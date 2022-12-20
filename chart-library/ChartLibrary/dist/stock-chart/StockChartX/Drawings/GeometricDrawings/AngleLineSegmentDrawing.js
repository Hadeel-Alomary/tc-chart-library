var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { LineSegmentDrawing } from "./LineSegmentDrawing";
import { Drawing } from "../Drawing";
import { DrawingCalculationUtil } from "../../Utils/DrawingCalculationUtil";
import { LineStyle } from "../../Theme";
import { GestureState } from "../../Gestures/Gesture";
import { Geometry } from "../../Graphics/Geometry";
var AngleLineSegmentDrawing = (function (_super) {
    __extends(AngleLineSegmentDrawing, _super);
    function AngleLineSegmentDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._angleLineTheme = {
            width: 1,
            lineStyle: LineStyle.DASH,
            strokeColor: "#555"
        };
        _this._angleLineTextTheme = {
            fontFamily: 'Arial',
            fontSize: 14,
            fontStyle: "normal",
            fillColor: "#333",
            fontWeight: "bold"
        };
        return _this;
    }
    Object.defineProperty(AngleLineSegmentDrawing, "className", {
        get: function () {
            return 'angleLineSegment';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngleLineSegmentDrawing.prototype, "angleLineTheme", {
        get: function () {
            this._angleLineTheme.width = this.getDrawingTheme().line.width;
            this._angleLineTheme.strokeColor = this.getDrawingTheme().line.strokeColor;
            return this._angleLineTheme;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngleLineSegmentDrawing.prototype, "angleLineTextTheme", {
        get: function () {
            this._angleLineTextTheme.fillColor = this.getDrawingTheme().line.strokeColor;
            return this._angleLineTextTheme;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngleLineSegmentDrawing.prototype, "basicRadius", {
        get: function () {
            return 50;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngleLineSegmentDrawing.prototype, "angle", {
        get: function () {
            return this._options.angle;
        },
        set: function (value) {
            this._options.angle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngleLineSegmentDrawing.prototype, "distance", {
        get: function () {
            return this._options.distance;
        },
        set: function (value) {
            this._options.distance = value;
        },
        enumerable: true,
        configurable: true
    });
    AngleLineSegmentDrawing.prototype.draw = function () {
        if (!this.visible) {
            return;
        }
        var points = this.cartesianPoints();
        if (this.pointsNeeded == points.length) {
            this.keepOnCurrentAngle(points);
            this.drawBasicTrendLine(points[0], points[1]);
            this.drawAngle(points[0]);
            this.fillDegreeText(points[0]);
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    AngleLineSegmentDrawing.prototype.onMoveChartPointInUserDrawingState = function () {
        _super.prototype.onMoveChartPointInUserDrawingState.call(this);
        var allChartPointsAdded = this.chartPoints.length == this.pointsNeeded;
        if (allChartPointsAdded) {
            this.compute();
        }
    };
    AngleLineSegmentDrawing.prototype._handlePanGesture = function (gesture, event) {
        var points = this.cartesianPoints();
        switch (gesture.state) {
            case GestureState.STARTED:
                for (var i = 0; i < points.length; i++) {
                    if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                        this._setDragPoint(i);
                        return true;
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    this.compute();
                    return true;
                }
                break;
        }
        return false;
    };
    AngleLineSegmentDrawing.prototype.keepOnCurrentAngle = function (points) {
        var newAnglePoint = DrawingCalculationUtil.calculatePointFromAngleAndPoint(this.angle, points[0], this.distance);
        var lastAnglePoint = points[1];
        var shouldChangePoint = newAnglePoint.x != lastAnglePoint.x || newAnglePoint.y != lastAnglePoint.y;
        if (shouldChangePoint) {
            this.chartPoints[1].moveToPoint(newAnglePoint, this.projection);
            this.chartPanel.setNeedsUpdate();
        }
    };
    AngleLineSegmentDrawing.prototype.compute = function () {
        var points = this.cartesianPoints();
        this.distance = DrawingCalculationUtil.calculateDistanceBetweenTwoPoints(points[0], points[1]);
        this.angle = DrawingCalculationUtil.calculateAngleBetweenTwoPointsInRadians(points[0], points[1]);
    };
    AngleLineSegmentDrawing.prototype.drawBasicTrendLine = function (point1, point2) {
        this.context.beginPath();
        this.context.moveTo(point1.x, point1.y);
        this.context.lineTo(point2.x, point2.y);
        this.context.scxStroke(this.getDrawingTheme().line);
    };
    AngleLineSegmentDrawing.prototype.drawAngle = function (point) {
        this.context.beginPath();
        this.context.moveTo(point.x, point.y);
        if (0 <= this.angle) {
            var x = point.x + (this.basicRadius * Math.cos(this.angle));
            var y = point.y - (this.basicRadius * Math.sin(this.angle));
            this.context.moveTo(x, y);
            this.context.arc(point.x, point.y, this.basicRadius, -this.angle, 0);
            this.context.moveTo(point.x, point.y);
            this.context.lineTo(point.x + this.basicRadius, point.y);
        }
        else {
            this.context.arc(point.x, point.y, this.basicRadius, 0, -this.angle);
        }
        this.context.scxStroke(this.angleLineTheme);
    };
    AngleLineSegmentDrawing.prototype.fillDegreeText = function (point) {
        var degrees = DrawingCalculationUtil.convertRadianToDegree(this.angle);
        var halfDegree = degrees / 2;
        var x = point.x + (this.basicRadius * Math.cos(DrawingCalculationUtil.convertDegreeToRadian(halfDegree)));
        var y = point.y - (this.basicRadius * Math.sin(DrawingCalculationUtil.convertDegreeToRadian(halfDegree)));
        x += 10;
        if (degrees < 0) {
            y += 10;
        }
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.scxApplyTextTheme(this.angleLineTextTheme);
        this.context.fillText(Math.round(degrees) + "°", x, y);
    };
    return AngleLineSegmentDrawing;
}(LineSegmentDrawing));
export { AngleLineSegmentDrawing };
Drawing.register(AngleLineSegmentDrawing);
//# sourceMappingURL=AngleLineSegmentDrawing.js.map