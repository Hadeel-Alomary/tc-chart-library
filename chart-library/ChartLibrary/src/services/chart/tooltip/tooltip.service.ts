import {Injectable} from '@angular/core';
import {ChartTooltip, ChartTooltipConfig, ChartTooltipDataAndPositionConfig, ChartTooltipType} from './tooltip';
import {HtmlLoader} from '../../../stock-chart/StockChartX.UI/HtmlLoader';
import {LanguageService} from '../../state/language/index';

@Injectable()

export class TooltipService{

    private tooltips:{[type:number]:ChartTooltip} = {};

    constructor(private languageService:LanguageService){
        this.init();
    }

    private init(){
        // MA create html view (if not already created). Use data attribute on the body to track if a
        // progress to create view has been inited (checking id won't work, as creating view needs time).
        let body = $("body");
        if (!body.attr("data-init-chart-tooltip")) {
            body.attr("data-init-chart-tooltip", "true");
            HtmlLoader.getView("ChartTooltip.html", (html: string) => {
                this.languageService.translateHtml($(html).appendTo(body));
            });
        }
    }

    public register(toolTip:ChartTooltip):void{
        this.tooltips[toolTip.getType()] = toolTip;
    }

    public hideAllTooltips():void{
        Object.values(this.tooltips).forEach((tooltip:ChartTooltip) => {
            tooltip.hide();
        });
    }

    public show(tooltipType:ChartTooltipType, config:ChartTooltipConfig) {
        this.hideAllTooltips();
        this.tooltips[tooltipType].show(config);
    }

    public hide(tooltipType:ChartTooltipType) {
        this.tooltips[tooltipType].hide();
    }

}
