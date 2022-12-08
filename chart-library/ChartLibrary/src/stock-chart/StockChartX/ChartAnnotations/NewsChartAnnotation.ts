import {ChartAnnotation, IChartAnnotationConfig} from './ChartAnnotation';
import {IRect} from '../Graphics/Rect';
import {IPoint} from '../Graphics/ChartPoint';
import {Geometry} from '../Graphics/Geometry';
import {Gesture, WindowEvent} from '../Gestures/Gesture';
import {ChartAccessorService, ChartTooltipType} from '../../../services/chart';
import {CategoryNews} from '../../../services/data/news';
import {Chart} from '../Chart';

export interface INewsConfig extends IChartAnnotationConfig {
    categoryNews: CategoryNews
}

export class NewsChartAnnotation extends ChartAnnotation {

    private width: number = 12;
    private height: number = 10;
    private padding: number = 10;

    private categoryNews: CategoryNews;

    constructor(chart:Chart, config: INewsConfig) {
        super(chart, config);

        if (!config.categoryNews) {
            throw new Error('cannot find data for chart annotation');
        }
        this.categoryNews = config.categoryNews;
    }

    public draw(): void {
        let x: number = this.bounds().left;
        if (!this.xInsideView(x)) {
            return;
        }

        let bounds = this.bounds(),
            y = bounds.top,
            height = bounds.height,
            width = bounds.width,
            context = this.context,
            theme = {
                strokeColor: '#3572B0',
                lineStyle: 'solid',
                width: 1
            };

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y + height);
        context.lineTo(x + width, y + height);
        context.lineTo(x + width, y);
        context.lineTo(x + (width / 2), y + height - 3);
        context.lineTo(x, y);
        context.lineTo(x + width, y);
        context.scxStroke(theme);
    }

    protected bounds(): IRect {
        let x: number = this.projection.xByRecord(this.getRecord()),
            y: number = this.projection.yByValue(this.getCandleHigh());

        return {
            left: Math.round(x - (this.width / 2)),
            top: Math.round(y - this.height - this.padding - this.getOffsetDistance()),
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

        return Geometry.isPointInsideOrNearRect(point, this.bounds());
    }

    protected handleMouseHoverGesture(gesture: Gesture, event: WindowEvent): void {
        super.handleMouseHoverGesture(gesture, event);

        let bounds = this.bounds();

        if(Geometry.isPointInsideOrNearRect(event.pointerPosition, this.bounds())) {
            ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.News, {
                chartPanel: this.chartPanel,
                mousePosition: {x: bounds.left, y: bounds.top - bounds.height},
                newsId: this.categoryNews.id
            });
        } else {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.News);
        }
    }

    protected handleMouseClickGesture(gesture: Gesture, event: WindowEvent): void {
    }

    private xInsideView(x: number): boolean {
        return !(x < 0 || this.chartPanel.contentFrame.left + this.chartPanel.contentFrame.width < x);
    }

    private getOffsetDistance(): number {
        return (this.height + this.padding) * this.offset;
    }

}
