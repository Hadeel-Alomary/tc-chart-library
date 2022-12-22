/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {JsUtil} from "../Utils/JsUtil";

/**
 * Time span values.
 * @readonly
 * @enum {number}
 * @memberOf StockChartX
 */
export const TimeSpan = {
    /** Number of milliseconds in year. */
    MILLISECONDS_IN_YEAR: 31556926000,

    /** number of milliseconds in month. */
    MILLISECONDS_IN_MONTH: 2629743830,

    /** Number of milliseconds in week. */
    MILLISECONDS_IN_WEEK: 604800000,

    /** Number of milliseconds in day. */
    MILLISECONDS_IN_DAY: 86400000,

    /**  Number of milliseconds in hour. */
    MILLISECONDS_IN_HOUR: 3600000,

    /** Number of milliseconds in minute. */
    MILLISECONDS_IN_MINUTE: 60000,

    /** Number of milliseconds in second. */
    MILLISECONDS_IN_SECOND: 1000
};
Object.freeze(TimeSpan);

/**
 * Periodicity values.
 * @readonly
 * @enum {number}
 * @memberOf StockChartX
 */
export const Periodicity: {[key: string]: string} = {
    /** Tick. */
    TICK: "t",

    /** Second. */
    SECOND: "s",

    /** Minute. */
    MINUTE: "",

    /** Hour. */
    HOUR: "h",

    /** Day. */
    DAY: "d",

    /** Week. */
    WEEK: "w",

    /** Month. */
    MONTH: "m",

    /** Year. */
    YEAR: "y"
};
Object.freeze(Periodicity);

/**
 * Describes time frame object.
 * @param {Number} [interval = 1]  Time frame interval.
 * @param {String} [periodicity]   Time frame periodicity. See Periodicity enum
 * @constructor TimeFrame
 */
export class TimeFrame {
    public periodicity: string;
    public interval: number;

    constructor(periodicity?: string, interval?: number) {
        this.periodicity = periodicity || Periodicity.MINUTE;
        this.interval = JsUtil.isFiniteNumber(interval) ? interval : 1;
    }

    public toString(): string {
        return `${this.interval} ${TimeFrame.periodicityToString}`;
    }

    public static periodicityToString(periodicity: string): string {
        switch (periodicity) {
            case Periodicity.TICK:
                return "tick";
            case Periodicity.SECOND:
                return "second";
            case Periodicity.MINUTE:
                return "minute";
            case Periodicity.HOUR:
                return "hour";
            case Periodicity.DAY:
                return "day";
            case Periodicity.WEEK:
                return "week";
            case Periodicity.MONTH:
                return "month";
            case Periodicity.YEAR:
                return "year";
            default:
                throw new Error("Unsupported periodicity: " + periodicity);
        }
    }

    public static timeIntervalToTimeFrame(timeInterval: number): TimeFrame {
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_YEAR) {
            return new TimeFrame(Periodicity.YEAR, timeInterval / TimeSpan.MILLISECONDS_IN_YEAR);
        }
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_MONTH) {
            return new TimeFrame(Periodicity.MONTH, timeInterval / TimeSpan.MILLISECONDS_IN_MONTH);
        }
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_WEEK) {
            return new TimeFrame(Periodicity.WEEK, timeInterval / TimeSpan.MILLISECONDS_IN_WEEK);
        }
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_DAY) {
            return new TimeFrame(Periodicity.DAY, timeInterval / TimeSpan.MILLISECONDS_IN_DAY);
        }
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_HOUR) {
            return new TimeFrame(Periodicity.HOUR, timeInterval / TimeSpan.MILLISECONDS_IN_HOUR);
        }
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_MINUTE) {
            return new TimeFrame(Periodicity.MINUTE, timeInterval / TimeSpan.MILLISECONDS_IN_MINUTE);
        }
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_SECOND) {
            return new TimeFrame(Periodicity.SECOND, timeInterval / TimeSpan.MILLISECONDS_IN_SECOND);
        }
        else {
            throw new Error("Unsupported time interval: " + timeInterval);
        }
    }
}
