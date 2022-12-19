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
import { LiquidityLoaderService } from '../loader/liquidity-loader/liquidity-loader.service';
import { LiquidityPoint } from './liquidity-point';
import { LiquidityPointsGrouper } from './liquidity-points-grouper';
import { Streamer } from '../streaming/streamer';
import { LiquidityIntervalUtils } from './liquidity-interval-utils';
import { bufferTime } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { Tc } from '../../utils';
var uniqBy = require("lodash/uniqBy");
var LiquidityService = (function () {
    function LiquidityService(liquidityLoaderService, streamer) {
        var _this = this;
        this.liquidityLoaderService = liquidityLoaderService;
        this.streamer = streamer;
        this.symbolLiquidityPoints = {};
        this.symbolCachedLiquidityPoints = {};
        this.symbolLiquidityUpdateStream = new Subject();
        this.liquidityPointsGrouper = new LiquidityPointsGrouper();
        this.streamer.getTechnicalReportsStreamer().getLiquidityStreamer().pipe(bufferTime(750)).subscribe(function (messages) {
            if (0 < messages.length) {
                _this.processStreamerMessages(messages);
            }
        });
    }
    LiquidityService.prototype.processStreamerMessages = function (messages) {
        var _this = this;
        var updateStreamValues = [];
        messages.forEach(function (message) {
            var key = "".concat(message.symbol, ".").concat(message.interval);
            if (key in _this.symbolLiquidityPoints) {
                var liquidityPoint = LiquidityPoint.fromLiquidityMessage(message);
                if (_this.isWaitingForHistoryToLoad(key)) {
                    _this.symbolCachedLiquidityPoints[key].push(liquidityPoint);
                }
                else {
                    _this.processLiquidityUpdate(message.symbol, message.interval, liquidityPoint);
                    updateStreamValues.push({ symbol: message.symbol, interval: LiquidityIntervalUtils.fromIntervalString(message.interval) });
                }
            }
        });
        uniqBy(updateStreamValues, function (m) { return m.symbol + "-" + m.interval; }).forEach(function (updateStreamValue) {
            _this.symbolLiquidityUpdateStream.next(updateStreamValue);
        });
    };
    LiquidityService.prototype.isWaitingForHistoryToLoad = function (key) {
        return this.symbolLiquidityPoints[key].length == 0;
    };
    LiquidityService.prototype.getSymbolHistoryLoadState = function (symbol, interval) {
        var baseInterval = LiquidityIntervalUtils.getBaseInterval(interval);
        var baseIntervalString = LiquidityIntervalUtils.toIntervalString(baseInterval);
        var baseKey = "".concat(symbol, ".").concat(baseIntervalString);
        if (!(baseKey in this.symbolLiquidityPoints)) {
            return LiquidityHistoryLoadingState.NOT_LOADED;
        }
        else if (this.isWaitingForHistoryToLoad(baseKey)) {
            return LiquidityHistoryLoadingState.REQUESTED;
        }
        else {
            return LiquidityHistoryLoadingState.LOADED;
        }
    };
    LiquidityService.prototype.requestToLoadSymbolHistory = function (symbol, interval) {
        var _this = this;
        Tc.assert(this.getSymbolHistoryLoadState(symbol, interval) == LiquidityHistoryLoadingState.NOT_LOADED, "request to load history while it is already loading/loaded");
        var baseInterval = LiquidityIntervalUtils.getBaseInterval(interval);
        var baseIntervalString = LiquidityIntervalUtils.toIntervalString(baseInterval);
        var baseKey = "".concat(symbol, ".").concat(baseIntervalString);
        var market = null;
        this.prepareCaching(baseKey);
        this.streamer.getTechnicalReportsStreamer().subscribeLiquidity(baseIntervalString, market);
        var threeYearsAgo = moment().subtract(3, 'years').format('YYYY-MM-DD');
        var url = '';
        this.liquidityLoaderService.loadSymbolHistory(url, symbol, market, baseIntervalString, threeYearsAgo).subscribe(function (liquidityPoints) {
            _this.symbolLiquidityPoints[baseKey] = liquidityPoints;
            _this.processCachedLiquidityPoints(symbol, baseIntervalString);
            _this.symbolLiquidityUpdateStream.next({ symbol: symbol, interval: interval });
        });
    };
    LiquidityService.prototype.getSymbolLiquidityPoints = function (symbol, interval) {
        var intervalString = LiquidityIntervalUtils.toIntervalString(interval);
        var key = "".concat(symbol, ".").concat(intervalString);
        if (key in this.symbolCachedLiquidityPoints) {
            return this.symbolLiquidityPoints[key];
        }
        var baseInterval = LiquidityIntervalUtils.getBaseInterval(interval);
        var baseIntervalString = LiquidityIntervalUtils.toIntervalString(baseInterval);
        var baseKey = "".concat(symbol, ".").concat(baseIntervalString);
        var market = null;
        if (this.liquidityPointsGrouper.needGrouping(interval) && (baseKey in this.symbolLiquidityPoints)) {
            return this.liquidityPointsGrouper.groupLiquidityPoints(market, symbol, this.symbolLiquidityPoints[baseKey], interval);
        }
        return [];
    };
    LiquidityService.prototype.getSymbolLiquidityUpdateStream = function () {
        return this.symbolLiquidityUpdateStream;
    };
    LiquidityService.prototype.prepareCaching = function (key) {
        this.symbolLiquidityPoints[key] = [];
        this.symbolCachedLiquidityPoints[key] = [];
    };
    LiquidityService.prototype.processCachedLiquidityPoints = function (symbol, intervalString) {
        var key = "".concat(symbol, ".").concat(intervalString);
        for (var _i = 0, _a = this.symbolCachedLiquidityPoints[key]; _i < _a.length; _i++) {
            var point = _a[_i];
            this.processLiquidityUpdate(symbol, intervalString, point);
        }
        this.symbolCachedLiquidityPoints[key] = [];
    };
    LiquidityService.prototype.processLiquidityUpdate = function (symbol, intervalString, liquidityPoint) {
        var key = "".concat(symbol, ".").concat(intervalString), interval = LiquidityIntervalUtils.fromIntervalString(intervalString);
        this.applyRealTimeUpdate(key, liquidityPoint, interval);
    };
    LiquidityService.prototype.applyRealTimeUpdate = function (key, newPoint, interval) {
        Tc.assert(!this.liquidityPointsGrouper.needGrouping(interval), 'Realtime updates for unsupported intervals should not be grouped');
        var liquidityPoints = this.symbolLiquidityPoints[key];
        var lastIndex = liquidityPoints.length - 1;
        if (liquidityPoints[lastIndex].time == newPoint.time) {
            liquidityPoints[lastIndex].inflowAmount = newPoint.inflowAmount;
            liquidityPoints[lastIndex].inflowVolume = newPoint.inflowVolume;
            liquidityPoints[lastIndex].outflowAmount = newPoint.outflowAmount;
            liquidityPoints[lastIndex].outflowVolume = newPoint.outflowVolume;
            liquidityPoints[lastIndex].netAmount = newPoint.netAmount;
            liquidityPoints[lastIndex].netVolume = newPoint.netVolume;
            liquidityPoints[lastIndex].percentage = newPoint.percentage;
        }
        else {
            liquidityPoints.push(newPoint);
        }
    };
    LiquidityService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LiquidityLoaderService, Streamer])
    ], LiquidityService);
    return LiquidityService;
}());
export { LiquidityService };
export var LiquidityHistoryLoadingState;
(function (LiquidityHistoryLoadingState) {
    LiquidityHistoryLoadingState[LiquidityHistoryLoadingState["NOT_LOADED"] = 0] = "NOT_LOADED";
    LiquidityHistoryLoadingState[LiquidityHistoryLoadingState["REQUESTED"] = 1] = "REQUESTED";
    LiquidityHistoryLoadingState[LiquidityHistoryLoadingState["LOADED"] = 2] = "LOADED";
})(LiquidityHistoryLoadingState || (LiquidityHistoryLoadingState = {}));
//# sourceMappingURL=liquidity.service.js.map