import { Tc } from './tc.utils';
var DerayahUtils = (function () {
    function DerayahUtils() {
    }
    DerayahUtils.getSymbolWithMarketFromDerayah = function (derayahMarket, derayahSymbol) {
        var market = DerayahUtils.getMarketAbbreviationFromDerayahMarket(derayahMarket);
        return derayahSymbol + "." + market;
    };
    DerayahUtils.getAllowedMarketsAbbreviations = function () {
        return ["TAD"];
    };
    DerayahUtils.getMarketAbbreviationFromDerayahMarket = function (market) {
        switch (market) {
            case 99:
            case 98:
                return 'TAD';
            default:
                Tc.error('Unknown derayah market ' + market);
        }
    };
    return DerayahUtils;
}());
export { DerayahUtils };
//# sourceMappingURL=derayah.utils.js.map