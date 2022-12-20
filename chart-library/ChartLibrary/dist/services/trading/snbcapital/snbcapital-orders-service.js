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
import { SnbcapitalOrderExecutionType, SnbcapitalOrderExpirationType, SnbcapitalOrderType } from './snbcapital-order/index';
import { SnbcapitalOrderDetails } from './snbcapital-order-details/index';
import { MarketUtils, Tc } from '../../../utils/index';
import { SnbcapitalService } from './snbcapital.service';
import { SnbcapitalPositionsService } from './snbcapital-positions.service';
import { map } from 'rxjs/operators';
import { SnbcapitalLoaderService } from '../../loader/trading/snbcapital-loader/snbcapital-loader.service';
import { SnbcapitalErrorService } from './snbcapital-error.service';
var SnbcapitalOrdersService = (function () {
    function SnbcapitalOrdersService(snbcapitalLoaderService, snbcapitalService, snbcapitalPositionsService, snbcapitalErrorService) {
        var _this = this;
        this.snbcapitalLoaderService = snbcapitalLoaderService;
        this.snbcapitalService = snbcapitalService;
        this.snbcapitalPositionsService = snbcapitalPositionsService;
        this.snbcapitalErrorService = snbcapitalErrorService;
        this.portfolios = [];
        this.orders = {};
        this.ordersStream = new BehaviorSubject(null);
        this.snbcapitalService.getPortfoliosStream()
            .subscribe(function (portfolios) {
            if (portfolios && portfolios.length) {
                _this.portfolios = portfolios;
                _this.refreshOrders();
            }
            else {
                _this.orders = {};
                _this.ordersStream.next(_this.orders);
            }
        });
        this.snbcapitalService.getSnbcapitalStreamer().getSnbCapitalOrderStream()
            .subscribe(function () {
            _this.refreshOrders();
        });
    }
    SnbcapitalOrdersService.prototype.ngOnDestroy = function () {
    };
    SnbcapitalOrdersService.prototype.refreshOrders = function () {
        var _this = this;
        if (!this.snbcapitalService.validSession) {
            this.snbcapitalErrorService.emitSessionExpiredError();
            return null;
        }
        var progressSubject = new Subject();
        var orders = {};
        var gbsCustomerCode = this.snbcapitalService.portfolios[0].gBSCustomerCode;
        this.loadOrders(gbsCustomerCode).subscribe(function (snbcapitalOrders) {
            var _loop_1 = function (portfolio) {
                orders[portfolio.portfolioId] = snbcapitalOrders.filter(function (order) { return order.portfolioId == portfolio.portfolioId; });
                if (Object.keys(orders).length == _this.portfolios.length) {
                    progressSubject.complete();
                    _this.orders = orders;
                    _this.ordersStream.next(orders);
                }
            };
            for (var _i = 0, _a = _this.portfolios; _i < _a.length; _i++) {
                var portfolio = _a[_i];
                _loop_1(portfolio);
            }
            progressSubject.complete();
        }, function (error) {
            progressSubject.complete();
        });
        return progressSubject.asObservable().subscribe();
    };
    SnbcapitalOrdersService.prototype.loadOrders = function (gbsCustomerCode) {
        var _this = this;
        return this.snbcapitalLoaderService.getOrders(gbsCustomerCode).pipe(map(function (response) { return _this.snbcapitalService.onResponse(response); }), map(function (response) { return _this.mapOrders(response); }));
    };
    SnbcapitalOrdersService.prototype.getOrderDetails = function (order, portfolio) {
        var _this = this;
        return this.snbcapitalLoaderService.getOrderDetails(order, portfolio).pipe(map(function (response) { return _this.snbcapitalService.onResponse(response); }), map(function (response) { return _this.mapOrderDetails(order, portfolio, response); }));
    };
    SnbcapitalOrdersService.prototype.getSearchOrders = function (portfolio, orderAction, startDate, endDate, orderStatus, company, orderNumber, pageNumber) {
        var _this = this;
        return this.snbcapitalLoaderService.getSearchOrders(portfolio, orderAction, startDate, endDate, orderStatus, company, orderNumber, pageNumber).pipe(map(function (response) { return _this.snbcapitalService.onResponse(response); }), map(function (response) { return _this.mapOrders(response); }));
    };
    SnbcapitalOrdersService.prototype.confirmOrder = function (order, portfolio, originalOrder) {
        return order.id == null
            ? this.addOrder(order, portfolio)
            : this.updateOrder(order, portfolio, originalOrder);
    };
    SnbcapitalOrdersService.prototype.deleteOrder = function (order, portfolio) {
        var _this = this;
        return this.snbcapitalLoaderService.deleteOrder(order, portfolio).pipe(map(function (response) { return _this.snbcapitalService.onResponse(response); }));
    };
    SnbcapitalOrdersService.prototype.calculateOrderQuantity = function (order, portfolio, isNomuMarket) {
        var _this = this;
        var calculateQuantityBody = this.getPreConfirmOrCalculateQuantityBody(order, isNomuMarket, true);
        return this.snbcapitalLoaderService.calculateOrderQuantity(order, calculateQuantityBody, portfolio).pipe(map(function (response) { return _this.snbcapitalService.onResponse(response); }), map(function (response) { return _this.mapCalculatedQuantity(response); }));
    };
    SnbcapitalOrdersService.prototype.addPreConfirm = function (order, portfolio, isNomuMarket) {
        var _this = this;
        var preConfirmBody = this.getPreConfirmOrCalculateQuantityBody(order, isNomuMarket, false);
        return this.snbcapitalLoaderService.addPreConfirm(order, preConfirmBody, portfolio).pipe(map(function (response) { return _this.snbcapitalService.onResponse(response); }), map(function (response) { return _this.mapFees(response); }));
    };
    SnbcapitalOrdersService.prototype.getPreConfirmOrCalculateQuantityBody = function (order, isNomuMarket, isCalculateQuantity) {
        var symbolWithoutMarket = MarketUtils.symbolWithoutMarket(order.symbol);
        var operazione = order.type.type == SnbcapitalOrderType.Buy ? 'acquista' : 'vendi';
        var mercato = isNomuMarket ? "SEM" : "SAMA";
        var validityOrParameterQta = this.getValidityOrParameterQta(order, isCalculateQuantity);
        var disclosedQta = '';
        var minimumQta = '';
        var tipoPrezzo;
        if (order.discloseQuantity != null && order.discloseQuantity > 0) {
            disclosedQta = "disclosedQty=" + order.discloseQuantity + "&";
        }
        if (order.minimumQuantity != null && order.minimumQuantity > 0) {
            minimumQta = "QtaMin=" + order.minimumQuantity + "&";
        }
        if (order.execution.type == SnbcapitalOrderExecutionType.Limit) {
            tipoPrezzo = "TipoPrezzo=2&PrezzoLimite=" + order.price;
        }
        else {
            tipoPrezzo = 'TipoPrezzo=3';
        }
        return "Combo_Security=" + symbolWithoutMarket + "&Operazione=" + operazione + "&Mercato=" + mercato + "&" + validityOrParameterQta + "&" + disclosedQta + minimumQta + tipoPrezzo;
    };
    SnbcapitalOrdersService.prototype.getValidityOrParameterQta = function (order, isCalculateQuantity) {
        var validityOrParameterQta = '';
        switch (order.expiration.type) {
            case SnbcapitalOrderExpirationType.Today:
                validityOrParameterQta = "Validita=VSC";
                break;
            case SnbcapitalOrderExpirationType.GoodTillWeek:
                validityOrParameterQta = "Validita=VFS";
                break;
            case SnbcapitalOrderExpirationType.GoodTillMonth:
                validityOrParameterQta = "Validita=VFM";
                break;
            case SnbcapitalOrderExpirationType.GoodTillDate:
                var date = order.tillDate.split('-');
                validityOrParameterQta = "Validita=VSD&giorno=" + date[2] + "&mese=" + date[1] + "&anno=" + date[0];
                break;
            case SnbcapitalOrderExpirationType.AtTheOpening:
                validityOrParameterQta = "Validita=VSA";
                break;
            case SnbcapitalOrderExpirationType.GoodTillCancellation:
                validityOrParameterQta = "Validita=GTC";
                break;
            case SnbcapitalOrderExpirationType.FillAndKill:
                validityOrParameterQta = "ParQta=1";
                break;
            case SnbcapitalOrderExpirationType.FillOrKill:
                validityOrParameterQta = "ParQta=6";
                break;
            default:
                Tc.error('Unknown type' + order.expiration.type);
        }
        if (isCalculateQuantity) {
            if (validityOrParameterQta.indexOf('Validita') != -1) {
                validityOrParameterQta += '&ParQta=';
            }
            else {
                validityOrParameterQta += '&Validita=';
            }
        }
        return validityOrParameterQta;
    };
    SnbcapitalOrdersService.prototype.addOrder = function (order, portfolio) {
        var _this = this;
        return this.snbcapitalLoaderService.addOrder(order, portfolio).pipe(map(function (response) { return _this.snbcapitalService.onResponse(response); }), map(function () { return order; }));
    };
    SnbcapitalOrdersService.prototype.updatePreConfirm = function (order, portfolio) {
        var _this = this;
        return this.snbcapitalLoaderService.updatePreConfirm(order, portfolio).pipe(map(function (response) { return _this.snbcapitalService.onResponse(response); }), map(function (response) { return response; }));
    };
    SnbcapitalOrdersService.prototype.updateOrder = function (order, portfolio, originalOrder) {
        var _this = this;
        var paramPrc = '';
        var paramQty = '';
        var paramDisclosedQty = '';
        var newTimeInForceOrPrmQty = '';
        var paramExpiry = '';
        var isMarketOrder = order.execution.type == SnbcapitalOrderExecutionType.Market;
        var isLimitOrder = order.execution.type == SnbcapitalOrderExecutionType.Limit;
        if (order.execution.type != originalOrder.execution.type) {
            if (isMarketOrder) {
                paramPrc = "paramPrc=0&";
            }
            else {
                paramPrc = "paramPrc=" + order.price + "&";
            }
            paramPrc += "tipoOp=prz&";
        }
        else if (isLimitOrder && order.price != originalOrder.price) {
            paramPrc = "paramPrc=" + order.price + "&";
            paramPrc += "tipoOp=prz&";
        }
        if (order.quantity != originalOrder.quantity) {
            paramQty = "paramQty=" + order.quantity + "&";
            paramQty += "tipoOp=qty&";
        }
        if (order.discloseQuantity != originalOrder.discloseQuantity) {
            if (order.discloseQuantity == null && originalOrder.discloseQuantity != null && originalOrder.discloseQuantity == 0) {
            }
            else {
                paramDisclosedQty = "paramDisclosedQty=" + order.discloseQuantity + "&";
                paramDisclosedQty += 'tipoOp=disclosedQty&';
            }
        }
        var modifyExpiration = this.getModifyExpiration(order, originalOrder);
        paramExpiry = modifyExpiration.paramExpiry;
        newTimeInForceOrPrmQty = modifyExpiration.newTimeInForceOrPrmQty;
        return this.snbcapitalLoaderService.updateOrder(order, paramPrc, paramQty, paramDisclosedQty, paramExpiry, newTimeInForceOrPrmQty, portfolio).pipe(map(function (response) { return _this.snbcapitalService.onResponse(response); }), map(function (response) { return order; }));
    };
    SnbcapitalOrdersService.prototype.getModifyExpiration = function (order, originalOrder) {
        var newTimeInForceOrPrmQty = '';
        var paramExpiry = '';
        var isGoodTillDate = order.expiration.type == SnbcapitalOrderExpirationType.GoodTillDate;
        if (order.expiration.type != originalOrder.expiration.type) {
            switch (order.expiration.type) {
                case SnbcapitalOrderExpirationType.Today:
                    newTimeInForceOrPrmQty = "newTimeInForce=1&tipoOp=expiry&";
                    break;
                case SnbcapitalOrderExpirationType.AtTheOpening:
                    newTimeInForceOrPrmQty = "newTimeInForce=4&tipoOp=expiry&";
                    break;
                case SnbcapitalOrderExpirationType.GoodTillWeek:
                    newTimeInForceOrPrmQty = "newTimeInForce=6&tipoOp=expiry&";
                    break;
                case SnbcapitalOrderExpirationType.GoodTillMonth:
                    newTimeInForceOrPrmQty = "newTimeInForce=7&tipoOp=expiry&";
                    break;
                case SnbcapitalOrderExpirationType.GoodTillDate:
                    newTimeInForceOrPrmQty = "newTimeInForce=2&tipoOp=expiry&";
                    var date = order.tillDate.split('-');
                    paramExpiry = "paramExpiry=" + date[2] + date[1] + date[0] + "&";
                    break;
                case SnbcapitalOrderExpirationType.GoodTillCancellation:
                    newTimeInForceOrPrmQty = "newTimeInForce=9&tipoOp=expiry&";
                    break;
                case SnbcapitalOrderExpirationType.FillAndKill:
                    newTimeInForceOrPrmQty = "prmQty=1&tipoOp=prmQty&";
                    break;
                case SnbcapitalOrderExpirationType.FillOrKill:
                    newTimeInForceOrPrmQty = "prmQty=6&tipoOp=prmQty&";
                    break;
                default:
                    Tc.error('Unknown expiration type' + order.expiration.type);
            }
        }
        else if (isGoodTillDate && order.tillDate != originalOrder.tillDate) {
            var date = order.tillDate.split('-');
            paramExpiry = "paramExpiry=" + date[0] + date[1] + date[2] + "&tipoOp=expiry&";
        }
        return {
            newTimeInForceOrPrmQty: newTimeInForceOrPrmQty,
            paramExpiry: paramExpiry,
        };
    };
    SnbcapitalOrdersService.prototype.mapOrders = function (response) {
        var snbcapitalOrders = [];
        var orders = response.ordersList;
        for (var _i = 0, orders_1 = orders; _i < orders_1.length; _i++) {
            var item = orders_1[_i];
            if (item.strum) {
                var symbol = item.strum.secCode + '.TAD';
            }
        }
        return snbcapitalOrders;
    };
    SnbcapitalOrdersService.prototype.mapOrderDetails = function (order, portfolio, response) {
        return SnbcapitalOrderDetails.mapResponseToOrderDetails(response, order, portfolio);
    };
    SnbcapitalOrdersService.prototype.mapFees = function (response) {
        var warningMessages = [];
        if (response.propOutOrd.adeguatezza != null && response.propOutOrd.adeguatezza.warnMsgs != null) {
            warningMessages = response.propOutOrd.adeguatezza.warnMsgs;
        }
        return {
            referrer: response.referrer,
            estimatedTotalAmount: response.propOutOrd.estAmt,
            fees: response.propOutOrd.fees,
            commission: response.propOutOrd.commission,
            vat: response.propOutOrd.VATamt,
            warningMessages: warningMessages
        };
    };
    SnbcapitalOrdersService.prototype.mapCalculatedQuantity = function (response) {
        return { orderQty: response.propOutOrd.orderQty };
    };
    SnbcapitalOrdersService.prototype.getOrdersStream = function () {
        return this.ordersStream;
    };
    SnbcapitalOrdersService.prototype.getOrders = function () {
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
    SnbcapitalOrdersService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [SnbcapitalLoaderService,
            SnbcapitalService, SnbcapitalPositionsService, SnbcapitalErrorService])
    ], SnbcapitalOrdersService);
    return SnbcapitalOrdersService;
}());
export { SnbcapitalOrdersService };
//# sourceMappingURL=snbcapital-orders-service.js.map