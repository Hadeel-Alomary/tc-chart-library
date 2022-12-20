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
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MarketUtils, Tc, TcTracker } from '../../../utils/index';
import { Interval } from './interval';
import { PriceGrouper } from './price-grouper';
var cloneDeep = require("lodash/cloneDeep");
var round = require("lodash/round");
var clone = require("lodash/clone");
var PriceLoader = (function () {
    function PriceLoader(http) {
        this.http = http;
    }
    PriceLoader.prototype.loadPriceData = function (baseUrl, userName, symbol, interval, period) {
        var _this = this;
        return this.loadRawPricesData(baseUrl, userName, symbol, interval, period).pipe(map(function (data) {
            data.priceData = _this.applySplits(data.priceData, cloneDeep(data.splits));
            return { groupedData: _this.groupPriceData(MarketUtils.marketAbbr(symbol), data.priceData, interval), lastPriceData: data.priceData[0], splits: data.splits };
        }));
    };
    PriceLoader.prototype.loadRawPricesData = function (baseUrl, userName, symbol, interval, period, applySplit) {
        var _this = this;
        if (applySplit === void 0) { applySplit = true; }
        var startTime = new Date().getTime();
        var url = baseUrl + '?' +
            ("user_name=" + userName + "&symbol=" + symbol) +
            ("&interval=" + Interval.mapIntervalToServerInterval(interval).serverInterval + "&period=" + period.serverPeriod);
        Tc.info("request prices history: " + url);
        return this.http.get(Tc.url(url), { responseType: 'text' })
            .pipe(map(function (response) {
            _this.logSlowRequest(startTime, 'price-loader');
            return _this.processPriceData(response, Interval.isDaily(interval));
        }));
    };
    PriceLoader.prototype.loadTimeAndSale = function (baseUrl, userName, symbol, period, date) {
        var _this = this;
        var startTime = new Date().getTime();
        var url = baseUrl + '?' +
            ("user_name=" + userName + "&symbol=" + symbol) +
            ("&interval=tick&period=" + period);
        if (date != null) {
            url += "&historical_trades_date=" + date;
        }
        Tc.info("request time and sale : " + url);
        return this.http.get(Tc.url(url), { responseType: 'text' })
            .pipe(map(function (response) {
            _this.logSlowRequest(startTime, 'time-and-sale');
            return _this.processPriceData(response, false).priceData;
        }));
    };
    PriceLoader.prototype.groupPriceData = function (marketAbbr, data, interval) {
        return PriceGrouper.groupPriceData(marketAbbr, data, interval);
    };
    PriceLoader.prototype.processPriceData = function (response, daily) {
        var _this = this;
        var priceData = [];
        var state = 'none';
        var splits = [];
        if (response == null) {
            response = '';
        }
        response.split('\n').forEach(function (line) {
            line = line.trim();
            if (line == '') {
                return;
            }
            if (line == 'HistoricalData') {
                Tc.assert(state == 'none', "invalid state");
                state = 'price';
            }
            else if (line == 'SPLIT') {
                Tc.assert(state == 'none', "invalid state");
                state = 'split';
            }
            else if (line == 'END') {
                Tc.assert(state != 'none', "invalid state");
                state = 'none';
            }
            else if (state == 'price') {
                priceData.push(daily ? _this.processDailyPriceLine(line) : _this.processIntraDayPriceLine(line));
            }
            else if (state == 'split') {
                splits.push({ date: line.split(',')[0], value: +line.split(',')[1] });
            }
            else {
                Tc.error("should never be here - " + line);
            }
        }, this);
        if (state != 'none') {
            Tc.warn("price loading response wasnot complete");
            return { priceData: [], splits: [] };
        }
        return { priceData: priceData, splits: splits };
    };
    PriceLoader.prototype.processDailyPriceLine = function (line) {
        var fields = line.split(",");
        return {
            time: fields[0],
            open: +fields[1],
            high: +fields[2],
            low: +fields[3],
            close: +fields[4],
            volume: +fields[5],
            amount: +fields[6],
            contracts: +fields[7]
        };
    };
    PriceLoader.prototype.processIntraDayPriceLine = function (line) {
        var fields = line.split(",");
        var priceData = {
            time: fields[0],
            open: +fields[1],
            high: +fields[2],
            low: +fields[3],
            close: +fields[4],
            volume: +fields[5],
            amount: +fields[6],
            state: fields[7],
            contracts: +fields[10],
            direction: fields[9],
            id: +fields[8],
            specialTrade: false,
        };
        if (fields[12] && fields[12] == 'st') {
            priceData.specialTrade = true;
        }
        return priceData;
    };
    PriceLoader.prototype.applySplits = function (prices, splits) {
        if (!splits.length) {
            return prices;
        }
        splits.reverse();
        var splitFactor = 1;
        var adjustedPrices = prices.map(function (price) {
            var date = 10 < price.time.length ? price.time.substr(0, 10) : price.time;
            if (splits.length && date < splits[0].date) {
                splitFactor *= splits[0].value;
                splits.shift();
            }
            if (splitFactor == 1) {
                return price;
            }
            var adjustedPrice = clone(price);
            adjustedPrice.open = round(adjustedPrice.open / splitFactor, 3);
            adjustedPrice.high = round(adjustedPrice.high / splitFactor, 3);
            adjustedPrice.low = round(adjustedPrice.low / splitFactor, 3);
            adjustedPrice.close = round(adjustedPrice.close / splitFactor, 3);
            adjustedPrice.volume = round(adjustedPrice.volume * splitFactor);
            return adjustedPrice;
        });
        return adjustedPrices;
    };
    PriceLoader.prototype.logSlowRequest = function (startTime, type) {
        var endTime = new Date().getTime();
        if (1500 < (endTime - startTime)) {
            if (TcTracker.isEnabled()) {
                TcTracker.trackSlowRequest(type, endTime - startTime);
            }
        }
    };
    PriceLoader = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], PriceLoader);
    return PriceLoader;
}());
export { PriceLoader };
//# sourceMappingURL=price-loader.service.js.map