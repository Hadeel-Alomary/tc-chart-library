import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

import {SnbcapitalPosition} from './snbcapital-position/snbcapital-position';

import {SnbcapitalPortfolio} from './snbcapital-order/index';

import {SnbcapitalService} from './snbcapital.service';

import {Company, SnbcapitalPositionResponse} from '../../loader/index';

import {Quotes, QuoteService} from '../../quote/index';
import {Subject} from 'rxjs/internal/Subject';
import {SnbcapitalErrorHttpResponse, SnbcapitalErrorService} from './snbcapital-error.service';
import {SnbcapitalLoaderService} from '../../loader/trading/snbcapital-loader/snbcapital-loader.service';

@Injectable()
export class SnbcapitalPositionsService implements OnDestroy{
    private positionsStream:BehaviorSubject<{[portfolio:string]:SnbcapitalPosition[]}>;
    private positionsLoadedStream:Subject<void>;

    private portfolios:SnbcapitalPortfolio[] = [];

    private positions:{[portfolio:string]:SnbcapitalPosition[]} = {};

    private quotes:Quotes;

    constructor(private snbcapitalService:SnbcapitalService,
                private snbcapitalLoaderService:SnbcapitalLoaderService,
                private quoteService:QuoteService,
                private snbcapitalErrorService:SnbcapitalErrorService){

        this.positionsStream = new BehaviorSubject(null);
        this.positionsLoadedStream = new Subject();

        this.snbcapitalService.getPortfoliosStream()
            .subscribe(portfolios => {
                if(portfolios && portfolios.length){
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

        this.snbcapitalService.getSnbcapitalStreamer().getSnbCapitalPositionStream()
            .subscribe((portfolioId: string) => {
                this.refreshPositions(portfolioId);
            })
    }

    ngOnDestroy(){
        this.unsubscribePositions();
    }

    /* streams methods */

    public getPositionsStream():BehaviorSubject<{[portfolio:string]:SnbcapitalPosition[]}>{
        return this.positionsStream;
    }

    public getPositionsLoadedStream():Subject<void>{
        return this.positionsLoadedStream;
    }

    /* data methods */

    public refreshPositions(portfolioId?:string):Subscription{
        if(!this.snbcapitalService.validSession) {
            this.snbcapitalErrorService.emitSessionExpiredError();
            return null;
        }
        let progressSubject = new Subject();
        let portfolios = portfolioId ? [this.portfolios.find(portfolio => portfolio.portfolioId == portfolioId)]: this.portfolios;
        let positions:{[portfolioNumer:string]:SnbcapitalPosition[]} = {};
        for(let portfolio of portfolios){
          this.loadPositions(portfolio)
                .subscribe(
                    response => {
                        positions[portfolio.portfolioId] = response;
                        if((0 < Object.keys(positions).length) && (Object.keys(positions).length == portfolios.length)) {
                            this.positions = positions;
                            this.updatePositions();
                            this.subscribePositions();
                            this.positionsStream.next(this.positions);
                            this.positionsLoadedStream.next();
                        }
                        progressSubject.complete();
                    },
                    error => {
                            progressSubject.complete();
                    }
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
            let index:number = (<SnbcapitalPosition[]>positions).findIndex(position => position.symbol == symbol);
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


    private updatePosition(position:SnbcapitalPosition){
        position.currentPrice = this.quotes.data[position.symbol].last;
        position.currentTotalCost = position.currentPrice * position.quantity;
        position.costDiff = position.totalCost - position.currentTotalCost;
        position.costDiffPercent =  ((position.totalCost - position.currentTotalCost) / position.totalCost) * 100 ;
    }

    /* http methods */

    private loadPositions(portfolio:SnbcapitalPortfolio):Observable<SnbcapitalPosition[]>{
        return this.snbcapitalLoaderService.getPositions(portfolio).pipe(
            map((response: SnbcapitalErrorHttpResponse|SnbcapitalPositionResponse) => this.snbcapitalService.onResponse(response)),
            map((response: SnbcapitalPositionResponse) => this.mapPositions(response)));
    }

    /* map methods */

    private mapPositions(response:SnbcapitalPositionResponse):SnbcapitalPosition[]{
        let positions:SnbcapitalPosition[] = [];
        for(let holding of response.holdings){
            for(let positionResponse of holding.positions){
                let symbol: string = positionResponse.strum.secCode + '.TAD';
                // let company:Company = this.marketsManager.getCompanyBySymbol(symbol);
                // if(company){
                //     positions.push(SnbcapitalPosition.mapResponseToSnbcapitalPosition(positionResponse, company.name ,company.symbol));
                // }
            }
        }
        return positions;
    }

    /* helpers methods */

    public getCompanyBlockedQuantity(portfolioNumber:string, symbol:string):number{
        if(!this.positions || !this.positions[portfolioNumber]){
            return 0;
        }

        let companyPosition:SnbcapitalPosition = this.positions[portfolioNumber].find(item => item.symbol == symbol);
        return companyPosition ? companyPosition.blockedQuantity : 0;
    }

    public getCompanyFreeQuantity(portfolioNumber:string, symbol:string):number{
        if(!this.positions || !this.positions[portfolioNumber]){
            return 0;
        }

        let companyPosition:SnbcapitalPosition = this.positions[portfolioNumber].find(item => item.symbol == symbol);
        return companyPosition ? companyPosition.freeQuantity : 0;
    }

    public getPositions():SnbcapitalPosition[] {

        let portfolios = Object.keys(this.positions);

        if(portfolios.length == 1) {
            return this.positions[portfolios[0]];
        }

        let positions:SnbcapitalPosition[] = [];
        portfolios.forEach(portfolio => {
            positions = positions.concat(this.positions[portfolio]);
        })
        return positions;
    }
}
