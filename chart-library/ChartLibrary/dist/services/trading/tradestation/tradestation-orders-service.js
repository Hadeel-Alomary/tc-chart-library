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
import { Subject, of, concat } from 'rxjs';
import { LanguageService } from '../../language';
import { ChannelRequestType, SharedChannel } from '../../shared-channel';
import { TradestationOrder } from './tradestation-order';
import { TradestationService } from './tradestation.service';
import { TradestationLoaderService } from '../../loader/trading/tradestation';
import { catchError, map, toArray } from 'rxjs/operators';
import { TradestationUtils } from '../../../utils/tradestation.utils';
import { Tc, TcTracker } from '../../../utils';
import { TradestationStateService } from '../../state/trading/tradestation';
import { TradestationAccountsService } from './tradestation-accounts-service';
var TradestationOrdersService = (function () {
    function TradestationOrdersService(tradestationService, tradestationLoaderService, tradestationStateService, tradestationAccountsService, sharedChannel, languageService) {
        var _this = this;
        this.tradestationService = tradestationService;
        this.tradestationLoaderService = tradestationLoaderService;
        this.tradestationStateService = tradestationStateService;
        this.tradestationAccountsService = tradestationAccountsService;
        this.sharedChannel = sharedChannel;
        this.languageService = languageService;
        this.orders = [];
        this.groupedOrders = [];
        this.ordersStream = new Subject();
        this.tradestationAccountsService.getAccountStream().subscribe(function () {
            _this.refreshOrders();
        });
    }
    TradestationOrdersService.prototype.getOrdersStream = function () {
        return this.ordersStream;
    };
    TradestationOrdersService.prototype.refreshOrders = function () {
        var _this = this;
        this.getOrders().subscribe(function (response) { return _this.onOrders(response); });
    };
    TradestationOrdersService.prototype.onOrders = function (response) {
        this.orders = response;
        this.groupedOrders = this.buildGroupedOrders(response);
        this.ordersStream.next(this.groupedOrders);
    };
    TradestationOrdersService.prototype.getGroupedOrders = function () {
        return this.groupedOrders;
    };
    TradestationOrdersService.prototype.getOrders = function () {
        var _this = this;
        return this.tradestationLoaderService.getOrders().pipe(map(function (response) { return _this.mapOrders(response); }));
    };
    TradestationOrdersService.prototype.mapOrders = function (response) {
        var tradestationOrders = [];
        var orders = response;
        if (orders && orders.length > 0) {
            for (var _i = 0, orders_1 = orders; _i < orders_1.length; _i++) {
                var order = orders_1[_i];
                var symbol = TradestationUtils.getSymbolWithMarketFromTradestation(order.Symbol);
            }
        }
        return tradestationOrders;
    };
    TradestationOrdersService.prototype.buildGroupedOrders = function (response) {
        var groupedOrders = [];
        response.forEach(function (order) {
            var groupedOrder = TradestationOrder.isActiveOrder(order) ? groupedOrders.find(function (groupedOrder) { return groupedOrder.id == order.triggeredBy && TradestationOrder.isActiveOrder(groupedOrder); }) : null;
            if (groupedOrder) {
                if (order.stopPrice > 0) {
                    groupedOrder.stopLossPrice = order.stopPrice;
                }
                if (order.price > 0) {
                    groupedOrder.takeProfitPrice = order.price;
                }
            }
            else {
                groupedOrders.push(order);
            }
        });
        return groupedOrders;
    };
    TradestationOrdersService.prototype.getStopLossOrTakeProfitOrder = function (id, isStopLoss) {
        if (isStopLoss) {
            return this.orders.find(function (order) { return order.triggeredBy == id && order.stopPrice > 0 && TradestationOrder.isActiveOrder(order); });
        }
        else {
            return this.orders.find(function (order) { return order.triggeredBy == id && order.price > 0 && TradestationOrder.isActiveOrder(order); });
        }
    };
    TradestationOrdersService.prototype.showMessageBox = function (message, isErrorMessage) {
        var request = { type: ChannelRequestType.TradestationMessage, messageLines: [message], isErrorMessage: isErrorMessage, showWarningMessage: false };
        this.sharedChannel.request(request);
    };
    TradestationOrdersService.prototype.getOrderConfirmation = function (order, osoOrders) {
        var account = this.tradestationAccountsService.getAccounts().find(function (account) { return account.name == order.accountId; });
        return this.tradestationLoaderService.getOrderConfirmation(order, osoOrders, account.key).pipe(map(function (response) { return response; }));
    };
    TradestationOrdersService.prototype.postOrder = function (order, osoOrders) {
        var account = this.tradestationAccountsService.getAccounts().find(function (account) { return account.name == order.accountId; });
        return this.tradestationLoaderService.postOrder(order, osoOrders, account.key).pipe(map(function (response) { return response; }));
    };
    TradestationOrdersService.prototype.updateOrder = function (order) {
        return this.tradestationLoaderService.updateOrder(order).pipe(map(function (response) { return response; }));
    };
    TradestationOrdersService.prototype.deleteOrder = function (order) {
        TcTracker.trackTradestationDeleteOrder();
        return this.tradestationLoaderService.deleteOrder(order.id).pipe(map(function (response) { return response; }));
    };
    TradestationOrdersService.prototype.deleteOrderFromChart = function (order) {
        var _this = this;
        var message = this.languageService.translate('تم إلغاء الأوامر بنجاح');
        this.deleteOrder(order)
            .subscribe(function (response) {
            _this.tradestationService.loadTradestationData();
            _this.showMessageBox(message, false);
        });
    };
    TradestationOrdersService.prototype.updateOrdersSequentially = function (orders) {
        var _this = this;
        var observables = orders.map(function (order) { return _this.tradestationLoaderService.updateOrder(order); });
        return concat.apply(void 0, observables).pipe(map(function (response) {
            return _this.handleSequentialResponse(response);
        }), catchError(function (error) {
            Tc.error('Tradestation Update Order Failed');
            return of(error);
        }), toArray());
    };
    TradestationOrdersService.prototype.deleteOrdersSequentially = function (orders) {
        var _this = this;
        var observables = orders.map(function (order) { return _this.tradestationLoaderService.deleteOrder(order.id); });
        return concat.apply(void 0, observables).pipe(map(function (response) {
            return _this.handleSequentialResponse(response);
        }), catchError(function (error) {
            Tc.error('Tradestation Delete Order Failed');
            return of(error);
        }), toArray());
    };
    TradestationOrdersService.prototype.handleSequentialResponse = function (response) {
        if (response.OrderStatus == 'Failed') {
            var tradestationMessageChannelRequest = {
                type: ChannelRequestType.TradestationMessage,
                messageLines: [response.Message],
                isErrorMessage: true,
                showWarningMessage: true
            };
            this.sharedChannel.request(tradestationMessageChannelRequest);
        }
        return response;
    };
    TradestationOrdersService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [TradestationService, TradestationLoaderService, TradestationStateService, TradestationAccountsService, SharedChannel, LanguageService])
    ], TradestationOrdersService);
    return TradestationOrdersService;
}());
export { TradestationOrdersService };
//# sourceMappingURL=tradestation-orders-service.js.map