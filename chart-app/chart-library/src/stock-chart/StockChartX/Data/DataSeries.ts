/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {Field} from "../../TASdk/Field";
import {Const} from "../../TASdk/TASdk";

export type TDataSeriesValue = Date | number; // MA compile typescript - generate declarations
export type TDataSeriesValues = Date[] | number[]; // MA compile typescript - generate declarations

export interface IDataSeriesConfig {
    name: string;
    values: Date[] | number[];
}

export interface IMinMaxValues<T> {
    min?: T;
    max?: T;
}

/**
 * The data series suffixes.
 * @enum {string}
 * @readonly
 * @memberOf StockChartX
 */
export const DataSeriesSuffix = {
    /** Date data series suffix. */
    DATE: ".date",

    /** Open data series suffix. */
    OPEN: ".open",

    /** High data series suffix. */
    HIGH: ".high",

    /** Low data series suffix. */
    LOW: ".low",

    /** Close data series suffix. */
    CLOSE: ".close",

    /** Volume data series suffix. */
    VOLUME: ".volume",

    /** Heikin ashi data series. It is used in combination with OPEN, HIGH, LOW and CLOSE suffix. */
    HEIKIN_ASHI: '.heikin_ashi',

    /** Renko data series. It is used in combination with DATE, OPEN, HIGH, LOW, CLOSE, VOLUME suffixes. */
    RENKO: '.renko',

    /** Line break data series. It is used in combination with DATE, OPEN, HIGH, LOW, CLOSE, VOLUME suffixes. */
    LINE_BREAK: '.line_break',

    /** Point & Figure data series. It is used in combination with DATE, OPEN, HIGH, LOW, CLOSE, VOLUME suffixes. */
    POINT_AND_FIGURE: '.point_and_figure',

    /** Kagi data series. It is used in combination with DATE, OPEN, HIGH, LOW, CLOSE, VOLUME suffixes. */
    KAGI: 'kagi'
};
Object.freeze(DataSeriesSuffix);


/**
 * Represents data series.
 * @param {String | Object} [config] The name of the data series or configuration object.
 * @param {String} [config.name] The name of the data series.
 * @param {Date[] | number[]} [config.values] An array of data series values.
 * @example
 *  var dataSeries = new DataSeries("OpenInterest");
 *  or
 *  var dataSeries = new DataSeries({
     *      name: 'OpenInterest',
     *      values: [1, 2, 3]
     *  });
 * @constructor DataSeries
 */
export class DataSeries {
    private _name: string;
    /**
     * Gets/Sets data series name.
     * @name name
     * @type {String}
     * @memberOf DataSeries#
     */
    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value || '';
    }

    private _values: TDataSeriesValues;
    /**
     * Gets/Sets array of values.
     * @name values
     * @type {Date[] | number[]}
     * @memberOf DataSeries#
     */
    get values(): TDataSeriesValues {
        return this._values;
    }

    set values(value: TDataSeriesValues) {
        this._values = value || [];
    }

    /**
     * Gets values count.
     * @name length
     * @type {Number}
     * @readonly
     * @memberOf DataSeries#
     */
    get length(): number {
        return this._values.length;
    }

    /**
     * Gets name suffix.
     * @name nameSuffix
     * @type {string}
     * @readonly
     * @memberOf DataSeries#
     */
    get nameSuffix(): string {
        let name = this.name,
            idx = name.lastIndexOf(".");

        return idx >= 0 ? name.substr(idx) : null;
    }

    /**
     * Determines if data series contains numeric values (if it is not a date data series).
     * @name isValueDataSeries
     * @readonly
     * @type {boolean}
     * @memberOf DataSeries#
     */
    get isValueDataSeries(): boolean {
        return this.nameSuffix !== DataSeriesSuffix.DATE;
    }

    /**
     * Determines if data series contains dates.
     * @name isDateDataSeries
     * @readonly
     * @type {boolean}
     * @memberOf DataSeries#
     */
    get isDateDataSeries(): boolean {
        return this.nameSuffix === DataSeriesSuffix.DATE;
    }

    /**
     * Returns first value.
     * @name firstValue
     * @readonly
     * @type {Date | number}
     * @memberOf DataSeries#
     * @see [lastValue]{@linkcode DataSeries#lastValue}
     */
    get firstValue(): TDataSeriesValue {
        return this._values[0];
    }

    /**
     * Returns last value.
     * @name lastValue
     * @readonly
     * @type {Date | number}
     * @memberOf DataSeries#
     * @see [firstValue]{@linkcode DataSeries#firstValue}
     */
    get lastValue(): TDataSeriesValue {
        let values = this._values;

        return values[values.length - 1];
    }

    constructor(config?: string | IDataSeriesConfig) {
        let name: string,
            values: TDataSeriesValues;

        if (!config) {
            // do nothing
        } else if (typeof config === 'string') {
            name = config;
        } else if (typeof config === 'object') {
            name = config.name;
            values = config.values;
        } else {
            throw new TypeError('Unknown config.');
        }

        this.name = name;
        this.values = values;
    }

    /**
     * Creates data series from TA Field.
     * @method fromField
     * @param { Field} field The TA Field with values.
     * @param {number} startIndex The starting index of valid values.
     * @returns {DataSeries}
     * @memberOf DataSeries
     */
    static fromField(field: Field, startIndex: number) {
        let series = new DataSeries();
        series.fromField(field, startIndex);

        return series;
    }

    /**
     * Gets/Sets value at a given index.
     * @method valueAtIndex
     * @param {Number} index The index of value.
     * @param {Date | number} [value] The new value to set.
     * @returns {Date | number} Value at a given index.
     * @memberOf DataSeries#
     * @example
     *  dataSeries.valueAtIndex(3, 10); // Sets value 10 at index 3
     */
    valueAtIndex(index: number, value?: TDataSeriesValue): TDataSeriesValue {
        let values = this._values,
            oldValue = values[index];

        if (value !== undefined)
            values[index] = value;

        return oldValue;
    }

    /**
     * Returns number of items in a given range [startValue..endValue].
     * @method itemsCountBetweenValues
     * @param {number} startValue The start value.
     * @param {number} endValue The end value.
     * @returns {number}
     * @memberOf DataSeries#
     * @private
     * @example
     *  var count = dataSeries.itemsCountBetweenValues(1.0, 5.0);
     */
    itemsCountBetweenValues(startValue: number, endValue: number): number {
        let count = 0;

        for (let value of this._values) {
            if (value != null && value >= startValue && value <= endValue)
                count++;
        }

        return count;
    }

    /**
     * Adds new value or an array of values into the data series.
     * @method add
     * @param {Date | number | Date[] | number[]} value The new value or array of values.
     * @memberOf DataSeries#
     * @example
     *  dataSeries.add(1.0);
     */
    add(value: TDataSeriesValue | TDataSeriesValues): void {
        let values: TDataSeriesValue[] = this._values;

        if (Array.isArray(value))
            this._values = values.concat(value) as TDataSeriesValues;
        else
            values.push(value);
    }

    /**
     * Updates last value.
     * @method updateLast
     * @param {Date | number} value The new value.
     * @memberOf DataSeries#
     */
    updateLast(value: TDataSeriesValue): void {
        let values = this._values;

        if (values.length > 0)
            values[values.length - 1] = value;
    }

    /**
     * Clears all values.
     * @method clear
     * @memberOf DataSeries#
     */
    clear(): void {
        this._values.length = 0;
    }

    /**
     * Trims values to a given maximum length (by removing old values).
     * @method trim
     * @param maxLength
     * @returns {number} The number of removed values.
     * @memberOf DataSeries#
     */
    trim(maxLength: number): number {
        // noinspection JSMismatchedCollectionQueryUpdate
        let values: Date[] | number[] = this._values,
            overhead = values.length - maxLength;

        if (overhead > 0)
            values.splice(0, overhead);
        else
            overhead = 0;

        return overhead;
    }

    /**
     * Returns minimum and maximum values in a given range.
     * @method minMaxValues
     * @param {Number} [startIndex = 0] The starting index of the range to search.
     * @param {Number} [count] The length of the range to search. Iterates through all values after startIndex if omitted.
     * @returns {{min: Number, max: Number}} An object that contains min and max values.
     * @memberOf DataSeries#
     * @example
     *  var values1 = dataSeries.minMaxValues();
     *  var values2 = dataSeries.minMaxValues(1, 5);
     */
    minMaxValues(startIndex: number, count: number): IMinMaxValues<number> {
        let values = this._values;

        if (startIndex == null || startIndex < 0)
            startIndex = 0;
        if (count == null)
            count = values.length - startIndex;

        let endIndex = Math.min(startIndex + count - 1, values.length - 1),
            value: TDataSeriesValue,
            result = {
                min: Infinity,
                max: -Infinity
            };
        for (let i = startIndex; i <= endIndex; i++) {
            value = values[i];
            if (value == null)
                continue;

            if (value < result.min)
                result.min = value as number;
            if (value > result.max)
                result.max = value as number;
        }

        return result;
    }

    /**
     * Gets index of the value that is less or equal to searchValue. Data series must contain sorted values.
     * Usually this method is applied to date data series.
     * @method floorIndex
     * @param {Number | Date} searchValue The value to search.
     * @returns {number}
     * @memberOf DataSeries#
     */
    floorIndex(searchValue: TDataSeriesValue): number {
        let index = this.binaryIndexOf(searchValue);
        if (index === 0) {
            let values = this._values;
            if (values.length === 0)
                return -1;

            if (values[0] > searchValue) {
                return -1;
            }
        }

        return index >= 0 ? index : ~index;
    }

    /**
     * Gets index of the value that is greater or equal to searchValue. Data series must contain sorted values.
     * Usually this method is applied to date data series.
     * @method ceilIndex
     * @param {Number | Date} searchValue The value to search.
     * @returns {number}
     * @memberOf DataSeries#
     */
    ceilIndex(searchValue: TDataSeriesValue): number {
        let index = this.binaryIndexOf(searchValue);

        return index >= 0 ? index : (~index) + 1;
    }

    binaryIndexOf(searchElement: TDataSeriesValue): number {
        let values = this._values,
            minIndex = 0,
            maxIndex = values.length - 1,
            currentIndex: number,
            currentElement: TDataSeriesValue,
            resultIndex: number;

        while (minIndex <= maxIndex) {
            resultIndex = currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = values[currentIndex];

            if (currentElement < searchElement) {
                minIndex = currentIndex + 1;
            }
            else if (currentElement > searchElement) {
                maxIndex = currentIndex - 1;
            }
            else {
                return currentIndex;
            }
        }

        return ~maxIndex;
    }

    /**
     * Returns index of nearest visible value from the left.
     * @method leftNearestVisibleValueIndex
     * @param {Number} index The starting index.
     * @returns {number}
     * @memberOf DataSeries#
     */
    leftNearestVisibleValueIndex(index: number): number {
        let values = this._values;

        index = Math.min(index, values.length - 1);

        //NK avoid infinite loop
        if (index < 0) {
            return 0;
        }

        for (let i = index; i >= 0; i--) {
            if (values[i] != null)
                return i;
        }

        return 0;
    }

    /**
     * Returns index of nearest visible value from the right.
     * @method rightNearestVisibleValueIndex
     * @param {Number} index The starting index.
     * @returns {number}
     * @memberOf DataSeries#
     */
    rightNearestVisibleValueIndex(index: number): number {
        let values = this._values,
            count = values.length;

        //NK avoid infinite loop
        if (index < 0) {
            return 0;
        }

        for (let i = index; i < count; i++) {
            if (values[i] != null)
                return i;
        }

        return count - 1;
    }

    /**
     * Creates  Field with values.
     * @method toField
     * @param {String} name The field name.
     * @returns { Field}
     * @memberOf DataSeries#
     */
    toField(name: string) {
        let field = new Field();
        field.name = name || this.name;
        field.recordCount = this._values.length;
        field._m_values = [0].concat(this._values as number[]);
        field._m_values.push(0);

        return field;
    }

    /**
     * Loads values from a given field.
     * @method fromField
     * @param { Field} field The field.
     * @param {Number} startIndex The starting index.
     * @memberOf DataSeries#
     */
    fromField(field: Field, startIndex: number) {
        let count = field.recordCount,
            values = field._m_values.slice(1, startIndex + count),
            i: number;

        for (i = 0; i < startIndex - 1; i++)
            values[i] = null;
        while (i < count) {
            if (values[i] === Const.nullValue)
                values[i] = null;
            i++;
        }
        this._values = values;
    }
}
