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
import { Plot, PlotEvent } from './Plot';
import { JsUtil } from "../Utils/JsUtil";
import { Geometry } from "../Graphics/Geometry";
import { HtmlUtil } from "../Utils/HtmlUtil";
var HistogramPlotStyle = {
    COLUMNBYPRICE: 'columnByPrice',
    COLUMNBYVALUE: 'columnByValue'
};
Object.freeze(HistogramPlotStyle);
var HistogramPlot = (function (_super) {
    __extends(HistogramPlot, _super);
    function HistogramPlot(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this._plotThemeKey = 'histogram';
        return _this;
    }
    Object.defineProperty(HistogramPlot.prototype, "baseValue", {
        get: function () {
            var value = this._options.baseValue;
            return value != null ? value : HistogramPlot.defaults.baseValue;
        },
        set: function (value) {
            if (!JsUtil.isFiniteNumber(value))
                throw new TypeError("Value must be a finite number.");
            this._setOption("baseValue", value, PlotEvent.BASE_VALUE_CHANGED);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HistogramPlot.prototype, "columnWidthRatio", {
        get: function () {
            var ratio = this._options.columnWidthRatio;
            return ratio || HistogramPlot.defaults.columnWidthRatio;
        },
        set: function (value) {
            if (JsUtil.isNegativeNumber(value) || value > 1)
                throw new Error("Ratio must be in range (0..1]");
            this._setOption("columnWidthRatio", value, PlotEvent.COLUMN_WIDTH_RATIO_CHANGED);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HistogramPlot.prototype, "minColumnWidth", {
        get: function () {
            var width = this._options.minColumnWidth;
            return width || HistogramPlot.defaults.minWidth;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumber(value))
                throw new Error("Min width must be a positive number.");
            this._setOption("minColumnWidth", value, PlotEvent.MIN_WIDTH_CHANGED);
        },
        enumerable: false,
        configurable: true
    });
    HistogramPlot.prototype.draw = function () {
        if (!this.visible)
            return;
        switch (this.plotStyle) {
            case HistogramPlotStyle.COLUMNBYPRICE:
                this._drawColumnsByPrice();
                break;
            case HistogramPlotStyle.COLUMNBYVALUE:
                this._drawColumnsByValue();
                break;
        }
    };
    HistogramPlot.prototype.drawSelectionPoints = function () {
        if (!this.visible) {
            return;
        }
        var params = this._barDrawParams();
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
    HistogramPlot.prototype._drawColumnsByValue = function () {
        this._drawColoredColumns(false, true);
    };
    HistogramPlot.prototype._drawColumnsByPrice = function () {
        this._drawColoredColumns(true, false);
    };
    HistogramPlot.prototype._drawColoredColumns = function (byPrice, byValue) {
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return;
        var context = params.context, projection = params.projection, dates = params.dates, yBaseValue = projection.yByValue(this.baseValue), columnWidth = this.chart.dateScale.columnWidth, xOffset = Math.round(Math.max(columnWidth * this.columnWidthRatio, this.minColumnWidth) / 2), width = xOffset * 2, y;
        var _drawColumns = function (theme, drawUpColumns) {
            context.beginPath();
            var prevX = null, maxValue = -Infinity;
            for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
                var value = params.values[i];
                if (value == null)
                    continue;
                var upColumn = false;
                if (byPrice) {
                    var close_1 = this.chart.barDataSeries().close.valueAtIndex(i);
                    var open_1 = this.chart.barDataSeries().open.valueAtIndex(i);
                    upColumn = close_1 >= open_1;
                    if (upColumn)
                        if (!drawUpColumns)
                            continue;
                }
                else if (byValue) {
                    upColumn = value >= 0;
                    if (upColumn)
                        if (!drawUpColumns)
                            continue;
                }
                var x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column);
                if (x === prevX) {
                    maxValue = Math.max(maxValue, value);
                }
                else {
                    if (prevX !== null) {
                        y = projection.yByValue(maxValue);
                        context.rect(prevX - xOffset, Math.min(y, yBaseValue), width, Math.max(Math.abs(y - yBaseValue), 1));
                    }
                    maxValue = value;
                    prevX = x;
                }
            }
            y = projection.yByValue(maxValue);
            context.rect(prevX - xOffset, Math.min(y, yBaseValue), width, Math.max(Math.abs(y - yBaseValue), 1));
            context.scxFillStroke(theme.fill, theme.border);
        }.bind(this);
        _drawColumns(params.theme.upColumn, true);
        _drawColumns(params.theme.downColumn, false);
    };
    HistogramPlot.prototype.hitTest = function (point) {
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return false;
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var value = params.values[i];
            if (value == null)
                continue;
            var x = this.projection.xByColumn(column);
            var xOffset = Math.max(this.chart.dateScale.columnWidth * this.columnWidthRatio, this.minColumnWidth) / 2;
            if (x - xOffset <= point.x && point.x <= x + xOffset) {
                var y = this.projection.yByValue(value);
                var baseY = this.projection.yByValue(this.baseValue);
                var rectanglePoint1 = { x: x - xOffset, y: baseY };
                var rectanglePoint2 = { x: x + xOffset, y: y };
                if (Geometry.isPointInsideOrNearRectPoints(point, rectanglePoint1, rectanglePoint2))
                    return true;
            }
        }
        return false;
    };
    HistogramPlot.prototype.drawValueMarkers = function () {
        if (!this.showValueMarkers)
            return;
        var marker = this.chart.valueMarker, markerTheme = marker.theme, drawParams = this._barDrawParams();
        if (drawParams.values.length === 0)
            return;
        var lastIdx = Math.ceil(this.chart.dateScale.lastVisibleRecord);
        if (!this.dataSeries[0].valueAtIndex(lastIdx)) {
            lastIdx = drawParams.values.length - 1;
        }
        var isUp, fillColor;
        switch (this.plotStyle) {
            case HistogramPlotStyle.COLUMNBYPRICE:
                isUp = this.chart.barDataSeries().close.valueAtIndex(lastIdx) >= this.chart.barDataSeries().open.valueAtIndex(lastIdx);
                break;
            case HistogramPlotStyle.COLUMNBYVALUE:
                isUp = drawParams.values[lastIdx] >= 0;
                break;
        }
        fillColor = drawParams.theme[isUp ? 'upColumn' : 'downColumn'].fill.fillColor;
        markerTheme.fill.fillColor = fillColor;
        markerTheme.text.fillColor = HtmlUtil.isDarkColor(fillColor) ? 'white' : 'black';
        marker.draw(drawParams.values[lastIdx], this.panelValueScale, this.valueMarkerOffset, this.plotType);
    };
    HistogramPlot.prototype.updateMinMaxForSomePlotsIfNeeded = function (min, max) {
        if (this.plotStyle == 'columnByPrice') {
            return {
                min: this.baseValue,
                max: max
            };
        }
        return {
            min: min,
            max: max
        };
    };
    HistogramPlot.Style = HistogramPlotStyle;
    HistogramPlot.defaults = {
        plotStyle: HistogramPlotStyle.COLUMNBYPRICE,
        baseValue: 0.0,
        columnWidthRatio: 0.5,
        minWidth: 1
    };
    return HistogramPlot;
}(Plot));
export { HistogramPlot };
//# sourceMappingURL=HistogramPlot.js.map