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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MarketUtils } from '../../../../utils';
import { TradestationOrder, TradestationOrderExpiration } from '../../../trading/tradestation/tradestation-order';
import { TradestationHttpClientService } from '../../../trading/tradestation/tradestation.http-client-service';
import { TradestationClientService } from '../../../trading/tradestation/tradestation-client-service';
import { TradestationStateService } from '../../../state/trading/tradestation';
import { TcUrlUtils } from '../../../../utils/tc.url.utils';
var TradestationLoaderService = (function () {
    function TradestationLoaderService(http, tradestationClient, tradestationHttpClientService, tradestationStateService) {
        this.http = http;
        this.tradestationClient = tradestationClient;
        this.tradestationHttpClientService = tradestationHttpClientService;
        this.tradestationStateService = tradestationStateService;
    }
    TradestationLoaderService.prototype.getBaseUrl = function () {
        return this.tradestationClient.getBaseUrl();
    };
    TradestationLoaderService.prototype.getAccountKey = function () {
        return this.tradestationStateService.getTradestationAccountKeys();
    };
    TradestationLoaderService.prototype.getRedirectUrl = function () {
        return document.location.protocol + "//" + document.location.host + '/m/tradestation/oauth/redirect';
    };
    TradestationLoaderService.prototype.getLogInPageLink = function () {
        return "".concat(this.getBaseUrl(), "/authorize/?redirect_uri=").concat(this.getRedirectUrl(), "&client_id=").concat(this.tradestationClient.getClientId(), "&response_type=code");
    };
    TradestationLoaderService.prototype.getAccessToken = function (oauthCode) {
        var headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        var url = "".concat(this.getBaseUrl(), "/security/authorize");
        var data = "code=".concat(oauthCode, "&redirect_uri=").concat(this.getRedirectUrl(), "&client_id=").concat(this.tradestationClient.getClientId(), "&client_secret=").concat(this.tradestationClient.getClientSecret(), "&grant_type=authorization_code");
        return this.http.post(url, data, headers);
    };
    TradestationLoaderService.prototype.callTradestationIntegrationLink = function (basicUrl, numberOfAccounts) {
        var username = null;
        var version = null;
        return this.http.post(TcUrlUtils.url(basicUrl + "?version=web_".concat(version)), { user_name: username, p1: numberOfAccounts }).pipe(map(function () { }));
    };
    TradestationLoaderService.prototype.getAccounts = function (user_id) {
        var url = "".concat(this.getBaseUrl(), "/users/").concat(user_id, "/accounts");
        return this.tradestationHttpClientService.getWithAuth(url).pipe(map(function (response) { return response; }));
    };
    TradestationLoaderService.prototype.getOrders = function () {
        var oneMonth = moment(new Date(), 'YYYY-MM-DD').subtract(1, 'months').format('MM-DD-YYYY');
        var url = "".concat(this.getBaseUrl(), "/accounts/").concat(this.getAccountKey(), "/orders?since=").concat(oneMonth);
        return this.tradestationHttpClientService.getWithAuth(url).pipe(map(function (response) { return response; }));
    };
    TradestationLoaderService.prototype.getPositions = function () {
        var url = "".concat(this.getBaseUrl(), "/accounts/").concat(this.getAccountKey(), "/positions");
        return this.tradestationHttpClientService.getWithAuth(url).pipe(map(function (response) { return response; }));
    };
    TradestationLoaderService.prototype.getBalances = function () {
        var url = "".concat(this.getBaseUrl(), "/accounts/").concat(this.getAccountKey(), "/balances");
        return this.tradestationHttpClientService.getWithAuth(url).pipe(map(function (response) { return response; }));
    };
    TradestationLoaderService.prototype.getOrderConfirmation = function (order, osoOrders, accountKey) {
        var url = "".concat(this.getBaseUrl(), "/orders/confirm");
        var body = this.getOrderHttpBody(order, accountKey);
        if (osoOrders.length > 0) {
            body.OSOs = this.getOsoOrders(osoOrders, accountKey);
        }
        return this.tradestationHttpClientService.postWithAuth(url, body).pipe(map(function (response) { return response; }));
    };
    TradestationLoaderService.prototype.postOrder = function (order, osoOrders, accountKey) {
        var url = "".concat(this.getBaseUrl(), "/orders");
        var body = this.getOrderHttpBody(order, accountKey);
        if (osoOrders.length > 0) {
            body.OSOs = this.getOsoOrders(osoOrders, accountKey);
        }
        return this.tradestationHttpClientService.postWithAuth(url, body).pipe(map(function (response) { return response; }));
    };
    TradestationLoaderService.prototype.updateOrder = function (order) {
        var url = "".concat(this.getBaseUrl(), "/orders/").concat(order.id);
        var body = {
            OrderType: order.type,
            Quantity: order.quantity,
            Symbol: MarketUtils.symbolWithoutMarket(order.symbol)
        };
        if (TradestationOrder.isLimitOrder(order) || TradestationOrder.isStopLimit(order)) {
            body.LimitPrice = order.price;
        }
        if (TradestationOrder.isStopOrder(order)) {
            if (order.trailingAmount) {
                body.AdvancedOptions = { TrailingStop: { Amount: order.trailingAmount } };
            }
            else if (order.trailingPercent) {
                body.AdvancedOptions = { TrailingStop: { Percent: order.trailingPercent } };
            }
            body.stopPrice = order.stopPrice;
        }
        return this.tradestationHttpClientService.putWithAuth(url, body).pipe(map(function (response) { return response; }));
    };
    TradestationLoaderService.prototype.getOrderHttpBody = function (order, accountKey) {
        var expirationType = order.expirationType.type;
        var exType = expirationType.indexOf('+');
        if (exType != -1) {
            expirationType = TradestationOrderExpiration.convertExpirationType(expirationType);
        }
        var type = order.type;
        var postOrderBody = {
            AccountKey: accountKey.toString(),
            AssetType: 'EQ',
            Duration: expirationType,
            OrderType: type,
            Quantity: order.quantity,
            Route: order.routing.value,
            Symbol: MarketUtils.symbolWithoutMarket(order.symbol),
            TradeAction: order.side.value.replace(/ /g, '').toUpperCase(),
            TriggeredBy: null
        };
        if (order.confirmationId) {
            postOrderBody.orderConfrimId = order.confirmationId;
        }
        if (order.tillDate) {
            postOrderBody.GTDDate = moment(order.tillDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
        }
        if (TradestationOrder.isLimitOrder(order) || TradestationOrder.isStopLimit(order)) {
            postOrderBody.LimitPrice = order.price;
        }
        if (TradestationOrder.isStopOrder(order)) {
            if (order.trailingAmount) {
                postOrderBody.AdvancedOptions = { TrailingStop: { Amount: order.trailingAmount } };
            }
            else if (order.trailingPercent) {
                postOrderBody.AdvancedOptions = { TrailingStop: { Percent: order.trailingPercent } };
            }
            else {
                postOrderBody.stopPrice = order.stopPrice;
            }
        }
        return postOrderBody;
    };
    TradestationLoaderService.prototype.getOsoOrders = function (osoOrders, accountKey) {
        var httpOsoOrders = [];
        var oso = [];
        for (var _i = 0, osoOrders_1 = osoOrders; _i < osoOrders_1.length; _i++) {
            var osoOrder = osoOrders_1[_i];
            httpOsoOrders.push(this.getOrderHttpBody(osoOrder, accountKey));
        }
        oso.push({ Type: 'NORMAL', Orders: httpOsoOrders });
        return oso;
    };
    TradestationLoaderService.prototype.deleteOrder = function (orderId) {
        var url = "".concat(this.getBaseUrl(), "/orders/").concat(orderId);
        return this.tradestationHttpClientService.deleteWithAuth(url).pipe(map(function (response) { return response; }));
    };
    TradestationLoaderService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, TradestationClientService, TradestationHttpClientService,
            TradestationStateService])
    ], TradestationLoaderService);
    return TradestationLoaderService;
}());
export { TradestationLoaderService };
//# sourceMappingURL=tradestation-loader.service.js.map