import { StringUtils } from "../../../../utils/index";
var DerayahPosition = (function () {
    function DerayahPosition() {
    }
    DerayahPosition.mapResponseToDerayahPosition = function (response, name, symbol, portfolio) {
        return {
            id: StringUtils.guid(),
            portfolio: portfolio,
            derayahSymbol: response.symbol,
            derayahMarket: response.exchangecode,
            symbol: symbol,
            quantity: response.quantity,
            freeQuantity: response.freeQuantity,
            cost: response.cost / response.quantity,
            name: name,
            totalCost: response.cost,
            currentPrice: 0,
            currentTotalCost: 0,
            costDiff: 0,
            perCostDiff: 0
        };
    };
    return DerayahPosition;
}());
export { DerayahPosition };
//# sourceMappingURL=derayah-position.js.map