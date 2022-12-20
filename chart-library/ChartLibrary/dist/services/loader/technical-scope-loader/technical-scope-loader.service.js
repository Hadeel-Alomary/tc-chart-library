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
import { ProxiedUrlLoader } from '../proxied-url-loader';
import { HttpClient } from '@angular/common/http';
import { Tc } from '../../../utils';
import { map } from 'rxjs/operators';
import { LanguageService, ProxyService } from "@src/services";
var TechnicalScopeLoader = (function (_super) {
    __extends(TechnicalScopeLoader, _super);
    function TechnicalScopeLoader(http, proxyService, languageService) {
        var _this = _super.call(this, proxyService) || this;
        _this.http = http;
        _this.proxyService = proxyService;
        _this.languageService = languageService;
        return _this;
    }
    TechnicalScopeLoader.prototype.loadTechnicalScopeHistoricalData = function (interval, marketAbbr) {
        var _this = this;
        var baseUrl = '', language = this.languageService.arabic ? 'ARABIC' : 'ENGLISH', url = baseUrl + '?' + ("language=" + language + "&interval=" + interval + "&market=" + marketAbbr);
        Tc.info('request TechnicalScope history: ' + url);
        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map(function (response) { return _this.processTechnicalScopeData(response, marketAbbr); }));
    };
    TechnicalScopeLoader.prototype.processTechnicalScopeData = function (response, marketAbbr) {
        var messages = [];
        if (response == null) {
            return [];
        }
        response.forEach(function (line, index) {
            var data = line.split(',');
            messages.push({
                topic: data[0] + '.num-alerts.' + marketAbbr,
                date: data[1],
                symbol: data[2] + '.' + marketAbbr,
                signal: data[3],
                value: data[4],
            });
        });
        return messages;
    };
    TechnicalScopeLoader = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient,
            ProxyService,
            LanguageService])
    ], TechnicalScopeLoader);
    return TechnicalScopeLoader;
}(ProxiedUrlLoader));
export { TechnicalScopeLoader };
//# sourceMappingURL=technical-scope-loader.service.js.map