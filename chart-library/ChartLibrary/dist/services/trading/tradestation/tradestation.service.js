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
import { TradestationLoaderService } from '../../loader/trading/tradestation';
import { TradestationStateService } from '../../state/trading/tradestation';
import { Tc } from '../../../utils';
import { TradestationHttpClientService } from './tradestation.http-client-service';
import { TradestationClientService } from './tradestation-client-service';
import { TradestationLogoutService } from './tradestation-logout-service';
import { LoaderConfig, LoaderUrlType } from '../../loader';
import { TradestationAccountsService } from './tradestation-accounts-service';
var TradestationService = (function () {
    function TradestationService(tradestationLoaderService, tradestationLogoutService, tradestationClientService, tradestationStateService, tradestationAccountsService, tradestationHttpClientService) {
        this.tradestationLoaderService = tradestationLoaderService;
        this.tradestationLogoutService = tradestationLogoutService;
        this.tradestationClientService = tradestationClientService;
        this.tradestationStateService = tradestationStateService;
        this.tradestationAccountsService = tradestationAccountsService;
        this.tradestationHttpClientService = tradestationHttpClientService;
        this.isReadyMarketsManager = false;
        this.isOAuthWindowListenerStarted = false;
    }
    TradestationService.prototype.onLoaderConfig = function (loaderConfig) {
        this.tradestationIntegrationLink = LoaderConfig.url(loaderConfig, LoaderUrlType.TradestationIntegrationLink);
    };
    TradestationService.prototype.autoRefresh = function () {
        var _this = this;
        Tc.assert(this.timerId == null, "already auto-refresh timer is set");
        this.timerId = window.setInterval(function () {
            _this.loadTradestationData();
        }, 5 * 1000);
    };
    TradestationService.prototype.clearRefreshTimer = function () {
        window.clearInterval(this.timerId);
        this.timerId = null;
    };
    TradestationService.prototype.reSetRefreshTimer = function () {
        this.autoRefresh();
    };
    TradestationService.prototype.startOauthWindowListener = function () {
        var _this = this;
        window.addEventListener('message', function (event) {
            var code = event.data;
            if (code) {
                _this.tradestationLoaderService.getAccessToken(code).subscribe(function (response) {
                    if (response.access_token) {
                        _this.tradestationStateService.setTradestationToken(response.access_token);
                        _this.tradestationStateService.setTradestationUserId(response.userid);
                        _this.tradestationStateService.setTradestationRefreshToken(response.refresh_token);
                        _this.tradestationStateService.enableTradestationSession();
                        _this.loadTradestationData(true);
                    }
                });
            }
        });
    };
    TradestationService.prototype.getToken = function () {
        return this.tradestationStateService.getTradestationToken();
    };
    TradestationService.prototype.activate = function () {
        if (this.getToken() && this.getValidSession()) {
            this.loadTradestationData();
        }
        else {
            this.tradestationLogoutService.showLogInPage();
        }
    };
    TradestationService.prototype.tradestationConnection = function (accountType) {
        if (!this.isOAuthWindowListenerStarted) {
            this.isOAuthWindowListenerStarted = true;
            this.startOauthWindowListener();
        }
        this.tradestationStateService.setTradestationAccountType(accountType);
        window.open(this.tradestationLoaderService.getLogInPageLink(), '_blank');
    };
    TradestationService.prototype.loadTradestationData = function (callIntegrationLink) {
        if (callIntegrationLink === void 0) { callIntegrationLink = false; }
        if (this.isReadyMarketsManager && this.getValidSession()) {
            this.tradestationAccountsService.loadAccountsData(callIntegrationLink, this.tradestationIntegrationLink);
        }
    };
    TradestationService.prototype.deactiveTradestation = function () {
        this.tradestationStateService.reset();
        this.tradestationAccountsService.deActivateSessionStream();
    };
    TradestationService.prototype.isSupportedMarket = function () {
        return true;
    };
    TradestationService.prototype.getValidSession = function () {
        return this.tradestationStateService.isValidTradestationSession();
    };
    TradestationService.prototype.ngOnDestroy = function () {
        if (this.timerId) {
            this.clearRefreshTimer();
        }
    };
    TradestationService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [TradestationLoaderService,
            TradestationLogoutService,
            TradestationClientService,
            TradestationStateService,
            TradestationAccountsService,
            TradestationHttpClientService])
    ], TradestationService);
    return TradestationService;
}());
export { TradestationService };
//# sourceMappingURL=tradestation.service.js.map