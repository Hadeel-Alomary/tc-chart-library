import {Tc} from '../../../../utils';

export enum TradestationOrderExecutionType {
    Market = 'Market',
    Limit = 'Limit',
    Stop = 'Stop'
}

export class TradestationOrderExecution {
    private static allTypes: TradestationOrderExecution[];

    constructor(
        public type:TradestationOrderExecutionType,
        public arabic: string,
        public english: string
    ){}

    public static getAllTypes():TradestationOrderExecution[]{
        if(!TradestationOrderExecution.allTypes){
            TradestationOrderExecution.allTypes = [];
            TradestationOrderExecution.allTypes.push(new TradestationOrderExecution(TradestationOrderExecutionType.Market, 'سعر السوق', 'Market Price'));
            TradestationOrderExecution.allTypes.push(new TradestationOrderExecution(TradestationOrderExecutionType.Limit, 'سعر محدد', 'Limit Price'));
            TradestationOrderExecution.allTypes.push(new TradestationOrderExecution(TradestationOrderExecutionType.Stop, 'وقف', 'Stop'));
        }

        return TradestationOrderExecution.allTypes;
    }


    public static getOrderExecutionByType(type: string): TradestationOrderExecution {
        let orderExecution = TradestationOrderExecution.getAllTypes().find(item => item.type == type);
        if(!orderExecution){
            Tc.error('wrong execution type');
            return null;
        }
        return orderExecution;
    }
}
