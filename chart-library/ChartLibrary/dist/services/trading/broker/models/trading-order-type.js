import { TradestationOrderType } from '../../tradestation/tradestation-order';
export var TradingOrderType;
(function (TradingOrderType) {
    TradingOrderType[TradingOrderType["LIMIT"] = 1] = "LIMIT";
    TradingOrderType[TradingOrderType["MARKET"] = 2] = "MARKET";
    TradingOrderType[TradingOrderType["MANUAL"] = 3] = "MANUAL";
    TradingOrderType[TradingOrderType["STOP"] = 4] = "STOP";
    TradingOrderType[TradingOrderType["STOP_MARKET"] = 5] = "STOP_MARKET";
    TradingOrderType[TradingOrderType["STOP_LIMIT"] = 6] = "STOP_LIMIT";
})(TradingOrderType || (TradingOrderType = {}));
var TradingOrderTypeWrapper = (function () {
    function TradingOrderTypeWrapper(type, arabic, english) {
        this.type = type;
        this.arabic = arabic;
        this.english = english;
    }
    TradingOrderTypeWrapper.fromVirtualTradingOrderType = function (type) {
        switch (type.value) {
            case 'MANUAL':
                return TradingOrderTypeWrapper.allOrderTypes.MANUAL;
            case 'MARKET':
                return TradingOrderTypeWrapper.allOrderTypes.MARKET;
            case 'LIMIT':
                return TradingOrderTypeWrapper.allOrderTypes.LIMIT;
            case 'STOP':
                return TradingOrderTypeWrapper.allOrderTypes.STOP;
            default:
                return null;
        }
    };
    TradingOrderTypeWrapper.fromTradestationOrderType = function (type) {
        switch (type) {
            case TradestationOrderType.Market:
                return TradingOrderTypeWrapper.allOrderTypes.MARKET;
            case TradestationOrderType.Limit:
                return TradingOrderTypeWrapper.allOrderTypes.LIMIT;
            case TradestationOrderType.StopMarket:
                return TradingOrderTypeWrapper.allOrderTypes.STOP_MARKET;
            case TradestationOrderType.StopLimit:
                return TradingOrderTypeWrapper.allOrderTypes.STOP_LIMIT;
            default:
                return null;
        }
    };
    TradingOrderTypeWrapper.fromType = function (type) {
        switch (type) {
            case TradingOrderType.MANUAL:
                return TradingOrderTypeWrapper.allOrderTypes.MANUAL;
            case TradingOrderType.MARKET:
                return TradingOrderTypeWrapper.allOrderTypes.MARKET;
            case TradingOrderType.LIMIT:
                return TradingOrderTypeWrapper.allOrderTypes.LIMIT;
            case TradingOrderType.STOP:
                return TradingOrderTypeWrapper.allOrderTypes.STOP;
            default:
                return null;
        }
    };
    TradingOrderTypeWrapper.allOrderTypes = {
        MANUAL: new TradingOrderTypeWrapper(TradingOrderType.MANUAL, 'يدوي', 'Manual'),
        MARKET: new TradingOrderTypeWrapper(TradingOrderType.MARKET, 'سعر السوق', 'Market Price'),
        LIMIT: new TradingOrderTypeWrapper(TradingOrderType.LIMIT, 'سعر محدد', 'Limit Price'),
        STOP: new TradingOrderTypeWrapper(TradingOrderType.STOP, 'وقف خسارة', 'Stop Loss'),
        STOP_MARKET: new TradingOrderTypeWrapper(TradingOrderType.STOP_MARKET, 'وقف', 'Stop'),
        STOP_LIMIT: new TradingOrderTypeWrapper(TradingOrderType.STOP_LIMIT, 'وقف محدد', 'Stop Limit')
    };
    return TradingOrderTypeWrapper;
}());
export { TradingOrderTypeWrapper };
//# sourceMappingURL=trading-order-type.js.map