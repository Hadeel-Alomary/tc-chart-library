import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';
import {MarketUtils, Tc} from '../../../../utils';
import {
    VirtualTradingAccount,
    VirtualTradingOrder,
    VirtualTradingOrderAction,
    VirtualTradingOrderDetails,
    VirtualTradingPosition,
    VirtualTradingTransaction
} from '../../../trading/virtual-trading/virtual-trading-models';
import {NotificationMethodResponse, VirtualTradingNotificationMethods} from '../../../notification';

@Injectable()
export class VirtualTradingLoader {

    private basicUrl: string;

    constructor(
        private http: HttpClient,
    ) {
        // this.loader.getConfigStream()
        //     .subscribe((loaderConfig:LoaderConfig) => {
        //         if(loaderConfig){
        //             this.onLoaderConfig(loaderConfig);
        //         }
        //     });
    }

    public login(username: string, password: string): Observable<void> {
        let url:string = `${this.basicUrl}/signin/`;

        return this.http.post<VirtualTradingResponse>(url, {
            username,
            password
        }, this.RequestOptions).pipe(
            map(response => {
                if(!response.success) {
                    throwError('login failed');
                }
                return null;
            })
        );
    }

    public logout(): Observable<null> {
        let url:string = `${this.basicUrl}/signout/`;

        return this.http.post<VirtualTradingResponse>(url, {}, this.RequestOptions).pipe(() => null);
    }

    public createVirtualTradingAccount(capital: number, commission: number, currency: string, name: string, language: string): Observable<null> {
        let url:string = `${this.basicUrl}/accounts/`;

        return this.http.post<VirtualTradingResponse>(url, {
            capital, commission, currency, name, language
        }, this.RequestOptions).pipe(
            map( response => {
                if(!response.success) {
                    throwError('create virtual trading account failed');
                }
                return null;
            })
        );
    }

    public deleteVirtualTradingAccount(accountId: number): Observable<null> {
        let url:string = `${this.basicUrl}/accounts/${accountId}/delete`;

        return this.http.post<VirtualTradingResponse>(url, {}, this.RequestOptions).pipe(
            map( response => {
                if(!response.success) {
                    throwError('delete virtual trading account failed');
                }
                return null;
            })
        );
    }

    public getAccounts(): Observable<VirtualTradingAccount[]> {
        let url: string = `${this.basicUrl}/accounts`;

        return this.http.get<VirtualTradingResponse>(Tc.url(url), this.RequestOptions).pipe(
            map( (response: VirtualTradingResponse) => {
                if(!response.success) {
                    return null;
                }
                let result:VirtualTradingAccount[] = [];
                (response.response as VirtualTradingAccountResponse[]).forEach((accountData: VirtualTradingAccountResponse) => {
                    result.push(VirtualTradingAccount.mapResponseToVirtualTradingAccount(accountData));
                });
                return result;
            })
        )
    }

    public updateAccountName(accountId: number, name: string): Observable<null> {
        let url: string = `${this.basicUrl}/accounts/${accountId}/name`;

        return this.http.post<VirtualTradingResponse>(url, {name}, this.RequestOptions).pipe(
            map(() => null)
        );
    }

    public updateAccountCommission(accountId: number, commission: number): Observable<null> {
        let url: string = `${this.basicUrl}/accounts/${accountId}/commission`;

        return this.http.post<VirtualTradingResponse>(url, {commission}, this.RequestOptions).pipe(
            map(() => null)
        );
    }

    public updateAccountCapital(accountId: number, action: string, amount: number, date: string): Observable<null> {
        let url: string = `${this.basicUrl}/accounts/${accountId}/capital`;

        return this.http.post<VirtualTradingResponse>(url, {action, amount, date}, this.RequestOptions).pipe(
            map(() => null)
        );
    }

    public getAccountTransactions(accountId: number): Observable<VirtualTradingTransaction[]> {
        let url: string = `${this.basicUrl}/accounts/${accountId}/transactions/`;

        return this.http.get<VirtualTradingResponse>(Tc.url(url), this.RequestOptions).pipe(
            map(response =>
                VirtualTradingTransaction.mapResponseToVirtualTradingTransactions(response.response as VirtualTradingTransactionResponse[])
            )
        );
    }

    public setNotificationMethods(accountId: number, methods: VirtualTradingNotificationMethods): Observable<null> {
        let url: string = `${this.basicUrl}/accounts/${accountId}/notifications`;
        return this.http.post<VirtualTradingResponse>(url, {
            notifications: methods.toRequestObject()
        }, this.RequestOptions).pipe(map(() => null));
    }

    public postOrder(accountId: number, order: VirtualTradingOrder): Observable<null> {
        let url: string = `${this.basicUrl}/accounts/${accountId}/orders`;

        return this.http.post<VirtualTradingResponse>(url, {
            symbol: MarketUtils.symbolWithoutMarket(order.symbol),
            price: order.price,
            quantity: order.quantity,
            stop_price: order.stopPrice,
            take_profit: order.takeProfit,
            market: order.market.abbreviation,
            order_side: order.orderSide.value,
            order_type: order.orderType.value,
            expiration_date: order.expirationDate,
            execution_time: order.executionTime
        }, this.RequestOptions).pipe(
            map(() =>  null)
        );
    }

    public updateOrder(accountId: number, order: VirtualTradingOrder): Observable<null> {
        let url: string = `${this.basicUrl}/accounts/${accountId}/orders/${order.id}`;

        return this.http.post<VirtualTradingResponse>(url, {
            price: order.price,
            quantity: order.quantity,
            stop_price: order.stopPrice,
            take_profit: order.takeProfit,
            expiration_date: order.expirationDate
        }, this.RequestOptions).pipe(
            map(() => null)
        );
    }

    public getPositions(accountId: number): Observable<VirtualTradingPosition[]> {
        let url: string = `${this.basicUrl}/accounts/${accountId}/positions`;

        return this.http.get<VirtualTradingResponse>(Tc.url(url), this.RequestOptions).pipe(
            map(response =>
                VirtualTradingPosition.mapResponseToVirtualTradingPositions(response.response as VirtualTradingPositionResponse[])
            )
        );
    }

    public getOrders(accountId: number): Observable<VirtualTradingOrder[]> {
        let url: string = `${this.basicUrl}/accounts/${accountId}/orders/`;

        return this.http.get<VirtualTradingResponse>(Tc.url(url), this.RequestOptions).pipe(
            map(response =>
                VirtualTradingOrder.mapResponseToVirtualTradingOrders(response.response as VirtualTradingOrderResponse[])
            )
        );
    }

    public getOrderDetails(accountId: number, order: VirtualTradingOrder): Observable<VirtualTradingOrderDetails> {
        let url: string = `${this.basicUrl}/accounts/${accountId}/orders/${order.id}/`;

        return this.http.get<VirtualTradingResponse>(Tc.url(url), this.RequestOptions).pipe(
            map(response => {
                    let detailsResponse = response.response as VirtualTradingOrderDetailsResponse;
                    let order = VirtualTradingOrder.mapDetailsResponseToVirtualTradingOrder(detailsResponse.order);
                    let actions = VirtualTradingOrderAction.mapResponseToVirtualTradingOrderActions(detailsResponse.actions);
                    return new VirtualTradingOrderDetails(order, actions);
                }
            )
        );
    }

    public deleteOrder(accountId: number, order: VirtualTradingOrder): Observable<null>{
        let url: string = `${this.basicUrl}/accounts/${accountId}/orders/${order.id}/delete`;

        return this.http.post<VirtualTradingResponse>(url, {}, this.RequestOptions).pipe(map(() => null));
    }

    // private onLoaderConfig(loaderConfig:LoaderConfig){
    //     this.basicUrl = LoaderConfig.url(loaderConfig, LoaderUrlType.VirtualTradingUrl);
    // }

    private get RequestOptions(): Object {
        return {
            headers: new HttpHeaders({
                // 'Authorization': this.loader.getToken()
			  'Authorization': null
            })
        };
    }

}

interface VirtualTradingResponse{
    success: boolean,
    response: VirtualTradingAccountResponse[] | VirtualTradingPositionResponse[] | VirtualTradingOrderResponse[] | VirtualTradingOrderActionResponse[] | VirtualTradingOrderDetailsResponse | VirtualTradingTransactionResponse[]
}

export interface VirtualTradingAccountResponse {
    id: number,
    capital: number,
    commission: number,
    currency: string,
    name: string,
    language: string,
    purchase_power: number,
    notifications: NotificationMethodResponse[]
}

export interface VirtualTradingPositionResponse {
    id: number,
    trading_account_id: number,
    market: string,
    symbol: string,
    average_price: number,
    quantity: number,
    free_quantity: number
}

export interface VirtualTradingOrderResponse {
    id: number,
    order_side: string,
    order_type: string,
    trading_account_id: number,
    symbol: string,
    market: string,
    quantity: number,
    price: number,
    stop_price: number,
    take_profit: number,
    commission: number,
    commission_amount: number,
    execution_price: number,
    execution_time: string,
    expiration_date: string,
    order_status: string,
    created_at: string,
    updated_at: string
}

export interface VirtualTradingOrderActionResponse {
    id: number,
    action_type: string,
    created_at: string,
    updated_at: string
}

export interface VirtualTradingOrderDetailsResponse {
    order: VirtualTradingOrderResponse,
    actions: VirtualTradingOrderActionResponse[]
}

export interface VirtualTradingTransactionResponse {
    id: number,
    transaction_date: string,
    transaction_action: string,
    amount: number,
    trading_account_id: number,
    trading_order_id: number,
    symbol: string,
    quantity: number,
    market: string
}
