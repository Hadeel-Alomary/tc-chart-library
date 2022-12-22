export class VirtualTradingTransactionActionType {
    constructor(
        public value: string,
        public arabic: string,
        public english: string
    ){}

    private static transactionActionTypes = {
        CREDIT: new VirtualTradingTransactionActionType('CREDIT', 'إيداع', 'Credit'),
        DEBIT: new VirtualTradingTransactionActionType('DEBIT', 'سحب', 'Debit'),
    };

    public static fromValue(value: string): VirtualTradingTransactionActionType {
        switch (value) {
            case 'CREDIT':
                return VirtualTradingTransactionActionType.transactionActionTypes.CREDIT;
            case 'DEBIT':
                return VirtualTradingTransactionActionType.transactionActionTypes.DEBIT;
            default:
                return null;
        }
    }

    public static allTransactionActionTypes(): VirtualTradingTransactionActionType[] {
        return [
            VirtualTradingTransactionActionType.transactionActionTypes.CREDIT,
            VirtualTradingTransactionActionType.transactionActionTypes.DEBIT
        ];
    }

}
