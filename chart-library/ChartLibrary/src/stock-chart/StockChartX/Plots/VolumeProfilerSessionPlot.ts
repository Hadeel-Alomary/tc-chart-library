import {IPlotValueDrawParams} from './Plot';
import {IPoint} from '../Graphics/ChartPoint';
import {VolumeProfilerData, VolumeProfilerDataBar} from '../../../services/data/volume-profiler/volume-profiler.service';
import {DataSeries, DataSeriesSuffix} from '../../StockChartX/Data/DataSeries';
import {Projection} from '../../StockChartX/Scales/Projection';
import {IVolumeProfilerSessionPlotConfig, VolumeProfilerBasePlot} from './VolumeProfilerBasePlot';
import {Geometry} from '../../StockChartX/Graphics/Geometry';
import {IRect} from '../../StockChartX/Graphics/Rect';
import {VolumeProfilerPlotTheme} from '../Theme';
import {Chart} from '../Chart';
import {Interval} from "../../../services/loader/price-loader/interval";
import {IntervalType} from "../../../services/loader/price-loader/interval-type";


export class VolumeProfilerSessionPlot extends VolumeProfilerBasePlot {

    private boxes:VolumeProfilerBox[];

    constructor(chart:Chart, config?: IVolumeProfilerSessionPlotConfig) {
        super(chart, config);
    }

    isHoveredOverSessionBox(point: IPoint): boolean {
        if(!this.boxes) {
            return false;
        }
        for(let i = 0; i < this.boxes.length; ++ i){
            if (this.boxes[i].fromX <= point.x && point.x <= this.boxes[i].toX){
                // MA TODO lowY and highY "reversed" in terms of meaning, so need to fix that later
                return this.boxes[i].fromY <= point.y && point.y <= this.boxes[i].toY;
            }
        }
        return false;
    }


    hitTest(point: IPoint): boolean {
        if(!this.boxes) {
            return false;
        }
        for(let i = 0; i < this.boxes.length; ++ i){
            if (this.boxes[i].fromX <= point.x && point.x <= this.boxes[i].toX){
                for (let j = 0; j < this.boxes[i].rectangles.length; ++j) {
                    if (Geometry.isPointInsideOrNearRect(point, this.boxes[i].rectangles[j])) {
                        return true;
                    }
                }
                return false;
            }
        }
        return false;
    }

    draw() {

        if (!this.visible)
            return;


        let params = this._valueDrawParams();
        this.boxes = this.computeBoxes(params, params.projection);
        this.drawBoxes(params);

    }

    private drawBoxes(params:IPlotValueDrawParams) {
        let context = params.context,
            projection = params.projection;

        let theme:VolumeProfilerPlotTheme = params.theme as VolumeProfilerPlotTheme;

        if (Interval.fromChartInterval(this.chart.timeInterval).type < IntervalType.Day) {
            context.beginPath();

            // -----------------------------------------------------------------------------------------------------------------
            // MA this code was written in this way for performance reasons. scxFill, which set canvas colors, is slow.
            // Therefore, keep calling it to set different colors in drawing large number of session data (per session box) is SLOW.
            // Solution, set the color "once" and then draw all data that has this color, and then do it again for the second
            // color, third color, fourth color, etc.
            // This ends up in longer code that is more repetitive (with far more for loops), however, this code is much faster as it
            // minimizes the "context" switching of colors.
            // -----------------------------------------------------------------------------------------------------------------

            context.scxFill(theme.fillBox);
            for (let i = 0; i < this.boxes.length; i++) {
                this.drawBox(context, projection, this.boxes[i]);
            }

            if(this.volumeProfilerIndicatorData.data.length) {

                if(theme.showVolumeProfile) {

                    for (let i = 0; i < this.boxes.length; i++) {
                        this.boxes[i].rectangles = [];
                    }

                    context.scxFill( theme.downArea);
                    for (let i = 0; i < this.boxes.length; i++) {
                        if(this.boxes[i].data) {
                            this.drawValueDownBars(this.boxes[i], context , theme);
                        }
                    }

                    context.scxFill(theme.downVolume);
                    for (let i = 0; i < this.boxes.length; i++) {
                        this.boxes[i].rectangles = [];
                        if(this.boxes[i].data) {
                            this.drawVolumeDownBars(this.boxes[i], context , theme);
                        }
                    }

                    context.scxFill(theme.downArea);
                    for (let i = 0; i < this.boxes.length; i++) {
                        if(this.boxes[i].data) {
                            this.drawValueDownBars(this.boxes[i], context , theme);
                        }
                    }

                    context.scxFill(theme.upArea);
                    for (let i = 0; i < this.boxes.length; i++) {
                        if(this.boxes[i].data) {
                            this.drawValueUpBars(this.boxes[i], context , theme);
                        }
                    }

                    context.scxFill(theme.upVolume);
                    for (let i = 0; i < this.boxes.length; i++) {
                        if(this.boxes[i].data) {
                            this.drawVolumeUpBars(this.boxes[i], context , theme);
                        }
                    }

                }

                if(theme.line.strokeEnabled) {
                    for (let i = 0; i < this.boxes.length; i++) {
                        if (this.boxes[i].data) {
                            this.drawPointOfControlLine(this.boxes[i], context);
                        }
                    }
                    context.scxStroke(theme.line);
                }

            }

        }

    }

    private computeBoxes(params:IPlotValueDrawParams, projection:Projection):VolumeProfilerBox[] {

        let boxes = [];
        let dateSeries:DataSeries = this.chart.getDataSeries(DataSeriesSuffix.DATE);
        let highSeries:DataSeries = this.chart.getDataSeries(DataSeriesSuffix.HIGH);
        let lowSeries:DataSeries = this.chart.getDataSeries(DataSeriesSuffix.LOW);

        let startIndex:number = null;
        let highest:number = Number.MIN_VALUE;
        let lowest:number = Number.MAX_VALUE;

        let dataSeries:DataSeries = this.dataSeries[0];

        let startRangeIndex = this.chart.firstVisibleIndex;
        let endRangeIndex = this.chart.recordCount;

        for (let i = startRangeIndex; i < endRangeIndex; ++i) {

            if (startIndex == null) {
                startIndex = dataSeries.values[i] as number;
                continue;
            }

            // MA I assume that -1 is needed to go from record to index, but not sure of that.
            highest = Math.max(highest , highSeries.values[i - 1] as number);
            lowest = Math.min(lowest , lowSeries.values[i - 1] as number);

            let dataIndex = dataSeries.values[i] as number;

            // MA needed to include the last box
            if((i + 1) == endRangeIndex){
                if(dataIndex == startIndex) {
                    dataIndex = i;
                }
            }

            let boxBoundary:boolean = startIndex != dataIndex;

            if(boxBoundary) {

                let fromX = projection.xByDate(dateSeries.values[startIndex] as Date);
                let toX  = projection.xByDate(dateSeries.values[dataIndex-1] as Date);

                let toY = projection.yByValue(lowest);
                let fromY = projection.yByValue(highest);

                let box:VolumeProfilerBox = {
                    boxDate: moment(dateSeries.values[startIndex] as Date).format('YYYY-MM-DD'),
                    fromX: fromX,
                    toX: toX,
                    toY: toY,
                    fromY: fromY,
                    data: null,
                    rectangles: [],
                    maximumVolume: null
                };

                boxes.push(box);

                //  MA, stop if we are out of the visible range.
                if(this.chart.lastVisibleIndex < i) {
                    break; 
                }

                startIndex = dataIndex;
                highest = Number.MIN_VALUE;
                lowest = Number.MAX_VALUE;

            }

        }

        this.addDataToBoxes(projection, boxes);

        return boxes.reverse();

    }


    private drawBox(context:CanvasRenderingContext2D, projection:Projection, boxDimension:VolumeProfilerBox) {
        let maximum_Y = boxDimension.fromY;
        let minimum_y =boxDimension.toY;
        let boxHeight = minimum_y - maximum_Y;
        let boxWidth = boxDimension.toX - boxDimension.fromX;

        context.fillRect(boxDimension.fromX, maximum_Y, boxWidth, boxHeight);
    }


    private drawPointOfControlLine(box:VolumeProfilerBox , context:CanvasRenderingContext2D) {
        let y = this.projection.yByValue(box.data.pointOfControl);
        context.moveTo(box.fromX, y);
        context.lineTo(box.toX, y);
        box.rectangles.push({left: box.fromX, top: y, width: box.toX - box.fromX, height: 3});
    }

    private drawValueDownBars(box:VolumeProfilerBox  , context:CanvasRenderingContext2D , theme:VolumeProfilerPlotTheme) {
        let maximumVolume:number = box.maximumVolume;
        for (let i = 0; i < box.data.bars.length; i++) {
            if(!box.data.bars[i].valueArea) {
                continue;
            }
            let boxWidth = theme.boxWidth > 100 ? 100 : theme.boxWidth;
            let quarterDistanceOfTheBox = (box.toX - box.fromX) * (boxWidth / 100);
            let maximumTotalVolumeBasedOnQuarter = maximumVolume / quarterDistanceOfTheBox;
            let padding = 1;
            let height = Math.abs(this.projection.yByValue(box.data.bars[i].toPrice) - this.projection.yByValue(box.data.bars[i].fromPrice)) - padding;
            let upRectWidth = Math.floor(box.data.bars[i].greenVolume / maximumTotalVolumeBasedOnQuarter);
            let downRectWidth = Math.floor(box.data.bars[i].redVolume / maximumTotalVolumeBasedOnQuarter);
            let y = this.projection.yByValue(box.data.bars[i].toPrice) - padding;
            context.fillRect(this.xPosForDownBar(theme,box,upRectWidth,downRectWidth), y - 0.5, downRectWidth , height);
            box.rectangles.push({left: box.fromX, top: y, width: downRectWidth + upRectWidth, height: height});

        }
    }

    private drawVolumeDownBars(box:VolumeProfilerBox  , context:CanvasRenderingContext2D , theme:VolumeProfilerPlotTheme) {
        let maximumVolume:number = box.maximumVolume;
        for (let i = 0; i < box.data.bars.length; i++) {
            if(box.data.bars[i].valueArea) {
                continue;
            }
            let boxWidth = theme.boxWidth > 100 ? 100 : theme.boxWidth;
            let quarterDistanceOfTheBox = (box.toX - box.fromX) * (boxWidth / 100);
            let maximumTotalVolumeBasedOnQuarter = maximumVolume / quarterDistanceOfTheBox;
            let padding = 1;
            let height = Math.abs(this.projection.yByValue(box.data.bars[i].toPrice) - this.projection.yByValue(box.data.bars[i].fromPrice)) - padding;
            let upRectWidth = Math.floor(box.data.bars[i].greenVolume / maximumTotalVolumeBasedOnQuarter);
            let downRectWidth = Math.floor(box.data.bars[i].redVolume / maximumTotalVolumeBasedOnQuarter);
            let y = this.projection.yByValue(box.data.bars[i].toPrice) - padding;
            context.fillRect(this.xPosForDownBar(theme,box,upRectWidth,downRectWidth), y - 0.5, downRectWidth , height);
            box.rectangles.push({left: box.fromX, top: y, width: downRectWidth + upRectWidth, height: height});

        }
    }

    private drawValueUpBars(box:VolumeProfilerBox  , context:CanvasRenderingContext2D , theme:VolumeProfilerPlotTheme) {
        let maximumVolume:number = box.maximumVolume;
        for (let i = 0; i < box.data.bars.length; i++) {
            if(!box.data.bars[i].valueArea) {
                continue;
            }
            let boxWidth = theme.boxWidth > 100 ? 100 : theme.boxWidth;
            let quarterDistanceOfTheBox = (box.toX - box.fromX) * (boxWidth / 100);
            let maximumTotalVolumeBasedOnQuarter = maximumVolume / quarterDistanceOfTheBox;
            let padding = 1;
            let height = Math.abs(this.projection.yByValue(box.data.bars[i].toPrice) - this.projection.yByValue(box.data.bars[i].fromPrice)) - padding;
            let upRectWidth = Math.floor(box.data.bars[i].greenVolume / maximumTotalVolumeBasedOnQuarter);
            let y = this.projection.yByValue(box.data.bars[i].toPrice) - padding;
            context.fillRect(this.xPosForUpBar(theme,box,upRectWidth), y - 0.5, upRectWidth, height);
        }
    }

    private drawVolumeUpBars(box:VolumeProfilerBox  , context:CanvasRenderingContext2D , theme:VolumeProfilerPlotTheme) {
        let maximumVolume:number = box.maximumVolume;
        for (let i = 0; i < box.data.bars.length; i++) {
            if(box.data.bars[i].valueArea) {
                continue;
            }
            let boxWidth = theme.boxWidth > 100 ? 100 : theme.boxWidth;
            let quarterDistanceOfTheBox = (box.toX - box.fromX) * (boxWidth / 100);
            let maximumTotalVolumeBasedOnQuarter = maximumVolume / quarterDistanceOfTheBox;
            let padding = 1;
            let height = Math.abs(this.projection.yByValue(box.data.bars[i].toPrice) - this.projection.yByValue(box.data.bars[i].fromPrice)) - padding;
            let upRectWidth = Math.floor(box.data.bars[i].greenVolume / maximumTotalVolumeBasedOnQuarter);
            let y = this.projection.yByValue(box.data.bars[i].toPrice) - padding;
            context.fillRect(this.xPosForUpBar(theme,box,upRectWidth), y - 0.5, upRectWidth, height);
        }
    }

    private xPosForDownBar(theme:VolumeProfilerPlotTheme , box:VolumeProfilerBox, upRectWidth:number, downRectWidth:number) {
        if(theme.placement == 'left') {
            return box.fromX - 0.5 + upRectWidth;
        }else {
            return box.toX - 0.5 - upRectWidth - downRectWidth;
        }
    }

    private xPosForUpBar(theme:VolumeProfilerPlotTheme, box:VolumeProfilerBox, upRectWidth:number) {
        if (theme.placement == 'left') {
            return box.fromX - 0.5;
        } else {
            return box.toX - 0.5 - upRectWidth;
        }
    }

    private maximumTotalVolume(bars:VolumeProfilerDataBar[]) {
        let maximumTotalVolume = [];
        for (let i = 0; i < bars.length; i++) {
            maximumTotalVolume.push(bars[i].totalVolume);
        }
        return Math.max(...maximumTotalVolume);
    }

    private addDataToBoxes(projection:Projection, boxes: VolumeProfilerBox[]) {

        if(this.volumeProfilerIndicatorData.data.length == 0) {
            return;
        }

        for(let boxIndex = 0; boxIndex < boxes.length; ++boxIndex) {
            let boxData = this.volumeProfilerIndicatorData.data.find((data:VolumeProfilerData) => data.fromDate.startsWith(boxes[boxIndex].boxDate));
            if(boxData) {
                boxes[boxIndex].data = boxData;
                boxes[boxIndex].maximumVolume = this.maximumTotalVolume(boxData.bars);
            }
        }

    }

}

interface VolumeProfilerBox {
    boxDate:string,
    fromX:number,
    toX:number,
    toY:number,
    fromY:number,
    data:VolumeProfilerData,
    rectangles:IRect[],
    maximumVolume:number
}
