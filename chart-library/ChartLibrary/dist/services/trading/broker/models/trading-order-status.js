import { TradestationOrdersGroupedStatus } from '../../tradestation/tradestation-order';
export var TradingOrderStatusType;
(function (TradingOrderStatusType) {
    TradingOrderStatusType[TradingOrderStatusType["ACTIVE"] = 0] = "ACTIVE";
    TradingOrderStatusType[TradingOrderStatusType["EXECUTED"] = 1] = "EXECUTED";
})(TradingOrderStatusType || (TradingOrderStatusType = {}));
var TradingOrderStatus = (function () {
    function TradingOrderStatus(type, arabic, english) {
        this.type = type;
        this.arabic = arabic;
        this.english = english;
    }
    TradingOrderStatus.fromVirtualTradingOrderStatus = function (status) {
        switch (status.value) {
            case 'ACTIVE':
                return TradingOrderStatus.allOrderStatuses.ACTIVE;
            case 'EXECUTED':
                return TradingOrderStatus.allOrderStatuses.EXECUTED;
            default:
                return null;
        }
    };
    TradingOrderStatus.fromTradestationOrderStatus = function (status) {
        switch (status.value) {
            case TradestationOrdersGroupedStatus.ACTIVE:
                return TradingOrderStatus.allOrderStatuses.ACTIVE;
            case TradestationOrdersGroupedStatus.FILLED:
                return TradingOrderStatus.allOrderStatuses.EXECUTED;
            default:
                return null;
        }
    };
    TradingOrderStatus.fromType = function (type) {
        switch (type) {
            case TradingOrderStatusType.ACTIVE:
                return TradingOrderStatus.allOrderStatuses.ACTIVE;
            case TradingOrderStatusType.EXECUTED:
                return TradingOrderStatus.allOrderStatuses.EXECUTED;
            default:
                return null;
        }
    };
    TradingOrderStatus.allOrderStatuses = {
        ACTIVE: new TradingOrderStatus(TradingOrderStatusType.ACTIVE, 'مفعّل', 'Active'),
        EXECUTED: new TradingOrderStatus(TradingOrderStatusType.EXECUTED, 'منفّذ', 'Executed')
    };
    return TradingOrderStatus;
}());
export { TradingOrderStatus };
//# sourceMappingURL=trading-order-status.js.map