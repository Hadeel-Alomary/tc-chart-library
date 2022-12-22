

export class SnbcapitalOrderLastActionStatus{

    private static allStatus:SnbcapitalOrderLastActionStatus[] = [];


    constructor(
        public type:SnbcapitalOrderLastActionStatusType,
        public name:string,
        public serverName:string
    ){}



    public static getAllStatus():SnbcapitalOrderLastActionStatus[]{
        if(SnbcapitalOrderLastActionStatus.allStatus.length == 0){
            SnbcapitalOrderLastActionStatus.allStatus.push(new SnbcapitalOrderLastActionStatus(SnbcapitalOrderLastActionStatusType.NotSentToExchangeCode, 'تحت المعاينة', 'N'));
            SnbcapitalOrderLastActionStatus.allStatus.push(new SnbcapitalOrderLastActionStatus(SnbcapitalOrderLastActionStatusType.FetchedToBeSentToExchangeCode, 'أرسلت', 'Y'));
            SnbcapitalOrderLastActionStatus.allStatus.push(new SnbcapitalOrderLastActionStatus(SnbcapitalOrderLastActionStatusType.AcknowledgeAfterFetch, 'أرسلت', 'K'));
            SnbcapitalOrderLastActionStatus.allStatus.push(new SnbcapitalOrderLastActionStatus(SnbcapitalOrderLastActionStatusType.SendToExchangeCode, 'تم  القبول', 'A'));
            SnbcapitalOrderLastActionStatus.allStatus.push(new SnbcapitalOrderLastActionStatus(SnbcapitalOrderLastActionStatusType.Rejected, 'رفضت', 'R'));
            SnbcapitalOrderLastActionStatus.allStatus.push(new SnbcapitalOrderLastActionStatus(SnbcapitalOrderLastActionStatusType.Void, 'ملغي', 'V'));
        }

        return SnbcapitalOrderLastActionStatus.allStatus;
    }


    public static getStatusByType(type:SnbcapitalOrderLastActionStatusType):SnbcapitalOrderLastActionStatus{
        return SnbcapitalOrderLastActionStatus.getAllStatus().find(item => item.type == type);
    }

    public static getStatusByServerName(serverName:string):SnbcapitalOrderLastActionStatus{
        return SnbcapitalOrderLastActionStatus.getAllStatus().find(item => item.serverName == serverName);
    }

}

export enum SnbcapitalOrderLastActionStatusType{
    NotSentToExchangeCode,
    FetchedToBeSentToExchangeCode,
    AcknowledgeAfterFetch,
    SendToExchangeCode,
    Rejected,
    Void
}
