import {Tc} from '../../../../utils';

export enum TradestationOrderSideType {
    Buy = 'Buy',
    BuyToCover = 'Buy to Cover',
    SellShort = 'Sell Short',
    Sell = 'Sell'
}

export class TradestationOrderSideWrapper {

    constructor(
        public value:TradestationOrderSideType,
        public arabic:string,
        public english: string
    ){}

    private static allTypes: {[key: string]:TradestationOrderSideWrapper} = {
        BUY: new TradestationOrderSideWrapper(TradestationOrderSideType.Buy ,'شراء', 'Buy'),
        BuyToCover: new TradestationOrderSideWrapper(TradestationOrderSideType.BuyToCover , 'الشراء للتغطية', 'Buy to Cover'),
        SELL: new TradestationOrderSideWrapper(TradestationOrderSideType.Sell , 'بيع', 'Sell'),
        SellShort: new TradestationOrderSideWrapper(TradestationOrderSideType.SellShort , 'بيع على المكشوف', 'Sell Short'),
    }

    public static fromValue(value: string): TradestationOrderSideWrapper {
        switch (value) {
            case TradestationOrderSideType.Buy:
                return TradestationOrderSideWrapper.allTypes.BUY;
            case TradestationOrderSideType.Sell:
                return TradestationOrderSideWrapper.allTypes.SELL;
            case TradestationOrderSideType.BuyToCover:
                return TradestationOrderSideWrapper.allTypes.BuyToCover;
            case TradestationOrderSideType.SellShort:
                return TradestationOrderSideWrapper.allTypes.SellShort;
            default:
                Tc.error("unknown type " + value);
        }
    }

    public static fromPosition(value: string) {
        switch (value) {
            case 'Long':
                return TradestationOrderSideWrapper.allTypes.BUY;
            case 'Short':
                return TradestationOrderSideWrapper.allTypes.SellShort;
            default:
                Tc.error("unknown type " + value)
        }
    }

}
