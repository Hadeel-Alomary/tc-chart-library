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
import { BehaviorSubject, Subject } from 'rxjs';
import { DerayahOrderStatusGroupType } from './derayah-order/index';
import { DerayahOrderDetails } from './derayah-order-details/index';
import { DerayahLoaderService } from '../../loader/index';
import { DerayahUtils } from '../../../utils/index';
import { DerayahService } from './derayah.service';
import { DerayahPositionsService } from './derayah-positions.service';
import { map } from 'rxjs/operators';
var DerayahOrdersService = (function () {
    function DerayahOrdersService(derayahLoaderService, derayahService, derayahPositionsService) {
        var _this = this;
        this.derayahLoaderService = derayahLoaderService;
        this.derayahService = derayahService;
        this.derayahPositionsService = derayahPositionsService;
        this.portfolios = [];
        this.orders = {};
        this.ordersStream = new BehaviorSubject(null);
        this.derayahService.getDerayahStreamer().getDerayahOrderStream()
            .subscribe(function () {
            _this.refreshOrders();
        });
        this.derayahService.getPortfoliosStream()
            .subscribe(function (portfolios) {
            if (portfolios) {
                _this.portfolios = portfolios;
                _this.refreshOrders();
            }
            else {
                _this.orders = {};
                _this.ordersStream.next(_this.orders);
            }
        });
    }
    DerayahOrdersService.prototype.refreshOrders = function () {
        var _this = this;
        var progressSubject = new Subject();
        var orders = {};
        var _loop_1 = function (portfolio) {
            this_1.loadOrders(portfolio.portfolioNumber, DerayahOrderStatusGroupType.All)
                .subscribe(function (response) {
                orders[portfolio.portfolioNumber] = response.result;
                if (Object.keys(orders).length == _this.portfolios.length) {
                    progressSubject.complete();
                    _this.orders = orders;
                    _this.ordersStream.next(orders);
                }
            }, function (error) { });
        };
        var this_1 = this;
        for (var _i = 0, _a = this.portfolios; _i < _a.length; _i++) {
            var portfolio = _a[_i];
            _loop_1(portfolio);
        }
        return progressSubject.asObservable().subscribe();
    };
    DerayahOrdersService.prototype.loadOrders = function (portfolio, orderStatusGroup) {
        var _this = this;
        return this.derayahLoaderService.getOrders(portfolio, orderStatusGroup).pipe(map(function (response) { return _this.derayahService.onResponse(response); }), map(function (response) { return _this.mapOrders(response, portfolio); }));
    };
    DerayahOrdersService.prototype.getOrderDetails = function (order) {
        var _this = this;
        return this.derayahLoaderService.getOrderDetails(order).pipe(map(function (response) { return _this.derayahService.onResponse(response); }), map(function (response) { return _this.mapOrderDetails(order, response); }));
    };
    DerayahOrdersService.prototype.preConfirmOrder = function (order) {
        return order.id == null
            ? this.addPreConfirm(order)
            : this.updatePreConfirm(order);
    };
    DerayahOrdersService.prototype.confirmOrder = function (order) {
        return order.id == null
            ? this.addOrder(order)
            : this.updateOrder(order);
    };
    DerayahOrdersService.prototype.deleteOrder = function (order) {
        var _this = this;
        return this.derayahLoaderService.deleteOrder(order).pipe(map(function (response) {
            return { result: _this.derayahService.onResponse(response) };
        }));
    };
    DerayahOrdersService.prototype.revertOrder = function (order, actionFlag) {
        var _this = this;
        return this.derayahLoaderService.revertUpdate(order, actionFlag).pipe(map(function (response) {
            return { result: _this.derayahService.onResponse(response) };
        }));
    };
    DerayahOrdersService.prototype.calculateOrderQuantity = function (order, power) {
        var _this = this;
        return this.derayahLoaderService.calculateOrderQuantity(order, power).pipe(map(function (response) { return _this.derayahService.onResponse(response); }), map(function (response) { return _this.mapCalculatedQuantity(response); }));
    };
    DerayahOrdersService.prototype.addPreConfirm = function (order) {
        var _this = this;
        return this.derayahLoaderService.addPreConfirm(order).pipe(map(function (response) { return _this.derayahService.onResponse(response); }), map(function (response) { return _this.mapFees(response); }));
    };
    DerayahOrdersService.prototype.addOrder = function (order) {
        var _this = this;
        return this.derayahLoaderService.addOrder(order).pipe(map(function (response) {
            return { result: _this.derayahService.onResponse(response) };
        }));
    };
    DerayahOrdersService.prototype.updatePreConfirm = function (order) {
        var _this = this;
        return this.derayahLoaderService.updatePreConfirm(order).pipe(map(function (response) { return _this.derayahService.onResponse(response); }), map(function (response) { return _this.mapFees(response); }));
    };
    DerayahOrdersService.prototype.updateOrder = function (order) {
        var _this = this;
        return this.derayahLoaderService.updateOrder(order).pipe(map(function (response) {
            return { result: _this.derayahService.onResponse(response) };
        }));
    };
    DerayahOrdersService.prototype.mapOrders = function (response, portfolio) {
        var derayahOrders = [];
        var data = response.data;
        var orders = data.orders;
        if (orders && orders.length > 0) {
            for (var _i = 0, orders_1 = orders; _i < orders_1.length; _i++) {
                var item = orders_1[_i];
                var symbol = DerayahUtils.getSymbolWithMarketFromDerayah(item.exchangeCode, item.symbol);
                var company = null;
            }
        }
        return { result: derayahOrders };
    };
    DerayahOrdersService.prototype.mapOrderDetails = function (order, response) {
        return { result: DerayahOrderDetails.mapResponseToOrderDetails(response, order) };
    };
    DerayahOrdersService.prototype.mapFees = function (response) {
        var preConfirmResponse = response.data;
        return {
            result: {
                fees: +preConfirmResponse.fees,
                totalValue: +preConfirmResponse.total,
                warningMessage: preConfirmResponse.warningMessage,
                vat: +preConfirmResponse.vatamountequ,
                vatId: preConfirmResponse.vatidno
            },
        };
    };
    DerayahOrdersService.prototype.mapCalculatedQuantity = function (response) {
        var result = response.data;
        return {
            result: {
                EstimatedAmtinInstrumentCcy: +result.estimatedAmtinInstrumentCcy,
                EstimatedFeeInInstrumentCcy: +result.estimatedFeeInInstrumentCcy,
                EstimatedOrderQty: +result.estimatedOrderQty
            }
        };
    };
    DerayahOrdersService.prototype.getOrdersStream = function () {
        return this.ordersStream;
    };
    DerayahOrdersService.prototype.getOrders = function () {
        var _this = this;
        var portfolios = Object.keys(this.orders);
        if (portfolios.length == 1) {
            return this.orders[portfolios[0]];
        }
        var orders = [];
        portfolios.forEach(function (portfolio) {
            orders = orders.concat(_this.orders[portfolio]);
        });
        return orders;
    };
    DerayahOrdersService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [DerayahLoaderService,
            DerayahService, DerayahPositionsService])
    ], DerayahOrdersService);
    return DerayahOrdersService;
}());
export { DerayahOrdersService };
//# sourceMappingURL=derayah-orders-service.js.map