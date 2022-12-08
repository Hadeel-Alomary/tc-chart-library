/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {DateTimeFormat, IDateTimeFormatState} from "./DateTimeFormat";

export interface ICustomDateTimeFormatState extends IDateTimeFormatState {
    formatString: string;
}

/**
 * Represents custom date time formatter.
 * @param {string} [format] Custom format string (see {@link http://momentjs.com/docs/#/displaying/} for more details.)
 * @constructor CustomDateTimeFormat
 * @augments DateTimeFormat
 * @memberOf StockChartX
 */
export class CustomDateTimeFormat extends DateTimeFormat {
    static get className(): string {
        return 'StockChartX.CustomDateTimeFormat';
    }

    /**
     * The format string. See {@link http://momentjs.com/docs/#/displaying/} for more details.
     * @name formatString
     * @type {string}
     * @memberOf CustomDateTimeFormat#
     */
    public formatString: string;

    constructor(format?: string) {
        super();

        this.formatString = format;
    }

    /**
     * @inheritdoc
     */
    format(date: Date): string {
        let momentDate = moment(date);
        moment.locale(this.locale);

        return momentDate.format(this.formatString);
    }

    /**
     * @inheritdoc
     */
    saveState(): ICustomDateTimeFormatState {
        let state = <ICustomDateTimeFormatState> super.saveState();
        state.formatString = this.formatString;

        return state;
    }

    /**
     * @inheritdoc
     */
    loadState(state: ICustomDateTimeFormatState) {
        super.loadState(state);

        this.formatString = state.formatString;
    }
}

DateTimeFormat.register(CustomDateTimeFormat);
