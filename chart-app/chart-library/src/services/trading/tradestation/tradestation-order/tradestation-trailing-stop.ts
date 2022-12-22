import {ArrayUtils} from '../../../../utils';

export enum TradestationTrailingStopType{
    StopPrice,
    TrailingAmount,
    TrailingPercent
}

export class TradestationTrailingStop {

    constructor(
        public type: TradestationTrailingStopType,
        public arabic: string,
        public english: string
    ) {}
    private static trailingStopTypes: {[key: string]: TradestationTrailingStop} = {
        StopPrice: new TradestationTrailingStop(TradestationTrailingStopType.StopPrice, 'سعر الوقف', 'Stop Price'),
        TrailingAmount: new TradestationTrailingStop(TradestationTrailingStopType.TrailingAmount, 'وقف متحرك', 'Trailing Amount'),
        TrailingPercent: new TradestationTrailingStop(TradestationTrailingStopType.TrailingPercent, '  وقف متحرك %', 'Trailing Amount %')
    }

    public static getAllTrailingStopTypes(): TradestationTrailingStop[] {
        return ArrayUtils.values(TradestationTrailingStop.trailingStopTypes);
    }

    public static getDefaultTrailingStopType(): TradestationTrailingStop {
        return ArrayUtils.values(TradestationTrailingStop.trailingStopTypes)[0];
    }

    public static getTrailingStopType(type: number): TradestationTrailingStop{
        return TradestationTrailingStop.getAllTrailingStopTypes().find(item => item.type == type);
    }

}
