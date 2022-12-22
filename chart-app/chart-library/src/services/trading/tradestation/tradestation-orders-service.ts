import {Injectable} from '@angular/core';
import {Subject, Observable, of , concat } from 'rxjs';
import {LanguageService} from '../../language';
import {ChannelRequestType, SharedChannel} from '../../shared-channel';
import {TradestationOrder} from './tradestation-order';
import {TradestationService} from './tradestation.service';
import {TradestationMessageChannelRequest} from '../../shared-channel/channel-request';
import {TradestationLoaderService} from '../../loader/trading/tradestation';
import {TradestationOrderConfirmationResponse, TradestationOrderResponse, TradestationPostOrderResponse} from '../../loader/trading/tradestation/tradestation-loader.service';
import {catchError, map, toArray} from 'rxjs/operators';
import {TradestationUtils} from '../../../utils/tradestation.utils';
import {Tc, TcTracker} from '../../../utils';
import {TradestationStateService} from '../../state/trading/tradestation';
import {TradestationAccountsService} from './tradestation-accounts-service';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class TradestationOrdersService {

    private ordersStream: Subject<TradestationOrder[]>;
    private orders: TradestationOrder[] = [];
    private groupedOrders: TradestationOrder[] = [];

    constructor(private tradestationService: TradestationService, private tradestationLoaderService: TradestationLoaderService, private tradestationStateService: TradestationStateService, private tradestationAccountsService: TradestationAccountsService, private sharedChannel:SharedChannel, private languageService:LanguageService) {
        this.ordersStream = new Subject();

        this.tradestationAccountsService.getAccountStream().subscribe(() => {
            this.refreshOrders();
        });
    }

    public getOrdersStream(): Subject<TradestationOrder[]> {
        return this.ordersStream;
    }

    private refreshOrders(): void {
        this.getOrders().subscribe(response => this.onOrders(response));
    }

    private onOrders(response: TradestationOrder[]): void {
        this.orders = response;
        this.groupedOrders = this.buildGroupedOrders(response);
        this.ordersStream.next(this.groupedOrders);
    }

    public getGroupedOrders(): TradestationOrder[] {
        return this.groupedOrders;
    }

    private getOrders(): Observable<TradestationOrder[]> {
        return this.tradestationLoaderService.getOrders().pipe(
            map((response: TradestationOrderResponse[]) => this.mapOrders(response)));
    }

    private mapOrders(response: TradestationOrderResponse[]): TradestationOrder[] {

        let tradestationOrders: TradestationOrder[] = [];
        let orders = response as TradestationOrderResponse[];

        if (orders && orders.length > 0) {
            for (let order of orders) {
                let symbol = TradestationUtils.getSymbolWithMarketFromTradestation(order.Symbol);
                // let company = this.marketsManager.getCompanyBySymbol(symbol);
                // tradestationOrders.push(TradestationOrder.mapResponseToTradestationOrder(order,company.name,company.symbol));
            }
        }
        return tradestationOrders;
    }

    private buildGroupedOrders(response: TradestationOrder[]): TradestationOrder[]{
        let groupedOrders: TradestationOrder[] = [];
        response.forEach(order => {
            //grouped order is parent and order is child : in grouping we have to check if child is Active or not to make group. in edit order maybe change them and make them inactive.
            //check parent is Active or not because status of parent  will come queued so we can't make group.
            let groupedOrder: TradestationOrder = TradestationOrder.isActiveOrder(order) ? groupedOrders.find(groupedOrder => groupedOrder.id == order.triggeredBy && TradestationOrder.isActiveOrder(groupedOrder)) : null;
            if (groupedOrder) {
                if (order.stopPrice > 0) {
                    groupedOrder.stopLossPrice = order.stopPrice;
                }
                if (order.price > 0) {
                    groupedOrder.takeProfitPrice = order.price;
                }
            } else {
                groupedOrders.push(order);
            }
        });
        return groupedOrders;
    }

    public getStopLossOrTakeProfitOrder(id: string , isStopLoss: boolean): TradestationOrder{
        if(isStopLoss){
            return this.orders.find(order => order.triggeredBy  == id && order.stopPrice > 0 && TradestationOrder.isActiveOrder(order));
        }else{
            return this.orders.find(order => order.triggeredBy  == id && order.price > 0 && TradestationOrder.isActiveOrder(order));
        }
    }

    private showMessageBox(message: string , isErrorMessage: boolean): void {
        let request: TradestationMessageChannelRequest = {type: ChannelRequestType.TradestationMessage, messageLines: [message], isErrorMessage: isErrorMessage, showWarningMessage: false};
        this.sharedChannel.request(request);
    }

    // Order Confirmation
    public getOrderConfirmation(order: TradestationOrder, osoOrders: TradestationOrder[]): Observable<TradestationOrderConfirmationResponse[]> {
        let account = this.tradestationAccountsService.getAccounts().find(account => account.name == order.accountId);
        return this.tradestationLoaderService.getOrderConfirmation(order, osoOrders , account.key).pipe(
            map((response: TradestationOrderConfirmationResponse[]) => {return response}));
    }

    // Post Order
    public postOrder(order: TradestationOrder, osoOrders: TradestationOrder[]): Observable<TradestationPostOrderResponse[]> {
        let account = this.tradestationAccountsService.getAccounts().find(account => account.name == order.accountId);
        return this.tradestationLoaderService.postOrder(order, osoOrders , account.key).pipe(
            map((response: TradestationPostOrderResponse[]) => {return response;}));
    }

    // Update Order
    public updateOrder(order: TradestationOrder): Observable<TradestationPostOrderResponse> {
        return this.tradestationLoaderService.updateOrder(order).pipe(
            map((response: TradestationPostOrderResponse) => {return response;}));
    }

    public deleteOrder(order: TradestationOrder): Observable<TradestationPostOrderResponse> {
        TcTracker.trackTradestationDeleteOrder();
        return this.tradestationLoaderService.deleteOrder(order.id).pipe(
            map((response: TradestationPostOrderResponse) => {return response}));
    }

    public deleteOrderFromChart(order: TradestationOrder): void {
        let message: string = this.languageService.translate('تم إلغاء الأوامر بنجاح');
        this.deleteOrder(order)
            .subscribe(response => {
                    this.tradestationService.loadTradestationData();
                    this.showMessageBox(message , false);
            });
    }

    public updateOrdersSequentially(orders: TradestationOrder[]): Observable<Object> {
        //Based on https://stackoverflow.com/questions/60530814/dynamic-amount-of-sequential-http-requests-in-angular => Sequential http request
        const  observables = orders.map(order => this.tradestationLoaderService.updateOrder(order));
        return concat(
            ...observables
        ).pipe(
            map((response: TradestationPostOrderResponse) => {
                return this.handleSequentialResponse(response);
            }),
            catchError((error: HttpErrorResponse) => {
                Tc.error('Tradestation Update Order Failed');
                return of(error);
            }),
            toArray()
        )
    }

    public deleteOrdersSequentially(orders: TradestationOrder[]): Observable<Object> {
        //Based on https://stackoverflow.com/questions/60530814/dynamic-amount-of-sequential-http-requests-in-angular => Sequential http request
        const  observables = orders.map(order => this.tradestationLoaderService.deleteOrder(order.id));
        return concat(
            ...observables
        ).pipe(
            map((response: TradestationPostOrderResponse) => {
                return this.handleSequentialResponse(response);
            }),
            catchError((error: HttpErrorResponse) => {
                Tc.error('Tradestation Delete Order Failed');
                return of(error);
            }),
            toArray()
        );
    }

    private handleSequentialResponse(response:TradestationPostOrderResponse):TradestationPostOrderResponse {
        if (response.OrderStatus == 'Failed') {
            let tradestationMessageChannelRequest: TradestationMessageChannelRequest = {
                type: ChannelRequestType.TradestationMessage,
                messageLines: [response.Message],
                isErrorMessage: true,
                showWarningMessage: true
            };
            this.sharedChannel.request(tradestationMessageChannelRequest);
        }
        return response;
    }

}
