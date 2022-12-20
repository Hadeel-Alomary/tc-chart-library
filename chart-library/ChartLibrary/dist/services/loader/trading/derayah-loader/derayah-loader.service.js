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
import { StringUtils } from '../../../../utils/index';
import { DerayahOrderExecutionType } from '../../../trading/derayah/derayah-order/derayah-order-execution';
import { LanguageService } from '../../../language/index';
import { DerayahClientService } from '../../../trading/derayah/derayah-client.service';
import { DerayahHttpClientService } from '../../../trading/derayah/derayah-http-client.service';
import { map } from 'rxjs/operators';
var DerayahLoaderService = (function () {
    function DerayahLoaderService(http, languageService, derayahClientService, derayahHttpClientService) {
        this.http = http;
        this.languageService = languageService;
        this.derayahClientService = derayahClientService;
        this.derayahHttpClientService = derayahHttpClientService;
    }
    DerayahLoaderService.prototype.getDerayahAuthUrl = function () {
        return null;
    };
    DerayahLoaderService.prototype.getDerayahOauthUrl = function () {
        return null;
    };
    DerayahLoaderService.prototype.getDerayahTokenUrl = function () {
        return null;
    };
    DerayahLoaderService.prototype.getLoginPageLink = function () {
        return this.getDerayahAuthUrl() + "?prompt=login&response_type=code&scope=TradingAPI.All%20offline_access&redirect_uri=" + this.getRedirectUrl() + "&client_id=" + this.derayahClientService.getClientId() + "&_State=" + this.getState() + "&code_challenge=" + this.getCodeChallenge() + "&code_challenge_method=S256&response_mode=query";
    };
    DerayahLoaderService.prototype.getRedirectUrl = function () {
        var redirectUrl = 'https://www.tickerchart.net/m/derayah/oauth/redirect';
        return encodeURIComponent(redirectUrl);
    };
    DerayahLoaderService.prototype.getState = function () {
        return StringUtils.generateRandomString(43);
    };
    DerayahLoaderService.prototype.getCodeChallenge = function () {
        return "slu0OpvNMEKBQF4ezN2TOZTJdm93j-dxenzpedCJgSk";
    };
    DerayahLoaderService.prototype.getAccessToken = function (oauthCode) {
        var data = "code=" + oauthCode + "&redirect_uri=" + this.getRedirectUrl() + "&client_id=" + this.derayahClientService.getClientId() + "&code_verifier=" + this.getCodeVerifier() + "&client_secret=" + this.derayahClientService.getClientSecretId() + "&grant_type=authorization_code";
        return this.http.post(this.getDerayahTokenUrl(), data, this.getTokenHeaders());
    };
    DerayahLoaderService.prototype.getRefreshToken = function (refreshToken) {
        var data = "client_id=" + this.derayahClientService.getClientId() + "&client_secret=" + this.derayahClientService.getClientSecretId() + "&grant_type=refresh_token&refresh_token=" + refreshToken;
        return this.http.post(this.getDerayahTokenUrl(), data, this.getTokenHeaders());
    };
    DerayahLoaderService.prototype.getTokenHeaders = function () {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
    };
    DerayahLoaderService.prototype.getCodeVerifier = function () {
        return "GyADgL4TppPITGmsXXcIlOol8wYhZ4yFfMheNK1WrA8";
    };
    DerayahLoaderService.prototype.callDerayahIntegrationLink = function (portfolioNum) {
        var userName = null;
        var version = null;
        var url = null;
        return this.http.post(url, { user_name: userName, p1: portfolioNum });
    };
    DerayahLoaderService.prototype.addPreConfirm = function (order) {
        var url = this.getDerayahOauthUrl() + "/Order/preconfirmPlace";
        this.logUrl('Derayah add pre confirm url : ', url);
        this.logRequestData('add pre confirm', {
            "portfolio": order.portfolio,
            "exchange-code": order.derayahMarket,
            "symbol": order.derayahSymbol,
            "order-side": order.type.type.toString(),
            "execution-type": order.execution.type.toString(),
            "quantity": order.quantity.toString(),
            "fill-type": "1",
            "min-quantity": null,
            "disclose-quantity": 0,
            "price": order.price.toString(),
            "valid-till": order.expiration.type.toString(),
            "valid-till-date": order.expiration.tillDate
        });
        return this.derayahHttpClientService.postWithAuth(url, this.getPreAddOrUpdateOrder(order, true)).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.addOrder = function (order) {
        var url = this.getDerayahOauthUrl() + "/Order/Place";
        this.logUrl('Derayah new order url : ', url);
        this.logRequestData('add order', {
            'portfolio': order.portfolio,
            'exchange-code': order.derayahMarket,
            'symbol': order.derayahSymbol,
            "order-side": order.type.type.toString(),
            "execution-type": order.execution.type.toString(),
            'quantity': order.quantity.toString(),
            "min-quantity": null,
            'price': order.execution.type == DerayahOrderExecutionType.Limit ? order.price.toString() : '',
            "valid-till": order.expiration.type.toString(),
            'valid-till-date': order.expiration.tillDate
        });
        return this.derayahHttpClientService.postWithAuth(url, this.getPreAddOrUpdateOrder(order, true)).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.updatePreConfirm = function (order) {
        var url = this.getDerayahOauthUrl() + "/Order/preconfirmUpdate";
        this.logUrl('Derayah pre update order url : ', url);
        this.logRequestData('update pre confirm', {
            "order-id": order.id,
            "portfolio": order.portfolio,
            "exchange-code": order.derayahMarket,
            "symbol": order.derayahSymbol,
            "order-side": order.type.type.toString(),
            "execution-type": order.execution.type.toString(),
            "quantity": order.quantity.toString(),
            "fill-type": "1",
            "min-quantity": null,
            "disclose-quantity": 0,
            "price": order.price.toString(),
            "valid-till": order.expiration.type.toString(),
            "valid-till-date": order.expiration.tillDate
        });
        var body = this.getPreAddOrUpdateOrder(order, false);
        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.updateOrder = function (order) {
        var url = this.getDerayahOauthUrl() + "/Order/Update";
        this.logRequestData('update order', {
            "order-id": order.id,
            "portfolio": order.portfolio,
            "exchange-code": order.derayahMarket,
            "symbol": order.derayahSymbol,
            "order-side": order.type.type.toString(),
            "execution-type": order.execution.type.toString(),
            "quantity": order.quantity.toString(),
            "fill-type": "1",
            "min-quantity": null,
            "disclose-quantity": 0,
            "price": order.price.toString(),
            "valid-till": order.expiration.type.toString(),
            "valid-till-date": order.expiration.tillDate
        });
        return this.derayahHttpClientService.postWithAuth(url, this.getPreAddOrUpdateOrder(order, false)).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.getPreAddOrUpdateOrder = function (order, isNewOrder) {
        var body = {
            portfolio: +order.portfolio,
            exchangeCode: order.derayahMarket,
            symbol: order.derayahSymbol,
            orderSide: order.type.type,
            executionType: order.execution.type,
            fillType: 1,
            discloseQuantity: order.discloseQuantity,
            quantity: order.quantity,
            price: order.price,
            validTill: +order.expiration.type,
            minQantity: order.executedQuantity
        };
        if (order.expiration.tillDate) {
            body.validTillDate = moment(order.expiration.tillDate, 'YYYY-MM-DD').format();
        }
        if (!isNewOrder) {
            body.orderId = +order.id;
        }
        return body;
    };
    DerayahLoaderService.prototype.deleteOrder = function (order) {
        var url = this.getDerayahOauthUrl() + "/Order/Cancel";
        this.logUrl('Derayah delete order url : ', url);
        this.logRequestData('delete order', { 'portfolio': order.portfolio, 'order-id': order.id, 'exchange-code': order.derayahMarket });
        var body = { orderId: +order.id, portfolio: +order.portfolio, exchangeCode: order.derayahMarket };
        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.revertUpdate = function (order, actionFlag) {
        var url = this.getDerayahOauthUrl() + "/Order/Revert";
        this.logUrl('Derayah revert update url : ', url);
        this.logRequestData('revert order', {
            "order-id": order.id,
            "portfolio": order.portfolio,
            "exchange-code": order.derayahMarket,
            "action-flag": actionFlag
        });
        return this.derayahHttpClientService.postWithAuth(url, this.getOrderDetailsAndRevertBody(order)).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.getOrderDetails = function (order) {
        var url = this.getDerayahOauthUrl() + "/Order/Details";
        this.logUrl('Derayah order details url : ', url);
        this.logRequestData('order details', {
            "order-id": order.id,
            "portfolio": order.portfolio,
            "exchange-code": order.derayahMarket
        });
        return this.derayahHttpClientService.postWithAuth(url, this.getOrderDetailsAndRevertBody(order)).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.getOrderDetailsAndRevertBody = function (order) {
        return { orderID: +order.id, portfolio: +order.portfolio, exchangeCode: order.derayahMarket };
    };
    DerayahLoaderService.prototype.calculateOrderQuantity = function (order, power) {
        var url = this.getDerayahOauthUrl() + "/order/Calculate";
        this.logUrl('Derayah quantity calculator url : ', url);
        this.logRequestData('Derayah quantity calculator ', {
            'order-symbol': order.derayahSymbol,
            'order-type': order.type.type,
            'order-price': order.price,
            'order-execution': order.execution.type,
            'order-portfolio': order.portfolio,
            'power': power,
            'order-makret': order.derayahMarket
        });
        var body = {
            symbol: order.derayahSymbol,
            side: order.type.type,
            price: order.price,
            executionType: order.execution.type,
            portfolio: +order.portfolio,
            buyingPower: power,
            exchangeCode: order.derayahMarket
        };
        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.getPortfolios = function () {
        var url = this.getDerayahOauthUrl() + "/Portfolio/List";
        this.logUrl('Derayah get portfolios url: ', url);
        return this.derayahHttpClientService.getWithAuth(url).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.getOrders = function (portfolio, orderStatusGroup) {
        var url = this.getDerayahOauthUrl() + "/Order/List";
        this.logUrl('Derayah orders url : ', url);
        var body = { portfolio: +portfolio, orderStatusGroup: orderStatusGroup, isIntraDay: true, exchanges: [98, 99] };
        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.getDerayahPurchasePower = function (portfolio, exchangeCode, symbol) {
        var url = this.getDerayahOauthUrl() + "/UserPosition/BuyingPower";
        this.logUrl('Derayah purchase power url: ', url);
        this.logRequestData('purchase power', {
            'portfolio': portfolio,
            'exchange-code': exchangeCode,
            'symbol': symbol
        });
        var body = { portfolio: +portfolio, exchangeCode: exchangeCode, symbolCode: symbol, ratingEQTY: symbol };
        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.getPositions = function (portfolio) {
        var url = this.getDerayahOauthUrl() + "/UserPosition/ListPositions";
        this.logUrl('Derayah get positions url : ', url);
        this.logRequestData('positions', { 'portfolio': portfolio, 'currency-code': "1" });
        var body = { currencyCode: 1, exchangeCodes: [98, 99], portfolio: +portfolio };
        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.getPortfolioQueue = function (portfolio) {
        var url = this.getDerayahOauthUrl() + "/Queue/Create";
        this.logUrl('Derayah get Portfolio Queue url : ', url);
        this.logRequestData('Portfolio Queue', { 'portfolioId': +portfolio, 'transactionType': "0" });
        var body = { portfolioId: +portfolio, transactionType: 0 };
        return this.derayahHttpClientService.postWithAuth(url, body).pipe(map(function (response) { return response; }));
    };
    DerayahLoaderService.prototype.logUrl = function (urlDescription, url) {
    };
    DerayahLoaderService.prototype.logRequestData = function (url, data) {
    };
    DerayahLoaderService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, LanguageService, DerayahClientService, DerayahHttpClientService])
    ], DerayahLoaderService);
    return DerayahLoaderService;
}());
export { DerayahLoaderService };
//# sourceMappingURL=derayah-loader.service.js.map