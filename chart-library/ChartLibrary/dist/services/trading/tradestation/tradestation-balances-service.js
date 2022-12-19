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
import { TradestationService } from './tradestation.service';
import { TradestationBalance } from './tradestation-balance/tradestation-balance';
import { BehaviorSubject } from 'rxjs';
import { TradestationLoaderService } from '../../loader/trading/tradestation/tradestation-loader.service';
import { TradestationStateService } from '../../state/trading/tradestation';
import { map } from 'rxjs/operators';
import { TradestationAccountsService } from './tradestation-accounts-service';
var TradestationBalancesService = (function () {
    function TradestationBalancesService(tradestationService, tradestationLoaderService, tradestationStateService, tradestationAccountsService) {
        var _this = this;
        this.tradestationService = tradestationService;
        this.tradestationLoaderService = tradestationLoaderService;
        this.tradestationStateService = tradestationStateService;
        this.tradestationAccountsService = tradestationAccountsService;
        this.balances = [];
        this.balancesStream = new BehaviorSubject([]);
        this.tradestationAccountsService.getAccountStream().subscribe(function () {
            _this.refreshBalances();
        });
    }
    TradestationBalancesService.prototype.refreshBalances = function () {
        var _this = this;
        this.getBalances().subscribe(function (response) { return _this.onBalances(response); });
    };
    TradestationBalancesService.prototype.getBalances = function () {
        var _this = this;
        return this.tradestationLoaderService.getBalances().pipe(map(function (response) { return _this.mapBalances(response); }));
    };
    TradestationBalancesService.prototype.mapBalances = function (response) {
        if (response.length == 0)
            return null;
        var tradestationBalance = [];
        var market = null;
        response.forEach(function (res) {
            var balance = TradestationBalance.mapResponseToTradestationBalance(res, market);
            tradestationBalance.push(balance);
        });
        return tradestationBalance;
    };
    TradestationBalancesService.prototype.onBalances = function (response) {
        this.balances = response;
        this.balancesStream.next(this.balances);
    };
    TradestationBalancesService.prototype.getAccountBalance = function (account) {
        var balance = this.balances.find(function (balance) { return balance.name == account.name; });
        return balance;
    };
    TradestationBalancesService.prototype.getBalancesStream = function () {
        return this.balancesStream;
    };
    TradestationBalancesService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [TradestationService, TradestationLoaderService, TradestationStateService,
            TradestationAccountsService])
    ], TradestationBalancesService);
    return TradestationBalancesService;
}());
export { TradestationBalancesService };
//# sourceMappingURL=tradestation-balances-service.js.map