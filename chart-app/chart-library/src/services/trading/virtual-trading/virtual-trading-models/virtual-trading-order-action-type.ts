export class VirtualTradingOrderActionType {
    constructor(
        public value: string,
        public arabic: string,
        public english: string
    ){}

    private static allOrderActionTypes = {
        NEW: new VirtualTradingOrderActionType('NEW', 'إنشاء', 'New'),
        DELETE: new VirtualTradingOrderActionType('DELETE', 'حذف', 'Delete'),
        UPDATE: new VirtualTradingOrderActionType('UPDATE', 'تعديل', 'Update'),
        EXECUTE: new VirtualTradingOrderActionType('EXECUTE', 'تنفيذ', 'Execute'),
        REJECT: new VirtualTradingOrderActionType('REJECT', 'رفض', 'Reject'),
    };

    public static fromValue(value: string): VirtualTradingOrderActionType {
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
    }
}
