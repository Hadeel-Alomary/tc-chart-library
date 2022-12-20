import { VirtualTradingTransactionActionType } from './virtual-trading-transaction-action-type';
var VirtualTradingTransaction = (function () {
    function VirtualTradingTransaction(id, transactionDate, actionType, amount, tradingAccountId, orderId, symbol, name, quantity, market) {
        this.id = id;
        this.transactionDate = transactionDate;
        this.actionType = actionType;
        this.amount = amount;
        this.tradingAccountId = tradingAccountId;
        this.orderId = orderId;
        this.symbol = symbol;
        this.name = name;
        this.quantity = quantity;
        this.market = market;
    }
    VirtualTradingTransaction.mapResponseToVirtualTradingTransactions = function (response) {
        var result = [];
        for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
            var responseObject = response_1[_i];
            var symbol = null;
            var name_1 = null;
            if (responseObject.trading_order_id) {
                symbol = responseObject.symbol + "." + responseObject.market;
                name_1 = null;
            }
            result.push(new VirtualTradingTransaction(responseObject.id, responseObject.transaction_date, VirtualTradingTransactionActionType.fromValue(responseObject.transaction_action), responseObject.amount, responseObject.trading_account_id, responseObject.trading_order_id, symbol, name_1, responseObject.quantity, responseObject.market));
        }
        return result;
    };
    return VirtualTradingTransaction;
}());
export { VirtualTradingTransaction };
//# sourceMappingURL=virtual-trading-transaction.js.map