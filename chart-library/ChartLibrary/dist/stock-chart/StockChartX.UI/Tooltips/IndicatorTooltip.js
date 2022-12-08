import { __extends } from "tslib";
import { ChartTooltipType } from "../../../services/index";
import { IchimokuIndicator } from "../../StockChartX/Indicators/IchimokuIndicator";
import { IndicatorField } from "../../StockChartX/Indicators/IndicatorConst";
import { AbstractTooltip } from "./AbstractTooltip";
var IDS = {
    TOOLTIP_ID: '#scxIndicatorTooltip',
    DATE_VALUE_ID: '#scxIndicatorTooltip-dateValue',
    TIME_VALUE_ID: '#scxIndicatorTooltip-timeValue'
};
var IndicatorTooltip = (function (_super) {
    __extends(IndicatorTooltip, _super);
    function IndicatorTooltip() {
        return _super.call(this) || this;
    }
    Object.defineProperty(IndicatorTooltip, "instance", {
        get: function () {
            if (IndicatorTooltip._instance == null) {
                IndicatorTooltip._instance = new IndicatorTooltip();
            }
            return IndicatorTooltip._instance;
        },
        enumerable: false,
        configurable: true
    });
    IndicatorTooltip.prototype.show = function (config) {
        if (this.shown)
            this.hide();
        if (this._outsideTheSeries(config.indicator, config.chartPanel))
            return;
        this._appendDataToHTML(config.indicator, config.chartPanel);
        $(IDS.TOOLTIP_ID).addClass('shown');
        this.shown = true;
        this.setPosition(config.chartPanel, config.mousePosition, IDS.TOOLTIP_ID);
    };
    IndicatorTooltip.prototype.hide = function () {
        if (!this.shown)
            return;
        this._removeAddedRow();
        $(IDS.TOOLTIP_ID).removeClass('shown');
        this.shown = false;
    };
    IndicatorTooltip.prototype.getType = function () {
        return ChartTooltipType.Indicator;
    };
    IndicatorTooltip.prototype._removeAddedRow = function () {
        $('.scxIndicatorTooltip-added-row').remove();
    };
    IndicatorTooltip.prototype._outsideTheSeries = function (indicator, panel) {
        var hoveredRecord = panel.chart.hoveredRecord;
        var hoveringBeforeTheFirstBar = hoveredRecord < 0 || hoveredRecord == null;
        if (hoveringBeforeTheFirstBar)
            return true;
        for (var i = 0; i < indicator.plotItems.length; i++) {
            var item = indicator.plotItems[i];
            var recordCount = item.dataSeries ? item.dataSeries.length : 0;
            var hoveringAfterTheLastBar = hoveredRecord >= recordCount;
            if (hoveringAfterTheLastBar)
                return true;
        }
        return false;
    };
    IndicatorTooltip.prototype._appendDataToHTML = function (indicator, chartPanel) {
        var chartSeries = chartPanel.chart.barDataSeries();
        var record = chartPanel.chart.hoveredRecord;
        var date = chartSeries.date.valueAtIndex(record);
        $(IDS.DATE_VALUE_ID).text(moment(date).format('YYYY-MM-DD'));
        var time = this.isIntradayChart(chartPanel.chart) ? moment(date).format('HH:mm:ss') : null;
        if (time) {
            $(IDS.TIME_VALUE_ID).text(time);
            $(IDS.TIME_VALUE_ID).parent().removeClass('hidden');
        }
        else {
            $(IDS.TIME_VALUE_ID).parent().addClass('hidden');
        }
        for (var i = 0; i < indicator.plotItems.length; i++) {
            var item = indicator.plotItems[i];
            var field = '';
            if (indicator instanceof IchimokuIndicator) {
                field = indicator.fieldNames[i];
            }
            else {
                if (indicator.fieldNames[i] != '' &&
                    indicator.fieldNames[i] !== IndicatorField.INDICATOR) {
                    field = indicator.getPlotName(indicator.fieldNames[i]);
                }
                else {
                    field = indicator.getShortName();
                }
            }
            var value = item.dataSeries.valueAtIndex(record), text = chartPanel.formatValue(value);
            var english = /^[A-Za-z0-9 ]*$/;
            var englishClass = english.test(field) ? 'english' : '';
            var appendedString = "<tr class=\"scxIndicatorTooltip-row scxIndicatorTooltip-added-row\"><td class=\"" + englishClass + "\">" + field + "</td><td>" + text + "</td></tr>";
            $(appendedString).appendTo(IDS.TOOLTIP_ID);
        }
    };
    IndicatorTooltip._instance = null;
    return IndicatorTooltip;
}(AbstractTooltip));
export { IndicatorTooltip };
//# sourceMappingURL=IndicatorTooltip.js.map