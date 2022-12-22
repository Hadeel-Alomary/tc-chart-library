/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IPriceStyleConfig, IPriceStyleState, PriceStyle} from "./PriceStyle";
import {BarPlot} from "../Plots/BarPlot";
import {Plot, PlotType} from "../Plots/Plot";
import {DataSeriesSuffix} from "../Data/DataSeries";
import {BarConverter} from "../Data/BarConverter";
import {Chart} from '../Chart';

export interface ILineBreakPriceStyleDefaults {
    lines: number;
}

export interface ILineBreakPriceStyleConfig extends IPriceStyleConfig {
    lines: number;
}

export interface ILineBreakPriceStyleState extends IPriceStyleState {
    lines: number;
}

/**
 * Represents line break price style.
 * @constructor LineBreakPriceStyle
 * @augments PriceStyle
 * @memberOf StockChartX
 */
export class LineBreakPriceStyle extends PriceStyle {
    static defaults: ILineBreakPriceStyleDefaults = {
        lines: 3
    };

    static get className(): string {
        return 'lineBreak';
    }

    private _lines: number;
    /**
     * The number of lines.
     * @name lines
     * @type {number}
     * @memberOf LineBreakPriceStyle#
     */
    get lines(): number {
        return this._lines;
    }

    set lines(value: number) {
        this._lines = value;
    }

    constructor(config?: ILineBreakPriceStyleConfig) {
        super(config);

        this.loadState(<ILineBreakPriceStyleState> config);
    }

    /**
     * @inheritdoc
     */
    saveState(): ILineBreakPriceStyleState {
        let state = <ILineBreakPriceStyleState> super.saveState();
        state.lines = this.lines;

        return state;
    }

    /**
     * @inheritdoc
     */
    loadState(state?: ILineBreakPriceStyleState) {
        super.loadState(state);

        this.lines = (state && state.lines) || LineBreakPriceStyle.defaults.lines;
    }

    /**
     * @inheritdoc
     */
    createPlot(chart:Chart): Plot {
        return new BarPlot(chart, {
            plotStyle: BarPlot.Style.CANDLE,
            plotType: PlotType.PRICE_STYLE,
        });
    }

    /**
     * @inheritdoc
     */
    dataSeriesSuffix(): string {
        return DataSeriesSuffix.LINE_BREAK;
    }

    /**
     * @inheritdoc
     */
    primaryDataSeriesSuffix(suffix: string): string {
        let psSuffix = super.primaryDataSeriesSuffix(suffix);
        if (psSuffix)
            return psSuffix;

        switch (suffix) {
            case DataSeriesSuffix.DATE:
            case DataSeriesSuffix.VOLUME:
                return this.dataSeriesSuffix();
            default:
                return '';
        }
    }

    /**
     * @inheritdoc
     */
    updateComputedDataSeries() {
        let dataManager = this.chart.dataManager,
            lineBreak = dataManager.barDataSeries(DataSeriesSuffix.LINE_BREAK, true);

        BarConverter.convertToLineBreak(dataManager.barDataSeries(), this.lines, lineBreak);
    }
}

PriceStyle.register(LineBreakPriceStyle);
