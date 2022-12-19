var VirtualTradingTransactionActionType = (function () {
    function VirtualTradingTransactionActionType(value, arabic, english) {
        this.value = value;
        this.arabic = arabic;
        this.english = english;
    }
    VirtualTradingTransactionActionType.fromValue = function (value) {
        switch (value) {
            case 'CREDIT':
                return VirtualTradingTransactionActionType.transactionActionTypes.CREDIT;
            case 'DEBIT':
                return VirtualTradingTransactionActionType.transactionActionTypes.DEBIT;
            default:
                return null;
        }
    };
    VirtualTradingTransactionActionType.allTransactionActionTypes = function () {
        return [
            VirtualTradingTransactionActionType.transactionActionTypes.CREDIT,
            VirtualTradingTransactionActionType.transactionActionTypes.DEBIT
        ];
    };
    VirtualTradingTransactionActionType.transactionActionTypes = {
        CREDIT: new VirtualTradingTransactionActionType('CREDIT', 'إيداع', 'Credit'),
        DEBIT: new VirtualTradingTransactionActionType('DEBIT', 'سحب', 'Debit'),
    };
    return VirtualTradingTransactionActionType;
}());
export { VirtualTradingTransactionActionType };
//# sourceMappingURL=virtual-trading-transaction-action-type.js.map