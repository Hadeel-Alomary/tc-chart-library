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
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DerayahService } from './derayah.service';
import { DerayahLoaderService } from '../../loader/index';
import { DerayahUtils } from '../../../utils/index';
import { QuoteService } from '../../quote/index';
import { Subject } from 'rxjs/internal/Subject';
var DerayahPositionsService = (function () {
    function DerayahPositionsService(derayahService, derayahLoaderService, quoteService) {
        var _this = this;
        this.derayahService = derayahService;
        this.derayahLoaderService = derayahLoaderService;
        this.quoteService = quoteService;
        this.portfolios = [];
        this.positions = {};
        this.positionsStream = new BehaviorSubject(null);
        this.positionsLoadedStream = new Subject();
        this.derayahService.getPortfoliosStream()
            .subscribe(function (portfolios) {
            if (portfolios) {
                _this.portfolios = portfolios;
                _this.refreshPositions();
            }
            else {
                _this.unsubscribePositions();
                _this.positions = {};
                _this.positionsStream.next(_this.positions);
            }
        });
        this.quoteService.getSnapshotStream()
            .subscribe(function (quotes) { return _this.onQuotes(quotes); });
        this.quoteService.getUpdateStream()
            .subscribe(function (symbol) { return _this.onQuoteUpdate(symbol); });
        this.derayahService.getDerayahStreamer().getDerayahPositionStream()
            .subscribe(function () {
            _this.refreshPositions();
        });
    }
    DerayahPositionsService.prototype.getPositionsStream = function () {
        return this.positionsStream;
    };
    DerayahPositionsService.prototype.getPositionsLoadedStream = function () {
        return this.positionsLoadedStream;
    };
    DerayahPositionsService.prototype.refreshPositions = function () {
        var _this = this;
        var progressSubject = new Subject();
        var positions = {};
        var _loop_1 = function (portfolio) {
            this_1.loadPositions(portfolio.portfolioNumber)
                .subscribe(function (response) {
                positions[portfolio.portfolioNumber] = response.result;
                if ((0 < Object.keys(positions).length) && (Object.keys(positions).length == _this.portfolios.length)) {
                    progressSubject.complete();
                    _this.positions = positions;
                    _this.updatePositions();
                    _this.subscribePositions();
                    _this.positionsStream.next(_this.positions);
                    _this.positionsLoadedStream.next();
                }
            }, function (error) { });
        };
        var this_1 = this;
        for (var _i = 0, _a = this.portfolios; _i < _a.length; _i++) {
            var portfolio = _a[_i];
            _loop_1(portfolio);
        }
        return progressSubject.asObservable().subscribe();
    };
    DerayahPositionsService.prototype.onQuotes = function (quotes) {
        if (!quotes) {
            return;
        }
        this.quotes = quotes;
        if (!this.isPositionsLoaded()) {
            return;
        }
        this.updatePositions();
        this.positionsStream.next(this.positions);
    };
    DerayahPositionsService.prototype.onQuoteUpdate = function (symbol) {
        if (!this.isPositionsLoaded()) {
            return;
        }
        if (this.quotes.data[symbol].changeSet.indexOf('last') == -1) {
            return;
        }
        var needUpdatePositions = false;
        for (var _i = 0, _a = Object.values(this.positions); _i < _a.length; _i++) {
            var positions = _a[_i];
            var index = positions.findIndex(function (position) { return position.symbol == symbol; });
            if (index != -1) {
                needUpdatePositions = true;
                this.updatePosition(positions[index]);
            }
        }
        if (needUpdatePositions) {
            this.positionsStream.next(this.positions);
        }
    };
    DerayahPositionsService.prototype.isPositionsLoaded = function () {
        return this.positions != null;
    };
    DerayahPositionsService.prototype.updatePositions = function () {
        if (!this.quotes) {
            return;
        }
        for (var _i = 0, _a = Object.values(this.positions); _i < _a.length; _i++) {
            var positions = _a[_i];
            for (var _b = 0, positions_1 = positions; _b < positions_1.length; _b++) {
                var position = positions_1[_b];
                this.updatePosition(position);
            }
        }
    };
    DerayahPositionsService.prototype.subscribePositions = function () {
        if (!this.quotes && !this.positions) {
            return;
        }
        var positionSymbols = [];
        for (var _i = 0, _a = Object.values(this.positions); _i < _a.length; _i++) {
            var positions = _a[_i];
            for (var _b = 0, positions_2 = positions; _b < positions_2.length; _b++) {
                var position = positions_2[_b];
                positionSymbols.push(position.symbol);
            }
        }
        this.quoteService.subscribeQuotes(positionSymbols);
    };
    DerayahPositionsService.prototype.unsubscribePositions = function () {
        if (!this.quotes && !this.positions) {
            return;
        }
        var positionSymbols = [];
        for (var _i = 0, _a = Object.values(this.positions); _i < _a.length; _i++) {
            var positions = _a[_i];
            for (var _b = 0, positions_3 = positions; _b < positions_3.length; _b++) {
                var position = positions_3[_b];
                positionSymbols.push(position.symbol);
            }
        }
        this.quoteService.unSubscribeQuotes(positionSymbols);
    };
    DerayahPositionsService.prototype.updatePosition = function (position) {
        position.currentPrice = this.quotes.data[position.symbol].last;
        position.currentTotalCost = position.currentPrice * position.quantity;
        position.costDiff = position.totalCost - position.currentTotalCost;
        position.perCostDiff = ((position.totalCost - position.currentTotalCost) / position.totalCost) * 100;
    };
    DerayahPositionsService.prototype.loadPositions = function (portfolio) {
        var _this = this;
        return this.derayahLoaderService.getPositions(portfolio).pipe(map(function (response) { return _this.mapPositions(response, portfolio); }));
    };
    DerayahPositionsService.prototype.mapPositions = function (response, portfolio) {
        var positions = [];
        var positionsData = response.data;
        var result = positionsData.tradingAccountPositionInfoList;
        if (result && result.length > 0) {
            result.forEach(function (item) {
                var symbol = DerayahUtils.getSymbolWithMarketFromDerayah(item.exchangecode, item.symbol);
            });
        }
        return { result: positions };
    };
    DerayahPositionsService.prototype.getCompanyFreeQuantity = function (portfolioNumber, symbol) {
        if (!this.positions || !this.positions[portfolioNumber]) {
            return 0;
        }
        var companyPosition = this.positions[portfolioNumber].find(function (item) { return item.symbol == symbol; });
        return companyPosition ? companyPosition.freeQuantity : 0;
    };
    DerayahPositionsService.prototype.getPositions = function () {
        var _this = this;
        var portfolios = Object.keys(this.positions);
        if (portfolios.length == 1) {
            return this.positions[portfolios[0]];
        }
        var positions = [];
        portfolios.forEach(function (portfolio) {
            positions = positions.concat(_this.positions[portfolio]);
        });
        return positions;
    };
    DerayahPositionsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [DerayahService,
            DerayahLoaderService,
            QuoteService])
    ], DerayahPositionsService);
    return DerayahPositionsService;
}());
export { DerayahPositionsService };
//# sourceMappingURL=derayah-positions.service.js.map