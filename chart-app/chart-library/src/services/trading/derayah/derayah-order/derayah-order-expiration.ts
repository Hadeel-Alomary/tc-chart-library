
export class DerayahOrderExpiration{

    private static allTypes:DerayahOrderExpiration[];

    constructor(
        public type:DerayahOrderExpirationType,
        public name:string,
        public tillDate:string
    ){}


    public static getAllTypes():DerayahOrderExpiration[]{
        if(!DerayahOrderExpiration.allTypes) {
            DerayahOrderExpiration.allTypes = [];
            DerayahOrderExpiration.allTypes.push(new DerayahOrderExpiration(DerayahOrderExpirationType.Day, 'يوم', null));
            DerayahOrderExpiration.allTypes.push(new DerayahOrderExpiration(DerayahOrderExpirationType.FillOrKill, 'تنفيذ أو إالغاء', null));
            DerayahOrderExpiration.allTypes.push(new DerayahOrderExpiration(DerayahOrderExpirationType.FillAndKill, 'تنفيذ و إلغاء', null));
            DerayahOrderExpiration.allTypes.push(new DerayahOrderExpiration(DerayahOrderExpirationType.PreOpen, 'عند الافتتاح', null));
            DerayahOrderExpiration.allTypes.push(new DerayahOrderExpiration(DerayahOrderExpirationType.GoodTillDate, 'حتى تاريخ', null));
        }
        return DerayahOrderExpiration.allTypes;
    }

    public static getOrderExpirationByType(type:DerayahOrderExpirationType):DerayahOrderExpiration{
        return DerayahOrderExpiration.getAllTypes().find(item => item.type == type);
    }

    public static getOrderExpirationByTypeAsString(type:number):DerayahOrderExpiration{
        return DerayahOrderExpiration.getOrderExpirationByType(type);
    }
}

export enum DerayahOrderExpirationType{
    Day = 1,
    FillOrKill = 2,
    FillAndKill = 3,
    PreOpen = 4,
    GoodTillDate = 6
}
