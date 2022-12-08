import {Injectable} from '@angular/core';
import {TradestationAccount} from './tradestation-accounts/tradestation-account';
import {interval, Subject} from 'rxjs';
import {TradestationAccountResponse, TradestationLoaderService} from '../../loader/trading/tradestation/tradestation-loader.service';
import { TradestationStateService } from '../../state/trading/tradestation/tradestation-state.service';

@Injectable()
export class TradestationAccountsService {
    private accountsStream: Subject<TradestationAccount[]>;
    private sessionStream: Subject<boolean>;
    private accounts : TradestationAccount[] = [];
    private accountsKeys: number[] = [];

    constructor(private tradestationStateService: TradestationStateService, private tradestationLoaderService: TradestationLoaderService){
        this.accountsStream = new Subject();
        this.sessionStream = new Subject();
    }

    public loadAccountsData(callIntegrationLink: boolean, integrationLink: string) {
        this.tradestationLoaderService.getAccounts(this.getUserId()).subscribe((response: TradestationAccountResponse[]) => {
            if (this.getValidSession()) {
                this.handleNeededAccounts(response);
                this.setTradestationAccountKeys();
                this.setDefaultAccount(this.getDefaultAccount());
                if (callIntegrationLink) {
                    this.callIntegrationLink(integrationLink);
                }
                this.sessionStream.next(true);
                this.accountsStream.next(this.accounts);
            }
        });
    }

    private callIntegrationLink(integrationLink: string) {
        this.tradestationLoaderService.callTradestationIntegrationLink(integrationLink, this.accounts.length)
            .subscribe(() => {}, error => {});
    }

    private getUserId():string {
        return this.tradestationStateService.getTradestationUserId();
    }

    private getValidSession(): boolean {
        return this.tradestationStateService.isValidTradestationSession();
    }

    private handleNeededAccounts(accountsResponse: TradestationAccountResponse[]) {
        let neededAccounts: TradestationAccount[] = [];
        let accountsKeys: number[] = [];
        accountsResponse.forEach(account => {
            let tradestationAccount: TradestationAccount = TradestationAccount.mapResponseToTradestationAccount(account);
            //Ehab Margin or Cash accounts only are needed
            if(account.Type == 'M' || account.Type == 'C') {
                neededAccounts.push(tradestationAccount);
                accountsKeys.push(tradestationAccount.key);
            }
        });

        this.accounts = neededAccounts;
        this.accountsKeys = accountsKeys;
    }

    private setTradestationAccountKeys() {
        this.tradestationStateService.setTradestationAccountKeys(this.accountsKeys);
    }

    public getDefaultAccount() {
        let defaultAccount = this.tradestationStateService.getTradestationDefaultAccount();
        if(defaultAccount){
            let isStillValidAccount = this.accounts.find(account => account.key == defaultAccount.key);
            if(isStillValidAccount){
                return defaultAccount;
            }
        }

        return this.accounts[0];
    }

    public getAccounts():TradestationAccount[] {
        return this.accounts;
    }

    public getAccountStream() {
        return this.accountsStream;
    }

    public getSessionStream(): Subject<boolean> {
        return this.sessionStream;
    }

    public deActivateSessionStream(): void {
        this.sessionStream.next(false);
    }

    public setDefaultAccount(account: TradestationAccount) {
        this.tradestationStateService.setTradestationDefaultAccount(account);
    }
}
