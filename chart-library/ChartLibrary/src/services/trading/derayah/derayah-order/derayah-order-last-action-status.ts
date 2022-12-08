

export class DerayahOrderLastActionStatus{

    private static allStatus:DerayahOrderLastActionStatus[] = [];


    constructor(
        public type:DerayahOrderLastActionStatusType,
        public name:string,
        public serverName:string
    ){}



    public static getAllStatus():DerayahOrderLastActionStatus[]{
        if(DerayahOrderLastActionStatus.allStatus.length == 0){
            DerayahOrderLastActionStatus.allStatus.push(new DerayahOrderLastActionStatus(DerayahOrderLastActionStatusType.NotSentToExchangeCode, 'تحت المعاينة', 'N'));
            DerayahOrderLastActionStatus.allStatus.push(new DerayahOrderLastActionStatus(DerayahOrderLastActionStatusType.FetchedToBeSentToExchangeCode, 'أرسلت', 'Y'));
            DerayahOrderLastActionStatus.allStatus.push(new DerayahOrderLastActionStatus(DerayahOrderLastActionStatusType.AcknowledgeAfterFetch, 'أرسلت', 'K'));
            DerayahOrderLastActionStatus.allStatus.push(new DerayahOrderLastActionStatus(DerayahOrderLastActionStatusType.SendToExchangeCode, 'تم  القبول', 'A'));
            DerayahOrderLastActionStatus.allStatus.push(new DerayahOrderLastActionStatus(DerayahOrderLastActionStatusType.Rejected, 'رفضت', 'R'));
            DerayahOrderLastActionStatus.allStatus.push(new DerayahOrderLastActionStatus(DerayahOrderLastActionStatusType.Void, 'ملغي', 'V'));
        }

        return DerayahOrderLastActionStatus.allStatus;
    }


    public static getStatusByType(type:DerayahOrderLastActionStatusType):DerayahOrderLastActionStatus{
        return DerayahOrderLastActionStatus.getAllStatus().find(item => item.type == type);
    }

    public static getStatusByServerName(serverName:string):DerayahOrderLastActionStatus{
        return DerayahOrderLastActionStatus.getAllStatus().find(item => item.serverName == serverName);
    }

}

export enum DerayahOrderLastActionStatusType{
    NotSentToExchangeCode,
    FetchedToBeSentToExchangeCode,
    AcknowledgeAfterFetch,
    SendToExchangeCode,
    Rejected,
    Void
}