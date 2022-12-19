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
import { Tc, TcTracker } from '../../utils';
var ProxyService = (function () {
    function ProxyService(http) {
        this.http = http;
        this.proxyServerUrl = "";
        this.pingUrl = 'https://tickerchart.com/pingcache';
    }
    ProxyService.prototype.init = function (proxyServerUrl, cb) {
        var _this = this;
        Tc.info("init proxy server for url: " + proxyServerUrl);
        if (!proxyServerUrl) {
            TcTracker.trackProxyNoCache();
            cb();
            return;
        }
        this.proxyServerUrl = proxyServerUrl + "?url=";
        var subscription = this.http.get(this.proxyServerUrl + encodeURIComponent(this.pingUrl), { responseType: 'text' }).subscribe(function () {
            TcTracker.trackProxyEnabled();
            cb();
        }, function (error) {
            _this.proxyServerUrl = "";
            TcTracker.trackMessage("proxy ping error: " + error.message);
            TcTracker.trackProxyDisabled();
            cb();
        });
        window.setTimeout(function () {
            if (!subscription.closed) {
                subscription.unsubscribe();
                _this.proxyServerUrl = "";
                TcTracker.trackProxyTimeout();
                cb();
            }
        }, 1500);
    };
    ProxyService.prototype.getProxyServerUrl = function () {
        return this.proxyServerUrl;
    };
    ProxyService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], ProxyService);
    return ProxyService;
}());
export { ProxyService };
//# sourceMappingURL=proxy.service.js.map