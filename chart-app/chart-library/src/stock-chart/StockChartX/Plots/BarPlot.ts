/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IPlotConfig, IPlotOptions, IPlotDefaults, Plot, IPlotBarDrawParams, PlotEvent} from './Plot';
import {JsUtil} from "../Utils/JsUtil";
import {IPoint} from "../Graphics/ChartPoint";
import {HtmlUtil} from "../Utils/HtmlUtil";
import {Geometry} from "../Graphics/Geometry";
import {BarConverter} from "../Data/BarConverter";
import {RenkoPriceStyle} from "../PriceStyles/RenkoPriceStyle";
import {DataSeriesSuffix} from '../Data/DataSeries';
import {BarPlotTheme, CandlePlotTheme, HollowCandlePlotTheme, IStrokeTheme, PlotTheme, WicklessCandlePlotTheme} from '../Theme';
import {Chart} from '../Chart';

export interface IBarPlotOptions extends IPlotOptions {
    columnWidthRatio: number;
    minWidth: number;
}

export interface IBarPlotConfig extends IPlotConfig {
    columnWidthRatio?: number;
    minWidth?: number;
}

export interface IBarPlotDefaults extends IPlotDefaults {
    columnWidthRatio: number;
    minWidth: number;
}

const BarPlotStyle = {
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

export class BarPlot extends Plot {
    static Style = BarPlotStyle;

    static defaults: IBarPlotDefaults = {
        plotStyle: BarPlotStyle.CANDLE,
        minWidth: 1,
        columnWidthRatio: 0.8
    };

    get columnWidthRatio(): number {
        let ratio = (<IBarPlotOptions> this._options).columnWidthRatio;

        return ratio || BarPlot.defaults.columnWidthRatio;
    }

    set columnWidthRatio(value: number) {
        if (JsUtil.isNegativeNumber(value) || value > 1)
            throw new Error("Ratio must be in range [0..1]");

        this._setOption("columnWidthRatio", value, PlotEvent.COLUMN_WIDTH_RATIO_CHANGED);
    }

    get minWidth(): number {
        let width = (<IBarPlotOptions> this._options).minWidth;

        return width || BarPlot.defaults.minWidth;
    }

    set minWidth(value: number) {
        if (!JsUtil.isPositiveNumber(value))
            throw new Error("Min width must be greater than 0.");

        this._setOption("minWidth", value, PlotEvent.MIN_WIDTH_CHANGED);
    }

    constructor(chart:Chart, config?: IBarPlotConfig) {
        super(chart, config);

        this._plotThemeKey = 'bar';
    }

    /**
     * inheritdoc
     */

    updateDataSeriesIfNeeded() {
        switch (this.plotStyle) {
            case BarPlotStyle.RENKO:
                this.updateRenkoDataSeries();
                break;
            case BarPlotStyle.HEIKIN_ASHI:
                this.updateHeikinAshiDataSeries();
                break;
        }
    }

    draw() {
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
    }

    drawValueMarkers() {
        if (!this.showValueMarkers)
            return;

        let marker = this.chart.valueMarker,
            markerTheme = marker.theme,
            drawParams = this._barDrawParams();

        if (drawParams.values.length === 0)
            return;

        let lastIdx = Math.ceil(this.chart.dateScale.lastVisibleRecord);
        if(!this.dataSeries[0].valueAtIndex(lastIdx)) {
            lastIdx = drawParams.values.length - 1;
        }


        let isUp = drawParams.close[lastIdx] >= drawParams.open[lastIdx],
            fillColor: string;
        switch (this.plotStyle) {
            case BarPlotStyle.OHLC:
            case BarPlotStyle.HLC:
            case BarPlotStyle.HL:
                fillColor = (drawParams.theme as IStrokeTheme).strokeColor;
                break;
            case BarPlotStyle.COLORED_OHLC:
            case BarPlotStyle.COLORED_HLC:
            case BarPlotStyle.COLORED_HL:
                fillColor = isUp ? (drawParams.theme as BarPlotTheme).upBar.strokeColor : (drawParams.theme as BarPlotTheme).downBar.strokeColor;
                break;
            case BarPlotStyle.CANDLE:
            case BarPlotStyle.HOLLOW_CANDLE:
            case BarPlotStyle.HEIKIN_ASHI:
            case BarPlotStyle.RENKO:
                fillColor = isUp ? (drawParams.theme as CandlePlotTheme).upCandle.fill.fillColor : (drawParams.theme as CandlePlotTheme).downCandle.fill.fillColor;
                break;
            case BarPlotStyle.LINE_BREAK:
                fillColor = isUp ? (drawParams.theme as WicklessCandlePlotTheme).upCandle.border.strokeColor : (drawParams.theme as WicklessCandlePlotTheme).downCandle.fill.fillColor;
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
    }

    hitTest(point: IPoint): boolean {
        let params = this._barDrawParams();
        if (params.values.length === 0)
            return false;

        let columnWidth = this.chart.dateScale.columnWidth,
            width = Math.max(columnWidth * this.columnWidthRatio, this.minWidth);

        let xOffset = Math.round(width / 2);

        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let open = params.open[i],
                high = params.high[i],
                low = params.low[i],
                close = params.close[i];
            if (open == null || close == null)
                continue;

            high = Math.max(high, open);
            low = Math.min(low, open);

            let x = params.dates ? this.projection.xByDate(params.dates[i]) : this.projection.xByColumn(column);

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

                        let yHigh = this.projection.yByValue(high),
                            yLow = this.projection.yByValue(low);

                        let recPoint1 = {x: x - xOffset, y: yHigh};
                        let recPoint2 = {x: x + xOffset, y: yLow};

                        if (Geometry.isPointInsideOrNearRectPoints(point, recPoint1, recPoint2))
                            return true;
                        break;
                    case BarPlotStyle.RENKO:
                    case BarPlotStyle.LINE_BREAK:
                        let yOpen = this.projection.yByValue(open),
                            yClose = this.projection.yByValue(close);

                        let rectanglePoint1 = {x: x - xOffset, y: Math.min(yOpen, yClose)};
                        let rectanglePoint2 = {
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
    }

    public drawSelectionPoints(): void {
        if (!this.visible) {
            return;
        }

        let params = this._barDrawParams();
        if (params.values.length === 0)
            return;

        for (let i = params.endIndex - 10; i >= params.startIndex; i = i - 10) {
            let open = params.open[i],
                high = params.high[i],
                low = params.low[i],
                close = params.close[i];
            if (open == null || high == null || low == null || close == null)
                continue;

            let x = params.projection.xByRecord(i),
                y = params.projection.yByValue((open + close) / 2);

            this.drawSelectionCircle(x, y);
        }
    }

    private _drawBars() {
        let params = this._barDrawParams();
        if (params.values.length === 0)
            return;

        let context = params.context,
            projection = params.projection,
            dates = params.dates,
            xOffset = 0,
            style = this.plotStyle,
            isBar = style === BarPlot.Style.OHLC,
            isHLC = style === BarPlot.Style.HLC;

        if (isBar || isHLC) {
            let columnWidth = this.chart.dateScale.columnWidth,
                width = Math.max(columnWidth * this.columnWidthRatio, this.minWidth);

            xOffset = Math.round(width / 2);
        }

        context.beginPath();
        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let open = params.open[i],
                high = params.high[i],
                low = params.low[i],
                close = params.close[i];
            if (open == null || high == null || low == null || close == null)
                continue;

            high = Math.max(high, open);
            low = Math.min(low, open);

            let x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column),
                yHigh = projection.yByValue(high),
                yLow = projection.yByValue(low);

            if (isBar) {
                let yOpen = projection.yByValue(open);

                context.moveTo(x, yOpen);
                context.lineTo(x - xOffset, yOpen);
            }

            if (isBar || isHLC) {
                let yClose = projection.yByValue(close);

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
    }

    private _drawColoredBars() {
        let params = this._barDrawParams();
        if (params.values.length === 0)
            return;

        this._drawColoredBarItems(params, true, (params.theme as BarPlotTheme).upBar);
        this._drawColoredBarItems(params, false, (params.theme as BarPlotTheme).downBar);
    }

    private _drawColoredBarItems(params: IPlotBarDrawParams, drawUpBars: boolean, theme: PlotTheme) {
        let context = params.context,
            projection = params.projection,
            style = this.plotStyle,
            isBar = style === BarPlot.Style.COLORED_OHLC,
            isHLC = style === BarPlot.Style.COLORED_HLC,
            xOffset = 0;

        if (isBar || isHLC) {
            let columnWidth = this.chart.dateScale.columnWidth,
                width = Math.max(columnWidth * this.columnWidthRatio, this.minWidth);

            xOffset = Math.round(width / 2);
        }

        context.beginPath();
        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let open = params.open[i],
                high = params.high[i],
                low = params.low[i],
                close = params.close[i],
                isUp = close >= open;

            if (open == null || high == null || low == null || close == null)
                continue;
            if (drawUpBars !== isUp)
                continue;

            high = Math.max(high, open);
            low = Math.min(low, open);

            let x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByColumn(column),
                yHigh = projection.yByValue(high),
                yLow = projection.yByValue(low);

            if (isBar) {
                let yOpen = projection.yByValue(open);

                context.moveTo(x, yOpen);
                context.lineTo(x - xOffset, yOpen);
            }

            if (isBar || isHLC) {
                let yClose = projection.yByValue(close);

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
    }

    private _drawCandles() {
        let params = this._barDrawParams();
        if (params.values.length === 0)
            return;

        let context = params.context,
            upTheme = (params.theme as CandlePlotTheme).upCandle,
            downTheme = (params.theme as CandlePlotTheme).downCandle;

        // Draw up candles
        this._drawCandleItems(params, true, true, upTheme.border.strokeEnabled);
        context.scxFillStroke(upTheme.fill, upTheme.border);

        // Draw down candles
        this._drawCandleItems(params, false, true, downTheme.border.strokeEnabled);
        context.scxFillStroke(downTheme.fill, downTheme.border);

        // Draw up wicks
        this._drawCandleItems(params, true, false, true);
        context.scxStroke(upTheme.wick);

        // Draw down wicks
        this._drawCandleItems(params, false, false, true);
        context.scxStroke(downTheme.wick);
    }

    private _drawCandleItems(params: IPlotBarDrawParams, drawUpBars: boolean, drawBody: boolean, hasStroke:boolean) {
        let context = params.context,
            projection = params.projection,
            columnWidth = this.chart.dateScale.columnWidth,
            width = Math.max(columnWidth * this.columnWidthRatio, this.minWidth),
            borderXOffset = Math.round(width / 2);

        width = borderXOffset * 2;

        context.beginPath();
        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let open = params.open[i],
                high = params.high[i],
                low = params.low[i],
                close = params.close[i],
                isUp = close >= open;

            if (open == null || high == null || low == null || close == null)
                continue;
            if (drawUpBars !== isUp)
                continue;

            high = Math.max(high, open);
            low = Math.min(low, open);

            let x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByColumn(column),
                yOpen = projection.yByValue(open),
                yClose = projection.yByValue(close);

            //////////////////////////////////////////////////////////////////////////////////////////////////////
            // MA where there is "no" stroke, we need to 0.5 pixel in order for the body not to be blurry.
            // To know why, google it ;-)
            let xOffset = hasStroke ? 0 : 0.5;
            let yOffset = hasStroke ? 0 : 0.5;
            //////////////////////////////////////////////////////////////////////////////////////////////////////

            if (drawBody) {
                context.rect(x - borderXOffset + xOffset, Math.min(yOpen, yClose) + yOffset, width, Math.max(Math.abs(yOpen - yClose), 1));
            } else {
                // Draw wick
                let yHigh = projection.yByValue(high),
                    yLow = projection.yByValue(low);

                context.moveTo(x, Math.min(yOpen, yClose));
                context.lineTo(x, yHigh);

                context.moveTo(x, Math.max(yOpen, yClose));
                context.lineTo(x, yLow);
            }
        }
    }

    private _drawHollowCandles() {
        let params = this._barDrawParams();
        if (params.values.length === 0)
            return;

        let context = params.context,
            upTheme = (params.theme as CandlePlotTheme).upCandle,
            downTheme = (params.theme as CandlePlotTheme).downCandle,
            upHollowTheme = (params.theme as HollowCandlePlotTheme).upHollowCandle,
            downHollowTheme = (params.theme as HollowCandlePlotTheme).downHollowCandle;

        // Up hollow body
        this._drawHollowCandleItems(params, true, true, false);
        context.scxStroke(upHollowTheme.border);
        // Up hollow wick
        this._drawHollowCandleItems(params, true, true, true);
        context.scxStroke(upHollowTheme.wick);

        // Up fill body
        this._drawHollowCandleItems(params, true, false, false);
        context.scxFillStroke(upTheme.fill, upTheme.border);
        // Up fill wick
        this._drawHollowCandleItems(params, true, false, true);
        context.scxStroke(upTheme.wick);

        // Down hollow body
        this._drawHollowCandleItems(params, false, true, false);
        context.scxStroke(downHollowTheme.border);
        // Down hollow wick
        this._drawHollowCandleItems(params, false, true, true);
        context.scxStroke(downHollowTheme.wick);

        // Down fill body
        this._drawHollowCandleItems(params, false, false, false);
        context.scxFillStroke(downTheme.fill, downTheme.border);
        // Down fill wick
        this._drawHollowCandleItems(params, false, false, true);
        context.scxStroke(downTheme.wick);
    }

    private _drawHollowCandleItems(params: IPlotBarDrawParams, drawUpBars: boolean, drawHollowBars: boolean, drawWicks: boolean) {
        let context = params.context,
            projection = params.projection,
            prevClose: number = null,
            columnWidth = this.chart.dateScale.columnWidth,
            barWidth = Math.max(columnWidth * this.columnWidthRatio, this.minWidth),
            halfBarWidth = Math.round(barWidth / 2);

        barWidth = halfBarWidth * 2;

        for (let j = params.startIndex - 1; j >= 0; j--) {
            if (params.open[j] == null && params.high[j] == null && params.low[j] == null && params.close[j] == null) {
                prevClose = params.close[j];
                break;
            }
        }

        context.beginPath();
        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let open = params.open[i],
                high = params.high[i],
                low = params.low[i],
                close = params.close[i];

            if (open == null || high == null || low == null || close == null)
                continue;
            if (prevClose == null)
                prevClose = open;

            high = Math.max(high, open);
            low = Math.min(low, open);

            let isUp = close >= prevClose,
                isHollow = close > open;

            prevClose = close;

            if ((drawUpBars !== isUp) || (drawHollowBars !== isHollow))
                continue;

            let x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByColumn(column),
                yOpen = projection.yByValue(open),
                yClose = projection.yByValue(close);

            if (drawWicks) {
                let yHigh = projection.yByValue(high),
                    yLow = projection.yByValue(low);

                context.moveTo(x, Math.min(yOpen, yClose));
                context.lineTo(x, yHigh);

                context.moveTo(x, Math.max(yOpen, yClose));
                context.lineTo(x, yLow);
            } else {
                context.rect(x - halfBarWidth, Math.min(yOpen, yClose), barWidth, Math.max(Math.abs(yOpen - yClose), 1));
            }
        }
    }

    private _drawBricks() {
        let params = this._barDrawParams();
        if (params.values.length === 0)
            return;

        // Draw up bars.
        this._drawBrickItems(params, true);

        // Draw down bars.
        this._drawBrickItems(params, false);
    }

    private _drawBrickItems(params: IPlotBarDrawParams, drawUpBars: boolean) {
        let context = params.context,
            projection = params.projection,
            columnWidth = this.chart.dateScale.columnWidth,
            brickWidth = Math.max(columnWidth * this.columnWidthRatio, this.minWidth),
            halfBrickWidth = Math.round(brickWidth / 2);

        context.beginPath();

        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let open = params.open[i],
                close = params.close[i],
                isUp = close >= open;

            brickWidth = halfBrickWidth * 2;

            if (open == null || close == null)
                continue;
            if ((drawUpBars && !isUp) || (!drawUpBars && isUp))
                continue;

            let x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByColumn(column),
                yOpen = projection.yByValue(open),
                yClose = projection.yByValue(close);

            context.rect(x - halfBrickWidth, Math.min(yOpen, yClose), brickWidth, Math.max(Math.abs(yOpen - yClose), 1));
        }

        let theme = drawUpBars ? (params.theme as CandlePlotTheme).upCandle : (params.theme as CandlePlotTheme).downCandle;
        context.scxFillStroke(theme.fill, theme.border);
    }

    private _drawKagi() {
        let params = this._barDrawParams();
        if (params.values.length === 0)
            return;

        // Draw up lines
        this._drawKagiItems(params, true);

        // Draw down lines
        this._drawKagiItems(params, false);
    }

    private _drawKagiItems(params: IPlotBarDrawParams, drawUpLine: boolean) {
        let context = params.context,
            projection = params.projection,
            prevX: number = null,
            isCurrentLineUp: boolean = null,
            switchLine = false,
            checkPrice: number = null;

        context.beginPath();
        for (let i = 0; i < params.endIndex; i++) {
            let open = params.open[i],
                close = params.close[i],
                price1 = open,
                price2 = close,
                drawConnectionLine = true;

            if (open == null || close == null)
                continue;

            if (isCurrentLineUp === null) {
                // Initial state
                isCurrentLineUp = close >= open;
                drawConnectionLine = false;
            } else if (isCurrentLineUp) {
                // it's falling bar.
                if (close < checkPrice) {
                    // draw line to the prev check price
                    switchLine = true;
                    drawConnectionLine = drawUpLine;
                    price1 = drawUpLine ? open : checkPrice;
                    price2 = drawUpLine ? checkPrice : close;
                }
            } else {
                // It's raising bar.
                if (close > checkPrice) {
                    // draw line to prev check price
                    switchLine = true;
                    drawConnectionLine = !drawUpLine;
                    price1 = drawUpLine ? checkPrice : open;
                    price2 = drawUpLine ? close : checkPrice;
                }
            }

            let x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByRecord(i);
            if (i >= params.startIndex && ((isCurrentLineUp == drawUpLine) || switchLine)) {
                let y1 = projection.yByValue(price1),
                    y2 = projection.yByValue(price2);

                if (drawConnectionLine) {
                    context.moveTo(prevX, y1);
                    context.lineTo(x, y1);
                } else {
                    context.moveTo(x, y1);
                }
                context.lineTo(x, y2);
            }
            prevX = x;

            if (isCurrentLineUp) {
                checkPrice = switchLine ? Math.max(open, close) : Math.min(open, close);
            } else {
                checkPrice = switchLine ? Math.min(open, close) : Math.max(open, close);
            }

            if (switchLine) {
                isCurrentLineUp = !isCurrentLineUp;
                switchLine = false;
            }
        }

        let theme = params.theme[drawUpLine ? "upCandle" : "downCandle"].border;
        context.scxStroke(theme);
    }

    private updateRenkoDataSeries() {
        let renkoPriceStyle = (<RenkoPriceStyle>this.chart.priceStyle),
            boxSize = renkoPriceStyle.boxSizeValue,
            dataManager = this.chart.dataManager,
            dataSeries = BarConverter.convertToRenko(dataManager.barDataSeries(), boxSize);

        this.dataSeries = [
            dataSeries.close,
            dataSeries.high,
            dataSeries.low,
            dataSeries.open,
        ];
    }

    private updateHeikinAshiDataSeries() {
        let dataManager = this.chart.dataManager,
            dataSeries = BarConverter.convertToHeikinAshi(dataManager.ohlcDataSeries(), dataManager.ohlcDataSeries(DataSeriesSuffix.HEIKIN_ASHI));

        this.dataSeries = [
            dataSeries.close,
            dataSeries.high,
            dataSeries.low,
            dataSeries.open
        ];
    }
}
