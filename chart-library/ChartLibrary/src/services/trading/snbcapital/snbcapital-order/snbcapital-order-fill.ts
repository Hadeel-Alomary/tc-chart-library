

export class SnbcapitalOrderFill{

    private static allStatus:SnbcapitalOrderFill[] = [];


    constructor(
        public type:SnbcapitalOrderFillType,
        public name:string
    ){}


    public static getAllTypes():SnbcapitalOrderFill[]{
        if(SnbcapitalOrderFill.allStatus.length == 0){
            SnbcapitalOrderFill.allStatus.push(new SnbcapitalOrderFill(SnbcapitalOrderFillType.Normal, 'عادي'));
            SnbcapitalOrderFill.allStatus.push(new SnbcapitalOrderFill(SnbcapitalOrderFillType.MinimumFill, 'اقل كمية  للتنفيذ'));
            SnbcapitalOrderFill.allStatus.push(new SnbcapitalOrderFill(SnbcapitalOrderFillType.AllOrNone, 'كل الكمية او لا شيء'));
        }

        return SnbcapitalOrderFill.allStatus;
    }


    public static getByType(type:SnbcapitalOrderFillType):SnbcapitalOrderFill{
        return SnbcapitalOrderFill.getAllTypes().find(item => item.type == type);
    }

    public static getByTypeAsString(type:string):SnbcapitalOrderFill{
        return SnbcapitalOrderFill.getByType(+type);
    }

}

export enum SnbcapitalOrderFillType{
    Normal = 1,
    MinimumFill,
    AllOrNone
}
