/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {INumberFormatState, NumberFormat} from "./NumberFormat";
import {JsUtil} from "../Utils/JsUtil";

export interface ICustomNumberFormatState extends INumberFormatState {
    formatString: string;
}

interface INumberFormatOptions {
    sign: boolean;
    padding: string;
    alignLeft: boolean;
    width: string | number | boolean;
    precision: string | number | boolean;
    type: string;
}

/**
 * Represents custom number formatter.
 * @param {string} [format='%f'] The printf-like format specification (e.g. '%d', '%5.2f').
 * @constructor CustomNumberFormat
 * @augments NumberFormat
 * @example
 * var intFormat = new CustomNumberFormat("%d");
 * var floatFormat = new CustomNumberFormat("%5.2f");
 */
export class CustomNumberFormat extends NumberFormat {
    static get className(): string {
        return 'StockChartX.CustomNumberFormat';
    }

    private _options: INumberFormatOptions;

    private _formatString: string;
    /**
     * Gets/Sets format string.
     * @name formatString
     * @type {string}
     * @memberOf CustomNumberFormat#
     */
    get formatString(): string {
        return this._formatString;
    }

    set formatString(value: string) {
        this._formatString = value;
        this._parseFormat();
    }

    constructor(format?: string) {
        super();

        this.formatString = format || '%f';
    }

    private _parseFormat() {
        let format = this.formatString;
        if (!format || typeof format !== 'string')
            throw new TypeError("Format specifier must be a string.");

        // Define the regular expression to match a formatting string
        // The regex consists of the following parts:
        // - % sign to indicate the start.
        // - (optional) sign specifier (+/-).
        // - (optional) padding specifier (0/<space>/'<char>).
        // - (optional) alignment specifier ('+' - right alignment, '-' - left alignment).
        // - (optional) width specifier (the minimum number of characters to output).
        // - (optional) precision specifier.
        // - type specifier:
        //   b - binary number.
        //   c - ASCII character represented by the given value.
        //   d - decimal number.
        //   f - floating point value.
        //   o - octal number.
        //   x - hexadecimal number (lowercase characters).
        //   X - hexadecimal number (uppercase characters).
        //   e - floating point value displayed in exponential format.
        //   E - the same as e, except that E, rather than e, introduces the exponent.
        //   g - floating point value displayed in f or e format which ever is more compact for the given value and precision.
        //   G - the same as g, except that E, rather than e, introduces the exponent.
        let regex = /%(\+)?([0 ]|'(.))?(-)?([0-9]+)?(\.([0-9]+))?([bcdfoxXeEgG])/g;
        let matches = regex.exec(format);

        this._options = {
            sign: matches[1] === '+',
            padding: matches[2] == null
                ? ' '
                : matches[2].substring(0, 1) === "'"
                    ? matches[3] /* use special character */
                    : matches[2], // use normal character - <space> or zero
            alignLeft: matches[4] === '-',
            width: matches[5] != null ? matches[5] : false, // the width number or false if not specified.
            precision: matches[7] != null ? matches[7] : false, // the precision number of false if not specified.
            type: matches[8]
        };
    }

    /**
     * @inheritdoc
     */
    format(value: string | number): string {
        let numberValue: number = Number(value);

        let options = this._options,
            valueStr = "";
        switch (options.type) {
            case 'b':
                valueStr = numberValue.toString(2);
                break;
            case 'c':
                valueStr = String.fromCharCode(numberValue);
                break;
            case 'd':
                valueStr = parseInt(numberValue.toString(), 10).toString();
                break;
            case 'f':
                valueStr = options.precision === false ? value.toString() : numberValue.toFixed(<number> options.precision);
                break;
            case 'o':
                valueStr = numberValue.toString(8);
                break;
            case 'x':
                valueStr = numberValue.toString(16).toLowerCase();
                break;
            case 'X':
                valueStr = numberValue.toString(16).toUpperCase();
                break;
            case 'e':
            case 'E':
                valueStr = options.precision === false
                    ? numberValue.toExponential()
                    : numberValue.toExponential(<number> options.precision);
                valueStr = options.type === 'e'
                    ? valueStr.toLowerCase()
                    : valueStr.toUpperCase();
                break;
            case 'g':
            case 'G':
                let fValue = options.precision === false
                    ? value.toString()
                    : numberValue.toFixed(<number> options.precision);
                let eValue = options.precision === false
                    ? numberValue.toExponential()
                    : numberValue.toExponential(<number> options.precision);
                valueStr = fValue.length < eValue.length ? fValue : eValue;
                valueStr = options.type === 'g' ? valueStr.toLowerCase() : valueStr.toUpperCase();
                break;
            default:
                throw 'Unknown value type "' + options.type + '" detected.';
        }

        let shouldAlign = options.width !== false && <number> options.width > valueStr.length;
        if (shouldAlign && !options.alignLeft && options.padding !== ' ') {
            valueStr = JsUtil.padStr(valueStr, {
                width: options.width as number,
                alignLeft: options.alignLeft,
                padding: Number(options.padding),
            });
            shouldAlign = false;
        }

        // Add +/- sign if necessary
        switch (options.type) {
            case 'd':
            case 'f':
            case 'e':
            case 'E':
            case 'g':
            case 'G':
                if (value < 0) {
                    if (valueStr[0] !== '-')
                        valueStr = '-' + valueStr;
                } else if (options.sign) {
                    valueStr = '+' + valueStr;
                }
                break;
        }

        // Pad the string
        if (shouldAlign) {
            valueStr = JsUtil.padStr(valueStr, {
                width: options.width as number,
                alignLeft: options.alignLeft,
                padding: Number(options.padding),
            });
        }

        return valueStr;
    }

    /**
     * @inheritdoc
     */
    saveState(): ICustomNumberFormatState {
        let state = <ICustomNumberFormatState> super.saveState();
        state.formatString = this.formatString;

        return state;
    }

    /**
     * @inheritdoc
     */
    loadState(state: ICustomNumberFormatState) {
        super.loadState(state);

        this.formatString = state && state.formatString;
    }

    setDecimalDigits(value: number) {

    }
}

NumberFormat.register(CustomNumberFormat);
