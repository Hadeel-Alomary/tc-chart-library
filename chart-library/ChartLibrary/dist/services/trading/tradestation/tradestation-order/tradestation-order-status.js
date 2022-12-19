import { Tc } from '../../../../utils';
export var TradestationOrdersGroupedStatus;
(function (TradestationOrdersGroupedStatus) {
    TradestationOrdersGroupedStatus[TradestationOrdersGroupedStatus["ALL"] = 0] = "ALL";
    TradestationOrdersGroupedStatus[TradestationOrdersGroupedStatus["ACTIVE"] = 1] = "ACTIVE";
    TradestationOrdersGroupedStatus[TradestationOrdersGroupedStatus["INACTIVE"] = 2] = "INACTIVE";
    TradestationOrdersGroupedStatus[TradestationOrdersGroupedStatus["FILLED"] = 3] = "FILLED";
    TradestationOrdersGroupedStatus[TradestationOrdersGroupedStatus["CANCELED"] = 4] = "CANCELED";
    TradestationOrdersGroupedStatus[TradestationOrdersGroupedStatus["REJECTED"] = 5] = "REJECTED";
})(TradestationOrdersGroupedStatus || (TradestationOrdersGroupedStatus = {}));
export var TradestationOrderStatusType;
(function (TradestationOrderStatusType) {
    TradestationOrderStatusType["OPN"] = "OPN";
    TradestationOrderStatusType["ACK"] = "ACK";
    TradestationOrderStatusType["UCN"] = "UCN";
    TradestationOrderStatusType["FLL"] = "FLL";
    TradestationOrderStatusType["FLP"] = "FLP";
    TradestationOrderStatusType["FPR"] = "FPR";
    TradestationOrderStatusType["OUT"] = "OUT";
    TradestationOrderStatusType["REJ"] = "REJ";
    TradestationOrderStatusType["EXP"] = "EXP";
    TradestationOrderStatusType["BRO"] = "BRO";
    TradestationOrderStatusType["CAN"] = "CAN";
    TradestationOrderStatusType["LAT"] = "LAT";
    TradestationOrderStatusType["DON"] = "DON";
})(TradestationOrderStatusType || (TradestationOrderStatusType = {}));
var TradestationOrderStatus = (function () {
    function TradestationOrderStatus(value, arabic, english) {
        this.value = value;
        this.arabic = arabic;
        this.english = english;
    }
    TradestationOrderStatus.fromValue = function (value) {
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
    };
    TradestationOrderStatus.getGroupTypeOfOrderStatus = function (value) {
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
    };
    TradestationOrderStatus.allGroupsOfOrderStatus = function () {
        var result = [];
        for (var key in TradestationOrderStatus.groupedOrderStatus) {
            result.push(TradestationOrderStatus.groupedOrderStatus[key]);
        }
        return result;
    };
    TradestationOrderStatus.groupedOrderStatus = {
        ALL: new TradestationOrderStatus(TradestationOrdersGroupedStatus.ALL, 'الجميع', 'All'),
        ACTIVE: new TradestationOrderStatus(TradestationOrdersGroupedStatus.ACTIVE, 'قائم / مستلم', 'Active / Queued'),
        INACTIVE: new TradestationOrderStatus(TradestationOrdersGroupedStatus.INACTIVE, 'غير مفعل', 'InActive'),
        FILLED: new TradestationOrderStatus(TradestationOrdersGroupedStatus.FILLED, 'منفذ', 'Filled'),
        CANCELED: new TradestationOrderStatus(TradestationOrdersGroupedStatus.CANCELED, 'ملغي', 'Canceled'),
        REJECTED: new TradestationOrderStatus(TradestationOrdersGroupedStatus.REJECTED, 'مرفوض', 'Rejected')
    };
    return TradestationOrderStatus;
}());
export { TradestationOrderStatus };
//# sourceMappingURL=tradestation-order-status.js.map