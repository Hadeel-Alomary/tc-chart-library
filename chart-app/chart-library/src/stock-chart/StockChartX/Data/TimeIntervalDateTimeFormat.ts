/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {DateTimeFormat, IDateTimeFormatState} from "./DateTimeFormat";
import {TimeSpan} from "./TimeFrame";

export interface ITimeIntervalDateTimeFormatState extends IDateTimeFormatState {
    timeInterval: number;
}

export const DateTimeFormatName = {
    YEAR_MONTH: "year-month",
    MONTH_DAY: "month-day",
    DATE: "date",
    SHORT_DATE_TIME: "short_date_time",
    LONG_DATE_TIME: "long_date_time",
    SHORT_TIME: "short_time",
    LONG_TIME: "long_time",
};

/**
 * Represents date time formatter which formats dates in different ways
 * depending on specified time interval.
 * @constructor TimeIntervalDateTimeFormat
 * @augments DateTimeFormat
 * @memberOf StockChartX
 */
export class TimeIntervalDateTimeFormat extends DateTimeFormat {
    static get className(): string {
        return 'StockChartX.TimeIntervalDateTimeFormat';
    }

    private _formatters: {[key: string]:  Intl.DateTimeFormat} = {};

    private _timeInterval: number;
    /**
     * The time interval
     * @name timeInterval
     * @type {number}
     * @memberOf TimeIntervalDateTimeFormat#
     */
    get timeInterval(): number {
        return this._timeInterval;
    }

    set timeInterval(value: number) {
        this._timeInterval = value;
    }

    constructor(timeInterval?: number) {
        super();

        this._timeInterval = timeInterval;
    }

    protected _onLocaleChanged() {
        this._clearFormatters();
    }

    private _clearFormatters() {
        this._formatters = {};
    }

    private _createFormatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
        let locale = this.locale || 'en';

        return <Intl.DateTimeFormat> new Intl.DateTimeFormat(locale, options);
    }

    /**
     * @inheritdoc
     */
    format(date: Date, timeInterval?: number): string {

        if (!timeInterval) {
            timeInterval = this._timeInterval;
        }

        // Year periodicity
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_YEAR) {
            return date.getFullYear().toString();
        }

        let formatName = DateTimeFormatName;

        // Month periodicity
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_MONTH) {
            // can be changed to something like "Jan 2014"
            return this.formatter(formatName.YEAR_MONTH).format(date);
        }

        // Day/Week periodicity
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_DAY) {
            // can be changed to something like "Jan 1, 2014"
            return this.formatter(formatName.DATE).format(date);
        }

        // Minute/Hour periodicity
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_MINUTE) {
            // can be changed to something like "Jan 1, 2014 10:00"
            return this.formatter(formatName.SHORT_DATE_TIME).format(date);
        }

        // Second periodicity
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_SECOND) {
            // can be changed to something like "Jan 1, 2014 10:00:00"
            return this.formatter(formatName.SHORT_DATE_TIME).format(date);
        }

        // Millisecond periodicity
        // can be changed to something like "Jan 1, 2014 10:00:00.000"
        return this.formatter(formatName.LONG_DATE_TIME).format(date);
    }

    /**
     * Formats specified date using formatter with a given name.
     * @method formatWithFormatter
     * @param {Date} date The date.
     * @param {string} formatName The formatter name to be used. See {@linkcode DateTimeFormatName}.
     * @returns {string}
     * @memberOf TimeIntervalDateTimeFormat#
     */
    formatWithFormatter(date: Date, formatName: string): string {
        try {
            return this.formatter(formatName).format(date);
        } catch (ex) {
            throw ('fail to format date ' + date + ' with format ' + formatName + ' - exception message: ' + ex.message);
        }
    }

    formatter(name: string): Intl.DateTimeFormat {
        let formatter = this._formatters[name];
        if (formatter)
            return formatter;

        let formatName = DateTimeFormatName;
        switch (name) {
            case formatName.YEAR_MONTH:
                formatter = this._createFormatter({
                    year: "numeric",
                    month: "numeric"
                });
                break;
            case formatName.MONTH_DAY:
                formatter = this._createFormatter({
                    month: "numeric",
                    day: "2-digit"
                });
                break;
            case formatName.DATE:
                formatter = this._createFormatter({
                    year: "numeric",
                    month: "numeric",
                    day: "2-digit"
                });
                break;
            case formatName.SHORT_DATE_TIME:
                formatter = this._createFormatter({
                    year: "numeric",
                    month: "numeric",
                    day: "2-digit",
                    hour: "2-digit",
                    hour12: false,
                    minute: "2-digit"
                });
                break;
            case formatName.LONG_DATE_TIME:
                formatter = this._createFormatter({
                    year: "numeric",
                    month: "numeric",
                    day: "2-digit",
                    hour: "2-digit",
                    hour12: false,
                    minute: "2-digit",
                    second: "2-digit"
                });
                break;
            case formatName.SHORT_TIME:
                formatter = this._createFormatter({
                    hour: "2-digit",
                    hour12: false,
                    minute: "2-digit"
                });
                break;
            case formatName.LONG_TIME:
                formatter = this._createFormatter({
                    hour: "2-digit",
                    hour12: false,
                    minute: "2-digit",
                    second: "2-digit"
                });
                break;
            default:
                throw new Error("Unknown formatter name: " + name);
        }

        this._formatters[name] = formatter;

        return formatter;
    }

    /**
     * @inheritdoc
     */
    saveState(): ITimeIntervalDateTimeFormatState {
        let state = <ITimeIntervalDateTimeFormatState> super.saveState();
        state.timeInterval = this.timeInterval;

        return state;
    }

    /**
     * @inheritdoc
     */
    loadState(state: ITimeIntervalDateTimeFormatState) {
        super.loadState(state);

        this.timeInterval = state && state.timeInterval;
    }
}

DateTimeFormat.register(TimeIntervalDateTimeFormat);
