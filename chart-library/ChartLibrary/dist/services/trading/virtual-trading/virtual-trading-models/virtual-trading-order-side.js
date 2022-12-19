var VirtualTradingOrderSide = (function () {
    function VirtualTradingOrderSide(value, arabic, english) {
        this.value = value;
        this.arabic = arabic;
        this.english = english;
    }
    VirtualTradingOrderSide.fromValue = function (value) {
        switch (value) {
            case 'BUY':
                return VirtualTradingOrderSide.allOrderSides.BUY;
            case 'SELL':
                return VirtualTradingOrderSide.allOrderSides.SELL;
            default:
                return null;
        }
    };
    VirtualTradingOrderSide.allSides = function () {
        return [
            VirtualTradingOrderSide.allOrderSides.BUY,
            VirtualTradingOrderSide.allOrderSides.SELL
        ];
    };
    VirtualTradingOrderSide.allOrderSides = {
        BUY: new VirtualTradingOrderSide('BUY', 'شراء', 'Buy'),
        SELL: new VirtualTradingOrderSide('SELL', 'بيع', 'Sell'),
    };
    return VirtualTradingOrderSide;
}());
export { VirtualTradingOrderSide };
//# sourceMappingURL=virtual-trading-order-side.js.map