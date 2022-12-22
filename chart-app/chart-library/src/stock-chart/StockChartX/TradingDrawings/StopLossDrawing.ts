import {OrderDrawing} from './OrderDrawing';
import {ChartAccessorService, ChartTooltipType} from '../../../services/chart';
import {TradingOrder} from '../../../services/trading/broker/models';
import {ChartPoint} from '../../StockChartX/Graphics/ChartPoint';
import {ChartEvent} from '../Chart';

export class StopLossDrawing extends OrderDrawing {

    protected setChartPoint(order: TradingOrder) {
        this.chartPoint = new ChartPoint({x: 0, value: order.stopLoss, record: 0});
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
        this._orderDetailsText = ChartAccessorService.instance.translate("وقف خسارة");
    }

    protected fireEditOrderEvent(newPrice: number) {
        this.hideTooltipOnEvent();
        let eventValue: ChartEditStopLossEventValue = {orderId: this._order.id, newStopLoss: newPrice};
        this.fire(ChartEvent.EDIT_STOP_LOSS, eventValue);
    }

    protected fireCancelOrderEvent() {
        this.hideTooltipOnEvent();
        this.fire(ChartEvent.CANCEL_STOP_LOSS, this._order.id);
    }

    protected getPrice() {
        return this._order.stopLoss;
    }
}

export interface ChartEditStopLossEventValue {
    orderId:string,
    newStopLoss:number
}
