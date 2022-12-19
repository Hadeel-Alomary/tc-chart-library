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
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { VirtualTradingLoader } from '../../loader/trading/virtual-trading';
import { VirtualTradingService } from './virtual-trading.service';
import { Streamer } from '../../streaming/streamer';
import { ChannelRequestType, SharedChannel } from '../../shared-channel';
import { LanguageService } from '../../language';
import { TcTracker } from '../../../utils';
var MarketsManager = (function () {
    function MarketsManager() {
    }
    return MarketsManager;
}());
var VirtualTradingOrdersService = (function () {
    function VirtualTradingOrdersService(virtualTradingService, virtualTradingLoaderService, sharedChannel, marketsManager, streamer, languageService) {
        var _this = this;
        this.virtualTradingService = virtualTradingService;
        this.virtualTradingLoaderService = virtualTradingLoaderService;
        this.sharedChannel = sharedChannel;
        this.marketsManager = marketsManager;
        this.streamer = streamer;
        this.languageService = languageService;
        this.ordersStream = new BehaviorSubject(null);
        this.virtualTradingService.getAccountStream().subscribe(function (account) {
            if (account != null) {
                _this.reloadOrders();
            }
            else {
                _this.ordersStream.next([]);
            }
        });
        this.streamer.getGeneralPurposeStreamer().getTradingStreamer().subscribe(function (tradingMessage) {
            var order = _this.ordersStream.value.find(function (order) { return order.id == tradingMessage.id.toString(); });
        });
    }
    VirtualTradingOrdersService.prototype.getQuantityString = function (quantity) {
        if (quantity == 1) {
            return this.languageService.arabic ? 'سهم' : 'a share';
        }
        else if (quantity == 2) {
            return this.languageService.arabic ? 'سهمين' : 'two shares';
        }
        else if (quantity <= 10) {
            return this.languageService.arabic ? "".concat(quantity, " \u0623\u0633\u0647\u0645") : "".concat(quantity, " shares");
        }
        else {
            return this.languageService.arabic ? "".concat(quantity, " \u0633\u0647\u0645") : "".concat(quantity, " shares");
        }
    };
    VirtualTradingOrdersService.prototype.showMessageBox = function (message, message2) {
        var request = { type: ChannelRequestType.MessageBox, messageLine: message, messageLine2: message2 };
        this.sharedChannel.request(request);
    };
    VirtualTradingOrdersService.prototype.postOrder = function (order) {
        var _this = this;
        return this.virtualTradingLoaderService.postOrder(this.account.id, order).pipe(tap(function () { return _this.virtualTradingService.refreshState(); }));
    };
    VirtualTradingOrdersService.prototype.updateOrder = function (order) {
        var _this = this;
        return this.virtualTradingLoaderService.updateOrder(this.account.id, order).pipe(tap(function () { return _this.virtualTradingService.refreshState(); }));
    };
    VirtualTradingOrdersService.prototype.getOrderDetails = function (order) {
        return this.virtualTradingLoaderService.getOrderDetails(this.account.id, order);
    };
    VirtualTradingOrdersService.prototype.getOrdersStream = function () {
        return this.ordersStream;
    };
    VirtualTradingOrdersService.prototype.reloadOrders = function () {
        var _this = this;
        this.virtualTradingLoaderService.getOrders(this.account.id)
            .subscribe(function (orders) { return _this.ordersStream.next(orders); }, function (error) { });
    };
    VirtualTradingOrdersService.prototype.deleteOrder = function (order) {
        var _this = this;
        TcTracker.trackVirtualTradingDeleteOrder();
        this.virtualTradingLoaderService.deleteOrder(this.account.id, order).subscribe(function () { return _this.virtualTradingService.refreshState(); });
    };
    VirtualTradingOrdersService.prototype.calculateCommission = function (order) {
        if (this.account == null) {
            return 0;
        }
        return order.price * order.quantity * this.account.commission;
    };
    Object.defineProperty(VirtualTradingOrdersService.prototype, "account", {
        get: function () {
            return this.virtualTradingService.getAccount();
        },
        enumerable: false,
        configurable: true
    });
    VirtualTradingOrdersService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [VirtualTradingService,
            VirtualTradingLoader,
            SharedChannel,
            MarketsManager,
            Streamer,
            LanguageService])
    ], VirtualTradingOrdersService);
    return VirtualTradingOrdersService;
}());
export { VirtualTradingOrdersService };
//# sourceMappingURL=virtual-trading-orders.service.js.map