import { TradestationOrderSideType, TradestationOrderSideWrapper } from './tradestation-order-side-type';
import { TradestationOrdersGroupedStatus, TradestationOrderStatus, TradestationOrderStatusType } from './tradestation-order-status';
import { TradestationOrderType } from './tradestation-order-type-wrapper';
import { TradestationOrderExpiration, TradestationOrderExpirationType } from './tradestation-order-expiration';
import { TradestationOrderRouting, TradestationOrderRoutingType } from './tradestation-order-routing';
import { TradestationTrailingStopType } from './tradestation-trailing-stop';
var TradestationOrder = (function () {
    function TradestationOrder(id, accountId, side, type, status, originalStatus, takeProfitPrice, stopLossPrice, stopPrice, limitPrice, symbol, companyName, quantity, executedQuantity, leavesQuantity, price, commission, timeExecuted, executedPrice, timeStamp, rejectReason, groupName, unbundledRouteFee, routing, expirationType, tillDate, triggeredBy, confirmationId, trailingAmount, trailingPercent, quantitiyLeft) {
        this.id = id;
        this.accountId = accountId;
        this.side = side;
        this.type = type;
        this.status = status;
        this.originalStatus = originalStatus;
        this.takeProfitPrice = takeProfitPrice;
        this.stopLossPrice = stopLossPrice;
        this.stopPrice = stopPrice;
        this.limitPrice = limitPrice;
        this.symbol = symbol;
        this.companyName = companyName;
        this.quantity = quantity;
        this.executedQuantity = executedQuantity;
        this.leavesQuantity = leavesQuantity;
        this.price = price;
        this.commission = commission;
        this.timeExecuted = timeExecuted;
        this.executedPrice = executedPrice;
        this.timeStamp = timeStamp;
        this.rejectReason = rejectReason;
        this.groupName = groupName;
        this.unbundledRouteFee = unbundledRouteFee;
        this.routing = routing;
        this.expirationType = expirationType;
        this.tillDate = tillDate;
        this.triggeredBy = triggeredBy;
        this.confirmationId = confirmationId;
        this.trailingAmount = trailingAmount;
        this.trailingPercent = trailingPercent;
        this.quantitiyLeft = quantitiyLeft;
    }
    TradestationOrder.newOrder = function (side, symbol, companyName) {
        return new TradestationOrder(null, null, TradestationOrderSideWrapper.fromValue(side), TradestationOrderType.Limit, TradestationOrderStatus.fromValue(TradestationOrderStatusType.OPN), TradestationOrderStatusType.OPN, 0, 0, 0, 0, symbol, companyName, 0, 0, 0, 0, 0, null, 0, null, null, null, null, TradestationOrderRouting.getOrderRoutingByType(TradestationOrderRoutingType.Intelligent), TradestationOrderExpiration.getOrderExpirationByType(TradestationOrderExpirationType.GTD), moment(new Date()).format('YYYY-MM-DD'), null, null, 0, 0, 0);
    };
    TradestationOrder.fromPosition = function (position, orderSide, orderType) {
        return new TradestationOrder(null, position.accountId, TradestationOrderSideWrapper.fromValue(orderSide), orderType, TradestationOrderStatus.fromValue(TradestationOrderStatusType.OPN), TradestationOrderStatusType.OPN, 0, 0, 0, 0, position.symbol, position.companyName, position.quantity, 0, 0, 0, 0, null, 0, null, null, null, null, TradestationOrderRouting.getOrderRoutingByType(TradestationOrderRoutingType.Intelligent), TradestationOrderExpiration.getOrderExpirationByType(TradestationOrderExpirationType.GTD), moment(new Date()).format('YYYY-MM-DD'), null, null, 0, 0, 0);
    };
    TradestationOrder.mapResponseToTradestationOrder = function (response, companyName, companySymbol) {
        var expirationData = response.Duration.split('-');
        var tillDate = (expirationData.length == 2 && TradestationOrderExpiration.isGoodTillDate(expirationData[0].trim())) ? moment(expirationData[1]).format('YYYY-MM-DD') : '-';
        var trailingStop = response.TrailingStop;
        var trailingAmount = trailingStop && trailingStop.Amount ? trailingStop.Amount : null;
        var trailingPercent = trailingStop && trailingStop.Percent ? trailingStop.Percent : null;
        return new TradestationOrder(response.OrderID.toString(), response.AccountID, TradestationOrderSideWrapper.fromValue(response.Type), response.Legs[0].OrderType, TradestationOrderStatus.fromValue(response.Status), response.Status, 0, 0, response.Legs[0].StopPrice, response.Legs[0].LimitPrice, companySymbol, companyName, response.Legs[0].Quantity, response.Legs[0].ExecQuantity, response.Legs[0].Leaves, response.Legs[0].LimitPrice, response.CommissionFee, response.Legs[0].TimeExecuted, response.Legs[0].ExecPrice, response.TimeStamp, response.RejectReason ? response.RejectReason : "", response.GroupName, response.UnbundledRouteFee, TradestationOrderRouting.getOrderRoutingByType(response.Routing), TradestationOrderExpiration.getOrderExpirationByType(expirationData[0].trim()), tillDate, response.TriggeredBy, null, trailingAmount, trailingPercent, response.Legs[0].QuantityLeft);
    };
    TradestationOrder.isBuyOrder = function (order) {
        return order.side.value == TradestationOrderSideType.Buy;
    };
    TradestationOrder.isSellOrder = function (order) {
        return order.side.value == TradestationOrderSideType.Sell;
    };
    TradestationOrder.isSellShortOrder = function (order) {
        return order.side.value == TradestationOrderSideType.SellShort;
    };
    TradestationOrder.isBuyToCoverOrder = function (order) {
        return order.side.value == TradestationOrderSideType.BuyToCover;
    };
    TradestationOrder.isBuyOrBuyToCoverOrder = function (order) {
        return order.side.value == TradestationOrderSideType.Buy || order.side.value == TradestationOrderSideType.BuyToCover;
    };
    TradestationOrder.isSellOrSellShortOrder = function (order) {
        return order.side.value == TradestationOrderSideType.Sell || order.side.value == TradestationOrderSideType.SellShort;
    };
    TradestationOrder.isLimitOrder = function (order) {
        return order.type == TradestationOrderType.Limit;
    };
    TradestationOrder.isMarketOrder = function (order) {
        return order.type == TradestationOrderType.Market;
    };
    TradestationOrder.isStopMarket = function (order) {
        return order.type == TradestationOrderType.StopMarket;
    };
    TradestationOrder.isStopLimit = function (order) {
        return order.type == TradestationOrderType.StopLimit;
    };
    TradestationOrder.isStopOrder = function (order) {
        return order.type == TradestationOrderType.StopMarket || order.type == TradestationOrderType.StopLimit;
    };
    TradestationOrder.isTrailingStopPrice = function (type) {
        return type == TradestationTrailingStopType.StopPrice;
    };
    TradestationOrder.isTrailingAmountStop = function (type) {
        return type == TradestationTrailingStopType.TrailingAmount;
    };
    TradestationOrder.isTrailingPercent = function (type) {
        return type == TradestationTrailingStopType.TrailingPercent;
    };
    TradestationOrder.isNewOrResendOrder = function (order) {
        return order.id == null;
    };
    TradestationOrder.isEditOrder = function (order) {
        return order.id !== null;
    };
    TradestationOrder.isActiveOrder = function (order) {
        return order.status.value == TradestationOrdersGroupedStatus.ACTIVE;
    };
    TradestationOrder.isInActive = function (order) {
        return order.status.value == TradestationOrdersGroupedStatus.INACTIVE;
    };
    TradestationOrder.isFilledOrder = function (order) {
        return order.status.value == TradestationOrdersGroupedStatus.FILLED;
    };
    TradestationOrder.isCanceled = function (order) {
        return order.status.value == TradestationOrdersGroupedStatus.CANCELED;
    };
    TradestationOrder.isRejected = function (order) {
        return order.status.value == TradestationOrdersGroupedStatus.REJECTED;
    };
    return TradestationOrder;
}());
export { TradestationOrder };
//# sourceMappingURL=tradestation-order.js.map