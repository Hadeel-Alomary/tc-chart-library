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
import { FibonacciDrawingBase } from './FibonacciDrawingBase';
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
var FibonacciSpeedResistanceArcsDrawing = (function (_super) {
    __extends(FibonacciSpeedResistanceArcsDrawing, _super);
    function FibonacciSpeedResistanceArcsDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FibonacciSpeedResistanceArcsDrawing, "className", {
        get: function () {
            return 'fibonacciSpeedResistanceArcs';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FibonacciSpeedResistanceArcsDrawing.prototype, "showFullCircle", {
        get: function () {
            return this.getDrawingTheme().showFullCircle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FibonacciSpeedResistanceArcsDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    FibonacciSpeedResistanceArcsDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return false;
        if (this.getDrawingTheme().trendLine.strokeEnabled && Geometry.isPointNearPolyline(point, points))
            return true;
        var centerPoint = { x: points[0].x, y: points[0].y };
        for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
            var level = _a[_i];
            if (!this._isLevelVisible(level))
                continue;
            var Radius = level.value * this.distance(points);
            if (this.showFullCircle) {
                if (Geometry.isPointNearCircle(point, centerPoint, Radius))
                    return true;
            }
            else {
                if (points[0].y < points[1].y && point.y > points[0].y) {
                    if (Geometry.isPointNearCircle(point, centerPoint, Radius))
                        return true;
                }
                if (points[0].y > points[1].y && point.y < points[0].y) {
                    if (Geometry.isPointNearCircle(point, centerPoint, Radius))
                        return true;
                }
            }
        }
        return this.selected && Geometry.isPointNearPoint(point, points);
    };
    FibonacciSpeedResistanceArcsDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var points = this.cartesianPoints();
                if (points.length > 1) {
                    for (var i = 0; i < points.length; i++) {
                        if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                            this._setDragPoint(i);
                            return true;
                        }
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    return true;
                }
                break;
        }
        return false;
    };
    FibonacciSpeedResistanceArcsDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        if (points.length > 1) {
            var previousDistance = 0;
            var distance = this.distance(points);
            var startAngle = this.startAngle(points);
            var endAngle = this.endAngle(points);
            for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
                var level = _a[_i];
                if (!this._isLevelVisible(level))
                    continue;
                this.drawArcs(points, level);
                this.drawLevelsValueIfVisible(points, level);
                if (this.getDrawingTheme().showLevelBackgrounds) {
                    var newDistance = (level.value * (distance));
                    this.context.beginPath();
                    this.context.arc(points[0].x, points[0].y, previousDistance, startAngle, endAngle);
                    this.context.arc(points[0].x, points[0].y, newDistance, endAngle, startAngle, true);
                    this.context.scxFill(level.theme.fill);
                    previousDistance = newDistance;
                }
            }
            this.drawTrendLineIfVisible(points);
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    FibonacciSpeedResistanceArcsDrawing.prototype.drawTrendLineIfVisible = function (points) {
        if (this.getDrawingTheme().trendLine.strokeEnabled) {
            this.context.scxStrokePolyline(points, this.getDrawingTheme().trendLine);
        }
    };
    FibonacciSpeedResistanceArcsDrawing.prototype.drawArcs = function (points, level) {
        var distance = this.distance(points);
        var startAngle = this.startAngle(points);
        var endAngle = this.endAngle(points);
        this.context.beginPath();
        this.context.arc(points[0].x, points[0].y, distance * level.value, startAngle, endAngle);
        this.context.scxStroke(level.theme.line);
    };
    FibonacciSpeedResistanceArcsDrawing.prototype.drawLevelsValueIfVisible = function (points, level) {
        var textPosition = this.textPosition(points);
        if (this.getDrawingTheme().showLevelValues) {
            this.context.scxApplyTextTheme(level.theme.text);
            this.context.fillText(level.value.toString(), points[0].x, points[0].y + textPosition * level.value);
        }
    };
    FibonacciSpeedResistanceArcsDrawing.prototype.distance = function (points) {
        return Math.sqrt(Math.pow((points[1].x - points[0].x), 2) + Math.pow((points[1].y - points[0].y), 2));
    };
    FibonacciSpeedResistanceArcsDrawing.prototype.startAngle = function (points) {
        var isOnTopSide = points[0].y > points[1].y;
        var startAngle = isOnTopSide ? Math.PI : 0;
        if (this.showFullCircle) {
            startAngle = 0;
        }
        return startAngle;
    };
    FibonacciSpeedResistanceArcsDrawing.prototype.endAngle = function (points) {
        var isOnTopSide = points[0].y > points[1].y;
        var endAngle = isOnTopSide ? 0 : Math.PI;
        if (this.showFullCircle) {
            endAngle = 2 * Math.PI;
        }
        return endAngle;
    };
    FibonacciSpeedResistanceArcsDrawing.prototype.textPosition = function (points) {
        var distance = this.distance(points);
        var isOnTopSide = points[0].y > points[1].y;
        return isOnTopSide ? -distance : distance;
    };
    return FibonacciSpeedResistanceArcsDrawing;
}(FibonacciDrawingBase));
export { FibonacciSpeedResistanceArcsDrawing };
Drawing.register(FibonacciSpeedResistanceArcsDrawing);
//# sourceMappingURL=FibonacciSpeedResistanceArcsDrawing.js.map