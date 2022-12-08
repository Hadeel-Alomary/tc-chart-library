export class TradestationOrderExpiration{

    private static allTypes:TradestationOrderExpiration[];

    constructor(
        public type:TradestationOrderExpirationType,
        public arabic:string,
        public english:string,
    ){}

    public static getAllTypes():TradestationOrderExpiration[]{
        if(!TradestationOrderExpiration.allTypes) {
            TradestationOrderExpiration.allTypes = [];
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.Day, 'يوم', 'Day'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.DayPlus, 'يوم +', 'Day Plus'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.GTD, 'صالح لتاريخ', 'Good Through Date'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.GTDPlus, 'صالح لتاريخ +', 'Good Through Date Plus'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.GTC, 'صالح حتى الإلغاء', 'Good Till Cancelled'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.GTCPlus, 'صالح حتى الإلغاء +', 'Good Till Cancelled Plus'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.OPG, 'عند الإفتتاح', 'At The Opening'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.CLO, 'عند الإغلاق', 'On Close'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.IOC, 'فوري أو إلغاء', 'Immediate Or Cancel'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.FOK, 'تحقق كامل أو إلغاء', 'Fill Or Kill'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.OneMin, '1 دقيقة', '1 min'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.ThreeMin, '3 دقائق', '3 min'));
            TradestationOrderExpiration.allTypes.push(new TradestationOrderExpiration(TradestationOrderExpirationType.FiveMin, '5 دقائق', '5 min'));
        }
        return TradestationOrderExpiration.allTypes;
    }

    public static getOrderExpirationByType(type:string):TradestationOrderExpiration{
        return TradestationOrderExpiration.getAllTypes().find(item => item.type == type);
    }

    public static isGoodTillDate(type: string): boolean{
        return type == TradestationOrderExpirationType.GTD || type == TradestationOrderExpirationType.GTDPlus ;
    }

    public static convertExpirationType(type: string){
        switch (type) {
            case TradestationOrderExpirationType.DayPlus:
                return 'DYP';
            case TradestationOrderExpirationType.GTDPlus:
                return 'GDP';
            case TradestationOrderExpirationType.GTCPlus:
                return 'GCP';
        }
    }
}

export enum TradestationOrderExpirationType{
    Day = 'DAY',
    DayPlus = 'DAY+',
    GTD = 'GTD',
    GTDPlus = 'GTD+',
    GTC = 'GTC',
    GTCPlus = 'GTC+',
    OPG = 'OPG',
    CLO = 'CLO',
    IOC = 'IOC',
    FOK = 'FOK',
    OneMin = '1 min',
    ThreeMin = '3 min',
    FiveMin = '5 min'
}
