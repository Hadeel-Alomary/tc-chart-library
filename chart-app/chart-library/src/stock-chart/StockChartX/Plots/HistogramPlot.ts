/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IPlotConfig, IPlotDefaults, IPlotOptions, Plot, PlotEvent} from './Plot';
import {JsUtil} from "../Utils/JsUtil";
import {IPoint} from "../Graphics/ChartPoint";
import {Geometry} from "../Graphics/Geometry";
import {HtmlUtil} from "../Utils/HtmlUtil";
import {IMinMaxValues} from "../Data/DataSeries";
import {ColumnPlotTheme, FilledWithBorderTheme, PlotTheme} from '../Theme';
import {Chart} from '../Chart';

export interface IHistogramPlotOptions extends IPlotOptions {
    baseValue: number;
    columnWidthRatio: number;
    minColumnWidth: number;
}

export interface IHistogramPlotConfig extends IPlotConfig {
    baseValue?: number;
    columnWidthRatio?: number;
    minColumnWidth?: number;
}

export interface IHistogramPlotDefaults extends IPlotDefaults {
    baseValue: number;
    columnWidthRatio: number;
    minWidth: number;
}

const HistogramPlotStyle = {
    COLUMNBYPRICE: 'columnByPrice',
    COLUMNBYVALUE: 'columnByValue'
};
Object.freeze(HistogramPlotStyle);


/**
 * Represents histogram plot.
 * @param {Object} [config] The configuration object.
 * @constructor HistogramPlot
 * @augments Plot
 * @example
 *  var plot = new HistogramPlot({
     *      dataSeries: volumeDataSeries
     *  });
 */
export class HistogramPlot extends Plot {
    static Style = HistogramPlotStyle;

    static defaults: IHistogramPlotDefaults = {
        plotStyle: HistogramPlotStyle.COLUMNBYPRICE,
        baseValue: 0.0,
        columnWidthRatio: 0.5,
        minWidth: 1
    };

    /**
     * Gets/Sets base value.
     * @name baseValue
     * @type {number}
     * @memberOf HistogramPlot#
     */
    get baseValue(): number {
        let value = (<IHistogramPlotOptions> this._options).baseValue;

        return value != null ? value : HistogramPlot.defaults.baseValue;
    }

    set baseValue(value: number) {
        if (!JsUtil.isFiniteNumber(value))
            throw new TypeError("Value must be a finite number.");

        this._setOption("baseValue", value, PlotEvent.BASE_VALUE_CHANGED);
    }

    /**
     * Gets/Sets histogram column width ratio.
     * @name columnWidthRatio
     * It is used if plot style is set to HistogramPlot.COLUMN.
     * The value must be in range (0..1].
     * @type {number}
     * @memberOf HistogramPlot#
     */
    get columnWidthRatio(): number {
        let ratio = (<IHistogramPlotOptions> this._options).columnWidthRatio;

        return ratio || HistogramPlot.defaults.columnWidthRatio;
    }

    set columnWidthRatio(value: number) {
        if (JsUtil.isNegativeNumber(value) || value > 1)
            throw new Error("Ratio must be in range (0..1]");

        this._setOption("columnWidthRatio", value, PlotEvent.COLUMN_WIDTH_RATIO_CHANGED);
    }

    /**
     * Gets/Sets min width of histogram column.
     * @name minColumnWidth
     * It is used if plot style is set to HistogramPlot.Style.COLUMN.
     * @type {number}
     * @memberOf HistogramPlot#
     */
    get minColumnWidth(): number {
        let width = (<IHistogramPlotOptions> this._options).minColumnWidth;

        return width || HistogramPlot.defaults.minWidth;
    }

    set minColumnWidth(value: number) {
        if (!JsUtil.isPositiveNumber(value))
            throw new Error("Min width must be a positive number.");

        this._setOption("minColumnWidth", value, PlotEvent.MIN_WIDTH_CHANGED);
    }

    constructor(chart:Chart, config?: IHistogramPlotConfig) {
        super(chart, config);

        this._plotThemeKey = 'histogram';
    }

    /**
     * @inheritdoc
     */
    draw() {
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
    }

    public drawSelectionPoints(): void {
        if (!this.visible) {
            return;
        }

        let params = this._barDrawParams();
        if (params.values.length === 0)
            return;

        for (let i = params.endIndex - 10; i >= params.startIndex; i = i - 10) {
            let value = params.values[i];
            if (value == null || isNaN(value))
                continue;

            let x = params.projection.xByRecord(i),
                y = params.projection.yByValue(value);

            this.drawSelectionCircle(x, y);
        }
    }

    private _drawColumnsByValue() {
        this._drawColoredColumns(false, true);
    }

    private _drawColumnsByPrice() {
        this._drawColoredColumns(true, false);
    }

    private _drawColoredColumns(byPrice: boolean, byValue: boolean) {
        let params = this._barDrawParams();
        if (params.values.length === 0)
            return;

        let context = params.context,
            projection = params.projection,
            dates = params.dates,
            yBaseValue = projection.yByValue(this.baseValue),
            columnWidth = this.chart.dateScale.columnWidth,
            xOffset = Math.round(Math.max(columnWidth * this.columnWidthRatio, this.minColumnWidth) / 2),
            width = xOffset * 2,
            y: number;

        let _drawColumns = function (theme: FilledWithBorderTheme, drawUpColumns: boolean) {
            context.beginPath();

            let prevX: number = null,
                maxValue = -Infinity;

            for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
                let value = params.values[i];
                if (value == null)
                    continue;

                let upColumn: boolean = false;
                if (byPrice) {
                    let close = this.chart.barDataSeries().close.valueAtIndex(i);
                    let open = this.chart.barDataSeries().open.valueAtIndex(i);

                    upColumn = close >= open;
                    if (upColumn)
                        if (!drawUpColumns)
                            continue;
                } else if (byValue) {
                    upColumn = value >= 0;

                    if (upColumn)
                        if (!drawUpColumns)
                            continue;
                }

                let x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column);
                if (x === prevX) {
                    maxValue = Math.max(maxValue, value);
                } else {
                    if (prevX !== null) {
                        y = projection.yByValue(maxValue);
                        // MA Add 0.5 to disable anti-aliasing
                        // http://stackoverflow.com/questions/195262/can-i-turn-off-antialiasing-on-an-html-canvas-element
                        context.rect(prevX - xOffset, Math.min(y, yBaseValue), width, Math.max(Math.abs(y - yBaseValue), 1));
                    }
                    maxValue = value;
                    prevX = x;
                }
            }
            y = projection.yByValue(maxValue);
            // MA Add 0.5 to disable anti-aliasing
            // http://stackoverflow.com/questions/195262/can-i-turn-off-antialiasing-on-an-html-canvas-element
            context.rect(prevX - xOffset, Math.min(y, yBaseValue), width, Math.max(Math.abs(y - yBaseValue), 1));
            context.scxFillStroke(theme.fill, theme.border);
        }.bind(this);

        _drawColumns((params.theme as ColumnPlotTheme).upColumn, true);
        _drawColumns((params.theme as ColumnPlotTheme).downColumn, false);
    }


    hitTest(point: IPoint): boolean {
        let params = this._barDrawParams();
        if (params.values.length === 0)
            return false;

        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let value = params.values[i];

            if (value == null)
                continue;

            let x = this.projection.xByColumn(column);
            let xOffset = Math.max(this.chart.dateScale.columnWidth * this.columnWidthRatio, this.minColumnWidth) / 2;

            if (x - xOffset <= point.x && point.x <= x + xOffset) {

                let y = this.projection.yByValue(value);
                let baseY = this.projection.yByValue(this.baseValue);

                let rectanglePoint1 = {x: x - xOffset, y: baseY};
                let rectanglePoint2 = {x: x + xOffset, y: y};

                if (Geometry.isPointInsideOrNearRectPoints(point, rectanglePoint1, rectanglePoint2))
                    return true;
            }
        }
        return false;
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
        let isUp: boolean,
            fillColor: string;

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
    }

    updateMinMaxForSomePlotsIfNeeded(min: number, max: number): IMinMaxValues<number> {
        if (this.plotStyle == 'columnByPrice') {
            return {
                min: this.baseValue,
                max: max
            }
        }

        return {
            min: min,
            max: max
        };
    }
}
