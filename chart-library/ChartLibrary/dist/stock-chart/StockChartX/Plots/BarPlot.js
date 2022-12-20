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
import { Plot, PlotEvent } from './Plot';
import { JsUtil } from "../Utils/JsUtil";
import { HtmlUtil } from "../Utils/HtmlUtil";
import { Geometry } from "../Graphics/Geometry";
import { BarConverter } from "../Data/BarConverter";
import { DataSeriesSuffix } from '../Data/DataSeries';
var BarPlotStyle = {
    OHLC: "OHLC",
    COLORED_OHLC: "coloredOHLC",
    HLC: "HLC",
    COLORED_HLC: "coloredHLC",
    HL: "HL",
    COLORED_HL: "coloredHL",
    CANDLE: "candle",
    HOLLOW_CANDLE: "hollowCandle",
    HEIKIN_ASHI: "heikinAshi",
    RENKO: 'renko',
    LINE_BREAK: 'lineBreak',
    POINT_AND_FIGURE: 'pointAndFigure',
    KAGI: 'kagi'
};
Object.freeze(BarPlotStyle);
var BarPlot = (function (_super) {
    __extends(BarPlot, _super);
    function BarPlot(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this._plotThemeKey = 'bar';
        return _this;
    }
    Object.defineProperty(BarPlot.prototype, "columnWidthRatio", {
        get: function () {
            var ratio = this._options.columnWidthRatio;
            return ratio || BarPlot.defaults.columnWidthRatio;
        },
        set: function (value) {
            if (JsUtil.isNegativeNumber(value) || value > 1)
                throw new Error("Ratio must be in range [0..1]");
            this._setOption("columnWidthRatio", value, PlotEvent.COLUMN_WIDTH_RATIO_CHANGED);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarPlot.prototype, "minWidth", {
        get: function () {
            var width = this._options.minWidth;
            return width || BarPlot.defaults.minWidth;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumber(value))
                throw new Error("Min width must be greater than 0.");
            this._setOption("minWidth", value, PlotEvent.MIN_WIDTH_CHANGED);
        },
        enumerable: true,
        configurable: true
    });
    BarPlot.prototype.updateDataSeriesIfNeeded = function () {
        switch (this.plotStyle) {
            case BarPlotStyle.RENKO:
                this.updateRenkoDataSeries();
                break;
            case BarPlotStyle.HEIKIN_ASHI:
                this.updateHeikinAshiDataSeries();
                break;
        }
    };
    BarPlot.prototype.draw = function () {
        if (!this.visible)
            return;
        switch (this.plotStyle) {
            case BarPlotStyle.OHLC:
            case BarPlotStyle.HLC:
            case BarPlotStyle.HL:
                this._drawBars();
                break;
            case BarPlotStyle.COLORED_OHLC:
            case BarPlotStyle.COLORED_HLC:
            case BarPlotStyle.COLORED_HL:
                this._drawColoredBars();
                break;
            case BarPlotStyle.HOLLOW_CANDLE:
                this._drawHollowCandles();
                break;
            case BarPlotStyle.RENKO:
            case BarPlotStyle.LINE_BREAK:
                this._drawBricks();
                break;
            case BarPlotStyle.KAGI:
                this._drawKagi();
                break;
            default:
                this._drawCandles();
                break;
        }
    };
    BarPlot.prototype.drawValueMarkers = function () {
        if (!this.showValueMarkers)
            return;
        var marker = this.chart.valueMarker, markerTheme = marker.theme, drawParams = this._barDrawParams();
        if (drawParams.values.length === 0)
            return;
        var lastIdx = Math.ceil(this.chart.dateScale.lastVisibleRecord);
        if (!this.dataSeries[0].valueAtIndex(lastIdx)) {
            lastIdx = drawParams.values.length - 1;
        }
        var isUp = drawParams.close[lastIdx] >= drawParams.open[lastIdx], fillColor;
        switch (this.plotStyle) {
            case BarPlotStyle.OHLC:
            case BarPlotStyle.HLC:
            case BarPlotStyle.HL:
                fillColor = drawParams.theme.strokeColor;
                break;
            case BarPlotStyle.COLORED_OHLC:
            case BarPlotStyle.COLORED_HLC:
            case BarPlotStyle.COLORED_HL:
                fillColor = isUp ? drawParams.theme.upBar.strokeColor : drawParams.theme.downBar.strokeColor;
                break;
            case BarPlotStyle.CANDLE:
            case BarPlotStyle.HOLLOW_CANDLE:
            case BarPlotStyle.HEIKIN_ASHI:
            case BarPlotStyle.RENKO:
                fillColor = isUp ? drawParams.theme.upCandle.fill.fillColor : drawParams.theme.downCandle.fill.fillColor;
                break;
            case BarPlotStyle.LINE_BREAK:
                fillColor = isUp ? drawParams.theme.upCandle.border.strokeColor : drawParams.theme.downCandle.fill.fillColor;
                break;
            case BarPlotStyle.POINT_AND_FIGURE:
            case BarPlotStyle.KAGI:
                fillColor = drawParams.theme[isUp ? 'upCandle' : 'downCandle'].border.strokeColor;
                break;
            default:
                return;
        }
        markerTheme.fill.fillColor = fillColor;
        markerTheme.text.fillColor = HtmlUtil.isDarkColor(fillColor) ? 'white' : 'black';
        marker.draw(drawParams.close[lastIdx], this.panelValueScale, this.valueMarkerOffset, this.plotType);
    };
    BarPlot.prototype.hitTest = function (point) {
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return false;
        var columnWidth = this.chart.dateScale.columnWidth, width = Math.max(columnWidth * this.columnWidthRatio, this.minWidth);
        var xOffset = Math.round(width / 2);
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var open_1 = params.open[i], high = params.high[i], low = params.low[i], close_1 = params.close[i];
            if (open_1 == null || close_1 == null)
                continue;
            high = Math.max(high, open_1);
            low = Math.min(low, open_1);
            var x = params.dates ? this.projection.xByDate(params.dates[i]) : this.projection.xByColumn(column);
            if (x - xOffset <= point.x && point.x <= x + xOffset) {
                switch (this.plotStyle) {
                    case BarPlotStyle.OHLC:
                    case BarPlotStyle.HLC:
                    case BarPlotStyle.HL:
                    case BarPlotStyle.COLORED_OHLC:
                    case BarPlotStyle.COLORED_HLC:
                    case BarPlotStyle.COLORED_HL:
                    case BarPlotStyle.HOLLOW_CANDLE:
                    case BarPlotStyle.KAGI:
                    default:
                        if (high == null || low == null)
                            break;
                        var yHigh = this.projection.yByValue(high), yLow = this.projection.yByValue(low);
                        var recPoint1 = { x: x - xOffset, y: yHigh };
                        var recPoint2 = { x: x + xOffset, y: yLow };
                        if (Geometry.isPointInsideOrNearRectPoints(point, recPoint1, recPoint2))
                            return true;
                        break;
                    case BarPlotStyle.RENKO:
                    case BarPlotStyle.LINE_BREAK:
                        var yOpen = this.projection.yByValue(open_1), yClose = this.projection.yByValue(close_1);
                        var rectanglePoint1 = { x: x - xOffset, y: Math.min(yOpen, yClose) };
                        var rectanglePoint2 = {
                            x: x + xOffset,
                            y: Math.min(yOpen, yClose) + Math.max(Math.abs(yOpen - yClose), 1)
                        };
                        if (Geometry.isPointInsideOrNearRectPoints(point, rectanglePoint1, rectanglePoint2))
                            return true;
                        break;
                }
            }
        }
        return false;
    };
    BarPlot.prototype.drawSelectionPoints = function () {
        if (!this.visible) {
            return;
        }
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return;
        for (var i = params.endIndex - 10; i >= params.startIndex; i = i - 10) {
            var open_2 = params.open[i], high = params.high[i], low = params.low[i], close_2 = params.close[i];
            if (open_2 == null || high == null || low == null || close_2 == null)
                continue;
            var x = params.projection.xByRecord(i), y = params.projection.yByValue((open_2 + close_2) / 2);
            this.drawSelectionCircle(x, y);
        }
    };
    BarPlot.prototype._drawBars = function () {
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return;
        var context = params.context, projection = params.projection, dates = params.dates, xOffset = 0, style = this.plotStyle, isBar = style === BarPlot.Style.OHLC, isHLC = style === BarPlot.Style.HLC;
        if (isBar || isHLC) {
            var columnWidth = this.chart.dateScale.columnWidth, width = Math.max(columnWidth * this.columnWidthRatio, this.minWidth);
            xOffset = Math.round(width / 2);
        }
        context.beginPath();
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var open_3 = params.open[i], high = params.high[i], low = params.low[i], close_3 = params.close[i];
            if (open_3 == null || high == null || low == null || close_3 == null)
                continue;
            high = Math.max(high, open_3);
            low = Math.min(low, open_3);
            var x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column), yHigh = projection.yByValue(high), yLow = projection.yByValue(low);
            if (isBar) {
                var yOpen = projection.yByValue(open_3);
                context.moveTo(x, yOpen);
                context.lineTo(x - xOffset, yOpen);
            }
            if (isBar || isHLC) {
                var yClose = projection.yByValue(close_3);
                context.moveTo(x, yClose);
                context.lineTo(x + xOffset, yClose);
            }
            if (yHigh === yLow)
                yLow--;
            context.moveTo(x, yHigh);
            context.lineTo(x, yLow);
        }
        context.scxApplyStrokeTheme(params.theme);
        context.stroke();
    };
    BarPlot.prototype._drawColoredBars = function () {
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return;
        this._drawColoredBarItems(params, true, params.theme.upBar);
        this._drawColoredBarItems(params, false, params.theme.downBar);
    };
    BarPlot.prototype._drawColoredBarItems = function (params, drawUpBars, theme) {
        var context = params.context, projection = params.projection, style = this.plotStyle, isBar = style === BarPlot.Style.COLORED_OHLC, isHLC = style === BarPlot.Style.COLORED_HLC, xOffset = 0;
        if (isBar || isHLC) {
            var columnWidth = this.chart.dateScale.columnWidth, width = Math.max(columnWidth * this.columnWidthRatio, this.minWidth);
            xOffset = Math.round(width / 2);
        }
        context.beginPath();
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var open_4 = params.open[i], high = params.high[i], low = params.low[i], close_4 = params.close[i], isUp = close_4 >= open_4;
            if (open_4 == null || high == null || low == null || close_4 == null)
                continue;
            if (drawUpBars !== isUp)
                continue;
            high = Math.max(high, open_4);
            low = Math.min(low, open_4);
            var x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByColumn(column), yHigh = projection.yByValue(high), yLow = projection.yByValue(low);
            if (isBar) {
                var yOpen = projection.yByValue(open_4);
                context.moveTo(x, yOpen);
                context.lineTo(x - xOffset, yOpen);
            }
            if (isBar || isHLC) {
                var yClose = projection.yByValue(close_4);
                context.moveTo(x, yClose);
                context.lineTo(x + xOffset, yClose);
            }
            if (yHigh === yLow)
                yLow--;
            context.moveTo(x, yHigh);
            context.lineTo(x, yLow);
        }
        context.scxApplyStrokeTheme(theme);
        context.stroke();
    };
    BarPlot.prototype._drawCandles = function () {
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return;
        var context = params.context, upTheme = params.theme.upCandle, downTheme = params.theme.downCandle;
        this._drawCandleItems(params, true, true, upTheme.border.strokeEnabled);
        context.scxFillStroke(upTheme.fill, upTheme.border);
        this._drawCandleItems(params, false, true, downTheme.border.strokeEnabled);
        context.scxFillStroke(downTheme.fill, downTheme.border);
        this._drawCandleItems(params, true, false, true);
        context.scxStroke(upTheme.wick);
        this._drawCandleItems(params, false, false, true);
        context.scxStroke(downTheme.wick);
    };
    BarPlot.prototype._drawCandleItems = function (params, drawUpBars, drawBody, hasStroke) {
        var context = params.context, projection = params.projection, columnWidth = this.chart.dateScale.columnWidth, width = Math.max(columnWidth * this.columnWidthRatio, this.minWidth), borderXOffset = Math.round(width / 2);
        width = borderXOffset * 2;
        context.beginPath();
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var open_5 = params.open[i], high = params.high[i], low = params.low[i], close_5 = params.close[i], isUp = close_5 >= open_5;
            if (open_5 == null || high == null || low == null || close_5 == null)
                continue;
            if (drawUpBars !== isUp)
                continue;
            high = Math.max(high, open_5);
            low = Math.min(low, open_5);
            var x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByColumn(column), yOpen = projection.yByValue(open_5), yClose = projection.yByValue(close_5);
            var xOffset = hasStroke ? 0 : 0.5;
            var yOffset = hasStroke ? 0 : 0.5;
            if (drawBody) {
                context.rect(x - borderXOffset + xOffset, Math.min(yOpen, yClose) + yOffset, width, Math.max(Math.abs(yOpen - yClose), 1));
            }
            else {
                var yHigh = projection.yByValue(high), yLow = projection.yByValue(low);
                context.moveTo(x, Math.min(yOpen, yClose));
                context.lineTo(x, yHigh);
                context.moveTo(x, Math.max(yOpen, yClose));
                context.lineTo(x, yLow);
            }
        }
    };
    BarPlot.prototype._drawHollowCandles = function () {
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return;
        var context = params.context, upTheme = params.theme.upCandle, downTheme = params.theme.downCandle, upHollowTheme = params.theme.upHollowCandle, downHollowTheme = params.theme.downHollowCandle;
        this._drawHollowCandleItems(params, true, true, false);
        context.scxStroke(upHollowTheme.border);
        this._drawHollowCandleItems(params, true, true, true);
        context.scxStroke(upHollowTheme.wick);
        this._drawHollowCandleItems(params, true, false, false);
        context.scxFillStroke(upTheme.fill, upTheme.border);
        this._drawHollowCandleItems(params, true, false, true);
        context.scxStroke(upTheme.wick);
        this._drawHollowCandleItems(params, false, true, false);
        context.scxStroke(downHollowTheme.border);
        this._drawHollowCandleItems(params, false, true, true);
        context.scxStroke(downHollowTheme.wick);
        this._drawHollowCandleItems(params, false, false, false);
        context.scxFillStroke(downTheme.fill, downTheme.border);
        this._drawHollowCandleItems(params, false, false, true);
        context.scxStroke(downTheme.wick);
    };
    BarPlot.prototype._drawHollowCandleItems = function (params, drawUpBars, drawHollowBars, drawWicks) {
        var context = params.context, projection = params.projection, prevClose = null, columnWidth = this.chart.dateScale.columnWidth, barWidth = Math.max(columnWidth * this.columnWidthRatio, this.minWidth), halfBarWidth = Math.round(barWidth / 2);
        barWidth = halfBarWidth * 2;
        for (var j = params.startIndex - 1; j >= 0; j--) {
            if (params.open[j] == null && params.high[j] == null && params.low[j] == null && params.close[j] == null) {
                prevClose = params.close[j];
                break;
            }
        }
        context.beginPath();
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var open_6 = params.open[i], high = params.high[i], low = params.low[i], close_6 = params.close[i];
            if (open_6 == null || high == null || low == null || close_6 == null)
                continue;
            if (prevClose == null)
                prevClose = open_6;
            high = Math.max(high, open_6);
            low = Math.min(low, open_6);
            var isUp = close_6 >= prevClose, isHollow = close_6 > open_6;
            prevClose = close_6;
            if ((drawUpBars !== isUp) || (drawHollowBars !== isHollow))
                continue;
            var x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByColumn(column), yOpen = projection.yByValue(open_6), yClose = projection.yByValue(close_6);
            if (drawWicks) {
                var yHigh = projection.yByValue(high), yLow = projection.yByValue(low);
                context.moveTo(x, Math.min(yOpen, yClose));
                context.lineTo(x, yHigh);
                context.moveTo(x, Math.max(yOpen, yClose));
                context.lineTo(x, yLow);
            }
            else {
                context.rect(x - halfBarWidth, Math.min(yOpen, yClose), barWidth, Math.max(Math.abs(yOpen - yClose), 1));
            }
        }
    };
    BarPlot.prototype._drawBricks = function () {
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return;
        this._drawBrickItems(params, true);
        this._drawBrickItems(params, false);
    };
    BarPlot.prototype._drawBrickItems = function (params, drawUpBars) {
        var context = params.context, projection = params.projection, columnWidth = this.chart.dateScale.columnWidth, brickWidth = Math.max(columnWidth * this.columnWidthRatio, this.minWidth), halfBrickWidth = Math.round(brickWidth / 2);
        context.beginPath();
        for (var i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            var open_7 = params.open[i], close_7 = params.close[i], isUp = close_7 >= open_7;
            brickWidth = halfBrickWidth * 2;
            if (open_7 == null || close_7 == null)
                continue;
            if ((drawUpBars && !isUp) || (!drawUpBars && isUp))
                continue;
            var x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByColumn(column), yOpen = projection.yByValue(open_7), yClose = projection.yByValue(close_7);
            context.rect(x - halfBrickWidth, Math.min(yOpen, yClose), brickWidth, Math.max(Math.abs(yOpen - yClose), 1));
        }
        var theme = drawUpBars ? params.theme.upCandle : params.theme.downCandle;
        context.scxFillStroke(theme.fill, theme.border);
    };
    BarPlot.prototype._drawKagi = function () {
        var params = this._barDrawParams();
        if (params.values.length === 0)
            return;
        this._drawKagiItems(params, true);
        this._drawKagiItems(params, false);
    };
    BarPlot.prototype._drawKagiItems = function (params, drawUpLine) {
        var context = params.context, projection = params.projection, prevX = null, isCurrentLineUp = null, switchLine = false, checkPrice = null;
        context.beginPath();
        for (var i = 0; i < params.endIndex; i++) {
            var open_8 = params.open[i], close_8 = params.close[i], price1 = open_8, price2 = close_8, drawConnectionLine = true;
            if (open_8 == null || close_8 == null)
                continue;
            if (isCurrentLineUp === null) {
                isCurrentLineUp = close_8 >= open_8;
                drawConnectionLine = false;
            }
            else if (isCurrentLineUp) {
                if (close_8 < checkPrice) {
                    switchLine = true;
                    drawConnectionLine = drawUpLine;
                    price1 = drawUpLine ? open_8 : checkPrice;
                    price2 = drawUpLine ? checkPrice : close_8;
                }
            }
            else {
                if (close_8 > checkPrice) {
                    switchLine = true;
                    drawConnectionLine = !drawUpLine;
                    price1 = drawUpLine ? checkPrice : open_8;
                    price2 = drawUpLine ? close_8 : checkPrice;
                }
            }
            var x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByRecord(i);
            if (i >= params.startIndex && ((isCurrentLineUp == drawUpLine) || switchLine)) {
                var y1 = projection.yByValue(price1), y2 = projection.yByValue(price2);
                if (drawConnectionLine) {
                    context.moveTo(prevX, y1);
                    context.lineTo(x, y1);
                }
                else {
                    context.moveTo(x, y1);
                }
                context.lineTo(x, y2);
            }
            prevX = x;
            if (isCurrentLineUp) {
                checkPrice = switchLine ? Math.max(open_8, close_8) : Math.min(open_8, close_8);
            }
            else {
                checkPrice = switchLine ? Math.min(open_8, close_8) : Math.max(open_8, close_8);
            }
            if (switchLine) {
                isCurrentLineUp = !isCurrentLineUp;
                switchLine = false;
            }
        }
        var theme = params.theme[drawUpLine ? "upCandle" : "downCandle"].border;
        context.scxStroke(theme);
    };
    BarPlot.prototype.updateRenkoDataSeries = function () {
        var renkoPriceStyle = this.chart.priceStyle, boxSize = renkoPriceStyle.boxSizeValue, dataManager = this.chart.dataManager, dataSeries = BarConverter.convertToRenko(dataManager.barDataSeries(), boxSize);
        this.dataSeries = [
            dataSeries.close,
            dataSeries.high,
            dataSeries.low,
            dataSeries.open,
        ];
    };
    BarPlot.prototype.updateHeikinAshiDataSeries = function () {
        var dataManager = this.chart.dataManager, dataSeries = BarConverter.convertToHeikinAshi(dataManager.ohlcDataSeries(), dataManager.ohlcDataSeries(DataSeriesSuffix.HEIKIN_ASHI));
        this.dataSeries = [
            dataSeries.close,
            dataSeries.high,
            dataSeries.low,
            dataSeries.open
        ];
    };
    BarPlot.Style = BarPlotStyle;
    BarPlot.defaults = {
        plotStyle: BarPlotStyle.CANDLE,
        minWidth: 1,
        columnWidthRatio: 0.8
    };
    return BarPlot;
}(Plot));
export { BarPlot };
//# sourceMappingURL=BarPlot.js.map