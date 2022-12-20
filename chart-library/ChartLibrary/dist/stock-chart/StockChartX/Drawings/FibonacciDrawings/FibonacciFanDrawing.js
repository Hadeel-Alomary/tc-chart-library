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
import { FibonacciDrawingBase } from "./FibonacciDrawingBase";
import { Geometry } from "../../Graphics/Geometry";
import { GestureState } from "../../Gestures/Gesture";
import { Drawing } from "../Drawing";
import { DrawingTextVerticalPosition } from '../DrawingTextPosition';
import { DrawingLevelsFormatType } from '../DrawingLevelsFormatType';
var FibonacciFanDrawing = (function (_super) {
    __extends(FibonacciFanDrawing, _super);
    function FibonacciFanDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FibonacciFanDrawing, "className", {
        get: function () {
            return 'fibonacciFan';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FibonacciFanDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    FibonacciFanDrawing.prototype.bounds = function () {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;
        return {
            left: points[0].x,
            top: points[0].y,
            width: points[1].x - points[0].x,
            height: points[1].y - points[0].y
        };
    };
    FibonacciFanDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return false;
        var x1 = points[0].x, y1 = points[0].y, x2 = points[1].x, x3 = this.getX3(points);
        if (this.getDrawingTheme().trendLine.strokeEnabled && Geometry.isPointNearPolyline(point, points))
            return true;
        if (this.showLevelLines || this.getDrawingTheme().showLevelBackgrounds) {
            for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
                var level = _a[_i];
                if (!this._isLevelVisible(level))
                    continue;
                var fanY = this.getFanY(points, x3, level.value), point1 = { x: x1, y: y1 }, point2 = { x: x3, y: fanY };
                if (Geometry.isPointNearLine(point, point1, point2))
                    return true;
            }
        }
        return this.selected && Geometry.isPointNearPoint(point, points[1]);
    };
    FibonacciFanDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    FibonacciFanDrawing.prototype._applyTextVerticalPosition = function () {
        var baseline;
        switch (this.getDrawingTheme().levelTextVerPosition) {
            case DrawingTextVerticalPosition.MIDDLE:
                baseline = 'middle';
                break;
            case DrawingTextVerticalPosition.TOP:
                baseline = 'bottom';
                break;
            case DrawingTextVerticalPosition.BOTTOM:
                baseline = 'top';
                break;
            default:
                throw new Error('Unsupported level text vertical position: ' + this.getDrawingTheme().levelTextVerPosition);
        }
        this.context.textBaseline = baseline;
    };
    FibonacciFanDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        var context = this.context, theme = this.getDrawingTheme();
        if (points.length > 1) {
            var x1 = points[0].x, y1 = points[0].y, x2 = points[1].x, isOnLeftSide = x1 > x2, x3 = this.getX3(points), pointsBuffer = [];
            for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
                var level = _a[_i];
                if (!this._isLevelVisible(level))
                    continue;
                var levelTheme = level.theme ? level.theme : theme.defaultTheme, y3 = this.getFanY(points, x3, level.value);
                if (this.getDrawingTheme().showLevelBackgrounds) {
                    if (pointsBuffer.length === 2) {
                        context.beginPath();
                        context.moveTo(pointsBuffer[0].x, pointsBuffer[0].y);
                        context.lineTo(pointsBuffer[1].x, pointsBuffer[1].y);
                        context.lineTo(x1, y1);
                        context.lineTo(x3, y3);
                        context.closePath();
                        context.scxFill(levelTheme.fill || theme.defaultTheme.fill);
                        pointsBuffer[0] = { x: x3, y: y3 };
                        pointsBuffer[1] = { x: x1, y: y1 };
                    }
                    else {
                        pointsBuffer.push({ x: x3, y: y3 });
                        pointsBuffer.push({ x: x1, y: y1 });
                    }
                }
                if (this.showLevelLines) {
                    context.beginPath();
                    context.moveTo(x1, y1);
                    context.lineTo(x3, y3);
                    context.scxStroke(levelTheme.line || theme.defaultTheme.line);
                }
                if (this.getDrawingTheme().showLevelValues) {
                    var levelText = this.getDrawingTheme().showLevelPercents
                        ? this.formatLevelText(level.value * 100, DrawingLevelsFormatType.PERCENT) + "%"
                        : this.formatLevelText(level.value, DrawingLevelsFormatType.LEVEL), textX = isOnLeftSide ? x3 + 3 : x3 - 3;
                    if (this.getDrawingTheme().showLevelPrices) {
                        var priceText = this.formatLevelText(this.projection.valueByY(y3), DrawingLevelsFormatType.PRICE);
                        levelText += " (" + priceText + ")";
                    }
                    context.scxApplyTextTheme(levelTheme.text || theme.defaultTheme.text);
                    context.textAlign = isOnLeftSide ? 'left' : 'right';
                    this._applyTextVerticalPosition();
                    context.fillText(levelText, textX, y3);
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
    FibonacciFanDrawing.prototype.getX3 = function (points) {
        var isOnLeftSide = points[0].x > points[1].x, contentFrame = this.chartPanel.contentFrame;
        return isOnLeftSide ? contentFrame.left : contentFrame.right;
    };
    FibonacciFanDrawing.prototype.getFanY = function (points, x3, levelValue) {
        var value = (this.chartPoints[0].value - this.chartPoints[1].value) * levelValue + this.chartPoints[1].value, y = Math.round(this.projection.yByValue(value));
        return (points[0].y + (x3 - points[0].x) * (y - points[0].y) / (points[1].x - points[0].x));
    };
    return FibonacciFanDrawing;
}(FibonacciDrawingBase));
export { FibonacciFanDrawing };
Drawing.register(FibonacciFanDrawing);
//# sourceMappingURL=FibonacciFanDrawing.js.map