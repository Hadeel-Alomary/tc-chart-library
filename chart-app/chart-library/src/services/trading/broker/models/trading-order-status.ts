import {VirtualTradingOrderStatus} from '../../virtual-trading/virtual-trading-models';
import {TradestationOrdersGroupedStatus, TradestationOrderStatus} from '../../tradestation/tradestation-order';

export enum TradingOrderStatusType {
    ACTIVE,
    EXECUTED
}

export class TradingOrderStatus {
    constructor(
        public type: TradingOrderStatusType,
        public arabic: string,
        public english: string
    ){}

    private static allOrderStatuses = {
        ACTIVE: new TradingOrderStatus(TradingOrderStatusType.ACTIVE, 'مفعّل', 'Active'),
        EXECUTED: new TradingOrderStatus(TradingOrderStatusType.EXECUTED, 'منفّذ', 'Executed')
    };


    public static fromVirtualTradingOrderStatus(status: VirtualTradingOrderStatus): TradingOrderStatus {
        switch (status.value) {
            case 'ACTIVE':
                return TradingOrderStatus.allOrderStatuses.ACTIVE;
            case 'EXECUTED':
                return TradingOrderStatus.allOrderStatuses.EXECUTED;
            default:
                return null;
        }
    }

    public static fromTradestationOrderStatus(status: TradestationOrderStatus): TradingOrderStatus {
        switch (status.value) {
            case TradestationOrdersGroupedStatus.ACTIVE:
                return TradingOrderStatus.allOrderStatuses.ACTIVE;
            case TradestationOrdersGroupedStatus.FILLED:
                return TradingOrderStatus.allOrderStatuses.EXECUTED;
            default:
                return null;
        }
    }

    public static fromType(type: TradingOrderStatusType):TradingOrderStatus {
        switch (type) {
            case TradingOrderStatusType.ACTIVE:
                return TradingOrderStatus.allOrderStatuses.ACTIVE;
            case  TradingOrderStatusType.EXECUTED:
                return TradingOrderStatus.allOrderStatuses.EXECUTED;
            default:
                return null;
        }
    }
}
