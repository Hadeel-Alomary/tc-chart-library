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
import { Subject } from 'rxjs';
import { LiquidityPointsGrouper } from './liquidity-points-grouper';
import { LiquidityLoaderService } from '../loader';
import { LiquidityHistoryLoadingState } from './liquidity.service';
import { LiquidityIntervalUtils } from './liquidity-interval-utils';
import { MarketUtils } from '../../utils';
var ElementLiquidityService = (function () {
    function ElementLiquidityService(liquidityLoaderService) {
        this.liquidityLoaderService = liquidityLoaderService;
        this.symbolLiquidityPoints = [];
        this.symbolLiquidityUpdateStream = new Subject();
        this.liquidityPointsGrouper = new LiquidityPointsGrouper();
    }
    ElementLiquidityService.prototype.getSymbolHistoryLoadState = function (symbol, interval) {
        return LiquidityHistoryLoadingState.NOT_LOADED;
    };
    ElementLiquidityService.prototype.requestToLoadSymbolHistory = function (url, symbol, interval) {
        var _this = this;
        var baseInterval = LiquidityIntervalUtils.getBaseInterval(interval);
        var baseIntervalString = LiquidityIntervalUtils.toIntervalString(baseInterval);
        var market = MarketUtils.marketAbbr(symbol);
        var threeYearsAgo = moment().subtract(3, 'years').format('YYYY-MM-DD');
        this.liquidityLoaderService.loadSymbolHistory(url, symbol, market, baseIntervalString, threeYearsAgo).subscribe(function (liquidityPoints) {
            _this.symbolLiquidityPoints = liquidityPoints;
            _this.symbolLiquidityUpdateStream.next({ symbol: symbol, interval: interval });
        });
    };
    ElementLiquidityService.prototype.getSymbolLiquidityPoints = function (symbol, interval) {
        if (this.liquidityPointsGrouper.needGrouping(interval)) {
            var market = MarketUtils.marketAbbr(symbol);
            return this.liquidityPointsGrouper.groupLiquidityPoints(market, symbol, this.symbolLiquidityPoints, interval);
        }
        return this.symbolLiquidityPoints;
    };
    ElementLiquidityService.prototype.getSymbolLiquidityUpdateStream = function () {
        return this.symbolLiquidityUpdateStream;
    };
    ElementLiquidityService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LiquidityLoaderService])
    ], ElementLiquidityService);
    return ElementLiquidityService;
}());
export { ElementLiquidityService };
//# sourceMappingURL=element-liquidity.service.js.map