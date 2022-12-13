import {TradestationPositionResponse} from '../../../loader/trading/tradestation/tradestation-loader.service';
import {TradestationOrderSideWrapper} from '../tradestation-order';
import {MarketGridData} from "../../../../data-types/types";

export class TradestationPosition implements MarketGridData {
    id: string;
    symbol: string;
    companyName:string;
    assetType: string;
    type: TradestationOrderSideWrapper;
    quantity: number;
    averagePrice: number;
    lastPrice: number;
    askPrice: number;
    bidPrice: number;
    marketValue: number;
    totalCost: number;
    profitLoss: number;
    profitLossPercent: number;
    profitLossQuantity: number;
    todaysProfitLoss: number;
    accountId: string;
    maintenanceMargin: number;
    date: string;
    margin: string;
    markToMarketPrice: number;

    public static mapResponseToTradestationPosition(response: TradestationPositionResponse,companyName:string,companySymbol:string): TradestationPosition {
        return {
            id: response.Key,
            symbol: companySymbol,
            companyName:companyName,
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
    }

}


