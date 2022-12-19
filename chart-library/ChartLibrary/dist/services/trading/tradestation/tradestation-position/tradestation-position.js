import { TradestationOrderSideWrapper } from '../tradestation-order';
var TradestationPosition = (function () {
    function TradestationPosition() {
    }
    TradestationPosition.mapResponseToTradestationPosition = function (response, companyName, companySymbol) {
        return {
            id: response.Key,
            symbol: companySymbol,
            companyName: companyName,
            assetType: response.AssetType,
            type: TradestationOrderSideWrapper.fromPosition(response.LongShort),
            quantity: response.Quantity,
            averagePrice: response.AveragePrice,
            lastPrice: response.LastPrice,
            askPrice: response.AskPrice,
            bidPrice: response.BidPrice,
            marketValue: response.MarketValue,
            totalCost: response.TotalCost,
            profitLoss: response.OpenProfitLoss,
            profitLossPercent: response.OpenProfitLossPercent,
            profitLossQuantity: response.OpenProfitLossQty,
            todaysProfitLoss: response.TodaysProfitLoss,
            accountId: response.AccountID,
            maintenanceMargin: response.MaintenanceMargin,
            date: moment(response.TimeStamp).format('YYYY-MM-DD'),
            margin: response.InitialMargin,
            markToMarketPrice: response.MarkToMarketPrice
        };
    };
    return TradestationPosition;
}());
export { TradestationPosition };
//# sourceMappingURL=tradestation-position.js.map