import { __extends } from "tslib";
import { Plot } from "./Plot";
import { Geometry } from "../Graphics/Geometry";
var PointPlotStyle = {
    DOT: "dot"
};
Object.freeze(PointPlotStyle);
var PointPlot = (function (_super) {
    __extends(PointPlot, _super);
    function PointPlot(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this._plotThemeKey = 'point';
        return _this;
    }
    Object.defineProperty(PointPlot.prototype, "pointSize", {
        get: function () {
            if (this.chart.dateScale.columnWidth <= 0) {
                return 0;
            }
            return this.chart.dateScale.columnWidth / 4;
        },
        enumerable: false,
        configurable: true
    });
    PointPlot.prototype.draw = function () {
        if (!this.visible)
            return;
        var params = this._valueDrawParams();
        if (params.values.length === 0)
            return;
        var context = params.context, projection = params.projection, dates = params.dates, prevX = null, valuesSameX = [], ySameX = [], x;
        context.scxApplyStrokeTheme(params.theme);
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var value = params.values[i];
            if (value == null)
                continue;
            x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column);
            if (x === prevX) {
                if (valuesSameX.indexOf(value) >= 0)
                    continue;
                var y = projection.yByValue(value);
                if (ySameX.indexOf(y) >= 0)
                    continue;
                valuesSameX.push(value);
                ySameX.push(y);
                continue;
            }
            if (prevX != null) {
                this.drawPoints(context, prevX, ySameX);
                ySameX.length = valuesSameX.length = 0;
            }
            prevX = x;
            valuesSameX.push(value);
            ySameX.push(projection.yByValue(value));
        }
        this.drawPoints(context, x, ySameX);
    };
    PointPlot.prototype.drawSelectionPoints = function () {
        if (!this.visible) {
            return;
        }
        var params = this._valueDrawParams();
        if (params.values.length === 0)
            return;
        for (var i = params.endIndex - 10; i >= params.startIndex; i = i - 10) {
            var value = params.values[i];
            if (value == null || isNaN(value))
                continue;
            var x = params.projection.xByRecord(i), y = params.projection.yByValue(value);
            this.drawSelectionCircle(x, y);
        }
    };
    PointPlot.prototype.drawPoints = function (context, x, ySameX) {
        for (var j = 0, yCount = ySameX.length; j < yCount; j++) {
            context.beginPath();
            context.arc(x, ySameX[j], this.pointSize, 0, 2 * Math.PI);
            context.stroke();
        }
    };
    PointPlot.prototype.hitTest = function (point) {
        var params = this._valueDrawParams();
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var value = params.values[i];
            if (value == null)
                continue;
            var x = this.projection.xByColumn(column);
            if (x <= point.x && point.x <= x + this.chart.dateScale.columnWidth) {
                var y = this.projection.yByValue(value);
                if (Geometry.isPointInsideOrNearCircle(point, { x: x, y: y }, this.pointSize)) {
                    return true;
                }
            }
        }
        return false;
    };
    PointPlot.prototype.updateMinMaxForSomePlotsIfNeeded = function (min, max) {
        var height = this.valueScale.rightPanel.frame.height, pixelsPerUnit = (max - min) / height, yOffset = this.pointSize * pixelsPerUnit * 2;
        return {
            min: min - yOffset,
            max: max + yOffset
        };
    };
    PointPlot.Style = PointPlotStyle;
    PointPlot.defaults = {
        plotStyle: PointPlot.Style.DOT,
        pointSize: 2
    };
    return PointPlot;
}(Plot));
export { PointPlot };
//# sourceMappingURL=PointPlot.js.map