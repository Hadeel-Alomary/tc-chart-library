import {VirtualTradingOrderType} from '../../virtual-trading/virtual-trading-models';
import {TradestationOrderType} from '../../tradestation/tradestation-order';

export enum TradingOrderType {
    LIMIT = 1,
    MARKET,
    MANUAL,
    STOP,
    STOP_MARKET,
    STOP_LIMIT
}


export class TradingOrderTypeWrapper {
    constructor(
        public type: TradingOrderType,
        public arabic: string,
        public english: string
    ){}

    private static allOrderTypes = {
        MANUAL: new TradingOrderTypeWrapper(TradingOrderType.MANUAL, 'يدوي', 'Manual'),
        MARKET: new TradingOrderTypeWrapper(TradingOrderType.MARKET, 'سعر السوق', 'Market Price'),
        LIMIT: new TradingOrderTypeWrapper(TradingOrderType.LIMIT, 'سعر محدد', 'Limit Price'),
        STOP: new TradingOrderTypeWrapper(TradingOrderType.STOP, 'وقف خسارة', 'Stop Loss'),
        STOP_MARKET: new TradingOrderTypeWrapper(TradingOrderType.STOP_MARKET, 'وقف', 'Stop'),
        STOP_LIMIT: new TradingOrderTypeWrapper(TradingOrderType.STOP_LIMIT, 'وقف محدد', 'Stop Limit')
    };


    public static fromVirtualTradingOrderType(type: VirtualTradingOrderType): TradingOrderTypeWrapper {
        switch (type.value) {
            case 'MANUAL':
                return TradingOrderTypeWrapper.allOrderTypes.MANUAL;
            case 'MARKET':
                return TradingOrderTypeWrapper.allOrderTypes.MARKET;
            case 'LIMIT':
                return TradingOrderTypeWrapper.allOrderTypes.LIMIT;
            case 'STOP':
                return TradingOrderTypeWrapper.allOrderTypes.STOP;
            default:
                return null;
        }
    }

    public static fromTradestationOrderType(type: TradestationOrderType): TradingOrderTypeWrapper {
        switch (type) {
            case TradestationOrderType.Market:
                return TradingOrderTypeWrapper.allOrderTypes.MARKET;
            case TradestationOrderType.Limit:
                return TradingOrderTypeWrapper.allOrderTypes.LIMIT;
            case TradestationOrderType.StopMarket:
                return TradingOrderTypeWrapper.allOrderTypes.STOP_MARKET;
            case TradestationOrderType.StopLimit:
                return TradingOrderTypeWrapper.allOrderTypes.STOP_LIMIT;
            default:
                return null;
        }
    }

    public static fromType(type: TradingOrderType): TradingOrderTypeWrapper {
        switch (type) {
            case TradingOrderType.MANUAL:
                return TradingOrderTypeWrapper.allOrderTypes.MANUAL;
            case TradingOrderType.MARKET:
                return TradingOrderTypeWrapper.allOrderTypes.MARKET;
            case TradingOrderType.LIMIT:
                return TradingOrderTypeWrapper.allOrderTypes.LIMIT;
            case TradingOrderType.STOP:
                return TradingOrderTypeWrapper.allOrderTypes.STOP;
            default:
                return null;
        }
    }

}
