import {ChartTooltip, ChartTooltipConfig, ChartTooltipDataAndPositionConfig, ChartTooltipType} from "../../../services/index";
import {IPoint} from "../../StockChartX/Graphics/ChartPoint";
import {ChartPanel} from "../../StockChartX/ChartPanels/ChartPanel";
import {AbstractTooltip} from "./AbstractTooltip";

const IDS = {
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

export interface PriceTooltipConfig extends ChartTooltipConfig {
    chartPanel: ChartPanel;
    mousePosition: IPoint;
}

export class PriceTooltip extends AbstractTooltip implements ChartTooltip{

    private static _instance:PriceTooltip = null;
    public static get instance():PriceTooltip{
        if(PriceTooltip._instance == null){
            PriceTooltip._instance = new PriceTooltip();
        }

        return PriceTooltip._instance;
    }
    private constructor(){
        super();
    }

    show(config:PriceTooltipConfig):void{
        if (this.shown)
            this.hide();

        if (this._outsideTheSeries(config.chartPanel))
            return;

        this._appendDataToHTML(config.chartPanel);

        $(IDS.TOOLTIP_ID).addClass('shown');
        this.shown = true;

        this.setPosition(config.chartPanel, config.mousePosition, IDS.TOOLTIP_ID);
    }

    hide():void{
        if (!this.shown)
            return;

        $(IDS.TOOLTIP_ID).removeClass('shown');
        this.shown = false;
    }

    getType():ChartTooltipType{
        return ChartTooltipType.Price;
    }

    private _outsideTheSeries(panel: ChartPanel): boolean {
        let hoveredRecord = panel.chart.hoveredRecord;
        let hoveringBeforeTheFirstBar = hoveredRecord < 0 || hoveredRecord == null;
        if (hoveringBeforeTheFirstBar)
            return true;

        let chartSeries = panel.chart.barDataSeries();
        let hoveringAfterTheLastBar =
            chartSeries.date.length <= hoveredRecord ||
            chartSeries.volume.length <= hoveredRecord ||
            chartSeries.close.length <= hoveredRecord ||
            chartSeries.open.length <= hoveredRecord ||
            chartSeries.high.length <= hoveredRecord;

        return hoveringAfterTheLastBar;
    }

    private _appendDataToHTML(chartPanel: ChartPanel) {
        let data = this._calculateData(chartPanel);

        $(IDS.DATE_VALUE_ID).text(data.date);
        $(IDS.CLOSE_VALUE_ID).text(data.close);
        $(IDS.OPEN_VALUE_ID).text(data.open);
        $(IDS.HIGH_VALUE_ID).text(data.high);
        $(IDS.LOW_VALUE_ID).text(data.low);
        $(IDS.VOLUME_VALUE_ID).text(data.volume);

        if (data.time) {
            $(IDS.TIME_VALUE_ID).text(data.time);
            $(IDS.TIME_VALUE_ID).parent().removeClass('hidden')
        } else {
            $(IDS.TIME_VALUE_ID).parent().addClass('hidden');
        }

        $(IDS.CHANGE_VALUE_ID).text(data.change);
        $(IDS.CHANGE_PERCENTAGE_VALUE_ID).text(data.changePercentage);
    }

    private _calculateData(chartPanel: ChartPanel): { date: string, time: string, open: string, high: string, low: string, close: string, volume: string, change: string, changePercentage: string } {
        let chartSeries = chartPanel.chart.primaryBarDataSeries();
        let hoveredRecord = chartPanel.chart.hoveredRecord;

        let date = chartSeries.date.valueAtIndex(hoveredRecord);
        let open = chartSeries.open.valueAtIndex(hoveredRecord);
        let high = chartSeries.high.valueAtIndex(hoveredRecord);
        let low = chartSeries.low.valueAtIndex(hoveredRecord);
        let close = chartSeries.close.valueAtIndex(hoveredRecord);
        let volume = chartSeries.volume.valueAtIndex(hoveredRecord);

        let time = this.isIntradayChart(chartPanel.chart) ? moment(date).format('HH:mm:ss') : null;

        let prevClose = 0;
        if (hoveredRecord == 0) {
            prevClose = +open;
        } else {
            prevClose = +chartSeries.close.valueAtIndex(hoveredRecord - 1);
        }
        let change: number = (+close) - prevClose;
        let changePercentage: number = (change / prevClose) * 100;

        return {
            date: moment(date).format('YYYY-MM-DD'),
            time: time,
            open: chartPanel.formatValue(+open),
            high: chartPanel.formatValue(+high),
            low: chartPanel.formatValue(+low),
            close: chartPanel.formatValue(+close),

            // NK this is hack because the formatter returns string with 4 decimal digits, but the volume is integer
            // so i used split to keep the formatter and remove the decimal digits
            volume: chartPanel.formatValue(+volume).split('.')[0],
            change: chartPanel.formatValue(change),
            changePercentage: chartPanel.formatValue(changePercentage) + '%'
        };
    }
}
