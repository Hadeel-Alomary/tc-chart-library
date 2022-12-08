
export class DerayahOrderDetailsActionTypeWrapper{

    private static allTypes:DerayahOrderDetailsActionTypeWrapper[] = [];

    constructor(
        public type:DerayahOrderDetailsActionType,
        public name:string
    ){}

    private static getAllTypes():DerayahOrderDetailsActionTypeWrapper[]{
        if(DerayahOrderDetailsActionTypeWrapper.allTypes.length == 0){
            DerayahOrderDetailsActionTypeWrapper.allTypes.push(new DerayahOrderDetailsActionTypeWrapper(DerayahOrderDetailsActionType.New, 'جديد'));
            DerayahOrderDetailsActionTypeWrapper.allTypes.push(new DerayahOrderDetailsActionTypeWrapper(DerayahOrderDetailsActionType.Modify, 'معدل'));
            DerayahOrderDetailsActionTypeWrapper.allTypes.push(new DerayahOrderDetailsActionTypeWrapper(DerayahOrderDetailsActionType.MainModify, 'معدل'));
            DerayahOrderDetailsActionTypeWrapper.allTypes.push(new DerayahOrderDetailsActionTypeWrapper(DerayahOrderDetailsActionType.Cancel, 'ملغي'));
            DerayahOrderDetailsActionTypeWrapper.allTypes.push(new DerayahOrderDetailsActionTypeWrapper(DerayahOrderDetailsActionType.Execution, 'منفذ'));
        }

        return DerayahOrderDetailsActionTypeWrapper.allTypes
    }

    private static fromType(type:DerayahOrderDetailsActionType){
        return DerayahOrderDetailsActionTypeWrapper.getAllTypes().find(item => item.type == type);
    }

    public static getTypeByTypeAsString(type:number):DerayahOrderDetailsActionTypeWrapper{
        return DerayahOrderDetailsActionTypeWrapper.fromType(type);
    }
}

export enum DerayahOrderDetailsActionType{
    New = 1,
    Modify = 2,
    MainModify = 3,
    Cancel = 4,
    Execution = 6
}
