/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IStateProvider} from "../Data/IStateProvider";
import {ChartPanel} from './ChartPanel';
import {Chart} from "../Chart";
import {ValueScale} from "../Scales/ValueScale";
import {Projection} from "../Scales/Projection";
import {ChartEventsExtender} from "../Utils/ChartEventsExtender";
import {ChartPanelValueScale} from "../Scales/ChartPanelValueScale";
import {JsUtil} from "../Utils/JsUtil";
import {ThemeType} from '../ThemeType';

export interface IChartPanelObject extends IStateProvider<IChartPanelObjectState> {
    chartPanel: ChartPanel;
    chart: Chart;
    valueScale: ValueScale;
    projection: Projection;
}

export interface IChartPanelObjectConfig {
    options?: IChartPanelObjectOptions;
}

export interface IChartPanelObjectOptions {
    id:string;
    visible: boolean;
    valueScaleIndex: number;
    showValueMarkers:boolean;
    locked:boolean;
}

export interface IChartPanelObjectState {
    options?: IChartPanelObjectOptions;
    panelIndex?: number;
    valueScaleIndex?: number;
}


/**
 *  The base class for all objects on the chart panel (drawings, plots, ..).
 *  @constructor ChartPanelObject
 *  @augments ChartEventsExtender
 *  @abstract
 */
export abstract class ChartPanelObject extends ChartEventsExtender implements IChartPanelObject {
    protected _options = <IChartPanelObjectOptions> {};

    private _panel: ChartPanel;

    get options(): IChartPanelObjectOptions {
        return this._options;
    }

    /**
     * Gets/Sets parent chart panel.
     * @name chartPanel
     * @type ChartPanel
     * @memberOf ChartPanelObject#
     */
    get chartPanel(): ChartPanel {
        return this._panel;
    }

    set chartPanel(value: ChartPanel) {
        let oldValue = this._panel;
        if (oldValue === value)
            return;

        this._panel = value;
        this._onChartPanelChanged(oldValue);

        if (value && !this._valueScale) {
            let index = this._options.valueScaleIndex;
            if (index)
                this.valueScale = this.chart.valueScales[index];
        }
    }

    protected get context(): CanvasRenderingContext2D {
        return this._panel.context;
    }


    private _valueScale: ValueScale;
    get valueScale(): ValueScale {
        return this._valueScale || this.chart.valueScale;
    }

    set valueScale(value: ValueScale) {
        let oldValue = this._valueScale;
        if (oldValue !== value) {
            this._valueScale = value;
            this._onValueScaleChanged(oldValue);
        }
    }

    /**
     * Gets chart panel value scale.
     * @name panelValueScale
     * @type {ChartPanelValueScale}
     * @readonly
     * @memberOf ChartPanelObject#
     */
    get panelValueScale(): ChartPanelValueScale {
        return this._panel.getValueScale(this.valueScale);
    }

    /**
     * Gets projection object to convert coordinates.
     * @name projection
     * @type Projection
     * @readonly
     * @memberOf ChartPanelObject#
     */
    get projection(): Projection {
        return this._panel && this._panel.getProjection(this.valueScale);
    }

    /**
     * Gets/Sets flag that indicates whether drawing is visible.
     * @name visible
     * @type {boolean}
     * @memberOf ChartPanelObject#
     */
    get visible(): boolean {
        return this._options.visible;
    }

    set visible(value: boolean) {
        let oldValue = this.visible;
        if (oldValue !== value) {
            this._options.visible = value;
            this._onVisibleChanged(oldValue);
        }
    }

    constructor(chart:Chart, config: IChartPanelObjectConfig) {
        super(chart);

        this.loadState(<IChartPanelObjectState> config);
    }

    protected _setOption(key: string, value: unknown, valueChangedEventName?: string) {
        let options = this._options,
            oldValue = options[key];

        if (oldValue !== value) {
            options[key] = value;

            if (valueChangedEventName)
                this.fire(valueChangedEventName, value, oldValue);
        }
    }

    protected _onChartPanelChanged(oldValue: ChartPanel) {

    }

    protected _onValueScaleChanged(oldValue: ValueScale) {

    }

    protected _onVisibleChanged(oldValue: boolean) {

    }

    /**
     * Saves chart panel object state.
     * @method saveState
     * @returns {object}
     * @memberOf ChartPanelObject#
     */
    saveState(): IChartPanelObjectState {
        let state = <IChartPanelObjectState> {
            options: JsUtil.clone(this._options)
        };

        if (this.chartPanel)
            state.panelIndex = this.chartPanel.getIndex();
        if (this.valueScale)
            state.valueScaleIndex = this.valueScale.index;

        return state;
    }

    /**
     * Loads chart panel object state.
     * @method saveState
     * @returns {object}
     * @memberOf ChartPanelObject#
     */
    loadState(state: IChartPanelObjectState) {
        let suppress = this.suppressEvents();

        state = state || <IChartPanelObjectState> {};
        this._options = (state && state.options) || <IChartPanelObjectOptions> {};

        this.suppressEvents(suppress);
    }

    /**
     * Draws object.
     * @method draw
     * @memberOf ChartPanelObject#
     */
    draw() {

    }
}
