export class DerayahOrderTypeWrapper{

    private static allTypes:DerayahOrderTypeWrapper[];

    constructor(
        public type:DerayahOrderType,
        public name:string
    ){}

    public static getAllTypes():DerayahOrderTypeWrapper[]{
        if(!DerayahOrderTypeWrapper.allTypes){
            DerayahOrderTypeWrapper.allTypes = [];
            DerayahOrderTypeWrapper.allTypes.push(new DerayahOrderTypeWrapper(DerayahOrderType.Buy, 'طلب شراء'));
            DerayahOrderTypeWrapper.allTypes.push(new DerayahOrderTypeWrapper(DerayahOrderType.Sell,'طلب بيع'));
        }

        return DerayahOrderTypeWrapper.allTypes;
    }

    public static fromType(type:DerayahOrderType):DerayahOrderTypeWrapper{
        return DerayahOrderTypeWrapper.getAllTypes().find(item => item.type == type);
    }

    public static getDerayahOrderTypeAsString(type:number):DerayahOrderTypeWrapper{
        return DerayahOrderTypeWrapper.fromType(type);
    }
}

export enum DerayahOrderType{
    Buy = 1,
    Sell
}
