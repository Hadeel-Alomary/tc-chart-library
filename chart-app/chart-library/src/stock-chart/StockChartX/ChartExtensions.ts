/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {ChartImplementation} from './ChartImplementation';
import {PriceTooltip} from '../StockChartX.UI/Tooltips/PriceTooltip';
import {IndicatorTooltip} from '../StockChartX.UI/Tooltips/IndicatorTooltip';
import {SplitTooltip} from '../StockChartX.UI/Tooltips/SplitTooltip';
import {DrawingTooltip} from '../StockChartX.UI/Tooltips/DrawingTooltip';
import {TradingTooltip} from '../StockChartX.UI/Tooltips/TradingTooltip';
import {NewsTooltip} from '../StockChartX.UI/Tooltips/NewsTooltip';
import {AlertTooltip} from '../StockChartX.UI/Tooltips/AlertTooltip';
import {IChartConfig} from './Chart';
import {ChartAccessorService} from "@src/services/chart";

$.fn.extend({
    StockChartX: function (config: IChartConfig) {
        config = config || <IChartConfig>{};
        config.container = this;

        let chart = new ChartImplementation(config);

        if(!chart.readOnly){
            getAllTooltips().forEach(tooltip => ChartAccessorService.instance.getChartTooltipService().register(tooltip));
        }

        return chart;
    }
});




const getAllTooltips = () => {
    return [
        PriceTooltip.instance,
        IndicatorTooltip.instance,
        SplitTooltip.instance,
        DrawingTooltip.instance,
        TradingTooltip.instance,
        NewsTooltip.instance,
        AlertTooltip.instance
    ];
};
