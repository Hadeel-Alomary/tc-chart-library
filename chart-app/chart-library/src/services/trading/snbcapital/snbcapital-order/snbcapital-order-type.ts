export class SnbcapitalOrderTypeWrapper{

    private static allTypes:SnbcapitalOrderTypeWrapper[];

    constructor(
        public type:SnbcapitalOrderType,
        public name:string
    ){}

    public static getAllTypes():SnbcapitalOrderTypeWrapper[]{
        if(!SnbcapitalOrderTypeWrapper.allTypes){
            SnbcapitalOrderTypeWrapper.allTypes = [];
            SnbcapitalOrderTypeWrapper.allTypes.push(new SnbcapitalOrderTypeWrapper(SnbcapitalOrderType.Buy, 'شراء'));
            SnbcapitalOrderTypeWrapper.allTypes.push(new SnbcapitalOrderTypeWrapper(SnbcapitalOrderType.Sell,'بيع'));
        }

        return SnbcapitalOrderTypeWrapper.allTypes;
    }

    public static fromType(type:SnbcapitalOrderType):SnbcapitalOrderTypeWrapper{
        return SnbcapitalOrderTypeWrapper.getAllTypes().find(item => item.type == type);
    }

    public static getSnbcapitalOrderType(type:number):SnbcapitalOrderTypeWrapper{
        return SnbcapitalOrderTypeWrapper.fromType(type);
    }
}

export enum SnbcapitalOrderType{
    Buy = 1,
    Sell
}
