import {ChartTooltip, ChartTooltipConfig, ChartTooltipDataAndPositionConfig, ChartTooltipType} from "../../../services/index";
import {IPoint} from "../../StockChartX/Graphics/ChartPoint";
import {ChartPanel} from "../../StockChartX/ChartPanels/ChartPanel";
import {AbstractTooltip} from "./AbstractTooltip";

const IDS = {
    TOOLTIP_ID: 'scxTradingTooltip',
    TABLE_ID: '#scxTradingTooltip',
    TEXT_ID: '#scxTradingTooltip-text',
};

export interface TradingTooltipConfig extends ChartTooltipConfig {
    chartPanel: ChartPanel;
    mousePosition: IPoint;
    text: string;
}

export class TradingTooltip extends AbstractTooltip implements ChartTooltip{

    private static _instance:TradingTooltip = null;
    public static get instance():TradingTooltip{
        if(TradingTooltip._instance == null){
            TradingTooltip._instance = new TradingTooltip();
        }

        return TradingTooltip._instance;
    }
    private constructor(){
        super();
    }

    show(config:TradingTooltipConfig):void{
        if (this.shown)
            this.hide();

        this._appendDataToHTML(config.text);

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
        return ChartTooltipType.Trading;
    }

    private _appendDataToHTML(text: string) {
        $(IDS.TEXT_ID).text(text);
    }
}
