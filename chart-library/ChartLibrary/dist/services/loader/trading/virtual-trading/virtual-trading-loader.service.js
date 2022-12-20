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
import { throwError } from 'rxjs/internal/observable/throwError';
import { MarketUtils, Tc } from '../../../../utils';
import { VirtualTradingAccount, VirtualTradingOrder, VirtualTradingOrderAction, VirtualTradingOrderDetails, VirtualTradingPosition, VirtualTradingTransaction } from '../../../trading/virtual-trading/virtual-trading-models';
var VirtualTradingLoader = (function () {
    function VirtualTradingLoader(http) {
        this.http = http;
    }
    VirtualTradingLoader.prototype.login = function (username, password) {
        var url = this.basicUrl + "/signin/";
        return this.http.post(url, {
            username: username,
            password: password
        }, this.RequestOptions).pipe(map(function (response) {
            if (!response.success) {
                throwError('login failed');
            }
            return null;
        }));
    };
    VirtualTradingLoader.prototype.logout = function () {
        var url = this.basicUrl + "/signout/";
        return this.http.post(url, {}, this.RequestOptions).pipe(function () { return null; });
    };
    VirtualTradingLoader.prototype.createVirtualTradingAccount = function (capital, commission, currency, name, language) {
        var url = this.basicUrl + "/accounts/";
        return this.http.post(url, {
            capital: capital, commission: commission, currency: currency, name: name, language: language
        }, this.RequestOptions).pipe(map(function (response) {
            if (!response.success) {
                throwError('create virtual trading account failed');
            }
            return null;
        }));
    };
    VirtualTradingLoader.prototype.deleteVirtualTradingAccount = function (accountId) {
        var url = this.basicUrl + "/accounts/" + accountId + "/delete";
        return this.http.post(url, {}, this.RequestOptions).pipe(map(function (response) {
            if (!response.success) {
                throwError('delete virtual trading account failed');
            }
            return null;
        }));
    };
    VirtualTradingLoader.prototype.getAccounts = function () {
        var url = this.basicUrl + "/accounts";
        return this.http.get(Tc.url(url), this.RequestOptions).pipe(map(function (response) {
            if (!response.success) {
                return null;
            }
            var result = [];
            response.response.forEach(function (accountData) {
                result.push(VirtualTradingAccount.mapResponseToVirtualTradingAccount(accountData));
            });
            return result;
        }));
    };
    VirtualTradingLoader.prototype.updateAccountName = function (accountId, name) {
        var url = this.basicUrl + "/accounts/" + accountId + "/name";
        return this.http.post(url, { name: name }, this.RequestOptions).pipe(map(function () { return null; }));
    };
    VirtualTradingLoader.prototype.updateAccountCommission = function (accountId, commission) {
        var url = this.basicUrl + "/accounts/" + accountId + "/commission";
        return this.http.post(url, { commission: commission }, this.RequestOptions).pipe(map(function () { return null; }));
    };
    VirtualTradingLoader.prototype.updateAccountCapital = function (accountId, action, amount, date) {
        var url = this.basicUrl + "/accounts/" + accountId + "/capital";
        return this.http.post(url, { action: action, amount: amount, date: date }, this.RequestOptions).pipe(map(function () { return null; }));
    };
    VirtualTradingLoader.prototype.getAccountTransactions = function (accountId) {
        var url = this.basicUrl + "/accounts/" + accountId + "/transactions/";
        return this.http.get(Tc.url(url), this.RequestOptions).pipe(map(function (response) {
            return VirtualTradingTransaction.mapResponseToVirtualTradingTransactions(response.response);
        }));
    };
    VirtualTradingLoader.prototype.setNotificationMethods = function (accountId, methods) {
        var url = this.basicUrl + "/accounts/" + accountId + "/notifications";
        return this.http.post(url, {
            notifications: methods.toRequestObject()
        }, this.RequestOptions).pipe(map(function () { return null; }));
    };
    VirtualTradingLoader.prototype.postOrder = function (accountId, order) {
        var url = this.basicUrl + "/accounts/" + accountId + "/orders";
        return this.http.post(url, {
            symbol: MarketUtils.symbolWithoutMarket(order.symbol),
            price: order.price,
            quantity: order.quantity,
            stop_price: order.stopPrice,
            take_profit: order.takeProfit,
            market: order.market.abbreviation,
            order_side: order.orderSide.value,
            order_type: order.orderType.value,
            expiration_date: order.expirationDate,
            execution_time: order.executionTime
        }, this.RequestOptions).pipe(map(function () { return null; }));
    };
    VirtualTradingLoader.prototype.updateOrder = function (accountId, order) {
        var url = this.basicUrl + "/accounts/" + accountId + "/orders/" + order.id;
        return this.http.post(url, {
            price: order.price,
            quantity: order.quantity,
            stop_price: order.stopPrice,
            take_profit: order.takeProfit,
            expiration_date: order.expirationDate
        }, this.RequestOptions).pipe(map(function () { return null; }));
    };
    VirtualTradingLoader.prototype.getPositions = function (accountId) {
        var url = this.basicUrl + "/accounts/" + accountId + "/positions";
        return this.http.get(Tc.url(url), this.RequestOptions).pipe(map(function (response) {
            return VirtualTradingPosition.mapResponseToVirtualTradingPositions(response.response);
        }));
    };
    VirtualTradingLoader.prototype.getOrders = function (accountId) {
        var url = this.basicUrl + "/accounts/" + accountId + "/orders/";
        return this.http.get(Tc.url(url), this.RequestOptions).pipe(map(function (response) {
            return VirtualTradingOrder.mapResponseToVirtualTradingOrders(response.response);
        }));
    };
    VirtualTradingLoader.prototype.getOrderDetails = function (accountId, order) {
        var url = this.basicUrl + "/accounts/" + accountId + "/orders/" + order.id + "/";
        return this.http.get(Tc.url(url), this.RequestOptions).pipe(map(function (response) {
            var detailsResponse = response.response;
            var order = VirtualTradingOrder.mapDetailsResponseToVirtualTradingOrder(detailsResponse.order);
            var actions = VirtualTradingOrderAction.mapResponseToVirtualTradingOrderActions(detailsResponse.actions);
            return new VirtualTradingOrderDetails(order, actions);
        }));
    };
    VirtualTradingLoader.prototype.deleteOrder = function (accountId, order) {
        var url = this.basicUrl + "/accounts/" + accountId + "/orders/" + order.id + "/delete";
        return this.http.post(url, {}, this.RequestOptions).pipe(map(function () { return null; }));
    };
    Object.defineProperty(VirtualTradingLoader.prototype, "RequestOptions", {
        get: function () {
            return {
                headers: new HttpHeaders({
                    'Authorization': null
                })
            };
        },
        enumerable: true,
        configurable: true
    });
    VirtualTradingLoader = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], VirtualTradingLoader);
    return VirtualTradingLoader;
}());
export { VirtualTradingLoader };
//# sourceMappingURL=virtual-trading-loader.service.js.map