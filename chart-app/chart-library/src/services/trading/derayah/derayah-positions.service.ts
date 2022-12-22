import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

import {DerayahPosition} from './derayah-position/derayah-position';

import {DerayahPortfolio} from './derayah-order/index';

import {DerayahResponse, DerayahService} from './derayah.service';

import {Company, DerayahLoaderService} from '../../loader/index';

import {DerayahUtils, Tc} from '../../../utils/index';

import {Quotes, QuoteService} from '../../quote/index';
import {Subject} from 'rxjs/internal/Subject';
import {DerayahAccountPositionInfoList, DerayahHttpResponse, DerayahPositionResponse} from '../../loader/trading/derayah-loader/derayah-loader.service';

@Injectable()
export class DerayahPositionsService {

    private positionsStream:BehaviorSubject<{[portfolio:string]:DerayahPosition[]}>;
    private positionsLoadedStream:Subject<void>;

    private portfolios:DerayahPortfolio[] = [];

    private positions:{[portfolio:string]:DerayahPosition[]} = {};

    private quotes:Quotes;

    constructor(private derayahService:DerayahService,
                private derayahLoaderService:DerayahLoaderService,
                private quoteService:QuoteService){

        this.positionsStream = new BehaviorSubject(null);
        this.positionsLoadedStream = new Subject();

        this.derayahService.getPortfoliosStream()
            .subscribe(portfolios => {
                if(portfolios){
                    this.portfolios = portfolios;
                    this.refreshPositions();
                } else {
                    this.unsubscribePositions();
                    this.positions = {}; // reset portfolios, so reset positions as well
                    this.positionsStream.next(this.positions);
                }
            });


        this.quoteService.getSnapshotStream()
            .subscribe(quotes => this.onQuotes(quotes));

        this.quoteService.getUpdateStream()
            .subscribe(symbol => this.onQuoteUpdate(symbol));

        this.derayahService.getDerayahStreamer().getDerayahPositionStream()
            .subscribe(() => {
                this.refreshPositions();
            })

    }

    /* streams methods */

    public getPositionsStream():BehaviorSubject<{[portfolio:string]:DerayahPosition[]}>{
        return this.positionsStream;
    }

    public getPositionsLoadedStream():Subject<void>{
        return this.positionsLoadedStream;
    }

    /* data methods */

    public refreshPositions():Subscription{
        let progressSubject = new Subject();
        let positions:{[portfolioNumer:string]:DerayahPosition[]} = {};
        for(let portfolio of this.portfolios){
          this.loadPositions(portfolio.portfolioNumber)
                .subscribe(
                    response => {
                        positions[portfolio.portfolioNumber] = response.result as DerayahPosition[];
                        if((0 < Object.keys(positions).length) && (Object.keys(positions).length == this.portfolios.length)) {
                            progressSubject.complete();
                            this.positions = positions;
                            this.updatePositions();
                            this.subscribePositions();
                            this.positionsStream.next(this.positions);
                            this.positionsLoadedStream.next();
                        }
                    },
                    error => {}
                )
        }
        return progressSubject.asObservable().subscribe();
    }

    private onQuotes(quotes:Quotes){
        if(!quotes){
            return;
        }
        this.quotes = quotes;

        if(!this.isPositionsLoaded()){
            return;
        }

        this.updatePositions();
        this.positionsStream.next(this.positions);
    }

    private onQuoteUpdate(symbol:string){

        if(!this.isPositionsLoaded()){
            return;
        }

        if(this.quotes.data[symbol].changeSet.indexOf('last') == -1){
            //Nk do not update positions unless we got update on last field
            return;
        }

        let needUpdatePositions:boolean = false;
        for(let positions of Object.values(this.positions)){
            let index:number = (<DerayahPosition[]>positions).findIndex(position => position.symbol == symbol);
            if(index != -1){
                needUpdatePositions = true;
                this.updatePosition(positions[index]);
            }
        }

        if(needUpdatePositions) {
            this.positionsStream.next(this.positions);
        }

    }

    private isPositionsLoaded():boolean {
        return this.positions != null;
    }

    private updatePositions(){
        if(!this.quotes){
            return;
        }

        for(let positions of Object.values(this.positions)){
            for(let position of positions){
                this.updatePosition(position);
            }
        }
    }

    private subscribePositions() {
        if(!this.quotes && !this.positions ){
            return;
        }

        let positionSymbols : string[] = [];

        for(let positions of Object.values(this.positions)){
            for(let position of positions){
                positionSymbols.push(position.symbol);
            }
        }
        this.quoteService.subscribeQuotes(positionSymbols);
    }

    private unsubscribePositions() {
        if(!this.quotes && !this.positions){
            return;
        }

        let positionSymbols:string[] = [];
        for(let positions of Object.values(this.positions)){
            for(let position of positions){
                positionSymbols.push(position.symbol);
            }
        }
        this.quoteService.unSubscribeQuotes(positionSymbols);
    }


    private updatePosition(position:DerayahPosition){
        position.currentPrice = this.quotes.data[position.symbol].last;
        position.currentTotalCost = position.currentPrice * position.quantity;
        position.costDiff = position.totalCost - position.currentTotalCost;
        position.perCostDiff = ((position.totalCost - position.currentTotalCost) / position.totalCost) * 100 ;
    }

    /* http methods */

    private loadPositions(portfolio:string):Observable<DerayahResponse> {
        return this.derayahLoaderService.getPositions(portfolio).pipe(
            map((response: DerayahHttpResponse) => this.mapPositions(response, portfolio)));
    }

    /* map methods */

    private mapPositions(response:DerayahHttpResponse, portfolio:string):DerayahResponse{
        let positions:DerayahPosition[] = [];
        let positionsData = response.data as DerayahAccountPositionInfoList;
        let result = positionsData.tradingAccountPositionInfoList as DerayahPositionResponse[];
        if(result && result.length > 0) {
            result.forEach((item:DerayahPositionResponse) => {
                let symbol:string = DerayahUtils.getSymbolWithMarketFromDerayah(item.exchangecode, item.symbol);
                // let company:Company = this.marketsManager.getCompanyBySymbol(symbol);
                // if(company){
                //     positions.push(DerayahPosition.mapResponseToDerayahPosition(item, company.name, symbol, portfolio));
                // }
            });
        }
        return {result:positions};
    }

    /* helpers methods */

    public getCompanyFreeQuantity(portfolioNumber:string, symbol:string):number{
        if(!this.positions || !this.positions[portfolioNumber]){
            return 0;
        }

        let companyPosition:DerayahPosition = this.positions[portfolioNumber].find(item => item.symbol == symbol);
        return companyPosition ? companyPosition.freeQuantity : 0;
    }

    public getPositions():DerayahPosition[] {

        let portfolios = Object.keys(this.positions);

        if(portfolios.length == 1) {
            return this.positions[portfolios[0]];
        }

        let positions:DerayahPosition[] = [];
        portfolios.forEach(portfolio => {
            positions = positions.concat(this.positions[portfolio]);
        })
        return positions;

    }


}
