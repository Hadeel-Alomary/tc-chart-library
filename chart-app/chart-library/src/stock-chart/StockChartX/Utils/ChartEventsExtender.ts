/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Chart} from "../Chart";
import {Tc} from '../../../utils';

/**
 * The abstract class that extends chart events.
 * @constructor ChartEventsExtender
 * @abstract
 */
export abstract class ChartEventsExtender {
    private _suppressEvents: boolean = false;

    private _chart: Chart;

    constructor(chart:Chart) {
        Tc.assert(chart != null, "chart is not defined");
        this._chart = chart;
    }

    get chart():Chart {
        return this._chart;
    }

    /**
     * Suppresses/Allows all events.
     * @method suppressEvents
     * @param {boolean} [suppress = true] The flag to suppress or resume events raising.
     * @returns {boolean} The old value.
     * @memberOf ChartEventsExtender#
     * @example <caption>Suppress events</caption>
     *  obj.suppressEvents();
     * @example <caption>Resume events</caption>
     *  obj.suppressEvents(false);
     */
    suppressEvents(suppress?: boolean): boolean {
        let oldValue = this._suppressEvents;
        this._suppressEvents = suppress != null ? suppress : true;

        return oldValue;
    }

    /**
     * Fires event.
     * @method fire
     * @param {String} event The event name.
     * @param {*} [newValue] The new property value.
     * @param {*} [oldValue] The old property value.
     * @memberOf ChartEventsExtender#
     * @example
     *  obj.fire('custom_event', 'new value', 'old value');
     */
    fire(event: string, newValue?: unknown, oldValue?: unknown) {
        let chart = this._chart;
        if (chart && !this._suppressEvents)
            chart.fireTargetValueChanged(this, event, newValue, oldValue);
    }
}
