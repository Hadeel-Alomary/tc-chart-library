import { __extends } from "tslib";
import { ChartAnnotation } from './ChartAnnotation';
import { Geometry } from '../Graphics/Geometry';
import { ChartAccessorService, ChartTooltipType } from '../../../services/chart';
var TradingOrderChartAnnotation = (function (_super) {
    __extends(TradingOrderChartAnnotation, _super);
    function TradingOrderChartAnnotation(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this.width = 6;
        _this.height = 10;
        _this.padding = 10;
        if (!config.order) {
            throw new Error('cannot find data for chart annotation');
        }
        _this.order = config.order;
        return _this;
    }
    TradingOrderChartAnnotation.prototype.draw = function () {
        if (!this.isVisible()) {
            return;
        }
        var x = this.bounds().left;
        if (!this.xInsideView(x)) {
            return;
        }
        this.belowCandle ? this.drawBuyOrder() : this.drawSellOrder();
    };
    TradingOrderChartAnnotation.prototype.bounds = function () {
        var top = this.belowCandle ?
            this.projection.yByValue(this.getCandleLow()) + this.padding + this.getOffsetDistance() :
            this.projection.yByValue(this.getCandleHigh()) - this.padding - this.height - this.getOffsetDistance();
        return {
            left: Math.round(this.projection.xByRecord(this.getRecord())),
            top: Math.round(top),
            width: this.width,
            height: this.height
        };
    };
    TradingOrderChartAnnotation.prototype.isVisible = function () {
        return ChartAccessorService.instance.getTradingService().showExecutedOrders;
    };
    TradingOrderChartAnnotation.prototype.hitTest = function (point) {
        if (!this.isVisible()) {
            return;
        }
        return Geometry.isPointInsideOrNearRect(point, this.bounds());
    };
    TradingOrderChartAnnotation.prototype.handleMouseHoverGesture = function (gesture, event) {
        _super.prototype.handleMouseHoverGesture.call(this, gesture, event);
        if (Geometry.isPointInsideOrNearRect(event.pointerPosition, this.bounds())) {
            var executionPrice = Math.roundToDecimals(this.order.executionPrice, 2);
            ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Trading, {
                chartPanel: this.chartPanel,
                mousePosition: event.pointerPosition,
                text: ChartAccessorService.instance.translate(this.order.side.arabic) + " " + this.order.quantity + " @ " + executionPrice
            });
        }
        else {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Trading);
        }
    };
    TradingOrderChartAnnotation.prototype.handleMouseClickGesture = function (gesture, event) {
    };
    TradingOrderChartAnnotation.prototype.drawBuyOrder = function () {
        var bounds = this.bounds(), x = bounds.left, y = bounds.top, height = bounds.height, context = this.context, halfWidth = bounds.width / 2, halfTailWidth = bounds.width / 3 / 2, triangleHeight = height / 2, theme = { fillColor: '#4094e8' };
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
    };
    TradingOrderChartAnnotation.prototype.drawSellOrder = function () {
        var bounds = this.bounds(), x = bounds.left, y = bounds.top + bounds.height, height = bounds.height, context = this.context, halfWidth = bounds.width / 2, halfTailWidth = bounds.width / 3 / 2, triangleHeight = height / 2, theme = { fillColor: '#e75656' };
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
    };
    TradingOrderChartAnnotation.prototype.sharpen = function (val) {
        return Math.floor(val) + 0.5;
    };
    TradingOrderChartAnnotation.prototype.xInsideView = function (x) {
        return !(x < 0 || this.chartPanel.contentFrame.left + this.chartPanel.contentFrame.width < x);
    };
    TradingOrderChartAnnotation.prototype.getOffsetDistance = function () {
        return (this.height + this.padding) * this.offset;
    };
    return TradingOrderChartAnnotation;
}(ChartAnnotation));
export { TradingOrderChartAnnotation };
//# sourceMappingURL=TradingOrderChartAnnotation.js.map