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
import { ChartAccessorService, ChartTooltipType } from '../../../services/chart';
import { BrowserUtils, Tc } from '../../../utils';
import { TradingOrderSideType } from '../../../services/trading/broker/models/trading-order-side';
import { TradingOrderType } from '../../../services/trading/broker/models/trading-order-type';
import { ChartPoint } from '../../StockChartX/Graphics/ChartPoint';
import { DummyCanvasContext } from '../../StockChartX/Utils/DummyCanvasContext';
import { ChartEvent } from '../Chart';
import { Geometry } from '../../StockChartX/Graphics/Geometry';
import { TradingDrawingsDefaultSettings } from './TradingDrawingsDefaultSettings';
import { ThemedTradingDrawing } from './ThemedTradingDrawing';
import { ThemeType } from '../ThemeType';
var OrderDrawing = (function (_super) {
    __extends(OrderDrawing, _super);
    function OrderDrawing(chart, order) {
        var _this = _super.call(this, chart) || this;
        _this.theme = _this.chart.getThemeType() == ThemeType.Light ?
            TradingDrawingsDefaultSettings.getTradingOrderTheme().Light : TradingDrawingsDefaultSettings.getTradingOrderTheme().Dark;
        _this.setChartPoint(order);
        _this._tradingService = ChartAccessorService.instance.getTradingService();
        _this._order = order;
        _this.setColorsAndFonts();
        return _this;
    }
    Object.defineProperty(OrderDrawing, "className", {
        get: function () {
            return 'tradingOrder';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrderDrawing.prototype, "visible", {
        get: function () {
            if (!this.chart) {
                return false;
            }
            return ChartAccessorService.instance.getTradingService().showOrderDrawings;
        },
        set: function (value) {
            if (!this.chart) {
                return;
            }
            ChartAccessorService.instance.getTradingService().showPositionDrawings = value;
        },
        enumerable: true,
        configurable: true
    });
    OrderDrawing.prototype.getOrder = function () {
        return this._order;
    };
    OrderDrawing.prototype.setOrder = function (order) {
        this.setChartPoint(order);
        this._order = order;
    };
    OrderDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var point = this.cartesianPoint();
        if (!point) {
            return;
        }
        this.drawLine();
        if (this._tradingService.hasCancelOrderOption(this._order.id)) {
            this.drawCancelBox();
        }
        this.drawQuantityBox();
        this.drawOrderDetailsBox();
    };
    OrderDrawing.prototype.drawValueMarkers = function () {
        if (!this.visible)
            return;
        var context = this.chartPanel.context, value = this.chartPoint.value, text = "" + this.chartPanel.formatValue(Tc._2digits(value)), theme = this.actualTheme, textSize = DummyCanvasContext.measureText(text, theme.valueMarketText), padding = 2, bounds = this.bounds(), x = Math.round(bounds.left + bounds.width + 22), y = Math.round(bounds.top + (2 * padding)), width = Math.round(this.chartPanel.valueScale.rightFrame.width), height = Math.round(textSize.height + (2 * padding));
        if (BrowserUtils.isMobile()) {
            x = this.chartPanel.contentFrame.right + 2;
        }
        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.valueMarkerFill, theme.line);
        context.scxApplyTextTheme(theme.valueMarketText);
        context.fillText(text, x + padding, y + textSize.height - 1);
    };
    OrderDrawing.prototype.drawLine = function () {
        var point = this.cartesianPoint(), context = this.chartPanel.context, frame = this.chartPanel.contentFrame, theme = this.actualTheme;
        context.beginPath();
        context.moveTo(frame.left, point.y);
        context.lineTo(frame.right, point.y);
        context.scxStroke(theme.dashedLine);
    };
    OrderDrawing.prototype.drawCancelBox = function () {
        var context = this.chartPanel.context, theme = this.actualTheme, padding = 5, bounds = this._cancelBounds, x = bounds.left, y = bounds.top, width = bounds.width, height = bounds.height;
        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.fill, theme.line);
        context.scxApplyTextTheme(theme.cancelText);
        context.fillText(this.getCancelText(), x + padding, y + (3 * padding) - 1);
    };
    OrderDrawing.prototype.drawQuantityBox = function () {
        var context = this.chartPanel.context, theme = this.actualTheme, padding = 5, bounds = this._quantityBounds, x = bounds.left, y = bounds.top, width = bounds.width, height = bounds.height;
        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.coloredFill, theme.line);
        context.scxApplyTextTheme(theme.quantityText);
        context.fillText(this.getQuantityText(), x + padding, y + (3 * padding) - 1);
    };
    OrderDrawing.prototype.drawOrderDetailsBox = function () {
        var context = this.chartPanel.context, theme = this.actualTheme, padding = 5, bounds = this._orderDetailsBounds, x = bounds.left, y = bounds.top, width = bounds.width, height = bounds.height;
        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.fill, theme.line);
        context.scxApplyTextTheme(theme.text);
        var xPadding = BrowserUtils.isDesktop() ? x + (2 * padding) : x + padding;
        context.fillText(this.getDetailsText(), xPadding, y + 3 * padding - 2);
        if (BrowserUtils.isDesktop()) {
            this.drawDragMarks();
        }
    };
    OrderDrawing.prototype.drawDragMarks = function () {
        var context = this.chartPanel.context, theme = this.actualTheme, bounds = this._orderDetailsBounds, x = bounds.left + 4, y = bounds.top + 7, width = 2, numberOfMarks = 6, marksSpacing = 2;
        context.beginPath();
        for (var i = 0; i < numberOfMarks; i++) {
            context.moveTo(x, y);
            context.lineTo(x + width, y);
            y += marksSpacing;
        }
        context.scxStroke(theme.line);
    };
    OrderDrawing.prototype.getTextSize = function (text) {
        var theme = this.actualTheme;
        return DummyCanvasContext.measureText(text, theme.text);
    };
    OrderDrawing.prototype.setBounds = function () {
        var point = this.cartesianPoint(), frame = this.chartPanel.contentFrame, cancelTextSize = this.getTextSize(this.getCancelText()), quantityTextSize = this.getTextSize(this.getQuantityText()), orderDetailsTextSize = this.getTextSize(this.getDetailsText()), padding = 5, rightMargin = Math.round(frame.right - 20), top = Math.round(point.y - (orderDetailsTextSize.height / 2) - padding), height = orderDetailsTextSize.height + (padding * 2);
        if (BrowserUtils.isMobile()) {
            this._cancelBounds = {
                left: (2 * padding),
                top: top,
                width: cancelTextSize.width + (2 * padding),
                height: height
            };
            this._quantityBounds = {
                left: this._cancelBounds.left + this._cancelBounds.width,
                top: top,
                width: quantityTextSize.width + (2 * padding),
                height: height
            };
            this._orderDetailsBounds = {
                left: this._quantityBounds.left + this._quantityBounds.width,
                top: top,
                width: orderDetailsTextSize.width + 2 * padding,
                height: height
            };
            this._bounds = {
                left: this._cancelBounds.left,
                top: top,
                width: this._cancelBounds.width + this._quantityBounds.width + this._orderDetailsBounds.width,
                height: height
            };
        }
        else {
            this._cancelBounds = {
                left: rightMargin - cancelTextSize.width - (2 * padding),
                top: top,
                width: cancelTextSize.width + (2 * padding),
                height: height
            };
            this._quantityBounds = {
                left: this._cancelBounds.left - quantityTextSize.width - (2 * padding),
                top: top,
                width: quantityTextSize.width + (2 * padding),
                height: height
            };
            this._orderDetailsBounds = {
                left: this._quantityBounds.left - orderDetailsTextSize.width - (3 * padding),
                top: top,
                width: orderDetailsTextSize.width + (3 * padding),
                height: height
            };
            this._bounds = {
                left: this._orderDetailsBounds.left,
                top: top,
                width: this._cancelBounds.width + this._quantityBounds.width + this._orderDetailsBounds.width,
                height: height
            };
        }
    };
    OrderDrawing.prototype.getCancelText = function () {
        return "X";
    };
    OrderDrawing.prototype.getQuantityText = function () {
        return "" + this._order.quantity;
    };
    OrderDrawing.prototype.getDetailsText = function () {
        if (!this._orderDetailsText) {
            this.setDetailsText();
        }
        return this._orderDetailsText;
    };
    OrderDrawing.prototype.setDetailsText = function () {
        if (this.isStopOrder()) {
            this._orderDetailsText = ChartAccessorService.instance.translate(this._order.type.arabic);
        }
        else if (this._tradingService.needToConcatSideTextWithTypeText()) {
            this._orderDetailsText = this.concatSideTextWithTypeText();
        }
        else {
            this._orderDetailsText = ChartAccessorService.instance.translate(this._order.side.arabic);
        }
    };
    OrderDrawing.prototype.isStopOrder = function () {
        return this._order.type.type == TradingOrderType.STOP || this._order.type.type == TradingOrderType.STOP_LIMIT || this._order.type.type == TradingOrderType.STOP_MARKET;
    };
    OrderDrawing.prototype.concatSideTextWithTypeText = function () {
        return ChartAccessorService.instance.translate(this._order.side.arabic) + ' ' + ChartAccessorService.instance.translate(this._order.type.arabic);
    };
    OrderDrawing.prototype.setColorsAndFonts = function () {
        var colors = this.getDrawingColors();
        var orderColor = colors.solidColor;
        var orderColorWithOpacity = colors.opaqueColor;
        this.theme.text.fillColor = this._tradingService.useDarkLightTextColor() ? this.theme.text.fillColor : orderColor;
        this.theme.coloredFill.fillColor = orderColor;
        this.theme.cancelText.fillColor = orderColor;
        this.theme.valueMarkerFill.fillColor = orderColor;
        this.theme.line.strokeColor = orderColor;
        this.theme.dashedLine.strokeColor = orderColor;
        this.theme.line.strokeColor = orderColorWithOpacity;
        this.theme.text.fontFamily = this.isArabic() ? 'DroidArabicKufi-Bold' : 'Calibri';
    };
    OrderDrawing.prototype.getDrawingColors = function () {
        if (this._order.side.type == TradingOrderSideType.SELL || this._order.side.type == TradingOrderSideType.SELL_SHORT || this.isStopOrder()) {
            return this.theme.sellColors;
        }
        return this.theme.buyColors;
    };
    OrderDrawing.prototype.setChartPoint = function (order) {
        this.chartPoint = new ChartPoint({ x: 0, value: order.price, record: 0 });
    };
    OrderDrawing.prototype.isArabic = function () {
        return ChartAccessorService.instance.isArabic();
    };
    OrderDrawing.prototype.getPrice = function () {
        return this._order.price;
    };
    OrderDrawing.prototype.fireEditOrderEvent = function (newPrice) {
        this.hideTooltipOnEvent();
        var eventValue = { orderId: this._order.id, newPrice: newPrice };
        this.fire(ChartEvent.EDIT_ORDER, eventValue);
    };
    OrderDrawing.prototype.fireCancelOrderEvent = function () {
        this.hideTooltipOnEvent();
        this.fire(ChartEvent.CANCEL_ORDER, this._order.id);
    };
    OrderDrawing.prototype.canMove = function (point) {
        if (!this._cancelBounds) {
            return false;
        }
        if (!this._tradingService.canMoveOrder(this._order.id)) {
            return false;
        }
        return !Geometry.isPointInsideOrNearRect(point, this._cancelBounds);
    };
    OrderDrawing.prototype.bounds = function () {
        this.setBounds();
        return this._bounds;
    };
    OrderDrawing.prototype.hitTest = function (point) {
        if (!this.visible)
            return false;
        return point && Geometry.isPointInsideOrNearRect(point, this.bounds());
    };
    OrderDrawing.prototype._handleClickGesture = function (gesture, event) {
        _super.prototype._handleClickGesture.call(this, gesture, event);
        if (Geometry.isPointInsideOrNearRect(event.pointerPosition, this._cancelBounds)) {
            this.fireCancelOrderEvent();
        }
    };
    OrderDrawing.prototype._handleDoubleClickGesture = function () {
        _super.prototype._handleDoubleClickGesture.call(this);
        this.fireEditOrderEvent(this.getPrice());
    };
    OrderDrawing.prototype._handleMouseHover = function (gesture, event) {
        _super.prototype._handleMouseHover.call(this, gesture, event);
        var tooltipText = '';
        if (Geometry.isPointInsideOrNearRect(event.pointerPosition, this._cancelBounds)) {
            tooltipText = 'إلغاء';
        }
        else if (Geometry.isPointInsideOrNearRect(event.pointerPosition, this._quantityBounds)) {
            tooltipText = 'الكمية';
        }
        if (Geometry.isPointInsideOrNearRect(event.pointerPosition, this._cancelBounds) || Geometry.isPointInsideOrNearRect(event.pointerPosition, this._quantityBounds)) {
            ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Trading, {
                chartPanel: this.chartPanel,
                mousePosition: event.pointerPosition,
                text: ChartAccessorService.instance.translate(tooltipText)
            });
        }
        else {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Trading);
        }
    };
    OrderDrawing.prototype.handleDragFinished = function () {
        _super.prototype.handleDragFinished.call(this);
        var value = this.chartPoint.value, newPrice = Tc._2digits(value);
        if (this.getPrice() != newPrice)
            this.fireEditOrderEvent(newPrice);
    };
    OrderDrawing.prototype.handleDragStarted = function () {
        _super.prototype.handleDragStarted.call(this);
        this.fire(ChartEvent.DISABLE_REFRESH_TRADING_DRAWINGS);
    };
    OrderDrawing.prototype.hideTooltipOnEvent = function () {
        window.setTimeout(function () {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Trading);
        }, 100);
    };
    return OrderDrawing;
}(ThemedTradingDrawing));
export { OrderDrawing };
//# sourceMappingURL=OrderDrawing.js.map