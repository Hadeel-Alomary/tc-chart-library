import {DerayahOrder} from '../derayah-order/index';
import {DerayahHttpResponse, DerayahDetailsOrderAction, DerayahDetailsOrderResponse, DerayahDetailsOrderResult} from '../../../loader/trading/derayah-loader/derayah-loader.service';

export class DerayahOrderDetails{
    averagePrice:number;
    collectedFees:number;
    date:string;
    dealAmount:number;
    estimatedFees:number;
    exchangeCode:number;
    executedAmount:number;
    executionType:number;
    fillType:number;
    filledQuantity:number;
    minQuantity:number;
    netAmount:number;
    netAmountAccountCurrency:number;
    orderSide:number;
    orderStatus:number;
    portfolio:string;
    quantity:number;
    remainedQuantity:number;
    requestedPrice:number;
    discloseQuantity:number;
    stopPrice:number;
    symbol:string;
    userID:string;
    validTill:number;
    validTillDate:string;
    blockedAmount:number;
    cashAccountName:string;
    vat:number;
    vatId:string;
    executionVat:number;
    actions:DerayahOrderDetailsAction[];
    order:DerayahOrder;// NK added by me


    public static mapResponseToOrderDetails(response:DerayahHttpResponse, order:DerayahOrder):DerayahOrderDetails{
        let data = response.data as DerayahDetailsOrderResponse;
        let responseResult =  data.result as DerayahDetailsOrderResult;
        let responseActions = data.actions as DerayahDetailsOrderAction[];

        let actions:DerayahOrderDetailsAction[] = [];
        for(let action of responseActions){
            actions.push(
                {
                    actionDate:action.actiondate,
                    actionStatus: action.actionstatus,
                    actionType: action.actiontype,
                    dealQuantity: action.dealquantity,
                    fees: action.fees,
                    lastUpdate: action.lastupdated,
                    netDealAmount: action.netdealamount,
                    orderType: action.orderside,
                    rejectionCode: action.rejectioncode,
                    sequenceNumber: action.sequencenumber,
                    validTill: +action.validtill,
                    price: action.price,
                    vat: action.vat
                }
            )
        }

        return {
            actions : actions,
            averagePrice : responseResult.averagePrice,
            collectedFees : responseResult.feesCollected,
            date : responseResult.orderDate,
            dealAmount : responseResult.estimatedAmount,
            estimatedFees : responseResult.estimatedFee,
            exchangeCode : responseResult.exchangeCode,
            executedAmount : responseResult.executionAmount,
            executionType : responseResult.executionType,
            fillType : responseResult.fillType,
            filledQuantity : responseResult.filledQuantity,
            minQuantity : responseResult.minQuantity,
            netAmount : responseResult.netAmount,
            netAmountAccountCurrency : responseResult.netAmountInAcctCurrency,
            orderSide : responseResult.side,
            orderStatus : responseResult.orderstatus,
            portfolio : responseResult.portfolio,
            quantity : responseResult.quantity,
            remainedQuantity : responseResult.remainingQuantity,
            symbol : responseResult.symbol,
            userID : responseResult.userId,
            validTill : responseResult.validTill,
            validTillDate : responseResult.validTillDate,
            requestedPrice: responseResult.price,
            stopPrice: responseResult.stopPrice,
            discloseQuantity: responseResult.discloseQuantity,
            blockedAmount: responseResult.blockedAmount,
            cashAccountName: responseResult.cashAccountName,
            vat: responseResult.vatAmountEqu,
            vatId: responseResult.vatIdNo,
            executionVat: responseResult.execVAT,
            order: order
        };
    }

}

export interface DerayahOrderDetailsAction{
    actionDate:string;
    actionStatus:string;
    actionType:number;
    dealQuantity:number;
    fees:number;
    lastUpdate:string;
    netDealAmount:number;
    orderType:number;
    price:number;
    rejectionCode:number;
    sequenceNumber:string;
    validTill:number;
    vat:number;
}
