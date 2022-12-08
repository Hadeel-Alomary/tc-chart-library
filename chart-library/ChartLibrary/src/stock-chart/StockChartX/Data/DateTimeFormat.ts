/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IStateProvider} from "./IStateProvider";
import {ClassRegistrar, IConstructor} from "../Utils/ClassRegistrar";
import {JsUtil} from "../Utils/JsUtil";

export interface IDateTimeFormat extends IStateProvider<IDateTimeFormatState> {
    locale: string;

    format(date: Date, timeInterval?: number): string;
}

export interface IDateTimeFormatState {
    className: string;
    locale: string;
}

class DateTimeFormatRegistrar {
    private static _formatters = new ClassRegistrar<IDateTimeFormat>();

    /**
     * Gets object with information about registered date time formatters. Key is class name and value is formatter constructor.
     * @name registeredFormatters.
     * @type {Object}
     * @memberOf DateTimeFormat
     */
    static get registeredFormatters(): Object {
        return this._formatters.registeredItems;
    }

    /**
     * Registers new date formatter.
     * @method register
     * @param {string} className The unique class name of the formatter.
     * @param {Function} constructor The constructor.
     * @memberOf DateTimeFormat
     */
    /**
     * Registers new date formatter.
     * @method register
     * @param {Function} type The formatter's constructor.
     * @memberOf DateTimeFormat
     */
    static register(type: typeof DateTimeFormat): void;
    static register(className: string, constructor: IConstructor<IDateTimeFormat>): void;
    static register(typeOrClassName: string | typeof DateTimeFormat, constructor?: IConstructor<IDateTimeFormat>) {
        if (typeof typeOrClassName === 'string')
            this._formatters.register(typeOrClassName, constructor);
        else
            this._formatters.register(typeOrClassName.className, <IConstructor<IDateTimeFormat>> (typeOrClassName as unknown));
    }

    /**
     * Deserializes date formatter.
     * @method deserialize
     * @param {Object} state The formatter's state.
     * @returns {IDateTimeFormat}
     * @memberOf DateTimeFormat
     */
    static deserialize(state: IDateTimeFormatState): IDateTimeFormat {
        if (!state)
            return null;

        let format = this._formatters.createInstance(state.className);
        format.loadState(state);

        return format;
    }
}


/**
 * The abstract date formatter.
 * @constructor DateTimeFormat
 */
export abstract class DateTimeFormat implements IDateTimeFormat {
    static get className(): string {
        return '';
    }

    // DateTimeFormatRegistrar mixin
    static registeredFormatters: Object;
    static register: (typeOrClassName: string | typeof DateTimeFormat, constructor?: IConstructor<IDateTimeFormat>) => void;
    static deserialize: (state: IDateTimeFormatState) => IDateTimeFormat;

    private _locale: string;
    /**
     * The locale string to use.
     * @name locale
     * @type {string}
     * @memberOf DateTimeFormat#
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

    protected _onLocaleChanged() {

    }

    /**
     * Converts specified date into string representation.
     * @method format
     * @param {Date} date The date.
     * @returns {string}
     * @memberOf DateTimeFormat#
     */
    abstract format(date: Date): string;

    /**
     * Saves formatter state.
     * @method saveState
     * @returns {object} The state.
     * @memberOf DateTimeFormat#
     * @see [loadState]{@linkcode DateTimeFormat#loadState}
     */
    saveState(): IDateTimeFormatState {
        return {
            className: (this.constructor as typeof DateTimeFormat).className,
            locale: this.locale
        };
    }

    /**
     * Loads state.
     * @method loadState
     * @param {object} state The state.
     * @memberOf DateTimeFormat#
     * @see [saveState]{@linkcode DateTimeFormat#saveState}
     */
    loadState(state: IDateTimeFormatState) {
        this.locale = state.locale;
    }
}

JsUtil.applyMixins(DateTimeFormat, [DateTimeFormatRegistrar]);
