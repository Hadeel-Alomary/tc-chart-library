import {Tc} from '../../../../utils';

export enum TradestationOrdersGroupedStatus {
    ALL,
    ACTIVE,
    INACTIVE,
    FILLED,
    CANCELED,
    REJECTED
}

export enum TradestationOrderStatusType {
    OPN = 'OPN',
    ACK = 'ACK',
    UCN = 'UCN',
    FLL = 'FLL',
    FLP = 'FLP',
    FPR = 'FPR',
    OUT = 'OUT',
    REJ = 'REJ',
    EXP = 'EXP',
    BRO = 'BRO',
    CAN = 'CAN',
    LAT = 'LAT',
    DON = 'DON',
}

export class TradestationOrderStatus{

    constructor(
        public value:TradestationOrdersGroupedStatus,
        public arabic:string,
        public english: string
    ){}

    private static groupedOrderStatus: {[key: string]: TradestationOrderStatus} = {
        ALL: new TradestationOrderStatus(TradestationOrdersGroupedStatus.ALL , 'الجميع', 'All'),
        ACTIVE: new TradestationOrderStatus(TradestationOrdersGroupedStatus.ACTIVE, 'قائم / مستلم', 'Active / Queued'),
        INACTIVE: new TradestationOrderStatus(TradestationOrdersGroupedStatus.INACTIVE, 'غير مفعل', 'InActive'),
        FILLED: new TradestationOrderStatus(TradestationOrdersGroupedStatus.FILLED, 'منفذ' , 'Filled'),
        CANCELED: new TradestationOrderStatus(TradestationOrdersGroupedStatus.CANCELED, 'ملغي' , 'Canceled'),
        REJECTED: new TradestationOrderStatus(TradestationOrdersGroupedStatus.REJECTED, 'مرفوض' , 'Rejected')
    }

    public static fromValue(value: TradestationOrderStatusType): TradestationOrderStatus {
        switch (value) {
            case TradestationOrderStatusType.OPN:
            case TradestationOrderStatusType.ACK:
            case TradestationOrderStatusType.UCN:
            case TradestationOrderStatusType.DON:
                return TradestationOrderStatus.groupedOrderStatus.ACTIVE;
            case TradestationOrderStatusType.BRO:
            case TradestationOrderStatusType.LAT:
            case TradestationOrderStatusType.EXP:
                return TradestationOrderStatus.groupedOrderStatus.INACTIVE;
            case TradestationOrderStatusType.FLL:
            case TradestationOrderStatusType.FLP:
            case TradestationOrderStatusType.FPR:
                return TradestationOrderStatus.groupedOrderStatus.FILLED;
            case TradestationOrderStatusType.OUT:
            case TradestationOrderStatusType.CAN:
                return TradestationOrderStatus.groupedOrderStatus.CANCELED;
            case TradestationOrderStatusType.REJ:
                return TradestationOrderStatus.groupedOrderStatus.REJECTED;
            default:
                Tc.error('unknown value' + value);
        }
    }

    public static getGroupTypeOfOrderStatus(value: TradestationOrdersGroupedStatus): TradestationOrderStatus {
        switch (value) {
            case TradestationOrdersGroupedStatus.ALL:
                return TradestationOrderStatus.groupedOrderStatus.ALL;
            case TradestationOrdersGroupedStatus.ACTIVE:
                return TradestationOrderStatus.groupedOrderStatus.ACTIVE;
            case TradestationOrdersGroupedStatus.INACTIVE:
                return TradestationOrderStatus.groupedOrderStatus.INACTIVE;
            case TradestationOrdersGroupedStatus.FILLED:
                return TradestationOrderStatus.groupedOrderStatus.FILLED;
            case TradestationOrdersGroupedStatus.CANCELED:
                return TradestationOrderStatus.groupedOrderStatus.CANCELED;
            case TradestationOrdersGroupedStatus.REJECTED:
                return TradestationOrderStatus.groupedOrderStatus.REJECTED;
            default:
                Tc.error('unknown type' + value);
        }
    }

    public static allGroupsOfOrderStatus(): TradestationOrderStatus[] {
        let result: TradestationOrderStatus[] = [];

        for (let key in TradestationOrderStatus.groupedOrderStatus) {
            result.push(TradestationOrderStatus.groupedOrderStatus[key]);
        }
        return result;
    }

}
