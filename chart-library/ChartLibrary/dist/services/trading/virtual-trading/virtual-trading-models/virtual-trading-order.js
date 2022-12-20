import { VirtualTradingOrderType } from './virtual-trading-order-type';
import { VirtualTradingOrderStatus } from './virtual-trading-order-status';
import { VirtualTradingOrderSide } from './virtual-trading-order-side';
var VirtualTradingOrder = (function () {
    function VirtualTradingOrder(id, orderSide, orderType, accountId, symbol, name, market, quantity, price, stopPrice, takeProfit, commission, commissionAmount, executionPrice, executionTime, expirationDate, orderStatus, createdAt, updatedAt) {
        this.id = id;
        this.orderSide = orderSide;
        this.orderType = orderType;
        this.accountId = accountId;
        this.symbol = symbol;
        this.name = name;
        this.market = market;
        this.quantity = quantity;
        this.price = price;
        this.stopPrice = stopPrice;
        this.takeProfit = takeProfit;
        this.commission = commission;
        this.commissionAmount = commissionAmount;
        this.executionPrice = executionPrice;
        this.executionTime = executionTime;
        this.expirationDate = expirationDate;
        this.orderStatus = orderStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    VirtualTradingOrder.newOrder = function (side, symbol, companyName, accountId, commission, market) {
        return new VirtualTradingOrder(null, VirtualTradingOrderSide.fromValue(side), VirtualTradingOrderType.fromValue('LIMIT'), accountId, symbol, companyName, market, 0, 0, null, null, commission, null, null, null, null, VirtualTradingOrderStatus.fromValue('ACTIVE'), null, null);
    };
    VirtualTradingOrder.mapResponseToVirtualTradingOrders = function (response) {
        var result = [];
        for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
            var responseObject = response_1[_i];
            var company = null;
            result.push(VirtualTradingOrder.mapResponseToVirtualTradingOrder(responseObject, null));
        }
        return result;
    };
    VirtualTradingOrder.mapDetailsResponseToVirtualTradingOrder = function (response) {
        var company = null;
        return VirtualTradingOrder.mapResponseToVirtualTradingOrder(response, null);
    };
    VirtualTradingOrder.mapResponseToVirtualTradingOrder = function (response, companyName) {
        return new VirtualTradingOrder(response.id.toString(), VirtualTradingOrderSide.fromValue(response.order_side), VirtualTradingOrderType.fromValue(response.order_type), response.trading_account_id, response.symbol + "." + response.market, companyName, null, +response.quantity, +response.price, +response.stop_price, +response.take_profit, +response.commission, +response.commission_amount, +response.execution_price, response.execution_time, response.expiration_date, VirtualTradingOrderStatus.fromValue(response.order_status), response.created_at, response.updated_at);
    };
    VirtualTradingOrder.fromPosition = function (position, commission) {
        return new VirtualTradingOrder(null, VirtualTradingOrderSide.fromValue('SELL'), VirtualTradingOrderType.fromValue('LIMIT'), position.accountId, position.symbol, position.name, position.market, position.freeQuantity, 0, null, null, commission, null, null, null, null, VirtualTradingOrderStatus.fromValue('ACTIVE'), null, null);
    };
    VirtualTradingOrder.isActiveOrder = function (order) {
        return order.orderStatus.value == 'ACTIVE';
    };
    VirtualTradingOrder.isExecutedOrder = function (order) {
        return order.orderStatus.value == 'EXECUTED';
    };
    VirtualTradingOrder.isNewOrder = function (order) {
        return order.id == null;
    };
    VirtualTradingOrder.isMarketOrder = function (order) {
        return order.orderType.value == 'MARKET';
    };
    VirtualTradingOrder.isManualOrder = function (order) {
        return order.orderType.value == 'MANUAL';
    };
    VirtualTradingOrder.isStopOrder = function (order) {
        return order.orderType.value == 'STOP';
    };
    VirtualTradingOrder.isBuyOrder = function (order) {
        return order.orderSide.value == 'BUY';
    };
    return VirtualTradingOrder;
}());
export { VirtualTradingOrder };
//# sourceMappingURL=virtual-trading-order.js.map