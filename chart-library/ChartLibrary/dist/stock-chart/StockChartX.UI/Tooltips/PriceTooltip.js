var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ChartTooltipType } from "../../../services/index";
import { AbstractTooltip } from "./AbstractTooltip";
var IDS = {
    TOOLTIP_ID: '#scxPriceTooltip',
    DATE_VALUE_ID: '#scxPriceTooltip-dateValue',
    TIME_VALUE_ID: '#scxPriceTooltip-timeValue',
    CLOSE_VALUE_ID: '#scxPriceTooltip-closeValue',
    OPEN_VALUE_ID: '#scxPriceTooltip-openValue',
    HIGH_VALUE_ID: '#scxPriceTooltip-highValue',
    LOW_VALUE_ID: '#scxPriceTooltip-lowValue',
    VOLUME_VALUE_ID: '#scxPriceTooltip-volumeValue',
    CHANGE_VALUE_ID: '#scxPriceTooltip-changeValue',
    CHANGE_PERCENTAGE_VALUE_ID: '#scxPriceTooltip-changePercentageValue',
};
var PriceTooltip = (function (_super) {
    __extends(PriceTooltip, _super);
    function PriceTooltip() {
        return _super.call(this) || this;
    }
    Object.defineProperty(PriceTooltip, "instance", {
        get: function () {
            if (PriceTooltip._instance == null) {
                PriceTooltip._instance = new PriceTooltip();
            }
            return PriceTooltip._instance;
        },
        enumerable: true,
        configurable: true
    });
    PriceTooltip.prototype.show = function (config) {
        if (this.shown)
            this.hide();
        if (this._outsideTheSeries(config.chartPanel))
            return;
        this._appendDataToHTML(config.chartPanel);
        $(IDS.TOOLTIP_ID).addClass('shown');
        this.shown = true;
        this.setPosition(config.chartPanel, config.mousePosition, IDS.TOOLTIP_ID);
    };
    PriceTooltip.prototype.hide = function () {
        if (!this.shown)
            return;
        $(IDS.TOOLTIP_ID).removeClass('shown');
        this.shown = false;
    };
    PriceTooltip.prototype.getType = function () {
        return ChartTooltipType.Price;
    };
    PriceTooltip.prototype._outsideTheSeries = function (panel) {
        var hoveredRecord = panel.chart.hoveredRecord;
        var hoveringBeforeTheFirstBar = hoveredRecord < 0 || hoveredRecord == null;
        if (hoveringBeforeTheFirstBar)
            return true;
        var chartSeries = panel.chart.barDataSeries();
        var hoveringAfterTheLastBar = chartSeries.date.length <= hoveredRecord ||
            chartSeries.volume.length <= hoveredRecord ||
            chartSeries.close.length <= hoveredRecord ||
            chartSeries.open.length <= hoveredRecord ||
            chartSeries.high.length <= hoveredRecord;
        return hoveringAfterTheLastBar;
    };
    PriceTooltip.prototype._appendDataToHTML = function (chartPanel) {
        var data = this._calculateData(chartPanel);
        $(IDS.DATE_VALUE_ID).text(data.date);
        $(IDS.CLOSE_VALUE_ID).text(data.close);
        $(IDS.OPEN_VALUE_ID).text(data.open);
        $(IDS.HIGH_VALUE_ID).text(data.high);
        $(IDS.LOW_VALUE_ID).text(data.low);
        $(IDS.VOLUME_VALUE_ID).text(data.volume);
        if (data.time) {
            $(IDS.TIME_VALUE_ID).text(data.time);
            $(IDS.TIME_VALUE_ID).parent().removeClass('hidden');
        }
        else {
            $(IDS.TIME_VALUE_ID).parent().addClass('hidden');
        }
        $(IDS.CHANGE_VALUE_ID).text(data.change);
        $(IDS.CHANGE_PERCENTAGE_VALUE_ID).text(data.changePercentage);
    };
    PriceTooltip.prototype._calculateData = function (chartPanel) {
        var chartSeries = chartPanel.chart.primaryBarDataSeries();
        var hoveredRecord = chartPanel.chart.hoveredRecord;
        var date = chartSeries.date.valueAtIndex(hoveredRecord);
        var open = chartSeries.open.valueAtIndex(hoveredRecord);
        var high = chartSeries.high.valueAtIndex(hoveredRecord);
        var low = chartSeries.low.valueAtIndex(hoveredRecord);
        var close = chartSeries.close.valueAtIndex(hoveredRecord);
        var volume = chartSeries.volume.valueAtIndex(hoveredRecord);
        var time = this.isIntradayChart(chartPanel.chart) ? moment(date).format('HH:mm:ss') : null;
        var prevClose = 0;
        if (hoveredRecord == 0) {
            prevClose = +open;
        }
        else {
            prevClose = +chartSeries.close.valueAtIndex(hoveredRecord - 1);
        }
        var change = (+close) - prevClose;
        var changePercentage = (change / prevClose) * 100;
        return {
            date: moment(date).format('YYYY-MM-DD'),
            time: time,
            open: chartPanel.formatValue(+open),
            high: chartPanel.formatValue(+high),
            low: chartPanel.formatValue(+low),
            close: chartPanel.formatValue(+close),
            volume: chartPanel.formatValue(+volume).split('.')[0],
            change: chartPanel.formatValue(change),
            changePercentage: chartPanel.formatValue(changePercentage) + '%'
        };
    };
    PriceTooltip._instance = null;
    return PriceTooltip;
}(AbstractTooltip));
export { PriceTooltip };
//# sourceMappingURL=PriceTooltip.js.map