import {ChartTooltip, ChartTooltipConfig, ChartTooltipDataAndPositionConfig, ChartTooltipType} from "../../../services/index";
import {IPoint} from "../../StockChartX/Graphics/ChartPoint";
import {ChartPanel} from "../../StockChartX/ChartPanels/ChartPanel";
import {AbstractTooltip} from "./AbstractTooltip";

const IDS = {
    TOOLTIP_ID: 'scxSplitTooltip',
    TABLE_ID: '#scxSplitTooltip',
    DATE_ID: '#scxSplitTooltip-date',
    VALUE_ID: '#scxSplitTooltip-value'
};

export interface SplitTooltipConfig extends ChartTooltipConfig {
    chartPanel: ChartPanel;
    mousePosition: IPoint;
    data: { data: number, date: string };
}

export class SplitTooltip extends AbstractTooltip implements ChartTooltip{

    private static _instance:SplitTooltip = null;
    public static get instance():SplitTooltip{
        if(SplitTooltip._instance == null){
            SplitTooltip._instance = new SplitTooltip();
        }

        return SplitTooltip._instance;
    }
    private constructor(){
        super();
    }

    show(config:SplitTooltipConfig):void{
        if (this.shown)
            this.hide();

        this._appendDataToHTML(config.data);

        $(IDS.TABLE_ID).addClass('shown');
        this.shown = true;

        this.setPosition(config.chartPanel, config.mousePosition, `#${IDS.TOOLTIP_ID}`);
    }

    hide():void{
        if (!this.shown)
            return;

        $(IDS.TABLE_ID).removeClass('shown');
        this.shown = false;
    }

    getType():ChartTooltipType{
        return ChartTooltipType.Split;
    }

    private _appendDataToHTML(data: { data: number, date: string }) {
        $(IDS.DATE_ID).text(data.date);
        $(IDS.VALUE_ID).find('.from-value').text(data.data.toFixed(2));
    }
}
