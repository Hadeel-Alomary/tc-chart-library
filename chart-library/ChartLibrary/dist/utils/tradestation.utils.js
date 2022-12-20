var TradestationUtils = (function () {
    function TradestationUtils() {
    }
    TradestationUtils.getSymbolWithMarketFromTradestation = function (TradestationSymbol) {
        return TradestationSymbol + ".USA";
    };
    TradestationUtils.getAllowedMarketsAbbreviations = function () {
        return ["USA"];
    };
    return TradestationUtils;
}());
export { TradestationUtils };
//# sourceMappingURL=tradestation.utils.js.map