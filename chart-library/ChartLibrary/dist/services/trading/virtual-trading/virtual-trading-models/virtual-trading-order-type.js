var VirtualTradingOrderType = (function () {
    function VirtualTradingOrderType(value, arabic, english) {
        this.value = value;
        this.arabic = arabic;
        this.english = english;
    }
    VirtualTradingOrderType.fromValue = function (value) {
        switch (value) {
            case 'MANUAL':
                return VirtualTradingOrderType.allOrderTypes.MANUAL;
            case 'MARKET':
                return VirtualTradingOrderType.allOrderTypes.MARKET;
            case 'LIMIT':
                return VirtualTradingOrderType.allOrderTypes.LIMIT;
            case 'STOP':
                return VirtualTradingOrderType.allOrderTypes.STOP;
            default:
                return null;
        }
    };
    VirtualTradingOrderType.allTypes = function () {
        var result = [];
        for (var key in VirtualTradingOrderType.allOrderTypes) {
            result.push(VirtualTradingOrderType.allOrderTypes[key]);
        }
        return result;
    };
    VirtualTradingOrderType.allBuyTypes = function () {
        return [
            VirtualTradingOrderType.allOrderTypes.LIMIT,
            VirtualTradingOrderType.allOrderTypes.MARKET,
        ];
    };
    VirtualTradingOrderType.allSellTypes = function () {
        return [
            VirtualTradingOrderType.allOrderTypes.LIMIT,
            VirtualTradingOrderType.allOrderTypes.MARKET,
            VirtualTradingOrderType.allOrderTypes.STOP
        ];
    };
    VirtualTradingOrderType.allOrderTypes = {
        MANUAL: new VirtualTradingOrderType('MANUAL', 'يدوي', 'Manual'),
        MARKET: new VirtualTradingOrderType('MARKET', 'سعر السوق', 'Market Price'),
        LIMIT: new VirtualTradingOrderType('LIMIT', 'سعر محدد', 'Limit Price'),
        STOP: new VirtualTradingOrderType('STOP', 'توقف', 'Stop Loss')
    };
    return VirtualTradingOrderType;
}());
export { VirtualTradingOrderType };
//# sourceMappingURL=virtual-trading-order-type.js.map