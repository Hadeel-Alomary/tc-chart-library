import {ChartAnnotation, IChartAnnotationConfig} from './ChartAnnotation';
import {IRect} from '../Graphics/Rect';
import {IPoint} from '../Graphics/ChartPoint';
import {Geometry} from '../Graphics/Geometry';
import {Gesture, WindowEvent} from '../Gestures/Gesture';
import {ChartAccessorService, ChartTooltipType} from '../../../services/chart';
import {TradingOrder} from '../../../services/trading/broker/models';
import {Chart} from '../Chart';

export interface ITradingOrderConfig extends IChartAnnotationConfig {
    order: TradingOrder
}

export class TradingOrderChartAnnotation extends ChartAnnotation {

    private width: number = 6;
    private height: number = 10;
    private padding: number = 10;

    private order: TradingOrder;

    constructor(chart:Chart, config: ITradingOrderConfig) {
        super(chart, config);

        if (!config.order) {
            throw new Error('cannot find data for chart annotation');
        }
        this.order = config.order;
    }

    public draw(): void {
        if(!this.isVisible()) {
            return;
        }

        let x: number = this.bounds().left;
        if (!this.xInsideView(x)) {
            return;
        }

        this.belowCandle ? this.drawBuyOrder() : this.drawSellOrder();
    }

    protected bounds(): IRect {
        let top = this.belowCandle ?
            this.projection.yByValue(this.getCandleLow()) + this.padding + this.getOffsetDistance() :
            this.projection.yByValue(this.getCandleHigh()) - this.padding - this.height - this.getOffsetDistance();
        return {
            left: Math.round(this.projection.xByRecord(this.getRecord())),
            top: Math.round(top),
            width: this.width,
            height: this.height
        };
    }

    protected isVisible(): boolean {
        return ChartAccessorService.instance.getTradingService().showExecutedOrders;
    }

    protected hitTest(point: IPoint): boolean {
        if(!this.isVisible()) {
            return;
        }

        return Geometry.isPointInsideOrNearRect(point, this.bounds());
    }

    protected handleMouseHoverGesture(gesture: Gesture, event: WindowEvent): void {
        super.handleMouseHoverGesture(gesture, event);

        if(Geometry.isPointInsideOrNearRect(event.pointerPosition, this.bounds())) {
            let executionPrice = Math.roundToDecimals(this.order.executionPrice,2);
            ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Trading, {
                chartPanel: this.chartPanel,
                mousePosition: event.pointerPosition,
                text: `${ChartAccessorService.instance.translate(this.order.side.arabic)} ${this.order.quantity} @ ${executionPrice}`
            });
        } else {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Trading);
        }
    }

    protected handleMouseClickGesture(gesture: Gesture, event: WindowEvent): void {
    }

    private drawBuyOrder() {
        let bounds = this.bounds(),
            x = bounds.left,
            y = bounds.top,
            height = bounds.height,
            context = this.context,
            halfWidth = bounds.width / 2,
            halfTailWidth = bounds.width / 3 / 2,
            triangleHeight = height / 2,
            theme = {fillColor: '#4094e8'}; // blue color

        context.beginPath();
        context.moveTo(this.sharpen(x), this.sharpen(y));
        context.lineTo(this.sharpen(x + halfWidth), this.sharpen(y + triangleHeight));
        context.lineTo(this.sharpen(x + halfTailWidth), this.sharpen(y + triangleHeight));
        context.lineTo(this.sharpen(x + halfTailWidth), this.sharpen(y + height));
        context.lineTo(this.sharpen(x - halfTailWidth), this.sharpen(y + height));
        context.lineTo(this.sharpen(x - halfTailWidth), this.sharpen(y + triangleHeight));
        context.lineTo(this.sharpen(x - halfWidth), this.sharpen(y + triangleHeight));
        context.closePath();
        context.scxFill(theme);
    }

    private drawSellOrder() {
        let bounds = this.bounds(),
            x = bounds.left,
            y = bounds.top + bounds.height,
            height = bounds.height,
            context = this.context,
            halfWidth = bounds.width / 2,
            halfTailWidth = bounds.width / 3 / 2,
            triangleHeight = height / 2,
            theme = {fillColor: '#e75656'}; // red color

        context.beginPath();
        context.moveTo(this.sharpen(x), this.sharpen(y));
        context.lineTo(this.sharpen(x - halfWidth), this.sharpen(y - triangleHeight));
        context.lineTo(this.sharpen(x - halfTailWidth), this.sharpen(y - triangleHeight));
        context.lineTo(this.sharpen(x - halfTailWidth), this.sharpen(y - height));
        context.lineTo(this.sharpen(x + halfTailWidth), this.sharpen(y - height));
        context.lineTo(this.sharpen(x + halfTailWidth), this.sharpen(y - triangleHeight));
        context.lineTo(this.sharpen(x + halfWidth), this.sharpen(y - triangleHeight));
        context.closePath();
        context.scxFill(theme);
    }

    private sharpen(val:number):number {
        return Math.floor(val) + 0.5;
    }

    private xInsideView(x: number): boolean {
        return !(x < 0 || this.chartPanel.contentFrame.left + this.chartPanel.contentFrame.width < x);
    }

    private getOffsetDistance(): number {
        return (this.height + this.padding) * this.offset;
    }

}
