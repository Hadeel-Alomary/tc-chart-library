import {TradestationOrderResponse} from '../../../loader/trading/tradestation/tradestation-loader.service';
import {TradestationOrderSideType, TradestationOrderSideWrapper} from './tradestation-order-side-type';
import {TradestationOrdersGroupedStatus, TradestationOrderStatus, TradestationOrderStatusType} from './tradestation-order-status';
import {TradestationOrderType} from './tradestation-order-type-wrapper';
import {TradestationPosition} from '../tradestation-position';
import {TradestationOrderExpiration, TradestationOrderExpirationType} from './tradestation-order-expiration';
import {TradestationOrderRouting, TradestationOrderRoutingType} from './tradestation-order-routing';
import {TradestationTrailingStopType} from './tradestation-trailing-stop';
import {MarketGridData} from "../../../../data-types/types";

export class TradestationOrder implements MarketGridData {

    constructor(
        public id: string,
        public accountId: string,
        public side: TradestationOrderSideWrapper,
        public type: TradestationOrderType,
        public status: TradestationOrderStatus,
        public originalStatus: TradestationOrderStatusType,
        public takeProfitPrice: number,
        public stopLossPrice: number,
        public stopPrice: number,
        public limitPrice: number,
        public symbol: string,
        public companyName: string,
        public quantity: number,
        public executedQuantity: number,
        public leavesQuantity: number,
        public price: number,
        public commission: number,
        public timeExecuted: string,
        public executedPrice: number,
        public timeStamp :string,
        public rejectReason: string,
        public groupName: string,
        public unbundledRouteFee: number,
        public routing: TradestationOrderRouting,
        public expirationType: TradestationOrderExpiration,
        public tillDate: string,
        public triggeredBy: string,
        public confirmationId: string,
        public trailingAmount: number,
        public trailingPercent: number,
        public quantitiyLeft:number,
    ) { }

    public static newOrder(side: string, symbol: string, companyName: string): TradestationOrder {
        return new TradestationOrder(
            null,
            null,
            TradestationOrderSideWrapper.fromValue(side),
            TradestationOrderType.Limit,
            TradestationOrderStatus.fromValue(TradestationOrderStatusType.OPN),
            TradestationOrderStatusType.OPN,
            0,
            0,
            0,
            0,
            symbol,
            companyName,
            0,
            0,
            0,
            0,
            0,
            null,
            0,
            null,
            null,
            null,
            null,
            TradestationOrderRouting.getOrderRoutingByType(TradestationOrderRoutingType.Intelligent),
            TradestationOrderExpiration.getOrderExpirationByType(TradestationOrderExpirationType.GTD),
            moment(new Date()).format('YYYY-MM-DD'),
            null,
            null,
            0,
            0,
            0
        );
    }

    public static fromPosition(position: TradestationPosition , orderSide: string , orderType: TradestationOrderType): TradestationOrder {
        return new TradestationOrder(
            null,
            position.accountId,
            TradestationOrderSideWrapper.fromValue(orderSide),
            orderType,
            TradestationOrderStatus.fromValue(TradestationOrderStatusType.OPN),
            TradestationOrderStatusType.OPN,
            0,
            0,
            0,
            0,
            position.symbol,
            position.companyName,
            position.quantity,
            0,
            0,
            0,
            0,
            null,
            0,
            null,
            null,
            null,
            null,
            TradestationOrderRouting.getOrderRoutingByType(TradestationOrderRoutingType.Intelligent),
            TradestationOrderExpiration.getOrderExpirationByType(TradestationOrderExpirationType.GTD),
            moment(new Date()).format('YYYY-MM-DD'),
            null,
            null,
            0,
            0,
            0
        )
    }

    public static mapResponseToTradestationOrder(response: TradestationOrderResponse, companyName: string, companySymbol: string): TradestationOrder {
        let expirationData = response.Duration.split('-');
        let tillDate = (expirationData.length == 2 && TradestationOrderExpiration.isGoodTillDate(expirationData[0].trim())) ? moment(expirationData[1]).format('YYYY-MM-DD') : '-';
        let trailingStop = response.TrailingStop;
        let trailingAmount = trailingStop && trailingStop.Amount ? trailingStop.Amount : null;
        let trailingPercent = trailingStop && trailingStop.Percent ? trailingStop.Percent : null;

        return new TradestationOrder(
            response.OrderID.toString(),
            response.AccountID,
            TradestationOrderSideWrapper.fromValue(response.Type),
            response.Legs[0].OrderType,
            TradestationOrderStatus.fromValue(response.Status),
            response.Status,
            0,
            0,
            response.Legs[0].StopPrice,
            response.Legs[0].LimitPrice,
            companySymbol,
            companyName,
            response.Legs[0].Quantity,
            response.Legs[0].ExecQuantity,
            response.Legs[0].Leaves,
            response.Legs[0].LimitPrice,
            response.CommissionFee,
            response.Legs[0].TimeExecuted,
            response.Legs[0].ExecPrice,
            response.TimeStamp,
            response.RejectReason ? response.RejectReason : "",
            response.GroupName,
            response.UnbundledRouteFee,
            TradestationOrderRouting.getOrderRoutingByType(response.Routing),
            TradestationOrderExpiration.getOrderExpirationByType(expirationData[0].trim()),
            tillDate,
            response.TriggeredBy,
            null,
            trailingAmount,
            trailingPercent,
            response.Legs[0].QuantityLeft
        );
    }

    //order trading side:
    public static isBuyOrder(order: TradestationOrder): boolean{
        return order.side.value == TradestationOrderSideType.Buy;
    }

    public static isSellOrder(order: TradestationOrder): boolean{
      return order.side.value == TradestationOrderSideType.Sell;
    }

    public static isSellShortOrder(order: TradestationOrder): boolean{
        return order.side.value == TradestationOrderSideType.SellShort;
    }

    public static isBuyToCoverOrder(order: TradestationOrder): boolean{
        return order.side.value == TradestationOrderSideType.BuyToCover;
    }

    public static isBuyOrBuyToCoverOrder(order: TradestationOrder){
        return order.side.value == TradestationOrderSideType.Buy || order.side.value == TradestationOrderSideType.BuyToCover
    }

    public static isSellOrSellShortOrder(order: TradestationOrder) {
        return order.side.value == TradestationOrderSideType.Sell || order.side.value == TradestationOrderSideType.SellShort
    }

    //  order trading type:
    public static isLimitOrder(order: TradestationOrder): boolean {
        return order.type == TradestationOrderType.Limit;
    }

    public static isMarketOrder(order: TradestationOrder): boolean {
        return order.type == TradestationOrderType.Market;
    }

    // order stop type:
    public static isStopMarket(order: TradestationOrder): boolean{
        return order.type == TradestationOrderType.StopMarket;
    }

    public static isStopLimit(order: TradestationOrder): boolean{
        return order.type == TradestationOrderType.StopLimit;
    }

    public static isStopOrder(order: TradestationOrder): boolean{
        return order.type == TradestationOrderType.StopMarket || order.type == TradestationOrderType.StopLimit;
    }

    public static isTrailingStopPrice(type: number): boolean {
        return type == TradestationTrailingStopType.StopPrice;
    }

    public static isTrailingAmountStop(type: number): boolean {
        return type == TradestationTrailingStopType.TrailingAmount;
    }

    public static isTrailingPercent(type: number): boolean{
        return type == TradestationTrailingStopType.TrailingPercent;
    }

    // new order:
    public static isNewOrResendOrder(order: TradestationOrder): boolean {
        return order.id == null;
    }

    // edit order:
    public static isEditOrder(order: TradestationOrder): boolean {
        return order.id !== null;
    }

    // order status:
    public static isActiveOrder(order: TradestationOrder): boolean {
        return order.status.value == TradestationOrdersGroupedStatus.ACTIVE;
    }

    public static isInActive(order: TradestationOrder): boolean {
        return order.status.value == TradestationOrdersGroupedStatus.INACTIVE;
    }

    public static isFilledOrder(order: TradestationOrder): boolean {
        return order.status.value == TradestationOrdersGroupedStatus.FILLED;
    }

    public static isCanceled(order: TradestationOrder): boolean {
        return order.status.value == TradestationOrdersGroupedStatus.CANCELED;
    }

    public static isRejected(order: TradestationOrder): boolean {
        return order.status.value == TradestationOrdersGroupedStatus.REJECTED;
    }

}
