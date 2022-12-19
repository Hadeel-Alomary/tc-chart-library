var VirtualTradingOrderActionType = (function () {
    function VirtualTradingOrderActionType(value, arabic, english) {
        this.value = value;
        this.arabic = arabic;
        this.english = english;
    }
    VirtualTradingOrderActionType.fromValue = function (value) {
        switch (value) {
            case 'NEW':
                return VirtualTradingOrderActionType.allOrderActionTypes.NEW;
            case 'DELETE':
                return VirtualTradingOrderActionType.allOrderActionTypes.DELETE;
            case 'UPDATE':
                return VirtualTradingOrderActionType.allOrderActionTypes.UPDATE;
            case 'EXECUTE':
                return VirtualTradingOrderActionType.allOrderActionTypes.EXECUTE;
            case 'REJECT':
                return VirtualTradingOrderActionType.allOrderActionTypes.REJECT;
            default:
                return null;
        }
    };
    VirtualTradingOrderActionType.allOrderActionTypes = {
        NEW: new VirtualTradingOrderActionType('NEW', 'إنشاء', 'New'),
        DELETE: new VirtualTradingOrderActionType('DELETE', 'حذف', 'Delete'),
        UPDATE: new VirtualTradingOrderActionType('UPDATE', 'تعديل', 'Update'),
        EXECUTE: new VirtualTradingOrderActionType('EXECUTE', 'تنفيذ', 'Execute'),
        REJECT: new VirtualTradingOrderActionType('REJECT', 'رفض', 'Reject'),
    };
    return VirtualTradingOrderActionType;
}());
export { VirtualTradingOrderActionType };
//# sourceMappingURL=virtual-trading-order-action-type.js.map