import {throwError as observableThrowError, BehaviorSubject, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable, OnDestroy} from '@angular/core';
import {DerayahStateService, CredentialsStateService} from '../../state/index';
import {DerayahLoaderService} from '../../loader/index';
import {DerayahPortfolio} from './derayah-order/index';
import {Tc, TcTracker,} from '../../../utils/index';
import {DerayahError, DerayahErrorService,} from './derayah-error.service';
import {Loader} from '../../loader/loader/index';
import {SharedChannel} from '../../shared-channel';
import {DerayahAuthorizeResponse, DerayahHttpResponse, DerayahPurchasePowerResponse, PortfolioQueueResponse} from '../../loader/trading/derayah-loader/derayah-loader.service';
import {DerayahLogoutService} from './derayah-logout.service';
import {LoaderConfig, LoaderUrlType} from '../../loader/loader';
import {DerayahStreamer} from '../../streaming/streamer/trading/derayah/derayah-streamer';
import {DerayahPortfolioQueue} from './derayah-order/derayah-portfolio';

const find = require('lodash/find');
const clone = require('lodash/clone');

@Injectable()
export class DerayahService implements OnDestroy {

    derayahStreamerUrl: string = '';
    private derayahStreamer: DerayahStreamer;

    /* derayah state properties */

    public get token(): string {
        return this.derayahStateService.getDerayahToken();
    }

    public get connected(): boolean {
        return this.token != null;
    }

    public get portfolios(): DerayahPortfolio[] {
        return this.derayahStateService.getDerayahPortfolios();
    }

    public get validSession(): boolean {
        return this.derayahStateService.isValidDerayahSession();
    }

    private portfoliosStream: BehaviorSubject<DerayahPortfolio[]>;

    private cancelBrokerSelectionStream: Subject<void>;

    constructor(private derayahLoaderService: DerayahLoaderService,
                private derayahStateService: DerayahStateService,
                private derayahErrorService: DerayahErrorService,
                private loader: Loader,
                private credentialsStateService: CredentialsStateService,
                private sharedChannel: SharedChannel,
                private derayahLogoutService: DerayahLogoutService,
    ) {

        this.portfoliosStream = new BehaviorSubject(null);
        this.cancelBrokerSelectionStream = new Subject();

        this.derayahStreamer = new DerayahStreamer();

        this.derayahStreamer.getDerayahNotificationTimeOutStream()
            .subscribe(() => this.onNotificationStreamerHeartbeatTimeout());

        this.derayahStreamer.getDerayahNotFoundQueueStream()
            .subscribe(() => this.onNotFoundQueueId());

        this.derayahLogoutService.getLogoutStream()
            .subscribe(() => this.disconnectDerayahStreamer());

        this.loader.getConfigStream()
            .subscribe((loaderConfig: LoaderConfig) => {
                if (loaderConfig) {
                    this.onLoaderConfig(loaderConfig);
                }
            });
    }

    private onLoaderConfig(loaderConfig: LoaderConfig): void {
        this.derayahStreamerUrl = 'https://' + LoaderConfig.url(loaderConfig, LoaderUrlType.DerayahNotifications) + '/streamhub/';
    }

    public getToken(): string {
        return this.derayahStateService.getDerayahToken();
    }

    public StartOAuthConnection() {
        this.startOauthWindowListener();

        window.open(this.derayahLoaderService.getLoginPageLink(), '_blank');
    }

    private startOauthWindowListener() {
        window.addEventListener('message', (event: MessageEvent) => {
            let code = event.data;
            if (code) {
                this.derayahLoaderService.getAccessToken(code).subscribe((response: DerayahAuthorizeResponse) => {
                    if (response.access_token) {
                        this.derayahStateService.setDerayahToken(response.access_token);
                        this.derayahStateService.setDerayahRefreshToken(response.refresh_token);
                        this.derayahStateService.enableDerayahSession();
                        this.derayahStreamer.start(this.derayahStreamerUrl);
                        this.refreshPortfolios(true);
                    }
                });
            }
        });
    }

    public activate(isReconnectMode: boolean): void {
        if (this.getToken() && this.validSession) {
            //Ehab There is token here --> reconnection mode
            TcTracker.trackConnectedToDerayah();
            this.derayahStreamer.start(this.derayahStreamerUrl);
            this.refreshPortfolios(false);
        } else {
            this.derayahLogoutService.showLogInPage(isReconnectMode);
        }
    }

    public deactivate(): void {
        this.disconnectFromDerayah();
    }

    /* portfolios */

    public refreshPortfolios(callIntegrationLink: boolean): void {
        this.getPortfolios()
            .subscribe(
                response => this.onPortfolios(response, callIntegrationLink),
                error => {
                }
            );
    }

    private onPortfolios(response: DerayahResponse, callIntegrationLink: boolean): void {
        let portfolios: DerayahPortfolio[] = <DerayahPortfolio[]>response.result;
        this.derayahStateService.setDerayahPortfolios(portfolios);
        if (callIntegrationLink) {
            this.callDerayahIntegration(portfolios.length);
        }

        let getQueueIdsFromStorage: boolean = this.isAllPortfoliosQueueIdsFound();
        this.handleDerayahTopicSubscriptions(getQueueIdsFromStorage);

        this.portfoliosStream.next(portfolios);
    }

    private isAllPortfoliosQueueIdsFound(){
        let portfolios = this.portfolios;
        let portfoliosQueue = this.derayahStateService.getDerayahPortfoliosQueue() || [];

        let portfoliosNumbers: string[] = portfolios.map(portfolio => portfolio.portfolioNumber);
        let portfoliosQueueNumbers: string[] = portfoliosQueue.map(portfolio => portfolio.portfolioNumber);

        for(let portfoliosNumber of portfoliosNumbers){
            if(portfoliosQueueNumbers.indexOf(portfoliosNumber) == -1){
                return false;//Storage not containing queue id for this portfolio
            }
        }

        return true;
    }

    public callDerayahIntegration(portfolioNum: number) {
        this.derayahLoaderService.callDerayahIntegrationLink(portfolioNum)
            .subscribe(() => {
            }, error => {
            });
    }

    /* http methods */
    public getDerayahPurchasePower(portfolio: string, exchangeCode: number, symbol: string): Observable<DerayahResponse> {
        return this.derayahLoaderService.getDerayahPurchasePower(portfolio, exchangeCode, symbol).pipe(
            map((response: DerayahHttpResponse) => this.mapPurchasePower(response)));
    }

    private getPortfolios(): Observable<DerayahResponse> {
        return this.derayahLoaderService.getPortfolios().pipe(
            map((response: DerayahHttpResponse) => {
                return {result: clone(response.data)};
            }));
    }

    public getPortfolioQueue(portfolioId: string): Observable<PortfolioQueue> {
        return this.derayahLoaderService.getPortfolioQueue(portfolioId).pipe(
            map((response: PortfolioQueueResponse) => {
                return {data: response.data};
            }));
    }

    /* map methods */

    public disconnectFromDerayah() {
        this.disconnectDerayahStreamer();
        this.derayahStateService.reset();
        this.portfoliosStream.next(this.portfolios);
    }

    private mapPurchasePower(response: DerayahHttpResponse): DerayahResponse {
        let result = response.data as DerayahPurchasePowerResponse;
        return {result: {purchasePower: +result.purchasepower, currencyType: +result.ppcurrency}};
    }

    /* Streams */

    public getPortfoliosStream(): BehaviorSubject<DerayahPortfolio[]> {
        return this.portfoliosStream;
    }

    public getPortfolioName(portfolioNumber: string) {
        let portfolio: DerayahPortfolio = find(this.portfolios, (portfolio: DerayahPortfolio) => portfolio.portfolioNumber == portfolioNumber);
        Tc.assert(portfolio != null, 'Cannot find portfolio with number ' + portfolioNumber);
        return portfolio.portfolioName;
    }

    public onResponse(response: DerayahHttpResponse) {
        if (!response['isSuccess']) {
            let error: DerayahError = this.derayahErrorService.extractErrorResponse(response);
            if (error.expiredSession) {
                this.derayahStateService.disableDerayahSession();
            }
            this.derayahErrorService.onError(error);
            throw observableThrowError(error);
        }
        return response;
    }

    //Topic
    private handleDerayahTopicSubscriptions(getQueueIdsFromStorage: boolean) {
        if(getQueueIdsFromStorage){
            //No need to get new Queue IDs get Queue IDs from storage
            this.subscribeToDerayahTopics(this.getStoragePortfoliosQueueIds());
            TcTracker.trackMessage('subscribe derayah topics from storage: ' + JSON.stringify(this.getStoragePortfoliosQueueIds()));
        } else {
            //Call Derayah streamer queue url
            let portfoliosQueueIds: DerayahPortfolioQueue[] = [];

            this.portfolios.forEach((portfolio: DerayahPortfolio) => {
                this.getPortfolioQueue(portfolio.portfolioNumber).subscribe((queue: PortfolioQueue) => {
                    TcTracker.trackMessage('get derayah portfolio queue id: ' + portfolio.portfolioNumber);

                    if(queue.data) {
                        portfoliosQueueIds.push({portfolioNumber: portfolio.portfolioNumber, portfolioQueueId: queue.data});
                    } else {
                        TcTracker.trackMessage('derayah queue id is null for portfolio id: ' + portfolio.portfolioNumber);
                    }

                    if(portfoliosQueueIds.length == this.portfolios.length) {//all portfolios received
                        this.derayahStateService.setDerayahPortfoliosQueue(portfoliosQueueIds);

                        let storagePortfoliosQueueIds: string[] = portfoliosQueueIds.map(portfoliosQueue => portfoliosQueue.portfolioQueueId);
                        this.subscribeToDerayahTopics(storagePortfoliosQueueIds);
                        TcTracker.trackMessage('subscribe derayah topics: ' + JSON.stringify(storagePortfoliosQueueIds));
                    }
                });

            });
        }
    }

    private getStoragePortfoliosQueueIds(): string[] {
        let storagePortfoliosQueue = this.derayahStateService.getDerayahPortfoliosQueue();
        if(!storagePortfoliosQueue){
            return [];
        }
        let portfoliosQueueNumbers: string[] = storagePortfoliosQueue.map(portfolio => portfolio.portfolioQueueId);
        return portfoliosQueueNumbers;
    }

    private subscribeToDerayahTopics(derayahPortfolioQueueIds: string[]){
        for(let portfolioQueueId of derayahPortfolioQueueIds) {
            this.derayahStreamer.subscribeDerayahTopic(portfolioQueueId, this.credentialsStateService.username);
        }
    }

    disconnectDerayahStreamer() {
        this.derayahStreamer.unSubscribederayahTopics(this.getStoragePortfoliosQueueIds(), this.credentialsStateService.username);
        this.derayahStreamer.disconnect();
    }

    onNotificationStreamerHeartbeatTimeout() {
        this.disconnectDerayahStreamer();
        this.derayahStreamer.start(this.derayahStreamerUrl);

        let getQueueIdsFromStorage: boolean = true;
        this.handleDerayahTopicSubscriptions(getQueueIdsFromStorage);
    }

    //Abu5, for unknown reasons, some clients log show that they are keep calling 'create new queue' successively forever
    //below code is to make sure that the client is allowed to create queue just for _maxAllowedTriesToCreateNewQueue value
    private _maxAllowedTriesToCreateNewQueue: number = 10;
    private _currentTryToCreateQueueIndex : number = 0;
    private _notFoundQueueInProgress: boolean = false;
    onNotFoundQueueId() {
        if (!this._notFoundQueueInProgress && this._currentTryToCreateQueueIndex < this._maxAllowedTriesToCreateNewQueue) {
            this._notFoundQueueInProgress = true;
            this._currentTryToCreateQueueIndex++;

            window.setTimeout(() => {
                this.derayahStreamer.unSubscribederayahTopics(this.getStoragePortfoliosQueueIds(), this.credentialsStateService.username);
                let getQueueIdsFromStorage: boolean = false;
                this.handleDerayahTopicSubscriptions(getQueueIdsFromStorage);
                this._notFoundQueueInProgress = false;
            }, 5000); // Abu5, in case the user has multiple portfolios, then to prevent handling not found queue messages many times
        }
    }

    getDerayahStreamer(): DerayahStreamer {
        return this.derayahStreamer;
    }

    public getCancelBrokerSelectionStream(): Subject<void> {
        return this.cancelBrokerSelectionStream;
    }

    onCancelConnection(): void {
        this.cancelBrokerSelectionStream.next();
    }

    ngOnDestroy() {
    }
}

export interface DerayahResponse {
    result: unknown;
}

export interface PortfolioQueue {
    data: string
}
