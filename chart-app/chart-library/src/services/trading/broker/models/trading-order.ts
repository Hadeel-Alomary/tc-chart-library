import {TradingOrderSide} from './trading-order-side';
import {TradingOrderTypeWrapper} from './trading-order-type';
import {VirtualTradingOrder} from '../../virtual-trading/virtual-trading-models';
import {TradingOrderStatus} from './trading-order-status';
import {TradestationOrder} from '../../tradestation/tradestation-order';
import {BrokerType} from '../broker';

export class TradingOrder {
    constructor(
        public id: string,
        public symbol: string,
        public price: number,
        public quantity: number,
        public side: TradingOrderSide,
        public type: TradingOrderTypeWrapper,
        public status: TradingOrderStatus,
        public takeProfit: number,
        public stopLoss: number,
        public executionPrice: number,
        public executionTime: string
    ){}

    public static fromVirtualTradingOrders(virtualTradingOrders: VirtualTradingOrder[]): TradingOrder[] {
        let tradingOrders: TradingOrder[] = [];

        for(let order of virtualTradingOrders) {
            if(VirtualTradingOrder.isActiveOrder(order) &&!VirtualTradingOrder.isMarketOrder(order)) {
                tradingOrders.push(new TradingOrder(
                    `${order.id}`,
                    order.symbol,
                    order.price,
                    order.quantity,
                    TradingOrderSide.fromVirtualTradingOrderSide(order.orderSide),
                    TradingOrderTypeWrapper.fromVirtualTradingOrderType(order.orderType),
                    TradingOrderStatus.fromVirtualTradingOrderStatus(order.orderStatus),
                    order.takeProfit,
                    order.stopPrice,
                    null,
                    null
                ));
            } else if(VirtualTradingOrder.isExecutedOrder(order)) {
                tradingOrders.push(new TradingOrder(
                    `${order.id}`,
                    order.symbol,
                    order.price,
                    order.quantity,
                    TradingOrderSide.fromVirtualTradingOrderSide(order.orderSide),
                    TradingOrderTypeWrapper.fromVirtualTradingOrderType(order.orderType),
                    TradingOrderStatus.fromVirtualTradingOrderStatus(order.orderStatus),
                    order.takeProfit,
                    order.stopPrice,
                    order.executionPrice,
                    order.executionTime
                ));
            }
        }

        return tradingOrders;
    }

    public static fromTradestationOrders(tradestationOrders: TradestationOrder[]): TradingOrder[] {
        let tradingOrders: TradingOrder[] = [];

        for(let order of tradestationOrders) {
            if(TradestationOrder.isActiveOrder(order) &&!TradestationOrder.isMarketOrder(order)) {
                tradingOrders.push(new TradingOrder(
                    `${order.id}`,
                    order.symbol,
                    order.stopPrice ? order.stopPrice : order.price,
                    order.quantity,
                    TradingOrderSide.fromTradestationOrderSide(order.side),
                    TradingOrderTypeWrapper.fromTradestationOrderType(order.type),
                    TradingOrderStatus.fromTradestationOrderStatus(order.status),
                    order.takeProfitPrice,
                    order.stopLossPrice,
                    null,
                    null
                ));
            } else if(TradestationOrder.isFilledOrder(order)) {
                tradingOrders.push(new TradingOrder(
                    `${order.id}`,
                    order.symbol,
                    order.price,
                    order.quantity,
                    TradingOrderSide.fromTradestationOrderSide(order.side),
                    TradingOrderTypeWrapper.fromTradestationOrderType(order.type),
                    TradingOrderStatus.fromTradestationOrderStatus(order.status),
                    order.takeProfitPrice,
                    order.stopLossPrice,
                    order.executedPrice,
                    order.timeExecuted
                ));
            }
        }

        return tradingOrders;
    }
}

