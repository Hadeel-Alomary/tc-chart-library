import {ChartTooltip, ChartTooltipConfig, ChartTooltipDataAndPositionConfig, ChartTooltipType} from "../../../services/index";
import {IPoint} from "../../StockChartX/Graphics/ChartPoint";
import {ChartPanel} from "../../StockChartX/ChartPanels/ChartPanel";
import {AbstractTooltip} from "./AbstractTooltip";

const IDS = {
    TOOLTIP_ID: 'scxAlertTooltip',
    TABLE_ID: '#scxAlertTooltip',
    TEXT_ID: '#scxAlertTooltip-text',
};

export interface AlertTooltipConfig extends ChartTooltipConfig {
    chartPanel: ChartPanel;
    position: IPoint;
    text: string;
}

export class AlertTooltip extends AbstractTooltip implements ChartTooltip{

    private static _instance:AlertTooltip = null;
    public static get instance():AlertTooltip{
        if(AlertTooltip._instance == null){
            AlertTooltip._instance = new AlertTooltip();
        }

        return AlertTooltip._instance;
    }
    private constructor(){
        super();
    }

    show(config:AlertTooltipConfig):void{
        if (this.shown)
            this.hide();

        this._appendDataToHTML(config.text);

        $(IDS.TABLE_ID).addClass('shown');
        this.shown = true;

        config.position.y -= AbstractTooltip.offset;
        $(IDS.TABLE_ID).css('width', `${AbstractTooltip.defaultWidth}px`);

        this.setPosition(config.chartPanel, config.position, `#${IDS.TOOLTIP_ID}`, AbstractTooltip.defaultWidth, true);
    }

    hide():void{
        if (!this.shown)
            return;

        $(IDS.TABLE_ID).removeClass('shown');
        this.shown = false;
    }

    getType():ChartTooltipType{
        return ChartTooltipType.Alert;
    }

    private _appendDataToHTML(text: string) {
        $(IDS.TEXT_ID).text(text);
    }
}
