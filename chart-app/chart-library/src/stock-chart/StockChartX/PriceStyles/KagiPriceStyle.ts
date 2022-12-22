/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


/**
 * The kagi reversal amount structure.
 * @typedef {object} KagiReversalAmount
 * @type {object}
 * @property {string} kind The reversal amount kind (atr or fixed).
 * @property {number} value The reversal amount.
 * @memberOf StockChartX
 * @example
 *  var reversal = {
 *      kind: KagiReversalKind.ATR,
 *      value: 14
 *  };
 */
import {IPriceStyleConfig, IPriceStyleState, PriceStyle} from "./PriceStyle";
import {JsUtil} from "../Utils/JsUtil";
import {Plot, PlotType} from "../Plots/Plot";
import {BarPlot} from "../Plots/BarPlot";
import {DataSeriesSuffix} from "../Data/DataSeries";
import {BarConverter} from "../Data/BarConverter";
import {Chart} from '../Chart';

/**
 * Kagi reversal amount kind enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const KagiReversalKind = {
    /** The reversal amount is based on ATR value. */
    ATR: 'atr',

    /** The reversal amount is based on fixed value. */
    FIXED: 'fixed',
};
Object.freeze(KagiReversalKind);

export interface IKagiReversalAmount {
    kind: string;
    value: number;
}

export interface IKagiPriceStyleDefaults {
    reversal: IKagiReversalAmount;
}

export interface IKagiPriceStyleConfig extends IPriceStyleConfig {
    reversal: IKagiReversalAmount;
}

export interface IKagiPriceStyleState extends IPriceStyleState {
    reversal: IKagiReversalAmount;
}


/**
 * Represents kagi price style.
 * @constructor KagiPriceStyle
 * @augments PriceStyle
 * @memberOf
 */
export class KagiPriceStyle extends PriceStyle {
    static defaults: IKagiPriceStyleDefaults = {
        reversal: {
            kind: KagiReversalKind.ATR,
            value: 20,
        },
    };

    static get className(): string {
        return 'kagi';
    }

    private _reversal: IKagiReversalAmount;
    /**
     * The reversal amount.
     * @name reversal
     * @type {KagiReversalAmount}
     * @memberOf KagiPriceStyle#
     */
    get reversal(): IKagiReversalAmount {
        return this._reversal;
    }

    set reversal(value: IKagiReversalAmount) {
        this._reversal = value;
    }

    private _reversalValue: number;
    /**
     * The calculated reversal amount value.
     * @name reversalValue
     * @type {number}
     * @memberOf KagiPriceStyle#
     */
    get reversalValue(): number {
        return this._reversalValue;
    }

    constructor(config?: IKagiPriceStyleConfig) {
        super(config);

        this.loadState(<IKagiPriceStyleState> config);
    }

    /**
     * @inheritdoc
     */
    saveState(): IKagiPriceStyleState {
        let state = <IKagiPriceStyleState> super.saveState();
        state.reversal = <IKagiReversalAmount> JsUtil.clone(this._reversal);

        return state;
    }

    /**
     * @inheritdoc
     */
    loadState(state?: IKagiPriceStyleState) {
        super.loadState(state);

        this.reversal = (state && state.reversal) || <IKagiReversalAmount> JsUtil.clone(KagiPriceStyle.defaults.reversal);
    }

    /**
     * @inheritdoc
     */
    createPlot(chart:Chart): Plot {
        return new BarPlot(chart, {
            plotStyle: BarPlot.Style.KAGI,
            plotType: PlotType.PRICE_STYLE,
        });
    }

    /**
     * @inheritdoc
     */
    dataSeriesSuffix(): string {
        return DataSeriesSuffix.KAGI;
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

    private _calculateReversalValue(): number {
        let reversal = this.reversal,
            value: number;

        switch (reversal.kind) {
            case KagiReversalKind.ATR:
                value = this._calculateAtr(reversal.value);
                break;
            case KagiReversalKind.FIXED:
                value = reversal.value;
                break;
            default:
                throw new Error("Unknown reversal amount kind: " + reversal.kind);
        }

        this._reversalValue = value;

        return value;
    }

    /**
     * @inheritdoc
     */
    updateComputedDataSeries() {
        let reversal = this._calculateReversalValue();
        if (!reversal)
            return;

        let dataManager = this.chart.dataManager,
            kagi = dataManager.barDataSeries(DataSeriesSuffix.KAGI, true);

        BarConverter.convertToKagi(dataManager.barDataSeries(), reversal, kagi);
    }
}

PriceStyle.register(KagiPriceStyle);
