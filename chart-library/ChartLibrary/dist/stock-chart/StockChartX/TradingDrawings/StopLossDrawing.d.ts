import { OrderDrawing } from './OrderDrawing';
import { TradingOrder } from '../../../services/trading/broker/models';
export declare class StopLossDrawing extends OrderDrawing {
    protected setChartPoint(order: TradingOrder): void;
    protected setColorsAndFonts(): void;
    protected setDetailsText(): void;
    protected fireEditOrderEvent(newPrice: number): void;
    protected fireCancelOrderEvent(): void;
    protected getPrice(): any;
}
export interface ChartEditStopLossEventValue {
    orderId: string;
    newStopLoss: number;
}
//# sourceMappingURL=StopLossDrawing.d.ts.map