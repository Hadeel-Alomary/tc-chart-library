/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


/**
 * The point & figure box size structure.
 * @typedef {object} PointAndFigureBoxSize
 * @type {object}
 * @property {string} kind The box size kind (atr or fixed).
 * @property {number} value The box size value.
 * @memberOf StockChartX
 * @example
 *  var boxSize = {
 *      kind: PointAndFigureBoxSizeKind.ATR,
 *      value: 14
 *  };
 */
import {IPriceStyleConfig, IPriceStyleState, PriceStyle} from "./PriceStyle";
import {JsUtil} from "../Utils/JsUtil";
import {Plot, PlotType} from "../Plots/Plot";
import {PointAndFigurePlot} from "../Plots/PointAndFigurePlot";
import {BarPlot} from "../Plots/BarPlot";
import {DataSeriesSuffix} from "../Data/DataSeries";
import {BarConverter} from "../Data/BarConverter";
import {Chart} from '../Chart';

/**
 * Point & Figure box size kind enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const PointAndFigureBoxSizeKind = {
    /** The box size is based on ATR value. */
    ATR: 'atr',

    /** The box size is based on fixed value. */
    FIXED: 'fixed',
};
Object.freeze(PointAndFigureBoxSizeKind);

export interface IPointAndFigureBoxSize {
    kind: string;
    value: number;
}

export interface IPointAndFigurePriceStyleDefaults {
    boxSize: IPointAndFigureBoxSize;
    reversal: number;
}

export interface IPointAndFigurePriceStyleConfig extends IPriceStyleConfig {
    boxSize: IPointAndFigureBoxSize;
    reversal: number;
}

export interface IPointAndFigurePriceStyleState extends IPriceStyleState {
    boxSize: IPointAndFigureBoxSize;
    reversal: number;
}


/**
 * Represents point and figure price style.
 * @constructor PointAndFigurePriceStyle
 * @augments PriceStyle
 * @memberOf StockChartX
 */
export class PointAndFigurePriceStyle extends PriceStyle {
    static defaults: IPointAndFigurePriceStyleDefaults = {
        boxSize: {
            kind: PointAndFigureBoxSizeKind.ATR,
            value: 20,
        },
        reversal: 3
    };

    static get className(): string {
        return 'pointAndFigure';
    }

    private _boxSize: IPointAndFigureBoxSize;
    /**
     * The box size.
     * @name boxSize
     * @type {PointAndFigureBoxSize}
     * @memberOf PointAndFigurePriceStyle#
     */
    get boxSize(): IPointAndFigureBoxSize {
        return this._boxSize;
    }

    set boxSize(value: IPointAndFigureBoxSize) {
        this._boxSize = value;
    }

    private _reversal: number;
    /**
     * The reversal amount.
     * @name reversal
     * @type {number}
     * @memberOf PointAndFigurePriceStyle#
     */
    get reversal(): number {
        return this._reversal;
    }

    set reversal(value: number) {
        if (value != null && !JsUtil.isPositiveNumber(value))
            throw new TypeError("Reversal must be a positive number.");

        this._reversal = value;
    }

    private _boxSizeValue: number;
    /**
     * The calculated box size value.
     * @name boxSizeValue
     * @type {number}
     * @readonly
     * @memberOf PointAndFigurePriceStyle#
     */
    get boxSizeValue(): number {
        return this._boxSizeValue;
    }

    constructor(config?: IPointAndFigurePriceStyleConfig) {
        super(config);

        this.loadState(<IPointAndFigurePriceStyleState> config);
    }

    /**
     * @inheritdoc
     */
    saveState(): IPointAndFigurePriceStyleState {
        let state = <IPointAndFigurePriceStyleState> super.saveState();
        state.boxSize = <IPointAndFigureBoxSize> JsUtil.clone(this._boxSize);
        state.reversal = this._reversal;

        return state;
    }

    /**
     * @inheritdoc
     */
    loadState(state?: IPointAndFigurePriceStyleState) {
        super.loadState(state);

        this.boxSize = (state && state.boxSize) || <IPointAndFigureBoxSize> JsUtil.clone(PointAndFigurePriceStyle.defaults.boxSize);
        this.reversal = (state && state.reversal) || PointAndFigurePriceStyle.defaults.reversal;
    }

    /**
     * @inheritdoc
     */
    createPlot(chart:Chart): Plot {
        let plot = new PointAndFigurePlot(chart, {
            plotStyle: BarPlot.Style.POINT_AND_FIGURE,
            plotType: PlotType.PRICE_STYLE,
        });
        plot.boxSize = this._boxSizeValue;

        return plot;
    }

    /**
     * @inheritdoc
     */
    dataSeriesSuffix(): string {
        return DataSeriesSuffix.POINT_AND_FIGURE;
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
            case PointAndFigureBoxSizeKind.ATR:
                value = this._calculateAtr(boxSize.value);
                break;
            case PointAndFigureBoxSizeKind.FIXED:
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
        if (!boxSize)
            return;

        let plot = <PointAndFigurePlot> this._plot;
        if (plot)
            plot.boxSize = boxSize;

        let dataManager = this.chart.dataManager,
            pf = dataManager.barDataSeries(DataSeriesSuffix.POINT_AND_FIGURE, true);

        BarConverter.convertToPointAndFigure(dataManager.barDataSeries(), boxSize, this.reversal, pf);
    }
}

PriceStyle.register(PointAndFigurePriceStyle);
