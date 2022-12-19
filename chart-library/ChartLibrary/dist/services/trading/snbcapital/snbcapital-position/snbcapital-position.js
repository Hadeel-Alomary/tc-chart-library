import { StringUtils } from "../../../../utils/index";
var SnbcapitalPosition = (function () {
    function SnbcapitalPosition() {
    }
    SnbcapitalPosition.mapResponseToSnbcapitalPosition = function (response, name, symbol) {
        return {
            id: StringUtils.guid(),
            portfolioId: response.saCode,
            symbol: symbol,
            quantity: response.qty,
            freeQuantity: response.availableQty,
            cost: response.costValue / response.qty,
            name: name,
            averageCostPrice: response.AvgCostPrice,
            totalCost: response.costValue,
            blockedQuantity: response.blockedQtySell,
            currentPrice: 0,
            currentTotalCost: 0,
            costDiff: 0,
            costDiffPercent: 0,
        };
    };
    return SnbcapitalPosition;
}());
export { SnbcapitalPosition };
//# sourceMappingURL=snbcapital-position.js.map