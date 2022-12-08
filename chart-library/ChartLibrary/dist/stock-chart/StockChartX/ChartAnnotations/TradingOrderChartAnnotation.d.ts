import { ChartAnnotation, IChartAnnotationConfig } from './ChartAnnotation';
import { IRect } from '../Graphics/Rect';
import { IPoint } from '../Graphics/ChartPoint';
import { Gesture, WindowEvent } from '../Gestures/Gesture';
import { TradingOrder } from '../../../services/trading/broker/models';
import { Chart } from '../Chart';
export interface ITradingOrderConfig extends IChartAnnotationConfig {
    order: TradingOrder;
}
export declare class TradingOrderChartAnnotation extends ChartAnnotation {
    private width;
    private height;
    private padding;
    private order;
    constructor(chart: Chart, config: ITradingOrderConfig);
    draw(): void;
    protected bounds(): IRect;
    protected isVisible(): boolean;
    protected hitTest(point: IPoint): boolean;
    protected handleMouseHoverGesture(gesture: Gesture, event: WindowEvent): void;
    protected handleMouseClickGesture(gesture: Gesture, event: WindowEvent): void;
    private drawBuyOrder;
    private drawSellOrder;
    private sharpen;
    private xInsideView;
    private getOffsetDistance;
}
//# sourceMappingURL=TradingOrderChartAnnotation.d.ts.map