import {VirtualTradingTransactionActionType} from './virtual-trading-transaction-action-type';
import {VirtualTradingTransactionResponse} from '../../../loader/trading/virtual-trading';

export class VirtualTradingTransaction {

    constructor(
        public id: number,
        public transactionDate: string,
        public actionType: VirtualTradingTransactionActionType,
        public amount: number,
        public tradingAccountId: number,
        public orderId: number,
        public symbol: string,
        public name: string,
        public quantity: number,
        public market: string
    ) {}

    public static mapResponseToVirtualTradingTransactions(response: VirtualTradingTransactionResponse[]): VirtualTradingTransaction[] {
        let result: VirtualTradingTransaction[] = [];
        for (let responseObject of response) {

            let symbol = null;
            let name = null;
            if(responseObject.trading_order_id) {
                symbol = `${responseObject.symbol}.${responseObject.market}`;
                // name = marketsManager.getCompanyBySymbol(symbol).name;
              name = null;
            }
            result.push(new VirtualTradingTransaction(
                responseObject.id,
                responseObject.transaction_date,
                VirtualTradingTransactionActionType.fromValue(responseObject.transaction_action),
                responseObject.amount,
                responseObject.trading_account_id,
                responseObject.trading_order_id,
                symbol,
                name,
                responseObject.quantity,
                responseObject.market
            ));
        }
        return result;
    }
}
