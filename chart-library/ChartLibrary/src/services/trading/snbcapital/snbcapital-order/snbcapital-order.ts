import {SnbcapitalOrderStatus, SnbcapitalOrderStatusType} from './snbcapital-order-status';
import {SnbcapitalOrderType, SnbcapitalOrderTypeWrapper} from './snbcapital-order-type';
import {SnbcapitalPosition} from "../snbcapital-position/snbcapital-position";
import {SnbcapitalOrderDetails} from '../snbcapital-order-details/index';
import {SnbcapitalDateTimeResponse, SnbcapitalOrderListResponse,} from '../../../loader/trading/snbcapital-loader/snbcapital-loader.service';
import {MarketGridData} from '../../../../components/shared/grid-box/market-box';
import {SnbcapitalOrderExecution, SnbcapitalOrderExecutionType} from './snbcapital-order-execution';
import {SnbcapitalPortfolio} from './snbcapital-portfolio';
import {SnbcapitalOrderExpiration, SnbcapitalOrderExpirationType} from './snbcapital-order-expiration';

export class SnbcapitalOrder implements MarketGridData {

    constructor(
        public id:string,
        public symbol:string,
        public name: string,
        public gpsOrderNumber:string,
        public price: number,
        public quantity: number,
        public qtyParam: number,
        public minimumQuantity: number,
        public executedQuantity: number,
        public remainingQuantity: number,
        public discloseQuantity: number,
        public portfolioId: string,
        public isOpen: boolean,
        public canBeRevoked: boolean,
        public quantityCanBeChanged: boolean,
        public priceCanBeModified: boolean,
        public expiryDateCanBeModified: boolean,
        public status: SnbcapitalOrderStatus,
        public execution: SnbcapitalOrderExecution,
        public type: SnbcapitalOrderTypeWrapper,
        public timeParameter: number,
        public date: string,
        public time: string,
        public expiration: SnbcapitalOrderExpiration, // timeParameter,
        public tillDate: string,
        public referrer: string

    ){}

    public static newOrder(type:number, symbol:string, portfolio:SnbcapitalPortfolio, companyName:string):SnbcapitalOrder{
        return new SnbcapitalOrder(
            null,
            symbol,
            companyName,
            portfolio.gBSCustomerCode,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            portfolio.portfolioId,
            true,
            true,
            true,
            true,
            true,
            SnbcapitalOrderStatus.getOrderStatus(1),
            SnbcapitalOrderExecution.getExecutionType(SnbcapitalOrderExecutionType.Limit),
            SnbcapitalOrderTypeWrapper.getSnbcapitalOrderType(type),
            null,
            null,
            null,
            SnbcapitalOrderExpiration.getExpirationType(SnbcapitalOrderExpirationType.Today),
            null,
            null)
    }

    public static fromPosition(position:SnbcapitalPosition, companyName:string):SnbcapitalOrder{
        return new SnbcapitalOrder(
            null,
            position.symbol,
            companyName,
            null,
            0,
            position.freeQuantity,
            0,
            0,
            position.quantity - position.freeQuantity,
            0,
            0,
            position.portfolioId,
            true,
            true,
            true,
            true,
            true,
            SnbcapitalOrderStatus.getOrderStatus(SnbcapitalOrderStatusType.ToBeSentToMarket),
            SnbcapitalOrderExecution.getExecutionType(SnbcapitalOrderExecutionType.Market),
            SnbcapitalOrderTypeWrapper.getSnbcapitalOrderType(SnbcapitalOrderType.Sell),
            0,
            moment(new Date()).format('YYYY-MM-DD'),
            moment().format('HH:mm:ss'),
            SnbcapitalOrderExpiration.getExpirationType(SnbcapitalOrderExpirationType.Today),
            null,
            null
        )
    }

    public static updateOrderWithOrderDetails(order:SnbcapitalOrder, orderDetails:SnbcapitalOrderDetails){
        order.portfolioId = orderDetails.portfolioId;
        order.date = moment(orderDetails.date).format('YYYY-MM-DD');
        order.time = moment(order.time).format('HH:mm:ss')
        order.execution = SnbcapitalOrderExecution.getExecutionByType(orderDetails.order.execution.type);
        order.quantity = +orderDetails.quantity;
        order.discloseQuantity = orderDetails.order.discloseQuantity ? +orderDetails.order.discloseQuantity : 0;
        order.executedQuantity = +((+orderDetails.quantity) - (+orderDetails.remainedQuantity));
        order.price = +orderDetails.order.price;
        order.expiration = SnbcapitalOrderExpiration.getExpirationType(orderDetails.order.timeParameter, orderDetails.order.qtyParam, true);
        order.tillDate = orderDetails.order.tillDate ? moment(orderDetails.order.tillDate).format('YYYY-MM-DD'): '-';
        order.status = SnbcapitalOrderStatus.getOrderStatus(orderDetails.order.status.type);
    }

    public static mapResponseToSnbcapitalOrder(response:SnbcapitalOrderListResponse, companyName:string, companySymbol:string):SnbcapitalOrder{
        return {
            id: response.gbsOrderNumber,
            symbol: companySymbol,
            name: companyName,
            gpsOrderNumber: response.gbsOrderNumber,
            price: response.limPrice, //limitPrice
            quantity: response.orderQty,
            qtyParam: response.qtyParam,
            minimumQuantity: response.quantitaMinima,
            executedQuantity: response.execQty,
            remainingQuantity: response.remainingQty,
            discloseQuantity: response.disclosedQty,
            portfolioId: response.saCode,
            isOpen: response.isOpen,
            canBeRevoked: response.canBeRevoked,
            quantityCanBeChanged: response.qtyCanBeChanged,
            priceCanBeModified: response.priceCanBeChanged,
            expiryDateCanBeModified: response.expiryDateCanBeChanged,
            status: SnbcapitalOrderStatus.getOrderStatus(response.status),
            execution: SnbcapitalOrderExecution.getExecutionType(response.priceType), //priceType
            type: SnbcapitalOrderTypeWrapper.getSnbcapitalOrderType(response.sign),
            timeParameter: response.timeParam,
            date: moment(this.getOrderDate(response.insDate), 'YYYY-MM-DD HH:mm:ss.SSS').format('YYYY-MM-DD'),
            time: moment(this.getOrderDate(response.insDate), 'YYYY-MM-DD HH:mm:ss.SSS').format('HH:mm:ss'),
            expiration: SnbcapitalOrderExpiration.getExpirationType(response.timeParam),
            tillDate: response.expiryDate ? moment(this.getOrderDate(response.expiryDate)).format('YYYY-MM-DD'): '-',
            referrer: null
        }
    }

    public static canEditOrder(order:SnbcapitalOrder):boolean{
        return SnbcapitalOrderStatus.editableStatus(order);
    }

    public static canCancelOrder(order:SnbcapitalOrder):boolean{
        return SnbcapitalOrderStatus.cancelableStatus(order);
    }

    private static getOrderDate(date: SnbcapitalDateTimeResponse): string {
        if (date == null) {
            return null;
        }
        if(date.isnull){
            return null
        }
        return `${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}:${date.second}.${date.millis}`;
    }
}
