import { TradestationOrderSideType } from '../../tradestation/tradestation-order';
export var TradingOrderSideType;
(function (TradingOrderSideType) {
    TradingOrderSideType[TradingOrderSideType["BUY"] = 1] = "BUY";
    TradingOrderSideType[TradingOrderSideType["SELL"] = 2] = "SELL";
    TradingOrderSideType[TradingOrderSideType["BUY_TO_COVER"] = 3] = "BUY_TO_COVER";
    TradingOrderSideType[TradingOrderSideType["SELL_SHORT"] = 4] = "SELL_SHORT";
})(TradingOrderSideType || (TradingOrderSideType = {}));
var TradingOrderSide = (function () {
    function TradingOrderSide(type, arabic, english) {
        this.type = type;
        this.arabic = arabic;
        this.english = english;
    }
    TradingOrderSide.fromVirtualTradingOrderSide = function (side) {
        switch (side.value) {
            case 'BUY':
                return TradingOrderSide.allOrderSides.BUY;
            case 'SELL':
                return TradingOrderSide.allOrderSides.SELL;
            default:
                return null;
        }
    };
    TradingOrderSide.fromTradestationOrderSide = function (side) {
        switch (side.value) {
            case TradestationOrderSideType.Buy:
                return TradingOrderSide.allOrderSides.BUY;
            case TradestationOrderSideType.Sell:
                return TradingOrderSide.allOrderSides.SELL;
            case TradestationOrderSideType.BuyToCover:
                return TradingOrderSide.allOrderSides.BUY_TO_COVER;
            case TradestationOrderSideType.SellShort:
                return TradingOrderSide.allOrderSides.SELL_SHORT;
            default:
                return null;
        }
    };
    TradingOrderSide.fromType = function (type) {
        switch (type) {
            case TradingOrderSideType.BUY:
                return TradingOrderSide.allOrderSides.BUY;
            case TradingOrderSideType.SELL:
                return TradingOrderSide.allOrderSides.SELL;
            default:
                return null;
        }
    };
    TradingOrderSide.allOrderSides = {
        BUY: new TradingOrderSide(TradingOrderSideType.BUY, 'شراء', 'Buy'),
        SELL: new TradingOrderSide(TradingOrderSideType.SELL, 'بيع', 'Sell'),
        BUY_TO_COVER: new TradingOrderSide(TradingOrderSideType.BUY_TO_COVER, 'شراء على المكشوف', 'Buy to Cover'),
        SELL_SHORT: new TradingOrderSide(TradingOrderSideType.SELL_SHORT, 'بيع على المكشوف', 'Sell Short'),
    };
    return TradingOrderSide;
}());
export { TradingOrderSide };
//# sourceMappingURL=trading-order-side.js.map