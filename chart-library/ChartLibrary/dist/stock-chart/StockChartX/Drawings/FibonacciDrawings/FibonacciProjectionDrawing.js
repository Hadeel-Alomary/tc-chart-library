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
import { DummyCanvasContext } from "../../Utils/DummyCanvasContext";
import { Drawing } from '../Drawing';
import { FibonacciLevelLineExtension } from "./FibonacciDrawingLevelLineExtension";
import { DrawingTextHorizontalPosition } from "../DrawingTextPosition";
import { DrawingLevelsFormatType } from '../DrawingLevelsFormatType';
var FibonacciProjectionDrawing = (function (_super) {
    __extends(FibonacciProjectionDrawing, _super);
    function FibonacciProjectionDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FibonacciProjectionDrawing, "className", {
        get: function () {
            return 'fibonacciProjection';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FibonacciProjectionDrawing.prototype, "reverse", {
        get: function () {
            return this.getDrawingTheme().reverse;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FibonacciProjectionDrawing.prototype, "levelLinesExtension", {
        get: function () {
            return this.getDrawingTheme().levelLinesExtension;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FibonacciProjectionDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 3;
        },
        enumerable: false,
        configurable: true
    });
    FibonacciProjectionDrawing.prototype.bounds = function () {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;
        var square = Geometry.length(points[0], points[1]);
        return {
            left: points[1].x - square,
            top: points[1].y - square,
            width: 2 * square,
            height: 2 * square
        };
    };
    FibonacciProjectionDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return false;
        if (this.getDrawingTheme().trendLine.strokeEnabled && Geometry.isPointNearPolyline(point, points))
            return true;
        if (this.showLevelLines || this.getDrawingTheme().showLevelBackgrounds) {
            var xRange = this._linesXRange(points);
            for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
                var level = _a[_i];
                if (!this._isLevelVisible(level))
                    continue;
                var levelY = this.getLevelY(level.value);
                var levelPoints = [{ x: xRange.min, y: levelY }, { x: xRange.max, y: levelY }];
                if (Geometry.isPointNearLine(point, levelPoints[0], levelPoints[1]))
                    return true;
            }
        }
        return this.selected && Geometry.isPointNearPoint(point, points);
    };
    FibonacciProjectionDrawing.prototype.getLevelY = function (levelValue) {
        var levelPrice = this.getLevelPrice(levelValue), levelY = this.projection.yByValue(levelPrice);
        return levelY;
    };
    FibonacciProjectionDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    FibonacciProjectionDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        var context = this.context, theme = this.getDrawingTheme();
        if (points.length > 2) {
            var xRange = this._linesXRange(points), textX = void 0, prevY = void 0;
            if (this.getDrawingTheme().showLevelValues) {
                switch (this.getDrawingTheme().levelTextHorPosition) {
                    case DrawingTextHorizontalPosition.CENTER:
                        textX = (xRange.min + xRange.max) / 2;
                        break;
                    case DrawingTextHorizontalPosition.LEFT:
                        textX = xRange.min;
                        break;
                    case DrawingTextHorizontalPosition.RIGHT:
                        textX = xRange.max;
                        break;
                    default:
                        throw new Error('Unknown text horizontal position: ' + this.getDrawingTheme().levelTextHorPosition);
                }
                textX = this._adjustXWithTextOffset(this.getDrawingTheme(), textX);
            }
            for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
                var level = _a[_i];
                if (!this._isLevelVisible(level))
                    continue;
                var levelTheme = level.theme ? level.theme : theme.defaultTheme, y = this.getLevelY(level.value);
                if (this.getDrawingTheme().showLevelBackgrounds) {
                    if (prevY) {
                        context.beginPath();
                        context.moveTo(xRange.min, prevY);
                        context.lineTo(xRange.max, prevY);
                        context.lineTo(xRange.max, y);
                        context.lineTo(xRange.min, y);
                        context.closePath();
                        context.scxFill(levelTheme.fill || theme.defaultTheme.fill);
                    }
                    prevY = y;
                }
                if (this.showLevelLines) {
                    context.beginPath();
                    context.moveTo(xRange.min, y);
                    context.lineTo(xRange.max, y);
                    context.scxStroke(levelTheme.line || theme.defaultTheme.line);
                }
                if (this.getDrawingTheme().showLevelValues) {
                    var levelText = this.getDrawingTheme().showLevelPercents
                        ? this.formatLevelText(level.value * 100, DrawingLevelsFormatType.PERCENT) + "%"
                        : this.formatLevelText(level.value, DrawingLevelsFormatType.LEVEL);
                    if (this.getDrawingTheme().showLevelPrices) {
                        var priceText = this.formatLevelText(this.projection.valueByY(y), DrawingLevelsFormatType.PRICE);
                        levelText += " (".concat(priceText, ")");
                    }
                    context.scxApplyTextTheme(levelTheme.text || theme.defaultTheme.text);
                    this._applyTextPosition(this.getDrawingTheme());
                    context.fillText(levelText, this._adjustWithTextWidth(textX, levelText, levelTheme.text || theme.defaultTheme.text), this._adjustYWithTextOffset(this.getDrawingTheme(), y));
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
    FibonacciProjectionDrawing.prototype._linesXRange = function (points) {
        var contentFrame = this.chartPanel.contentFrame, min = Math.min(points[1].x, points[2].x), max = Math.max(points[1].x, points[2].x);
        switch (this.levelLinesExtension) {
            case FibonacciLevelLineExtension.NONE:
                break;
            case FibonacciLevelLineExtension.LEFT:
                min = contentFrame.left;
                break;
            case FibonacciLevelLineExtension.RIGHT:
                max = contentFrame.right;
                break;
            case FibonacciLevelLineExtension.BOTH:
                min = contentFrame.left;
                max = contentFrame.right;
                break;
            default:
                throw new Error('Unknown level lines extension: ' + this.levelLinesExtension);
        }
        return {
            min: min,
            max: max
        };
    };
    FibonacciProjectionDrawing.prototype._adjustWithTextWidth = function (x, text, textTheme) {
        switch (this.levelLinesExtension) {
            case FibonacciLevelLineExtension.LEFT:
                if (this.getDrawingTheme().levelTextHorPosition == DrawingTextHorizontalPosition.LEFT) {
                    x = x + Math.ceil(DummyCanvasContext.textWidth(text, textTheme) + this._textOffset);
                }
                break;
            case FibonacciLevelLineExtension.RIGHT:
                if (this.getDrawingTheme().levelTextHorPosition == DrawingTextHorizontalPosition.RIGHT) {
                    x = x - Math.ceil(DummyCanvasContext.textWidth(text, textTheme) + this._textOffset);
                }
                break;
            case FibonacciLevelLineExtension.BOTH:
                if (this.getDrawingTheme().levelTextHorPosition == DrawingTextHorizontalPosition.RIGHT) {
                    x = x - Math.ceil(DummyCanvasContext.textWidth(text, textTheme) + this._textOffset);
                }
                else if (this.getDrawingTheme().levelTextHorPosition == DrawingTextHorizontalPosition.LEFT) {
                    x = x + Math.ceil(DummyCanvasContext.textWidth(text, textTheme) + this._textOffset);
                }
                break;
        }
        return x;
    };
    FibonacciProjectionDrawing.prototype.getLevelPrice = function (levelValue) {
        return this.reverse
            ? (this.chartPoints[0].value - this.chartPoints[1].value) * levelValue + this.chartPoints[2].value
            : (this.chartPoints[1].value - this.chartPoints[0].value) * levelValue + this.chartPoints[2].value;
    };
    return FibonacciProjectionDrawing;
}(FibonacciDrawingBase));
export { FibonacciProjectionDrawing };
Drawing.register(FibonacciProjectionDrawing);
//# sourceMappingURL=FibonacciProjectionDrawing.js.map