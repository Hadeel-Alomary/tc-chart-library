import { DerayahOrderStatusGroupType } from './derayah-order-status-group';
import { Tc } from '../../../../utils/index';
var DerayahOrderStatus = (function () {
    function DerayahOrderStatus(type, name) {
        this.type = type;
        this.name = name;
    }
    DerayahOrderStatus.getAllStatus = function () {
        if (!DerayahOrderStatus.allStatus) {
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
    };
    DerayahOrderStatus.getStatusByType = function (type) {
        return DerayahOrderStatus.getAllStatus().find(function (item) { return item.type == type; });
    };
    DerayahOrderStatus.getStatusByTypeAsString = function (type) {
        return DerayahOrderStatus.getStatusByType(type);
    };
    DerayahOrderStatus.editableStatus = function (type) {
        switch (type) {
            case DerayahOrderStatusType.New:
            case DerayahOrderStatusType.DefaultOpen:
            case DerayahOrderStatusType.Open:
            case DerayahOrderStatusType.ActivePurchaseOrSaleEquityInternetOrder:
            case DerayahOrderStatusType.PartiallyExecuted:
                return true;
            default:
                return false;
        }
    };
    DerayahOrderStatus.filterStatusType = function (type, statusGroupType) {
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
    };
    return DerayahOrderStatus;
}());
export { DerayahOrderStatus };
export var DerayahOrderStatusType;
(function (DerayahOrderStatusType) {
    DerayahOrderStatusType[DerayahOrderStatusType["Open"] = 1] = "Open";
    DerayahOrderStatusType[DerayahOrderStatusType["StopOrCancelled"] = 2] = "StopOrCancelled";
    DerayahOrderStatusType[DerayahOrderStatusType["BackOfficeExecution"] = 3] = "BackOfficeExecution";
    DerayahOrderStatusType[DerayahOrderStatusType["FrontEndExecution"] = 4] = "FrontEndExecution";
    DerayahOrderStatusType[DerayahOrderStatusType["OrderAlreadyPartiallyExecuted"] = 5] = "OrderAlreadyPartiallyExecuted";
    DerayahOrderStatusType[DerayahOrderStatusType["CancelRemainingQuantityForPartialExecution"] = 6] = "CancelRemainingQuantityForPartialExecution";
    DerayahOrderStatusType[DerayahOrderStatusType["New"] = 9] = "New";
    DerayahOrderStatusType[DerayahOrderStatusType["DefaultOpen"] = 10] = "DefaultOpen";
    DerayahOrderStatusType[DerayahOrderStatusType["Cancelled"] = 11] = "Cancelled";
    DerayahOrderStatusType[DerayahOrderStatusType["Executed"] = 12] = "Executed";
    DerayahOrderStatusType[DerayahOrderStatusType["PartiallyExecuted"] = 13] = "PartiallyExecuted";
    DerayahOrderStatusType[DerayahOrderStatusType["Rejected"] = 16] = "Rejected";
    DerayahOrderStatusType[DerayahOrderStatusType["ActivePurchaseOrSaleEquityInternetOrder"] = 17] = "ActivePurchaseOrSaleEquityInternetOrder";
    DerayahOrderStatusType[DerayahOrderStatusType["CancelledPurchaseOrSaleEquityOrder"] = 18] = "CancelledPurchaseOrSaleEquityOrder";
    DerayahOrderStatusType[DerayahOrderStatusType["FullyExecutedInternetOrder"] = 19] = "FullyExecutedInternetOrder";
    DerayahOrderStatusType[DerayahOrderStatusType["PartiallyExecutedInternetOrder"] = 20] = "PartiallyExecutedInternetOrder";
    DerayahOrderStatusType[DerayahOrderStatusType["BackOfficeExecutedOrder"] = 21] = "BackOfficeExecutedOrder";
    DerayahOrderStatusType[DerayahOrderStatusType["Expired"] = 22] = "Expired";
    DerayahOrderStatusType[DerayahOrderStatusType["PartiallyFilledCancelled"] = 23] = "PartiallyFilledCancelled";
    DerayahOrderStatusType[DerayahOrderStatusType["PartiallyFilledExpired"] = 24] = "PartiallyFilledExpired";
    DerayahOrderStatusType[DerayahOrderStatusType["ExecutedRejected"] = 25] = "ExecutedRejected";
    DerayahOrderStatusType[DerayahOrderStatusType["PartiallyFilledRejected"] = 26] = "PartiallyFilledRejected";
})(DerayahOrderStatusType || (DerayahOrderStatusType = {}));
//# sourceMappingURL=derayah-order-status.js.map