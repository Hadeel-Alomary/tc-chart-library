import {OrderDrawing} from './OrderDrawing';
import {ChartAccessorService, ChartTooltipType} from '../../../services/chart';
import {TradingOrder} from '../../../services/trading/broker/models';
import {ChartPoint} from '../../StockChartX/Graphics/ChartPoint';
import {ChartEvent} from '../Chart';


export class TakeProfitDrawing extends OrderDrawing {

    protected setChartPoint(order: TradingOrder) {
        this.chartPoint = new ChartPoint({x: 0, value: order.takeProfit, record: 0});
    }

    protected setColorsAndFonts() {
        let colors = this.theme.sellColors;
        let orderColor = colors.solidColor;
        let orderColorWithOpacity = colors.highOpacityColor;

        this.theme.text.fillColor = orderColorWithOpacity;
        this.theme.coloredFill.fillColor = orderColorWithOpacity;
        this.theme.cancelText.fillColor = orderColorWithOpacity;
        this.theme.valueMarkerFill.fillColor = orderColor;
        this.theme.dashedLine.strokeColor = orderColor;
        this.theme.line.strokeColor = orderColorWithOpacity;
        this.theme.text.fontFamily = this.isArabic() ? 'DroidArabicKufi-Bold' : 'Calibri';
    }

    protected setDetailsText() {
        this._orderDetailsText = ChartAccessorService.instance.translate("جني أرباح");
    }

    protected fireEditOrderEvent(newPrice: number) {
        this.hideTooltipOnEvent();
        let eventValue: ChartEditTakeProfileEventValue = {orderId: this._order.id, newTakeProfit: newPrice};
        this.fire(ChartEvent.EDIT_TAKE_PROFIT, eventValue);
    }

    protected fireCancelOrderEvent() {
        this.hideTooltipOnEvent();
        this.fire(ChartEvent.CANCEL_TAKE_PROFIT, this._order.id);
    }

    protected getPrice() {
        return this._order.takeProfit;
    }
}

export interface ChartEditTakeProfileEventValue {
    orderId: string,
    newTakeProfit: number
}
