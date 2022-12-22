/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {INumberFormatState, NumberFormat, NumberFormatClasses} from './NumberFormat';
import {JsUtil} from "../Utils/JsUtil";

export interface IIntlNumberFormatState extends INumberFormatState {
    options: Intl.NumberFormatOptions;
}

/**
 * Represents language sensitive number formatter based on Intl.NumberFormat
 * ({@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat})
 * @param {string} [locale='en'] The locale.
 * @param {Intl.NumberFormatOptions} [options] The format options.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat}
 * @constructor IntlNumberFormat
 * @augments NumberFormat
 * @example
 * var options = {
     *  minimumFractionDigits: 4,
     *  maximumFractionDigits: 4
     * };
 * var format = new IntlNumberFormat(options);
 */
export class IntlNumberFormat extends NumberFormat {
    static get className(): string {
        return NumberFormatClasses.IntlNumberFormat;
    }

    private _numberFormat: Intl.NumberFormat;

    /**
     * Gets/Sets format options ({@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat})
     * @name options
     * @type {Intl.ResolvedNumberFormatOptions}
     * @memberOf IntlNumberFormat#
     */
    get options(): Intl.ResolvedNumberFormatOptions {
        return this._numberFormat.resolvedOptions();
    }

    set options(value: Intl.ResolvedNumberFormatOptions) {
        this._createFormat(value);
    }

    constructor(locale?: string, options?: Intl.NumberFormatOptions) {
        super(locale);

        this._createFormat(options);
    }

    protected _onLocaleChanged() {
        this._createFormat();
    }

    private _createFormat(options?: Intl.NumberFormatOptions) {
        let locale = this.locale || 'en';

        if (!options) {
            options = this._numberFormat && this._numberFormat.resolvedOptions();
        }
        this._numberFormat = new Intl.NumberFormat(locale, options || undefined);
    }

    /**
     * @inheritdoc
     */
    format(value: number): string {
        return this._numberFormat.format(value);
    }

    /**
     * Sets number of decimal digits to display.
     * @method setDecimalDigits
     * @param {number} value Number of decimal digits.
     * @memberOf IntlNumberFormat#
     */
    setDecimalDigits(value: number) {
        if (JsUtil.isNegativeNumber(value))
            throw new Error('Value must be greater or equal to zero.');

        let options = this._numberFormat.resolvedOptions();

        options.minimumFractionDigits = options.maximumFractionDigits = value;
        this._createFormat(options);
    }

    /**
     * @inheritdoc
     */
    saveState(): IIntlNumberFormatState {
        let state = <IIntlNumberFormatState> super.saveState();
        state.options = JsUtil.clone(this.options);

        return state;
    }

    /**
     * @inheritdoc
     */
    loadState(state: IIntlNumberFormatState) {
        super.loadState(state);

        this._createFormat(state && state.options);
    }
}

NumberFormat.register(IntlNumberFormat);
