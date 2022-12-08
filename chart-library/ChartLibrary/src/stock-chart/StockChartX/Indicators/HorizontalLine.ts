import {IStrokeTheme, ITextTheme, LineStyle} from '../Theme';
import {JsUtil} from "../Utils/JsUtil";
import {Indicator} from "./Indicator";
import {HtmlUtil} from "../Utils/HtmlUtil";
import {IPoint} from "../Graphics/ChartPoint";
import {Geometry} from "../Graphics/Geometry";
import {PlotType} from '../../StockChartX/Plots/Plot';


export interface HorizontalLineConfig {
    value: number;
    theme?: HorizontalLineTheme;
}

interface HorizontalLineOptions extends HorizontalLineConfig {
}

const defaultTheme: HorizontalLineTheme = {
    line: {
        width: 1,
        strokeColor: '#cc0a0a',
        lineStyle: LineStyle.SOLID
    }
};

interface HorizontalLineTheme {
    line: IStrokeTheme
}

export class HorizontalLine {

    public options: HorizontalLineOptions;

    public get theme(): HorizontalLineTheme {
        return this.options.theme;
    }

    public set theme(value: HorizontalLineTheme) {
        this.options.theme = value;
    }

    public get value(): number {
        return this.options.value;
    }

    public set value(value: number) {
        this.options.value = value;
    }

    constructor(config: HorizontalLineConfig) {
        if (!config || typeof config !== 'object') {
            throw new TypeError("Config expected.");
        }

        this.options = <HorizontalLineOptions>{};

        if (typeof config.value === 'undefined') {
            throw new TypeError('Value expected');
        }

        this.value = config.value;

        this.theme = config.theme ? config.theme : JsUtil.clone(defaultTheme);
    }

    setColor(color: string): void {
        this.theme.line.strokeColor = color;
    }

    getColor(): string {
        return this.theme.line.strokeColor;
    }

    setLineStyle(style: string): void {
        this.theme.line.lineStyle = style;
    }

    getLineStyle(): string {
        return this.theme.line.lineStyle;
    }

    setLineWidth(width: number): void {
        this.theme.line.width = width;
    }

    getLineWidth(): number {
        return this.theme.line.width;
    }

    draw(indicator: Indicator) {
        if (!indicator.visible)
            return;

        let context = indicator.chartPanel.context,
            projection = indicator.chartPanel.projection,
            y = projection.yByValue(this.value);

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(indicator.chartPanel.frame.right, y);
        context.closePath();

        context.scxApplyStrokeTheme(this.theme.line);
        context.stroke();
    }

    drawValueMarkers(indicator: Indicator) {
        // NK we will depend for now on indicator showValueMarkers flag to show or hide the markers
        if (!indicator.showValueMarkers) {
            return;
        }

        let marker = indicator.chart.valueMarker;
        marker.theme.fill.fillColor = this.theme.line.strokeColor;
        marker.theme.text.fillColor = HtmlUtil.isDarkColor(this.theme.line.strokeColor) ? 'white' : 'black';
        marker.draw(this.value, indicator.plots[0].panelValueScale, 0, PlotType.INDICATOR);
    }

    hitTest(point: IPoint, indicator: Indicator): boolean {
        return Geometry.isPointNearPoint(point, {
            x: point.x,
            y: indicator.chartPanel.projection.yByValue(this.value)
        });
    }
}
