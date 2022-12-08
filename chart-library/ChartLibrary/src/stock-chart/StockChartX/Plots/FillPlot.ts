import {IPlotConfig, IPlotDefaults, Plot} from "./Plot";
import {DataSeries} from "../Data/DataSeries";
import {FillPlotTheme} from '../Theme';
import {Chart} from '../Chart';

export interface IFillPlotConfig extends IPlotConfig {

}

export interface IFillPlotDefaults extends IPlotDefaults {

}

export class FillPlot extends Plot {

    constructor(chart:Chart, config ?: IFillPlotConfig) {
        super(chart, config);
        this._plotThemeKey = 'fillPlot';
        this.plotStyle = 'fill';
    }


    draw() {
        if (!this.visible)
            return;

        let params = this._barDrawParams();
        if (params.values.length === 0)
            return;

        let context = this.context,
            projection = this.projection,
            x: number,
            y: number,
            value: number;

        context.beginPath();

        value = this.dataSeries[0].values[params.startIndex] as number;
        x = projection.xByRecord(params.startIndex);
        y = projection.yByValue(value);
        context.moveTo(x, y);

        for (let i = params.startIndex + 1; i <= params.endIndex; i++) {
            value = this.dataSeries[0].values[i] as number;
            if (value == null)
                continue;

            x = projection.xByRecord(i);
            y = projection.yByValue(value);
            context.lineTo(x, y);
        }

        value = this.dataSeries[1].values[params.endIndex + 1] as number;
        if (value == null) {
            value = this.dataSeries[1].values[this.getLastNotNullValueIndex(this.dataSeries[1])] as number;
            params.endIndex = this.getLastNotNullValueIndex(this.dataSeries[0]);
        }
        x = projection.xByRecord(params.endIndex);
        y = projection.yByValue(value);
        context.lineTo(x, y);

        for (let i = params.endIndex; i >= params.startIndex; i--) {
            value = this.dataSeries[1].values[i] as number;
            if (value == null)
                continue;

            x = projection.xByRecord(i);
            y = projection.yByValue(value);
            context.lineTo(x, y);
        }

        value = this.dataSeries[0].values[params.startIndex] as number;
        if (value == null) {
            value = this.dataSeries[0].values[this.getFirstNotNullValueIndex(this.dataSeries[0])] as number;
            params.startIndex = this.getFirstNotNullValueIndex(this.dataSeries[0]);
        }
        x = projection.xByRecord(params.startIndex);
        y = projection.yByValue(value);
        context.lineTo(x, y);

        context.fillStyle = (params.theme as FillPlotTheme).fill.fillColor;
        context.fill();
    }

    public drawSelectionPoints(): void {
        //NK Fill plot does not need selection points
    }

    getFirstNotNullValueIndex(dataserie: DataSeries): number {
        let index: number = 0,
            isContinue: boolean = true;

        while (isContinue && index < dataserie.length) {
            if (dataserie.values[index] == null)
                index++;
            else
                isContinue = false;
        }

        return index;
    }

    getLastNotNullValueIndex(dataserie: DataSeries): number {
        let index: number = dataserie.length,
            isContinue: boolean = true;

        while (isContinue && index > 0) {
            if (dataserie.values[index] == null)
                index--;
            else
                isContinue = false;
        }

        return index;
    }

    drawValueMarkers() {
        //NK do not draw the value markers for fill plot
    }
}
