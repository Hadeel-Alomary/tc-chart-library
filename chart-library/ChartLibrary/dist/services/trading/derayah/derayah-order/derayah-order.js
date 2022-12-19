import { DerayahOrderExecution, DerayahOrderExecutionType } from './derayah-order-execution';
import { DerayahOrderExpiration, DerayahOrderExpirationType } from './derayah-order-expiration';
import { DerayahOrderStatus, DerayahOrderStatusType } from './derayah-order-status';
import { DerayahOrderTypeWrapper, DerayahOrderType } from './derayah-order-type';
import { DerayahOrderLastActionStatus, DerayahOrderLastActionStatusType } from './derayah-order-last-action-status';
import { MarketUtils, DerayahUtils } from '../../../../utils/index';
var DerayahOrder = (function () {
    function DerayahOrder(id, type, portfolio, derayahSymbol, derayahMarket, symbol, name, date, execution, quantity, discloseQuantity, executedQuantity, price, expiration, status, lastActionStatus) {
        this.id = id;
        this.type = type;
        this.portfolio = portfolio;
        this.derayahSymbol = derayahSymbol;
        this.derayahMarket = derayahMarket;
        this.symbol = symbol;
        this.name = name;
        this.date = date;
        this.execution = execution;
        this.quantity = quantity;
        this.discloseQuantity = discloseQuantity;
        this.executedQuantity = executedQuantity;
        this.price = price;
        this.expiration = expiration;
        this.status = status;
        this.lastActionStatus = lastActionStatus;
    }
    DerayahOrder.newOrder = function (type, symbol, portfolio, companyName, nomu) {
        return new DerayahOrder(null, DerayahOrderTypeWrapper.fromType(type), portfolio, MarketUtils.symbolWithoutMarket(symbol), nomu ? 98 : 99, symbol, companyName, moment().format(), DerayahOrderExecution.getExecutionByType(DerayahOrderExecutionType.Limit), 0, 0, 0, 0, DerayahOrderExpiration.getOrderExpirationByType(DerayahOrderExpirationType.Day), DerayahOrderStatus.getStatusByType(DerayahOrderStatusType.New), DerayahOrderLastActionStatus.getStatusByType(DerayahOrderLastActionStatusType.FetchedToBeSentToExchangeCode));
    };
    DerayahOrder.fromPosition = function (position, companyName, nomu) {
        return new DerayahOrder(null, DerayahOrderTypeWrapper.fromType(DerayahOrderType.Sell), position.portfolio, MarketUtils.symbolWithoutMarket(position.symbol), nomu ? 98 : 99, position.symbol, companyName, moment().format(), DerayahOrderExecution.getExecutionByType(DerayahOrderExecutionType.Limit), position.freeQuantity, 0, position.quantity - position.freeQuantity, 0, DerayahOrderExpiration.getOrderExpirationByType(DerayahOrderExpirationType.Day), DerayahOrderStatus.getStatusByType(DerayahOrderStatusType.New), DerayahOrderLastActionStatus.getStatusByType(DerayahOrderLastActionStatusType.FetchedToBeSentToExchangeCode));
    };
    DerayahOrder.updateOrderWithOrderDetails = function (order, orderDetails) {
        order.type = DerayahOrderTypeWrapper.getDerayahOrderTypeAsString(orderDetails.orderSide);
        order.portfolio = orderDetails.portfolio;
        order.derayahSymbol = orderDetails.symbol;
        order.derayahMarket = orderDetails.exchangeCode;
        order.symbol = DerayahUtils.getSymbolWithMarketFromDerayah(order.derayahMarket, order.derayahSymbol);
        order.date = moment(orderDetails.date, 'MM/DD/YYYY').format('YYYY-MM-DD');
        order.execution = DerayahOrderExecution.getExecutionByTypeAsString(orderDetails.executionType);
        order.quantity = +orderDetails.quantity;
        order.discloseQuantity = orderDetails.discloseQuantity ? +orderDetails.discloseQuantity : 0;
        order.executedQuantity = +((+orderDetails.quantity) - (+orderDetails.remainedQuantity));
        order.price = +orderDetails.requestedPrice;
        order.expiration = DerayahOrderExpiration.getOrderExpirationByTypeAsString(orderDetails.validTill);
        order.expiration.tillDate = orderDetails.validTillDate;
        order.status = DerayahOrderStatus.getStatusByTypeAsString(orderDetails.orderStatus);
        order.lastActionStatus = DerayahOrderLastActionStatus.getStatusByServerName(orderDetails.actions[orderDetails.actions.length - 1].actionStatus);
    };
    DerayahOrder.mapResponseToDerayahOrder = function (response, companyName, companySymbol, portfolio) {
        return {
            id: response.orderId.toString(),
            type: DerayahOrderTypeWrapper.getDerayahOrderTypeAsString(response.side),
            portfolio: portfolio,
            derayahSymbol: response.symbol,
            derayahMarket: response.exchangeCode,
            symbol: companySymbol,
            name: companyName,
            date: response.orderDate,
            execution: DerayahOrderExecution.getExecutionByTypeAsString(response.executionType),
            quantity: +response.quantity,
            discloseQuantity: response.disclosequantity ? response.disclosequantity : 0,
            executedQuantity: response.executedQuantity,
            price: +response.price,
            expiration: null,
            status: DerayahOrderStatus.getStatusByTypeAsString(response.status),
            lastActionStatus: DerayahOrderLastActionStatus.getStatusByServerName(response.lastActionStatus)
        };
    };
    DerayahOrder.canEditOrder = function (order) {
        var editableStatus = DerayahOrderStatus.editableStatus(order.status.type);
        if (!editableStatus) {
            return false;
        }
        if (order.status.type == DerayahOrderStatusType.New &&
            order.lastActionStatus.type != DerayahOrderLastActionStatusType.NotSentToExchangeCode) {
            return false;
        }
        if ([DerayahOrderLastActionStatusType.AcknowledgeAfterFetch, DerayahOrderLastActionStatusType.FetchedToBeSentToExchangeCode].indexOf(order.lastActionStatus.type) !== -1) {
            return false;
        }
        if (DerayahOrder.canRevertOrder(order)) {
            return false;
        }
        return true;
    };
    DerayahOrder.canRevertOrder = function (order) {
        return order.lastActionStatus.type == DerayahOrderLastActionStatusType.NotSentToExchangeCode &&
            [DerayahOrderStatusType.Open,
                DerayahOrderStatusType.DefaultOpen,
                DerayahOrderStatusType.PartiallyExecuted].indexOf(order.status.type) !== -1;
    };
    return DerayahOrder;
}());
export { DerayahOrder };
//# sourceMappingURL=derayah-order.js.map