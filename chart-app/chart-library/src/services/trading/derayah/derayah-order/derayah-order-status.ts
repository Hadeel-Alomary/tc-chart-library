import {DerayahOrderStatusGroupType} from './derayah-order-status-group';
import {Tc} from '../../../../utils/index';

export class DerayahOrderStatus{

    private static allStatus:DerayahOrderStatus[];

    constructor(
        public type:DerayahOrderStatusType,
        public name:string
    ){}


    public static getAllStatus():DerayahOrderStatus[]{
        if(!DerayahOrderStatus.allStatus){
            DerayahOrderStatus.allStatus = [];
            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.New, 'جديد'));

            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.DefaultOpen, 'قائم'));
            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.Open, 'قائم'));
            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.ActivePurchaseOrSaleEquityInternetOrder, 'قائم'));

            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.Cancelled, 'ملغي'));
            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.StopOrCancelled, 'ملغي'));
            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.CancelledPurchaseOrSaleEquityOrder, 'ملغي'));

            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.Executed, 'منفذ'));
            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.BackOfficeExecution, 'منفذ'));
            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.FrontEndExecution, 'منفذ'));
            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.BackOfficeExecutedOrder, 'منفذ'));
            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.FullyExecutedInternetOrder, 'منفذ'));

            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.Expired, 'منتهي الصلاحية'));

            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.Rejected, 'مرفوض'));

            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.PartiallyExecuted, 'منفذ جزئيا'));
            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.OrderAlreadyPartiallyExecuted, 'منفذ جزئيا'));
            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.PartiallyExecutedInternetOrder, 'منفذ جزئيا'));

            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.CancelRemainingQuantityForPartialExecution, 'منفذ جزئيا - المتبقي ملغي'));
            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.PartiallyFilledCancelled, 'منفذ جزئيا - المتبقي ملغي'));

            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.PartiallyFilledExpired, 'منفذ جزئيا - المتبقي منتهي الصلاحية'));

            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.ExecutedRejected, 'ملغي التنفيذ'));

            DerayahOrderStatus.allStatus.push(new DerayahOrderStatus(DerayahOrderStatusType.PartiallyFilledRejected, 'ملغي التنفيذ جزئيا'));

        }

        return DerayahOrderStatus.allStatus;
    }

    public static getStatusByType(type:DerayahOrderStatusType):DerayahOrderStatus{
        return DerayahOrderStatus.getAllStatus().find(item => item.type == type);
    }

    public static getStatusByTypeAsString(type:number):DerayahOrderStatus{
        return DerayahOrderStatus.getStatusByType(type);
    }

    public static editableStatus(type:DerayahOrderStatusType):boolean{
        switch (type){
            case DerayahOrderStatusType.New:
            case DerayahOrderStatusType.DefaultOpen:
            case DerayahOrderStatusType.Open:
            case DerayahOrderStatusType.ActivePurchaseOrSaleEquityInternetOrder:
            case DerayahOrderStatusType.PartiallyExecuted:
                return true;
            default:
                return false;
        }
    }

    public static filterStatusType(type:DerayahOrderStatusType, statusGroupType:DerayahOrderStatusGroupType):boolean {
        if (statusGroupType == DerayahOrderStatusGroupType.All) {
            return true;
        }
        switch (type) {
            case DerayahOrderStatusType.New:
            case DerayahOrderStatusType.DefaultOpen:
            case DerayahOrderStatusType.Open:
            case DerayahOrderStatusType.ActivePurchaseOrSaleEquityInternetOrder:
                return statusGroupType == DerayahOrderStatusGroupType.OutStanding;
            case DerayahOrderStatusType.Executed:
            case DerayahOrderStatusType.BackOfficeExecution:
            case DerayahOrderStatusType.FrontEndExecution:
            case DerayahOrderStatusType.BackOfficeExecutedOrder:
            case DerayahOrderStatusType.FullyExecutedInternetOrder:
            case DerayahOrderStatusType.OrderAlreadyPartiallyExecuted:
            case DerayahOrderStatusType.PartiallyExecutedInternetOrder:
                return statusGroupType == DerayahOrderStatusGroupType.Executed;
            case DerayahOrderStatusType.Expired:
            case DerayahOrderStatusType.Cancelled:
            case DerayahOrderStatusType.StopOrCancelled:
            case DerayahOrderStatusType.CancelledPurchaseOrSaleEquityOrder:
            case DerayahOrderStatusType.Rejected:
            case DerayahOrderStatusType.CancelRemainingQuantityForPartialExecution:
            case DerayahOrderStatusType.PartiallyFilledCancelled:
            case DerayahOrderStatusType.PartiallyFilledExpired:
            case DerayahOrderStatusType.ExecutedRejected:
            case DerayahOrderStatusType.PartiallyFilledRejected:
                return statusGroupType == DerayahOrderStatusGroupType.Closed;
            case DerayahOrderStatusType.PartiallyExecuted:
                return statusGroupType == DerayahOrderStatusGroupType.Executed || statusGroupType == DerayahOrderStatusGroupType.OutStanding;
            default:
                Tc.error('Unknown derayah order status type : ' + type);
        }
    }
}


export enum DerayahOrderStatusType{
    Open = 1,
    StopOrCancelled = 2,
    BackOfficeExecution = 3,
    FrontEndExecution = 4,
    OrderAlreadyPartiallyExecuted = 5,
    CancelRemainingQuantityForPartialExecution = 6,
    New = 9,
    DefaultOpen = 10,
    Cancelled = 11,
    Executed = 12,
    PartiallyExecuted = 13,
    Rejected = 16,
    ActivePurchaseOrSaleEquityInternetOrder = 17,
    CancelledPurchaseOrSaleEquityOrder = 18,
    FullyExecutedInternetOrder = 19,
    PartiallyExecutedInternetOrder = 20,
    BackOfficeExecutedOrder = 21,
    Expired = 22,
    PartiallyFilledCancelled = 23,
    PartiallyFilledExpired = 24,
    ExecutedRejected = 25,
    PartiallyFilledRejected = 26
}
