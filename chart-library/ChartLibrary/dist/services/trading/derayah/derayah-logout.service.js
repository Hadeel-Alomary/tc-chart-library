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
import { Subject } from 'rxjs';
import { ChannelRequestType, SharedChannel } from '../../shared-channel';
import { DerayahStateService } from '../../state/trading/derayah';
var DerayahLogoutService = (function () {
    function DerayahLogoutService(sharedChannel, derayahStateService) {
        this.sharedChannel = sharedChannel;
        this.derayahStateService = derayahStateService;
        this.logoutStream = new Subject();
    }
    DerayahLogoutService.prototype.getLogoutStream = function () {
        return this.logoutStream;
    };
    DerayahLogoutService.prototype.validateLoginSession = function (cbOnValidLoginSession) {
        var _this = this;
        if (!this.getValidSession()) {
            window.setTimeout(function () { return _this.onLogout(); }, 0);
        }
        else {
            cbOnValidLoginSession();
        }
    };
    DerayahLogoutService.prototype.getValidSession = function () {
        return this.derayahStateService.isValidDerayahSession();
    };
    DerayahLogoutService.prototype.onLogout = function () {
        this.logoutStream.next(true);
        this.showLogInPage(true);
    };
    DerayahLogoutService.prototype.showLogInPage = function (isReconnectMode) {
        var request = { type: ChannelRequestType.DerayahConnect, isReconnectMode: isReconnectMode };
        this.sharedChannel.request(request);
    };
    DerayahLogoutService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [SharedChannel, DerayahStateService])
    ], DerayahLogoutService);
    return DerayahLogoutService;
}());
export { DerayahLogoutService };
//# sourceMappingURL=derayah-logout.service.js.map