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
var DerayahStateService = (function () {
    function DerayahStateService() {
        if (localStorage.getItem(DerayahStateService_1.STORAGE_KEY)) {
            this.storageData = JSON.parse(localStorage.getItem(DerayahStateService_1.STORAGE_KEY));
        }
        else {
            this.storageData = {
                token: null,
                portfolios: [],
                portfoliosQueue: [],
                validSession: false,
                refreshToken: null
            };
        }
    }
    DerayahStateService_1 = DerayahStateService;
    DerayahStateService.prototype.reset = function () {
        this.setDerayahToken(null);
        this.setDerayahRefreshToken(null);
        this.setDerayahPortfolios(null);
        this.setDerayahPortfoliosQueue(null);
        this.disableDerayahSession();
    };
    DerayahStateService.prototype.getDerayahToken = function () {
        return this.storageData.token;
    };
    DerayahStateService.prototype.setDerayahToken = function (token) {
        this.storageData.token = token;
        this.write();
    };
    DerayahStateService.prototype.getDerayahRefreshToken = function () {
        return this.storageData.refreshToken;
    };
    DerayahStateService.prototype.setDerayahRefreshToken = function (refreshToken) {
        this.storageData.refreshToken = refreshToken;
        this.write();
    };
    DerayahStateService.prototype.getDerayahPortfolios = function () {
        return this.storageData.portfolios;
    };
    DerayahStateService.prototype.setDerayahPortfolios = function (portfolios) {
        this.storageData.portfolios = portfolios;
        this.write();
    };
    DerayahStateService.prototype.getDerayahPortfoliosQueue = function () {
        return this.storageData.portfoliosQueue;
    };
    DerayahStateService.prototype.setDerayahPortfoliosQueue = function (portfoliosQueue) {
        this.storageData.portfoliosQueue = portfoliosQueue;
        this.write();
    };
    DerayahStateService.prototype.enableDerayahSession = function () {
        this.storageData.validSession = true;
        this.write();
    };
    DerayahStateService.prototype.disableDerayahSession = function () {
        this.storageData.validSession = false;
        this.write();
    };
    DerayahStateService.prototype.isValidDerayahSession = function () {
        return this.storageData.validSession;
    };
    DerayahStateService.prototype.write = function () {
        localStorage[DerayahStateService_1.STORAGE_KEY] = JSON.stringify(this.storageData);
    };
    var DerayahStateService_1;
    DerayahStateService.STORAGE_KEY = 'TC_DERAYAH';
    DerayahStateService = DerayahStateService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], DerayahStateService);
    return DerayahStateService;
}());
export { DerayahStateService };
//# sourceMappingURL=derayah-state.service.js.map