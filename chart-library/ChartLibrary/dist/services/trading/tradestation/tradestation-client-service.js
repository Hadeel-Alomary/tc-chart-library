var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { TradestationAccountType } from './tradestation-account-type';
import { TradestationStateService } from '../../state/trading/tradestation';
import { Injectable } from '@angular/core';
var TradestationClientService = (function () {
    function TradestationClientService(tradestationStateService) {
        this.tradestationStateService = tradestationStateService;
    }
    TradestationClientService.prototype.getBaseUrl = function () {
        return this.tradestationStateService.getTradestationAccountType() == TradestationAccountType.DEMO ? 'https://sim-api.tradestation.com/v2' : 'https://api.tradestation.com/v2';
    };
    TradestationClientService.prototype.getClientId = function () {
        return '6BC54EDE-1356-4DC1-B8A5-6095467CBDBB';
    };
    TradestationClientService.prototype.getClientSecret = function () {
        return '8fd64de1eea505d84a1369d2e330fb871d7c';
    };
    TradestationClientService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [TradestationStateService])
    ], TradestationClientService);
    return TradestationClientService;
}());
export { TradestationClientService };
//# sourceMappingURL=tradestation-client-service.js.map