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
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { GannBoxDrawingBase } from './GannBoxDrawingBase';
var FibonacciSpeedResistanceFanDrawing = (function (_super) {
    __extends(FibonacciSpeedResistanceFanDrawing, _super);
    function FibonacciSpeedResistanceFanDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FibonacciSpeedResistanceFanDrawing, "className", {
        get: function () {
            return 'fibonacciSpeedResistanceFan';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FibonacciSpeedResistanceFanDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    FibonacciSpeedResistanceFanDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return this.priceLinesHitTest(point, points) || this.timeLinesHitTest(point, points) || this.fansHitTest(point, points);
    };
    FibonacciSpeedResistanceFanDrawing.prototype.priceLinesHitTest = function (point, points) {
        var x_min = Math.min(points[0].x, points[1].x), x_max = Math.max(points[0].x, points[1].x);
        for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
            var level = _a[_i];
            if (!this._isLevelVisible(level) || !this.getDrawingTheme().grid.strokeEnabled)
                continue;
            var value = this._calculateValue(level.value), y = this.projection.yByValue(value), point1 = { x: x_min, y: y }, point2 = { x: x_max, y: y };
            if (Geometry.isPointNearLine(point, point1, point2))
                return true;
        }
    };
    FibonacciSpeedResistanceFanDrawing.prototype.timeLinesHitTest = function (point, points) {
        var y_min = Math.min(points[0].y, points[1].y), y_max = Math.max(points[0].y, points[1].y);
        for (var _i = 0, _a = this.timeLevels; _i < _a.length; _i++) {
            var timeLevel = _a[_i];
            if (!this._isLevelVisible(timeLevel) || !this.getDrawingTheme().grid.strokeEnabled)
                continue;
            var x = Math.round((points[1].x - points[0].x) * timeLevel.value + points[0].x), point1 = { x: x, y: y_min }, point2 = { x: x, y: y_max };
            if (Geometry.isPointNearLine(point, point1, point2))
                return true;
        }
    };
    FibonacciSpeedResistanceFanDrawing.prototype.fansHitTest = function (point, points) {
        var isOnLeftSide = points[0].x > points[1].x, contentFrame = this.chartPanel.contentFrame, x3 = isOnLeftSide ? contentFrame.left : contentFrame.right, isOnTopSide = points[0].y > points[1].y, y3 = isOnTopSide ? contentFrame.top : contentFrame.bottom;
        for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
            var level = _a[_i];
            if (!this._isLevelVisible(level))
                continue;
            var y3_1 = this.getFanY(points, x3, level.value), point1 = { x: points[0].x, y: points[0].y }, point2 = { x: x3, y: y3_1 };
            if (Geometry.isPointNearLine(point, point1, point2))
                return true;
        }
        for (var _b = 0, _c = this.timeLevels; _b < _c.length; _b++) {
            var timeLevel = _c[_b];
            if (!this._isLevelVisible(timeLevel))
                continue;
            var point1 = { x: points[0].x, y: points[0].y }, point2 = {
                x: (points[0].x + (y3 - points[0].y) * (((points[1].x - points[0].x) * timeLevel.value + points[0].x) - points[0].x) / (points[1].y - points[0].y)),
                y: y3
            };
            if (Geometry.isPointNearLine(point, point1, point2))
                return true;
        }
    };
    FibonacciSpeedResistanceFanDrawing.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                if (Geometry.isPointNearPoint(this.cartesianPoint(0), event.pointerPosition))
                    this._setDragPoint(0);
                else if (Geometry.isPointNearPoint(this.cartesianPoint(1), event.pointerPosition))
                    this._setDragPoint(1);
                else
                    return false;
                return true;
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
    FibonacciSpeedResistanceFanDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        if (points.length > 1) {
            var contentFrame = this.chartPanel.contentFrame, isOnLeftSide = points[0].x > points[1].x, x3 = isOnLeftSide ? contentFrame.left : contentFrame.right, isOnTopSide = points[0].y > points[1].y, y3 = isOnTopSide ? contentFrame.top : contentFrame.bottom;
            this.drawPriceLevelsLinesAndFans(points, x3);
            this.drawTimeLevelsLinesAndFans(points, y3);
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    FibonacciSpeedResistanceFanDrawing.prototype.drawPriceLevelsLinesAndFans = function (points, x3) {
        var x_min = Math.min(points[0].x, points[1].x), x_max = Math.max(points[0].x, points[1].x), y3old;
        for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
            var level = _a[_i];
            var levelTheme = level.theme;
            var value = this._calculateValue(level.value), y = this.projection.yByValue(value);
            if (!this._isLevelVisible(level))
                continue;
            this.drawPriceFans(points, x3, level);
            if (this.getDrawingTheme().showLevelBackgrounds) {
                var y3new = this.getFanY(points, x3, level.value);
                this.context.beginPath();
                this.context.moveTo(points[0].x, points[0].y);
                this.context.lineTo(x3, y3old);
                this.context.lineTo(x3, y3new);
                this.context.closePath();
                this.context.scxFill(level.theme.fill);
                y3old = y3new;
            }
            if (this.getDrawingTheme().grid.strokeEnabled) {
                this.drawPriceLines(x_min, x_max, y);
            }
            if (this.getDrawingTheme().showRightLabels) {
                this.drawRightLabels(level, x_max, y, levelTheme);
            }
            if (this.getDrawingTheme().showLeftLabels) {
                this.drawLeftLabels(level, x_min, y, levelTheme);
            }
        }
    };
    FibonacciSpeedResistanceFanDrawing.prototype.drawPriceFans = function (points, x3, level) {
        var fanY = this.getFanY(points, x3, level.value);
        this.context.beginPath();
        this.context.moveTo(points[0].x, points[0].y);
        this.context.lineTo(x3, fanY);
        this.context.scxStroke(level.theme.line);
    };
    FibonacciSpeedResistanceFanDrawing.prototype.getFanY = function (points, x3, levelValue) {
        var value = this._calculateValue(levelValue), y = this.projection.yByValue(value);
        return (points[0].y + (x3 - points[0].x) * (y - points[0].y) / (points[1].x - points[0].x));
    };
    FibonacciSpeedResistanceFanDrawing.prototype.drawPriceLines = function (x_min, x_max, y) {
        this.context.beginPath();
        this.context.moveTo(x_min, y);
        this.context.lineTo(x_max, y);
        this.context.scxStroke(this.getDrawingTheme().grid);
    };
    FibonacciSpeedResistanceFanDrawing.prototype.drawRightLabels = function (level, x_max, y, levelTheme) {
        levelTheme.text.textAlign = 'left';
        this.context.scxApplyTextTheme(levelTheme.text);
        this.context.fillText(level.value.toString(), x_max + 7, y);
    };
    FibonacciSpeedResistanceFanDrawing.prototype.drawLeftLabels = function (level, x_min, y, levelTheme) {
        levelTheme.text.textAlign = 'right';
        this.context.scxApplyTextTheme(levelTheme.text);
        this.context.fillText(level.value.toString(), x_min - 7, y);
    };
    FibonacciSpeedResistanceFanDrawing.prototype.drawTimeLevelsLinesAndFans = function (points, y3) {
        var y_min = Math.min(points[0].y, points[1].y), y_max = Math.max(points[0].y, points[1].y), x3old;
        for (var _i = 0, _a = this.timeLevels; _i < _a.length; _i++) {
            var timeLevel = _a[_i];
            var levelTheme = timeLevel.theme;
            var quarter = this._getQuarter(points);
            var x = this._calculateX(quarter, points, timeLevel.value);
            if (!this._isLevelVisible(timeLevel))
                continue;
            this.drawTimeFans(points, y3, timeLevel);
            if (this.getDrawingTheme().showLevelBackgrounds) {
                var x3new = (points[0].x + (y3 - points[0].y) * (((points[1].x - points[0].x) * timeLevel.value + points[0].x) - points[0].x) / (points[1].y - points[0].y));
                this.context.beginPath();
                this.context.moveTo(points[0].x, points[0].y);
                this.context.lineTo(x3old, y3);
                this.context.lineTo(x3new, y3);
                this.context.closePath();
                this.context.scxFill(timeLevel.theme.fill);
                x3old = x3new;
            }
            if (this.getDrawingTheme().grid.strokeEnabled) {
                this.drawTimeLines(y_min, y_max, x);
            }
            if (this.getDrawingTheme().showTopLabels) {
                this.drawTopLabels(timeLevel, y_min, x, levelTheme);
            }
            if (this.getDrawingTheme().showBottomLabels) {
                this.drawBottomLabels(timeLevel, y_max, x, levelTheme);
            }
        }
    };
    FibonacciSpeedResistanceFanDrawing.prototype.drawTimeFans = function (points, y3, timeLevel) {
        this.context.beginPath();
        this.context.moveTo(points[0].x, points[0].y);
        this.context.lineTo((points[0].x + (y3 - points[0].y) * (((points[1].x - points[0].x) * timeLevel.value + points[0].x) - points[0].x) / (points[1].y - points[0].y)), y3);
        this.context.scxStroke(timeLevel.theme.line);
    };
    FibonacciSpeedResistanceFanDrawing.prototype.drawTimeLines = function (y_min, y_max, x) {
        this.context.beginPath();
        this.context.moveTo(x, y_min);
        this.context.lineTo(x, y_max);
        this.context.scxStroke(this.getDrawingTheme().grid);
    };
    FibonacciSpeedResistanceFanDrawing.prototype.drawTopLabels = function (timeLevel, y_min, x, levelTheme) {
        this.context.scxApplyTextTheme(levelTheme.text);
        this.context.fillText(timeLevel.value.toString(), x, y_min - 10);
    };
    FibonacciSpeedResistanceFanDrawing.prototype.drawBottomLabels = function (timeLevel, y_max, x, levelTheme) {
        this.context.scxApplyTextTheme(levelTheme.text);
        this.context.fillText(timeLevel.value.toString(), x, y_max + 10);
    };
    FibonacciSpeedResistanceFanDrawing.prototype._getQuarter = function (points) {
        var quarter = 0;
        if (points[0].y < points[1].y) {
            if (points[0].x < points[1].x) {
                quarter = 4;
            }
            else {
                quarter = 3;
            }
        }
        else {
            if (points[0].x < points[1].x) {
                quarter = 1;
            }
            else {
                quarter = 2;
            }
        }
        return quarter;
    };
    FibonacciSpeedResistanceFanDrawing.prototype._calculateValue = function (levelValue) {
        var price0 = this.chartPoints[0];
        var price1 = this.chartPoints[1];
        return price0.value + ((price1.value - price0.value) * levelValue);
    };
    FibonacciSpeedResistanceFanDrawing.prototype._calculateX = function (quarter, points, timeLevelValue) {
        switch (quarter) {
            case 1:
                return Math.round(points[0].x - ((points[0].x - points[1].x) * timeLevelValue));
            case 2:
                return Math.round(points[0].x - ((points[0].x - points[1].x) * timeLevelValue));
            case 3:
                return Math.round(points[0].x - ((points[0].x - points[1].x) * timeLevelValue));
            case 4:
                return Math.round(points[0].x + ((points[1].x - points[0].x) * timeLevelValue));
        }
    };
    return FibonacciSpeedResistanceFanDrawing;
}(GannBoxDrawingBase));
export { FibonacciSpeedResistanceFanDrawing };
Drawing.register(FibonacciSpeedResistanceFanDrawing);
//# sourceMappingURL=FibonacciSpeedResistanceFanDrawing.js.map