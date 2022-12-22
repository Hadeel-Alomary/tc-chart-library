import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {
    DerayahOrder,
    DerayahOrderStatusGroupType,
    DerayahPortfolio
} from './derayah-order/index';

import {
    DerayahOrderDetails
} from './derayah-order-details/index';

import {
    DerayahLoaderService,
    Company
} from '../../loader/index';

import {
    DerayahUtils,
    Tc
} from '../../../utils/index';

import {
    DerayahService,
    DerayahResponse
} from './derayah.service';

import {
    DerayahPositionsService
} from './derayah-positions.service';


import {map} from 'rxjs/operators';
import {
    DerayahHttpResponse, DerayahOrderResponse,
    DerayahPreConfirmResponse,
    DerayahQuantityCalculationResponse
} from '../../loader/trading/derayah-loader/derayah-loader.service';
import {Subscription} from 'rxjs/internal/Subscription';

@Injectable()
export class DerayahOrdersService {

    private portfolios:DerayahPortfolio[] = [];

    private orders:{[portfolio:string]:DerayahOrder[]} = {};

    private ordersStream:BehaviorSubject<{[portfolio:string]:DerayahOrder[]}>;

    constructor(private derayahLoaderService:DerayahLoaderService,
                private derayahService:DerayahService, private derayahPositionsService:DerayahPositionsService){
        this.ordersStream = new BehaviorSubject(null);

        this.derayahService.getDerayahStreamer().getDerayahOrderStream()
            .subscribe(() => {
                this.refreshOrders();
            });

        this.derayahService.getPortfoliosStream()
            .subscribe(portfolios => {
                if(portfolios){
                    this.portfolios = portfolios;
                    this.refreshOrders();
                } else {
                    this.orders = {}; // reset portfolios, so reset orders as well
                    this.ordersStream.next(this.orders);
                }
            });
    }

    public refreshOrders(): Subscription {

        let progressSubject = new Subject();

        let orders: { [portfolio: string]: DerayahOrder[] } = {};
        for (let portfolio of this.portfolios) {
            this.loadOrders(portfolio.portfolioNumber, DerayahOrderStatusGroupType.All)
                .subscribe(
                    response => {
                        orders[portfolio.portfolioNumber] = <DerayahOrder[]>response.result;
                        // MA when all orders are fetched (by next check), then send them to the stream
                        if (Object.keys(orders).length == this.portfolios.length) {
                            progressSubject.complete();
                            this.orders = orders;
                            this.ordersStream.next(orders);
                        }
                    },
                    error => {}
                )
        }

        return progressSubject.asObservable().subscribe();

    }

    /* http methods */

    private loadOrders(portfolio:string, orderStatusGroup:number):Observable<DerayahResponse>{
        return this.derayahLoaderService.getOrders(portfolio, orderStatusGroup).pipe(
            map((response: DerayahHttpResponse) => this.derayahService.onResponse(response)),
            map((response: DerayahHttpResponse) => this.mapOrders(response, portfolio)));
    }

    public getOrderDetails(order:DerayahOrder):Observable<DerayahResponse>{
        return this.derayahLoaderService.getOrderDetails(order).pipe(
            map((response: DerayahHttpResponse) => this.derayahService.onResponse(response)),
            map((response: DerayahHttpResponse) => this.mapOrderDetails(order, response)));
    }

    public preConfirmOrder(order:DerayahOrder):Observable<DerayahResponse> {
        return order.id == null
            ? this.addPreConfirm(order)
            : this.updatePreConfirm(order);
    }

    public confirmOrder(order:DerayahOrder):Observable<DerayahResponse>{
        return order.id == null
            ? this.addOrder(order)
            : this.updateOrder(order);
    }

    public deleteOrder(order: DerayahOrder): Observable<DerayahResponse> {
        return this.derayahLoaderService.deleteOrder(order).pipe(
            map((response: DerayahHttpResponse) => {
                return {result: this.derayahService.onResponse(response)};
            }));
    }

    public revertOrder(order: DerayahOrder, actionFlag: string): Observable<DerayahResponse> {
        return this.derayahLoaderService.revertUpdate(order, actionFlag).pipe(
            map((response: DerayahHttpResponse) => {
                return {result: this.derayahService.onResponse(response)};
            }));
    }

    public calculateOrderQuantity(order:DerayahOrder, power:number):Observable<DerayahResponse>{
        return this.derayahLoaderService.calculateOrderQuantity(order, power).pipe(
            map((response: DerayahHttpResponse) => this.derayahService.onResponse(response)),
            map((response: DerayahHttpResponse) => this.mapCalculatedQuantity(response)));
    }

    private addPreConfirm(order:DerayahOrder):Observable<DerayahResponse>{
        return this.derayahLoaderService.addPreConfirm(order).pipe(
            map((response: DerayahHttpResponse) => this.derayahService.onResponse(response)),
            map((response: DerayahHttpResponse) => this.mapFees(response)));
    }

    private addOrder(order:DerayahOrder):Observable<DerayahResponse>{
        return this.derayahLoaderService.addOrder(order).pipe(
            map((response: DerayahHttpResponse) =>{
                return {result: this.derayahService.onResponse(response)};
            }));
    }

    private updatePreConfirm(order:DerayahOrder):Observable<DerayahResponse>{
        return this.derayahLoaderService.updatePreConfirm(order).pipe(
            map((response: DerayahHttpResponse) => this.derayahService.onResponse(response)),
            map((response: DerayahHttpResponse) => this.mapFees(response)));
    }

    private updateOrder(order:DerayahOrder):Observable<DerayahResponse> {
        return this.derayahLoaderService.updateOrder(order).pipe(
            map((response: DerayahHttpResponse) => {
                return {result: this.derayahService.onResponse(response)};
            }));
    }

    /* map methods */

    private mapOrders(response:DerayahHttpResponse, portfolio:string):DerayahResponse{
        let derayahOrders:DerayahOrder[] = [];
        let data = response.data as DerayahOrderResponse;
        let orders = data.orders;
        if(orders && orders.length > 0) {
            for (let item of orders) {
                let symbol:string = DerayahUtils.getSymbolWithMarketFromDerayah(item.exchangeCode, item.symbol);
                // let company:Company = this.marketsManager.getCompanyBySymbol(symbol);
              let company = null;
                // if (company) {
                //     derayahOrders.push(DerayahOrder.mapResponseToDerayahOrder(item, company.name, company.symbol, portfolio));
                // }
            }
        }

        return {result: derayahOrders};
    }

    private mapOrderDetails(order:DerayahOrder, response:DerayahHttpResponse):DerayahResponse{
        return {result: DerayahOrderDetails.mapResponseToOrderDetails(response, order)};
    }

    private mapFees(response:DerayahHttpResponse):DerayahResponse{
        let preConfirmResponse = response.data as DerayahPreConfirmResponse;
        return {
            result: {
                fees: +preConfirmResponse.fees,
                totalValue: +preConfirmResponse.total,
                warningMessage: preConfirmResponse.warningMessage,
                vat: +preConfirmResponse.vatamountequ,
                vatId: preConfirmResponse.vatidno
            },
        };
    }
    private mapCalculatedQuantity(response:DerayahHttpResponse):DerayahResponse{
        let result = response.data as DerayahQuantityCalculationResponse;
        return {
            result: {
                EstimatedAmtinInstrumentCcy: +result.estimatedAmtinInstrumentCcy,
                EstimatedFeeInInstrumentCcy: +result.estimatedFeeInInstrumentCcy,
                EstimatedOrderQty: +result.estimatedOrderQty
            }
        };
    }

    /* streams */

    public getOrdersStream():BehaviorSubject<{[portfolio:string]:DerayahOrder[]}>{
        return this.ordersStream;
    }

    public getOrders():DerayahOrder[] {
        let portfolios = Object.keys(this.orders);

        if(portfolios.length == 1) {
            return this.orders[portfolios[0]];
        }

        let orders:DerayahOrder[] = [];
        portfolios.forEach(portfolio => {
            orders = orders.concat(this.orders[portfolio]);
        })
        return orders;
    }

}
