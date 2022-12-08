/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {ClassRegistrar, IConstructor} from "../Utils/ClassRegistrar";
import {IStateProvider} from "./IStateProvider";
import {JsUtil} from "../Utils/JsUtil";

export interface INumberFormat extends IStateProvider<INumberFormatState> {
    locale: string;

    format(value: number): string;
    setDecimalDigits(value: number):void;
}

export interface INumberFormatState {
    className: string;
    locale: string;
}

export enum NumberFormatClasses  {
    IntlNumberFormat = 'StockChartX.IntlNumberFormat',
    ValueScaleNumberFormat = 'StockChartX.ValueScaleNumberFormat'
}

class NumberFormatRegistrar {
    private static _formatters = new ClassRegistrar<INumberFormat>();

    /**
     * Gets object with information about registered number formatters. Key is class name and value is formatter constructor.
     * @name registeredFormatters.
     * @type {Object}
     * @memberOf NumberFormat
     */
    static get registeredFormatters(): Object {
        return this._formatters.registeredItems;
    }

    /**
     * Registers new number formatter.
     * @method register
     * @param {string} className The unique class name of the formatter.
     * @param {Function} constructor The constructor.
     * @memberOf NumberFormat
     */
    /**
     * Registers new number formatter.
     * @method register
     * @param {Function} type The constructor.
     * @memberOf NumberFormat
     */
    static register(type: typeof NumberFormat): void;
    static register(className: string, constructor: IConstructor<INumberFormat>): void;
    static register(typeOrClassName: string | typeof NumberFormat, constructor?: IConstructor<INumberFormat>) {
        if (typeof typeOrClassName === 'string')
            this._formatters.register(typeOrClassName, constructor);
        else
            this._formatters.register(typeOrClassName.className, <IConstructor<INumberFormat>> (typeOrClassName as unknown));
    }

    /**
     * Deserializes number formatter.
     * @method deserialize
     * @param {Object} state The formatter's state.
     * @returns {INumberFormat}
     * @memberOf NumberFormat
     */
    static deserialize(state: INumberFormatState): INumberFormat {
        if (!state)
            return null;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // MA IntlNumberFormat is the legacy format that came originally with Chart object. The new format is ValueScaleNumberFormat
        // developed by us to use abbreviation (M,K) in value scale. Therefore, for any legacy usage of IntlNumberFormat (from old
        // workspaces and such, then replace it with ValueScaleNumberFormat).
        if(state.className == NumberFormatClasses.IntlNumberFormat) {
            return this._formatters.createInstance(NumberFormatClasses.ValueScaleNumberFormat);
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        let format = this._formatters.createInstance(state.className);
        format.loadState(state);

        return format;
    }
}


/**
 * The abstract base class for number formatters.
 * @constructor NumberFormat
 */
export abstract class NumberFormat implements INumberFormat {
    static get className(): string {
        return '';
    }

    // NumberFormatRegistrar mixin
    static registeredFormatters: Object;
    static register: (typeOrClassName: string | typeof NumberFormat, constructor?: IConstructor<INumberFormat>) => void;
    static deserialize: (state: INumberFormatState) => INumberFormat;

    private _locale: string;
    /**
     * The locale string (e.g. 'en-US').
     * @name locale
     * @type {string}
     * @memberOf NumberFormat#
     */
    get locale(): string {
        return this._locale;
    }

    set locale(value: string) {
        if (this._locale !== value) {
            this._locale = value;
            this._onLocaleChanged();
        }
    }

    constructor(locale?: string) {
        this._locale = locale;
    }

    protected _onLocaleChanged() {

    }

    /**
     * Converts specified value into string representation.
     * @method format
     * @param {number} value The value.
     * @returns {string}
     * @memberOf NumberFormat#
     */
    abstract format(value: number): string;

    abstract setDecimalDigits(value: number):void;

    /**
     * Saves formatter state.
     * @method saveState
     * @returns {object} The state.
     * @memberOf NumberFormat
     * @see [loadState]{@linkcode NumberFormat#loadState}
     */
    saveState(): INumberFormatState {
        return {
            className: (this.constructor as typeof NumberFormat).className,
            locale: this.locale,
        };
    }

    /**
     * Loads state.
     * @method loadState
     * @param {object} state The state.
     * @memberOf NumberFormat
     * @see [saveState]{@linkcode NumberFormat#saveState}
     */
    loadState(state: INumberFormatState) {
        this._locale = state && state.locale;
    }
}

JsUtil.applyMixins(NumberFormat, [NumberFormatRegistrar]);
