var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { HttpClient } from '@angular/common/http';
import { MarketUtils } from '../../../utils';
import { LiquidityPoint } from '../../liquidity/liquidity-point';
import { map } from 'rxjs/operators';
import { ProxiedUrlLoader } from '../proxied-url-loader';
import { ProxyService } from "../../../services";
var LiquidityLoaderService = (function (_super) {
    __extends(LiquidityLoaderService, _super);
    function LiquidityLoaderService(http, proxyService) {
        var _this = _super.call(this, proxyService) || this;
        _this.http = http;
        _this.proxyService = proxyService;
        return _this;
    }
    LiquidityLoaderService.prototype.loadSymbolHistory = function (url, symbol, market, intervalString, date) {
        var symbolWithoutMarket = MarketUtils.symbolWithoutMarket(symbol);
        url = url.replace('{0}', market);
        url = url.replace('{1}', symbolWithoutMarket);
        url = url.replace('{2}', intervalString);
        url = url.replace('{3}', date);
        return this.http.get(this.getProxyAppliedUrl(url)).pipe(map(function (response) {
            return LiquidityPoint.fromLoaderData(response);
        }));
    };
    LiquidityLoaderService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, ProxyService])
    ], LiquidityLoaderService);
    return LiquidityLoaderService;
}(ProxiedUrlLoader));
export { LiquidityLoaderService };
//# sourceMappingURL=liquidity-loader.service.js.map