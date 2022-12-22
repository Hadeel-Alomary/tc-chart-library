
export class SnbcapitalOrderDetailsActionTypeWrapper{

    private static allTypes:SnbcapitalOrderDetailsActionTypeWrapper[] = [];

    constructor(
        public type:SnbcapitalOrderDetailsActionType,
        public name:string
    ){}

    private static getAllTypes():SnbcapitalOrderDetailsActionTypeWrapper[]{
        if(SnbcapitalOrderDetailsActionTypeWrapper.allTypes.length == 0){
            SnbcapitalOrderDetailsActionTypeWrapper.allTypes.push(new SnbcapitalOrderDetailsActionTypeWrapper(SnbcapitalOrderDetailsActionType.New, 'جديد'));
            SnbcapitalOrderDetailsActionTypeWrapper.allTypes.push(new SnbcapitalOrderDetailsActionTypeWrapper(SnbcapitalOrderDetailsActionType.Modify, 'معدل'));
            SnbcapitalOrderDetailsActionTypeWrapper.allTypes.push(new SnbcapitalOrderDetailsActionTypeWrapper(SnbcapitalOrderDetailsActionType.MainModify, 'معدل'));
            SnbcapitalOrderDetailsActionTypeWrapper.allTypes.push(new SnbcapitalOrderDetailsActionTypeWrapper(SnbcapitalOrderDetailsActionType.Cancel, 'ملغي'));
            SnbcapitalOrderDetailsActionTypeWrapper.allTypes.push(new SnbcapitalOrderDetailsActionTypeWrapper(SnbcapitalOrderDetailsActionType.Execution, 'منفذ'));
        }

        return SnbcapitalOrderDetailsActionTypeWrapper.allTypes
    }

    private static fromType(type:SnbcapitalOrderDetailsActionType){
        return SnbcapitalOrderDetailsActionTypeWrapper.getAllTypes().find(item => item.type == type);
    }

    public static getTypeByTypeAsString(type:string):SnbcapitalOrderDetailsActionTypeWrapper{
        return SnbcapitalOrderDetailsActionTypeWrapper.fromType(+type);
    }
}

export enum SnbcapitalOrderDetailsActionType{
    New = 1,
    Modify = 2,
    MainModify = 3,
    Cancel = 4,
    Execution = 6
}
