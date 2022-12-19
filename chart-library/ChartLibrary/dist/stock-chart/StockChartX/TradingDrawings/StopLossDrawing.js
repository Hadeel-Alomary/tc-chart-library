var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { OrderDrawing } from './OrderDrawing';
import { ChartAccessorService } from '../../../services/chart';
import { ChartPoint } from '../../StockChartX/Graphics/ChartPoint';
import { ChartEvent } from '../Chart';
var StopLossDrawing = (function (_super) {
    __extends(StopLossDrawing, _super);
    function StopLossDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StopLossDrawing.prototype.setChartPoint = function (order) {
        this.chartPoint = new ChartPoint({ x: 0, value: order.stopLoss, record: 0 });
    };
    StopLossDrawing.prototype.setColorsAndFonts = function () {
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
    StopLossDrawing.prototype.setDetailsText = function () {
        this._orderDetailsText = ChartAccessorService.instance.translate("وقف خسارة");
    };
    StopLossDrawing.prototype.fireEditOrderEvent = function (newPrice) {
        this.hideTooltipOnEvent();
        var eventValue = { orderId: this._order.id, newStopLoss: newPrice };
        this.fire(ChartEvent.EDIT_STOP_LOSS, eventValue);
    };
    StopLossDrawing.prototype.fireCancelOrderEvent = function () {
        this.hideTooltipOnEvent();
        this.fire(ChartEvent.CANCEL_STOP_LOSS, this._order.id);
    };
    StopLossDrawing.prototype.getPrice = function () {
        return this._order.stopLoss;
    };
    return StopLossDrawing;
}(OrderDrawing));
export { StopLossDrawing };
//# sourceMappingURL=StopLossDrawing.js.map