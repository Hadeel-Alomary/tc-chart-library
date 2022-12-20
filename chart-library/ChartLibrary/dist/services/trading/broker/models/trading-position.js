import { BrokerType } from '../broker';
var TradingPosition = (function () {
    function TradingPosition() {
    }
    TradingPosition.fromVirtualTradingPositions = function (virtualTradingPositions) {
        var tradingPositions = [];
        for (var _i = 0, virtualTradingPositions_1 = virtualTradingPositions; _i < virtualTradingPositions_1.length; _i++) {
            var position = virtualTradingPositions_1[_i];
            tradingPositions.push({
                id: "" + position.id,
                brokerType: BrokerType.VirtualTrading,
                symbol: position.symbol,
                averagePrice: position.averagePrice,
                quantity: position.quantity,
                totalCost: position.totalCost,
                currentTotalCost: position.currentTotalCost
            });
        }
        return tradingPositions;
    };
    TradingPosition.fromTradestationPositions = function (tradestationPosition) {
        var tradingPositions = [];
        for (var _i = 0, tradestationPosition_1 = tradestationPosition; _i < tradestationPosition_1.length; _i++) {
            var position = tradestationPosition_1[_i];
            tradingPositions.push({
                id: "" + position.id,
                brokerType: BrokerType.Tradestation,
                symbol: position.symbol,
                averagePrice: position.averagePrice,
                quantity: position.quantity,
                profitLoss: position.profitLoss,
            });
        }
        return tradingPositions;
    };
    return TradingPosition;
}());
export { TradingPosition };
//# sourceMappingURL=trading-position.js.map