var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { QuoteService } from '../../quote';
import { VirtualTradingLoader } from '../../loader/trading/virtual-trading';
import { VirtualTradingService } from './virtual-trading.service';
import { SharedChannel } from '../../shared-channel';
import { Subject } from 'rxjs/internal/Subject';
var VirtualTradingPositionsService = (function () {
    function VirtualTradingPositionsService(quoteService, sharedChannel, virtualTradingService, virtualTradingLoaderService) {
        var _this = this;
        this.quoteService = quoteService;
        this.sharedChannel = sharedChannel;
        this.virtualTradingService = virtualTradingService;
        this.virtualTradingLoaderService = virtualTradingLoaderService;
        this.positions = [];
        this.positionsStream = new BehaviorSubject(null);
        this.positionsLoadedStream = new Subject();
        this.quoteService.getSnapshotStream()
            .subscribe(function (quotes) { return _this.onQuotes(quotes); });
        this.quoteService.getUpdateStream()
            .subscribe(function (symbol) { return _this.onQuoteUpdate(symbol); });
        this.virtualTradingService.getAccountStream().subscribe(function (account) {
            if (account != null) {
                _this.loadPositions();
            }
            else {
                _this.clearPositions();
            }
        });
    }
    VirtualTradingPositionsService.prototype.getPositionsStream = function () {
        return this.positionsStream;
    };
    VirtualTradingPositionsService.prototype.getPositionsLoadedStream = function () {
        return this.positionsLoadedStream;
    };
    VirtualTradingPositionsService.prototype.clearPositions = function () {
        this.positionsStream.next([]);
        this.unsubscribePositions();
        this.positions = [];
    };
    VirtualTradingPositionsService.prototype.loadPositions = function () {
        var _this = this;
        this.virtualTradingLoaderService.getPositions(this.virtualTradingService.getAccount().id)
            .subscribe(function (positions) {
            _this.positions = positions;
            _this.updatePositions();
            _this.subscribePositions();
            _this.positionsStream.next(positions);
            _this.positionsLoadedStream.next();
        }, function (error) { });
    };
    VirtualTradingPositionsService.prototype.subscribePositions = function () {
        if (!this.quotes) {
            return;
        }
        var positionSymbols = [];
        for (var _i = 0, _a = this.positions; _i < _a.length; _i++) {
            var position = _a[_i];
            positionSymbols.push(position.symbol);
        }
        this.quoteService.subscribeQuotes(positionSymbols);
    };
    VirtualTradingPositionsService.prototype.unsubscribePositions = function () {
        if (!this.quotes) {
            return;
        }
        var positionSymbols = [];
        for (var _i = 0, _a = this.positions; _i < _a.length; _i++) {
            var position = _a[_i];
            positionSymbols.push(position.symbol);
        }
        this.quoteService.unSubscribeQuotes(positionSymbols);
    };
    VirtualTradingPositionsService.prototype.updatePositions = function () {
        if (!this.quotes) {
            return;
        }
        for (var _i = 0, _a = this.positions; _i < _a.length; _i++) {
            var position = _a[_i];
            this.updatePosition(position);
        }
    };
    VirtualTradingPositionsService.prototype.onQuotes = function (quotes) {
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
    VirtualTradingPositionsService.prototype.onQuoteUpdate = function (symbol) {
        if (!this.isPositionsLoaded()) {
            return;
        }
        if (this.quotes.data[symbol].changeSet.indexOf('last') == -1) {
            return;
        }
        var index = this.positions.findIndex(function (position) { return position.symbol == symbol; });
        var needUpdatePositions = index !== -1;
        if (needUpdatePositions) {
            this.updatePosition(this.positions[index]);
            this.positionsStream.next(this.positions);
        }
    };
    VirtualTradingPositionsService.prototype.isPositionsLoaded = function () {
        return this.positions != null && this.positions.length != 0;
    };
    VirtualTradingPositionsService.prototype.updatePosition = function (position) {
        position.currentPrice = this.quotes.data[position.symbol].last;
        position.currentTotalCost = position.currentPrice * position.quantity;
        position.costDiff = position.totalCost - position.currentTotalCost;
    };
    VirtualTradingPositionsService.prototype.getCompanyFreeQuantity = function (symbol) {
        if (!this.positions) {
            return 0;
        }
        var companyPosition = this.positions.find(function (item) { return item.symbol == symbol; });
        return companyPosition ? companyPosition.freeQuantity : 0;
    };
    VirtualTradingPositionsService.prototype.getCompanyTotalQuantity = function (symbol) {
        if (!this.positions) {
            return 0;
        }
        var companyPosition = this.positions.find(function (item) { return item.symbol == symbol; });
        return companyPosition ? companyPosition.quantity : 0;
    };
    VirtualTradingPositionsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [QuoteService,
            SharedChannel,
            VirtualTradingService,
            VirtualTradingLoader])
    ], VirtualTradingPositionsService);
    return VirtualTradingPositionsService;
}());
export { VirtualTradingPositionsService };
//# sourceMappingURL=virtual-trading-positions.service.js.map