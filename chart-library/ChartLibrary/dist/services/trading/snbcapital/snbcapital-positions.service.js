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
import { SnbcapitalService } from './snbcapital.service';
import { QuoteService } from '../../quote/index';
import { Subject } from 'rxjs/internal/Subject';
import { SnbcapitalErrorService } from './snbcapital-error.service';
import { SnbcapitalLoaderService } from '../../loader/trading/snbcapital-loader/snbcapital-loader.service';
var SnbcapitalPositionsService = (function () {
    function SnbcapitalPositionsService(snbcapitalService, snbcapitalLoaderService, quoteService, snbcapitalErrorService) {
        var _this = this;
        this.snbcapitalService = snbcapitalService;
        this.snbcapitalLoaderService = snbcapitalLoaderService;
        this.quoteService = quoteService;
        this.snbcapitalErrorService = snbcapitalErrorService;
        this.portfolios = [];
        this.positions = {};
        this.positionsStream = new BehaviorSubject(null);
        this.positionsLoadedStream = new Subject();
        this.snbcapitalService.getPortfoliosStream()
            .subscribe(function (portfolios) {
            if (portfolios && portfolios.length) {
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
        this.snbcapitalService.getSnbcapitalStreamer().getSnbCapitalPositionStream()
            .subscribe(function (portfolioId) {
            _this.refreshPositions(portfolioId);
        });
    }
    SnbcapitalPositionsService.prototype.ngOnDestroy = function () {
        this.unsubscribePositions();
    };
    SnbcapitalPositionsService.prototype.getPositionsStream = function () {
        return this.positionsStream;
    };
    SnbcapitalPositionsService.prototype.getPositionsLoadedStream = function () {
        return this.positionsLoadedStream;
    };
    SnbcapitalPositionsService.prototype.refreshPositions = function (portfolioId) {
        var _this = this;
        if (!this.snbcapitalService.validSession) {
            this.snbcapitalErrorService.emitSessionExpiredError();
            return null;
        }
        var progressSubject = new Subject();
        var portfolios = portfolioId ? [this.portfolios.find(function (portfolio) { return portfolio.portfolioId == portfolioId; })] : this.portfolios;
        var positions = {};
        var _loop_1 = function (portfolio) {
            this_1.loadPositions(portfolio)
                .subscribe(function (response) {
                positions[portfolio.portfolioId] = response;
                if ((0 < Object.keys(positions).length) && (Object.keys(positions).length == portfolios.length)) {
                    _this.positions = positions;
                    _this.updatePositions();
                    _this.subscribePositions();
                    _this.positionsStream.next(_this.positions);
                    _this.positionsLoadedStream.next();
                }
                progressSubject.complete();
            }, function (error) {
                progressSubject.complete();
            });
        };
        var this_1 = this;
        for (var _i = 0, portfolios_1 = portfolios; _i < portfolios_1.length; _i++) {
            var portfolio = portfolios_1[_i];
            _loop_1(portfolio);
        }
        return progressSubject.asObservable().subscribe();
    };
    SnbcapitalPositionsService.prototype.onQuotes = function (quotes) {
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
    SnbcapitalPositionsService.prototype.onQuoteUpdate = function (symbol) {
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
    SnbcapitalPositionsService.prototype.isPositionsLoaded = function () {
        return this.positions != null;
    };
    SnbcapitalPositionsService.prototype.updatePositions = function () {
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
    SnbcapitalPositionsService.prototype.subscribePositions = function () {
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
    SnbcapitalPositionsService.prototype.unsubscribePositions = function () {
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
    SnbcapitalPositionsService.prototype.updatePosition = function (position) {
        position.currentPrice = this.quotes.data[position.symbol].last;
        position.currentTotalCost = position.currentPrice * position.quantity;
        position.costDiff = position.totalCost - position.currentTotalCost;
        position.costDiffPercent = ((position.totalCost - position.currentTotalCost) / position.totalCost) * 100;
    };
    SnbcapitalPositionsService.prototype.loadPositions = function (portfolio) {
        var _this = this;
        return this.snbcapitalLoaderService.getPositions(portfolio).pipe(map(function (response) { return _this.snbcapitalService.onResponse(response); }), map(function (response) { return _this.mapPositions(response); }));
    };
    SnbcapitalPositionsService.prototype.mapPositions = function (response) {
        var positions = [];
        for (var _i = 0, _a = response.holdings; _i < _a.length; _i++) {
            var holding = _a[_i];
            for (var _b = 0, _c = holding.positions; _b < _c.length; _b++) {
                var positionResponse = _c[_b];
                var symbol = positionResponse.strum.secCode + '.TAD';
            }
        }
        return positions;
    };
    SnbcapitalPositionsService.prototype.getCompanyBlockedQuantity = function (portfolioNumber, symbol) {
        if (!this.positions || !this.positions[portfolioNumber]) {
            return 0;
        }
        var companyPosition = this.positions[portfolioNumber].find(function (item) { return item.symbol == symbol; });
        return companyPosition ? companyPosition.blockedQuantity : 0;
    };
    SnbcapitalPositionsService.prototype.getCompanyFreeQuantity = function (portfolioNumber, symbol) {
        if (!this.positions || !this.positions[portfolioNumber]) {
            return 0;
        }
        var companyPosition = this.positions[portfolioNumber].find(function (item) { return item.symbol == symbol; });
        return companyPosition ? companyPosition.freeQuantity : 0;
    };
    SnbcapitalPositionsService.prototype.getPositions = function () {
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
    SnbcapitalPositionsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [SnbcapitalService,
            SnbcapitalLoaderService,
            QuoteService,
            SnbcapitalErrorService])
    ], SnbcapitalPositionsService);
    return SnbcapitalPositionsService;
}());
export { SnbcapitalPositionsService };
//# sourceMappingURL=snbcapital-positions.service.js.map