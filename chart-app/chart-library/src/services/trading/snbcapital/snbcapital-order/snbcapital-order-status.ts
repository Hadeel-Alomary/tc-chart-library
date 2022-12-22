import {SnbcapitalOrderStatusGroupType} from './snbcapital-order-status-group';
import {Tc} from '../../../../utils/index';
import {SnbcapitalOrder} from './snbcapital-order';
export class SnbcapitalOrderStatus {

    private static allStatus: SnbcapitalOrderStatus[];

    constructor(
        public type: SnbcapitalOrderStatusType,
        public name: string
    ) {
    }


    public static getAllStatus():SnbcapitalOrderStatus[]{
        if(!SnbcapitalOrderStatus.allStatus){
            SnbcapitalOrderStatus.allStatus = [];
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.ToBeSentToMarket, 'سوف يتم ارساله للسوق'));
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.Annulled, 'ملغي'));
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.SentToMarket, 'تم ارساله للسوق'));
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.RefusedByMarket, 'مرفوض من السوق'));
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.PartiallyExecuted, 'منفذ جزئيا'));
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.CancellationExecuted, 'تم الإلغاء'));
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.AcceptedOnMarket, 'تم قبوله في السوق'));
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.Expired, 'غير منفذ'));
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.TotallyExecuted, 'منفذ كليا'));
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.OrderChanged, 'تم تغيير الأمر'));
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.Killed, 'ملغى'));
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.Suspended, 'معلق'));
            SnbcapitalOrderStatus.allStatus.push(new SnbcapitalOrderStatus(SnbcapitalOrderStatusType.PartiallyKilled, 'ملغى جزئيا'));

        }

        return SnbcapitalOrderStatus.allStatus;
    }

    public static getStatusByType(type: SnbcapitalOrderStatusType): SnbcapitalOrderStatus {
        return SnbcapitalOrderStatus.getAllStatus().find(item => item.type == type);
    }


    public static editableStatus(order: SnbcapitalOrder): boolean {
        return order.quantityCanBeChanged || order.expiryDateCanBeModified || order.priceCanBeModified;
    }

    public static cancelableStatus(order: SnbcapitalOrder): boolean {
        return order.isOpen;
    }

    public static filterStatusType(order: SnbcapitalOrder,statusGroupType: SnbcapitalOrderStatusGroupType): boolean {
        if(statusGroupType == SnbcapitalOrderStatusGroupType.All){
            let isTodayOrder = moment(new Date()).format('YYYY-MM-DD') == order.date;
            return  order.isOpen || isTodayOrder;
        }else if(statusGroupType == SnbcapitalOrderStatusGroupType.Active){
            return order.isOpen;
        } else if (statusGroupType == SnbcapitalOrderStatusGroupType.Cancelled) {
            let type = order.status.type;
            return type == SnbcapitalOrderStatusType.RefusedByMarket ||
                type == SnbcapitalOrderStatusType.Annulled ||
                type == SnbcapitalOrderStatusType.Expired ||
                type == SnbcapitalOrderStatusType.Killed ||
                type == SnbcapitalOrderStatusType.CancellationExecuted;
        }else if(statusGroupType == SnbcapitalOrderStatusGroupType.Filled) {
            return order.status.type == SnbcapitalOrderStatusType.TotallyExecuted;
        }



    }

    public static getOrderStatus(status: number): SnbcapitalOrderStatus {
        switch (status) {
            case 1:
            case 37:
                return this.getStatusByType(SnbcapitalOrderStatusType.ToBeSentToMarket);
            case 2:
                return this.getStatusByType(SnbcapitalOrderStatusType.Annulled);
            case 3:
            case 31:
                return this.getStatusByType(SnbcapitalOrderStatusType.SentToMarket);
            case 10:
            case 4:
                return this.getStatusByType(SnbcapitalOrderStatusType.AcceptedOnMarket);
            case 11:
            case 12:
            case 13:
                return this.getStatusByType(SnbcapitalOrderStatusType.RefusedByMarket);
            case 14:
            case 15:
            case 20:
            case 21:
                return this.getStatusByType(SnbcapitalOrderStatusType.PartiallyExecuted);
            case 16:
                return this.getStatusByType(SnbcapitalOrderStatusType.CancellationExecuted);
            case 17:
                return this.getStatusByType(SnbcapitalOrderStatusType.Expired);
            case 18:
                return this.getStatusByType(SnbcapitalOrderStatusType.TotallyExecuted);
            case 25:
                return this.getStatusByType(SnbcapitalOrderStatusType.OrderChanged);
            case 26:
                return this.getStatusByType(SnbcapitalOrderStatusType.Killed);
            case 27:
                return this.getStatusByType(SnbcapitalOrderStatusType.Suspended);
            case 32:
                return this.getStatusByType(SnbcapitalOrderStatusType.PartiallyKilled);
            default:
                Tc.error('unknown status type' + status);

        }
    }

}

export enum SnbcapitalOrderStatusType {
    All,
    ToBeSentToMarket, //1, 37
    Annulled, //2 (order cancelled before sending it to the market)
    SentToMarket, //3, 31
    AcceptedOnMarket, //10
    RefusedByMarket, //11, 12, 13
    PartiallyExecuted, //14, 15, 20, 21
    CancellationExecuted, //16
    Expired, //17
    TotallyExecuted, // 18
    OrderChanged, //25
    Killed, //26
    Suspended, //27
    PartiallyKilled, //32
}
