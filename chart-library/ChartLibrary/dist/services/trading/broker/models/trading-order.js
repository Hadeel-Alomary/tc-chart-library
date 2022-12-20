import { TradingOrderSide } from './trading-order-side';
import { TradingOrderTypeWrapper } from './trading-order-type';
import { VirtualTradingOrder } from '../../virtual-trading/virtual-trading-models';
import { TradingOrderStatus } from './trading-order-status';
import { TradestationOrder } from '../../tradestation/tradestation-order';
var TradingOrder = (function () {
    function TradingOrder(id, symbol, price, quantity, side, type, status, takeProfit, stopLoss, executionPrice, executionTime) {
        this.id = id;
        this.symbol = symbol;
        this.price = price;
        this.quantity = quantity;
        this.side = side;
        this.type = type;
        this.status = status;
        this.takeProfit = takeProfit;
        this.stopLoss = stopLoss;
        this.executionPrice = executionPrice;
        this.executionTime = executionTime;
    }
    TradingOrder.fromVirtualTradingOrders = function (virtualTradingOrders) {
        var tradingOrders = [];
        for (var _i = 0, virtualTradingOrders_1 = virtualTradingOrders; _i < virtualTradingOrders_1.length; _i++) {
            var order = virtualTradingOrders_1[_i];
            if (VirtualTradingOrder.isActiveOrder(order) && !VirtualTradingOrder.isMarketOrder(order)) {
                tradingOrders.push(new TradingOrder("" + order.id, order.symbol, order.price, order.quantity, TradingOrderSide.fromVirtualTradingOrderSide(order.orderSide), TradingOrderTypeWrapper.fromVirtualTradingOrderType(order.orderType), TradingOrderStatus.fromVirtualTradingOrderStatus(order.orderStatus), order.takeProfit, order.stopPrice, null, null));
            }
            else if (VirtualTradingOrder.isExecutedOrder(order)) {
                tradingOrders.push(new TradingOrder("" + order.id, order.symbol, order.price, order.quantity, TradingOrderSide.fromVirtualTradingOrderSide(order.orderSide), TradingOrderTypeWrapper.fromVirtualTradingOrderType(order.orderType), TradingOrderStatus.fromVirtualTradingOrderStatus(order.orderStatus), order.takeProfit, order.stopPrice, order.executionPrice, order.executionTime));
            }
        }
        return tradingOrders;
    };
    TradingOrder.fromTradestationOrders = function (tradestationOrders) {
        var tradingOrders = [];
        for (var _i = 0, tradestationOrders_1 = tradestationOrders; _i < tradestationOrders_1.length; _i++) {
            var order = tradestationOrders_1[_i];
            if (TradestationOrder.isActiveOrder(order) && !TradestationOrder.isMarketOrder(order)) {
                tradingOrders.push(new TradingOrder("" + order.id, order.symbol, order.stopPrice ? order.stopPrice : order.price, order.quantity, TradingOrderSide.fromTradestationOrderSide(order.side), TradingOrderTypeWrapper.fromTradestationOrderType(order.type), TradingOrderStatus.fromTradestationOrderStatus(order.status), order.takeProfitPrice, order.stopLossPrice, null, null));
            }
            else if (TradestationOrder.isFilledOrder(order)) {
                tradingOrders.push(new TradingOrder("" + order.id, order.symbol, order.price, order.quantity, TradingOrderSide.fromTradestationOrderSide(order.side), TradingOrderTypeWrapper.fromTradestationOrderType(order.type), TradingOrderStatus.fromTradestationOrderStatus(order.status), order.takeProfitPrice, order.stopLossPrice, order.executedPrice, order.timeExecuted));
            }
        }
        return tradingOrders;
    };
    return TradingOrder;
}());
export { TradingOrder };
//# sourceMappingURL=trading-order.js.map