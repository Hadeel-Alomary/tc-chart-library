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
import { ChannelRequestType, SharedChannel } from '../../shared-channel';
import { Subject } from 'rxjs';
import { TradestationStateService } from '../../state/trading/tradestation';
var TradestationLogoutService = (function () {
    function TradestationLogoutService(sharedChannel, tradestationStateService) {
        this.sharedChannel = sharedChannel;
        this.tradestationStateService = tradestationStateService;
        this.cancelBrokerSelectionStream = new Subject();
        this.logoutStream = new Subject();
    }
    TradestationLogoutService.prototype.getLogoutStream = function () {
        return this.logoutStream;
    };
    TradestationLogoutService.prototype.onLogout = function () {
        this.logoutStream.next(true);
        this.showLogInPage();
    };
    TradestationLogoutService.prototype.showLogInPage = function () {
        var request = { type: ChannelRequestType.TradestationConnect, caller: this };
        this.sharedChannel.request(request);
    };
    TradestationLogoutService.prototype.getValidSession = function () {
        return this.tradestationStateService.isValidTradestationSession();
    };
    TradestationLogoutService.prototype.validateLoginSession = function (cbOnValidLoginSession) {
        var _this = this;
        if (!this.getValidSession()) {
            window.setTimeout(function () { return _this.onLogout(); }, 0);
        }
        else {
            cbOnValidLoginSession();
        }
    };
    TradestationLogoutService.prototype.getCancelBrokerSelectionStream = function () {
        return this.cancelBrokerSelectionStream;
    };
    TradestationLogoutService.prototype.onCancelConnection = function () {
        this.cancelBrokerSelectionStream.next();
    };
    TradestationLogoutService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [SharedChannel, TradestationStateService])
    ], TradestationLogoutService);
    return TradestationLogoutService;
}());
export { TradestationLogoutService };
//# sourceMappingURL=tradestation-logout-service.js.map