
export class DerayahOrderExecution{

    private static allTypes:DerayahOrderExecution[];

    constructor(
        public type:DerayahOrderExecutionType,
        public name:string
    ){}

    public static getAllTypes():DerayahOrderExecution[]{
        if(!DerayahOrderExecution.allTypes){
            DerayahOrderExecution.allTypes = [];
            DerayahOrderExecution.allTypes.push(new DerayahOrderExecution(DerayahOrderExecutionType.Market, 'سعر السوق'));
            DerayahOrderExecution.allTypes.push(new DerayahOrderExecution(DerayahOrderExecutionType.Limit, 'سعر محدد'));
        }

        return DerayahOrderExecution.allTypes;
    }


    public static getExecutionByType(type:DerayahOrderExecutionType):DerayahOrderExecution{
        return DerayahOrderExecution.getAllTypes().find(item => item.type == type);
    }

    public static getExecutionByTypeAsString(type:number):DerayahOrderExecution{
        return DerayahOrderExecution.getExecutionByType(type);
    }
}

export enum DerayahOrderExecutionType{
    Limit = 5,
    Market = 7
}
