import {TradestationAccountResponse} from '../../../loader/trading/tradestation/tradestation-loader.service';

export class TradestationAccount {
    name: string;
    key: number;

    public static mapResponseToTradestationAccount(response: TradestationAccountResponse): TradestationAccount {
        return {
            name: response.Name,
            key: response.Key,
        };
    }

}
