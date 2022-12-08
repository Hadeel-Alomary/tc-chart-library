import {ChartAnnotation, IChartAnnotationConfig} from './ChartAnnotation';
import {IRect} from '../Graphics/Rect';
import {DummyCanvasContext} from '../Utils/DummyCanvasContext';
import {IPoint} from '../Graphics/ChartPoint';
import {Geometry} from '../Graphics/Geometry';
import {Gesture, WindowEvent} from '../Gestures/Gesture';
import {ChartAccessorService, ChartTooltipType} from '../../../services/index';
import {ITextTheme} from '../Theme';
import {Chart} from '../Chart';

export interface ISplitConfig extends IChartAnnotationConfig {
    splitValue: number
}

export class SplitChartAnnotation extends ChartAnnotation {

    private width: number = 16;
    private height: number = 16;
    private padding: number = 5;

    private splitValue: number;

    constructor(chart:Chart, config: ISplitConfig) {
        super(chart, config);
        if (!config.splitValue) {
            throw new Error('cannot find data for chart annotation');
        }
        this.splitValue = config.splitValue;
    }

    /* inherited methods */

    public draw(): void {
        let x: number = this.projection.xByRecord(this.getRecord());
        if (!this.xInsideView(x)) {
            //NK no need to draw invisible items
            return;
        }

        let y: number = this.projection.yByValue(this.getCandleHigh()) - this.getOffsetDistance(),
            bounds = this.bounds();

        this.context.scxApplyStrokeTheme({
            strokeColor: '#888',
            lineStyle: 'solid',
            width: 1
        });
        this.context.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);


        this.context.scxApplyFillTheme({
            fillColor: '#97CCFA'
        });
        this.context.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);

        let textTheme: ITextTheme = {
            fontSize: 12,
            fontStyle: 'normal',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fillColor: '#000'
        };

        let textSize: { width: number, height: number } = DummyCanvasContext.measureText('B', textTheme);

        this.context.scxApplyTextTheme(textTheme);
        //NK 4.5 is the half of the 'B' height, measureText function returns wrong height which is 13 (fontSize + 1),
        //but when i measure it on paint it is 9!! so i am depending on it.
        this.context.fillText('B', x - textSize.width / 2, y - this.padding - (this.height / 2) + 4.5);
    }

    protected bounds(): IRect {
        let x: number = this.projection.xByRecord(this.getRecord()),
            y: number = this.projection.yByValue(this.getCandleHigh());

        return {
            left: x - (this.width / 2),
            top: y - this.height - this.padding - this.getOffsetDistance(),
            width: this.width,
            height: this.height
        };
    }

    protected isVisible(): boolean {
        return true;
    }

    protected hitTest(point: IPoint): boolean {

        let record = this.getRecord();

        let x: number = this.projection.xByRecord(record);
        if (!this.xInsideView(x)) {
            return false;
        }

        //NK do not look for a matching if the hovered record is so far, for performance.
        //NK 25 is tested on 2010.TAD period all data
        if (this.chart.hoveredRecord < record - 25 || record + 25 < this.chart.hoveredRecord) {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Split);
            return false;
        }

        return Geometry.isPointInsideOrNearRect(point, this.bounds());
    }

    protected handleMouseHoverGesture(gesture: Gesture, event: WindowEvent): void {

        super.handleMouseHoverGesture(gesture, event);

        if(Geometry.isPointInsideOrNearRect(event.pointerPosition, this.bounds())) {
            ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Split, {
                chartPanel: this.chartPanel,
                mousePosition: event.pointerPosition,
                data: {data: this.splitValue, date: this.date}
            });
        } else {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Split);
        }
    }

    protected handleMouseClickGesture(gesture: Gesture, event: WindowEvent): void {
        //NK do nothing
    }

    /* private methods */

    private xInsideView(x: number): boolean {
        if (x < 0 || this.chartPanel.contentFrame.left + this.chartPanel.contentFrame.width < x) {
            return false;
        }
        return true;
    }

    private getOffsetDistance(): number {
        return (this.height + this.padding) * this.offset;
    }
}
