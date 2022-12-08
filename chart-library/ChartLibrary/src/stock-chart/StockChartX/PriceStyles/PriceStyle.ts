/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IStateProvider} from "../Data/IStateProvider";
import {Chart} from "../Chart";
import {ClassRegistrar, IConstructor} from "../Utils/ClassRegistrar";
import {Plot} from "../Plots/Plot";
import {ChartPanel} from "../ChartPanels/ChartPanel";
import {DataSeries, DataSeriesSuffix} from "../Data/DataSeries";
import {AverageTrueRange} from "../../TASdk/TASdk";
import {JsUtil} from "../Utils/JsUtil";
import {TAIndicator} from "../Indicators/TAIndicator";
import {IndicatorField, IndicatorParam} from "../Indicators/IndicatorConst";

export interface IPriceStyle extends IStateProvider<IPriceStyleState> {
    chart: Chart;

    primaryDataSeriesSuffix(suffix: string): string;

    updateComputedDataSeries(): void;

    apply(): void;

    destroy(): void;
}

export interface IPriceStyleConfig {
    chart?: Chart;
}

export interface IPriceStyleState {
    className: string;
}

class PriceStyleRegistrar {
    private static _priceStyles = new ClassRegistrar<IPriceStyle>();

    /**
     * Gets object with information about registered price styles. Key is class name and value is constructor.
     * @name registeredPriceStyles.
     * @type {Object}
     * @memberOf PriceStyle
     */
    static get registeredPriceStyles(): Object {
        return this._priceStyles.registeredItems;
    }

    /**
     * Registers new price style.
     * @method register
     * @param {string} className The unique class name of the price style.
     * @param {Function} constructor The constructor.
     * @memberOf PriceStyle
     */
    /**
     * Registers new price style.
     * @method register
     * @param {Function} type The constructor.
     * @memberOf PriceStyle
     */
    static register(type: typeof PriceStyle): void;
    static register(className: string, constructor: IConstructor<IPriceStyle>): void;
    static register(typeOrClassName: string | typeof PriceStyle, constructor?: IConstructor<IPriceStyle>) {
        if (typeof typeOrClassName === 'string')
            this._priceStyles.register(typeOrClassName, constructor);
        else
            this._priceStyles.register(typeOrClassName.className, <IConstructor<IPriceStyle>> (typeOrClassName as unknown));
    }

    /**
     * Creates price style instance.
     * @param {string} className The class name of price style.
     * @returns {IPriceStyle}
     * @memberOf PriceStyle
     */
    static create(className: string): IPriceStyle {
        return this._priceStyles.createInstance(className);
    }

    /**
     * Deserializes price style.
     * @method deserialize
     * @param {Object} state The state of price style.
     * @returns {IPriceStyle}
     * @memberOf PriceStyle
     */
    static deserialize(state: IPriceStyleState): IPriceStyle {
        if (!state)
            return null;

        let priceStyle = this._priceStyles.createInstance(state.className);
        priceStyle.loadState(state);

        return priceStyle;
    }
}

/**
 * The base class for price styles.
 * @constructor PriceStyle
 * @memberOf StockChartX
 */
export abstract class PriceStyle implements IPriceStyle {
    static get className(): string {
        return '';
    }

    // PriceStyleRegistrar mixin
    static registeredPriceStyles: Object;
    static register: (typeOrClassName: string | typeof PriceStyle, constructor?: IConstructor<IPriceStyle>) => void;
    static create: (className: string) => IPriceStyle;
    static deserialize: (state: IPriceStyleState) => IPriceStyle;

    protected _plot: Plot;
    /**
     * The price style plot.
     * @name plot
     * @type {Plot}
     * @readonly
     * @memberOf PriceStyle#
     */
    get plot(): Plot {
        return this._plot;
    }

    private _chart: Chart;
    /**
     * The parent chart.
     * @name chart
     * @type {Chart}
     * @memberOf PriceStyle#
     */
    get chart(): Chart {
        return this._chart;
    }

    set chart(value: Chart) {
        if (this._chart !== value) {
            this.destroy();
            this._chart = value;
        }
    }

    /**
     * The chart panel.
     * @name mainPanel
     * @type {ChartPanel}
     * @readonly
     * @memberOf PriceStyle#
     */
    get chartPanel(): ChartPanel {
        return this._plot && this._plot.chartPanel;
    }

    constructor(config?: IPriceStyleConfig) {
        if (config) {
            this.chart = config.chart;
        }
    }

    /**
     * Saves price style state.
     * @method saveState
     * @returns {object} The state.
     * @memberOf PriceStyle#
     * @see [loadState]{@linkcode PriceStyle#loadState}
     */
    saveState(): IPriceStyleState {
        return {
            className: (this.constructor as typeof PriceStyle).className
        };
    }

    /**
     * Restores price style state.
     * @method loadState
     * @param {object} state The state.
     * @memberOf PriceStyle#
     * @see [saveState]{@linkcode PriceStyle#saveState}
     */
    loadState(state: IPriceStyleState) {
    }

    apply() {
        let chart = this._chart;
        if (!chart)
            return;

        let plot = this._plot;
        if (!plot)
            this._plot = plot = this.createPlot(chart);
        if (!plot)
            throw new Error('Price style plot is not created.');

        this.updateComputedDataSeries();
        chart.updateIndicators();

        let dsSuffix = DataSeriesSuffix;
        plot.dataSeries = [
            chart.primaryDataSeries(dsSuffix.CLOSE),
            chart.primaryDataSeries(dsSuffix.OPEN),
            chart.primaryDataSeries(dsSuffix.HIGH),
            chart.primaryDataSeries(dsSuffix.LOW)
        ];

        chart.mainPanel.addPlot(plot);
        chart.setNeedsLayout();
    }

    /**
     * Creates plot object for the price style.
     * @method createPlot
     * @returns {Plot}
     * @memberOf PriceStyle#
     * @protected
     */
    protected createPlot(chart:Chart): Plot {
        return null;
    }

    /**
     * Returns data series suffix which should be used to get primary data series.
     * @method dataSeriesSuffix
     * @returns {string}
     * @memberOf PriceStyle#
     */
    dataSeriesSuffix(): string {
        return '';
    }

    /**
     * Returns primary data series suffix.
     * @method primaryDataSeriesSuffix
     * @param {string} suffix The requesting data series suffix.
     * @returns {string}
     * @memberOf PriceStyle#
     */
    primaryDataSeriesSuffix(suffix: string): string {
        let dsSuffix = DataSeriesSuffix;

        switch (suffix) {
            case dsSuffix.OPEN:
            case dsSuffix.HIGH:
            case dsSuffix.LOW:
            case dsSuffix.CLOSE:
                return this.dataSeriesSuffix();
            default:
                return '';
        }
    }

    protected removeComputedDataSeries() {
        let chart = this._chart;
        if (!chart)
            return;

        let psSuffix = this.dataSeriesSuffix(),
            dsSuffix = DataSeriesSuffix;

        if (!psSuffix)
            return;

        chart.removeDataSeries(psSuffix + dsSuffix.DATE);
        chart.removeDataSeries(psSuffix + dsSuffix.OPEN);
        chart.removeDataSeries(psSuffix + dsSuffix.HIGH);
        chart.removeDataSeries(psSuffix + dsSuffix.LOW);
        chart.removeDataSeries(psSuffix + dsSuffix.CLOSE);
        chart.removeDataSeries(psSuffix + dsSuffix.VOLUME);
    }

    /**
     * Updates computed data series.
     * Some price styles use their own OHLC values (like P&F, Kagi, ..).
     * @method updateComputedDataSeries
     * @memberOf PriceStyle#
     */
    updateComputedDataSeries() {
    }

    protected _calculateAtr(period: number): number {
        let atr = new TAIndicator({
            taIndicator: AverageTrueRange,
            chart: this.chart
        });
        atr.setParameterValue(IndicatorParam.PERIODS, period);
        atr._usePrimaryDataSeries = false;

        let res = atr.calculate();
        if (!res.recordSet)
            return null;
        let field = res.recordSet.getField(IndicatorField.INDICATOR);
        if (!field)
            return null;
        let atrDataSeries = DataSeries.fromField(field, res.startIndex);
        let value = <number> atrDataSeries.lastValue;
        if (!value)
            return null;

        return Math.roundToDecimals(value, 5);
    }

    /**
     * Destroys price style.
     * @method destroy
     * @memberOf PriceStyle#
     */
    destroy() {
        let plot = this._plot;
        if (plot && plot.chartPanel)
            plot.chartPanel.removePlot(plot);

        this.removeComputedDataSeries();
    }
}

JsUtil.applyMixins(PriceStyle, [PriceStyleRegistrar]);
