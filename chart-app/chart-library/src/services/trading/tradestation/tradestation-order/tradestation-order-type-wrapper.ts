import {Tc} from '../../../../utils';

export enum TradestationOrderType {
    Market = 'Market',
    Limit = 'Limit',
    StopMarket = 'StopMarket',
    StopLimit = 'StopLimit'
}

export class TradestationOrderTypeWrapper {
    private static allTypes: TradestationOrderTypeWrapper[];

    constructor(
        public type: TradestationOrderType,
        public arabic: string,
        public english: string,
    ) { }

    private static getOrderTypes(): TradestationOrderTypeWrapper[] {
        if(!TradestationOrderTypeWrapper.allTypes){
            TradestationOrderTypeWrapper.allTypes = [];
            TradestationOrderTypeWrapper.allTypes.push(new TradestationOrderTypeWrapper(TradestationOrderType.Market, 'سعر السوق', 'Market Price'));
            TradestationOrderTypeWrapper.allTypes.push(new TradestationOrderTypeWrapper(TradestationOrderType.Limit, 'سعر محدد', 'Limit Price'));
            TradestationOrderTypeWrapper.allTypes.push(new TradestationOrderTypeWrapper(TradestationOrderType.StopMarket, 'وقف سوق', 'Stop Market'));
            TradestationOrderTypeWrapper.allTypes.push(new TradestationOrderTypeWrapper(TradestationOrderType.StopLimit, 'وقف سعر', 'Stop Limit'));
        }

        return TradestationOrderTypeWrapper.allTypes;
    }

    public static fromValue(type: string): TradestationOrderTypeWrapper {
        let orderType = TradestationOrderTypeWrapper.getOrderTypes().find(item => item.type == type);
        if(!orderType){
            Tc.error('Wrong order type');
            return null;
        }
        return orderType;
    }
}
