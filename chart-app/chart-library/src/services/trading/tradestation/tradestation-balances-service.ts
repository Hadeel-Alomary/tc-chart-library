import {Injectable} from '@angular/core';
import {TradestationService} from './tradestation.service';
import {TradestationBalance} from './tradestation-balance/tradestation-balance';
import {BehaviorSubject, Observable} from 'rxjs';
import {TradestationBalanceResponse,TradestationLoaderService} from '../../loader/trading/tradestation/tradestation-loader.service';
import {TradestationStateService} from '../../state/trading/tradestation';
import {map} from 'rxjs/operators';
import {TradestationAccountsService} from './tradestation-accounts-service';
import {TradestationAccount} from './tradestation-accounts';
import {Market} from "@src/services";

@Injectable()
export class TradestationBalancesService {

    private balancesStream: BehaviorSubject<TradestationBalance[]>;
    private balances: TradestationBalance[] = [];

    constructor(private tradestationService: TradestationService, private tradestationLoaderService: TradestationLoaderService, private tradestationStateService: TradestationStateService,
               private tradestationAccountsService:TradestationAccountsService) {
        this.balancesStream = new BehaviorSubject([]);

        this.tradestationAccountsService.getAccountStream().subscribe(() => {
            this.refreshBalances();
        });
    }

    public refreshBalances(): void {
        this.getBalances().subscribe(response => this.onBalances(response));
    }

    public getBalances(): Observable<TradestationBalance[]> {
        return this.tradestationLoaderService.getBalances().pipe(
            map((response: TradestationBalanceResponse[]) => this.mapBalances(response)));
    }

    private mapBalances(response: TradestationBalanceResponse[]): TradestationBalance[] {
        if(response.length == 0)
            return null;

        let tradestationBalance: TradestationBalance[] = [];
        // let market = this.marketsManager.getMarketByAbbreviation('USA');
       let market :Market = null;

        response.forEach(res => {
            let balance = TradestationBalance.mapResponseToTradestationBalance(res, market);
            tradestationBalance.push(balance);
        });

        return tradestationBalance;
    }

    private onBalances(response: TradestationBalance[]): void {
        this.balances = response;
        this.balancesStream.next(this.balances);
    }

    public getAccountBalance(account: TradestationAccount): TradestationBalance {
        let balance: TradestationBalance = this.balances.find(balance => balance.name == account.name);
        return balance;
    }

    public getBalancesStream(): BehaviorSubject<TradestationBalance[]> {
        return this.balancesStream;
    }

}
