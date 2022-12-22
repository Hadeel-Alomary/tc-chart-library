

export class DerayahOrderStatusGroup{

    private static allGroups:DerayahOrderStatusGroup[] = [];

    private static allActions:{name:string, id:number}[] =[];

    constructor(
        public type:DerayahOrderStatusGroupType,
        public name:string
    ){}

    public static getAllGroups():DerayahOrderStatusGroup[]{
        if(DerayahOrderStatusGroup.allGroups.length == 0){
            DerayahOrderStatusGroup.allGroups.push(new DerayahOrderStatusGroup(DerayahOrderStatusGroupType.All, 'الكل'));
            DerayahOrderStatusGroup.allGroups.push(new DerayahOrderStatusGroup(DerayahOrderStatusGroupType.OutStanding, 'قائم'));
            DerayahOrderStatusGroup.allGroups.push(new DerayahOrderStatusGroup(DerayahOrderStatusGroupType.Executed, 'المنفذ'));
            DerayahOrderStatusGroup.allGroups.push(new DerayahOrderStatusGroup(DerayahOrderStatusGroupType.Closed, 'المغلق'));
        }

        return DerayahOrderStatusGroup.allGroups;
    }

    public static getByType(type:DerayahOrderStatusGroupType):DerayahOrderStatusGroup{
        return DerayahOrderStatusGroup.getAllGroups().find(item => item.type == type);
    }

}

export enum DerayahOrderStatusGroupType{
    All = 0,
    OutStanding,
    Executed,
    Closed
}