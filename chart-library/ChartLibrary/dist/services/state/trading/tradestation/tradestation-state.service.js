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
import { TradestationAccountType } from '../../../trading/tradestation/tradestation-account-type';
var TradestationStateService = (function () {
    function TradestationStateService() {
        if (localStorage.getItem(TradestationStateService_1.STORAGE_KEY)) {
            this.storageData = JSON.parse(localStorage.getItem(TradestationStateService_1.STORAGE_KEY));
        }
        else {
            this.storageData = {
                token: null,
                validSession: false,
                accountKeys: null,
                defaultAccount: null,
                userId: null,
                refreshToken: null,
                accountType: TradestationAccountType.NONE
            };
        }
    }
    TradestationStateService_1 = TradestationStateService;
    TradestationStateService.prototype.reset = function () {
        this.setTradestationToken(null);
        this.setTradestationRefreshToken(null);
        this.setTradestationAccountKeys([]);
        this.disableTradestationSession();
    };
    TradestationStateService.prototype.getTradestationToken = function () {
        return this.storageData.token;
    };
    TradestationStateService.prototype.setTradestationToken = function (token) {
        this.storageData.token = token;
        this.write();
    };
    TradestationStateService.prototype.getTradestationRefreshToken = function () {
        return this.storageData.refreshToken;
    };
    TradestationStateService.prototype.setTradestationRefreshToken = function (refreshToken) {
        this.storageData.refreshToken = refreshToken;
        this.write();
    };
    TradestationStateService.prototype.getTradestationUserId = function () {
        return this.storageData.userId;
    };
    TradestationStateService.prototype.setTradestationUserId = function (userId) {
        this.storageData.userId = userId;
        this.write();
    };
    TradestationStateService.prototype.getTradestationAccountKeys = function () {
        return this.storageData.accountKeys;
    };
    TradestationStateService.prototype.setTradestationAccountKeys = function (keys) {
        this.storageData.accountKeys = keys.join(',');
        this.write();
    };
    TradestationStateService.prototype.getTradestationDefaultAccount = function () {
        return this.storageData.defaultAccount;
    };
    TradestationStateService.prototype.setTradestationDefaultAccount = function (account) {
        this.storageData.defaultAccount = account;
        this.write();
    };
    TradestationStateService.prototype.getTradestationAccountType = function () {
        return this.storageData.accountType;
    };
    TradestationStateService.prototype.setTradestationAccountType = function (type) {
        this.storageData.accountType = type;
        this.write();
    };
    TradestationStateService.prototype.enableTradestationSession = function () {
        this.storageData.validSession = true;
        this.write();
    };
    TradestationStateService.prototype.disableTradestationSession = function () {
        this.storageData.validSession = false;
        this.write();
    };
    TradestationStateService.prototype.isValidTradestationSession = function () {
        return this.storageData.validSession;
    };
    TradestationStateService.prototype.write = function () {
        localStorage[TradestationStateService_1.STORAGE_KEY] = JSON.stringify(this.storageData);
    };
    var TradestationStateService_1;
    TradestationStateService.STORAGE_KEY = 'TC_TRADESTATION';
    TradestationStateService = TradestationStateService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], TradestationStateService);
    return TradestationStateService;
}());
export { TradestationStateService };
//# sourceMappingURL=tradestation-state.service.js.map