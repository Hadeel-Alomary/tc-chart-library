import {BehaviorSubject, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Tc, TcTracker,} from '../../../utils/';

import {
    VirtualTradingAccount,
    VirtualTradingCurrency,
    VirtualTradingTransaction
} from './virtual-trading-models';
import {VirtualTradingLoader} from '../../loader/trading/virtual-trading/virtual-trading-loader.service';
import {ChannelRequestType, SharedChannel} from '../../shared-channel';
import {Market} from '../../loader';
import {Streamer} from '../../streaming/streamer';
import {VirtualTradingNotificationMethods} from '../../notification';


@Injectable()
export class VirtualTradingService {

    private accountStream: BehaviorSubject<VirtualTradingAccount>;
    private account: VirtualTradingAccount;

    constructor(
        private virtualTradingLoaderService: VirtualTradingLoader,
        private sharedChannel: SharedChannel,
        private streamer: Streamer) {

        this.account = null;

        this.accountStream = new BehaviorSubject(null);
    }

    private login(): Observable<void> {
        // let username = this.credentialsStateService.username;
        // let password = this.credentialsStateService.password;
        // return this.virtualTradingLoaderService.login(username, password);
	  return this.virtualTradingLoaderService.login(null, null);
    }

    private loadAccount(): Observable<VirtualTradingAccount> {
        return this.virtualTradingLoaderService.getAccounts().pipe(
            map(accounts => {
                if(accounts.length == 0) {
                    return null; // no account is created yet
                }
                Tc.assert(accounts.length == 1, "multi vt accounts exist")
                this.account = accounts[0];
                return accounts[0];
            })
        );
    }

    public createVirtualTradingAccount(capital: number, commission: number, currency: string, name: string, language: string): Observable<null> {
        return this.virtualTradingLoaderService.createVirtualTradingAccount(capital, commission, currency, name, language).pipe(
            map(() => {
                this.loadAccount().subscribe(() => {
                    Tc.assert(this.account != null, "account must be created");
                    this.virtualTradingLoaderService.setNotificationMethods(
                        this.account.id,
                        new VirtualTradingNotificationMethods()
                    ).subscribe();
                    this.onConnectToVirtualTrading();
                });
                return null;
            })
        );
    }

    public deleteVirtualTradingAccount(): Observable<null> {
        return this.virtualTradingLoaderService.deleteVirtualTradingAccount(this.account.id);
    }

    public updateAccountName(name: string): Observable<null> {

        return this.virtualTradingLoaderService.updateAccountName(this.account.id, name).pipe(
            tap(() => this.refreshState())
        );
    }

    public updateAccountCommission(commission: number): Observable<null> {

        return this.virtualTradingLoaderService.updateAccountCommission(this.account.id, commission).pipe(
            tap(() => this.refreshState())
        );
    }

    public updateAccountCapital(action: string, amount: number, date: string): Observable<null> {

        return this.virtualTradingLoaderService.updateAccountCapital(this.account.id, action, amount, date).pipe(
            tap(() => this.refreshState())
        );
    }

    public getAccountTransactions(): Observable<VirtualTradingTransaction[]> {

        return this.virtualTradingLoaderService.getAccountTransactions(this.account.id);
    }

    public refreshState(): void {
        this.loadAccount().subscribe(
            account => {
                this.accountStream.next(account);
            }
        );
    }

    public activateSettings(): void {
        this.login().subscribe(
            () => {
                TcTracker.trackConnectedToVirtualTrading();
                this.loadAccount().subscribe(() => {
                    this.connect();
                    // this.streamer.getGeneralPurposeStreamer().subscribeVirtualTrading(this.credentialsStateService.username);
				  this.streamer.getGeneralPurposeStreamer().subscribeVirtualTrading(null);
                });
            }
        );
    }

    public getAccount():VirtualTradingAccount {
        return this.account;
    }

    public setNotificationMethods(methods: VirtualTradingNotificationMethods): Observable<null> {
        return this.virtualTradingLoaderService.setNotificationMethods(this.account.id, methods).pipe(
            tap(() => this.refreshState())
        );
    }

    private onConnectToVirtualTrading(): void {
        this.accountStream.next(this.account);
    }

    public disconnectFromVirtualTrading(): void {
        this.accountStream.next(null);
    }

    public getAccountStream(): BehaviorSubject<VirtualTradingAccount>{
        return this.accountStream;
    }

    private connect() {
        if(this.account) {
            this.onConnectToVirtualTrading();
        } else {
            let channelRequest = {
                type: ChannelRequestType.VirtualTradingConnect,
                resetMode: false
            };
            this.sharedChannel.request(channelRequest);
        }
    }

    public isSupportedMarket(market: Market) {
        if(market.abbreviation === "FRX") {
            return false;
        }
        return VirtualTradingCurrency.getMarketCurrency(market.abbreviation).code == this.account.currency;
    }
}


