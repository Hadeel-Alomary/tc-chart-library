import {VolumeProfilerBasePlot} from './VolumeProfilerBasePlot';
import {IPlotValueDrawParams} from './Plot';
import {Geometry} from '../../StockChartX/Graphics/Geometry';
import {IRect} from '../../StockChartX/Graphics/Rect';
import {IPoint} from '../../StockChartX/Graphics/ChartPoint';
import {Tc} from '../../../utils';
import {VolumeProfilerData} from '../../../services/volume-profiler/volume-profiler.service';
import {VolumeProfilerPlotTheme} from '../Theme';

export class VolumeProfilerVisibleRangePlot extends VolumeProfilerBasePlot {

    private rectangles:IRect[] = [];

    hitTest(point: IPoint): boolean {
        for (let j = 0; j < this.rectangles.length; ++j) {
            if (Geometry.isPointInsideOrNearRect(point, this.rectangles[j])) {
                return true;
            }
        }
        return false;
    }

    draw() {
        if (!this.visible)
            return;

        if(this.volumeProfilerIndicatorData.data.length == 0) {
            return;
        }

        Tc.assert(this.volumeProfilerIndicatorData.data.length == 1, "should have one bar group");

        let params = this._valueDrawParams();

        this.drawBars(params);

    }

    private getData():VolumeProfilerData {
        return this.volumeProfilerIndicatorData.data[0];
    }

    private maximumTotalVolume() {
        let maximumTotalVolume = [];
        for (let i = 0; i < this.getData().bars.length; i++) {
            maximumTotalVolume.push(this.getData().bars[i].totalVolume);
        }
        return Math.max(...maximumTotalVolume);
    }


    private drawBars(params:IPlotValueDrawParams) {
        let context = params.context;
        this.rectangles = [];
        let theme = params.theme as VolumeProfilerPlotTheme;
        context.beginPath();
        if(theme.showVolumeProfile) {
            this.drawUpDownBars(context, theme);
        }
        if(theme.line.strokeEnabled) {
            this.drawPointOfControlLine(context , theme);
        }
    }

    private drawPointOfControlLine(context:CanvasRenderingContext2D , theme:VolumeProfilerPlotTheme) {
        let y = this.projection.yByValue(this.getData().pointOfControl);
        context.moveTo(0, y);
        context.lineTo(this.getChartWidthInPixels(), y);
        context.scxStroke(theme.line);        
        this.rectangles.push({left: 0, top: y, width: this.getChartWidthInPixels(), height: 3});
    }

    private getChartWidthInPixels() {
        return this.projection.xByRecord(this.chart.lastVisibleIndex + 1);
    }

    private drawUpDownBars(context:CanvasRenderingContext2D , theme:VolumeProfilerPlotTheme) {
        let chartWidth = this.getChartWidthInPixels();
        let boxWidth = theme.boxWidth > 100 ? 100 : theme.boxWidth;
        let quarterDistanceOfTheBox = Math.floor(chartWidth * (boxWidth / 100));
        let maximumTotalVolumeBasedOnQuarter = Math.floor(this.maximumTotalVolume() / quarterDistanceOfTheBox);

        for (let i = 0; i < this.getData().bars.length; i++) {
            let padding = 1;
            let height = Math.abs(this.projection.yByValue(this.getData().bars[i].toPrice) - this.projection.yByValue(this.getData().bars[i].fromPrice)) - padding;
            let upRectWidth = Math.floor(this.getData().bars[i].greenVolume / maximumTotalVolumeBasedOnQuarter);
            let downRectWidth = Math.floor(this.getData().bars[i].redVolume / maximumTotalVolumeBasedOnQuarter);
            let y = this.projection.yByValue(this.getData().bars[i].toPrice) - padding;
            context.scxFill( this.getData().bars[i].valueArea ? theme.downArea : theme.downVolume);
            context.fillRect(this.xPosForDownBars(theme , chartWidth  , downRectWidth , upRectWidth) , y - 0.5, downRectWidth, height);
            context.scxFill(this.getData().bars[i].valueArea ? theme.upArea : theme.upVolume);
            context.fillRect( this.xPosForUpBars(theme, chartWidth, upRectWidth) , y - 0.5, upRectWidth, height);
            this.rectangles.push({left: chartWidth - downRectWidth - upRectWidth, top: y,  width: downRectWidth + upRectWidth, height: height});
        }
    }

    private xPosForDownBars(theme:VolumeProfilerPlotTheme , chartWidth :number , downRectWidth:number , upRectWidth:number) {
        if(theme.placement == 'left') {
            return this.projection.xByRecord(this.chart.firstVisibleRecord -1) + upRectWidth - 0.5;
        }else {
            return chartWidth - downRectWidth - upRectWidth - 0.5;
        }
    }

    private xPosForUpBars(theme:VolumeProfilerPlotTheme, chartWidth:number, upRectWidth:number) {
        if (theme.placement == 'left') {
            return this.projection.xByRecord(this.chart.firstVisibleRecord-1) - 0.5;
        } else {
            return chartWidth - upRectWidth - 0.5;
        }
    }



}




