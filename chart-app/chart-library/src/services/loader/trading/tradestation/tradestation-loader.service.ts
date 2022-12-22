import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MarketUtils} from '../../../../utils';
import {TradestationOrder, TradestationOrderStatusType, TradestationOrderExpiration, TradestationOrderType} from '../../../trading/tradestation/tradestation-order';
import {TradestationHttpClientService} from '../../../trading/tradestation/tradestation.http-client-service';
import {TradestationClientService} from '../../../trading/tradestation/tradestation-client-service';
import {TradestationStateService} from '../../../state/trading/tradestation';
import {TcUrlUtils} from '../../../../utils/tc.url.utils';

@Injectable()
export class TradestationLoaderService {

    constructor(private http: HttpClient, private tradestationClient: TradestationClientService, private tradestationHttpClientService: TradestationHttpClientService,
                private tradestationStateService: TradestationStateService) { }

    private getBaseUrl(): string{
        return this.tradestationClient.getBaseUrl();
    }

    private getAccountKey(): string {
        return this.tradestationStateService.getTradestationAccountKeys();
    }

    private getRedirectUrl(): string {
        return document.location.protocol + "//" + document.location.host  + '/m/tradestation/oauth/redirect';
    }

    public getLogInPageLink(): string {
        return `${this.getBaseUrl()}/authorize/?redirect_uri=${this.getRedirectUrl()}&client_id=${this.tradestationClient.getClientId()}&response_type=code`;
    }

    public getAccessToken(oauthCode: string): Observable<TradestationAuthorizeResponse> {
        let headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        let url: string = `${this.getBaseUrl()}/security/authorize`;
        let data = `code=${oauthCode}&redirect_uri=${this.getRedirectUrl()}&client_id=${this.tradestationClient.getClientId()}&client_secret=${this.tradestationClient.getClientSecret()}&grant_type=authorization_code`;
        return this.http.post<TradestationAuthorizeResponse>(url, data, headers);
    }

    public callTradestationIntegrationLink(basicUrl:string,numberOfAccounts:number): Observable<void> {
        let username:string = null;
	  // let username:string = this.credentialsService.trackingId;
        // let version:string = Config.getVersion();
      let version = null;

        return this.http.post(TcUrlUtils.url(basicUrl+`?version=web_${version}`),{user_name: username, p1: numberOfAccounts}).pipe(map(()=>{}));
    }

    public getAccounts(user_id: string): Observable<TradestationAccountResponse[]> {
        let url = `${this.getBaseUrl()}/users/${user_id}/accounts`;
        return this.tradestationHttpClientService.getWithAuth(url).pipe(map((response: TradestationAccountResponse[])=> response));
    }

    public getOrders(): Observable<TradestationOrderResponse[]> {
        let oneMonth = moment(new Date(), 'YYYY-MM-DD').subtract(1 , 'months').format('MM-DD-YYYY');
        let url = `${this.getBaseUrl()}/accounts/${this.getAccountKey()}/orders?since=${oneMonth}`;
        return this.tradestationHttpClientService.getWithAuth(url).pipe(map((response: TradestationOrderResponse[])=> response));
    }

    public getPositions(): Observable<TradestationPositionResponse[]> {
        let url = `${this.getBaseUrl()}/accounts/${this.getAccountKey()}/positions`;
        return this.tradestationHttpClientService.getWithAuth(url).pipe(map((response: TradestationPositionResponse[])=> response));
    }

    public getBalances(): Observable<TradestationBalanceResponse[]> {
        let url = `${this.getBaseUrl()}/accounts/${this.getAccountKey()}/balances`;
        return this.tradestationHttpClientService.getWithAuth(url).pipe(map((response: TradestationBalanceResponse[])=> response));
    }

    public getOrderConfirmation(order: TradestationOrder, osoOrders: TradestationOrder[], accountKey:number): Observable<TradestationOrderConfirmationResponse[]> {
        let url = `${this.getBaseUrl()}/orders/confirm`;
        let body: TradestationPostOrderBody = this.getOrderHttpBody(order,accountKey);
        if(osoOrders.length > 0){
            body.OSOs = this.getOsoOrders(osoOrders, accountKey);
        }
        return this.tradestationHttpClientService.postWithAuth(url, body).pipe(map((response: TradestationOrderConfirmationResponse[]) => response));
    }


    public postOrder(order: TradestationOrder, osoOrders: TradestationOrder[], accountKey:number): Observable<TradestationPostOrderResponse[]> {
        let url = `${this.getBaseUrl()}/orders`;
        let body = this.getOrderHttpBody(order, accountKey);
        if(osoOrders.length > 0){
            body.OSOs = this.getOsoOrders(osoOrders, accountKey);
        }
        return this.tradestationHttpClientService.postWithAuth(url, body).pipe(map((response: TradestationPostOrderResponse[]) => response));
    }

    public updateOrder(order: TradestationOrder): Observable<TradestationPostOrderResponse> {
        let url = `${this.getBaseUrl()}/orders/${order.id}`;
        let body: TradestationPostOrderBody = {
            OrderType: order.type,
            Quantity: order.quantity,
            Symbol: MarketUtils.symbolWithoutMarket(order.symbol)
        };

        if(TradestationOrder.isLimitOrder(order) || TradestationOrder.isStopLimit(order)){
            body.LimitPrice = order.price;
        }

        if(TradestationOrder.isStopOrder(order)){
            if (order.trailingAmount) {
                body.AdvancedOptions = {TrailingStop: {Amount: order.trailingAmount}};
            } else if (order.trailingPercent) {
                body.AdvancedOptions = {TrailingStop: {Percent: order.trailingPercent}};
            }
            body.stopPrice = order.stopPrice;
        }

        return this.tradestationHttpClientService.putWithAuth(url, body).pipe(map((response: TradestationPostOrderResponse) => response))
    }

    public getOrderHttpBody(order: TradestationOrder,  accountKey:number): TradestationPostOrderBody {
        let expirationType: string = order.expirationType.type;
        let exType = expirationType.indexOf('+');
        if (exType != -1) {
            expirationType = TradestationOrderExpiration.convertExpirationType(expirationType);
        }
        let type: TradestationOrderType = order.type;
        let postOrderBody: TradestationPostOrderBody = {
            AccountKey: accountKey.toString(),
            AssetType: 'EQ',
            Duration: expirationType,
            OrderType: type,
            Quantity: order.quantity,
            Route: order.routing.value,
            Symbol: MarketUtils.symbolWithoutMarket(order.symbol),
            TradeAction: order.side.value.replace(/ /g, '').toUpperCase(),
            TriggeredBy: null
        };

        if (order.confirmationId) {
            postOrderBody.orderConfrimId = order.confirmationId;
        }

        if (order.tillDate) {
            postOrderBody.GTDDate = moment(order.tillDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
        }

        if (TradestationOrder.isLimitOrder(order) || TradestationOrder.isStopLimit(order)) {
            postOrderBody.LimitPrice = order.price;
        }

        if(TradestationOrder.isStopOrder(order)){
            if (order.trailingAmount) {
                postOrderBody.AdvancedOptions = {TrailingStop: {Amount: order.trailingAmount}};
            } else if (order.trailingPercent) {
                postOrderBody.AdvancedOptions = {TrailingStop: {Percent: order.trailingPercent}};
            } else {
                postOrderBody.stopPrice = order.stopPrice;
            }
        }

        return postOrderBody;
    }

    private getOsoOrders(osoOrders: TradestationOrder[] , accountKey:number) {
        let httpOsoOrders: TradestationPostOrderBody[] = [];
        let oso: TradestationOsoOrders[] = [];
        for(let osoOrder of osoOrders){
            httpOsoOrders.push(this.getOrderHttpBody(osoOrder, accountKey));
        }
        oso.push({Type: 'NORMAL', Orders: httpOsoOrders});
        return oso;
    }

    public deleteOrder(orderId: string): Observable<TradestationPostOrderResponse> {
        let url = `${this.getBaseUrl()}/orders/${orderId}`;
        return this.tradestationHttpClientService.deleteWithAuth(url).pipe(map((response: TradestationPostOrderResponse)=> response));
    }
}

export interface TradestationAuthorizeResponse {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    token_type: string,
    userid: string,
}

export interface TradestationAccountResponse {
    Alias: string,
    AltId: string,
    CanDayTrade: boolean,
    ClearingID: number,
    Currency: string,
    DayTradingQualified: boolean,
    DisplayName: string,
    IsStockLocateEligible: boolean,
    Key: number,
    Name: string,
    OptionApprovalLevel: number,
    PatternDayTrader: boolean,
    Status: string,
    StatusDescription: string,
    Type: string,
    TypeDescription: string
}

export interface TradestationOrderResponse {
    AccountID: string,
    AdvancedOptions: string,
    Alias: string,
    AssetType: string,
    CommissionFee: number,
    ContractExpireDate: string,
    ConversionRate: number,
    CostBasisCalculation: string,
    Country: string,
    Denomination: string,
    DisplayName: string,
    DisplayType: number,
    Duration: string,
    ExecuteQuantity: number,
    FilledCanceled: string,
    FilledPrice: number,
    FilledPriceText: string,
    GroupName: string,
    LimitPrice: number,
    LimitPriceText: string,
    MinMove: number,
    OrderID: number,
    Originator: number,
    Quantity: number,
    QuantityLeft: number,
    RealizedExpenses: number,
    RejectReason: string,
    Routing: string,
    ShowOnlyQuantity: number,
    Spread: string,
    Status: TradestationOrderStatusType,
    StatusDescription: string,
    StopPrice: number,
    StopPriceText: string,
    Symbol: string,
    TimeStamp: string,
    TriggeredBy: string,
    Type: string,
    UnbundledRouteFee: number,
    TrailingStop: TrailingStopResponse,
    Legs: [OrderLegsResponse],
}

export interface OrderLegsResponse {
    Quantity: number,
    ExecQuantity: number,
    Leaves: number,
    StopPrice: number,
    TimeExecuted: string,
    LimitPrice: number,
    ExecPrice: number,
    OrderType: TradestationOrderType,
    QuantityLeft:number,
}

export interface TradestationPositionResponse {
    AccountID: string,
    AssetType: string,
    Symbol: string,
    Key: string,
    Quantity: number,
    AveragePrice: number,
    LastPrice: number,
    AskPrice: number,
    BidPrice: number,
    MarketValue: number,
    TotalCost: number,
    OpenProfitLoss: number,
    OpenProfitLossPercent: number,
    OpenProfitLossQty: number,
    TodaysProfitLoss: number,
    LongShort: string,
    MaintenanceMargin: number
    TimeStamp: string,
    InitialMargin: string,
    MarkToMarketPrice: number
}

export interface TradestationBalanceResponse {
    DisplayName: string,
    Type: string,
    RealTimeAccountBalance: number,
    RealTimeEquity: number,
    RealTimeCostOfPositions: number,
    RealTimeRealizedProfitLoss: number,
    RealTimeUnrealizedProfitLoss: number,
    RealTimeOvernightBuyingPower: number,
    RealTimeBuyingPower: number,
    ClosedPositions: ClosedPositionResponse[],
    DayTradingQualified: boolean,
    DayTrades: number,
    BODAccountBalance: number,
    BODEquity: number,
    UnsettledFund: number,
    BODOvernightBuyingPower: number,
    BODDayTradingMarginableEquitiesBuyingPower: number,
    RealTimeDayTradingMarginableEquitiesBuyingPower: number,
    UnclearedDeposit: number,
    StatusDescription: string,
    PatternDayTrader: boolean,
}

export interface TradestationOrderConfirmationResponse {
    Account: string,
    AssetType: string,
    Denomination: string,
    DisplayName: string,
    DisplayType: number,
    Duration: string,
    MarketActivationRules: string,
    OrderConfirmId: string,
    RelationIdentifier: string,
    Route: string,
    ShowOnlyQuantity: number,
    SummaryMessage: string,
    TimeActivationRules: string,
    TrailingStop: number,
    BaseSymbol: string,
    DebitCreditEstimatedCost: number,
    DebitCreditEstimatedCostDisplay: string,
    EstimatedCommission: number,
    EstimatedCommissionDisplay: string,
    EstimatedCost: number,
    EstimatedCostDisplay: string,
    EstimatedPrice: number,
    EstimatedPriceDisplay: string,
    Legs: [OrderLegsResponse],
    LimitPrice: number,
    OrderType: string,
    Quantity: number,
    Spread: string,
    SpreadSide: string,
    StopPrice: number
}

export interface TradestationPostOrderResponse {
    Message: string
    OrderID: string
    OrderStatus: string
}

export interface TrailingStopResponse {
    Amount?: number,
    Percent?: number
}

export interface ClosedPositionResponse {
    Currency: string,
    Profit: number,
    Symbol: string
}

export interface TradestationPostOrderBody {
    AccountKey?: string,
    orderConfrimId?: string,
    AssetType?: string,
    Duration?: string,
    GTDDate?: string,
    OrderType: TradestationOrderType,
    Quantity: number,
    Route?: string,
    Symbol: string,
    TradeAction?: string,
    TriggeredBy?: string,
    LimitPrice?: number,
    stopPrice?: number,
    OSOs?: TradestationOsoOrders[]
    AdvancedOptions?: {TrailingStop:TrailingStopResponse}
}

export interface TradestationOsoOrders {
    Orders: TradestationPostOrderBody[],
    Type: string
}
