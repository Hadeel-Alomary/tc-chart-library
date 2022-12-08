export class SnbcapitalOrderExpiration{

    private static allTypes:SnbcapitalOrderExpiration[];

    constructor(
        public type:SnbcapitalOrderExpirationType,
        public name:string
    ){}


    public static getAllTypes():SnbcapitalOrderExpiration[]{
        if(!SnbcapitalOrderExpiration.allTypes) {
            SnbcapitalOrderExpiration.allTypes = [];
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.Today, 'يوم'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.FillOrKill, 'تنفيذ أو إالغاء'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.FillAndKill, 'تنفيذ و إلغاء'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.AtTheOpening, 'عند الافتتاح'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.GoodTillDate, 'حتى تاريخ'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.GoodTillMonth, 'لمدة شهر'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.GoodTillWeek, 'لمدة أسبوع'));
            SnbcapitalOrderExpiration.allTypes.push(new SnbcapitalOrderExpiration(SnbcapitalOrderExpirationType.GoodTillCancellation, 'حتى الالغاء'));
        }
        return SnbcapitalOrderExpiration.allTypes;
    }

    public static getBuySellExpirationType():SnbcapitalOrderExpiration[] {
        return SnbcapitalOrderExpiration.getAllTypes().filter(item => item.type != SnbcapitalOrderExpirationType.GoodTillMonth && item.type != SnbcapitalOrderExpirationType.GoodTillWeek);
    }

    public static getOrderExpirationByType(type:SnbcapitalOrderExpirationType):SnbcapitalOrderExpiration{
        return SnbcapitalOrderExpiration.getAllTypes().find(item => item.type == type);
    }

    public static getExpirationType(type: number, quantityParam?: number, isEditOrder?: boolean): SnbcapitalOrderExpiration {
        if(quantityParam) {
            switch (quantityParam)
            {
                case 1:
                    return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.FillAndKill);
                case 6:
                    return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.FillOrKill);
            }
        }

        if(type == 0 || type == 1) {
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.Today);
        }else if(type == 2){
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.GoodTillDate);
        }else if(type == 4) {
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.AtTheOpening);
        }else if(type == 6 && !isEditOrder){
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.GoodTillWeek);
        }else if(type == 7 && !isEditOrder){
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.GoodTillMonth);
        }else if(type == 9){
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.GoodTillCancellation);
        }else {
            return this.getOrderExpirationByType(SnbcapitalOrderExpirationType.Today);
        }
    }
}

export enum SnbcapitalOrderExpirationType {
    Today, //1, 0
    GoodTillDate, //2
    AtTheOpening, //4
    GoodTillWeek, //6
    GoodTillMonth, //7
    GoodTillCancellation, //9
    FillAndKill,
    FillOrKill
}
