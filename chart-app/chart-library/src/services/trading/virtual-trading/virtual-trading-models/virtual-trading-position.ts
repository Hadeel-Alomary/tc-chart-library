import {Market,} from '../../../loader';
import {VirtualTradingPositionResponse} from '../../../loader/trading/virtual-trading';
import {MarketGridData} from "../../../../data-types/types";

export class VirtualTradingPosition implements MarketGridData{
    id: string;
    accountId: number;
    market: Market;
    symbol: string;
    name: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    currentTotalCost: number;
    totalCost: number;
    costDiff: number;
    freeQuantity: number;

    public static mapResponseToVirtualTradingPositions(response: VirtualTradingPositionResponse[]): VirtualTradingPosition[] {
        let result: VirtualTradingPosition[] = [];
        for (let responseObject of response) {
            let company = null;
            // let company = marketsManager.getCompanyBySymbol(`${responseObject.symbol}.${responseObject.market}`);
            result.push({
                id: responseObject.id.toString(),
                accountId: responseObject.trading_account_id,
                market:null,
                // market: marketsManager.getMarketByAbbreviation(responseObject.market),
                symbol: `${responseObject.symbol}.${responseObject.market}`,
                // name: company.name,
                name:null,
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
    }

}
