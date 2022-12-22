/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */



/**
 * The string padding options
 * @typedef {} StringPaddingOptions
 * @type {object}
 * @property {number} width The number of characters in the resulting string (equal to the number of original characters plus any additional padding characters.
 * @property {boolean} alignLeft If true then characters are left aligned, otherwise characters are right aligned.
 * @property {char} padding The padding character.
 * @memberOf
 */

export interface IStringPaddingOptions {
    width: number;
    alignLeft: boolean;
    padding: number;
}

export class JsUtil {
    /**
     * Checks if a given value is a number.
     * @method isNumber
     * @param {*} value The value to check.
     * @returns {boolean} True if a given value is a number, false otherwise.
     * @memberOf JsUtil
     */
    static isNumber(value: unknown): boolean {
        return typeof(value) === 'number';
    }

    /**
     * Checks if a given value is a finite number.
     * @method isFiniteNumber
     * @param {*} value The value to check.
     * @returns {boolean} True if a given value is a finite number, false, otherwise.
     * @memberOf JsUtil
     */
    static isFiniteNumber(value: unknown): boolean {
        return this.isNumber(value) && isFinite(value as number);
    }

    /**
     * Checks if a given value is a finite number or NaN.
     * @method isFiniteNumberOrNaN
     * @param {*} value The value to check.
     * @returns {boolean} True if a given value is a finite number or NaN, false otherwise.
     * @memberOf JsUtil
     */
    static isFiniteNumberOrNaN(value: unknown): boolean {
        return this.isNumber(value) && (isFinite(value as number) || isNaN(value as number));
    }

    static isPositiveNumber(value: unknown): boolean {
        return this.isFiniteNumber(value) && (value as number) > 0;
    }

    static isNegativeNumber(value: unknown): boolean {
        return this.isFiniteNumber(value) && (value as number) < 0;
    }

    /**
     * Checks if a given value is a positive number or NaN.
     * @method isPositiveNumberOrNaN
     * @param {*} value The value to check.
     * @returns {boolean} True if a given value is a positive number or NaN.
     * @memberOf JsUtil
     */
    static isPositiveNumberOrNaN(value: unknown): boolean {
        return this.isNumber(value) && (isNaN(value as number) || ( (value as number) > 0 && isFinite(value as number)));
    }

    /**
     * Checks if a given value is a function.
     * @method isFunction
     * @param {*} value The value to check.
     * @returns {boolean} True if a given value is a function, false otherwise.
     * @memberOf JsUtil
     */
    static isFunction(value: Object): boolean {
        return !!(value && value.constructor && (value as Function).call && (value as Function).apply);
    }

    static clone<T extends Object>(obj: T): T {
        let result = jQuery.extend(true, {}, obj);
        for (let prop in result) {
            if (!result.hasOwnProperty(prop))
                continue;

            let arr = result[prop];
            if (!Array.isArray(arr))
                continue;

            for (let i = 0, count = arr.length; i < count; i++) {
                if (typeof arr[i] === 'object') {
                    arr[i] = this.clone(arr[i]);
                }
            }
        }

        return result;
    }

    /**
     * Extends prototype of dst with properties from src.
     * @method extend
     * @param {Object} dst The object to be extended.
     * @param {Object} src The source object to get properties from.
     * @memberOf JsUtil
     */
    static extend(dst: ObjectConstructor, src: ObjectConstructor): void {
        let dstPrototype = dst.prototype as Object;
        let f = function () {
        };
        f.prototype = src.prototype;
        let l = new (<ObjectConstructor>f)();
        (dst as Function).prototype = l;
        dst.prototype.constructor = dst;

        for (let key in dstPrototype) {
            //noinspection JSUnfilteredForInLoop
            dst.prototype[key] = dstPrototype[key];
        }
    }

    static applyMixins(derivedCtor: Object, baseCtors: Object[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor).forEach(name => {
                let descriptor = Object.getOwnPropertyDescriptor(baseCtor, name);

                if (descriptor.enumerable && name !== 'constructor') {
                    derivedCtor[name] = baseCtor[name];
                }
            });

            Object.getOwnPropertyNames((baseCtor as ObjectConstructor).prototype).forEach(name => {
                if (name !== 'constructor') {
                    (derivedCtor as ObjectConstructor).prototype[name] = (baseCtor as ObjectConstructor).prototype[name];
                }
            });
        });
    }

    /**
     * Returns a new string that aligns the characters by padding then with spaces, for the specified total length.
     * @param {string} str The original string.
     * @param {IStringPaddingOptions} options The padding options.
     * @returns {string}
     * @example
     * // Left aligns the string "12" for total width of 5 characters. The result is '12   '.
     * var res = JsUtil.padStr("12", {width: 5, alignLeft: true, padding: ' '});
     *
     * // Right aligns the string "12" for total width of 5 characters. The result is '   12'.
     * var res = JsUtil.padStr("12", {width: 5, alignLeft: false, padding: ' '});
     */
    static padStr(str: string, options: IStringPaddingOptions): string {
        let count = options.width - str.length;
        for (let i = 0; i < count; i++) {
            str = options.alignLeft ? str + options.padding : options.padding + str;
        }

        return str;
    }

    /**
     * Filters given text. Strips html injections.
     * @param {string} text The original text
     * @returns {string}
     */
    static filterText(text: string): string {
        return ($('<div></div>').text(text).html()).trim();
    }

    // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    static guid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}


Math.roundToDecimals = (value: number, decimals: number): number => {
    //noinspection JSCheckFunctionSignatures
    return Number(Math.round(Number(value + 'E' + decimals)) + 'E-' + decimals);
};

if (!Math.trunc) {
    //noinspection SpellCheckingInspection
    Math.trunc = (value: number): number => {
        return value < 0 ? Math.ceil(value) : Math.floor(value);
    };
}
