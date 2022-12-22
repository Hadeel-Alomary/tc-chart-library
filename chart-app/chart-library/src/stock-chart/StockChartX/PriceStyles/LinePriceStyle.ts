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
import {LinePlot} from "../Plots/LinePlot";
import {Chart} from '../Chart';

/**
 * Represents line price style.
 * @constructor LinePriceStyle
 * @augments PriceStyle
 * @memberOf StockChartX
 */
export class LinePriceStyle extends PriceStyle {
    static get className(): string {
        return 'line';
    }

    /**
     * @inheritdoc
     */
    createPlot(chart:Chart): Plot {
        return new LinePlot(chart, {
            plotStyle: LinePlot.Style.SIMPLE,
            plotType: PlotType.PRICE_STYLE,
        });
    }
}

PriceStyle.register(LinePriceStyle);
