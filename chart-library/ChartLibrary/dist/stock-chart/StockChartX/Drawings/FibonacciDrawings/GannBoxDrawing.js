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
import { Drawing } from '../Drawing';
import { Geometry } from '../../Graphics/Geometry';
import { GestureState } from '../../Gestures/Gesture';
import { GannBoxDrawingBase } from './GannBoxDrawingBase';
var GannBoxDrawing = (function (_super) {
    __extends(GannBoxDrawing, _super);
    function GannBoxDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(GannBoxDrawing, "className", {
        get: function () {
            return 'gannBox';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GannBoxDrawing.prototype, "pointsNeeded", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    GannBoxDrawing.prototype.hitTest = function (point) {
        var points = this.cartesianPoints();
        return this.priceLinesHitTest(point, points) || this.timeLinesHitTest(point, points);
    };
    GannBoxDrawing.prototype.priceLinesHitTest = function (point, points) {
        var x_min = Math.min(points[0].x, points[1].x), x_max = Math.max(points[0].x, points[1].x), y_min = Math.min(points[0].y, points[1].y), y_max = Math.max(points[0].y, points[1].y);
        for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
            var level = _a[_i];
            var value = this._calculateValue(level.value), y = this.projection.yByValue(value), point1 = { x: x_min, y: y }, point2 = { x: x_max, y: y };
            var point3 = { x: x_min, y: y_min }, point4 = { x: x_max, y: y };
            var point5 = { x: x_max, y: y_min }, point6 = { x: x_min, y: y };
            var point7 = { x: x_max, y: y_max }, point8 = { x: x_min, y: y };
            var point9 = { x: x_min, y: y_max }, point10 = { x: x_max, y: y };
            if (Geometry.isPointNearLine(point, point1, point2))
                return true;
            if (this.getDrawingTheme().showAngles) {
                if (Geometry.isPointNearLine(point, point3, point4)
                    || Geometry.isPointNearLine(point, point5, point6) || Geometry.isPointNearLine(point, point7, point8)
                    || Geometry.isPointNearLine(point, point9, point10))
                    return true;
            }
        }
    };
    GannBoxDrawing.prototype.timeLinesHitTest = function (point, points) {
        var x_min = Math.min(points[0].x, points[1].x), x_max = Math.max(points[0].x, points[1].x), y_min = Math.min(points[0].y, points[1].y), y_max = Math.max(points[0].y, points[1].y);
        for (var _i = 0, _a = this.timeLevels; _i < _a.length; _i++) {
            var timeLevel = _a[_i];
            var x = this.getDrawingTheme().reverse
                ? Math.round((points[0].x - points[1].x) * timeLevel.value + points[1].x)
                : Math.round((points[1].x - points[0].x) * timeLevel.value + points[0].x), point1 = { x: x, y: y_min }, point2 = { x: x, y: y_max };
            var point3 = { x: x_min, y: y_min }, point4 = { x: x, y: y_max };
            var point5 = { x: x_max, y: y_min }, point6 = { x: x, y: y_max };
            var point7 = { x: x_max, y: y_max }, point8 = { x: x, y: y_min };
            var point9 = { x: x_min, y: y_max }, point10 = { x: x, y: y_min };
            if (Geometry.isPointNearLine(point, point1, point2))
                return true;
            if (this.getDrawingTheme().showAngles) {
                if (Geometry.isPointNearLine(point, point3, point4)
                    || Geometry.isPointNearLine(point, point5, point6) || Geometry.isPointNearLine(point, point7, point8)
                    || Geometry.isPointNearLine(point, point9, point10))
                    return true;
            }
        }
    };
    GannBoxDrawing.prototype._handlePanGesture = function (gesture, event) {
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
    GannBoxDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length === 0)
            return;
        if (points.length > 1) {
            this.drawPriceLevels(points);
            this.drawTimeLevels(points);
        }
        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    };
    GannBoxDrawing.prototype.drawPriceLevels = function (points) {
        var x_min = Math.min(points[0].x, points[1].x), x_max = Math.max(points[0].x, points[1].x), y_min = Math.min(points[0].y, points[1].y), y_max = Math.max(points[0].y, points[1].y), prevY;
        for (var _i = 0, _a = this.levels; _i < _a.length; _i++) {
            var level = _a[_i];
            var levelTheme = level.theme;
            var value = this._calculateValue(level.value), y = this.projection.yByValue(value);
            if (this.getDrawingTheme().showAngles) {
                this.drawPriceAngles(x_max, x_min, y, y_min, y_max);
            }
            if (!this._isLevelVisible(level))
                continue;
            if (this.getDrawingTheme().showPriceLevelBackground) {
                if (prevY) {
                    this.context.beginPath();
                    this.context.moveTo(x_min, prevY);
                    this.context.lineTo(x_max, prevY);
                    this.context.lineTo(x_max, y);
                    this.context.lineTo(x_min, y);
                    this.context.closePath();
                    this.context.scxFill(levelTheme.fill);
                }
                prevY = y;
            }
            this.drawPriceLevelLines(x_min, x_max, y, levelTheme);
            if (this.getDrawingTheme().showRightLabels) {
                this.drawRightLabels(level, x_max, y, levelTheme);
            }
            if (this.getDrawingTheme().showLeftLabels) {
                this.drawLeftLabels(level, x_min, y, levelTheme);
            }
        }
    };
    GannBoxDrawing.prototype.drawPriceLevelLines = function (x_min, x_max, y, levelTheme) {
        this.context.beginPath();
        this.context.moveTo(x_min, y);
        this.context.lineTo(x_max, y);
        this.context.scxStroke(levelTheme.line);
    };
    GannBoxDrawing.prototype.drawRightLabels = function (level, x_max, y, levelTheme) {
        levelTheme.text.textAlign = 'left';
        this.context.scxApplyTextTheme(levelTheme.text);
        this.context.fillText(level.value.toString(), x_max + 7, y);
    };
    GannBoxDrawing.prototype.drawLeftLabels = function (level, x_min, y, levelTheme) {
        levelTheme.text.textAlign = 'right';
        this.context.scxApplyTextTheme(levelTheme.text);
        this.context.fillText(level.value.toString(), x_min - 7, y);
    };
    GannBoxDrawing.prototype.drawPriceAngles = function (x_max, x_min, y, y_min, y_max) {
        this.context.beginPath();
        this.context.moveTo(x_min, y_min);
        this.context.lineTo(x_max, y);
        this.context.moveTo(x_max, y_min);
        this.context.lineTo(x_min, y);
        this.context.moveTo(x_max, y_max);
        this.context.lineTo(x_min, y);
        this.context.moveTo(x_min, y_max);
        this.context.lineTo(x_max, y);
        this.context.scxStroke(this.getDrawingTheme().angles);
    };
    GannBoxDrawing.prototype.drawTimeLevels = function (points) {
        var x_min = Math.min(points[0].x, points[1].x), x_max = Math.max(points[0].x, points[1].x), y_min = Math.min(points[0].y, points[1].y), y_max = Math.max(points[0].y, points[1].y), prevX;
        for (var _i = 0, _a = this.timeLevels; _i < _a.length; _i++) {
            var timeLevel = _a[_i];
            var levelTheme = timeLevel.theme;
            var quarter = this._getQuarter(points);
            var x = this._calculateX(quarter, points, timeLevel.value);
            if (this.getDrawingTheme().showAngles) {
                this.drawTimeAngles(x_max, x_min, x, y_min, y_max);
            }
            if (!this._isLevelVisible(timeLevel))
                continue;
            if (this.getDrawingTheme().showTimeLevelBackground) {
                if (prevX) {
                    this.context.beginPath();
                    this.context.moveTo(prevX, y_min);
                    this.context.lineTo(prevX, y_max);
                    this.context.lineTo(x, y_max);
                    this.context.lineTo(x, y_min);
                    this.context.closePath();
                    this.context.scxFill(levelTheme.fill);
                }
                prevX = x;
            }
            this.drawTimeLevelLines(y_max, y_min, x, levelTheme);
            if (this.getDrawingTheme().showTopLabels) {
                this.drawTopLabels(timeLevel, y_min, x);
            }
            if (this.getDrawingTheme().showBottomLabels) {
                this.drawBottomLabels(timeLevel, y_max, x);
            }
        }
    };
    GannBoxDrawing.prototype.drawTimeLevelLines = function (y_max, y_min, x, levelTheme) {
        this.context.beginPath();
        this.context.moveTo(x, y_min);
        this.context.lineTo(x, y_max);
        this.context.scxStroke(levelTheme.line);
        this.context.scxApplyTextTheme(levelTheme.text);
    };
    GannBoxDrawing.prototype.drawTopLabels = function (timeLevel, y_min, x) {
        this.context.fillText(timeLevel.value.toString(), x, y_min - 10);
    };
    GannBoxDrawing.prototype.drawBottomLabels = function (timeLevel, y_max, x) {
        this.context.fillText(timeLevel.value.toString(), x, y_max + 10);
    };
    GannBoxDrawing.prototype.drawTimeAngles = function (x_max, x_min, x, y_min, y_max) {
        this.context.beginPath();
        this.context.moveTo(x_min, y_min);
        this.context.lineTo(x, y_max);
        this.context.moveTo(x_max, y_min);
        this.context.lineTo(x, y_max);
        this.context.moveTo(x_max, y_max);
        this.context.lineTo(x, y_min);
        this.context.moveTo(x_min, y_max);
        this.context.lineTo(x, y_min);
        this.context.scxStroke(this.getDrawingTheme().angles);
    };
    GannBoxDrawing.prototype._getQuarter = function (points) {
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
        if (this.getDrawingTheme().reverse) {
            quarter = quarter + 4;
        }
        return quarter;
    };
    GannBoxDrawing.prototype._calculateValue = function (levelValue) {
        if (this.getDrawingTheme().reverse)
            return this.chartPoints[1].value + ((this.chartPoints[0].value - this.chartPoints[1].value) * levelValue);
        return this.chartPoints[0].value + ((this.chartPoints[1].value - this.chartPoints[0].value) * levelValue);
    };
    GannBoxDrawing.prototype._calculateX = function (quarter, points, timeLevelValue) {
        switch (quarter) {
            case 1:
                return Math.round(points[0].x - ((points[0].x - points[1].x) * timeLevelValue));
            case 2:
                return Math.round(points[0].x - ((points[0].x - points[1].x) * timeLevelValue));
            case 3:
                return Math.round(points[0].x - ((points[0].x - points[1].x) * timeLevelValue));
            case 4:
                return Math.round(points[0].x + ((points[1].x - points[0].x) * timeLevelValue));
            case 5:
                return Math.round(points[1].x + ((points[0].x - points[1].x) * timeLevelValue));
            case 6:
                return Math.round(points[1].x + ((points[0].x - points[1].x) * timeLevelValue));
            case 7:
                return Math.round(points[1].x + ((points[0].x - points[1].x) * timeLevelValue));
            case 8:
                return Math.round(points[1].x - ((points[1].x - points[0].x) * timeLevelValue));
        }
    };
    return GannBoxDrawing;
}(GannBoxDrawingBase));
export { GannBoxDrawing };
Drawing.register(GannBoxDrawing);
//# sourceMappingURL=GannBoxDrawing.js.map