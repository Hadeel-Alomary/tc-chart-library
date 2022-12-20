var VirtualTradingPosition = (function () {
    function VirtualTradingPosition() {
    }
    VirtualTradingPosition.mapResponseToVirtualTradingPositions = function (response) {
        var result = [];
        for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
            var responseObject = response_1[_i];
            var company = null;
            result.push({
                id: responseObject.id.toString(),
                accountId: responseObject.trading_account_id,
                market: null,
                symbol: responseObject.symbol + "." + responseObject.market,
                name: null,
                averagePrice: +responseObject.average_price,
                quantity: +responseObject.quantity,
                currentPrice: 0,
                currentTotalCost: 0,
                totalCost: +responseObject.average_price * +responseObject.quantity,
                costDiff: 0,
                freeQuantity: +responseObject.free_quantity,
            });
        }
        return result;
    };
    return VirtualTradingPosition;
}());
export { VirtualTradingPosition };
//# sourceMappingURL=virtual-trading-position.js.map