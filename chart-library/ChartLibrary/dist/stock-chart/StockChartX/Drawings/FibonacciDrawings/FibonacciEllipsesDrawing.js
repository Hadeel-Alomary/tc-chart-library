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
import { FibonacciDrawingBase } from "./FibonacciDrawingBase";
import { Geometry } from "../../Graphics/Geometry";
import { GestureState } from "../../Gestures/Gesture";
import { Drawing } from "../Drawing";
import { DrawingLevelsFormatType } from '../DrawingLevelsFormatType';
var FibonacciEllipsesDrawing = (function (_super) {
    __extends(FibonacciEllipsesDrawing, _super);
    function FibonacciEllipsesDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FibonacciEllipsesDrawing, "className", {
        get: function () {
            return 'fibonacciEllipses';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FibonacciEllipsesDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    FibonacciEllipsesDrawing.prototype.bounds = function () {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;
        var horRadius = Geometry.xProjectionLength(points[0], points[1]), verRadius = Geometry.yProjectionLength(points[0], points[1]);
        return {
            left: points[0].x - horRadius,
            top: points[0].y - verRadius,
            width: 2 * horRadius,
            height: 2 * verRadius
        };
    };
    FibonacciEllipsesDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return false;
        if (this.getDrawingTheme().trendLine.strokeEnabled && Geometry.isPointNearPolyline(point, points))
            return true;
        if (this.showLevelLines || this.getDrawingTheme().showLevelBackgrounds) {
            var horRadius = Geometry.xProjectionLength(points[0], points[1]), verRadius = Geometry.yProjectionLength(points[0], points[1]);
            for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
                var level = _a[_i];
                if (!this._isLevelVisible(level))
                    continue;
                var h = Math.round(horRadius * level.value), v = Math.round(verRadius * level.value);
                if (Geometry.isPointNearEllipseWithRadiuses(point, points[0], h, v))
                    return true;
            }
        }
        return this.selected && Geometry.isPointNearPoint(point, points);
    };
    FibonacciEllipsesDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                var point = this.cartesianPoint(1);
                if (point && Geometry.isPointNearPoint(event.pointerPosition, point)) {
                    this._setDragPoint(1);
                    return true;
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint === 1) {
                    var magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[1].moveToPoint(magnetChartPoint, this.projection);
                    return true;
                }
                break;
        }
        return false;
    };
    FibonacciEllipsesDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        var context = this.context, theme = this.getDrawingTheme();
        if (points.length > 1) {
            var centerX = points[0].x, centerY = points[0].y, horRadius = Geometry.xProjectionLength(points[0], points[1]), verRadius = Geometry.yProjectionLength(points[0], points[1]), prevH = void 0;
            for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
                var level = _a[_i];
                if (!this._isLevelVisible(level))
                    continue;
                var levelTheme = level.theme ? level.theme : theme.defaultTheme, h = Math.round(horRadius * level.value), v = Math.round(verRadius * level.value);
                if (this.getDrawingTheme().showLevelBackgrounds) {
                    var fillTheme = levelTheme.fill || theme.defaultTheme.fill;
                    context.save();
                    context.beginPath();
                    context.translate(centerX, centerY);
                    if (h !== v)
                        context.scale(1, v / h);
                    context.arc(0, 0, h, 0, 2 * Math.PI, false);
                    if (prevH) {
                        context.arc(0, 0, prevH, 0, 2 * Math.PI, false);
                        context.scxApplyFillTheme(fillTheme);
                        context.fill("evenodd");
                    }
                    else {
                        context.scxFill(fillTheme);
                    }
                    context.restore();
                    prevH = h;
                }
                if (this.showLevelLines) {
                    context.beginPath();
                    context.save();
                    context.translate(centerX, centerY);
                    if (h !== v)
                        context.scale(1, v / h);
                    context.arc(0, 0, h, 0, 2 * Math.PI);
                    context.restore();
                    context.scxStroke(levelTheme.line || theme.defaultTheme.line);
                }
                if (this.getDrawingTheme().showLevelValues) {
                    var levelText = this.getDrawingTheme().showLevelPercents
                        ? this.formatLevelText(level.value * 100, DrawingLevelsFormatType.PERCENT) + "%"
                        : this.formatLevelText(level.value, DrawingLevelsFormatType.LEVEL);
                    context.scxApplyTextTheme(levelTheme.text || theme.defaultTheme.text);
                    this._applyTextPosition(this.getDrawingTheme());
                    context.fillText(levelText, centerX, centerY + v);
                }
            }
            if (this.getDrawingTheme().trendLine.strokeEnabled) {
                context.scxStrokePolyline(points, theme.trendLine);
            }
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    return FibonacciEllipsesDrawing;
}(FibonacciDrawingBase));
export { FibonacciEllipsesDrawing };
Drawing.register(FibonacciEllipsesDrawing);
//# sourceMappingURL=FibonacciEllipsesDrawing.js.map