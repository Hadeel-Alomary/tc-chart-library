var VirtualTradingOrderStatus = (function () {
    function VirtualTradingOrderStatus(value, arabic, english) {
        this.value = value;
        this.arabic = arabic;
        this.english = english;
    }
    VirtualTradingOrderStatus.fromValue = function (value) {
        switch (value) {
            case 'ALL':
                return VirtualTradingOrderStatus.allOrderStatuses.ALL;
            case 'ACTIVE':
                return VirtualTradingOrderStatus.allOrderStatuses.ACTIVE;
            case 'DELETED':
            case 'EXPIRED':
                return VirtualTradingOrderStatus.allOrderStatuses.DELETED;
            case 'EXECUTED':
                return VirtualTradingOrderStatus.allOrderStatuses.EXECUTED;
            case 'REJECTED':
                return VirtualTradingOrderStatus.allOrderStatuses.REJECTED;
            default:
                return null;
        }
    };
    VirtualTradingOrderStatus.allStatuses = function () {
        var result = [];
        for (var key in VirtualTradingOrderStatus.allOrderStatuses) {
            result.push(VirtualTradingOrderStatus.allOrderStatuses[key]);
        }
        return result;
    };
    VirtualTradingOrderStatus.allOrderStatuses = {
        ALL: new VirtualTradingOrderStatus('ALL', 'الكل', 'All'),
        ACTIVE: new VirtualTradingOrderStatus('ACTIVE', 'مفعّل', 'Active'),
        DELETED: new VirtualTradingOrderStatus('DELETED', 'ملغي', 'Deleted'),
        EXECUTED: new VirtualTradingOrderStatus('EXECUTED', 'منفّذ', 'Executed'),
        REJECTED: new VirtualTradingOrderStatus('REJECTED', 'مرفوض', 'Rejected')
    };
    return VirtualTradingOrderStatus;
}());
export { VirtualTradingOrderStatus };
//# sourceMappingURL=virtual-trading-order-status.js.map