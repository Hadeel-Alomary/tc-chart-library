import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {VirtualTradingPosition} from './virtual-trading-models';
import {Quotes, QuoteService} from '../../data/quote';
import {VirtualTradingLoader} from '../../loader/trading/virtual-trading';
import {VirtualTradingService} from './virtual-trading.service';
import {Observable} from 'rxjs/internal/Observable';
import {tap} from 'rxjs/operators';
import {SharedChannel} from '../../shared-channel';
import {Subject} from 'rxjs/internal/Subject';


@Injectable()
export class VirtualTradingPositionsService {

    private positionsStream: BehaviorSubject<VirtualTradingPosition[]>;
    private positionsLoadedStream: Subject<void>;
    private positions: VirtualTradingPosition[] = [];
    private quotes: Quotes;


    constructor(
        private quoteService: QuoteService,
        private sharedChannel: SharedChannel,
        private virtualTradingService: VirtualTradingService,
        private virtualTradingLoaderService: VirtualTradingLoader) {

        this.positionsStream = new BehaviorSubject(null);
        this.positionsLoadedStream = new Subject();

        this.quoteService.getSnapshotStream()
            .subscribe(quotes => this.onQuotes(quotes));

        this.quoteService.getUpdateStream()
            .subscribe(symbol => this.onQuoteUpdate(symbol));

        this.virtualTradingService.getAccountStream().subscribe(account => {
            if (account != null) {
                this.loadPositions();
            } else {
                this.clearPositions();
            }
        });
    }

    public getPositionsStream(): BehaviorSubject<VirtualTradingPosition[]> {
        return this.positionsStream;
    }

    public getPositionsLoadedStream(): Subject<void> {
        return this.positionsLoadedStream;
    }

    private clearPositions(): void {
        this.positionsStream.next([]);
        this.unsubscribePositions();
        this.positions = [];
    }

    private loadPositions(): void {
        this.virtualTradingLoaderService.getPositions(this.virtualTradingService.getAccount().id)
            .subscribe(
                positions => {
                    this.positions = positions;
                    this.updatePositions();
                    this.subscribePositions();
                    this.positionsStream.next(positions);
                    this.positionsLoadedStream.next();
                },
                error => {}
            )
    }

    private subscribePositions(): void {
        if (!this.quotes) { return; }

        let positionSymbols : string[] = [];
        for (let position of this.positions) {
            positionSymbols.push(position.symbol);
        }

        this.quoteService.subscribeQuotes(positionSymbols);
    }

    private unsubscribePositions(): void {
        if (!this.quotes) { return; }

        let positionSymbols:string[] = [];
        for (let position of this.positions) {
            positionSymbols.push(position.symbol);
        }
        this.quoteService.unSubscribeQuotes(positionSymbols);
    }

    private updatePositions(): void {
        if (!this.quotes) {
            return;
        }

        for (let position of this.positions) {
            this.updatePosition(position);
        }
    }

    private onQuotes(quotes: Quotes): void {
        if (!quotes) {
            return;
        }
        this.quotes = quotes;

        if (!this.isPositionsLoaded()) {
            return;
        }

        this.updatePositions();
        this.positionsStream.next(this.positions);
    }

    private onQuoteUpdate(symbol: string): void {

        if (!this.isPositionsLoaded()) {
            return;
        }

        if (this.quotes.data[symbol].changeSet.indexOf('last') == -1) {
            return;
        }

        let index = this.positions.findIndex(position => position.symbol == symbol);
        let needUpdatePositions: boolean = index !== -1;
        if (needUpdatePositions) {
            this.updatePosition(this.positions[index]);
            this.positionsStream.next(this.positions);
        }
    }

    private isPositionsLoaded(): boolean {
        return this.positions != null && this.positions.length != 0;
    }

    private updatePosition(position: VirtualTradingPosition): void {
        position.currentPrice = this.quotes.data[position.symbol].last;
        position.currentTotalCost = position.currentPrice * position.quantity;
        position.costDiff = position.totalCost - position.currentTotalCost;
    }

    public getCompanyFreeQuantity(symbol: string): number{
        if(!this.positions){
            return 0;
        }

        let companyPosition: VirtualTradingPosition = this.positions.find(item => item.symbol == symbol);
        return companyPosition ? companyPosition.freeQuantity : 0;
    }

    public getCompanyTotalQuantity(symbol: string): number{
        if(!this.positions){
            return 0;
        }

        let companyPosition: VirtualTradingPosition = this.positions.find(item => item.symbol == symbol);
        return companyPosition ? companyPosition.quantity : 0;
    }

}
