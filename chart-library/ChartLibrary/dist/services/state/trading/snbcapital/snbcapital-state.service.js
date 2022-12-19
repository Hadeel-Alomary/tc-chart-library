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
var SnbcapitalStateService = (function () {
    function SnbcapitalStateService() {
        if (localStorage.getItem(SnbcapitalStateService_1.STORAGE_KEY)) {
            this.storageData = JSON.parse(localStorage.getItem(SnbcapitalStateService_1.STORAGE_KEY));
        }
        else {
            this.storageData = {
                snbcapitalUserName: null,
                basicUrl: null,
                validSession: false,
                buySellPortfolioId: null,
                message: null,
            };
        }
    }
    SnbcapitalStateService_1 = SnbcapitalStateService;
    SnbcapitalStateService.prototype.reset = function () {
        this.disableSnbcapitalSession();
    };
    SnbcapitalStateService.prototype.getSnbcapitalUserName = function () {
        return this.storageData.snbcapitalUserName;
    };
    SnbcapitalStateService.prototype.setSnbcapitalUserName = function (value) {
        this.storageData.snbcapitalUserName = value;
        this.write();
    };
    SnbcapitalStateService.prototype.enableSnbcapitalSession = function () {
        this.storageData.validSession = true;
        this.write();
    };
    SnbcapitalStateService.prototype.disableSnbcapitalSession = function () {
        this.storageData.validSession = false;
        this.write();
    };
    SnbcapitalStateService.prototype.isValidSnbcapitalSession = function () {
        return this.storageData.validSession;
    };
    SnbcapitalStateService.prototype.setSelectedBuySellPortfolioId = function (portfolioId) {
        this.storageData.buySellPortfolioId = portfolioId;
        this.write();
    };
    SnbcapitalStateService.prototype.getSessionExpiredMessage = function () {
        return this.storageData.message;
    };
    SnbcapitalStateService.prototype.setSessionExpiredMessage = function (sessionExpiredMessage) {
        this.storageData.message = sessionExpiredMessage;
        this.write();
    };
    SnbcapitalStateService.prototype.getSelectedBuySellPortfolioId = function () {
        return this.storageData.buySellPortfolioId;
    };
    SnbcapitalStateService.prototype.write = function () {
        localStorage[SnbcapitalStateService_1.STORAGE_KEY] = JSON.stringify(this.storageData);
    };
    var SnbcapitalStateService_1;
    SnbcapitalStateService.STORAGE_KEY = 'TC_SNBCAPITAL';
    SnbcapitalStateService = SnbcapitalStateService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], SnbcapitalStateService);
    return SnbcapitalStateService;
}());
export { SnbcapitalStateService };
//# sourceMappingURL=snbcapital-state.service.js.map