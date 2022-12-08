/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Chart} from "../Chart";
import {FrameControl, IFrameControl} from "./FrameControl";

export interface IChartFrameControlConfig {
    chart: Chart;
}

export interface IChartFrameControl extends IFrameControl {
    chart: Chart;
}

/**
 * Represents abstract chart control with frame.
 * @constructor ChartFrameControl
 * @abstract
 * @augments FrameControl
 */
export class ChartFrameControl extends FrameControl implements IChartFrameControl {
    public _chart: Chart;
    /**
     * Gets parent chart.
     * @name chart
     * @type {Chart}
     * @readonly
     * @memberOf ChartFrameControl#
     */
    get chart(): Chart {
        return this._chart;
    }

    constructor(config: IChartFrameControlConfig) {
        super();

        if (!config)
            throw new TypeError('Config is not specified.');

        this._chart = config.chart;
    }

    protected _subscribeEvents() {

    }

    protected _unsubscribeEvents() {

    }

    /**
     * @inheritdoc
     */
    destroy() {
        this._unsubscribeEvents();

        super.destroy();
    }
}
