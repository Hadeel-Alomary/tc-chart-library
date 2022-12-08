import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {SnbcapitalOrder, SnbcapitalOrderExecutionType, SnbcapitalOrderExpirationType, SnbcapitalOrderType, SnbcapitalPortfolio} from './snbcapital-order/index';

import {
    SnbcapitalOrderDetails
} from './snbcapital-order-details/index';

import {
    MarketsManager
} from '../../loader/index';

import {
    MarketUtils,
    Tc
} from '../../../utils/index';

import {
    SnbcapitalService
} from './snbcapital.service';

import {
    SnbcapitalPositionsService
} from './snbcapital-positions.service';


import {map} from 'rxjs/operators';
import {SnbcapitalLoaderService, SnbcapitalOrderDetailsResponse, SnbcapitalOrderListResponse, SnbcapitalOrderResponse, SnbcapitalPreConfirmResponse, SnbcapitalQuantityCalculationResponse, SnbcapitalSecurityAccountCodeResponse, SnbcapitalUpdatedOrderResponse, SnbcapitalUpdatePreConfirmOrderResponse} from '../../loader/trading/snbcapital-loader/snbcapital-loader.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {SnbcapitalErrorHttpResponse, SnbcapitalErrorService} from './snbcapital-error.service';
import {OrderSearchStatus} from '../../../components/trading/snbcapital/snbcapital-order-search/snbcapital-order-search.component';

@Injectable()
export class SnbcapitalOrdersService implements OnDestroy{

    private portfolios:SnbcapitalPortfolio[] = [];

    private orders:{[portfolio:string]:SnbcapitalOrder[]} = {};

    private ordersStream:BehaviorSubject<{[portfolio:string]:SnbcapitalOrder[]}>;

    constructor(private snbcapitalLoaderService:SnbcapitalLoaderService, private marketsManager:MarketsManager,
                private snbcapitalService:SnbcapitalService, private snbcapitalPositionsService:SnbcapitalPositionsService , private snbcapitalErrorService:SnbcapitalErrorService){
        this.ordersStream = new BehaviorSubject(null);

        this.snbcapitalService.getPortfoliosStream()
            .subscribe(portfolios => {
                if(portfolios && portfolios.length){
                    this.portfolios = portfolios;
                    this.refreshOrders();
                } else {
                    this.orders = {}; // reset portfolios, so reset orders as well
                    this.ordersStream.next(this.orders);
                }
            });

        this.snbcapitalService.getSnbcapitalStreamer().getSnbCapitalOrderStream()
            .subscribe(() => {
                this.refreshOrders();
            });
    }

    ngOnDestroy(){
        // do nothing
    }

    public refreshOrders(): Subscription {
        if(!this.snbcapitalService.validSession) {
            this.snbcapitalErrorService.emitSessionExpiredError();
            return null;
        }

        let progressSubject = new Subject();

        let orders: { [portfolio: string]: SnbcapitalOrder[] } = {};

        let gbsCustomerCode = this.snbcapitalService.portfolios[0].gBSCustomerCode;
        this.loadOrders(gbsCustomerCode).subscribe(snbcapitalOrders => {
            for (let portfolio of this.portfolios) {
                orders[portfolio.portfolioId] = snbcapitalOrders.filter(order => order.portfolioId == portfolio.portfolioId);
                if (Object.keys(orders).length == this.portfolios.length) {
                    progressSubject.complete();
                    this.orders = orders;
                    this.ordersStream.next(orders);
                }
            }
            progressSubject.complete();
        }, error => {
                progressSubject.complete();
        });
        return progressSubject.asObservable().subscribe();
    }

    /* http methods */

    private loadOrders(gbsCustomerCode: string):Observable<SnbcapitalOrder[]>{
        return this.snbcapitalLoaderService.getOrders(gbsCustomerCode).pipe(
            map((response: SnbcapitalErrorHttpResponse| SnbcapitalOrderResponse ) => this.snbcapitalService.onResponse(response)),
            map((response: SnbcapitalOrderResponse) => this.mapOrders(response)));
    }

    public getOrderDetails(order:SnbcapitalOrder , portfolio:SnbcapitalPortfolio):Observable<SnbcapitalOrderDetails>{
        return this.snbcapitalLoaderService.getOrderDetails(order,portfolio).pipe(
            map((response: SnbcapitalOrderDetailsResponse | SnbcapitalErrorHttpResponse ) => this.snbcapitalService.onResponse(response)),
            map((response: SnbcapitalOrderDetailsResponse) => this.mapOrderDetails(order,portfolio, response)));
    }

    public getSearchOrders(portfolio: SnbcapitalPortfolio, orderAction: string , startDate: string, endDate: string, orderStatus: OrderSearchStatus, company: string, orderNumber: string, pageNumber: number):Observable<SnbcapitalOrder[]> {
        return this.snbcapitalLoaderService.getSearchOrders(portfolio, orderAction, startDate, endDate, orderStatus, company, orderNumber, pageNumber).pipe(
            map((response: SnbcapitalOrderResponse | SnbcapitalErrorHttpResponse) => this.snbcapitalService.onResponse(response)),
            map((response: SnbcapitalOrderResponse) => this.mapOrders(response)))
    }

    public confirmOrder(order:SnbcapitalOrder, portfolio: SnbcapitalPortfolio, originalOrder: SnbcapitalOrder):Observable<SnbcapitalOrder>{
        return order.id == null
            ? this.addOrder(order, portfolio)
            : this.updateOrder(order, portfolio, originalOrder);
    }
    public deleteOrder(order:SnbcapitalOrder, portfolio: SnbcapitalPortfolio){
        return this.snbcapitalLoaderService.deleteOrder(order, portfolio).pipe(
            map((response: SnbcapitalOrderResponse | SnbcapitalErrorHttpResponse) => this.snbcapitalService.onResponse(response)));
    }

    public calculateOrderQuantity(order:SnbcapitalOrder, portfolio: SnbcapitalPortfolio, isNomuMarket: boolean):Observable<SnbcapitalCalculatorResult>{
        let calculateQuantityBody = this.getPreConfirmOrCalculateQuantityBody(order,isNomuMarket, true);
        return this.snbcapitalLoaderService.calculateOrderQuantity(order,calculateQuantityBody ,portfolio).pipe(
           map((response: SnbcapitalQuantityCalculationResponse | SnbcapitalErrorHttpResponse) => this.snbcapitalService.onResponse(response)),
           map((response: SnbcapitalQuantityCalculationResponse) => this.mapCalculatedQuantity(response)));
    }

    public addPreConfirm(order:SnbcapitalOrder, portfolio: SnbcapitalPortfolio, isNomuMarket: boolean):Observable<SnbcapitalPreConfirmValue>{
        let preConfirmBody = this.getPreConfirmOrCalculateQuantityBody(order,isNomuMarket, false);
        return this.snbcapitalLoaderService.addPreConfirm(order,preConfirmBody ,portfolio).pipe(
            map((response: SnbcapitalPreConfirmResponse | SnbcapitalErrorHttpResponse) => this.snbcapitalService.onResponse(response)),
            map((response: SnbcapitalPreConfirmResponse) => this.mapFees(response)));
    }

    private getPreConfirmOrCalculateQuantityBody(order: SnbcapitalOrder, isNomuMarket: boolean, isCalculateQuantity:boolean) {
        let symbolWithoutMarket = MarketUtils.symbolWithoutMarket(order.symbol);
        let operazione = order.type.type == SnbcapitalOrderType.Buy ? 'acquista' : 'vendi';
        let mercato = isNomuMarket ? "SEM": "SAMA";

        let validityOrParameterQta: string = this.getValidityOrParameterQta(order, isCalculateQuantity)
        let disclosedQta: string = '';
        let minimumQta: string = '';
        let tipoPrezzo: string;


        if(order.discloseQuantity != null && order.discloseQuantity > 0){
            disclosedQta =`disclosedQty=${order.discloseQuantity}&`
        }

        if(order.minimumQuantity != null && order.minimumQuantity > 0){
            minimumQta =`QtaMin=${order.minimumQuantity}&`
        }

        if(order.execution.type == SnbcapitalOrderExecutionType.Limit){
            tipoPrezzo =`TipoPrezzo=2&PrezzoLimite=${order.price}`
        }else{
            tipoPrezzo ='TipoPrezzo=3'
        }

        return `Combo_Security=${symbolWithoutMarket}&Operazione=${operazione}&Mercato=${mercato}&${validityOrParameterQta}&${disclosedQta}${minimumQta}${tipoPrezzo}`
    }

    private getValidityOrParameterQta(order:SnbcapitalOrder, isCalculateQuantity: boolean) {
        let validityOrParameterQta: string = '';

        switch (order.expiration.type) {
            case SnbcapitalOrderExpirationType.Today:
                validityOrParameterQta = "Validita=VSC";
                break;
            case SnbcapitalOrderExpirationType.GoodTillWeek:
                validityOrParameterQta = "Validita=VFS";
                break
            case SnbcapitalOrderExpirationType.GoodTillMonth:
                validityOrParameterQta = "Validita=VFM";
                break;
            case SnbcapitalOrderExpirationType.GoodTillDate:
                let date = order.tillDate.split('-')
                validityOrParameterQta = `Validita=VSD&giorno=${date[2]}&mese=${date[1]}&anno=${date[0]}`;
                break;
            case SnbcapitalOrderExpirationType.AtTheOpening:
                validityOrParameterQta = "Validita=VSA";
                break;
            case SnbcapitalOrderExpirationType.GoodTillCancellation:
                validityOrParameterQta = "Validita=GTC";
                break;
            case SnbcapitalOrderExpirationType.FillAndKill:
                validityOrParameterQta = "ParQta=1";
                break

            case SnbcapitalOrderExpirationType.FillOrKill:
                validityOrParameterQta = "ParQta=6";
                break
            default:
                Tc.error('Unknown type' + order.expiration.type);
        }

        if(isCalculateQuantity){
            if(validityOrParameterQta.indexOf('Validita') != -1){
                validityOrParameterQta+='&ParQta=';
            }else{
                validityOrParameterQta+='&Validita='
            }
        }
        return validityOrParameterQta;
    }

    public addOrder(order:SnbcapitalOrder, portfolio: SnbcapitalPortfolio):Observable<SnbcapitalOrder> {
        return this.snbcapitalLoaderService.addOrder(order, portfolio).pipe(
            map((response: SnbcapitalPreConfirmResponse | SnbcapitalErrorHttpResponse) => this.snbcapitalService.onResponse(response)),
            map(() => order));
    }

    public updatePreConfirm(order:SnbcapitalOrder, portfolio: SnbcapitalPortfolio):Observable<SnbcapitalUpdatePreConfirmOrderResponse>{
        return this.snbcapitalLoaderService.updatePreConfirm(order, portfolio).pipe(
            map((response: SnbcapitalUpdatePreConfirmOrderResponse | SnbcapitalErrorHttpResponse) => this.snbcapitalService.onResponse(response)),
            map((response: SnbcapitalUpdatePreConfirmOrderResponse) => response));
    }

    public updateOrder(order:SnbcapitalOrder, portfolio: SnbcapitalPortfolio, originalOrder: SnbcapitalOrder):Observable<SnbcapitalOrder> {
        let paramPrc: string ='';
        let paramQty: string = '';
        let paramDisclosedQty:string = '';
        let newTimeInForceOrPrmQty: string = '';
        let paramExpiry: string = '';

        let isMarketOrder = order.execution.type == SnbcapitalOrderExecutionType.Market;
        let isLimitOrder = order.execution.type == SnbcapitalOrderExecutionType.Limit;

        if(order.execution.type != originalOrder.execution.type){
            if(isMarketOrder){
                paramPrc = `paramPrc=0&`;
            }else{
                paramPrc = `paramPrc=${order.price}&`;
            }
            paramPrc+="tipoOp=prz&"
        }else if(isLimitOrder && order.price != originalOrder.price) {
            paramPrc = `paramPrc=${order.price}&`;
            paramPrc+="tipoOp=prz&"
        }

        if(order.quantity != originalOrder.quantity){
            paramQty= `paramQty=${order.quantity}&`;
            paramQty+="tipoOp=qty&"
        }

        if (order.discloseQuantity != originalOrder.discloseQuantity) {
            if (order.discloseQuantity == null && originalOrder.discloseQuantity != null && originalOrder.discloseQuantity == 0) {
                // nothing changed
            } else {
                paramDisclosedQty = `paramDisclosedQty=${order.discloseQuantity}&`;
                paramDisclosedQty+= 'tipoOp=disclosedQty&';
            }
        }

        let modifyExpiration = this.getModifyExpiration(order, originalOrder);

        paramExpiry = modifyExpiration.paramExpiry;
        newTimeInForceOrPrmQty = modifyExpiration.newTimeInForceOrPrmQty;

        return this.snbcapitalLoaderService.updateOrder(order, paramPrc, paramQty, paramDisclosedQty, paramExpiry,newTimeInForceOrPrmQty, portfolio).pipe(
            map((response: SnbcapitalUpdatedOrderResponse| SnbcapitalErrorHttpResponse) => this.snbcapitalService.onResponse(response)),
            map((response: SnbcapitalUpdatedOrderResponse) => order));
    }

    private getModifyExpiration(order: SnbcapitalOrder, originalOrder: SnbcapitalOrder) {
        let newTimeInForceOrPrmQty: string = '';
        let paramExpiry: string = '';
        let isGoodTillDate = order.expiration.type == SnbcapitalOrderExpirationType.GoodTillDate;

        if (order.expiration.type != originalOrder.expiration.type) {
            switch (order.expiration.type) {
                case SnbcapitalOrderExpirationType.Today:
                    newTimeInForceOrPrmQty = `newTimeInForce=1&tipoOp=expiry&`;
                    break;
                case SnbcapitalOrderExpirationType.AtTheOpening:
                    newTimeInForceOrPrmQty = `newTimeInForce=4&tipoOp=expiry&`;
                    break;
                case SnbcapitalOrderExpirationType.GoodTillWeek:
                    newTimeInForceOrPrmQty = `newTimeInForce=6&tipoOp=expiry&`;
                    break;
                case SnbcapitalOrderExpirationType.GoodTillMonth:
                    newTimeInForceOrPrmQty = `newTimeInForce=7&tipoOp=expiry&`;
                    break;
                case SnbcapitalOrderExpirationType.GoodTillDate:
                    newTimeInForceOrPrmQty = `newTimeInForce=2&tipoOp=expiry&`;
                    let date = order.tillDate.split('-');
                    paramExpiry =`paramExpiry=${date[2]}${date[1]}${date[0]}&`;
                    break;
                case SnbcapitalOrderExpirationType.GoodTillCancellation:
                    newTimeInForceOrPrmQty = `newTimeInForce=9&tipoOp=expiry&`;
                    break;
                case SnbcapitalOrderExpirationType.FillAndKill:
                    newTimeInForceOrPrmQty = `prmQty=1&tipoOp=prmQty&`;
                    break;
                case SnbcapitalOrderExpirationType.FillOrKill:
                    newTimeInForceOrPrmQty = `prmQty=6&tipoOp=prmQty&`;
                    break;
                default:
                    Tc.error('Unknown expiration type' + order.expiration.type);
            }
        } else if (isGoodTillDate && order.tillDate != originalOrder.tillDate) {
            let date = order.tillDate.split('-');
            paramExpiry =`paramExpiry=${date[0]}${date[1]}${date[2]}&tipoOp=expiry&`;
        }
        return {
            newTimeInForceOrPrmQty: newTimeInForceOrPrmQty,
            paramExpiry: paramExpiry,
        }
    }

    /* map methods */

    private mapOrders(response: SnbcapitalOrderResponse): SnbcapitalOrder[] {
        let snbcapitalOrders: SnbcapitalOrder[] = [];
        let orders: SnbcapitalOrderListResponse[] = response.ordersList;
        for (let item of orders) {
            if (item.strum) {
                let symbol = item.strum.secCode + '.TAD';
                let company = this.marketsManager.getCompanyBySymbol(symbol);
                if (company) {
                    snbcapitalOrders.push(SnbcapitalOrder.mapResponseToSnbcapitalOrder(item, company.name, company.symbol));
                }
            }
        }
        return snbcapitalOrders;
    }

    private mapOrderDetails(order:SnbcapitalOrder,  portfolio:SnbcapitalPortfolio ,response:SnbcapitalOrderDetailsResponse):SnbcapitalOrderDetails{
        return SnbcapitalOrderDetails.mapResponseToOrderDetails(response, order , portfolio);
    }

    private mapFees(response: SnbcapitalPreConfirmResponse): SnbcapitalPreConfirmValue {
        let warningMessages: string[] = [];
        if (response.propOutOrd.adeguatezza != null && response.propOutOrd.adeguatezza.warnMsgs != null) {
            warningMessages = response.propOutOrd.adeguatezza.warnMsgs;
        }
        return {
            referrer: response.referrer,
            estimatedTotalAmount: response.propOutOrd.estAmt,
            fees: response.propOutOrd.fees,
            commission: response.propOutOrd.commission,
            vat: response.propOutOrd.VATamt,
            warningMessages: warningMessages
        };
    }

    private mapCalculatedQuantity(response:SnbcapitalQuantityCalculationResponse):SnbcapitalCalculatorResult{
        return {orderQty: response.propOutOrd.orderQty}
    }

    /* streams */

    public getOrdersStream():BehaviorSubject<{[portfolio:string]:SnbcapitalOrder[]}>{
        return this.ordersStream;
    }

    public getOrders():SnbcapitalOrder[] {
        let portfolios = Object.keys(this.orders);

        if(portfolios.length == 1) {
            return this.orders[portfolios[0]];
        }

        let orders:SnbcapitalOrder[] = [];
        portfolios.forEach(portfolio => {
            orders = orders.concat(this.orders[portfolio]);
        })
        return orders;
    }

}
export interface SnbcapitalCalculatorResult {
    orderQty:number
}

export interface SnbcapitalPreConfirmValue {
    referrer: string,
    estimatedTotalAmount: number,
    fees: number,
    vat: number,
    commission: number,
    warningMessages: string[]
}
