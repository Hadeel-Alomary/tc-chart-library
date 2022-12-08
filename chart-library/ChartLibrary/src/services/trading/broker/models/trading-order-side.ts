import {VirtualTradingOrderSide} from '../../virtual-trading/virtual-trading-models';
import {TradestationOrderSideType, TradestationOrderSideWrapper} from '../../tradestation/tradestation-order';

export enum TradingOrderSideType {
    BUY = 1,
    SELL,
    BUY_TO_COVER,
    SELL_SHORT
}

export class TradingOrderSide {
    constructor(
        public type: TradingOrderSideType,
        public arabic: string,
        public english: string
    ){}

    private static allOrderSides = {
        BUY: new TradingOrderSide(TradingOrderSideType.BUY, 'شراء', 'Buy'),
        SELL: new TradingOrderSide(TradingOrderSideType.SELL, 'بيع', 'Sell'),
        BUY_TO_COVER: new TradingOrderSide(TradingOrderSideType.BUY_TO_COVER, 'شراء على المكشوف', 'Buy to Cover'),
        SELL_SHORT: new TradingOrderSide(TradingOrderSideType.SELL_SHORT, 'بيع على المكشوف', 'Sell Short'),
    };

    public static fromVirtualTradingOrderSide(side: VirtualTradingOrderSide): TradingOrderSide {
        switch (side.value) {
            case 'BUY':
                return TradingOrderSide.allOrderSides.BUY;
            case 'SELL':
                return TradingOrderSide.allOrderSides.SELL;
            default:
                return null;
        }
    }


    public static fromTradestationOrderSide(side: TradestationOrderSideWrapper): TradingOrderSide {
        switch (side.value) {
            case TradestationOrderSideType.Buy:
                return TradingOrderSide.allOrderSides.BUY;
            case TradestationOrderSideType.Sell:
                return TradingOrderSide.allOrderSides.SELL;
            case TradestationOrderSideType.BuyToCover:
                return TradingOrderSide.allOrderSides.BUY_TO_COVER;
            case TradestationOrderSideType.SellShort:
                return TradingOrderSide.allOrderSides.SELL_SHORT;
            default:
                return null;
        }
    }


    public static fromType(type: TradingOrderSideType): TradingOrderSide {
        switch (type) {
            case TradingOrderSideType.BUY:
                return TradingOrderSide.allOrderSides.BUY;
            case TradingOrderSideType.SELL:
                return TradingOrderSide.allOrderSides.SELL;
            default:
                return null;
        }
    }

}
