/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {IPriceStyleConfig, IPriceStyleState, PriceStyle} from "./PriceStyle";
import {IPointAndFigureBoxSize} from "./PointAndFigurePriceStyle";
import {JsUtil} from "../Utils/JsUtil";
import {Plot, PlotType} from "../Plots/Plot";
import {BarPlot} from "../Plots/BarPlot";
import {DataSeriesSuffix} from "../Data/DataSeries";
import {BarConverter} from "../Data/BarConverter";
import {Chart} from '../Chart';

/**
 * The renko box size structure.
 * @typedef {object} RenkoBoxSize
 * @type {object}
 * @property {string} kind The box size kind (atr or fixed).
 * @property {number} value The box size value.
 * @memberOf StockChartX
 * @example
 *  var boxSize = {
 *      kind: RenkoBoxSizeKind.ATR,
 *      value: 14
 *  };
 */

export interface IRenkoBoxSize {
    kind: string;
    value: number;
}

export interface IRenkoPriceStyleDefaults {
    boxSize: IRenkoBoxSize;
}

export interface IRenkoPriceStyleConfig extends IPriceStyleConfig {
    boxSize: IRenkoBoxSize;
}

export interface IRenkoPriceStyleState extends IPriceStyleState {
    boxSize: IRenkoBoxSize;
}


/**
 * Renko box kind enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const RenkoBoxSizeKind = {
    /** The box size is based on fixed value. */
    FIXED: 'fixed',

    /** The box size is based on ATR value. */
    ATR: 'atr'
};
Object.freeze(RenkoBoxSizeKind);


/**
 * Represents renko price style.
 * @constructor RenkoPriceStyle
 * @augments PriceStyle
 * @memberOf
 */
export class RenkoPriceStyle extends PriceStyle {
    static defaults: IRenkoPriceStyleDefaults = {
        boxSize: {
            kind: RenkoBoxSizeKind.ATR,
            value: 20,
        },
    };

    static get className(): string {
        return 'renko';
    }

    private _boxSize: IPointAndFigureBoxSize;
    /**
     * The box size.
     * @name boxSize
     * @type {RenkoBoxSize}
     * @memberOf RenkoPriceStyle#
     */
    get boxSize(): IRenkoBoxSize {
        return this._boxSize;
    }

    set boxSize(value: IRenkoBoxSize) {
        this._boxSize = value;
    }

    private _boxSizeValue: number;
    /**
     * The calculated box size value.
     * @name boxSizeValue
     * @type {number}
     * @readonly
     * @memberOf RenkoPriceStyle#
     */
    get boxSizeValue(): number {
        return this._boxSizeValue;
    }

    constructor(config?: IRenkoPriceStyleConfig) {
        super(config);

        this.loadState(<IRenkoPriceStyleState> config);
    }

    /**
     * @inheritdoc
     */
    saveState(): IRenkoPriceStyleState {
        let state = <IRenkoPriceStyleState> super.saveState();
        state.boxSize = <IRenkoBoxSize> JsUtil.clone(this._boxSize);

        return state;
    }

    /**
     * @inheritdoc
     */
    loadState(state?: IRenkoPriceStyleState) {
        super.loadState(state);

        this.boxSize = (state && state.boxSize) || <IRenkoBoxSize> JsUtil.clone(RenkoPriceStyle.defaults.boxSize);
    }

    /**
     * @inheritdoc
     */
    createPlot(chart:Chart): Plot {
        return new BarPlot(chart, {
            plotStyle: BarPlot.Style.RENKO,
            plotType: PlotType.PRICE_STYLE,
        });
    }

    /**
     * @inheritdoc
     */
    dataSeriesSuffix(): string {
        return DataSeriesSuffix.RENKO;
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

    private _calculateBoxSizeValue(): number {
        let boxSize = this.boxSize,
            value: number;

        switch (boxSize.kind) {
            case RenkoBoxSizeKind.ATR:
                value = this._calculateAtr(boxSize.value);
                break;
            case RenkoBoxSizeKind.FIXED:
                value = boxSize.value;
                break;
            default:
                throw new Error("Unknown box size kind: " + boxSize.kind);
        }

        this._boxSizeValue = value;

        return value;
    }

    /**
     * @inheritdoc
     */
    updateComputedDataSeries() {
        let boxSize = this._calculateBoxSizeValue();
        let dataManager = this.chart.dataManager,
            renko = dataManager.barDataSeries(DataSeriesSuffix.RENKO, true);

        BarConverter.convertToRenko(dataManager.barDataSeries(), boxSize, renko);
    }
}

PriceStyle.register(RenkoPriceStyle);
