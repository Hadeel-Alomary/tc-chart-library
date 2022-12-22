import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Tc, TcTracker} from '../../../../utils/index';
import {LanguageService} from '../../../language/index';
import {SnbcapitalOrder, SnbcapitalOrderExecutionType, SnbcapitalOrderType} from '../../../trading/snbcapital/snbcapital-order';
import {SnbcapitalPortfolio} from '../../../trading/snbcapital/snbcapital-order';
import {SnbcapitalHttpClientService} from '../../../trading/snbcapital/snbcapital-http-client-service';
import {SnbcapitalErrorHttpResponse} from '../../../trading/snbcapital';
import {TcAuthenticatedHttpClient} from '../../../../utils/tc-authenticated-http-client.service';



export interface OrderSearchStatus {
  newOrder: boolean;
  partialExecutionOrder: boolean;
  fullExecutionOrder: boolean;
  cancelExecutionOrder: boolean;
  modifiedOrder: boolean;
  rejectedOrder: boolean;
  suspendedOrder: boolean;
  expiredOrder: boolean;
}


@Injectable()
export class SnbcapitalLoaderService {

    constructor(private http: HttpClient, private tcHttpClient: TcAuthenticatedHttpClient, private snbcapitalHttpClientService: SnbcapitalHttpClientService, private languageService:LanguageService) {}

    /* verify methods */

    public connectToSnbcapital():Observable<SnbcapitalIntegrationTcLayerResponse> {
        this.logRequestData('Connect to integration Tc Layer url : ', {});
        return this.snbcapitalHttpClientService.post('SourceOnly=true&JavaClient=JSON').pipe(map((response: SnbcapitalIntegrationTcLayerResponse) => response));
    }

    public callLogin(tickerchartUserId: string, password: string):Observable<SnbcapitalLoginResponse> {
        let xslcontext = this.languageService.arabic ? 'GTRADEGILARAB' : 'GTRADEGIL';
        let body: string = `DEVICETYPE=PC&NameXsl=FirstStepLogin&SourceOnly=true&Password=${password}&Bank=NCBC&UserID=${tickerchartUserId}&XSLCONTEXT=${xslcontext}&JavaClient=JSON&minifyJSON=true`;

        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalLoginResponse) => response));
    }

    public verify(mobileCode:string, snbcapitalUserName:string, snbcapitalPassword:string):Observable<SnbcapitalWrongVerifyOtpResponse|SnbcapitalSuccessVerifyOtpResponse> {
        let xslcontext = this.languageService.arabic ? 'GTRADEGILARAB' : 'GTRADEGIL';

        let body: string = `DEVICETYPE=PC&NameXsl=LoginOTP&SourceOnly=true&CodiceABI=NCBC&JavaClient=JSON&minifyJSON=true&UserID=${snbcapitalUserName}&Password=${snbcapitalPassword}&otCode=${mobileCode}&SecStepLogin=doLogin&XSLCONTEXT=${xslcontext}`;

        this.logRequestData('verify', {});

        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalWrongVerifyOtpResponse|SnbcapitalSuccessVerifyOtpResponse) => response));
    }

    public snbcapitalRegisterApi(snbcapitalUserName:string):Observable<SnbcapitalRegisterApiResponse> {
        // let url: string = `https://www.tickerchart.com/m/alahli-capital/register?version=web_${Config.getVersion()}`;
      let url = null;
        return this.tcHttpClient.postWithAuth(Tc.url(url), {
            'alahli_username': snbcapitalUserName,
            'language': this.languageService.arabic ? 'ARABIC' : "ENGLISH"
        }).pipe(map((response: SnbcapitalRegisterApiResponse) => response));
    }

    public disconnectFromSnbcapital():Observable<{}> {
        this.logRequestData('Disconnect from snbcapital', {});

        let body: string = `action=LOGOUT&SourceOnly=true&JavaClient=JSON`;

        return this.snbcapitalHttpClientService.post(body).pipe();
    }

    /* order CRUD methods */

    public addPreConfirm(order: SnbcapitalOrder, preConfirmBody: string,portfolio: SnbcapitalPortfolio): Observable<SnbcapitalPreConfirmResponse | SnbcapitalErrorHttpResponse> {
        let portafoglio = `Portafoglio=${portfolio.securityAccountBranchCode}*${portfolio.portfolioId}*0*-**${portfolio.cashAccountBranchCode}*${portfolio.cashAccountCode}`;
        let body = `NameXsl=RiepilogoOrdine&${preConfirmBody}&${portafoglio}&Quantita=${order.quantity}&DeviceType=1&JavaClient=JSON&GUserTrace=${portfolio.gBSCustomerCode}&sliceType=0&stepQty=0&stepInterval=0&timeStamp=${moment().valueOf()}&SkipChecks=${false}`;
        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalPreConfirmResponse | SnbcapitalErrorHttpResponse) => response));
    }


    public addOrder(order:SnbcapitalOrder, portfolio: SnbcapitalPortfolio):Observable<SnbcapitalPreConfirmResponse | SnbcapitalErrorHttpResponse> {
       let body = `NameXsl=ConfermaOrdine&referrer=${order.referrer}&checkPinMode=account&pinContainerCode=${portfolio.securityAccountBranchCode}/${portfolio.portfolioId}&pin=&checkPin=${false}&reloadPinData=${true}&timeStamp=${moment().valueOf()}&JavaClient=JSON&GUserTrace=${portfolio.gBSCustomerCode}`
        this.logRequestData('add Order', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalPreConfirmResponse| SnbcapitalErrorHttpResponse) => response));
    }

    public updatePreConfirm(order: SnbcapitalOrder, portfolio: SnbcapitalPortfolio): Observable<SnbcapitalUpdatePreConfirmOrderResponse | SnbcapitalErrorHttpResponse> {
        let body =`NameXsl=ModificaOrdine&Calendar=${true}&InfoSegmento=${true}&NroRifOrdine=${order.gpsOrderNumber}&Portafoglio=${portfolio.securityAccountBranchCode}*${portfolio.portfolioId}*0*NULL*NULL&DataOrdine=&JavaClient=JSON&GUserTrace=${portfolio.gBSCustomerCode}`;
        this.logRequestData('update PreConfirm order', {});

        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalUpdatePreConfirmOrderResponse) => response));
    }

    public updateOrder(order:SnbcapitalOrder, paramPrc: string,paramQty: string,paramDisclosedQty: string, paramExpiry: string, newTimeInForceOrPrmQty: string, portfolio: SnbcapitalPortfolio):Observable<SnbcapitalUpdatedOrderResponse | SnbcapitalErrorHttpResponse> {
        let body:string = `NameXsl=ConfermaModificaOrdine&${paramPrc}${paramQty}${paramDisclosedQty}${newTimeInForceOrPrmQty}${paramExpiry}NroRifOrdine=${order.gpsOrderNumber}&Portafoglio=${portfolio.securityAccountBranchCode}*${portfolio.portfolioId}*0*NULL*NULL&DataOrdine=&checkPin=false&reloadPinData=true&JavaClient=JSON&GUserTrace=${portfolio.gBSCustomerCode}`;
        this.logRequestData('update order', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalUpdatedOrderResponse) => response));
    }

    public deleteOrder(order:SnbcapitalOrder, portfolio: SnbcapitalPortfolio):Observable<SnbcapitalOrderResponse | SnbcapitalErrorHttpResponse> {
        let fullDate = moment(order.date).format('YYYYMMDDHHmmssSSS');
        let body: string = `NameXsl=RispostaCancellaOrdine&NroRifOrdine=${order.gpsOrderNumber}&DataOrdine=${fullDate}&checkPinMode=account&pinContainerCode=${portfolio.securityAccountBranchCode}/${portfolio.portfolioId}&pin=&checkPin=false&reloadPinData=true&JavaClient=JSON&GUserTrace=${portfolio.gBSCustomerCode}`
        this.logRequestData('delete order', {});

        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalOrderResponse | SnbcapitalErrorHttpResponse) => response));
    }

    public getOrderDetails(order:SnbcapitalOrder , portfolio:SnbcapitalPortfolio):Observable<SnbcapitalOrderDetailsResponse | SnbcapitalErrorHttpResponse> {
        let portfolioValue = `${portfolio.securityAccountBranchCode}*${portfolio.portfolioId}*0*NULL*NULL`;
        let fullDate = moment(order.date).format('YYYYMMDDHHmmssSSS');
        let body = `NameXsl=ListaEseguiti&Portafoglio=${portfolioValue}&DataOrdine=${fullDate}&NroRifOrdine=${order.id}&JavaClient=JSON&GUserTrace=${portfolio.gBSCustomerCode}`;

        this.logRequestData('Snbcapital get order detailes ' , {});

        return  this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalOrderDetailsResponse | SnbcapitalErrorHttpResponse) => response));
    }

    public calculateOrderQuantity(order: SnbcapitalOrder, calculateQuantityBody: string, portfolio: SnbcapitalPortfolio): Observable<SnbcapitalQuantityCalculationResponse | SnbcapitalErrorHttpResponse> {
        let portafoglio = `Portafoglio=${portfolio.securityAccountBranchCode}*${portfolio.portfolioId}*0*-**${portfolio.cashAccountBranchCode}*${portfolio.cashAccountCode}`;
        let body = `NameXsl=MaxBuyQty&${calculateQuantityBody}&maxOrderQty=true&${portafoglio}&DeviceType=1&JavaClient=JSON&GUserTrace=${portfolio.gBSCustomerCode}&sliceType=0&stepQty=0&stepInterval=0&timeStamp=${moment().valueOf()}`;
        this.logRequestData('Snbcapital quantity calculator ', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalQuantityCalculationResponse) => response));
    }

    /* get methods */

    public getPortfolios(): Observable<SnbcapitalPortfoliosResponse | SnbcapitalErrorHttpResponse> {
        this.logRequestData('Snbcapital get portfolios' , {});
        let body = 'NameXsl=PortfolioList&JavaClient=JSON';

        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalPortfoliosResponse) => response));
    }

    public getOrders(customerCode: string):Observable<SnbcapitalOrderResponse | SnbcapitalErrorHttpResponse> {
        let body = `NameXsl=ListaOrdiniEx&revoche=${true}&ascendingOrderBy=${true}&TipoRicercaOrdine=TRO_APERTI&TipoRicercaOrdine=TRO_ODIERNI_CHIUSI&NO_PAGING=${true}&JavaClient=JSON&GUserTrace=${customerCode}`

        this.logRequestData('get orders', {});

        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalOrderResponse) => response));
    }

    public getSearchOrders(portfolio: SnbcapitalPortfolio, orderAction: string, startDate: string, endDate: string, orderStatus: OrderSearchStatus, company: string, orderNumber: string, pageNumber: number){
        let startYear = startDate.split('-')[0];
        let startMonth = startDate.split('-')[1];
        let startDay = startDate.split('-')[2];

        let endYear = endDate.split('-')[0];
        let endMonth = endDate.split('-')[1];
        let endDay = endDate.split('-')[2];
        let body = `NameXsl=ListaOrdiniEx&DepositoJS=[{filiale:${portfolio.securityAccountBranchCode},codice:${portfolio.portfolioId}}]&GGDataDa=${startDay}&MMDataDa=${startMonth}&AADataDa=${startYear}&GGDataAl=${endDay}&MMDataAl=${endMonth}&AADataAl=${endYear}&revoche=true&orderSearch=1&Page=${pageNumber}&JavaClient=JSON&GUserTrace=${portfolio.gBSCustomerCode}`;

        if(orderAction != 'all'){
            if(orderAction == 'buy') {
                body += '&Sign=BS_COMPRA';
            }else {
                body += '&Sign=BS_VENDE';
            }
        }

        if(orderStatus.newOrder){
            body +='&TipoRicercaOrdine=TRO_NUOVI';
        }
        if(orderStatus.partialExecutionOrder) {
            body+='&TipoRicercaOrdine=TRO_ESEGUITI_PARZIALI';
        }
        if(orderStatus.fullExecutionOrder){
            body+='&TipoRicercaOrdine=TRO_ESEGUITI_TOTALI';
        }
        if(orderStatus.cancelExecutionOrder) {
            body+='&TipoRicercaOrdine=TRO_CANCELLED';
        }
        if(orderStatus.modifiedOrder) {
            body+='&TipoRicercaOrdine=TRO_MODIFIED';
        }
        if(orderStatus.rejectedOrder) {
            body+='&TipoRicercaOrdine=TRO_RIFIUTATI';
        }
        if(orderStatus.suspendedOrder) {
            body+='&TipoRicercaOrdine=TRO_SOSPESI';
        }
        if(orderStatus.expiredOrder) {
            body+='&TipoRicercaOrdine=TRO_SCADUTI';
        }
        if(company){
            body+= `&TipoCodice=BANCA&CodRicerca=${company}`;
        }
        if(orderNumber) {
            body+= `&TipoCodice=TRANSACTION_NUM&CodRicerca=${orderNumber}`;
        }
        this.logRequestData('get orders search', {});
        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalOrderResponse) => response));
    }

    public getSnbcapitalPurchasePower(portfolio:SnbcapitalPortfolio):Observable<SnbcapitalPurchasePowerResponse | SnbcapitalErrorHttpResponse> {
        let contoCorrente = `${portfolio.securityAccountBranchCode}*${portfolio.portfolioId}*${portfolio.securitySubAccountCode}*_*${portfolio.cashAccountBranchCode}*${portfolio.cashAccountCode}*${portfolio.currency.CurrencyCode}`
        let body = `NameXsl=SaldoCC&ContoCorrente=${contoCorrente}&JavaClient=JSON&GUserTrace=${portfolio.gBSCustomerCode}`;

        this.logRequestData('purchase power', {});

        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalPurchasePowerResponse) => response));
    }

    public getPositions(portfolio:SnbcapitalPortfolio):Observable<SnbcapitalPositionResponse | SnbcapitalErrorHttpResponse> {
        let body = `NameXsl=ListaPosizioniTD&saldi=${true}&Tipo=APERTE&abi=NCBC&JavaClient=JSON&ndg=${portfolio.gBSCustomerCode}&Portafoglio=${portfolio.securityAccountBranchCode}*${portfolio.portfolioId}*TUTTI*TUTTI*TUTTI&GUserTrace=${portfolio.gBSCustomerCode}`

        this.logRequestData('Snbcapital get positions.' , {});

        return this.snbcapitalHttpClientService.post(body).pipe(map((response: SnbcapitalPositionResponse) => response));
    }

    /* helpers */

    private logRequestData(url:string, data:unknown){
        // if(!Config.isProd()) {
        //     Tc.info('request data for ' + url + ' url is: ' + JSON.stringify(data, null, '\t'));
        //     TcTracker.trackUrgentMessage('request data for ' + url + ' url is: ' + JSON.stringify(data));
        // }
    }
}

export interface SnbcapitalIntegrationTcLayerResponse {
    pk_mod: string,
    ReturnCode: string,
    EnablePasswordEncryption: string,
    loginType: string,
    pk_exp: string,
    otpResendTimeout: string
}

export interface SnbcapitalSuccessVerifyOtpResponse {
    pagLoginOK: {
        EnablePasswordEncryption: string,
        ReturnCode: string,
        TILAExpirationDate: string,
        internetId: string,
        otpResendTimeout: string
        pk_mod: string,
        pk_exp: string,
    }
}

export interface SnbcapitalOrderDetailsResponse {
    order :SnbcapitalOrderListResponse;
    execList: SnbcapitalOrderDetailsExecutionResponse[]
}

export interface SnbcapitalOrderDetailsExecutionResponse {
    keyope: number,
    execQty: number,
    prc: number,
    feesCACurr: number,
    VATamt: number,
    totAmt: number,
    status: number,
    execDate: SnbcapitalDateTimeResponse,
    causaleDesc?:{
        plain:string,
    }
}

export interface SnbcapitalWrongVerifyOtpResponse {
    EnablePasswordEncryption: string,
    ReturnCode: string,
    loginType: string,
    msg: string,
    msgDescription: string,
    otpResendTimeout: string
    pk_mod: string,
    pk_exp: string,
}

export interface SnbcapitalLoginResponse {
    EnablePasswordEncryption: string,
    ReturnCode: string,
    loginType: string,
    msg: string,
    msgDescription: string,
    otpResendTimeout: string,
    pk_mod: string,
    pk_exp: string,
    MobileNumber: string,
    ExecuteSecondStep: string
    TILAExpirationDate: string
}

export interface SnbcapitalPurchasePowerResponse {
    caBalance: SnbcapitalCashAccountBalance,
    ca: SnbcapitalCashAccountResponse
}

export interface SnbcapitalCashAccountBalance {
    cmaAmountBlock: number,
    bookedAmount: number,
    mtBlock: number,
    overdraftLimit: number,
    underSettlement: number,
    blockedAmount: number,
    fxVsRefCurr: number,
    buyingPower: number,
    cashBalance: number,
    cmaAmountBlockDvsRif: number,
    availableForCashOut: number,
    currencyCode: string,
    mtAvailableForCashOut: number
}


export interface SnbcapitalRegisterApiResponse {
    success: boolean,
    message: string
}

export interface SnbcapitalPreConfirmResponse {
    referrer: string,
    encryption: SnbcapitalEncryptionResponse
    propOutOrd: SnbcapitalPropOutOrderResponse,
    ca:SnbcapitalCashAccountResponse,
    sa:SnbcapitalSecurityAccountCodeResponse,
}

export interface SnbcapitalEncryptionResponse {
    pk_mod: string,
    EnablePasswordEncryption: boolean,
    pk_exp: string,
    otpResendTimeout: string
}

export interface SnbcapitalPropOutOrderResponse {
    expiryDate?:string,
    estAmtCA: number,
    estAmt: number,
    fees: number,
    validFrom: SnbcapitalDateTimeResponse,
    currency: SnbcapitalCurrency,
    rifOrd: SnbcapitalRifOrd,
    saldi: SnbcapitalSaldiResponse,
    sliceQty: number,
    sliceInterval: number,
    qtyParam: number,
    timeParam: number,
    strum: SnbcapitalStrumResponse,
    mrkCode: string,
    errorDesc: string,
    status: SnbcapitalOrderStatusResponse,
    priceType: SnbcapitalOrderExecutionType,
    isProcessed: boolean,
    basketCode: string,
    keyOpe: string,
    IBAN: string,
    sign: SnbcapitalOrderType,
    creationDate: string,
    orderQty: number,
    commission: number
    order: SnbcapitalOrderResponse,
    friendlyName: string,
    csdCode: string,
    saBranchCode: string,
    saCode: string,
    ssaCode: string,
    limPrice: number,
    VATamt: number,
    adeguatezza: SnbcapitalAdguatezzaResponse
}

export interface SnbcapitalRifOrd {
    gbsOrderNumber: string
}

export interface SnbcapitalSaldiResponse {
    cmaAmountBlock: number,
    bookedAmount: number,
    mtBlock: number,
    overdraftLimit: number,
    underSettlement: number,
    blockedAmount: number,
    fxVsRefCurr: number,
    buyingPower: number,
    cashBalance: number,
    cmaAmountBlockDvsRif: number,
    availableForCashOut: number,
    currencyCode: string,
    mtAvailableForCashOut: number
}

export interface SnbcapitalAdguatezzaResponse {
    warnMsgs: string[]
}

export enum SnbcapitalOrderStatusResponse {
    Pending = 1,
    Rejected = 2,
    Released = 3
}

export interface SnbcapitalQuantityCalculationResponse {
    propOutOrd: SnbcapitalPropOutOrderResponse,
}

export interface SnbcapitalPositionResponse {
    EnPriceType: number[],
    magic: string,
    sa: SnbcapitalSecurityAccountCodeResponse,
    holdings: SnbcapitalSecurityAccountAndRelatedPositionsWrapperResponse[]
    saldiData: object[]
}

export interface SnbcapitalSecurityAccountCodeResponse {
    saCode: string,
    ssaCode: string,
    descIntestSottoDep?: string
    saBranchCode:string,
    intestSottoDep?: string
}

export interface SnbcapitalSecurityAccountAndRelatedPositionsWrapperResponse {
    saCode: string
    saBranchCode: string,
    ssaCode: string,
    coverageRatio: string,
    adjNotionalAmount: string,
    adjCoverageRatio: string,
    blockedAmount: string,
    accruedProfit: string,
    positions: SnbcapitalHoldingPositionResponse[],
}

export interface SnbcapitalHoldingPositionResponse {
    MTDiscount: number,
    MTValue: number,
    AvgCostPrice: number,
    fxVsPrefCurr: number,
    fxVsRefCurr: number,
    saCode: string,
    saBranchCode: string,
    ssaCode: string,
    costValue: number,
    costValueRefCurr: number,
    ctviMrk_MRK_ATT: number,
    fattConvPrz: number,
    mrk: SnbcapitalHoldingPositionMarketResponse,
    mrkPrice: number,
    blockedQty: number,
    blockedQtySell: number,
    qty: number,
    availableQty: number,
    qtaSaldo: number,
    strum: SnbcapitalStrumResponse
}

export interface SnbcapitalHoldingPositionMarketResponse {
    SeqOfSegmentoStruct: SnbcapitalSeqOfSegmentoStructResponse,
    codInfoProvArray: string[],
    codInfoProvider: string,
    code: string,
    desc: string,
    faseAtt: SnbcapitalTypeResponse,
    marketType: SnbcapitalTypeResponse,
    odMinSearchCharContains: number,
    odMinSearchCharEnds: number,
    odMinSearchCharExactMatch: number,
    odMinSearchCharStarts: number,
    tickerMrk: string,
    weightedCodInfoProvArray: string[],
    withOnDemandStock: boolean
}

export interface SnbcapitalSeqOfSegmentoStructResponse {
    codiceMrk: string,
    codiceSegmento: string,
    descrizioneSegmento: string,
    faseAtt: string,
    ordine: number,
    privateOrders: string
}

export interface SnbcapitalStrumResponse {
    lottoMinimo?: string,
    MTStockDiscount: string,
    _p_mrk: string,
    banca: string,
    bearishCounter: number,
    bullishCounter: number,
    codInfoProv: string,
    codInfoProv1: string,
    codInfoProv10: string,
    codInfoProv2: string,
    codInfoProv3: string,
    codInfoProv4: string,
    codInfoProv5: string,
    codInfoProv6: string,
    codInfoProv7: string,
    codInfoProv8: string,
    codInfoProv9: string,
    codInfoProvArray: string[],
    secCode: string,
    codiceIsin: string,
    codiceMrk: string,
    comparto: SnbcapitalHoldingPositionStrumCompartoResponse,
    secDesc: string,
    dvsEmi: SnbcapitalHoldingPositionStrumDvsEmiResponse,
    secTrdCurr: SnbcapitalHoldingPositionStrumSecurityTradingCurrencyResponse,
    minLot: string,
    sottoTipo: SnbcapitalTypeResponse
    ticker: string,
    tipoContrattazione: SnbcapitalTypeResponse,
    tipoIntestatario: SnbcapitalTypeResponse,
    tipoPaese: SnbcapitalTypeResponse,
    tipoStrumento: SnbcapitalTypeResponse,
    type: SnbcapitalTypeResponse,
    ultimoPrezzo: string,
    valueIndicator: number
}

export interface SnbcapitalHoldingPositionStrumCompartoResponse {
    codice: string,
    descrizione: string
}

export interface SnbcapitalHoldingPositionStrumDvsEmiResponse {
    codDvs: string,
    dvsEmi: SnbcapitalHoldingPositionStrumDescriptionResponse,
    numDec: number
}

export interface SnbcapitalHoldingPositionStrumSecurityTradingCurrencyResponse {
    code: string,
    desc: SnbcapitalHoldingPositionStrumDescriptionResponse,
    numDec: number

}
export interface SnbcapitalHoldingPositionStrumDescriptionResponse {
    text: string,
    unicode: string
}

export interface SnbcapitalTypeResponse {
    str: string,
    val: number
}


export interface SnbcapitalPortfoliosResponse {
    saList: SnbcapitalSecurityAccountResponse[],
}

export interface SnbcapitalSecurityAccountResponse {
    cicCode: string,
    ecnCode: string,
    emailAddress: string,
    codProfComm: string,
    saCode: string,
    lastname: string,
    csdCode: string,
    saBranchCode: string,
    friendlyName: string,
    saSubAccountList:SnbcapitalSecuritySubAccountResponse[]
    mtContractItem: SnbcapitalMarginTradingContractDetailsResponse,
    ninCode: string,
    firstname: string,
    secondname: string,
    thirdname: string,
    saStatus: string,
}

export interface SnbcapitalSecuritySubAccountResponse {
    ssaCode: string,
    customerDesc: string,
    customerCode: string,
    caList: SnbcapitalCashAccountResponse[]
}

export interface SnbcapitalCashAccountResponse {
    IBAN: string,
    currency: SnbcapitalCurrency,
    caBranchCode: string,
    caCode: string,
    bankAccountNumber: string
}

export interface SnbcapitalCurrency {
    currencyCode: string,
    currencyDesc: string,
    numdecimali: number
}

export interface SnbcapitalMarginTradingContractDetailsResponse {
    MTContractKey: string,
    contractStartDate: SnbcapitalDateTimeResponse,
    contractMaturityDate: SnbcapitalDateTimeResponse,
    mtCurrency: SnbcapitalMarginTradingContractCurrencyResponse,
    currentLeverage: string,
    leverageRatio: string,
    loanAccount: string,
    mtProductCode: string,
    notionalAmount:string,
    threshold1Limit: string,
    threshold1Pct: string,
    threshold2Limit: string,
    threshold2Pct: string,
    threshold3Limit: string,
    threshold3Pct: string,
    threshold4Limit: string,
    threshold4Pct: string,
    threshold5Limit: string,
    threshold5Pct: string,
    adjNotionalAmount: string,
    accruedProfit: string
}

export interface SnbcapitalDateTimeResponse {
    millis: number,
    second: number,
    minute: number,
    hour: number,
    day: number,
    month: number,
    year: number,
    isnull?: boolean
}

export interface SnbcapitalMarginTradingContractCurrencyResponse {
    mtCurrencyCode: string,
    mtCurrencyDesc: string,
    numdecimali: string
}

export interface SnbcapitalOrderResponse {
    paging?: SnbcapitalOrderPageResponse,
    ordersList: SnbcapitalOrderListResponse[]
}

export interface SnbcapitalUpdatedOrderResponse {
    order: SnbcapitalOrderListResponse
}

export interface SnbcapitalOrderPageResponse {
    in_totalrows: number,
    in_page: number,
    in_pagerows: number,
    out_totpagenum: number,
    use_paging: boolean
}

export interface SnbcapitalOrderListResponse {
    newPriceReq: string,
    orderQty: number,
    amount: number,
    gbsOrderNumber: string,
    saCode: string,
    orderType: number,
    friendlyName: string,
    cancModType: SnbcapitalOrderCancellationTypeResponse,
    mrkOrdNum: string,
    valueDate: SnbcapitalDateTimeResponse,
    customerCode: string,
    totAmtExec: number,
    priceType: number,
    ssaCode: string,
    origOrdQty: number,
    execQty: number,
    middleName: string,
    origLimPrice: number,
    lastName: string,
    limPrice: number,
    newQtyReq: number,
    rifOrd: SnbcapitalOrderRifOrderResponse,
    isOpen: boolean,
    qtyParam: number,
    canBeRevoked: boolean,
    timeParam: number,
    estimatedComm: SnbcapitalOrderEstimatedCommissionsResponse,
    sign: number,
    qtyCanBeChanged: boolean,
    ca: SnbcapitalOrderCashAccountResponse,
    fees: number,
    status: number,
    mrk: SnbcapitalOrderSecurityMarketResponse,
    canTimeInForceBeChanged: boolean,
    execAmt: number,
    canBeAnnulled: boolean,
    strum: SnbcapitalStrumResponse,
    quantitaMinima: number,
    saBranchCode: string,
    pendingCancMod: boolean,
    currCancMod: SnbcapitalOrderCurrentPendingCancellationModificationResponse,
    expiryDate: SnbcapitalDateTimeResponse,
    validFrom: SnbcapitalDateTimeResponse,
    origExpiryDate: SnbcapitalDateTimeResponse,
    firstName: string,
    externalCode: string,
    disclosedQty: number,
    remainingQty: number,
    insDate: SnbcapitalDateTimeResponse,
    pmpEseg: number,
    priceCanBeChanged: boolean,
    expiryDateCanBeChanged: boolean,
    thirdName: string,
    chargedComm: SnbcapitalOrderEstimatedCommissionsResponse,
    stopPrice: number,
    fatherOrderKey: string,
    VATamt: number,
    VATamtCharged: number,
    minimumQty: number,
    avgPrcExec: number
}

export interface SnbcapitalOrderCancellationTypeResponse {
    value: number,
    modifyQuantity: boolean,
    modifyPrice: boolean,
    modifyExpiry: boolean
}

export interface SnbcapitalOrderRifOrderResponse {
    stato: string,
    codEsito: string,
    dataRiferimento: SnbcapitalDateTimeResponse,
    nroRifOrdine: string,
    msgEsito: string,
    codBca: string
}

export interface SnbcapitalOrderEstimatedCommissionsResponse {
    commItem: SnbcapitalOrderCommissionsResponse,
    discriminator: number
}

export interface SnbcapitalOrderCommissionsResponse {
    total: number,
    min: number,
    comm: number,
    max: number,
    riskComm: number,
    riskCommForRenewal: number,
    fees: number,
    fixForTrade: number
}

export interface SnbcapitalOrderCashAccountResponse {
    caBranchCode: string,
    caCode: string,
    IBAN: string,
    bankAccountNumber: string,
    currency: SnbcapitalOrderCashAccountCurrencyResponse
}

export interface SnbcapitalOrderCashAccountCurrencyResponse {
    currencyCode: string,
    numdecimali: number,
    currencyDesc: string,
}

export interface SnbcapitalOrderSecurityMarketResponse {
    codInfoProvider: string,
    odMinSearchCharExactMatch: number,
    code: string,
    SeqOfSegmentoStruct: SnbcapitalOrderSecurityMarketSeqOfSegmentoStructResponse[],
    odMinSearchCharStarts: number,
    faseAtt: SnbcapitalTypeResponse,
    withOnDemandStock: boolean,
    odMinSearchCharEnds: number,
    tickerMrk: string,
    weightedCodInfoProvArray: string[],
    codInfoProvArray: string[],
    marketType: SnbcapitalTypeResponse,
    odMinSearchCharContains: number,
    desc: string
}

export interface SnbcapitalOrderSecurityMarketSeqOfSegmentoStructResponse {
    codiceMrk: string,
    faseAtt: string,
    descrizioneSegmento: string,
    ordine: number,
    privateOrders: string,
    codiceSegmento: string
}

export interface SnbcapitalOrderCurrentPendingCancellationModificationResponse {
    newPriceReq: number,
    status: number,
    oldPriceReq: number,
    saBranchCode: string,
    rifOrd: SnbcapitalOrderRifOrderResponse,
    oldQtyReq: number,
    saCode: string,
    orderType: number,
    ssaCode: number,
    execQty: number,
    externalCode: string,
    cancDate: SnbcapitalDateTimeResponse,
    orderVisibility: number,
    message: string
}

export interface SnbcapitalUpdatePreConfirmOrderResponse {
    calendar: SnbcapitalCalenderResponse,
    infoSegmento: SnbcapitalInfoSegmentoResponse,
    encryption: SnbcapitalEncryptionResponse,
    sa: SnbcapitalSecurityAccountCodeResponse,
    order: SnbcapitalOrderListResponse
}

export interface SnbcapitalCalenderResponse {
    maxGGScadenza: number,
    description_3: string,
    lastDay: string,
    description_1: string,
    id: string,
    description_2: string,
    seqOfDay: SnbcapitalSeqOfDayResponse[]
}

export interface SnbcapitalSeqOfDayResponse {
    TypeOfDay: {
        isMarketOpen: boolean,
        code: string,
        description_3: string,
        description_1: string,
        isSettlementDay: boolean,
        description_2: string
    }
    Day: number
}

export interface SnbcapitalInfoSegmentoResponse {
    mrkCode: string,
    disclosedVolumeMinPercAllowed: string,
    oeInfo: SnbcapitalOeIngoResponse,
    segmentCode: string,
    privateOrder: boolean,
    alwaysAllowMarketPriceForMarkets: boolean,
    minQtyForDisclosedVolume: string,
    allowPriceTypeParam: boolean
}

export interface SnbcapitalOeIngoResponse {
    min: number,
    minLot: number,
    max: number,
    maxVSD: number,
    minVSD: number
}
