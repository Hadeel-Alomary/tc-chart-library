import {Injectable} from '@angular/core';
import {Interval} from '../../loader/price-loader/interval';
import {LiquidityLoaderService} from '../../loader/liquidity-loader/liquidity-loader.service';
import {LiquidityPoint} from './liquidity-point';
import {IntervalType, Loader, LoaderConfig, LoaderUrlType, MarketsManager} from '../../loader';
import {LiquidityPointsGrouper} from './liquidity-points-grouper';
import {Streamer} from '../../streaming/streamer';
import {LiquidityMessage} from '../../streaming/shared/message';
import {LiquidityIntervalUtils} from './liquidity-interval-utils';
import {bufferTime} from 'rxjs/operators';
import {Subject} from 'rxjs/internal/Subject';
import {Tc} from '../../../utils';
import {AuthorizationService} from '../../auhtorization';

const uniqBy = require("lodash/uniqBy");

@Injectable()
export class LiquidityService {

    private symbolLiquidityPoints: {[key: string]: LiquidityPoint[]} = {};
    private symbolCachedLiquidityPoints: {[key: string]: LiquidityPoint[]} = {};
    private symbolLiquidityUpdateStream: Subject<{symbol:string, interval:Interval}>;
    private liquidityPointsGrouper:LiquidityPointsGrouper;

    constructor(private liquidityLoaderService: LiquidityLoaderService, private marketsManager: MarketsManager, private loader:Loader, private streamer: Streamer, private authorizationService: AuthorizationService){
        this.symbolLiquidityUpdateStream = new Subject();
        this.liquidityPointsGrouper = new LiquidityPointsGrouper();
        // MA do buffering to avoid over-updating by liquidity updates

        this.loader.isLoadingDoneStream().subscribe(loadingDone => {
            if(loadingDone) {
                this.streamer.getTechnicalReportsStreamer().getLiquidityStreamer().pipe(bufferTime(750)).subscribe(
                    (messages: LiquidityMessage[]) => {
                        if (!this.authorizationService.isPremiumSubscriber()) {
                            //Must be premium subscriber to get liquidity values.
                            //If user has a premium subscriber then his subscription is ended : avoid him to take liquidity on chart.
                            return;
                        }
                        if(0 < messages.length) {
                            this.processStreamerMessages(messages);
                        }
                    }
                );
            }
        });
    }

    private processStreamerMessages(messages: LiquidityMessage[]) {
        let updateStreamValues: { symbol: string, interval: Interval }[] = [];
        messages.forEach(message => {
            let key = `${message.symbol}.${message.interval}`;
            if (key in this.symbolLiquidityPoints) {
                let liquidityPoint = LiquidityPoint.fromLiquidityMessage(message);
                if (this.isWaitingForHistoryToLoad(key)) {
                    // MA if we are waiting for liquidity history to be loaded, then cache the point (so we apply it once loading is completed)
                    this.symbolCachedLiquidityPoints[key].push(liquidityPoint);
                } else {
                    this.processLiquidityUpdate(message.symbol, message.interval, liquidityPoint);
                    updateStreamValues.push({symbol: message.symbol, interval: LiquidityIntervalUtils.fromIntervalString(message.interval)});
                }
            }
        });
        // notify subscribes "just once" for any updates symbols
        uniqBy(updateStreamValues, (m: {symbol: string, interval: Interval}) => {return m.symbol + "-" + m.interval}).forEach((updateStreamValue: {symbol:string, interval:Interval}) => {
            this.symbolLiquidityUpdateStream.next(updateStreamValue);
        });
    }

    private isWaitingForHistoryToLoad(key: string) {
        return this.symbolLiquidityPoints[key].length == 0;
    }

    public getSymbolHistoryLoadState(symbol: string, interval: Interval):LiquidityHistoryLoadingState {
        let baseInterval: Interval = LiquidityIntervalUtils.getBaseInterval(interval);
        let baseIntervalString = LiquidityIntervalUtils.toIntervalString(baseInterval);
        let baseKey = `${symbol}.${baseIntervalString}`;
        if(!(baseKey in this.symbolLiquidityPoints)) {
            return LiquidityHistoryLoadingState.NOT_LOADED;
        } else if(this.isWaitingForHistoryToLoad(baseKey)) {
            return LiquidityHistoryLoadingState.REQUESTED;
        } else {
            return LiquidityHistoryLoadingState.LOADED;
        }
    }

    public requestToLoadSymbolHistory(symbol: string, interval: Interval): void {
        if (!this.authorizationService.isPremiumSubscriber()) {
            //Must be premium subscriber to get liquidity values.
            //If user has a premium subscriber then his subscription is ended : avoid him to take liquidity on chart.
            return;
        }

        Tc.assert(this.getSymbolHistoryLoadState(symbol, interval) == LiquidityHistoryLoadingState.NOT_LOADED,
            "request to load history while it is already loading/loaded");

        // if base interval data exists group base interval data.
        // ex: base interval for 10min is 5min
        let baseInterval: Interval = LiquidityIntervalUtils.getBaseInterval(interval);
        let baseIntervalString = LiquidityIntervalUtils.toIntervalString(baseInterval);
        let baseKey = `${symbol}.${baseIntervalString}`;
        let market = this.marketsManager.getMarketBySymbol(symbol).abbreviation;

        // if no data for interval nor base interval, then get base interval history and subscribe for updates
        this.prepareCaching(baseKey);
        this.streamer.getTechnicalReportsStreamer().subscribeLiquidity(baseIntervalString, market);

        let threeYearsAgo:string = moment().subtract(3, 'years').format('YYYY-MM-DD');
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.HistoricalLiquidity);
        this.liquidityLoaderService.loadSymbolHistory(url, symbol, market, baseIntervalString, threeYearsAgo).subscribe(
            (liquidityPoints: LiquidityPoint[]) => {
                this.symbolLiquidityPoints[baseKey] = liquidityPoints;
                // MA apply cached points after loading is completed
                this.processCachedLiquidityPoints(symbol, baseIntervalString);
                // MA notify all listener that data is available
                this.symbolLiquidityUpdateStream.next({symbol: symbol, interval:interval});
            });

    }

    public getSymbolLiquidityPoints(symbol: string, interval: Interval): LiquidityPoint[] {
        let intervalString = LiquidityIntervalUtils.toIntervalString(interval);
        let key = `${symbol}.${intervalString}`;

        if(key in this.symbolCachedLiquidityPoints) {
            return this.symbolLiquidityPoints[key];
        }
        let baseInterval: Interval = LiquidityIntervalUtils.getBaseInterval(interval);
        let baseIntervalString = LiquidityIntervalUtils.toIntervalString(baseInterval);
        let baseKey = `${symbol}.${baseIntervalString}`;
        let market = this.marketsManager.getMarketBySymbol(symbol).abbreviation;
        if(this.liquidityPointsGrouper.needGrouping(interval) && (baseKey in this.symbolLiquidityPoints)) {
            return this.liquidityPointsGrouper.groupLiquidityPoints(market,symbol, this.symbolLiquidityPoints[baseKey], interval);
        }
        return [];

    }

    public getSymbolLiquidityUpdateStream(): Subject<{symbol:string, interval:Interval}> {
        return this.symbolLiquidityUpdateStream;
    }

    private prepareCaching(key: string) {
        this.symbolLiquidityPoints[key] = [];
        this.symbolCachedLiquidityPoints[key] = [];
    }

    private processCachedLiquidityPoints(symbol: string, intervalString: string) {
        let key = `${symbol}.${intervalString}`;
        for(let point of this.symbolCachedLiquidityPoints[key]) {
            this.processLiquidityUpdate(symbol, intervalString, point);
        }
        this.symbolCachedLiquidityPoints[key] = [];
    }

    private processLiquidityUpdate(symbol: string, intervalString: string, liquidityPoint: LiquidityPoint) {
        let key = `${symbol}.${intervalString}`,
            interval = LiquidityIntervalUtils.fromIntervalString(intervalString);
        this.applyRealTimeUpdate(key, liquidityPoint, interval);
    }

    private applyRealTimeUpdate(key:string, newPoint: LiquidityPoint, interval: Interval) {

        Tc.assert(!this.liquidityPointsGrouper.needGrouping(interval), 'Realtime updates for unsupported intervals should not be grouped');

        let liquidityPoints: LiquidityPoint[] = this.symbolLiquidityPoints[key];

        let lastIndex = liquidityPoints.length - 1;
        if(liquidityPoints[lastIndex].time == newPoint.time) {
            liquidityPoints[lastIndex].inflowAmount = newPoint.inflowAmount;
            liquidityPoints[lastIndex].inflowVolume = newPoint.inflowVolume;
            liquidityPoints[lastIndex].outflowAmount = newPoint.outflowAmount;
            liquidityPoints[lastIndex].outflowVolume = newPoint.outflowVolume;
            liquidityPoints[lastIndex].netAmount = newPoint.netAmount;
            liquidityPoints[lastIndex].netVolume = newPoint.netVolume;
            liquidityPoints[lastIndex].percentage = newPoint.percentage;
        } else {
            liquidityPoints.push(newPoint);
        }

    }

}

export enum LiquidityHistoryLoadingState {
    NOT_LOADED,
    REQUESTED,
    LOADED
}
