/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {DateScale} from './DateScale';
import {ChartPanelValueScale} from './ChartPanelValueScale';
import {AxisScaleType} from './axis-scale-type';
import {ChartAccessorService} from '../../../services/chart';
import {Interval, IntervalType, Market} from '../../../services/loader';
import {MarketUtils, Tc} from '../../../utils';
import {IntervalUtils} from '../../../utils/interval.utils';
import {ProjectionDebugger} from './ProjectionDebugger';
import {Rect} from '../..';

/**
 * Represent projection. Converts records to pixels, pixels to records, etc...
 * @param {DateScale} [dateScale] The corresponding date scale.
 * @param {ChartPanelValueScale} [valueScale] The corresponding value scale.
 * @constructor Projection
 */
export class Projection {


    private _dateScale: DateScale;
    /**
     * Gets corresponding date scale.
     * @name dateScale
     * @returns {DateScale}
     * @readonly
     * @memberOf Projection#
     */
    get dateScale(): DateScale {
        return this._dateScale;
    }

    private _valueScale: ChartPanelValueScale;
    /**
     * Gets corresponding value scale.
     * @name valueScale
     * @returns {ChartPanelValueScale}
     * @readonly
     * @memberOf Projection#
     */
    get valueScale(): ChartPanelValueScale {
        return this._valueScale;
    }

    /**
     * Determines if X coordinate can be resolved. X coordinate can be resolved if date scale is specified.
     * @name canResolveX
     * @type {Boolean}
     * @memberOf Projection#
     * @see [canResolveY]{@linkcode Projection#canResolveY}
     */
    get canResolveX(): boolean {
        return !!this._dateScale;
    }

    /**
     * Determines if Y coordinate can be resolved. Y coordinate can be resolved if value scale is specified.
     * @name canResolveY
     * @type {Boolean}
     * @memberOf Projection#
     * * @see [canResolveX]{@linkcode Projection#canResolveX}
     */
    get canResolveY(): boolean {
        return !!this._valueScale;
    }

    constructor(dateScale: DateScale, valueScale?: ChartPanelValueScale) {
        this._dateScale = dateScale;
        this._valueScale = valueScale;
    }

    /**
     * Returns column number by record.
     * @method columnByRecord
     * @param {Number} record The record.
     * @param {boolean} [isIntegral=true] The flag that indicates whether resulting column should be integral number.
     * @returns {number} Column number.
     * @memberOf Projection#
     * @see [recordByColumn]{@linkcode Projection#recordByColumn}
     * @see [columnByX]{@linkcode Projection#columnByX}
     * @see [columnByDate]{@linkcode Projection#columnByDate}
     */
    columnByRecord(record: number, isIntegral?: boolean): number {
        let column = record - Math.trunc(this._dateScale.firstVisibleRecord);
        if (isIntegral !== false)
            column = Math.trunc(column);

        return column;
    }

    /**
     * Returns record index by column number.
     * @method recordByColumn
     * @param {Number} column The column number.
     * @param {boolean} [isIntegral = true] The flag that indicates whether resulting record should be an integral number.
     * @returns {Number}
     * @memberOf Projection#
     * @see [columnByRecord]{@linkcode Projection#columnByRecord}
     * @see [recordByX]{@linkcode Projection#recordByX}
     * @see [recordByDate]{@linkcode Projection#recordByDate}
     */
    recordByColumn(column: number, isIntegral?: boolean): number {
        let record = column + Math.trunc(this._dateScale.firstVisibleRecord);
        if (isIntegral !== false)
            record = Math.trunc(record);

        return record;
    }

    /**
     * Returns X coordinate by column number.
     * @method xByColumn
     * @param {Number} column The column number.
     * @param {boolean} [isColumnIntegral = true] If true then column is integral value and half-column width is added to the result. For internal use.
     * @param {boolean} [isXIntegral=true] The flag that indicates whether resulting X should be rounded to integral value.
     * @returns {number} X coordinate.
     * @memberOf Projection#
     * @see [columnByX]{@linkcode Projection#columnByX}
     * @see [xByRecord]{@linkcode Projection#xByRecord}
     * @see [xByDate]{@linkcode Projection#xByDate}
     */
    xByColumn(column: number, isColumnIntegral?: boolean, isXIntegral?: boolean): number {
        let dateScale = this._dateScale,
            columnWidth = dateScale.columnWidth,
            firstRecord = dateScale.firstVisibleRecord,
            firstColumnOffset = (firstRecord - Math.trunc(firstRecord)) * columnWidth,
            frame = dateScale.projectionFrame,
            x = frame.left - firstColumnOffset + column * columnWidth;

        if (isColumnIntegral !== false)
            x += columnWidth / 2;

        return isXIntegral !== false ? Math.round(x) : x;
    }

    /**
     * Returns column number by X coordinate.
     * @method columnByX
     * @param {Number} x The X coordinate.
     * @param {Boolean} [isIntegral = true] The flag that indicates whether resulting column should be an integral number.
     * @returns {number}
     * @memberOf Projection#
     * @see [xByColumn]{@linkcode Projection#xByColumn}
     * @see [columnByRecord]{@linkcode Projection#columnByRecord}
     * @see [columnByDate]{@linkcode Projection#columnByDate}
     */
    columnByX(x: number, isIntegral?: boolean): number {
        let dateScale = this._dateScale,
            frame = dateScale.projectionFrame,
            firstRecord = dateScale.firstVisibleRecord,
            columnWidth = dateScale.columnWidth,
            firstColumnOffset = (firstRecord - Math.trunc(firstRecord)) * columnWidth,
            column = (x - frame.left + firstColumnOffset) / columnWidth;

        return isIntegral !== false ? Math.floor(column) : column;
    }

    /**
     * Returns X coordinate by record number.
     * @method xByRecord
     * @param {Number} record The record number.
     * @param {boolean} [isIntegral = true] For internal use.
     * @param {boolean} [isXIntegral=true] The flag that indicates whether resulting X should be rounded to integral value.
     * @returns {number}
     * @memberOf Projection#
     * @see [recordByX]{@linkcode Projection#recordByX}
     * @see [xByColumn]{@linkcode Projection#xByColumn}
     * @see [xByDate]{@linkcode Projection#xByDate}
     */
    xByRecord(record: number, isIntegral?: boolean, isXIntegral?: boolean): number {
        return this.xByColumn(this.columnByRecord(record, isIntegral), isIntegral, isXIntegral);
    }

    /**
     * Returns record number by X coordinate.
     * @method recordByX
     * @param {Number} x The X coordinate
     * @param {Boolean} [isIntegral=true] The flag that indicates whether resulting record should be integral number.
     * @returns {Number}
     * @memberOf Projection#
     * @see [xByRecord]{@linkcode Projection#xByRecord}
     * @see [recordByColumn]{@linkcode Projection#recordByColumn}
     * @see [recordByDate]{@linkcode Projection#recordByDate}
     */
    recordByX(x: number, isIntegral?: boolean): number {
        return this.recordByColumn(this.columnByX(x, isIntegral), isIntegral);
    }

    /**
     * Returns date value by record number. It does not support float number records.
     * @method dateByRecord
     * @param {Number} record The record number
     * @returns {Date}
     * @memberOf Projection#
     * @see [recordByDate]{@linkcode Projection#recordByDate}
     * @see [dateByColumn]{@linkcode Projection#dateByColumn}
     * @see [dateByX]{@linkcode Projection#dateByX}
     */
    dateByRecord(record: number): Date {
        let dates = this._dateScale.getDateDataSeries().values,
            recordTime: number;

        if (dates.length === 0)
            return new Date(0);

        if (record < 0) {
            let firstTime = (<Date> dates[0]).getTime();

            recordTime = firstTime + record * this._dateScale.chart.timeInterval;

            return new Date(recordTime);
        }

        if (record >= dates.length) {

            let marketAbbreviation = this.getMarketAbbreviation();

            let market = ChartAccessorService.instance.getMarketByAbbreviation(marketAbbreviation);

            let interval = Interval.fromChartInterval(this._dateScale.chart.timeInterval);

            let numberOfCandles = record - dates.length + 1;

            let futureDate = market.findProjectedFutureDate(<Date> dates[dates.length - 1], numberOfCandles, interval);

            ProjectionDebugger.validateFutureDateComputation(market, interval, <Date> dates[dates.length - 1], numberOfCandles, futureDate);

            return futureDate;

        }

        return <Date> dates[record];
    }

    /**
     * Returns record number by date value.
     * @method recordByDate
     * @param {Date} date The date.
     * @returns {Number}
     * @memberOf Projection#
     * @see [dateByRecord]{@linkcode Projection#dateByRecord}
     * @see [recordByColumn]{@linkcode Projection#recordByColumn}
     * @see [recordByX]{@linkcode Projection#recordByX}
     */
    recordByDate(date: Date): number {
        let dateScale = this._dateScale,
            dateDataSeries = dateScale.getDateDataSeries(),
            interval = Interval.fromChartInterval(this._dateScale.chart.timeInterval);

        if (dateDataSeries.length === 0)
            return -1;

        /*
        Abu5, tas data grouped by interval goes to the next interval, example all trades done between 10:00:00 to 10:4:59 goes to date 10:05:00
        this behaviour leads to the following problem
        on interval 15min, if we have trend line plotted on 11:15 then, then choose interval 60min, the point should be plotted on 12:00
        the current behavior plotted it on 11:00
        below code is written to fix this problem, as the following
        on daily interval, we select the previous candle,
        and on intraday interval we select the next candle,
        except one case for intraday, that when the point is plotted on the last candle on the trading session, then we should select the previous candle
        */

        let index: number;
        if (Interval.isDaily(interval)) {
            index = dateDataSeries.floorIndex(date);
        } else {
            let lastCandleIndex = dateDataSeries.ceilIndex(date);
            if(lastCandleIndex === dateDataSeries.length) {
                lastCandleIndex -=1;
            }
            if ((<Date> dateDataSeries.values[lastCandleIndex]).getDay() !== date.getDay()) {
                index = dateDataSeries.floorIndex(date);
            } else {
                index = dateDataSeries.ceilIndex(date);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // MA if date is larger than max value in data series, then floorIndex function will return the index of the last element. However,
        // this logic doesn't distinguish this case (date larger than max value) from last element in series. This is why we add next check.
        // So if indeed the date falls outside of date series, then we increase the index so it will be larger than whole series and allows us
        // to distinguish this case in next logic (btw, this could be a bug in original chart component, assuming this logic was as is).
        if((0 < index) && (index == (dateDataSeries.length - 1))) {
            if((date.getTime() > (<Date> dateDataSeries.values[dateDataSeries.length - 1]).getTime())){
                index += 1;
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (index < 0) {
            let leftTimeDiff = date.getTime() - (<Date> dateDataSeries.firstValue).getTime();
            index = Math.floor(leftTimeDiff / dateScale.chart.timeInterval);
        } else if (index >= dateDataSeries.length) {
            let marketAbbreviation = this.getMarketAbbreviation();
            let market = ChartAccessorService.instance.getMarketByAbbreviation(marketAbbreviation);
            let numberOfFutureCandles =  market.findProjectNumberOfCandlesBetweenDates(<Date> dateDataSeries.values[dateDataSeries.length - 1], date, interval);
            index = dateDataSeries.length - 1 + numberOfFutureCandles;
            ProjectionDebugger.validateNumberOfFutureCandlesComputation(market, interval, <Date> dateDataSeries.values[dateDataSeries.length - 1], date, numberOfFutureCandles);
        }

        return index;
    }

    private getMarketAbbreviation() {
        // MA if instrument is not set (as in mini-chart component), then return the default market abbreviation.
        return this._dateScale.chart.instrument ?
            MarketUtils.marketAbbr(this._dateScale.chart.instrument.symbol) :
            ChartAccessorService.instance.getDefaultMarket().abbreviation;
    }

    /**
     * Returns date value by column number. It does not support float number columns.
     * @method dateByColumn
     * @param {Number} column The column number.
     * @returns {Date}
     * @memberOf Projection#
     * @see [columnByDate]{@linkcode Projection#columnByDate}
     * @see [dateByRecord]{@linkcode Projection#dateByRecord}
     * @see [dateByX]{@linkcode Projection#dateByX}
     */
    dateByColumn(column: number): Date {
        let record = this.recordByColumn(column);

        return this.dateByRecord(record);
    }

    /**
     * Returns column number by date value.
     * @method columnByDate
     * @param {Date} date The date.
     * @returns {number}
     * @memberOf Projection#
     * @see [dateByColumn]{@linkcode Projection#dateByColumn}
     * @see [columnByRecord]{@linkcode Projection#columnByRecord}
     * @see [columnByX]{@linkcode Projection#columnByX}
     */
    columnByDate(date: Date): number {
        let x = this.xByDate(date, false);

        return this.columnByX(x);
    }

    /**
     * Returns date value by X coordinate.
     * @method dateByX
     * @param {Number} x The X coordinate.
     * @returns {Date}
     * @memberOf Projection#
     * @see [xByDate]{@linkcode Projection#xByDate}
     * @see [dateByColumn]{@linkcode Projection#dateByColumn}
     * @see [dateByRecord]{@linkcode Projection#dateByRecord}
     */
    dateByX(x: number): Date {
        x = Math.round(x);
        let column = this.columnByX(x);
        return this.dateByColumn(column);
    }

    /**
     * Returns X coordinate by date value.
     * @method xByDate
     * @param {Date} date The date.
     * @param {boolean} [isIntegral = true] The flag that indicates whether resulting x should be rounded to integral value.
     * @returns {number}
     * @memberOf Projection#
     * @see [dateByX]{@linkcode Projection#dateByX}
     * @see [xByColumn]{@linkcode Projection#xByColumn}
     * @see [xByRecord]{@linkcode Projection#xByRecord}
     */
    xByDate(date: Date, isIntegral?: boolean): number {
        let record = this.recordByDate(date);
        let recordX = this.xByRecord(record, true, false);
        return isIntegral !== false ? Math.round(recordX) : recordX;
    }


    percentageByX(x: number): number {
        return x / this.dateScale.projectionFrame.width;
    }


    xByPercentage(percentage:number): number {
        return Math.floor(percentage * this.dateScale.projectionFrame.width);
    }

    percentageByY(y: number): number {
        return y / this.valueScale.projectionFrame.height;
    }


    yByPercentage(percentage:number): number {
        return Math.floor(percentage * this.valueScale.projectionFrame.height);
    }

    /**
     * Returns Y coordinate by value.
     * @method yByValue
     * @param {Number} value The value.
     * @returns {number}
     * @memberOf Projection#
     * @see [valueByY]{@linkcode Projection#valueByY}
     */
    yByValue(value: number): number {
        let valueScale = this._valueScale,
            frame = valueScale.projectionFrame,
            minValue = valueScale.minVisibleValue,
            maxValue = valueScale.maxVisibleValue,
            factor = frame.height / (maxValue - minValue);

        if(minValue == maxValue) {
            return 0;
        }

        return this.isLinearScale() ?
            this.yByValueLinearScale(frame, maxValue, value, factor):
            this.yByValueLogScale(frame, minValue, maxValue, value, factor);

    }

    private yByValueLinearScale(frame: Rect, maxValue: number, value: number, factor: number) {
        return Math.round(frame.top + (maxValue - value) * factor);
    }

    private yByValueLogScale(frame: Rect, minValue: number, maxValue: number, value: number, factor: number) {
        value = this.log(value);
        minValue = this.log(minValue);
        maxValue = this.log(maxValue);
        let y = frame.bottom - frame.height * (value - minValue) / (maxValue - minValue);
        y = y < -100000 ? -100000 : y;
        y = 100000 < y ? 100000 : y;
        return y;
    }

    /**
     * Returns value by Y coordinate.
     * @method valueByY
     * @param {Number} y The Y coordinate.
     * @returns {number}
     * @memberOf Projection#
     * @see [yByValue]{@linkcode Projection#yByValue}
     */
    valueByY(y: number): number {
        let valueScale = this._valueScale,
            frame = valueScale.projectionFrame,
            minValue = valueScale.minVisibleValue,
            maxValue = valueScale.maxVisibleValue,
            factor = (maxValue - minValue) / frame.height;

        if (minValue == maxValue) {
            return minValue;
        }

        return this.isLinearScale() ?
            this.valueByYLinearScale(maxValue, y, frame, factor):
            this.valueByYLogScale(minValue, maxValue, y, frame, factor);

    }

    private isLinearScale() {
        return !this.isMainPanel() || this.valueScale.axisScale == AxisScaleType.Linear;
    }

    private valueByYLinearScale(maxValue: number, y: number, frame: Rect, factor: number) {
        return maxValue - (y - frame.top) * factor;
    }

    private valueByYLogScale(minValue: number, maxValue: number, y: number, frame: Rect, factor: number) {
        minValue = this.log(minValue);
        maxValue = this.log(maxValue);

        return Math.exp((frame.bottom - y) / frame.height * (maxValue - minValue) + minValue);
    }

    private log(val: number): number {
        if (val <= 0)
            return 0;
        return Math.log(Math.abs(val));
    }

    private isMainPanel(): boolean {
        return this._valueScale.chartPanel.chart.mainPanel == this._valueScale.chartPanel;
    }
}
