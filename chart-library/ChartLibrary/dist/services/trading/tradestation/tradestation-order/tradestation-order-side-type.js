import { Tc } from '../../../../utils';
export var TradestationOrderSideType;
(function (TradestationOrderSideType) {
    TradestationOrderSideType["Buy"] = "Buy";
    TradestationOrderSideType["BuyToCover"] = "Buy to Cover";
    TradestationOrderSideType["SellShort"] = "Sell Short";
    TradestationOrderSideType["Sell"] = "Sell";
})(TradestationOrderSideType || (TradestationOrderSideType = {}));
var TradestationOrderSideWrapper = (function () {
    function TradestationOrderSideWrapper(value, arabic, english) {
        this.value = value;
        this.arabic = arabic;
        this.english = english;
    }
    TradestationOrderSideWrapper.fromValue = function (value) {
        switch (value) {
            case TradestationOrderSideType.Buy:
                return TradestationOrderSideWrapper.allTypes.BUY;
            case TradestationOrderSideType.Sell:
                return TradestationOrderSideWrapper.allTypes.SELL;
            case TradestationOrderSideType.BuyToCover:
                return TradestationOrderSideWrapper.allTypes.BuyToCover;
            case TradestationOrderSideType.SellShort:
                return TradestationOrderSideWrapper.allTypes.SellShort;
            default:
                Tc.error("unknown type " + value);
        }
    };
    TradestationOrderSideWrapper.fromPosition = function (value) {
        switch (value) {
            case 'Long':
                return TradestationOrderSideWrapper.allTypes.BUY;
            case 'Short':
                return TradestationOrderSideWrapper.allTypes.SellShort;
            default:
                Tc.error("unknown type " + value);
        }
    };
    TradestationOrderSideWrapper.allTypes = {
        BUY: new TradestationOrderSideWrapper(TradestationOrderSideType.Buy, 'شراء', 'Buy'),
        BuyToCover: new TradestationOrderSideWrapper(TradestationOrderSideType.BuyToCover, 'الشراء للتغطية', 'Buy to Cover'),
        SELL: new TradestationOrderSideWrapper(TradestationOrderSideType.Sell, 'بيع', 'Sell'),
        SellShort: new TradestationOrderSideWrapper(TradestationOrderSideType.SellShort, 'بيع على المكشوف', 'Sell Short'),
    };
    return TradestationOrderSideWrapper;
}());
export { TradestationOrderSideWrapper };
//# sourceMappingURL=tradestation-order-side-type.js.map