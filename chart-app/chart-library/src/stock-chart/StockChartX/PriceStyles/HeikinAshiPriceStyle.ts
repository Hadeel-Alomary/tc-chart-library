/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {PriceStyle} from "./PriceStyle";
import {Plot, PlotType} from "../Plots/Plot";
import {BarPlot} from "../Plots/BarPlot";
import {DataSeriesSuffix} from "../Data/DataSeries";
import {BarConverter} from "../Data/BarConverter";
import {Chart} from '../Chart';

/**
 * Represents heikin ashi price style.
 * @constructor HeikinAshiPriceStyle
 * @augments PriceStyle
 * @memberOf StockChartX
 */
export class HeikinAshiPriceStyle extends PriceStyle {
    static get className(): string {
        return 'heikinAshi';
    }

    /**
     * @inheritdoc
     */
    createPlot(chart:Chart): Plot {
        return new BarPlot(chart, {
            plotStyle: BarPlot.Style.HEIKIN_ASHI,
            plotType: PlotType.PRICE_STYLE,
        });
    }

    /**
     * @inheritdoc
     */
    dataSeriesSuffix(): string {
        return DataSeriesSuffix.HEIKIN_ASHI;
    }

    /**
     * @inheritdoc
     */
    updateComputedDataSeries() {
        let dataManager = this.chart.dataManager,
            heikinAshi = dataManager.ohlcDataSeries(DataSeriesSuffix.HEIKIN_ASHI, true);

        BarConverter.convertToHeikinAshi(dataManager.ohlcDataSeries(), heikinAshi);
    }
}

PriceStyle.register(HeikinAshiPriceStyle);
