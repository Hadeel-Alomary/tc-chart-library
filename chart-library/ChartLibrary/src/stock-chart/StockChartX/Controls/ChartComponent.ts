/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Chart} from "../Chart";
import {Component, IComponent} from "./Component";
import {IStateProvider} from "../Data/IStateProvider";

export interface IChartComponentConfig {
    chart: Chart;
}

export interface IChartComponentState {

}

export interface IChartComponent extends IComponent, IStateProvider<IChartComponentState> {
    chart: Chart;

    draw(): void;

    destroy(): void;
}

/**
 * Represents abstract chart component on the chart.
 * @constructor ChartComponent
 * @abstract
 * @augments Component
 */
/**
 * Saves component state.
 * @method saveState
 * @returns {Object}
 * @see [loadState]{@linkcode ChartComponent#loadState} to load state.
 * @memberOf ChartComponent#
 */

/**
 * Loads component state.
 * @method loadState
 * @param {Object} state The state
 * @see [saveState]{@linkcode ChartComponent#saveState} to save state.
 * @memberOf ChartComponent#
 */
/**
 * Draws component.
 * @method draw
 * @memberOf ChartComponent#
 */
export abstract class ChartComponent extends Component implements IChartComponent {
    private _chart: Chart;
    /**
     *  The parent chart.
     *  @name chart
     *  @type {Chart}
     *  @readonly
     *  @memberOf ChartComponent#
     */
    get chart(): Chart {
        return this._chart;
    }

    constructor(config: IChartComponentConfig) {
        super();

        this._chart = config.chart;

        this._subscribeEvents();
    }

    protected _subscribeEvents() {

    }

    protected _unsubscribeEvents() {

    }

    abstract saveState(): IChartComponentState;

    abstract loadState(state: IChartComponentState): void;

    abstract draw(): void;

    /**
     * @inheritdoc
     */
    destroy() {
        this._unsubscribeEvents();
    }
}
