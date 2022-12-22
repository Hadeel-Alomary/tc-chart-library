import {VirtualTradingPosition} from '../../virtual-trading/virtual-trading-models';
import {TradestationPosition} from '../../tradestation/tradestation-position/tradestation-position';
import {BrokerType} from '../broker';

export class TradingPosition {
    id: string;
    brokerType:BrokerType;
    symbol: string;
    quantity: number;
    averagePrice: number;
    totalCost?: number;
    currentTotalCost?: number;
    profitLoss?:number;

    public static fromVirtualTradingPositions(virtualTradingPositions: VirtualTradingPosition[]): TradingPosition[] {
        let tradingPositions: TradingPosition[] = [];
        for(let position of virtualTradingPositions) {
            tradingPositions.push({
                id: `${position.id}`,
                brokerType:BrokerType.VirtualTrading,
                symbol: position.symbol,
                averagePrice: position.averagePrice,
                quantity: position.quantity,
                totalCost: position.totalCost,
                currentTotalCost: position.currentTotalCost
            })
        }
        return tradingPositions;
    }


    public static fromTradestationPositions(tradestationPosition: TradestationPosition[]): TradingPosition[] {
        let tradingPositions: TradingPosition[] = [];
        for(let position of tradestationPosition) {
            tradingPositions.push({
                id: `${position.id}`,
                brokerType:BrokerType.Tradestation,
                symbol: position.symbol,
                averagePrice: position.averagePrice,
                quantity: position.quantity,
                profitLoss: position.profitLoss,
            })
        }
        return tradingPositions;
    }
}
