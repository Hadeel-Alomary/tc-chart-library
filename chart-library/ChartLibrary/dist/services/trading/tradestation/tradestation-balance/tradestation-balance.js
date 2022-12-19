import { StringUtils } from '../../../../utils';
import { TradestationUtils } from '../../../../utils/tradestation.utils';
var TradestationBalance = (function () {
    function TradestationBalance() {
    }
    TradestationBalance.mapResponseToTradestationBalance = function (response, market) {
        return {
            id: StringUtils.guid(),
            name: response.DisplayName,
            type: response.Type,
            accountBalance: response.RealTimeAccountBalance,
            equity: response.RealTimeEquity,
            costOfPosition: response.RealTimeCostOfPositions,
            realizedProfitLoss: response.RealTimeRealizedProfitLoss,
            unRealizedProfitLoss: response.RealTimeUnrealizedProfitLoss,
            overnightBuyingPower: response.RealTimeOvernightBuyingPower,
            closedPosition: TradestationBalance.getClosedPositionWithCompanyName(response.ClosedPositions, market),
            dayTradingQualified: response.DayTradingQualified,
            dayTrades: response.DayTrades,
            bodAccountBalance: response.BODAccountBalance,
            bodEquity: response.BODEquity,
            unsettledFund: response.UnsettledFund,
            bodOvernightBuyingPower: response.BODOvernightBuyingPower,
            bodDayTradingMarginableEquitiesBuyingPower: response.BODDayTradingMarginableEquitiesBuyingPower,
            realTimeBuyingPower: response.RealTimeBuyingPower,
            dayTradingMarginableEquitiesBuyingPower: response.RealTimeDayTradingMarginableEquitiesBuyingPower,
            unClearedDeposit: response.UnclearedDeposit,
            statusDescription: response.StatusDescription,
            patternDayTrader: response.PatternDayTrader
        };
    };
    TradestationBalance.getClosedPositionWithCompanyName = function (ClosedPositions, market) {
        var positions = [];
        for (var _i = 0, ClosedPositions_1 = ClosedPositions; _i < ClosedPositions_1.length; _i++) {
            var position = ClosedPositions_1[_i];
            var symbol = TradestationUtils.getSymbolWithMarketFromTradestation(position.Symbol);
            var companyName = market.getCompany(symbol).name;
            positions.push({ closedPosition: position, name: companyName });
        }
        return positions;
    };
    return TradestationBalance;
}());
export { TradestationBalance };
//# sourceMappingURL=tradestation-balance.js.map