import {DerayahOrderExecution, DerayahOrderExecutionType} from './derayah-order-execution';
import {DerayahOrderExpiration, DerayahOrderExpirationType} from './derayah-order-expiration';
import {DerayahOrderStatus, DerayahOrderStatusType} from './derayah-order-status';
import {DerayahOrderTypeWrapper, DerayahOrderType} from './derayah-order-type';
import {DerayahPosition} from "../derayah-position/derayah-position";
import {DerayahOrderLastActionStatus, DerayahOrderLastActionStatusType} from './derayah-order-last-action-status';
import {DerayahOrderDetails} from '../derayah-order-details/index';
import {MarketUtils, DerayahUtils} from '../../../../utils/index';
import {DerayahOrders} from "../../../../services/loader/trading/derayah-loader/derayah-loader.service";
import {MarketGridData} from "../../../../data-types/types";

export class DerayahOrder implements MarketGridData {

    constructor(
        public id:string,
        public type:DerayahOrderTypeWrapper,
        public portfolio:string,
        public derayahSymbol:string,
        public derayahMarket:number,
        public symbol:string,
        public name:string,
        public date:string,
        public execution:DerayahOrderExecution,
        public quantity:number,
        public discloseQuantity:number,
        public executedQuantity:number,
        public price:number,
        public expiration:DerayahOrderExpiration,
        public status:DerayahOrderStatus,
        public lastActionStatus:DerayahOrderLastActionStatus
    ){}

    public static newOrder(type:DerayahOrderType, symbol:string, portfolio:string, companyName:string, nomu:boolean):DerayahOrder{
        return new DerayahOrder(
            null,
            DerayahOrderTypeWrapper.fromType(type),
            portfolio,
            MarketUtils.symbolWithoutMarket(symbol),
            nomu ? 98 : 99,
            symbol,
            companyName,
            moment().format(),
            DerayahOrderExecution.getExecutionByType(DerayahOrderExecutionType.Limit),
            0,
            0,
            0,
            0,
            DerayahOrderExpiration.getOrderExpirationByType(DerayahOrderExpirationType.Day),
            DerayahOrderStatus.getStatusByType(DerayahOrderStatusType.New),
            DerayahOrderLastActionStatus.getStatusByType(DerayahOrderLastActionStatusType.FetchedToBeSentToExchangeCode)
        );
    }

    public static fromPosition(position:DerayahPosition, companyName:string, nomu:boolean):DerayahOrder{
        return new DerayahOrder(
            null,
            DerayahOrderTypeWrapper.fromType(DerayahOrderType.Sell),
            position.portfolio,
            MarketUtils.symbolWithoutMarket(position.symbol),
            nomu ? 98 : 99,
            position.symbol,
            companyName,
            moment().format(),
            DerayahOrderExecution.getExecutionByType(DerayahOrderExecutionType.Limit),
            position.freeQuantity,
            0,
            position.quantity - position.freeQuantity,
            0,
            DerayahOrderExpiration.getOrderExpirationByType(DerayahOrderExpirationType.Day),
            DerayahOrderStatus.getStatusByType(DerayahOrderStatusType.New),
            DerayahOrderLastActionStatus.getStatusByType(DerayahOrderLastActionStatusType.FetchedToBeSentToExchangeCode)
        )
    }

    public static updateOrderWithOrderDetails(order:DerayahOrder, orderDetails:DerayahOrderDetails){
        order.type = DerayahOrderTypeWrapper.getDerayahOrderTypeAsString(orderDetails.orderSide);
        order.portfolio = orderDetails.portfolio;
        order.derayahSymbol = orderDetails.symbol;
        order.derayahMarket = orderDetails.exchangeCode;
        order.symbol = DerayahUtils.getSymbolWithMarketFromDerayah(order.derayahMarket, order.derayahSymbol);
        order.date = moment(orderDetails.date, 'MM/DD/YYYY').format('YYYY-MM-DD');
        order.execution = DerayahOrderExecution.getExecutionByTypeAsString(orderDetails.executionType);
        order.quantity = +orderDetails.quantity;
        order.discloseQuantity = orderDetails.discloseQuantity ? +orderDetails.discloseQuantity : 0;
        order.executedQuantity = +((+orderDetails.quantity) - (+orderDetails.remainedQuantity));
        order.price = +orderDetails.requestedPrice;
        order.expiration = DerayahOrderExpiration.getOrderExpirationByTypeAsString(orderDetails.validTill);
        order.expiration.tillDate =  orderDetails.validTillDate;
        order.status = DerayahOrderStatus.getStatusByTypeAsString(orderDetails.orderStatus);
        order.lastActionStatus = DerayahOrderLastActionStatus.getStatusByServerName(orderDetails.actions[orderDetails.actions.length - 1].actionStatus);
    }

    public static mapResponseToDerayahOrder(response:DerayahOrders, companyName:string, companySymbol:string, portfolio:string):DerayahOrder{
        return {
            id: response.orderId.toString(),
            type: DerayahOrderTypeWrapper.getDerayahOrderTypeAsString(response.side),
            portfolio: portfolio,
            derayahSymbol: response.symbol,
            derayahMarket: response.exchangeCode,
            symbol: companySymbol,
            name: companyName,
            date: response.orderDate,
            execution: DerayahOrderExecution.getExecutionByTypeAsString(response.executionType),
            quantity: +response.quantity,
            discloseQuantity: response.disclosequantity ? response.disclosequantity : 0,
            executedQuantity: response.executedQuantity,
            price: +response.price,
            expiration: null,
            status: DerayahOrderStatus.getStatusByTypeAsString(response.status),
            lastActionStatus: DerayahOrderLastActionStatus.getStatusByServerName(response.lastActionStatus)
        }
    }

    public static canEditOrder(order:DerayahOrder):boolean{
        let editableStatus:boolean = DerayahOrderStatus.editableStatus(order.status.type);

        if(!editableStatus){
            return false;
        }

        if( order.status.type == DerayahOrderStatusType.New &&
            order.lastActionStatus.type != DerayahOrderLastActionStatusType.NotSentToExchangeCode){
            return false;
        }

        if([DerayahOrderLastActionStatusType.AcknowledgeAfterFetch, DerayahOrderLastActionStatusType.FetchedToBeSentToExchangeCode].indexOf(order.lastActionStatus.type) !== -1){
            return false;
        }

        if(DerayahOrder.canRevertOrder(order)) {
            return false;
        }

        return true;
    }

    public static canRevertOrder(order:DerayahOrder):boolean{

        return order.lastActionStatus.type == DerayahOrderLastActionStatusType.NotSentToExchangeCode &&
                [DerayahOrderStatusType.Open,
                    DerayahOrderStatusType.DefaultOpen,
                    DerayahOrderStatusType.PartiallyExecuted].indexOf(order.status.type) !== -1
    }

}
