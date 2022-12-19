import { ArrayUtils } from '../../../../utils';
export var TradestationTrailingStopType;
(function (TradestationTrailingStopType) {
    TradestationTrailingStopType[TradestationTrailingStopType["StopPrice"] = 0] = "StopPrice";
    TradestationTrailingStopType[TradestationTrailingStopType["TrailingAmount"] = 1] = "TrailingAmount";
    TradestationTrailingStopType[TradestationTrailingStopType["TrailingPercent"] = 2] = "TrailingPercent";
})(TradestationTrailingStopType || (TradestationTrailingStopType = {}));
var TradestationTrailingStop = (function () {
    function TradestationTrailingStop(type, arabic, english) {
        this.type = type;
        this.arabic = arabic;
        this.english = english;
    }
    TradestationTrailingStop.getAllTrailingStopTypes = function () {
        return ArrayUtils.values(TradestationTrailingStop.trailingStopTypes);
    };
    TradestationTrailingStop.getDefaultTrailingStopType = function () {
        return ArrayUtils.values(TradestationTrailingStop.trailingStopTypes)[0];
    };
    TradestationTrailingStop.getTrailingStopType = function (type) {
        return TradestationTrailingStop.getAllTrailingStopTypes().find(function (item) { return item.type == type; });
    };
    TradestationTrailingStop.trailingStopTypes = {
        StopPrice: new TradestationTrailingStop(TradestationTrailingStopType.StopPrice, 'سعر الوقف', 'Stop Price'),
        TrailingAmount: new TradestationTrailingStop(TradestationTrailingStopType.TrailingAmount, 'وقف متحرك', 'Trailing Amount'),
        TrailingPercent: new TradestationTrailingStop(TradestationTrailingStopType.TrailingPercent, '  وقف متحرك %', 'Trailing Amount %')
    };
    return TradestationTrailingStop;
}());
export { TradestationTrailingStop };
//# sourceMappingURL=tradestation-trailing-stop.js.map