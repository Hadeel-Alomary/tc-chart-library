import { Tc } from '../../../../utils';
export var TradestationOrderType;
(function (TradestationOrderType) {
    TradestationOrderType["Market"] = "Market";
    TradestationOrderType["Limit"] = "Limit";
    TradestationOrderType["StopMarket"] = "StopMarket";
    TradestationOrderType["StopLimit"] = "StopLimit";
})(TradestationOrderType || (TradestationOrderType = {}));
var TradestationOrderTypeWrapper = (function () {
    function TradestationOrderTypeWrapper(type, arabic, english) {
        this.type = type;
        this.arabic = arabic;
        this.english = english;
    }
    TradestationOrderTypeWrapper.getOrderTypes = function () {
        if (!TradestationOrderTypeWrapper.allTypes) {
            TradestationOrderTypeWrapper.allTypes = [];
            TradestationOrderTypeWrapper.allTypes.push(new TradestationOrderTypeWrapper(TradestationOrderType.Market, 'سعر السوق', 'Market Price'));
            TradestationOrderTypeWrapper.allTypes.push(new TradestationOrderTypeWrapper(TradestationOrderType.Limit, 'سعر محدد', 'Limit Price'));
            TradestationOrderTypeWrapper.allTypes.push(new TradestationOrderTypeWrapper(TradestationOrderType.StopMarket, 'وقف سوق', 'Stop Market'));
            TradestationOrderTypeWrapper.allTypes.push(new TradestationOrderTypeWrapper(TradestationOrderType.StopLimit, 'وقف سعر', 'Stop Limit'));
        }
        return TradestationOrderTypeWrapper.allTypes;
    };
    TradestationOrderTypeWrapper.fromValue = function (type) {
        var orderType = TradestationOrderTypeWrapper.getOrderTypes().find(function (item) { return item.type == type; });
        if (!orderType) {
            Tc.error('Wrong order type');
            return null;
        }
        return orderType;
    };
    return TradestationOrderTypeWrapper;
}());
export { TradestationOrderTypeWrapper };
//# sourceMappingURL=tradestation-order-type-wrapper.js.map