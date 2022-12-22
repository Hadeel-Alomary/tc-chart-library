import {Injectable} from '@angular/core';
import {LiquidityPoint} from './liquidity-point';
import {Subject} from 'rxjs';
import {LiquidityPointsGrouper} from './liquidity-points-grouper';
import {Interval, LiquidityLoaderService} from '../loader';
import {LiquidityHistoryLoadingState} from './liquidity.service';
import {LiquidityIntervalUtils} from './liquidity-interval-utils';
import {MarketUtils, Tc} from '../../utils';

@Injectable()
export class ElementLiquidityService {

    private symbolLiquidityPoints: LiquidityPoint[] = [];
    private symbolLiquidityUpdateStream: Subject<{symbol:string, interval:Interval}>;
    private liquidityPointsGrouper:LiquidityPointsGrouper;

    constructor(private liquidityLoaderService:LiquidityLoaderService) {
        this.symbolLiquidityUpdateStream = new Subject();
        this.liquidityPointsGrouper = new LiquidityPointsGrouper();
    }

    public getSymbolHistoryLoadState(symbol: string, interval: Interval):LiquidityHistoryLoadingState {
        return LiquidityHistoryLoadingState.NOT_LOADED;
    }

    public requestToLoadSymbolHistory(url:string, symbol: string, interval: Interval): void {

        // if base interval data exists group base interval data.
        // ex: base interval for 10min is 5min
        let baseInterval: Interval = LiquidityIntervalUtils.getBaseInterval(interval);
        let baseIntervalString = LiquidityIntervalUtils.toIntervalString(baseInterval);
        let market = MarketUtils.marketAbbr(symbol);
        let threeYearsAgo:string = moment().subtract(3, 'years').format('YYYY-MM-DD');

        this.liquidityLoaderService.loadSymbolHistory(url, symbol, market, baseIntervalString, threeYearsAgo).subscribe(
            (liquidityPoints: LiquidityPoint[]) => {
                this.symbolLiquidityPoints = liquidityPoints;

                // MA notify all listener that data is available
                this.symbolLiquidityUpdateStream.next({symbol: symbol, interval:interval});
            });
    }

    public getSymbolLiquidityPoints(symbol: string, interval: Interval): LiquidityPoint[] {
        if(this.liquidityPointsGrouper.needGrouping(interval)) {
            let market = MarketUtils.marketAbbr(symbol);
            return this.liquidityPointsGrouper.groupLiquidityPoints(market, symbol, this.symbolLiquidityPoints, interval);
        }

        return this.symbolLiquidityPoints;
    }

    public getSymbolLiquidityUpdateStream(): Subject<{symbol:string, interval:Interval}> {
        return this.symbolLiquidityUpdateStream;
    }
}
