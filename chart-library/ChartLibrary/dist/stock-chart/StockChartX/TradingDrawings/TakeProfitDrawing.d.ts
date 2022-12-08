import { OrderDrawing } from './OrderDrawing';
import { TradingOrder } from '../../../services/trading/broker/models';
export declare class TakeProfitDrawing extends OrderDrawing {
    protected setChartPoint(order: TradingOrder): void;
    protected setColorsAndFonts(): void;
    protected setDetailsText(): void;
    protected fireEditOrderEvent(newPrice: number): void;
    protected fireCancelOrderEvent(): void;
    protected getPrice(): any;
}
export interface ChartEditTakeProfileEventValue {
    orderId: string;
    newTakeProfit: number;
}
//# sourceMappingURL=TakeProfitDrawing.d.ts.map