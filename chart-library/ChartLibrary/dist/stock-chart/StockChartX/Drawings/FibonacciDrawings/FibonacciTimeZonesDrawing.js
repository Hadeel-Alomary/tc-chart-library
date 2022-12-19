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
import { FibonacciLevelLineExtension } from "./FibonacciDrawingLevelLineExtension";
import { DrawingTextHorizontalPosition, DrawingTextVerticalPosition } from '../DrawingTextPosition';
var FibonacciTimeZonesDrawing = (function (_super) {
    __extends(FibonacciTimeZonesDrawing, _super);
    function FibonacciTimeZonesDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FibonacciTimeZonesDrawing, "className", {
        get: function () {
            return 'fibonacciTimeZones';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FibonacciTimeZonesDrawing.prototype, "levelLinesExtension", {
        get: function () {
            return FibonacciLevelLineExtension.BOTH;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FibonacciTimeZonesDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    FibonacciTimeZonesDrawing.prototype.bounds = function () {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;
        var square = Geometry.length(points[0], points[1]);
        return {
            left: points[0].x - square,
            top: points[0].y - square,
            width: 2 * square,
            height: 2 * square
        };
    };
    FibonacciTimeZonesDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < 2)
            return false;
        if (this.getDrawingTheme().trendLine.strokeEnabled && Geometry.isPointNearPolyline(point, points))
            return true;
        if (this.showLevelLines) {
            var yRange = this._linesYRange(points);
            for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
                var level = _a[_i];
                if (!this._isLevelVisible(level))
                    continue;
                var x = Math.round((points[1].x - points[0].x) * level.value + points[0].x), point1 = { x: x, y: yRange.max }, point2 = { x: x, y: yRange.min };
                if (Geometry.isPointNearLine(point, point1, point2))
                    return true;
            }
        }
        return this.selected && Geometry.isPointNearPoint(point, points);
    };
    FibonacciTimeZonesDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    FibonacciTimeZonesDrawing.prototype._applyTextHorizontalPosition = function () {
        var align;
        switch (this.getDrawingTheme().levelTextHorPosition) {
            case DrawingTextHorizontalPosition.CENTER:
                align = 'center';
                break;
            case DrawingTextHorizontalPosition.LEFT:
                align = 'right';
                break;
            case DrawingTextHorizontalPosition.RIGHT:
                align = 'left';
                break;
            default:
                throw new Error('Unsupported level text horizontal position: ' + this.getDrawingTheme().levelTextHorPosition);
        }
        this.context.textAlign = align;
    };
    FibonacciTimeZonesDrawing.prototype._applyTextVerticalPosition = function () {
        var baseline;
        switch (this.getDrawingTheme().levelTextVerPosition) {
            case DrawingTextVerticalPosition.MIDDLE:
                baseline = 'middle';
                break;
            case DrawingTextVerticalPosition.TOP:
                baseline = 'top';
                break;
            case DrawingTextVerticalPosition.BOTTOM:
                baseline = 'bottom';
                break;
            default:
                throw new Error('Unsupported level text vertical position: ' + this.getDrawingTheme().levelTextVerPosition);
        }
        this.context.textBaseline = baseline;
    };
    FibonacciTimeZonesDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        var context = this.context, theme = this.getDrawingTheme();
        if (points.length > 1) {
            var yRange = this._linesYRange(points), prevX = void 0, textY = void 0;
            if (this.getDrawingTheme().showLevelValues) {
                switch (this.getDrawingTheme().levelTextVerPosition) {
                    case DrawingTextVerticalPosition.MIDDLE:
                        textY = (yRange.min + yRange.max) / 2;
                        break;
                    case DrawingTextVerticalPosition.TOP:
                        textY = yRange.min;
                        break;
                    case DrawingTextVerticalPosition.BOTTOM:
                        textY = yRange.max;
                        break;
                }
            }
            for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
                var level = _a[_i];
                if (!this._isLevelVisible(level))
                    continue;
                var levelTheme = level.theme ? level.theme : theme.defaultTheme, x = Math.round((points[1].x - points[0].x) * level.value + points[0].x);
                if (this.showLevelLines) {
                    context.beginPath();
                    context.moveTo(x, yRange.min);
                    context.lineTo(x, yRange.max);
                    context.scxStroke(levelTheme.line || theme.defaultTheme.line);
                }
                if (this.getDrawingTheme().showLevelValues) {
                    var text = Number(level.value).toFixed(0);
                    context.scxApplyTextTheme(levelTheme.text || theme.defaultTheme.text);
                    this._applyTextHorizontalPosition();
                    this._applyTextVerticalPosition();
                    context.fillText(text, this._adjustXWithTextOffset(this.getDrawingTheme(), x), textY);
                }
            }
        }
        if (points.length > 1 && this.getDrawingTheme().trendLine.strokeEnabled) {
            context.scxStrokePolyline(points, theme.trendLine);
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    FibonacciTimeZonesDrawing.prototype._linesYRange = function (points) {
        var contentFrame = this.chartPanel.contentFrame, max = Math.max(points[0].y, points[1].y), min = Math.min(points[0].y, points[1].y);
        switch (this.levelLinesExtension) {
            case FibonacciLevelLineExtension.NONE:
                break;
            case FibonacciLevelLineExtension.TOP:
                min = contentFrame.top;
                break;
            case FibonacciLevelLineExtension.BOTTOM:
                max = contentFrame.bottom;
                break;
            case FibonacciLevelLineExtension.BOTH:
                min = contentFrame.top;
                max = contentFrame.bottom;
                break;
            default:
                throw new Error('Unknown level lines extension: ' + this.levelLinesExtension);
        }
        return {
            min: min,
            max: max
        };
    };
    return FibonacciTimeZonesDrawing;
}(FibonacciDrawingBase));
export { FibonacciTimeZonesDrawing };
Drawing.register(FibonacciTimeZonesDrawing);
//# sourceMappingURL=FibonacciTimeZonesDrawing.js.map