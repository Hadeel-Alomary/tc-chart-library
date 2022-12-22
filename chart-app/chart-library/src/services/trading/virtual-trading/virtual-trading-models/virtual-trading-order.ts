import {VirtualTradingPosition} from './virtual-trading-position';
import {Market} from '../../../loader';
import {VirtualTradingOrderType} from './virtual-trading-order-type';
import {VirtualTradingOrderStatus} from './virtual-trading-order-status';
import {VirtualTradingOrderSide} from './virtual-trading-order-side';
import {VirtualTradingOrderResponse} from '../../../loader/trading/virtual-trading';
import {MarketGridData} from "../../../../data-types/types";

export class VirtualTradingOrder implements MarketGridData {

    constructor(
        public id: string,
        public orderSide: VirtualTradingOrderSide,
        public orderType: VirtualTradingOrderType,
        public accountId: number,
        public symbol: string,
        public name: string,
        public market: Market,
        public quantity: number,
        public price: number,
        public stopPrice: number,
        public takeProfit: number,
        public commission: number,
        public commissionAmount: number,
        public executionPrice: number,
        public executionTime: string,
        public expirationDate: string,
        public orderStatus: VirtualTradingOrderStatus,
        public createdAt: string,
        public updatedAt: string,
    ){}



    public static newOrder(side: string, symbol: string, companyName: string, accountId: number, commission: number, market: Market): VirtualTradingOrder{
        return new VirtualTradingOrder(
            null,
            VirtualTradingOrderSide.fromValue(side),
            VirtualTradingOrderType.fromValue('LIMIT'),
            accountId,
            symbol,
            companyName,
            market,
            0,
            0,
            null,
            null,
            commission,
            null,
            null,
            null,
            null,
            VirtualTradingOrderStatus.fromValue('ACTIVE'),
            null,
            null
        );
    }

    public static mapResponseToVirtualTradingOrders(response: VirtualTradingOrderResponse[]): VirtualTradingOrder[] {
        let result: VirtualTradingOrder[] = [];
        for (let responseObject of response) {
            let company = null;
            // let company = marketsManager.getCompanyBySymbol(`${responseObject.symbol}.${responseObject.market}`);
            result.push(
                // VirtualTradingOrder.mapResponseToVirtualTradingOrder(responseObject, company.name)
			  VirtualTradingOrder.mapResponseToVirtualTradingOrder(responseObject, null)
            );
        }
        return result;
    }

    public static mapDetailsResponseToVirtualTradingOrder(response: VirtualTradingOrderResponse): VirtualTradingOrder {
        // let company = marketsManager.getCompanyBySymbol(`${response.symbol}.${response.market}`);
      let company = null;
        // return VirtualTradingOrder.mapResponseToVirtualTradingOrder(response, company.name);
	  return VirtualTradingOrder.mapResponseToVirtualTradingOrder(response,null);
    }

    public static mapResponseToVirtualTradingOrder(response: VirtualTradingOrderResponse, companyName: string): VirtualTradingOrder {
        return new VirtualTradingOrder(
            response.id.toString(),
            VirtualTradingOrderSide.fromValue(response.order_side),
            VirtualTradingOrderType.fromValue(response.order_type),
            response.trading_account_id,
            `${response.symbol}.${response.market}`,
            companyName,
          null,
            // marketsManager.getMarketByAbbreviation(response.market),
            +response.quantity,
            +response.price,
            +response.stop_price,
            +response.take_profit,
            +response.commission,
            +response.commission_amount,
            +response.execution_price,
            response.execution_time,
            response.expiration_date,
            VirtualTradingOrderStatus.fromValue(response.order_status),
            response.created_at,
            response.updated_at
        );
    }

    public static fromPosition(position: VirtualTradingPosition, commission: number): VirtualTradingOrder{
        return new VirtualTradingOrder(
            null,
            VirtualTradingOrderSide.fromValue('SELL'),
            VirtualTradingOrderType.fromValue('LIMIT'),
            position.accountId,
            position.symbol,
            position.name,
            position.market,
            position.freeQuantity,
            0,
            null,
            null,
            commission,
            null,
            null,
            null,
            null,
            VirtualTradingOrderStatus.fromValue('ACTIVE'),
            null,
            null
        );
    }

    public static isActiveOrder(order: VirtualTradingOrder): boolean {
        return order.orderStatus.value == 'ACTIVE';
    }

    public static isExecutedOrder(order: VirtualTradingOrder): boolean {
        return order.orderStatus.value == 'EXECUTED';
    }

    public static isNewOrder(order: VirtualTradingOrder): boolean{
        return order.id == null;
    }

    public static isMarketOrder(order: VirtualTradingOrder):boolean{
        return order.orderType.value == 'MARKET';
    }

    public static isManualOrder(order: VirtualTradingOrder):boolean{
        return order.orderType.value == 'MANUAL';
    }

    public static isStopOrder(order: VirtualTradingOrder):boolean{
        return order.orderType.value == 'STOP';
    }

    public static isBuyOrder(order: VirtualTradingOrder): boolean {
        return order.orderSide.value == 'BUY';
    }
}
