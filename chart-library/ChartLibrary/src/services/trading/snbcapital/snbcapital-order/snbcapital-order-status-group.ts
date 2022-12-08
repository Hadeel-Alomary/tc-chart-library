

export class SnbcapitalOrderStatusGroup{

    private static allGroups:SnbcapitalOrderStatusGroup[] = [];

    private static allActions:{name:string, id:number}[] =[];

    constructor(
        public type:SnbcapitalOrderStatusGroupType,
        public name:string
    ){}

    public static getAllGroups():SnbcapitalOrderStatusGroup[]{
        if(SnbcapitalOrderStatusGroup.allGroups.length == 0){
            SnbcapitalOrderStatusGroup.allGroups.push(new SnbcapitalOrderStatusGroup(SnbcapitalOrderStatusGroupType.All, 'الكل'));
            SnbcapitalOrderStatusGroup.allGroups.push(new SnbcapitalOrderStatusGroup(SnbcapitalOrderStatusGroupType.Active, 'فعال'));
            SnbcapitalOrderStatusGroup.allGroups.push(new SnbcapitalOrderStatusGroup(SnbcapitalOrderStatusGroupType.Filled, 'منفذ'));
            SnbcapitalOrderStatusGroup.allGroups.push(new SnbcapitalOrderStatusGroup(SnbcapitalOrderStatusGroupType.Cancelled, 'ملغي'));
        }

        return SnbcapitalOrderStatusGroup.allGroups;
    }

    public static getByType(type:SnbcapitalOrderStatusGroupType):SnbcapitalOrderStatusGroup{
        return SnbcapitalOrderStatusGroup.getAllGroups().find(item => item.type == type);
    }

}

export enum SnbcapitalOrderStatusGroupType{
    All = 0,
    Active = 1,
    Filled = 2,
    Cancelled = 3
}
