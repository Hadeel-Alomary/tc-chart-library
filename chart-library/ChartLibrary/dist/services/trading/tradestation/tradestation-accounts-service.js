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
import { TradestationAccount } from './tradestation-accounts/tradestation-account';
import { Subject } from 'rxjs';
import { TradestationLoaderService } from '../../loader/trading/tradestation/tradestation-loader.service';
import { TradestationStateService } from '../../state/trading/tradestation/tradestation-state.service';
var TradestationAccountsService = (function () {
    function TradestationAccountsService(tradestationStateService, tradestationLoaderService) {
        this.tradestationStateService = tradestationStateService;
        this.tradestationLoaderService = tradestationLoaderService;
        this.accounts = [];
        this.accountsKeys = [];
        this.accountsStream = new Subject();
        this.sessionStream = new Subject();
    }
    TradestationAccountsService.prototype.loadAccountsData = function (callIntegrationLink, integrationLink) {
        var _this = this;
        this.tradestationLoaderService.getAccounts(this.getUserId()).subscribe(function (response) {
            if (_this.getValidSession()) {
                _this.handleNeededAccounts(response);
                _this.setTradestationAccountKeys();
                _this.setDefaultAccount(_this.getDefaultAccount());
                if (callIntegrationLink) {
                    _this.callIntegrationLink(integrationLink);
                }
                _this.sessionStream.next(true);
                _this.accountsStream.next(_this.accounts);
            }
        });
    };
    TradestationAccountsService.prototype.callIntegrationLink = function (integrationLink) {
        this.tradestationLoaderService.callTradestationIntegrationLink(integrationLink, this.accounts.length)
            .subscribe(function () { }, function (error) { });
    };
    TradestationAccountsService.prototype.getUserId = function () {
        return this.tradestationStateService.getTradestationUserId();
    };
    TradestationAccountsService.prototype.getValidSession = function () {
        return this.tradestationStateService.isValidTradestationSession();
    };
    TradestationAccountsService.prototype.handleNeededAccounts = function (accountsResponse) {
        var neededAccounts = [];
        var accountsKeys = [];
        accountsResponse.forEach(function (account) {
            var tradestationAccount = TradestationAccount.mapResponseToTradestationAccount(account);
            if (account.Type == 'M' || account.Type == 'C') {
                neededAccounts.push(tradestationAccount);
                accountsKeys.push(tradestationAccount.key);
            }
        });
        this.accounts = neededAccounts;
        this.accountsKeys = accountsKeys;
    };
    TradestationAccountsService.prototype.setTradestationAccountKeys = function () {
        this.tradestationStateService.setTradestationAccountKeys(this.accountsKeys);
    };
    TradestationAccountsService.prototype.getDefaultAccount = function () {
        var defaultAccount = this.tradestationStateService.getTradestationDefaultAccount();
        if (defaultAccount) {
            var isStillValidAccount = this.accounts.find(function (account) { return account.key == defaultAccount.key; });
            if (isStillValidAccount) {
                return defaultAccount;
            }
        }
        return this.accounts[0];
    };
    TradestationAccountsService.prototype.getAccounts = function () {
        return this.accounts;
    };
    TradestationAccountsService.prototype.getAccountStream = function () {
        return this.accountsStream;
    };
    TradestationAccountsService.prototype.getSessionStream = function () {
        return this.sessionStream;
    };
    TradestationAccountsService.prototype.deActivateSessionStream = function () {
        this.sessionStream.next(false);
    };
    TradestationAccountsService.prototype.setDefaultAccount = function (account) {
        this.tradestationStateService.setTradestationDefaultAccount(account);
    };
    TradestationAccountsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [TradestationStateService, TradestationLoaderService])
    ], TradestationAccountsService);
    return TradestationAccountsService;
}());
export { TradestationAccountsService };
//# sourceMappingURL=tradestation-accounts-service.js.map