import { ChartImplementation } from './ChartImplementation';
import { PriceTooltip } from '../StockChartX.UI/Tooltips/PriceTooltip';
import { IndicatorTooltip } from '../StockChartX.UI/Tooltips/IndicatorTooltip';
import { SplitTooltip } from '../StockChartX.UI/Tooltips/SplitTooltip';
import { DrawingTooltip } from '../StockChartX.UI/Tooltips/DrawingTooltip';
import { ChartAccessorService } from '../../services/index';
import { TradingTooltip } from '../StockChartX.UI/Tooltips/TradingTooltip';
import { NewsTooltip } from '../StockChartX.UI/Tooltips/NewsTooltip';
import { AlertTooltip } from '../StockChartX.UI/Tooltips/AlertTooltip';
$.fn.extend({
    StockChartX: function (config) {
        config = config || {};
        config.container = this;
        var chart = new ChartImplementation(config);
        if (!chart.readOnly) {
            getAllTooltips().forEach(function (tooltip) { return ChartAccessorService.instance.getChartTooltipService().register(tooltip); });
        }
        return chart;
    }
});
var getAllTooltips = function () {
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
//# sourceMappingURL=ChartExtensions.js.map