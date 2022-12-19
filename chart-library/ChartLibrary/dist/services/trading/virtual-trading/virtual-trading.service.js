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
import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Tc, TcTracker, } from '../../../utils/';
import { VirtualTradingCurrency } from './virtual-trading-models';
import { VirtualTradingLoader } from '../../loader/trading/virtual-trading/virtual-trading-loader.service';
import { ChannelRequestType, SharedChannel } from '../../shared-channel';
import { Streamer } from '../../streaming/streamer';
import { VirtualTradingNotificationMethods } from '../../notification';
var VirtualTradingService = (function () {
    function VirtualTradingService(virtualTradingLoaderService, sharedChannel, streamer) {
        this.virtualTradingLoaderService = virtualTradingLoaderService;
        this.sharedChannel = sharedChannel;
        this.streamer = streamer;
        this.account = null;
        this.accountStream = new BehaviorSubject(null);
    }
    VirtualTradingService.prototype.login = function () {
        return this.virtualTradingLoaderService.login(null, null);
    };
    VirtualTradingService.prototype.loadAccount = function () {
        var _this = this;
        return this.virtualTradingLoaderService.getAccounts().pipe(map(function (accounts) {
            if (accounts.length == 0) {
                return null;
            }
            Tc.assert(accounts.length == 1, "multi vt accounts exist");
            _this.account = accounts[0];
            return accounts[0];
        }));
    };
    VirtualTradingService.prototype.createVirtualTradingAccount = function (capital, commission, currency, name, language) {
        var _this = this;
        return this.virtualTradingLoaderService.createVirtualTradingAccount(capital, commission, currency, name, language).pipe(map(function () {
            _this.loadAccount().subscribe(function () {
                Tc.assert(_this.account != null, "account must be created");
                _this.virtualTradingLoaderService.setNotificationMethods(_this.account.id, new VirtualTradingNotificationMethods()).subscribe();
                _this.onConnectToVirtualTrading();
            });
            return null;
        }));
    };
    VirtualTradingService.prototype.deleteVirtualTradingAccount = function () {
        return this.virtualTradingLoaderService.deleteVirtualTradingAccount(this.account.id);
    };
    VirtualTradingService.prototype.updateAccountName = function (name) {
        var _this = this;
        return this.virtualTradingLoaderService.updateAccountName(this.account.id, name).pipe(tap(function () { return _this.refreshState(); }));
    };
    VirtualTradingService.prototype.updateAccountCommission = function (commission) {
        var _this = this;
        return this.virtualTradingLoaderService.updateAccountCommission(this.account.id, commission).pipe(tap(function () { return _this.refreshState(); }));
    };
    VirtualTradingService.prototype.updateAccountCapital = function (action, amount, date) {
        var _this = this;
        return this.virtualTradingLoaderService.updateAccountCapital(this.account.id, action, amount, date).pipe(tap(function () { return _this.refreshState(); }));
    };
    VirtualTradingService.prototype.getAccountTransactions = function () {
        return this.virtualTradingLoaderService.getAccountTransactions(this.account.id);
    };
    VirtualTradingService.prototype.refreshState = function () {
        var _this = this;
        this.loadAccount().subscribe(function (account) {
            _this.accountStream.next(account);
        });
    };
    VirtualTradingService.prototype.activateSettings = function () {
        var _this = this;
        this.login().subscribe(function () {
            TcTracker.trackConnectedToVirtualTrading();
            _this.loadAccount().subscribe(function () {
                _this.connect();
                _this.streamer.getGeneralPurposeStreamer().subscribeVirtualTrading(null);
            });
        });
    };
    VirtualTradingService.prototype.getAccount = function () {
        return this.account;
    };
    VirtualTradingService.prototype.setNotificationMethods = function (methods) {
        var _this = this;
        return this.virtualTradingLoaderService.setNotificationMethods(this.account.id, methods).pipe(tap(function () { return _this.refreshState(); }));
    };
    VirtualTradingService.prototype.onConnectToVirtualTrading = function () {
        this.accountStream.next(this.account);
    };
    VirtualTradingService.prototype.disconnectFromVirtualTrading = function () {
        this.accountStream.next(null);
    };
    VirtualTradingService.prototype.getAccountStream = function () {
        return this.accountStream;
    };
    VirtualTradingService.prototype.connect = function () {
        if (this.account) {
            this.onConnectToVirtualTrading();
        }
        else {
            var channelRequest = {
                type: ChannelRequestType.VirtualTradingConnect,
                resetMode: false
            };
            this.sharedChannel.request(channelRequest);
        }
    };
    VirtualTradingService.prototype.isSupportedMarket = function (market) {
        if (market.abbreviation === "FRX") {
            return false;
        }
        return VirtualTradingCurrency.getMarketCurrency(market.abbreviation).code == this.account.currency;
    };
    VirtualTradingService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [VirtualTradingLoader,
            SharedChannel,
            Streamer])
    ], VirtualTradingService);
    return VirtualTradingService;
}());
export { VirtualTradingService };
//# sourceMappingURL=virtual-trading.service.js.map