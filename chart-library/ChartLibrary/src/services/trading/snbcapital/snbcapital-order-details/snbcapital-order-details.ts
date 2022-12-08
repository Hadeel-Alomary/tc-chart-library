import {SnbcapitalOrder} from '../snbcapital-order/index';
import {SnbcapitalDateTimeResponse, SnbcapitalOrderDetailsExecutionResponse, SnbcapitalOrderDetailsResponse} from '../../../loader/trading/snbcapital-loader/snbcapital-loader.service';
import {SnbcapitalPortfolio} from '../snbcapital-order';
import {SnbcapitalOrderStatus} from '../snbcapital-order/snbcapital-order-status';
import {SnbcapitalOrderExpiration} from '../snbcapital-order/snbcapital-order-expiration';

export class SnbcapitalOrderDetails{
    executions:SnbcapitalOrderDetailsAction[];
    order: SnbcapitalOrder;
    portfolioName:string;
    portfolioId: string;
    date:string;
    time:string;
    executionCondition:SnbcapitalOrderExpiration;
    expiryDate:string;
    price:number;
    quantity:number;
    minimumQuantity:number;
    announcedQuantity:number;
    commission:number;
    tax:number;
    orderValue:number;
    remainedQuantity:number;
    executedQuantity:number;
    avgPrice:number;
    executionValue:number;
    combinedCommission:number;
    executedTax:number;
    totalAmountExec:number;

    public static mapResponseToOrderDetails(response:SnbcapitalOrderDetailsResponse, order:SnbcapitalOrder ,portfolio:SnbcapitalPortfolio):SnbcapitalOrderDetails{
        let responseResult = response.order;
        let responseExecution = response.execList as SnbcapitalOrderDetailsExecutionResponse[];

        let executionList:SnbcapitalOrderDetailsAction[] = [];
        for(let exec of responseExecution){
            executionList.push(
                {
                    key: exec.keyope,
                    executionQuantity: exec.execQty,
                    price: exec.prc,
                    commission: exec.feesCACurr,
                    tax: exec.VATamt,
                    execValue: exec.totAmt,
                    status: SnbcapitalOrderStatus.getOrderStatus(exec.status),
                    execDate: this.getOrderDetailDate(exec.execDate),
                    reason:exec.causaleDesc?exec.causaleDesc.plain:null,
                }
            )
        }

        return {
            executions:executionList,
            order: order,
            portfolioName:portfolio.portfolioName,
            portfolioId:portfolio.portfolioId,
            date:order.date ? moment(order.date).format('YYYY-MM-DD'): '-',
            time:order.time ? order.time : '-',
            executionCondition:SnbcapitalOrderExpiration.getExpirationType(responseResult.timeParam , responseResult.qtyParam),
            expiryDate:this.getOrderDetailDate(responseResult.expiryDate),
            price:responseResult.limPrice,
            quantity:responseResult.orderQty,
            minimumQuantity:responseResult.minimumQty,
            announcedQuantity:responseResult.disclosedQty,
            commission:responseResult.estimatedComm.commItem.total,
            tax:responseResult.VATamt,
            orderValue:responseResult.amount,
            remainedQuantity:responseResult.remainingQty,
            executedQuantity:responseResult.execQty,
            avgPrice:responseResult.avgPrcExec,
            executionValue:responseResult.execAmt,
            combinedCommission:responseResult.VATamtCharged,
            executedTax:responseResult.chargedComm.commItem.total,
            totalAmountExec:responseResult.totAmtExec,
        };
    }

    private static getOrderDetailDate(date: SnbcapitalDateTimeResponse): string {
        if (date == null) {
            return null;
        }
        if(date.isnull){
            return null
        }

        return `${date.year}-${date.month}-${date.day}  ${date.hour}:${date.minute}:${date.second}`;
    }

}

export interface SnbcapitalOrderDetailsAction {
        key: number,
        executionQuantity: number,
        price: number,
        commission: number,
        tax: number,
        execValue: number,
        status: SnbcapitalOrderStatus
        execDate: string,
        reason:string
}
