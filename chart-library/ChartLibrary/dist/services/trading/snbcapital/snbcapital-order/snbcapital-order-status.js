import { SnbcapitalOrderStatusGroupType } from './snbcapital-order-status-group';
import { Tc } from '../../../../utils/index';
var SnbcapitalOrderStatus = (function () {
    function SnbcapitalOrderStatus(type, name) {
        this.type = type;
        this.name = name;
    }
    SnbcapitalOrderStatus.getAllStatus = function () {
        if (!SnbcapitalOrderStatus.allStatus) {
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
    };
    SnbcapitalOrderStatus.getStatusByType = function (type) {
        return SnbcapitalOrderStatus.getAllStatus().find(function (item) { return item.type == type; });
    };
    SnbcapitalOrderStatus.editableStatus = function (order) {
        return order.quantityCanBeChanged || order.expiryDateCanBeModified || order.priceCanBeModified;
    };
    SnbcapitalOrderStatus.cancelableStatus = function (order) {
        return order.isOpen;
    };
    SnbcapitalOrderStatus.filterStatusType = function (order, statusGroupType) {
        if (statusGroupType == SnbcapitalOrderStatusGroupType.All) {
            var isTodayOrder = moment(new Date()).format('YYYY-MM-DD') == order.date;
            return order.isOpen || isTodayOrder;
        }
        else if (statusGroupType == SnbcapitalOrderStatusGroupType.Active) {
            return order.isOpen;
        }
        else if (statusGroupType == SnbcapitalOrderStatusGroupType.Cancelled) {
            var type = order.status.type;
            return type == SnbcapitalOrderStatusType.RefusedByMarket ||
                type == SnbcapitalOrderStatusType.Annulled ||
                type == SnbcapitalOrderStatusType.Expired ||
                type == SnbcapitalOrderStatusType.Killed ||
                type == SnbcapitalOrderStatusType.CancellationExecuted;
        }
        else if (statusGroupType == SnbcapitalOrderStatusGroupType.Filled) {
            return order.status.type == SnbcapitalOrderStatusType.TotallyExecuted;
        }
    };
    SnbcapitalOrderStatus.getOrderStatus = function (status) {
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
    };
    return SnbcapitalOrderStatus;
}());
export { SnbcapitalOrderStatus };
export var SnbcapitalOrderStatusType;
(function (SnbcapitalOrderStatusType) {
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["All"] = 0] = "All";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["ToBeSentToMarket"] = 1] = "ToBeSentToMarket";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["Annulled"] = 2] = "Annulled";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["SentToMarket"] = 3] = "SentToMarket";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["AcceptedOnMarket"] = 4] = "AcceptedOnMarket";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["RefusedByMarket"] = 5] = "RefusedByMarket";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["PartiallyExecuted"] = 6] = "PartiallyExecuted";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["CancellationExecuted"] = 7] = "CancellationExecuted";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["Expired"] = 8] = "Expired";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["TotallyExecuted"] = 9] = "TotallyExecuted";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["OrderChanged"] = 10] = "OrderChanged";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["Killed"] = 11] = "Killed";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["Suspended"] = 12] = "Suspended";
    SnbcapitalOrderStatusType[SnbcapitalOrderStatusType["PartiallyKilled"] = 13] = "PartiallyKilled";
})(SnbcapitalOrderStatusType || (SnbcapitalOrderStatusType = {}));
//# sourceMappingURL=snbcapital-order-status.js.map