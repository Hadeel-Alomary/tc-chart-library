var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { ArrayUtils, DateUtils, MarketUtils, Tc, TcTracker } from '../../utils';
import { MarketsTickSizeService } from '../markets-tick-size';
import { VolumeProfilerRequestBuilder } from './volume-profiler-request-builder';
import { IntervalType } from "../../services/loader/price-loader/interval-type";
import { Interval } from "../../services/loader/price-loader/interval";
import { Period } from "../../services/loader/price-loader/period";
import { PriceLoader } from "../../services/loader/price-loader/price-loader.service";
var isEqual = require('lodash/isEqual');
var VolumeProfilerService = (function () {
    function VolumeProfilerService(priceLoader, marketsTickSizeService) {
        this.priceLoader = priceLoader;
        this.marketsTickSizeService = marketsTickSizeService;
        this.requests = {};
        this.requestSubscriptions = {};
        this.resultStream = new Subject();
        this.PRICE_UNIT = 0.00001;
        this.requestBuilder = new VolumeProfilerRequestBuilder();
    }
    VolumeProfilerService.prototype.getResultStream = function () {
        return this.resultStream;
    };
    VolumeProfilerService.prototype.getRequestBuilder = function () {
        return this.requestBuilder;
    };
    VolumeProfilerService.prototype.requestVolumeProfilerData = function (requestParams) {
        Tc.assert(!this.isRequested(requestParams), "request is already requested");
        Tc.assert(requestParams.from != requestParams.to, "volume profiler from and to should be different");
        this.getVolumeProfileData(requestParams.requestedId, requestParams);
    };
    VolumeProfilerService.prototype.isRequested = function (requestData) {
        if (!this.requests[requestData.requestedId]) {
            return false;
        }
        return isEqual(this.requests[requestData.requestedId], requestData);
    };
    VolumeProfilerService.prototype.getVolumeProfileData = function (requesterId, requestData) {
        this.cleanData(requesterId);
        this.processVolumeProfileRequest(requestData);
    };
    VolumeProfilerService.prototype.cleanData = function (requesterId) {
        if (this.requests[requesterId]) {
            delete this.requests[requesterId];
            if (requesterId in this.requestSubscriptions) {
                this.requestSubscriptions[requesterId].unsubscribe();
                delete this.requestSubscriptions[requesterId];
            }
        }
    };
    VolumeProfilerService.prototype.processVolumeProfileRequest = function (requestData) {
        var _this = this;
        if (TcTracker.isEnabled()) {
            TcTracker.trackVolumeProfilerRequest();
        }
        Tc.assert(!(requestData.requestedId in this.requests), "request is already made");
        var fromDate = requestData.from.substr(0, 10);
        var market = requestData.market;
        var pricesUrl = market.historicalPricesUrl;
        var userName = '';
        var subscription = this.priceLoader.loadPriceData(pricesUrl, userName, requestData.symbol, this.getDataInterval(fromDate), Period.getClosestPeriodContainingDate(market.abbreviation, fromDate)).subscribe(function (value) {
            delete _this.requestSubscriptions[requestData.requestedId];
            var from = requestData.from;
            var dailyInterval = Interval.isDaily(requestData.requestedInterval);
            var to = dailyInterval ? DateUtils.toDate(requestData.to) + " 23:59:59" : requestData.to;
            var inRangeCandles = value.groupedData.filter(function (c) { return from <= c.time && c.time <= to; });
            _this.processPriceDataForRequest(inRangeCandles, requestData);
        });
        this.requests[requestData.requestedId] = requestData;
        this.requestSubscriptions[requestData.requestedId] = subscription;
    };
    VolumeProfilerService.prototype.getDataInterval = function (from) {
        var threeMonths = moment().subtract(3, 'months').format('YYYY-MM-DD');
        var twoYears = moment().subtract(2, 'years').format('YYYY-MM-DD');
        var intervalType = null;
        if (threeMonths <= from) {
            intervalType = IntervalType.Minute;
        }
        else if (twoYears <= from) {
            intervalType = IntervalType.FifteenMinutes;
        }
        else {
            intervalType = IntervalType.Day;
        }
        return Interval.getIntervalByType(intervalType);
    };
    VolumeProfilerService.prototype.processPriceDataForRequest = function (allCandles, requestData) {
        var _this = this;
        var data = [];
        var candleGroups = requestData.segmentPerSession ? this.getSessionCandles(allCandles) : [allCandles];
        candleGroups.forEach(function (candles) {
            data.unshift(_this.computeVolumeProfile(candles, requestData));
        });
        var volumeProfileResult = {
            requesterId: requestData.requestedId,
            data: data
        };
        this.resultStream.next(volumeProfileResult);
    };
    VolumeProfilerService.prototype.getSessionCandles = function (candles) {
        var sessionCandles = {};
        candles.forEach(function (candle) {
            var date = candle.time.substr(0, 10);
            if (!(date in sessionCandles)) {
                sessionCandles[date] = [];
            }
            sessionCandles[date].push(candle);
        });
        return ArrayUtils.values(sessionCandles);
    };
    VolumeProfilerService.prototype.computeVolumeProfile = function (candles, requestData) {
        var volumeProfileDataBars = this.computeVolumeProfileDataBars(candles, requestData);
        var pointOfControl = this.computePointOfControl(volumeProfileDataBars);
        this.computeValueArea(volumeProfileDataBars, pointOfControl, requestData.volumeProfilerSettings.valueAreaVolumeRatio);
        return {
            pointOfControl: pointOfControl,
            bars: volumeProfileDataBars,
            fromDate: candles[candles.length - 1].time,
            toDate: candles[0].time
        };
    };
    VolumeProfilerService.prototype.getProfileLevels = function (candles, requestData) {
        var _a = this.getMinAndMaxPrices(candles), minPrice = _a.minPrice, maxPrice = _a.maxPrice;
        var rowType = requestData.volumeProfilerSettings.rowLayout;
        var rowSize = requestData.volumeProfilerSettings.rowSize;
        var symbol = requestData.symbol;
        var company = requestData.company;
        var levels = rowType == VolumeProfilerSettingsRowType.NUMBER_OF_ROWS ?
            this.getProfileLevelsByNumber(minPrice, maxPrice, rowSize) :
            this.getProfileLevelsByTicks(company, symbol, minPrice, maxPrice, rowSize);
        if (levels.length == 1) {
            levels[1] = levels[0] + 0.01;
        }
        return levels;
    };
    VolumeProfilerService.prototype.getProfileLevelsByNumber = function (minPrice, maxPrice, rowSize) {
        rowSize = Math.min(rowSize, Math.round((maxPrice - minPrice) / 0.01));
        var step = (maxPrice - minPrice) / rowSize;
        var result = [minPrice];
        for (var i = 0; i < rowSize; ++i) {
            var nextValue = result[result.length - 1] + step;
            result.push(nextValue);
        }
        return result.map(function (value) { return Math.round(value * 100000) / 100000; });
    };
    VolumeProfilerService.prototype.getProfileLevelsByTicks = function (company, symbol, minPrice, maxPrice, rowSize) {
        var tick = this.getTickSize(company, symbol, minPrice);
        var step = tick * rowSize;
        var numberOfLevels = Math.floor((maxPrice - minPrice) / step);
        var result = [minPrice];
        for (var i = 0; i < numberOfLevels; ++i) {
            var nextValue = result[result.length - 1] + step;
            nextValue = Math.round(nextValue * 100000) / 100000;
            result.push(Math.min(nextValue, maxPrice));
        }
        return result;
    };
    VolumeProfilerService.prototype.getTickSize = function (company, symbol, minPrice) {
        if (company.index) {
            return 1.00;
        }
        return this.marketsTickSizeService.getTickSize(MarketUtils.marketAbbr(symbol), minPrice);
    };
    VolumeProfilerService.prototype.getMinAndMaxPrices = function (candles) {
        var minPrice = Number.MAX_VALUE;
        var maxPrice = Number.MIN_VALUE;
        candles.forEach(function (data) {
            if (maxPrice < data.high) {
                maxPrice = data.high;
            }
            if (data.low < minPrice) {
                minPrice = data.low;
            }
        });
        return { minPrice: minPrice, maxPrice: maxPrice };
    };
    VolumeProfilerService.prototype.computeVolumeProfileDataBars = function (candles, requestData) {
        var levels = this.getProfileLevels(candles, requestData);
        Tc.assert(2 <= levels.length, "invalid levels length");
        var bars = [];
        for (var i = 1; i < levels.length; ++i) {
            var fromPrice = levels[i - 1];
            var toPrice = levels[i];
            var greenVolume = this.computeVolume(candles, fromPrice, toPrice, function (data) { return data.close >= data.open; });
            var redVolume = this.computeVolume(candles, fromPrice, toPrice, function (data) { return data.close < data.open; });
            var totalVolume = redVolume + greenVolume;
            var bar = {
                fromPrice: levels[i - 1],
                toPrice: levels[i],
                greenVolume: greenVolume,
                redVolume: redVolume,
                totalVolume: totalVolume,
                valueArea: false
            };
            bars.push(bar);
        }
        this.applyDashCandlesOnBoundariesToBars(levels, candles, bars);
        return bars;
    };
    VolumeProfilerService.prototype.applyDashCandlesOnBoundariesToBars = function (levels, candles, bars) {
        var dashCandlesVolume = [];
        var _loop_1 = function (i) {
            var price = levels[i];
            var volume = candles.map(function (candle) { return candle.high == candle.low && candle.high == price ? candle.volume : 0; })
                .reduce(function (net, volume) { return net + volume; });
            dashCandlesVolume.push({ index: i, volume: volume });
        };
        for (var i = 0; i < levels.length; ++i) {
            _loop_1(i);
        }
        dashCandlesVolume.sort(function (a, b) {
            return b.volume - a.volume;
        });
        for (var i = 0; i < dashCandlesVolume.length; ++i) {
            var dashPriceIndex = dashCandlesVolume[i].index;
            var barBefore = dashPriceIndex == 0 ? null : bars[dashPriceIndex - 1];
            var barAfter = dashPriceIndex == bars.length ? null : bars[dashPriceIndex];
            var selectedBar = null;
            if (barBefore == null) {
                selectedBar = barAfter;
            }
            else if (barAfter == null) {
                selectedBar = barBefore;
            }
            else {
                selectedBar = barBefore.totalVolume < barAfter.totalVolume ? barAfter : barBefore;
            }
            selectedBar.greenVolume += dashCandlesVolume[i].volume;
            selectedBar.totalVolume += dashCandlesVolume[i].volume;
        }
    };
    VolumeProfilerService.prototype.computeVolume = function (candles, fromPrice, toPrice, includeFn) {
        var volume = 0;
        for (var i = 0; i < candles.length; ++i) {
            if (includeFn(candles[i])) {
                volume += this.computeVolumeFromCandle(candles[i], fromPrice, toPrice);
            }
        }
        return Math.round(volume);
    };
    VolumeProfilerService.prototype.computeVolumeFromCandle = function (candle, fromPrice, toPrice) {
        var lowerCandlePrice = candle.low;
        var upperCandlePrice = candle.high;
        if (fromPrice < upperCandlePrice && lowerCandlePrice < toPrice) {
            if (upperCandlePrice == lowerCandlePrice) {
                return candle.volume;
            }
            var numberOfUnits = Math.round((upperCandlePrice - lowerCandlePrice) / this.PRICE_UNIT);
            var volumePerUnit = candle.volume / numberOfUnits;
            var minIntersectionPrice = Math.max(fromPrice, lowerCandlePrice);
            var maxIntersectionPrice = Math.min(toPrice, upperCandlePrice);
            var intersectedPriceUnits = Math.round((maxIntersectionPrice - minIntersectionPrice) / this.PRICE_UNIT);
            return intersectedPriceUnits * volumePerUnit;
        }
        return 0;
    };
    VolumeProfilerService.prototype.computePointOfControl = function (volumeProfileDataBars) {
        var maxBarVolume = Math.max.apply(Math, volumeProfileDataBars.map(function (bar) { return bar.totalVolume; }));
        var maxVolumeProfileDataBar = volumeProfileDataBars.find(function (bar) { return bar.totalVolume == maxBarVolume; });
        var pointOfControl = (maxVolumeProfileDataBar.fromPrice + maxVolumeProfileDataBar.toPrice) / 2;
        return Math.round(pointOfControl * 100000) / 100000;
    };
    VolumeProfilerService.prototype.computeValueArea = function (volumeProfileDataBars, pointOfControl, valueAreaVolumeRatio) {
        var BELOW_DIRECTION = 'below';
        var ABOVE_DIRECTION = 'above';
        var pointOfControlBar = volumeProfileDataBars.find(function (bar) { return bar.fromPrice < pointOfControl && pointOfControl <= bar.toPrice; });
        Tc.assert(pointOfControlBar != null, "fail to find point of control bar");
        pointOfControlBar.valueArea = true;
        var netVolume = volumeProfileDataBars.map(function (bar) { return bar.totalVolume; }).reduce(function (net, volume) { return net + volume; });
        var netValueVolume = pointOfControlBar.totalVolume;
        var valueAreaLowerIndex, valueAreaUpperIndex;
        valueAreaLowerIndex = valueAreaUpperIndex = volumeProfileDataBars.indexOf(pointOfControlBar);
        while (netValueVolume < valueAreaVolumeRatio * netVolume) {
            var barBelowValueArea = valueAreaLowerIndex == 0 ? null : volumeProfileDataBars[valueAreaLowerIndex - 1];
            var barAboveValueArea = valueAreaUpperIndex == volumeProfileDataBars.length - 1 ? null : volumeProfileDataBars[valueAreaUpperIndex + 1];
            var direction = null;
            if (barBelowValueArea == null) {
                direction = ABOVE_DIRECTION;
            }
            else if (barAboveValueArea == null) {
                direction = BELOW_DIRECTION;
            }
            else {
                direction = barBelowValueArea.totalVolume < barAboveValueArea.totalVolume ? ABOVE_DIRECTION : BELOW_DIRECTION;
            }
            var nextBar = direction == ABOVE_DIRECTION ? barAboveValueArea : barBelowValueArea;
            Tc.assert(nextBar != null, "nextBar cannot be null");
            if (direction == ABOVE_DIRECTION) {
                Tc.assert(barAboveValueArea != null, "nextBar cannot be null");
                barAboveValueArea.valueArea = true;
                valueAreaUpperIndex += 1;
                netValueVolume += barAboveValueArea.totalVolume;
            }
            else if (direction == BELOW_DIRECTION) {
                Tc.assert(barBelowValueArea != null, "nextBar cannot be null");
                barBelowValueArea.valueArea = true;
                valueAreaLowerIndex -= 1;
                netValueVolume += barBelowValueArea.totalVolume;
            }
            else {
                Tc.error("should never be here");
            }
        }
    };
    VolumeProfilerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [PriceLoader,
            MarketsTickSizeService])
    ], VolumeProfilerService);
    return VolumeProfilerService;
}());
export { VolumeProfilerService };
export var VolumeProfilerSettingsRowType;
(function (VolumeProfilerSettingsRowType) {
    VolumeProfilerSettingsRowType[VolumeProfilerSettingsRowType["TICKS_PER_ROW"] = 1] = "TICKS_PER_ROW";
    VolumeProfilerSettingsRowType[VolumeProfilerSettingsRowType["NUMBER_OF_ROWS"] = 2] = "NUMBER_OF_ROWS";
})(VolumeProfilerSettingsRowType || (VolumeProfilerSettingsRowType = {}));
//# sourceMappingURL=volume-profiler.service.js.map