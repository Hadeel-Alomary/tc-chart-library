import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StringUtils, Tc, TcTracker} from '../../../../utils/index';
import {DerayahOrder} from '../../../trading/derayah/derayah-order/derayah-order';
import {DerayahOrderExecutionType} from '../../../trading/derayah/derayah-order/derayah-order-execution';
import {LanguageService} from '../../../language/index';
import {DerayahClientService} from '../../../trading/derayah/derayah-client.service';
import {DerayahHttpClientService} from '../../../trading/derayah/derayah-http-client.service';
import {map} from 'rxjs/operators';
import {TcUrlUtils} from '../../../../utils/tc.url.utils';

@Injectable()
export class DerayahLoaderService {

     constructor(private http: HttpClient, private languageService: LanguageService, private derayahClientService: DerayahClientService, private derayahHttpClientService: DerayahHttpClientService) {
    }

    private getDerayahAuthUrl(): string {
        // return this.derayahClientService.getDerayahAuthUrl();
      return null;
     }

    protected getDerayahOauthUrl(): string {
        // return this.derayahClientService.getDerayahOauthUrl();
	  return null;
    }

    private getDerayahTokenUrl(): string {
        // return this.derayahClientService.getDerayahTokenUrl();
	  return null;
    }

    /* verify methods */

    public getLoginPageLink(): string {
        return `${this.getDerayahAuthUrl()}?prompt=login&response_type=code&scope=TradingAPI.All%20offline_access&redirect_uri=${this.getRedirectUrl()}&client_id=${this.derayahClientService.getClientId()}&_State=${this.getState()}&code_challenge=${this.getCodeChallenge()}&code_challenge_method=S256&response_mode=query`;
    }

    private getRedirectUrl(): string {
        let redirectUrl: string = 'https://www.tickerchart.net/m/derayah/oauth/redirect';
        // if (!Config.isProd()) {
        //     redirectUrl = 'http://localhost:40096/signin-oidc';
        // }
        return encodeURIComponent(redirectUrl);
    }

    private getState(): string {
        return StringUtils.generateRandomString(43);
    }

    private getCodeChallenge(): string {
        return "slu0OpvNMEKBQF4ezN2TOZTJdm93j-dxenzpedCJgSk";
    }

    public getAccessToken(oauthCode: string): Observable<DerayahAuthorizeResponse> {
        let data: string = `code=${oauthCode}&redirect_uri=${this.getRedirectUrl()}&client_id=${this.derayahClientService.getClientId()}&code_verifier=${this.getCodeVerifier()}&client_secret=${this.derayahClientService.getClientSecretId()}&grant_type=authorization_code`;
        return this.http.post<DerayahAuthorizeResponse>(this.getDerayahTokenUrl(), data, this.getTokenHeaders());
    }

    public getRefreshToken(refreshToken: string): Observable<DerayahAuthorizeResponse> {
        let data: string = `client_id=${this.derayahClientService.getClientId()}&client_secret=${this.derayahClientService.getClientSecretId()}&grant_type=refresh_token&refresh_token=${refreshToken}`
        return this.http.post<DerayahAuthorizeResponse>(this.getDerayahTokenUrl(), data, this.getTokenHeaders());
    }

    private getTokenHeaders(): Object {
        return  {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
    }

    private getCodeVerifier(): string {
        return "GyADgL4TppPITGmsXXcIlOol8wYhZ4yFfMheNK1WrA8";
    }

    public callDerayahIntegrationLink(portfolioNum: number) {
        let userName: string =null;
        let version: string =null;
        // let url = TcUrlUtils.url(this.derayahClientService.getDerayahIntegrationLink() + `?version=web_${version}`);
      let url = null;
        return this.http.post(url, {user_name: userName, p1: portfolioNum});
    }

    /* order CRUD methods */

    public addPreConfirm(order:DerayahOrder):Observable<DerayahHttpResponse> {
        let url:string =`${this.getDerayahOauthUrl()}/Order/preconfirmPlace`;

        this.logUrl('Derayah add pre confirm url : ' , url);

        this.logRequestData('add pre confirm', {
            "portfolio": order.portfolio,
            "exchange-code": order.derayahMarket,
            "symbol": order.derayahSymbol,
            "order-side": order.type.type.toString(),
            "execution-type": order.execution.type.toString(),
            "quantity": order.quantity.toString(),
            "fill-type": "1",
            "min-quantity": null,
            "disclose-quantity": 0,
            "price": order.price.toString(),
            "valid-till": order.expiration.type.toString(),
            "valid-till-date": order.expiration.tillDate
        });
        return this.derayahHttpClientService.postWithAuth(url, this.getPreAddOrUpdateOrder(order, true)).pipe(map((response: DerayahHttpResponse) => response))
    }

    public addOrder(order:DerayahOrder):Observable<DerayahHttpResponse> {
        let url:string =`${this.getDerayahOauthUrl()}/Order/Place`;

        this.logUrl('Derayah new order url : ' , url);
        this.logRequestData('add order' ,{
            'portfolio': order.portfolio,
            'exchange-code': order.derayahMarket,
            'symbol': order.derayahSymbol,
            "order-side": order.type.type.toString(),
            "execution-type": order.execution.type.toString(),
            'quantity': order.quantity.toString(),
            "min-quantity": null,
            'price': order.execution.type == DerayahOrderExecutionType.Limit ? order.price.toString() : '',
            "valid-till": order.expiration.type.toString(),
            'valid-till-date': order.expiration.tillDate
        });
        return this.derayahHttpClientService.postWithAuth(url, this.getPreAddOrUpdateOrder(order, true)).pipe(map((response: DerayahHttpResponse) => response))
    }

    public updatePreConfirm(order:DerayahOrder):Observable<DerayahHttpResponse> {
        let url = `${this.getDerayahOauthUrl()}/Order/preconfirmUpdate`;
        this.logUrl('Derayah pre update order url : ' , url);

        this.logRequestData('update pre confirm', {
            "order-id": order.id,
            "portfolio": order.portfolio,
            "exchange-code": order.derayahMarket,
            "symbol": order.derayahSymbol,
            "order-side": order.type.type.toString(),
            "execution-type": order.execution.type.toString(),
            "quantity": order.quantity.toString(),
            "fill-type": "1",
            "min-quantity": null,
            "disclose-quantity": 0,
            "price": order.price.toString(),
            "valid-till": order.expiration.type.toString(),
            "valid-till-date": order.expiration.tillDate
        });

        let body = this.getPreAddOrUpdateOrder(order, false);
        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map((response: DerayahHttpResponse) => response))
    }

    public updateOrder(order:DerayahOrder):Observable<DerayahHttpResponse> {
        let url:string = `${this.getDerayahOauthUrl()}/Order/Update`;

        this.logRequestData('update order', {
            "order-id": order.id,
            "portfolio": order.portfolio,
            "exchange-code": order.derayahMarket,
            "symbol": order.derayahSymbol,
            "order-side": order.type.type.toString(),
            "execution-type": order.execution.type.toString(),
            "quantity": order.quantity.toString(),
            "fill-type": "1",
            "min-quantity": null,
            "disclose-quantity": 0,
            "price": order.price.toString(),
            "valid-till": order.expiration.type.toString(),
            "valid-till-date": order.expiration.tillDate
        });

        return this.derayahHttpClientService.postWithAuth(url, this.getPreAddOrUpdateOrder(order, false)).pipe(map((response: DerayahHttpResponse) => response))
    }

    public getPreAddOrUpdateOrder(order: DerayahOrder , isNewOrder: boolean) {
        let body: DerayahAddOrUpdateOrderBody = {
            portfolio: +order.portfolio,
            exchangeCode: order.derayahMarket,
            symbol: order.derayahSymbol,
            orderSide: order.type.type,
            executionType: order.execution.type,
            fillType: 1,
            discloseQuantity: order.discloseQuantity,
            quantity: order.quantity,
            price: order.price,
            validTill: +order.expiration.type,
            minQantity : order.executedQuantity
        }
        if(order.expiration.tillDate){
            body.validTillDate = moment(order.expiration.tillDate, 'YYYY-MM-DD').format();
        }
        if(!isNewOrder){
            body.orderId = +order.id
        }
        return body;
    }

    public deleteOrder(order:DerayahOrder):Observable<DerayahHttpResponse> {
        let url:string = `${this.getDerayahOauthUrl()}/Order/Cancel`;

        this.logUrl('Derayah delete order url : ' , url);

        this.logRequestData('delete order', {'portfolio': order.portfolio, 'order-id': order.id, 'exchange-code': order.derayahMarket});

        let body: DerayahDeleteOrderBody = {orderId: +order.id, portfolio: +order.portfolio, exchangeCode: order.derayahMarket}
        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map((response: DerayahHttpResponse) => response))
    }

    public revertUpdate(order:DerayahOrder, actionFlag:string):Observable<DerayahHttpResponse> {
        let url: string = `${this.getDerayahOauthUrl()}/Order/Revert`

        this.logUrl('Derayah revert update url : ' , url);

        this.logRequestData('revert order', {
            "order-id": order.id,
            "portfolio": order.portfolio,
            "exchange-code": order.derayahMarket,
            "action-flag": actionFlag
        });
        return this.derayahHttpClientService.postWithAuth(url, this.getOrderDetailsAndRevertBody(order)).pipe(map((response: DerayahHttpResponse) => response))
    }

    public getOrderDetails(order:DerayahOrder):Observable<DerayahHttpResponse> {
        let url:string = `${this.getDerayahOauthUrl()}/Order/Details`;
        this.logUrl('Derayah order details url : ' , url);

        this.logRequestData('order details',
            {
                "order-id": order.id,
                "portfolio": order.portfolio,
                "exchange-code": order.derayahMarket
            });
        return this.derayahHttpClientService.postWithAuth(url, this.getOrderDetailsAndRevertBody(order)).pipe(map((response: DerayahHttpResponse) => response))
    }

    private getOrderDetailsAndRevertBody(order: DerayahOrder): DerayahOrderDetailsAndRevertBody {
        return {orderID: +order.id, portfolio: +order.portfolio, exchangeCode: order.derayahMarket}
    }

    public calculateOrderQuantity(order:DerayahOrder, power:number):Observable<DerayahHttpResponse>{
        let url:string = `${this.getDerayahOauthUrl()}/order/Calculate`
        this.logUrl('Derayah quantity calculator url : ', url);

        this.logRequestData('Derayah quantity calculator ', {
            'order-symbol': order.derayahSymbol,
            'order-type': order.type.type,
            'order-price': order.price,
            'order-execution': order.execution.type,
            'order-portfolio': order.portfolio,
            'power': power,
            'order-makret': order.derayahMarket
        });
        let body: DerayahQuantityCalculationBody = {
            symbol: order.derayahSymbol,
            side: order.type.type,
            price: order.price,
            executionType: order.execution.type,
            portfolio: +order.portfolio,
            buyingPower: power,
            exchangeCode : order.derayahMarket
        }

        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map((response: DerayahHttpResponse) => response))
    }

    /* get methods */

    public getPortfolios(): Observable<DerayahHttpResponse> {
        let url: string = `${this.getDerayahOauthUrl()}/Portfolio/List`;

        this.logUrl('Derayah get portfolios url: ' , url);

        return this.derayahHttpClientService.getWithAuth(url).pipe(map((response: DerayahHttpResponse) => response));
    }

    public getOrders(portfolio:string, orderStatusGroup:number):Observable<DerayahHttpResponse> {
        let url:string = `${this.getDerayahOauthUrl()}/Order/List`;

        this.logUrl('Derayah orders url : ' , url);

        let body: DerayahOrderBody = {portfolio: +portfolio, orderStatusGroup: orderStatusGroup, isIntraDay: true, exchanges: [98,99]}
        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map((response: DerayahHttpResponse) => response));
    }

    public getDerayahPurchasePower(portfolio:string, exchangeCode:number, symbol:string):Observable<Object> {
        let url:string = `${this.getDerayahOauthUrl()}/UserPosition/BuyingPower`;

        this.logUrl('Derayah purchase power url: ' , url);

        this.logRequestData('purchase power', {
            'portfolio': portfolio,
            'exchange-code': exchangeCode,
            'symbol': symbol
        });
        let body: DerayahPurchasePowerBody = {portfolio: +portfolio, exchangeCode: exchangeCode, symbolCode: symbol, ratingEQTY: symbol};

        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map((response: DerayahHttpResponse) => response));
    }

    public getPositions(portfolio:string):Observable<DerayahHttpResponse> {
        let url:string = `${this.getDerayahOauthUrl()}/UserPosition/ListPositions`;

        this.logUrl('Derayah get positions url : ' , url);

        this.logRequestData('positions', {'portfolio': portfolio, 'currency-code': "1"});

        let body: DerayahPositionsBody = {currencyCode: 1, exchangeCodes : [98,99], portfolio: +portfolio}

        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map((response:DerayahHttpResponse) => response))
    }

    public getPortfolioQueue(portfolio:string):Observable<PortfolioQueueResponse> {

        let url:string = `${this.getDerayahOauthUrl()}/Queue/Create`;

        this.logUrl('Derayah get Portfolio Queue url : ' , url);

        this.logRequestData('Portfolio Queue', {'portfolioId': +portfolio, 'transactionType': "0"});

        let body = {portfolioId: +portfolio, transactionType : 0};

        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map((response:PortfolioQueueResponse) => response))
    }

    /* helpers */

    private logUrl(urlDescription:string, url:string):void{
        // if(!Config.isProd()) {
        //     Tc.info(urlDescription + url);
        //     TcTracker.trackUrgentMessage(urlDescription + url);
        // }
    }

    private logRequestData(url:string, data:unknown){
        // if(!Config.isProd()) {
        //     Tc.info('request data for ' + url + ' url is: ' + JSON.stringify(data, null, '\t'));
        //     TcTracker.trackUrgentMessage('request data for ' + url + ' url is: ' + JSON.stringify(data));
        // }
    }
}

export interface PortfolioQueueResponse {
    data: string,
    isSuccess: boolean,
    isValidInput: boolean,
    message: string,
    responseCode: string,
}

export interface DerayahAuthorizeResponse {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    token_type: string,
}

export interface DerayahHttpResponse {
    data: DerayahPortfolioResponse[] | DerayahAccountPositionInfoList | DerayahPurchasePowerResponse | DerayahOrderResponse | DerayahDetailsOrderResponse | DerayahDeleteOrderResponse | DerayahPreConfirmResponse | DerayahUpdateResponse | DerayahRevertResponse |DerayahQuantityCalculationResponse,
    isSuccess: true
    isValidInput: true
    message: null
    responseCode: number
}

export interface DerayahPurchasePowerResponse {
    ppcurrency: number
    purchasepower: number
}

export interface DerayahPreConfirmResponse {
    amount: string,
    fees: string,
    total: string,
    vatamount: string,
    vatamountequ: string,
    vatidno: string,
    warningMessage: string
}

export interface DerayahOrderDetailsAndRevertBody {
    orderID: number,
    portfolio: number,
    exchangeCode: number
}

export interface DerayahDetailsOrderResponse {
    result : DerayahDetailsOrderResult,
    actions: DerayahDetailsOrderAction[]
}

export interface DerayahDetailsOrderResult {
    orderNo: number,
    branchCode: number,
    portfolio: string,
    currency: number,
    ledgerCode: number,
    seqNo: number,
    exchangeCode: number,
    orderDate: string,
    orderDateTime: string,
    accountNo: string,
    userId: string,
    symbol: string,
    symbolNameAr: string,
    symbolNameEn: string,
    side: number,
    executionType: number,
    price: number,
    stopPrice: number,
    averagePrice: number,
    quantity: number,
    fillType: number,
    filledQuantity: number,
    remainingQuantity: number,
    minQuantity: number,
    validTill: number,
    validTillDate: string,
    discloseQuantity: number,
    estimatedFee: number,
    estimatedAmount: number,
    blockedAmount: number,
    orderstatus: number,
    executionAmount: number,
    feesCollected: number,
    netAmount: number,
    netAmountInAcctCurrency: number,
    vatAmount: number,
    vatAmountEqu: number,
    vatIdNo: string,
    execVAT: number,
    execVATEqu: number,
    accruedAmount: number,
    execAccruedAmount: number,
    outDervOrdType: number,
    cashAccountName: string,
    canCancelOrder: boolean,
    canModifyOrder: boolean,
    canRevokeOrder: boolean
}

export interface DerayahDetailsOrderAction {
    actiondate: string,
    actionstatus: string,
    actiontype: number,
    dealquantity: number,
    fees: number,
    lastupdated: string,
    netdealamount: number,
    orderside: number,
    price: number,
    rejectioncode: number,
    rejectionReason: string,
    sequencenumber: string,
    validtill: string,
    vat: number,
    vatequ: string
}

export interface DerayahQuantityCalculationBody {
    symbol: string,
    side: number,
    price: number,
    executionType: number,
    portfolio: number,
    buyingPower: number,
    exchangeCode: number
}

export interface DerayahQuantityCalculationResponse {
    estimatedAmtinInstrumentCcy: string,
    estimatedFeeInInstrumentCcy: string,
    estimatedOrderQty: string
}

export interface DerayahPortfolioResponse {
    PortfolioName: string,
    PortfolioNumber: string
}

export interface DerayahAccountPositionInfoList {
    tradingAccountPositionInfoList: DerayahPositionResponse[]
}

export interface DerayahPositionResponse {
    cost: number,
    exchangecode: number,
    freeQuantity: number,
    quantity: number,
    symbol: string
}

export interface DerayahPositionsBody {
    currencyCode: number,
    exchangeCodes: number[],
    portfolio: number
}

export interface DerayahPurchasePowerBody {
    portfolio: number,
    exchangeCode: number,
    symbolCode: string,
    ratingEQTY: string
}

export interface DerayahOrderBody {
    portfolio: number,
    orderStatusGroup: number,
    isIntraDay: boolean,
    exchanges: number[]
}

export interface DerayahOrderResponse {
    orders: DerayahOrders[]
}

export interface DerayahOrders {
    orderId: number,
    orderDate: string,
    exchangeCode: number,
    symbol: string,
    side: number,
    executionType: number,
    quantity: number,
    executedQuantity: number,
    price: number,
    status: number,
    disclosequantity?: number,
    lastActionStatus: string,
    canCancelOrder: boolean,
    canModifyOrder: boolean,
    canRevokeOrder: boolean
}

export interface DerayahDeleteOrderBody {
    orderId: number,
    portfolio: number,
    exchangeCode: number
}

export interface DerayahDeleteOrderResponse {
    orderNumber: number
}

export interface DerayahAddOrUpdateOrderBody {
    orderId?:number,
    portfolio:number,
    exchangeCode:number,
    symbol:string,
    orderSide:number,
    executionType:number,
    fillType:number,
    discloseQuantity:number,
    quantity:number,
    price:number,
    validTill:number,
    validTillDate?:string,
    minQantity:number
}

export interface DerayahUpdateResponse {
    changeOrderNumber: number
}

export interface DerayahRevertResponse {
    revokeOrderNumber: number
}
