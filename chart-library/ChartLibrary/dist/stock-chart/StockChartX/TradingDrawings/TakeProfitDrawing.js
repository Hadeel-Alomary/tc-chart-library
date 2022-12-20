var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { OrderDrawing } from './OrderDrawing';
import { ChartAccessorService } from '../../../services/chart';
import { ChartPoint } from '../../StockChartX/Graphics/ChartPoint';
import { ChartEvent } from '../Chart';
var TakeProfitDrawing = (function (_super) {
    __extends(TakeProfitDrawing, _super);
    function TakeProfitDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TakeProfitDrawing.prototype.setChartPoint = function (order) {
        this.chartPoint = new ChartPoint({ x: 0, value: order.takeProfit, record: 0 });
    };
    TakeProfitDrawing.prototype.setColorsAndFonts = function () {
        var colors = this.theme.sellColors;
        var orderColor = colors.solidColor;
        var orderColorWithOpacity = colors.highOpacityColor;
        this.theme.text.fillColor = orderColorWithOpacity;
        this.theme.coloredFill.fillColor = orderColorWithOpacity;
        this.theme.cancelText.fillColor = orderColorWithOpacity;
        this.theme.valueMarkerFill.fillColor = orderColor;
        this.theme.dashedLine.strokeColor = orderColor;
        this.theme.line.strokeColor = orderColorWithOpacity;
        this.theme.text.fontFamily = this.isArabic() ? 'DroidArabicKufi-Bold' : 'Calibri';
    };
    TakeProfitDrawing.prototype.setDetailsText = function () {
        this._orderDetailsText = ChartAccessorService.instance.translate("جني أرباح");
    };
    TakeProfitDrawing.prototype.fireEditOrderEvent = function (newPrice) {
        this.hideTooltipOnEvent();
        var eventValue = { orderId: this._order.id, newTakeProfit: newPrice };
        this.fire(ChartEvent.EDIT_TAKE_PROFIT, eventValue);
    };
    TakeProfitDrawing.prototype.fireCancelOrderEvent = function () {
        this.hideTooltipOnEvent();
        this.fire(ChartEvent.CANCEL_TAKE_PROFIT, this._order.id);
    };
    TakeProfitDrawing.prototype.getPrice = function () {
        return this._order.takeProfit;
    };
    return TakeProfitDrawing;
}(OrderDrawing));
export { TakeProfitDrawing };
//# sourceMappingURL=TakeProfitDrawing.js.map