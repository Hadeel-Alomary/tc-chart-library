import {Injectable} from '@angular/core';
import {throwError as observableThrowError, BehaviorSubject, Subject, Observable} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {SnbcapitalPortfolio, SnbcapitalCurrencyInfo} from './snbcapital-order/index'
import {Tc, TcTracker} from '../../../utils/index';
import {SnbcapitalErrorService, SnbcapitalError, SnbcapitalErrorHttpResponse} from './snbcapital-error.service';
import {ChannelRequestType, SharedChannel} from '../../shared-channel';
import {SnbcapitalCashAccountResponse, SnbcapitalCurrency, SnbcapitalPortfoliosResponse, SnbcapitalSecuritySubAccountResponse, SnbcapitalRegisterApiResponse, SnbcapitalPurchasePowerResponse, SnbcapitalPositionResponse, SnbcapitalIntegrationTcLayerResponse, SnbcapitalLoginResponse, SnbcapitalWrongVerifyOtpResponse, SnbcapitalOrderResponse, SnbcapitalSuccessVerifyOtpResponse, SnbcapitalPreConfirmResponse, SnbcapitalUpdatePreConfirmOrderResponse, SnbcapitalUpdatedOrderResponse, SnbcapitalQuantityCalculationResponse, SnbcapitalLoaderService} from '../../loader/trading/snbcapital-loader/snbcapital-loader.service';
import {SnbcapitalSecurityAccountStatus} from './snbcapital-security-account-status';
import {RSA} from '../../../utils/RSA';
import {SnbcapitalHttpClientService} from './snbcapital-http-client-service';
import {SnbcapitalPurchasePowerStreamerMessage, SnbcapitalStreamer} from '../../streaming/streamer/trading/snbcapital/snbcapital-streamer';
import {TimeSpan} from '../../../stock-chart/StockChartX/Data/TimeFrame';
import {ConfirmationCaller, ConfirmationRequest} from "../../../services/shared-channel/channel-request";
import {LanguageService, SnbcapitalStateService} from "../../../services";

const find = require("lodash/find");

@Injectable()
export class SnbcapitalService {

    private snbCapitalPortfolios:SnbcapitalPortfolio[] = [];

    private useFastOrder: boolean = false;
    /* snbcapital state properties */

    public get portfolios():SnbcapitalPortfolio[]{
        return this.snbCapitalPortfolios;
    }

    public get validSession():boolean{
        return this.snbcapitalStateService.isValidSnbcapitalSession();
    }

    public get snbcapitalUserName():string{
        return this.snbcapitalStateService.getSnbcapitalUserName();
    }

    /* basic url */

    private dilUrl:string;

    /* streams */

    private portfoliosStream:BehaviorSubject<SnbcapitalPortfolio[]>;
    private purchasePowersStream:BehaviorSubject<{[portfolioId: string]: SnbcapitalPurchasePower}>;
    private purchasePowers: {[portfolioId: string]: SnbcapitalPurchasePower} = {};

    private showConnectScreenStream:Subject<null>;
    private cancelBrokerSelectionStream:Subject<void>;

    private disconnectStream:Subject<void>;

    private otpEnableEncryption: string;
    private otpPublicKeyModulus: string;
    private otpPublicKeyExponent: string;

    private snbcapitalStreamer: SnbcapitalStreamer;

    constructor(private snbcapitalLoaderService:SnbcapitalLoaderService,
                private snbcapitalStateService:SnbcapitalStateService,
                private snbcapitalErrorService:SnbcapitalErrorService,
                private snbcapitalHttpClientService: SnbcapitalHttpClientService,
                private sharedChannel: SharedChannel,
                private languageService: LanguageService){

        this.portfoliosStream = new BehaviorSubject(null);
        this.purchasePowersStream= new BehaviorSubject(null);
        this.showConnectScreenStream = new Subject();
        this.cancelBrokerSelectionStream = new Subject();
        this.disconnectStream = new Subject();

        this.snbcapitalStreamer = new SnbcapitalStreamer();

        this.snbcapitalStreamer.getSnbCapitalPurchasePowerStream()
            .subscribe((purchasePowerMessage: SnbcapitalPurchasePowerStreamerMessage) => {
                this.updatePurchasePower(purchasePowerMessage);
            });

        this.snbcapitalStreamer.getsnbcapitalNotificationTimeOutStream()
            .subscribe(()=> this.onNotificationStreamerHeartbeatTimeout());

        this.snbcapitalHttpClientService.getSessionExpiredStream()
            .subscribe(()=> {
                this.snbcapitalStreamer.disconnect();
                // if(this.loader.getSnbcapitalLoginInfo().subscribed){
                //     //Any time Snbcapital Subscriber session is expired => reload app
                //     let sessionExpiredMessage: string = this.snbcapitalErrorService.getSessionExpiredError().message;
                //     this.snbcapitalStateService.setSessionExpiredMessage(sessionExpiredMessage);
                //     this.sharedChannel.request({type: ChannelRequestType.Reload});
                // }
            });

    }

    public activate(): void {
        if(this.validSession){
            this.onSuccessLogin();
        } else {
            this.sharedChannel.request({type: ChannelRequestType.SnbcapitalConnect});
        }
    }

    public appLogout(){
        // this.credentialsStateService.logout();
        this.sharedChannel.request({type: ChannelRequestType.Reload});
    }

    /* portfolios */

    private refreshPortfolios():void {
        this.getPortfolios()
            .subscribe(
                response => this.onPortfolios(response),
                error => {}
            );
    }

    private onPortfolios(portfolios:SnbcapitalPortfolio[]):void{
        this.snbcapitalHttpClientService.setGbsCustomerCode(portfolios[0].gBSCustomerCode);
        this.snbCapitalPortfolios = portfolios;
        this.subscribeSnbcapitalTopic();
        this.loadPurchasePower()
        this.portfoliosStream.next(portfolios);
    }

    public refreshPortfolioAfterSecond(portfolio: SnbcapitalPortfolio) {
        setTimeout(() => {
            this.getSnbcapitalPurchasePower(portfolio).subscribe(purchasePower => {
                this.purchasePowers[portfolio.portfolioId] = purchasePower;
                this.purchasePowersStream.next(this.purchasePowers);
            });
            this.portfoliosStream.next([portfolio]);
        }, 1000);
    }

    /* http methods */

    public connectToSnbcapital(snbcapitalUserName:string, tickerchartPassword:string):Observable<SnbcapitalLoginResponse> {
        return this.snbcapitalLoaderService.connectToSnbcapital().pipe(
            switchMap((response: SnbcapitalIntegrationTcLayerResponse) => {
                let formattedPassword = response.EnablePasswordEncryption ? RSA.encrypt(tickerchartPassword, response.pk_mod, response.pk_exp) : tickerchartPassword;
                return this.snbcapitalLoaderService.callLogin(snbcapitalUserName, formattedPassword);
            }),
            catchError((error: HttpErrorResponse) => {

                let snbcapitalError: SnbcapitalError = {
                    expiredSession: false,
                    message: this.languageService.translate('مشكلة في الإتصال يرجى المحاولة مرة أخرى.'),
                };
                this.snbcapitalErrorService.onError(snbcapitalError);
                throw observableThrowError(error);
            }),

            map((response: SnbcapitalLoginResponse) => this.onResponse(response)),
            map((response: SnbcapitalLoginResponse) => this.onLoginResponse(response, snbcapitalUserName))
        );
    }

    public onLoginResponse(response: SnbcapitalLoginResponse, snbcapitalUserName:string){
        if(response.ReturnCode !== '0'){
            let error: SnbcapitalError = {message: response.msgDescription, expiredSession: false};
            this.snbcapitalErrorService.onError(error);
            throw observableThrowError(error);
        }
        this.otpEnableEncryption = response.EnablePasswordEncryption;
        this.otpPublicKeyModulus = response.pk_mod;
        this.otpPublicKeyExponent = response.pk_exp;

        this.snbcapitalStateService.setSnbcapitalUserName(snbcapitalUserName);

        if(response.ExecuteSecondStep == "false"){
            //No otp step needed i.e: success login
            this.onSuccessLogin();
        }

        return response;
    }

    public verify(mobileCode:string, password:string):Observable<SnbcapitalSuccessVerifyOtpResponse>{
        let formattedMobileCode = this.otpEnableEncryption ? RSA.encrypt(mobileCode, this.otpPublicKeyModulus, this.otpPublicKeyExponent) : mobileCode;
        let formattedPassword = this.otpEnableEncryption ? RSA.encrypt(password, this.otpPublicKeyModulus, this.otpPublicKeyExponent) : password;

        return this.snbcapitalLoaderService.verify(formattedMobileCode, this.snbcapitalStateService.getSnbcapitalUserName(), formattedPassword).pipe(
            map((response: SnbcapitalWrongVerifyOtpResponse|SnbcapitalSuccessVerifyOtpResponse) => this.onResponse(response)),
            map((response: SnbcapitalWrongVerifyOtpResponse|SnbcapitalSuccessVerifyOtpResponse) => this.onVerify(response)));
    }

    public disconnectFromSnbcapital():void{
        this.disconnectStream.next();
        this.getDisconnectFromSnbcapitalApi()
            .subscribe(() => {
                    this.onDisconnectFromSnbcapital();
                },
                error => {
                    this.onDisconnectFromSnbcapital();
                }
            );
    }

    public snbcapitalRegisterApi():Observable<SnbcapitalRegisterApiResponse>{
        return this.snbcapitalLoaderService.snbcapitalRegisterApi(this.snbcapitalUserName)
            .pipe(map((response: SnbcapitalRegisterApiResponse) => this.onRegisterApi(response)));
    }

    public loadPurchasePower() {
        let purchasePowers: {[portfolioId: string]: SnbcapitalPurchasePower} = {};
        for(let portfolio of this.portfolios) {
            this.getSnbcapitalPurchasePower(portfolio).subscribe(response => {
                purchasePowers[portfolio.portfolioId] = response;
                if(Object.keys(purchasePowers).length == this.portfolios.length) {
                    this.purchasePowers = purchasePowers;
                    this.purchasePowersStream.next(this.purchasePowers)
                }
            }, error => {})
        }
    }

    public getSnbcapitalPurchasePower(portfolio:SnbcapitalPortfolio):Observable<SnbcapitalPurchasePower>{
        return this.snbcapitalLoaderService.getSnbcapitalPurchasePower(portfolio).pipe(
            map((response: SnbcapitalPurchasePowerResponse|SnbcapitalErrorHttpResponse) => this.onResponse(response)),
            map((response: SnbcapitalPurchasePowerResponse) => this.mapPurchasePower(response)));
    }

    private updatePurchasePower(purchasePowerMessage: SnbcapitalPurchasePowerStreamerMessage){
        let portfolio = this.portfolios.find(portfolio => portfolio.cashAccountCode == purchasePowerMessage.cashAccountCode);
        this.purchasePowers[portfolio.portfolioId].purchasePower = purchasePowerMessage.purchasePower;
        this.purchasePowers[portfolio.portfolioId].currencyType = purchasePowerMessage.currencyType;
        this.purchasePowersStream.next(this.purchasePowers);
    }

    public getDisconnectFromSnbcapitalApi():Observable<{}>{
        return this.snbcapitalLoaderService.disconnectFromSnbcapital();
    }

    private getPortfolios():Observable<SnbcapitalPortfolio[]>{
        return this.snbcapitalLoaderService.getPortfolios().pipe(
            map((response: SnbcapitalErrorHttpResponse | SnbcapitalPortfoliosResponse) => this.onResponse(response)),
            map((response: SnbcapitalPortfoliosResponse) => this.mapPortfolios(response)));
    }

    /* map methods */

    subscribeSnbcapitalTopic() {
        if(this.portfolios) {
            this.snbcapitalStreamer.subscribeSnbCapitalTopics(this.portfolios);
        }
    }

    disconnectSnbcapitalStreamer() {
        this.snbcapitalStreamer.disconnect();
    }

    private onVerify(response:SnbcapitalWrongVerifyOtpResponse|SnbcapitalSuccessVerifyOtpResponse): SnbcapitalSuccessVerifyOtpResponse {
        if(response['pagLoginOK'] && response['pagLoginOK']['ReturnCode'] === '0') {
            this.onSuccessLogin();
            return response as SnbcapitalSuccessVerifyOtpResponse;
        } else if(response['ReturnCode'] !== '0'){
            this.otpEnableEncryption = (response as SnbcapitalWrongVerifyOtpResponse).EnablePasswordEncryption;
            this.otpPublicKeyModulus = (response as SnbcapitalWrongVerifyOtpResponse).pk_mod;
            this.otpPublicKeyExponent = (response as SnbcapitalWrongVerifyOtpResponse).pk_exp;

            let error: SnbcapitalError = {message: response['msgDescription'], expiredSession: false};
            this.snbcapitalErrorService.onError(error);
            throw observableThrowError(error);
            return null;
        }
    }

    private getSnbcapitalStreamerUrl() {
        return '';
        // return 'https://' + this.loader.getSnbcapitalLoginInfo().domainStreamer + '/streamhub/';
    }

    private onSuccessLogin(): void {
        TcTracker.trackConnectedToSnbcapital();
        this.snbcapitalStateService.enableSnbcapitalSession();
        this.refreshPortfolios();

        this.snbcapitalStreamer.start(this.getSnbcapitalStreamerUrl());
    }

    private onDisconnectFromSnbcapital(){
        this.disconnectSnbcapitalStreamer();
        this.snbcapitalStateService.reset();
        this.portfoliosStream.next([]);
    }

    private onRegisterApi(response:SnbcapitalRegisterApiResponse): SnbcapitalRegisterApiResponse{
        return response;
    }

    private mapPurchasePower(response:SnbcapitalPurchasePowerResponse):SnbcapitalPurchasePower{
        return {
            purchasePower: response.caBalance.buyingPower,
            currencyType: response.caBalance.currencyCode,
            cashBalance: response.caBalance.cashBalance,
            bookedAmount: response.caBalance.bookedAmount,
            blockedAmount: response.caBalance.blockedAmount,
            underSettlement: response.caBalance.underSettlement,
            availableForCashOut: response.caBalance.availableForCashOut
        };
    }

    private mapPortfolios(response:SnbcapitalPortfoliosResponse): SnbcapitalPortfolio[] {
        let portfolios: SnbcapitalPortfolio[] = [];

        for(let securityAccountResponse of response.saList){
            if(securityAccountResponse.saStatus == "3"){
                continue;
            }

            let securitySubAccount:SnbcapitalSecuritySubAccountResponse = securityAccountResponse.saSubAccountList[0];
            let cashAccount: SnbcapitalCashAccountResponse = securitySubAccount.caList[0];

            let portfolioInfo: SnbcapitalPortfolio = {
                gBSCustomerCode:securityAccountResponse.cicCode,
                emailAddress: securityAccountResponse.emailAddress,
                portfolioId: securityAccountResponse.saCode,
                portfolioName: securityAccountResponse.csdCode,
                securityAccountBranchCode: securityAccountResponse.saBranchCode,
                securitySubAccountCode: securitySubAccount.ssaCode,
                cashAccountCode: cashAccount.caCode,
                cashAccountBranchCode: cashAccount.caBranchCode,
                currency: this.getCurrencyResponse(cashAccount.currency),
                securityAccountStatus: this.getSecurityAccountStatus(securityAccountResponse.saStatus)
            }
            portfolios.push(portfolioInfo);
        }
        return portfolios;
    }

    private getCurrencyResponse(currency:SnbcapitalCurrency ): SnbcapitalCurrencyInfo {
        return {
            CurrencyCode: currency.currencyCode,
            CurrencyDescription: currency.currencyDesc
        }
    }

    private getSecurityAccountStatus(securityAccountStatus: string): number {
        switch (securityAccountStatus) {
            case "0":
                return SnbcapitalSecurityAccountStatus.Active;
            case "1":
                return SnbcapitalSecurityAccountStatus.Blocked;
            case "2":
                return SnbcapitalSecurityAccountStatus.Disabled;
            case "4":
                return SnbcapitalSecurityAccountStatus.Inserted;
        }
    }

    /* Streams */

    getSnbcapitalStreamer():SnbcapitalStreamer {
        return this.snbcapitalStreamer;
    }

    public getPortfoliosStream():BehaviorSubject<SnbcapitalPortfolio[]>{
        return this.portfoliosStream;
    }

    getPurchasePowersStream(): BehaviorSubject<{[portfolio: string]: SnbcapitalPurchasePower}> {
        return this.purchasePowersStream;
    }
    public getShowConnectScreenStream():Subject<null>{
        return this.showConnectScreenStream;
    }

    public pushShowConnectScreenStream(){
        this.showConnectScreenStream.next(null);
    }

    public getDisconnectStream(): Subject<void> {
        return this.disconnectStream;
    }

    /* Helpers methods */

    public getPortfolio(portfolioId:string){
        let portfolio:SnbcapitalPortfolio = find(this.portfolios, (portfolio:SnbcapitalPortfolio) => portfolio.portfolioId == portfolioId);
        Tc.assert(portfolio != null, 'Cannot find portfolio with number ' + portfolioId);
        return portfolio;
    }

    public onResponse <T>(response: T | SnbcapitalErrorHttpResponse) {
        let error: SnbcapitalError = this.snbcapitalErrorService.errorDataResponseValidation(response);
        if (error) {
            if (error.expiredSession) {
                this.snbcapitalStateService.disableSnbcapitalSession();
                this.disconnectSnbcapitalStreamer();
            }
            this.snbcapitalErrorService.onError(error);
            throw observableThrowError(error);
        }
        return response;
    }

    public getCancelBrokerSelectionStream(): Subject<void> {
        return this.cancelBrokerSelectionStream;
    }

    onCancelConnection(): void {
        this.cancelBrokerSelectionStream.next();
    }

    onNotificationStreamerHeartbeatTimeout() {
        this.disconnectSnbcapitalStreamer();
        this.snbcapitalStreamer.start(this.getSnbcapitalStreamerUrl());
        this.subscribeSnbcapitalTopic();
    }

    setDefaultPortfolioId(portfolioId: string) {
        this.snbcapitalStateService.setSelectedBuySellPortfolioId(portfolioId);
    }

    getDefaultPortfolioId():string {
        if(this.snbcapitalStateService.getSelectedBuySellPortfolioId()) {
            let filteredPortfolio = this.getPortfoliosStream().getValue().find(portfolio => portfolio.portfolioId == this.snbcapitalStateService.getSelectedBuySellPortfolioId());
            if(!filteredPortfolio) {
                this.snbcapitalStateService.setSelectedBuySellPortfolioId(null);
                return null;
            }
            return this.snbcapitalStateService.getSelectedBuySellPortfolioId();
        }
        return null;
    }

    showFastOrderConfirmation(cbOnFastOrderValueChanged: () => void) {
        let self = this;
        let message1 = this.languageService.translate('ميزة الأمر السريع تتيح إرسال الأمر مباشرة دون إظهار شاشة تأكيد الأمر. ');
        let message2 = this.languageService.translate('يعتبر تفعيل هذه الميزه مخاطرة تقع على مسؤولية المستخدم, لذلك اقتضى التنبيه. ');
        let message3 = this.languageService.translate('هل تريد تفعيل الأمر السريع ؟ ');
        let request: ConfirmationRequest = {
            type: ChannelRequestType.Confirmation,
            messageLine: message1,
            messageLine2: message2,
            messageLine3: message3,
            caller: new class implements ConfirmationCaller {
                onConfirmation(confirmed: boolean, param: unknown): void {
                    self.setUseFastOrder(confirmed);
                    cbOnFastOrderValueChanged();
                }
            }
        };
        this.sharedChannel.request(request);
    }

    setUseFastOrder(isUseFastOrder: boolean): void{
        this.useFastOrder = isUseFastOrder;
    }

    getUseFastOrder(): boolean {
        return this.useFastOrder;
    }
}

export interface SnbcapitalResponse{
    result:unknown;
}


export interface SnbcapitalPurchasePower {
    purchasePower:number,
    currencyType:string,
    cashBalance: number,
    bookedAmount: number,
    blockedAmount: number,
    underSettlement: number,
    availableForCashOut: number
}
