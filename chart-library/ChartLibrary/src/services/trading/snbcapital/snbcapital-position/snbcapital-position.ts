import {StringUtils} from "../../../../utils/index";
import {SnbcapitalHoldingPositionResponse} from '../../../loader/trading/snbcapital-loader/snbcapital-loader.service';

export class SnbcapitalPosition{
    id:string;
    portfolioId:string;
    symbol:string;
    quantity:number;
    freeQuantity:number;
    cost:number;
    name:string;//NK we add this to enable company name inside wallet component
    averageCostPrice: number;
    totalCost: number;
    blockedQuantity: number;
    currentPrice: number;
    currentTotalCost: number;
    costDiff:number;
    costDiffPercent:number;


    public static mapResponseToSnbcapitalPosition(response:SnbcapitalHoldingPositionResponse, name: string ,symbol:string):SnbcapitalPosition{
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
    }

}
