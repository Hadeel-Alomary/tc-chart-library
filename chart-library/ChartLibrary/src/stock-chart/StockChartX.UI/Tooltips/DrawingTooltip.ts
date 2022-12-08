import {ChartTooltip, ChartTooltipConfig, ChartTooltipDataAndPositionConfig, ChartTooltipType} from "../../../services/index";
import {ChartPoint, IPoint} from "../../StockChartX/Graphics/ChartPoint";
import {ChartPanel} from "../../StockChartX/ChartPanels/ChartPanel";
import {IMeasurementValues, MeasuringUtil} from "../../StockChartX/Utils/MeasuringUtil";
import {DrawingCalculationUtil} from "../../StockChartX/Utils/DrawingCalculationUtil";
import {AbstractTooltip} from "./AbstractTooltip";

const IDS = {
    TOOLTIP_ID: '#scxDrawingTooltip',
    CHANGE_VALUE_ID: '#scxDrawingTooltip-changeValue',
    CHANGE_PERCENTAGE_VALUE_ID: '#scxDrawingTooltip-changePercentageValue',
    PERIOD_VALUE_ID: '#scxDrawingTooltip-periodValue',
    BARS_VALUE_ID: '#scxDrawingTooltip-barsValue',
    ANGLE_VALUE_ID: '#scxDrawingTooltip-angleValue'
};

export interface DrawingTooltipConfig extends ChartTooltipConfig {
    chartPanel: ChartPanel;
    points:ChartPoint[];
}

interface IDrawingTooltipValues{
    change: string;
    changePercentage: string;
    bars: string;
    period: string;
    angle:string;
}

export class DrawingTooltip extends AbstractTooltip implements ChartTooltip{

    private static _instance:DrawingTooltip = null;
    public static get instance():DrawingTooltip{
        if(DrawingTooltip._instance == null){
            DrawingTooltip._instance = new DrawingTooltip();
        }

        return DrawingTooltip._instance;
    }
    private constructor(){
        super();
    }

    show(config:DrawingTooltipConfig):void{
        if (this.shown)
            this.hide();

        $(IDS.TOOLTIP_ID).addClass('shown');
        this.shown = true;

        this.update(config.points, config.chartPanel);
    }

    hide():void{
        if (!this.shown)
            return;

        $(IDS.TOOLTIP_ID).removeClass('shown');
        this.shown = false;
    }

    getType():ChartTooltipType{
        return ChartTooltipType.Drawing;
    }

    private update(points:ChartPoint[], chartPanel:ChartPanel){
        let point1:IPoint = points[0].toPoint(chartPanel.projection);
        let point2:IPoint = points[1].toPoint(chartPanel.projection);

        this.updateValues(points, point1, point2, chartPanel);
        this.setPosition(chartPanel, this.getTooltipPosition(point1, point2), IDS.TOOLTIP_ID);
    }

    private updateValues(points:ChartPoint[], point1:IPoint, point2:IPoint, panel:ChartPanel){
        let values:IMeasurementValues = MeasuringUtil.getMeasuringValues(points, panel);
        let radians:number = DrawingCalculationUtil.calculateAngleBetweenTwoPointsInRadians(point1, point2);
        let valuesAsText:IDrawingTooltipValues = this.getTooltipValues(values, radians);
        this.fillHtmlValues(valuesAsText);
    }

    private getTooltipValues(values:IMeasurementValues, angleInRadians:number):IDrawingTooltipValues {
        let change = values.change.toFixed(2),
            changePercentage = '(' + values.changePercentage.toFixed(2) + '%)',
            bars = values.barsCount + ' bars, ',
            angle = Math.round(DrawingCalculationUtil.convertRadianToDegree(angleInRadians)) + "°";

        return {
            change: change,
            changePercentage: changePercentage,
            bars: bars,
            period: values.period,
            angle: angle
        };
    }

    private fillHtmlValues(values:IDrawingTooltipValues) {
        $(IDS.CHANGE_VALUE_ID).text(values.change);
        $(IDS.CHANGE_PERCENTAGE_VALUE_ID).text(values.changePercentage);
        $(IDS.BARS_VALUE_ID).text(values.bars);
        $(IDS.PERIOD_VALUE_ID).text(values.period);
        $(IDS.ANGLE_VALUE_ID).text(values.angle);
    }

    private getTooltipPosition(point1:IPoint, point2:IPoint):IPoint {
        let left: number = point1.x < point2.x ? point2.x + 5 : point2.x - 5 - $(IDS.TOOLTIP_ID).width(),
            top: number = point2.y + 5;

        return {
            x: left,
            y: top
        };
    }
}
