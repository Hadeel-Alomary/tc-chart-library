import {Injectable, OnDestroy} from '@angular/core';
import {TradestationLoaderService} from '../../loader/trading/tradestation';
import {TradestationAuthorizeResponse} from '../../loader/trading/tradestation/tradestation-loader.service';
import {TradestationStateService} from '../../state/trading/tradestation';
import {TradestationAccountType} from './tradestation-account-type';
import {Loader, Market} from '../../loader';
import {Tc} from '../../../utils';
import {TradestationHttpClientService} from './tradestation.http-client-service';
import {TradestationClientService} from './tradestation-client-service';
import {TradestationLogoutService} from './tradestation-logout-service';
import {LoaderConfig, LoaderUrlType} from '../../loader/loader';
import {TradestationAccountsService} from './tradestation-accounts-service';

@Injectable()
export class TradestationService implements OnDestroy{

    private isReadyMarketsManager: boolean = false;
    private isOAuthWindowListenerStarted: boolean = false;
    public tradestationIntegrationLink: string;

    private timerId: number;

    constructor(private tradestationLoaderService: TradestationLoaderService,
                private tradestationLogoutService: TradestationLogoutService,
                private tradestationClientService: TradestationClientService,
                private tradestationStateService: TradestationStateService,
                private tradestationAccountsService: TradestationAccountsService,
                private tradestationHttpClientService: TradestationHttpClientService,
                private loader:Loader) {

        this.loader.getMarketStream().subscribe((market: Market) => {
            if(market.abbreviation == 'USA'){
                this.isReadyMarketsManager = true;
                this.autoRefresh();
            }
        });

        this.loader.getConfigStream()
            .subscribe((loaderConfig:LoaderConfig) => {
                if(loaderConfig){
                    this.onLoaderConfig(loaderConfig);
                }
            });
    }

    private onLoaderConfig(loaderConfig:LoaderConfig): void{
        this.tradestationIntegrationLink = LoaderConfig.url(loaderConfig, LoaderUrlType.TradestationIntegrationLink);
    }

    private autoRefresh() {
        Tc.assert(this.timerId == null, "already auto-refresh timer is set");
        this.timerId = window.setInterval(() => {
            this.loadTradestationData();
        } , 5 * 1000)
    }

    public clearRefreshTimer(): void {
        window.clearInterval(this.timerId);
        this.timerId = null;
    }

    public reSetRefreshTimer(): void {
        this.autoRefresh();
    }

    private startOauthWindowListener() {
        window.addEventListener('message', (event: MessageEvent) => {
            let code = event.data;
            if (code) {
                this.tradestationLoaderService.getAccessToken(code).subscribe((response: TradestationAuthorizeResponse) => {
                    if (response.access_token) {
                        this.tradestationStateService.setTradestationToken(response.access_token);
                        this.tradestationStateService.setTradestationUserId(response.userid);
                        this.tradestationStateService.setTradestationRefreshToken(response.refresh_token);
                        this.tradestationStateService.enableTradestationSession();
                        this.loadTradestationData(true);
                    }
                });
            }
        });
    }

    public getToken(): string {
        return this.tradestationStateService.getTradestationToken();
    }

    public activate(): void {
        if(this.getToken() && this.getValidSession()){
            this.loadTradestationData();
        } else {
           this.tradestationLogoutService.showLogInPage();
        }
    }

    public tradestationConnection(accountType: TradestationAccountType): void {
        if(!this.isOAuthWindowListenerStarted) {
            this.isOAuthWindowListenerStarted = true;
            this.startOauthWindowListener();
        }

        this.tradestationStateService.setTradestationAccountType(accountType);
        window.open(this.tradestationLoaderService.getLogInPageLink(), '_blank');
    }

    public loadTradestationData(callIntegrationLink:boolean = false) {
        if(this.isReadyMarketsManager && this.getValidSession()){
            //Ehab if not ready MarketsManager this will cause loading Tradestation data before companies names being ready.
            this.tradestationAccountsService.loadAccountsData(callIntegrationLink,this.tradestationIntegrationLink);
        }
    }

    public deactiveTradestation(): void {
        this.tradestationStateService.reset();
        this.tradestationAccountsService.deActivateSessionStream();
    }

    public isSupportedMarket(): boolean {
        return true;
    }

    public getValidSession(): boolean {
        return this.tradestationStateService.isValidTradestationSession();
    }

    ngOnDestroy(): void {
        if (this.timerId) {
            this.clearRefreshTimer();
        }
    }
}
