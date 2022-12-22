import {StringUtils} from '../../../../utils';
import {TradestationBalanceResponse, ClosedPositionResponse} from '../../../loader/trading/tradestation/tradestation-loader.service';
import {Market} from '../../../loader';
import {TradestationUtils} from '../../../../utils/tradestation.utils';

export interface TradestationClosedPosition {
    closedPosition: ClosedPositionResponse,
    name: string
}

export class TradestationBalance {
    id: string;
    name: string;
    type: string;
    accountBalance: number;
    equity: number;
    costOfPosition: number;
    realizedProfitLoss: number;
    unRealizedProfitLoss: number;
    overnightBuyingPower: number;
    dayTradingMarginableEquitiesBuyingPower: number;
    dayTradingQualified: boolean;
    dayTrades: number;
    bodAccountBalance: number;
    bodEquity: number;
    unsettledFund: number;
    bodOvernightBuyingPower: number;
    bodDayTradingMarginableEquitiesBuyingPower: number;
    realTimeBuyingPower: number;
    closedPosition: TradestationClosedPosition[];
    unClearedDeposit: number;
    statusDescription: string;
    patternDayTrader: boolean;

    public static mapResponseToTradestationBalance(response: TradestationBalanceResponse , market: Market): TradestationBalance {
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
            dayTrades:response.DayTrades,
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
    }

    private static getClosedPositionWithCompanyName(ClosedPositions: ClosedPositionResponse[], market: Market): TradestationClosedPosition[] {
        let positions: TradestationClosedPosition[] = [];
        for (let position of ClosedPositions) {
            let symbol: string = TradestationUtils.getSymbolWithMarketFromTradestation(position.Symbol);
            let companyName = market.getCompany(symbol).name;
            positions.push({closedPosition: position, name: companyName});
        }
        return positions;
    }
}
