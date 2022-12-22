

export class DerayahOrderFill{

    private static allStatus:DerayahOrderFill[] = [];


    constructor(
        public type:DerayahOrderFillType,
        public name:string
    ){}


    public static getAllTypes():DerayahOrderFill[]{
        if(DerayahOrderFill.allStatus.length == 0){
            DerayahOrderFill.allStatus.push(new DerayahOrderFill(DerayahOrderFillType.Normal, 'عادي'));
            DerayahOrderFill.allStatus.push(new DerayahOrderFill(DerayahOrderFillType.MinimumFill, 'اقل كمية  للتنفيذ'));
            DerayahOrderFill.allStatus.push(new DerayahOrderFill(DerayahOrderFillType.AllOrNone, 'كل الكمية او لا شيء'));
        }

        return DerayahOrderFill.allStatus;
    }


    public static getByType(type:DerayahOrderFillType):DerayahOrderFill{
        return DerayahOrderFill.getAllTypes().find(item => item.type == type);
    }

    public static getByTypeAsString(type:string):DerayahOrderFill{
        return DerayahOrderFill.getByType(+type);
    }

}

export enum DerayahOrderFillType{
    Normal = 1,
    MinimumFill,
    AllOrNone
}