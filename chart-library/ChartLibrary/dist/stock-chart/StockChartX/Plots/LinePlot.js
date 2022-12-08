import { __extends } from "tslib";
import { Plot } from "./Plot";
import { Geometry } from "../Graphics/Geometry";
var LinePlotStyle = {
    SIMPLE: "simple",
    MOUNTAIN: "mountain",
    STEP: "step"
};
Object.freeze(LinePlotStyle);
var PointEpsilon = 1.8;
var ValueEpsilon = 1E-5;
var LinePlot = (function (_super) {
    __extends(LinePlot, _super);
    function LinePlot(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this._plotThemeKey = 'line';
        return _this;
    }
    LinePlot.prototype.draw = function () {
        if (!this.visible)
            return;
        switch (this.plotStyle) {
            case LinePlotStyle.MOUNTAIN:
                this._drawMountainLine();
                break;
            case LinePlotStyle.STEP:
                this._drawStepLine();
                break;
            default:
                this._drawSimpleLine();
                break;
        }
    };
    LinePlot.prototype.drawSelectionPoints = function () {
        if (!this.visible) {
            return;
        }
        var params = this._valueDrawParams();
        if (params.values.length === 0)
            return;
        var projection = params.projection;
        for (var i = params.endIndex - 10; i >= params.startIndex; i = i - 10) {
            var value = params.values[i];
            if (value == null || isNaN(value))
                continue;
            var x = projection.xByRecord(i), y = projection.yByValue(value);
            this.drawSelectionCircle(x, y);
        }
    };
    LinePlot.prototype._drawSimpleLine = function () {
        var params = this._valueDrawParams();
        if (params.values.length === 0)
            return;
        var context = params.context, projection = params.projection, dates = params.dates, prevX = null, lastValue = null, minValue = Infinity, maxValue = -Infinity, breakLine = true, curY = null;
        context.beginPath();
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var value = params.values[i];
            if (value == null)
                continue;
            var isNaNValue = value !== value;
            if (isNaNValue && breakLine)
                continue;
            var x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column);
            if (breakLine) {
                context.moveTo(x, projection.yByValue(value));
                breakLine = false;
                continue;
            }
            if (isNaNValue)
                breakLine = true;
            if (!breakLine && x == prevX) {
                minValue = Math.min(minValue, value);
                maxValue = Math.max(maxValue, value);
                lastValue = value;
                continue;
            }
            if (minValue !== Infinity) {
                var minY = projection.yByValue(minValue);
                var isNewMinY = Math.abs(curY - minY) > PointEpsilon;
                if (Math.abs(maxValue - minValue) < ValueEpsilon) {
                    if (isNewMinY)
                        context.lineTo(prevX, minY);
                }
                else {
                    var maxY = projection.yByValue(maxValue);
                    if (Math.abs(maxY - minY) < PointEpsilon) {
                        if (isNewMinY)
                            context.lineTo(prevX, minY);
                    }
                    else {
                        if (isNewMinY)
                            context.moveTo(prevX, minY);
                        context.lineTo(prevX, maxY);
                        if (Math.abs(lastValue - maxValue) > ValueEpsilon) {
                            var y = projection.yByValue(lastValue);
                            if (Math.abs(y - maxY) > PointEpsilon)
                                context.moveTo(prevX, y);
                        }
                    }
                }
            }
            if (!breakLine) {
                curY = projection.yByValue(value);
                context.lineTo(x, curY);
                minValue = maxValue = lastValue = value;
            }
            else {
                minValue = Infinity;
                maxValue = lastValue = -Infinity;
                curY = null;
            }
            prevX = x;
        }
        if (minValue !== Infinity && minValue !== maxValue) {
            context.moveTo(prevX, projection.yByValue(minValue));
            context.lineTo(prevX, projection.yByValue(maxValue));
        }
        context.scxApplyStrokeTheme(params.theme.line || params.theme);
        context.stroke();
    };
    LinePlot.prototype._drawMountainLine = function () {
        var params = this._valueDrawParams();
        if (params.values.length === 0)
            return;
        var context = params.context, projection = params.projection, startX = null, prevX = null, minValue = Infinity, breakLine = true, maxY = this.chartPanel.canvas.height();
        context.scxApplyFillTheme(params.theme.fill);
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var value = params.values[i];
            if (value == null)
                continue;
            var isNaNValue = value !== value;
            if (isNaNValue && breakLine)
                continue;
            var x = projection.xByColumn(column);
            if (breakLine) {
                context.beginPath();
                context.moveTo(x, projection.yByValue(value));
                startX = prevX = x;
                breakLine = false;
                continue;
            }
            if (isNaNValue)
                breakLine = true;
            if (!breakLine && x === prevX) {
                minValue = Math.min(minValue, value);
                continue;
            }
            if (minValue !== Infinity) {
                context.lineTo(prevX, projection.yByValue(minValue));
            }
            if (!breakLine) {
                context.lineTo(x, projection.yByValue(value));
                minValue = value;
            }
            else {
                minValue = Infinity;
                context.lineTo(prevX, maxY);
                context.lineTo(startX, maxY);
                context.closePath();
                context.fill();
                startX = x;
            }
            prevX = x;
        }
        if (minValue !== Infinity) {
            context.lineTo(prevX, projection.yByValue(minValue));
        }
        context.lineTo(prevX, maxY);
        context.lineTo(startX, maxY);
        context.closePath();
        context.fill();
        this._drawSimpleLine();
    };
    LinePlot.prototype._drawStepLine = function () {
        var params = this._valueDrawParams();
        if (params.values.length === 0)
            return;
        var context = params.context, projection = params.projection, dates = params.dates, prevX = null, prevY = null, lastValue = null, minValue = Infinity, maxValue = -Infinity, x, breakLine = true;
        context.beginPath();
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var value = params.values[i];
            if (value == null)
                continue;
            var isNaNValue = value !== value;
            if (isNaNValue && breakLine)
                continue;
            x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column);
            if (breakLine) {
                prevX = x;
                prevY = projection.yByValue(value);
                context.moveTo(x, prevY);
                minValue = maxValue = value;
                breakLine = false;
                continue;
            }
            if (isNaNValue)
                breakLine = true;
            if (!breakLine && x === prevX) {
                minValue = Math.min(minValue, value);
                maxValue = Math.max(maxValue, value);
                lastValue = value;
                continue;
            }
            if (!breakLine) {
                context.lineTo(prevX, prevY);
                var minY = projection.yByValue(minValue);
                if (Math.abs(maxValue - minValue) < ValueEpsilon) {
                    context.lineTo(prevX, minY);
                    prevY = minY;
                }
                else {
                    var maxY = projection.yByValue(maxValue);
                    if (Math.abs(maxY - minY) < PointEpsilon) {
                        context.lineTo(prevX, minY);
                        prevY = minY;
                    }
                    else {
                        context.moveTo(prevX, minY);
                        context.lineTo(prevX, maxY);
                        prevY = projection.yByValue(lastValue);
                        context.moveTo(prevX, prevY);
                    }
                }
                minValue = maxValue = lastValue = value;
            }
            else {
                minValue = Infinity;
                maxValue = lastValue = -Infinity;
            }
            prevX = x;
        }
        if (lastValue != null && lastValue !== -Infinity) {
            context.lineTo(x, prevY);
            context.lineTo(x, projection.yByValue(lastValue));
        }
        context.scxApplyStrokeTheme(params.theme.line || params.theme);
        context.stroke();
    };
    LinePlot.prototype.hitTest = function (point) {
        var params = this._valueDrawParams();
        if (params.values.length === 0)
            return false;
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var value = params.values[i];
            if (value == null)
                continue;
            var x = this.projection.xByColumn(column);
            if (x <= point.x && point.x <= x + this.chart.dateScale.columnWidth) {
                var nextX = this.projection.xByColumn(column + 1);
                var nextEntry = Math.min(i + 1, params.endIndex);
                var y = this.projection.yByValue(value);
                var nextY = this.projection.yByValue(params.values[nextEntry]);
                if (Geometry.isPointNearLine(point, { x: x, y: y }, { x: nextX, y: nextY }))
                    return true;
            }
        }
        return false;
    };
    LinePlot.Style = LinePlotStyle;
    LinePlot.defaults = {
        plotStyle: LinePlotStyle.SIMPLE
    };
    return LinePlot;
}(Plot));
export { LinePlot };
//# sourceMappingURL=LinePlot.js.map