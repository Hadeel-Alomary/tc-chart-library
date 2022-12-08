import { TradingOrder } from '../../../services/trading/broker/models';
import { IPoint } from '../../StockChartX/Graphics/ChartPoint';
import { IRect } from '../../StockChartX/Graphics/Rect';
import { Chart } from '../Chart';
import { Gesture, WindowEvent } from '../../StockChartX/Gestures/Gesture';
import { TradingOrderTheme } from './TradingDrawingsDefaultSettings';
import { ThemedTradingDrawing } from './ThemedTradingDrawing';
export declare class OrderDrawing extends ThemedTradingDrawing<TradingOrderTheme> {
    static get className(): string;
    private _cancelBounds;
    private _quantityBounds;
    private _orderDetailsBounds;
    private _bounds;
    protected _order: TradingOrder;
    private _tradingService;
    protected _orderDetailsText: string;
    get visible(): boolean;
    set visible(value: boolean);
    constructor(chart: Chart, order: TradingOrder);
    getOrder(): TradingOrder;
    setOrder(order: TradingOrder): void;
    draw(): void;
    drawValueMarkers(): void;
    private drawLine;
    private drawCancelBox;
    private drawQuantityBox;
    private drawOrderDetailsBox;
    private drawDragMarks;
    private getTextSize;
    private setBounds;
    private getCancelText;
    private getQuantityText;
    private getDetailsText;
    protected setDetailsText(): void;
    private isStopOrder;
    private concatSideTextWithTypeText;
    protected setColorsAndFonts(): void;
    private getDrawingColors;
    protected setChartPoint(order: TradingOrder): void;
    protected isArabic(): boolean;
    protected getPrice(): any;
    protected fireEditOrderEvent(newPrice: number): void;
    protected fireCancelOrderEvent(): void;
    protected canMove(point: IPoint): boolean;
    protected bounds(): IRect;
    protected hitTest(point: IPoint): boolean;
    protected _handleClickGesture(gesture: Gesture, event: WindowEvent): void;
    protected _handleDoubleClickGesture(): void;
    protected _handleMouseHover(gesture: Gesture, event: WindowEvent): void;
    protected handleDragFinished(): void;
    protected handleDragStarted(): void;
    protected hideTooltipOnEvent(): void;
}
export interface ChartEditOrderEventValue {
    orderId: string;
    newPrice: number;
}
//# sourceMappingURL=OrderDrawing.d.ts.map