import {ChartTooltip, ChartTooltipConfig, ChartTooltipDataAndPositionConfig, ChartTooltipType} from "../../../services/index";
import {IPoint} from "../../StockChartX/Graphics/ChartPoint";
import {ChartPanel} from "../../StockChartX/ChartPanels/ChartPanel";
import {Indicator} from "../../StockChartX/Indicators/Indicator";
import {IchimokuIndicator} from "../../StockChartX/Indicators/IchimokuIndicator";
import {IndicatorField} from "../../StockChartX/Indicators/IndicatorConst";
import {AbstractTooltip} from "./AbstractTooltip";

const IDS = {
    TOOLTIP_ID: '#scxIndicatorTooltip',
    DATE_VALUE_ID: '#scxIndicatorTooltip-dateValue',
    TIME_VALUE_ID: '#scxIndicatorTooltip-timeValue'
};

export interface IndicatorTooltipConfig extends ChartTooltipConfig {
    indicator: Indicator;
    chartPanel: ChartPanel;
    mousePosition: IPoint;
}

export class IndicatorTooltip extends AbstractTooltip implements ChartTooltip{

    private static _instance:IndicatorTooltip = null;
    public static get instance():IndicatorTooltip{
        if(IndicatorTooltip._instance == null){
            IndicatorTooltip._instance = new IndicatorTooltip();
        }

        return IndicatorTooltip._instance;
    }
    private constructor(){
        super();
    }

    show(config:IndicatorTooltipConfig):void{
        if (this.shown)
            this.hide();

        if (this._outsideTheSeries(config.indicator, config.chartPanel))
            return;

        this._appendDataToHTML(config.indicator, config.chartPanel);

        $(IDS.TOOLTIP_ID).addClass('shown');
        this.shown = true;

        this.setPosition(config.chartPanel, config.mousePosition, IDS.TOOLTIP_ID);
    }

    hide():void{
        if (!this.shown)
            return;

        this._removeAddedRow();
        $(IDS.TOOLTIP_ID).removeClass('shown');
        this.shown = false;
    }

    getType():ChartTooltipType{
        return ChartTooltipType.Indicator;
    }

    private _removeAddedRow() {
        $('.scxIndicatorTooltip-added-row').remove();
    }

    private _outsideTheSeries(indicator: Indicator, panel: ChartPanel): boolean {
        let hoveredRecord = panel.chart.hoveredRecord;
        let hoveringBeforeTheFirstBar = hoveredRecord < 0 || hoveredRecord == null;
        if (hoveringBeforeTheFirstBar)
            return true;

        for (let i = 0; i < indicator.plotItems.length; i++) {
            let item = indicator.plotItems[i];
            let recordCount = item.dataSeries ? item.dataSeries.length : 0;
            let hoveringAfterTheLastBar = hoveredRecord >= recordCount;
            if (hoveringAfterTheLastBar)
                return true;
        }

        return false;
    }

    private _appendDataToHTML(indicator: Indicator, chartPanel: ChartPanel) {

        let chartSeries = chartPanel.chart.barDataSeries();
        let record = chartPanel.chart.hoveredRecord;

        //NK Date
        let date = chartSeries.date.valueAtIndex(record);
        $(IDS.DATE_VALUE_ID).text(moment(date).format('YYYY-MM-DD'));

        //NK Time
        let time = this.isIntradayChart(chartPanel.chart) ? moment(date).format('HH:mm:ss') : null;

        if (time) {
            $(IDS.TIME_VALUE_ID).text(time);
            $(IDS.TIME_VALUE_ID).parent().removeClass('hidden')
        } else {
            $(IDS.TIME_VALUE_ID).parent().addClass('hidden');
        }

        for (let i = 0; i < indicator.plotItems.length; i++) {
            let item = indicator.plotItems[i];
            let field = '';

            //NK Ichimoku indicator is special case
            if (indicator instanceof IchimokuIndicator) {
                field = indicator.fieldNames[i];
            }
            else {
                if (indicator.fieldNames[i] != '' &&
                    indicator.fieldNames[i] !== IndicatorField.INDICATOR) {
                    // MA indicator has multiple plots, let us use every plot name in the tooltip
                    field = indicator.getPlotName(indicator.fieldNames[i]);
                } else {
                    // MA indicator has only a single plot, so let us use the indicator short name for the tooltip
                    field = indicator.getShortName();
                }
            }

            let value = item.dataSeries.valueAtIndex(record),
                text = chartPanel.formatValue(value as number);

            // http://stackoverflow.com/questions/2402886/javascript-find-if-english-alphabets-only
            let english = /^[A-Za-z0-9 ]*$/;
            let englishClass = english.test(field) ? 'english' : ''; // MA english fields has different font

            let appendedString = `<tr class="scxIndicatorTooltip-row scxIndicatorTooltip-added-row"><td class="${englishClass}">${field}</td><td>${text}</td></tr>`;

            $(appendedString).appendTo(IDS.TOOLTIP_ID);
        }
    }
}
