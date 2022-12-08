import {Injectable} from '@angular/core';
import {Interval, IntervalType, Period, PriceData, PriceLoader} from '../../loader';
import {Subject} from 'rxjs/internal/Subject';
import {SubscriptionLike as ISubscription} from 'rxjs/internal/types';
import {ArrayUtils, DateUtils, MarketUtils, Tc, TcTracker} from '../../utils';
import {MarketsTickSizeService} from '../markets-tick-size';
import {VolumeProfilerRequest, VolumeProfilerRequestBuilder} from './volume-profiler-request-builder';
import {MarketsManager} from '../../loader/loader/markets-manager';

const isEqual = require('lodash/isEqual');

@Injectable()
export class VolumeProfilerService {

    private requestBuilder:VolumeProfilerRequestBuilder;
    private requests : {[id:string] : VolumeProfilerRequest} = {};
    private requestSubscriptions : {[id:string] : ISubscription} = {};
    private resultStream:Subject<VolumeProfilerResult> = new Subject();

    private readonly PRICE_UNIT:number  = 0.00001;

    constructor(private priceLoader:PriceLoader,
                private marketsTickSizeService:MarketsTickSizeService,
                private marketsManager:MarketsManager){

        this.requestBuilder = new VolumeProfilerRequestBuilder(this.marketsManager);

    }

    public getResultStream():Subject<VolumeProfilerResult> {
        return this.resultStream;
    }

    /* request volume profile data */

    public getRequestBuilder():VolumeProfilerRequestBuilder {
        return this.requestBuilder;
    }

    public requestVolumeProfilerData(requestParams:VolumeProfilerRequest): void {
        Tc.assert(!this.isRequested(requestParams), "request is already requested");
        Tc.assert(requestParams.from != requestParams.to, "volume profiler from and to should be different");
        this.getVolumeProfileData(requestParams.requestedId, requestParams);
    }

    public isRequested(requestData: VolumeProfilerRequest) {
        if(!this.requests[requestData.requestedId]) {
            return false;
        }
        return isEqual(this.requests[requestData.requestedId], requestData);
    }

    private getVolumeProfileData(requesterId: string, requestData: VolumeProfilerRequest) {
        this.cleanData(requesterId);
        this.processVolumeProfileRequest(requestData);
    }

    public cleanData(requesterId:string){
        if(this.requests[requesterId]) {
            delete this.requests[requesterId];
            if(requesterId in this.requestSubscriptions) {
                this.requestSubscriptions[requesterId].unsubscribe();
                delete this.requestSubscriptions[requesterId];
            }
        }
    }

    private processVolumeProfileRequest(requestData: VolumeProfilerRequest) {
        if(TcTracker.isEnabled()) {
            TcTracker.trackVolumeProfilerRequest();
        }

        Tc.assert(!(requestData.requestedId in this.requests), "request is already made");
        let fromDate = requestData.from.substr(0, 10);
        let market = this.marketsManager.getMarketBySymbol(requestData.symbol);
        let pricesUrl = market.historicalPricesUrl;
        let subscription = this.priceLoader.loadPriceData(pricesUrl, requestData.symbol,
            this.getDataInterval(fromDate),
            Period.getClosestPeriodContainingDate(market.abbreviation, fromDate)).subscribe(value => {
            delete this.requestSubscriptions[requestData.requestedId];
            let from = requestData.from;
            // MA for "to" date, for daily interval, we need to include all candles within that date (so change time to end of date)
            let dailyInterval = Interval.isDaily(requestData.requestedInterval);
            let to = dailyInterval ? DateUtils.toDate(requestData.to) + " 23:59:59" : requestData.to;
            let inRangeCandles: PriceData[] = value.groupedData.filter(c => from <= c.time && c.time <= to);
            this.processPriceDataForRequest(inRangeCandles, requestData);
        });
        this.requests[requestData.requestedId] = requestData;
        this.requestSubscriptions[requestData.requestedId] = subscription;
    }

    private getDataInterval(from:string):Interval{

        let threeMonths:string = moment().subtract(3, 'months').format('YYYY-MM-DD');
        let twoYears:string = moment().subtract(2, 'years').format('YYYY-MM-DD');

        let intervalType = null;

        if(threeMonths <= from) {
            intervalType =  IntervalType.Minute;
        } else if(twoYears <= from) {
            intervalType = IntervalType.FifteenMinutes;
        } else {
            intervalType = IntervalType.Day;
        }

        return Interval.getIntervalByType(intervalType);
    }

    /* compute volume profile result */

    private processPriceDataForRequest(allCandles: PriceData[], requestData: VolumeProfilerRequest) {

        let data:VolumeProfilerData[] = [];

        let candleGroups = requestData.segmentPerSession ? this.getSessionCandles(allCandles) : [allCandles];

        candleGroups.forEach(candles => {
            data.unshift(this.computeVolumeProfile(candles, requestData));
        })

        let volumeProfileResult:VolumeProfilerResult = {
            requesterId: requestData.requestedId,
            data: data
        }

        this.resultStream.next(volumeProfileResult);

    }

    private getSessionCandles(candles:PriceData[]):PriceData[][] {

        let sessionCandles:{[key:string]:PriceData[]} = {};

        candles.forEach(candle => {
            let date = candle.time.substr(0, 10);
            if(!(date in sessionCandles)) {
                sessionCandles[date] = [];
            }
            sessionCandles[date].push(candle);
        })

        return ArrayUtils.values(sessionCandles);
    }

    private computeVolumeProfile(candles: PriceData[], requestData: VolumeProfilerRequest):VolumeProfilerData {

        let volumeProfileDataBars = this.computeVolumeProfileDataBars(candles, requestData);

        let pointOfControl = this.computePointOfControl(volumeProfileDataBars);

        this.computeValueArea(volumeProfileDataBars, pointOfControl, requestData.volumeProfilerSettings.valueAreaVolumeRatio);

        return {
            pointOfControl: pointOfControl,
            bars: volumeProfileDataBars,
            fromDate:candles[candles.length-1].time,
            toDate:candles[0].time
        };

    }

    /* compute volume profile levels */

    private getProfileLevels(candles: PriceData[], requestData: VolumeProfilerRequest):number[] {
        let {minPrice, maxPrice} = this.getMinAndMaxPrices(candles);

        let rowType = requestData.volumeProfilerSettings.rowLayout;
        let rowSize = requestData.volumeProfilerSettings.rowSize;
        let symbol = requestData.symbol;

        let levels:number[] = rowType == VolumeProfilerSettingsRowType.NUMBER_OF_ROWS ?
            this.getProfileLevelsByNumber(minPrice, maxPrice, rowSize) :
            this.getProfileLevelsByTicks(symbol, minPrice, maxPrice, rowSize);

        if(levels.length == 1) {
            levels[1] = levels[0] + 0.01; // if we have "single" price dash candles, then add an upper price level
        }

        return levels;

    }

    private getProfileLevelsByNumber(minPrice: number, maxPrice: number, rowSize: number) {
        // minimum "row separation" is 0.01, irrespective of settings
        rowSize = Math.min(rowSize, Math.round((maxPrice - minPrice) / 0.01));
        let step = (maxPrice - minPrice) / rowSize;
        let result:number[] = [minPrice];
        for(let i = 0; i < rowSize; ++i) {
            let nextValue = result[result.length - 1] + step;
            result.push(nextValue);
        }
        return result.map(value => Math.round(value * 100000)/100000);
    }

    private getProfileLevelsByTicks(symbol:string, minPrice: number, maxPrice: number, rowSize: number) {
        let tick = this.getTickSize(symbol, minPrice);
        let step = tick * rowSize;
        let numberOfLevels = Math.floor((maxPrice - minPrice) / step);
        let result:number[] = [minPrice];
        for(let i = 0; i < numberOfLevels; ++i) {
            let nextValue = result[result.length - 1] + step;
            nextValue = Math.round(nextValue * 100000) / 100000;
            result.push(Math.min(nextValue, maxPrice));
        }
        return result;

    }

    private getTickSize(symbol: string, minPrice: number) {
        let company = this.marketsManager.getCompanyBySymbol(symbol);
        if(company.index) {
            // MA abu5 suggested to use TickSize of 1 for indices, as they have large values and a small tick sizes may cause
            // excessive slowness.
            return 1.00;
        }
        return this.marketsTickSizeService.getTickSize(MarketUtils.marketAbbr(symbol), minPrice);
    }

    private getMinAndMaxPrices(candles: PriceData[]) {
        let minPrice = Number.MAX_VALUE;
        let maxPrice = Number.MIN_VALUE;
        candles.forEach(data => {
            if (maxPrice < data.high) {
                maxPrice = data.high;
            }
            if (data.low < minPrice) {
                minPrice = data.low;
            }
        });
        return {minPrice, maxPrice};
    }

    /* compute volume profile data bars */

    private computeVolumeProfileDataBars(candles: PriceData[], requestData: VolumeProfilerRequest):VolumeProfilerDataBar[] {

        let levels:number[] = this.getProfileLevels(candles, requestData);

        Tc.assert(2 <= levels.length, "invalid levels length");

        let bars:VolumeProfilerDataBar[] = [];

        for(let i = 1; i < levels.length; ++i) {

            let fromPrice = levels[i - 1];
            let toPrice = levels[i];


            let greenVolume = this.computeVolume(candles, fromPrice, toPrice, (data:PriceData) => {return data.close >= data.open});
            let redVolume = this.computeVolume(candles, fromPrice, toPrice, (data:PriceData) => {return data.close < data.open});
            let totalVolume = redVolume + greenVolume;

            let bar:VolumeProfilerDataBar = {
                fromPrice: levels[i-1],
                toPrice: levels[i],
                greenVolume: greenVolume,
                redVolume: redVolume,
                totalVolume: totalVolume,
                valueArea: false
            }

            bars.push(bar);

        }

        this.applyDashCandlesOnBoundariesToBars(levels, candles, bars);

        return bars;

    }

    private applyDashCandlesOnBoundariesToBars(levels: number[], candles: PriceData[], bars: VolumeProfilerDataBar[]) {

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // MA THIS IS AN ATTEMPT TO DOCUMENT A LOGIC THAT IS TOO HARD TO EXPLAIN :-)
        // computeVolume method does not include "dash" candles that lies on the edge between levels. Reason, such candles is confusing, as
        // to which level they should be mapped? Upper or Lower levels?
        // TradingView doesn't handle this consistently, and I wasn't able to find a mechanism to follow based on their approach.
        // Therefore, I came with my own mechanism, which is to map "dash" candles to maximize volume bars (or what they call nodes).
        // So, logic below should sum the dash candle volumes and place them with surrounding bars that has "more" volume. Also, when applying
        // "dash" candles, they are applied from the "dash" ones with the most volume to the "dash" ones with the lowest volume, in order
        // to maximize "nodes as well.
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // 1) build dash candle volumes
        let dashCandlesVolume = [];

        for (let i = 0; i < levels.length; ++i) {
            let price = levels[i];
            let volume =
                candles.map(candle => candle.high == candle.low && candle.high == price ? candle.volume : 0)
                    .reduce((net, volume) => net + volume);
            dashCandlesVolume.push({index: i, volume: volume});
        }

        // 2) sort them (from high to low)
        dashCandlesVolume.sort((a, b) => {
            return b.volume - a.volume;
        });

        // 3) apply them to the bar with the more value
        for (let i = 0; i < dashCandlesVolume.length; ++i) {
            let dashPriceIndex = dashCandlesVolume[i].index;
            let barBefore = dashPriceIndex == 0 ? null : bars[dashPriceIndex - 1];
            let barAfter = dashPriceIndex == bars.length ? null : bars[dashPriceIndex];
            let selectedBar = null;
            if (barBefore == null) {
                selectedBar = barAfter;
            } else if (barAfter == null) {
                selectedBar = barBefore;
            } else {
                selectedBar = barBefore.totalVolume < barAfter.totalVolume ? barAfter : barBefore;
            }
            selectedBar.greenVolume += dashCandlesVolume[i].volume;
            selectedBar.totalVolume += dashCandlesVolume[i].volume;
        }

    }

    private computeVolume(candles: PriceData[], fromPrice: number, toPrice: number, includeFn: (priceData: PriceData) => boolean) {

        let volume:number = 0;

        for(let i = 0; i < candles.length; ++i){
            if(includeFn(candles[i])) {
                volume += this.computeVolumeFromCandle(candles[i], fromPrice, toPrice);
            }
        }

        return Math.round(volume);

    }

    private computeVolumeFromCandle(candle: PriceData, fromPrice: number, toPrice: number) {

        let lowerCandlePrice = candle.low;
        let upperCandlePrice = candle.high;

        // MA don't add (equal sign) to comparison below in order to exclude "dash" candles on price
        // levels to be handled here, as they will be handled separately (refer to comment in applyDashCandlesOnBoundariesToBars).
        if (fromPrice < upperCandlePrice && lowerCandlePrice < toPrice) {
            if(upperCandlePrice == lowerCandlePrice) {
                return candle.volume;
            }
            let numberOfUnits = Math.round((upperCandlePrice - lowerCandlePrice) / this.PRICE_UNIT);
            let volumePerUnit = candle.volume / numberOfUnits;
            let minIntersectionPrice = Math.max(fromPrice, lowerCandlePrice);
            let maxIntersectionPrice = Math.min(toPrice, upperCandlePrice);
            let intersectedPriceUnits = Math.round((maxIntersectionPrice - minIntersectionPrice) / this.PRICE_UNIT);
            return intersectedPriceUnits * volumePerUnit;
        }

        return 0;

    }

    /* compute point of control */

    private computePointOfControl(volumeProfileDataBars:VolumeProfilerDataBar[]) {
        let maxBarVolume: number = Math.max.apply(Math, volumeProfileDataBars.map(bar => bar.totalVolume));
        let maxVolumeProfileDataBar: VolumeProfilerDataBar = volumeProfileDataBars.find(bar => bar.totalVolume == maxBarVolume);
        let pointOfControl = (maxVolumeProfileDataBar.fromPrice + maxVolumeProfileDataBar.toPrice) / 2;
        return Math.round(pointOfControl * 100000) / 100000;
    }

    /* compute value area */

    private computeValueArea(volumeProfileDataBars: VolumeProfilerDataBar[], pointOfControl: number, valueAreaVolumeRatio: number) {

        let BELOW_DIRECTION = 'below';
        let ABOVE_DIRECTION = 'above';

        let pointOfControlBar = volumeProfileDataBars.find(bar => bar.fromPrice < pointOfControl && pointOfControl <= bar.toPrice);
        Tc.assert(pointOfControlBar != null, "fail to find point of control bar");
        pointOfControlBar.valueArea = true;

        let netVolume = volumeProfileDataBars.map(bar => bar.totalVolume).reduce((net, volume) => {return net + volume})

        let netValueVolume = pointOfControlBar.totalVolume;
        let valueAreaLowerIndex, valueAreaUpperIndex;
        valueAreaLowerIndex = valueAreaUpperIndex = volumeProfileDataBars.indexOf(pointOfControlBar);

        while(netValueVolume < valueAreaVolumeRatio * netVolume) {

            let barBelowValueArea = valueAreaLowerIndex == 0 ? null : volumeProfileDataBars[valueAreaLowerIndex - 1];
            let barAboveValueArea = valueAreaUpperIndex == volumeProfileDataBars.length - 1 ? null : volumeProfileDataBars[valueAreaUpperIndex + 1];

            let direction:string = null;

            if(barBelowValueArea == null) {
                direction = ABOVE_DIRECTION;
            } else if(barAboveValueArea == null) {
                direction = BELOW_DIRECTION;
            } else {
                direction = barBelowValueArea.totalVolume < barAboveValueArea.totalVolume ? ABOVE_DIRECTION : BELOW_DIRECTION;
            }

            let nextBar = direction == ABOVE_DIRECTION ? barAboveValueArea : barBelowValueArea;

            Tc.assert(nextBar != null, "nextBar cannot be null");

            if(direction == ABOVE_DIRECTION) {
                Tc.assert(barAboveValueArea != null, "nextBar cannot be null");
                barAboveValueArea.valueArea = true;
                valueAreaUpperIndex += 1;
                netValueVolume += barAboveValueArea.totalVolume;
            } else if(direction == BELOW_DIRECTION) {
                Tc.assert(barBelowValueArea != null, "nextBar cannot be null");
                barBelowValueArea.valueArea = true;
                valueAreaLowerIndex -= 1;
                netValueVolume += barBelowValueArea.totalVolume;
            } else {
                Tc.error("should never be here");
            }

        }


    }


}

export enum VolumeProfilerSettingsRowType {
    TICKS_PER_ROW = 1,
    NUMBER_OF_ROWS
}

export interface VolumeProfilerSettings {
    rowSize:number,
    valueAreaVolumeRatio:number,
    rowLayout:VolumeProfilerSettingsRowType
}

export interface VolumeProfilerResult {
    requesterId:string,
    data: VolumeProfilerData[]
}

export interface VolumeProfilerData {
    pointOfControl:number,
    bars:VolumeProfilerDataBar[],
    fromDate:string,
    toDate:string
}


export interface VolumeProfilerDataBar {
    fromPrice:number,
    toPrice:number,
    totalVolume:number,
    greenVolume:number,
    redVolume:number,
    valueArea:boolean
}


