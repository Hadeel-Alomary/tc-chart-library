import { SnbcapitalOrderStatus, SnbcapitalOrderStatusType } from './snbcapital-order-status';
import { SnbcapitalOrderType, SnbcapitalOrderTypeWrapper } from './snbcapital-order-type';
import { SnbcapitalOrderExecution, SnbcapitalOrderExecutionType } from './snbcapital-order-execution';
import { SnbcapitalOrderExpiration, SnbcapitalOrderExpirationType } from './snbcapital-order-expiration';
var SnbcapitalOrder = (function () {
    function SnbcapitalOrder(id, symbol, name, gpsOrderNumber, price, quantity, qtyParam, minimumQuantity, executedQuantity, remainingQuantity, discloseQuantity, portfolioId, isOpen, canBeRevoked, quantityCanBeChanged, priceCanBeModified, expiryDateCanBeModified, status, execution, type, timeParameter, date, time, expiration, tillDate, referrer) {
        this.id = id;
        this.symbol = symbol;
        this.name = name;
        this.gpsOrderNumber = gpsOrderNumber;
        this.price = price;
        this.quantity = quantity;
        this.qtyParam = qtyParam;
        this.minimumQuantity = minimumQuantity;
        this.executedQuantity = executedQuantity;
        this.remainingQuantity = remainingQuantity;
        this.discloseQuantity = discloseQuantity;
        this.portfolioId = portfolioId;
        this.isOpen = isOpen;
        this.canBeRevoked = canBeRevoked;
        this.quantityCanBeChanged = quantityCanBeChanged;
        this.priceCanBeModified = priceCanBeModified;
        this.expiryDateCanBeModified = expiryDateCanBeModified;
        this.status = status;
        this.execution = execution;
        this.type = type;
        this.timeParameter = timeParameter;
        this.date = date;
        this.time = time;
        this.expiration = expiration;
        this.tillDate = tillDate;
        this.referrer = referrer;
    }
    SnbcapitalOrder.newOrder = function (type, symbol, portfolio, companyName) {
        return new SnbcapitalOrder(null, symbol, companyName, portfolio.gBSCustomerCode, 0, 0, 0, 0, 0, 0, 0, portfolio.portfolioId, true, true, true, true, true, SnbcapitalOrderStatus.getOrderStatus(1), SnbcapitalOrderExecution.getExecutionType(SnbcapitalOrderExecutionType.Limit), SnbcapitalOrderTypeWrapper.getSnbcapitalOrderType(type), null, null, null, SnbcapitalOrderExpiration.getExpirationType(SnbcapitalOrderExpirationType.Today), null, null);
    };
    SnbcapitalOrder.fromPosition = function (position, companyName) {
        return new SnbcapitalOrder(null, position.symbol, companyName, null, 0, position.freeQuantity, 0, 0, position.quantity - position.freeQuantity, 0, 0, position.portfolioId, true, true, true, true, true, SnbcapitalOrderStatus.getOrderStatus(SnbcapitalOrderStatusType.ToBeSentToMarket), SnbcapitalOrderExecution.getExecutionType(SnbcapitalOrderExecutionType.Market), SnbcapitalOrderTypeWrapper.getSnbcapitalOrderType(SnbcapitalOrderType.Sell), 0, moment(new Date()).format('YYYY-MM-DD'), moment().format('HH:mm:ss'), SnbcapitalOrderExpiration.getExpirationType(SnbcapitalOrderExpirationType.Today), null, null);
    };
    SnbcapitalOrder.updateOrderWithOrderDetails = function (order, orderDetails) {
        order.portfolioId = orderDetails.portfolioId;
        order.date = moment(orderDetails.date).format('YYYY-MM-DD');
        order.time = moment(order.time).format('HH:mm:ss');
        order.execution = SnbcapitalOrderExecution.getExecutionByType(orderDetails.order.execution.type);
        order.quantity = +orderDetails.quantity;
        order.discloseQuantity = orderDetails.order.discloseQuantity ? +orderDetails.order.discloseQuantity : 0;
        order.executedQuantity = +((+orderDetails.quantity) - (+orderDetails.remainedQuantity));
        order.price = +orderDetails.order.price;
        order.expiration = SnbcapitalOrderExpiration.getExpirationType(orderDetails.order.timeParameter, orderDetails.order.qtyParam, true);
        order.tillDate = orderDetails.order.tillDate ? moment(orderDetails.order.tillDate).format('YYYY-MM-DD') : '-';
        order.status = SnbcapitalOrderStatus.getOrderStatus(orderDetails.order.status.type);
    };
    SnbcapitalOrder.mapResponseToSnbcapitalOrder = function (response, companyName, companySymbol) {
        return {
            id: response.gbsOrderNumber,
            symbol: companySymbol,
            name: companyName,
            gpsOrderNumber: response.gbsOrderNumber,
            price: response.limPrice,
            quantity: response.orderQty,
            qtyParam: response.qtyParam,
            minimumQuantity: response.quantitaMinima,
            executedQuantity: response.execQty,
            remainingQuantity: response.remainingQty,
            discloseQuantity: response.disclosedQty,
            portfolioId: response.saCode,
            isOpen: response.isOpen,
            canBeRevoked: response.canBeRevoked,
            quantityCanBeChanged: response.qtyCanBeChanged,
            priceCanBeModified: response.priceCanBeChanged,
            expiryDateCanBeModified: response.expiryDateCanBeChanged,
            status: SnbcapitalOrderStatus.getOrderStatus(response.status),
            execution: SnbcapitalOrderExecution.getExecutionType(response.priceType),
            type: SnbcapitalOrderTypeWrapper.getSnbcapitalOrderType(response.sign),
            timeParameter: response.timeParam,
            date: moment(this.getOrderDate(response.insDate), 'YYYY-MM-DD HH:mm:ss.SSS').format('YYYY-MM-DD'),
            time: moment(this.getOrderDate(response.insDate), 'YYYY-MM-DD HH:mm:ss.SSS').format('HH:mm:ss'),
            expiration: SnbcapitalOrderExpiration.getExpirationType(response.timeParam),
            tillDate: response.expiryDate ? moment(this.getOrderDate(response.expiryDate)).format('YYYY-MM-DD') : '-',
            referrer: null
        };
    };
    SnbcapitalOrder.canEditOrder = function (order) {
        return SnbcapitalOrderStatus.editableStatus(order);
    };
    SnbcapitalOrder.canCancelOrder = function (order) {
        return SnbcapitalOrderStatus.cancelableStatus(order);
    };
    SnbcapitalOrder.getOrderDate = function (date) {
        if (date == null) {
            return null;
        }
        if (date.isnull) {
            return null;
        }
        return date.year + "-" + date.month + "-" + date.day + " " + date.hour + ":" + date.minute + ":" + date.second + "." + date.millis;
    };
    return SnbcapitalOrder;
}());
export { SnbcapitalOrder };
//# sourceMappingURL=snbcapital-order.js.map