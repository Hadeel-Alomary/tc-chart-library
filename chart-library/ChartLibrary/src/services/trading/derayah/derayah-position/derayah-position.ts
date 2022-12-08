import {StringUtils} from "../../../../utils/index";
import {DerayahPositionResponse} from '../../../loader/trading/derayah-loader/derayah-loader.service';

export class DerayahPosition{
    id:string;
    portfolio:string;
    derayahMarket:number;
    derayahSymbol:string;
    symbol:string;
    quantity:number;
    freeQuantity:number;
    cost:number;
    name:string;//NK we add this to enable company name inside wallet component
    totalCost:number;
    currentPrice:number;
    currentTotalCost:number;
    costDiff:number;
    perCostDiff:number;


    public static mapResponseToDerayahPosition(response:DerayahPositionResponse, name:string, symbol:string, portfolio:string):DerayahPosition{
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
    }

}
