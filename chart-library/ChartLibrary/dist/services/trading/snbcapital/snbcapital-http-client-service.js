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
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SnbcapitalErrorService } from './snbcapital-error.service';
import { SnbcapitalStateService } from '../../state/trading/snbcapital';
var SnbcapitalHttpClientService = (function () {
    function SnbcapitalHttpClientService(http, snbcapitalStateService, snbcapitalErrorService) {
        this.http = http;
        this.snbcapitalStateService = snbcapitalStateService;
        this.snbcapitalErrorService = snbcapitalErrorService;
        this.keepAliveLastCallSeconds = 0;
        this.fillBasicUrl();
        this.snbcapitalSessionExpiredStream = new Subject();
    }
    SnbcapitalHttpClientService.prototype.getSessionExpiredStream = function () {
        return this.snbcapitalSessionExpiredStream;
    };
    SnbcapitalHttpClientService.prototype.fillBasicUrl = function () {
        this.basicUrl = '/IntegrationLayerTC/tcbridge';
    };
    SnbcapitalHttpClientService.prototype.getHeaders = function () {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            }),
            withCredentials: true
        };
    };
    SnbcapitalHttpClientService.prototype.setGbsCustomerCode = function (customerCode) {
        this.customerCode = customerCode;
    };
    SnbcapitalHttpClientService.prototype.initializeKeepAliveTimer = function () {
        var _this = this;
        if (!this.timerId) {
            this.timerId = window.setInterval(function () {
                if (_this.snbcapitalStateService.isValidSnbcapitalSession() && _this.customerCode && _this.keepAliveLastCallSeconds >= 30) {
                    _this.resetKeepAliveLastCallSeconds();
                    _this.callKeepAlive();
                }
                _this.keepAliveLastCallSeconds++;
            }, 1 * 1000);
        }
    };
    SnbcapitalHttpClientService.prototype.clearRefreshTimer = function () {
        window.clearInterval(this.timerId);
        this.timerId = null;
    };
    SnbcapitalHttpClientService.prototype.callKeepAlive = function () {
        var _this = this;
        this.http.post(this.basicUrl, "NameXsl=KEEPALIVE&JavaClient=JSON&GUserTrace=" + this.customerCode, this.getHeaders())
            .subscribe(function (response) { return _this.onKeepAliveResponse(response); });
    };
    SnbcapitalHttpClientService.prototype.onKeepAliveResponse = function (response) {
        if (response.status == 1) {
            this.snbcapitalSessionExpiredStream.next(true);
            this.snbcapitalStateService.disableSnbcapitalSession();
            this.snbcapitalErrorService.emitSessionExpiredError();
        }
        return response;
    };
    SnbcapitalHttpClientService.prototype.resetKeepAliveLastCallSeconds = function () {
        this.keepAliveLastCallSeconds = 0;
    };
    SnbcapitalHttpClientService.prototype.get = function () {
        this.resetKeepAliveLastCallSeconds();
        return this.http.get(this.basicUrl, this.getHeaders()).pipe(map(function (response) { return response; }));
    };
    SnbcapitalHttpClientService.prototype.post = function (body) {
        this.resetKeepAliveLastCallSeconds();
        return this.http.post(this.basicUrl, body, this.getHeaders()).pipe(map(function (response) { return response; }));
    };
    SnbcapitalHttpClientService.prototype.ngOnDestroy = function () {
        if (this.timerId) {
            this.clearRefreshTimer();
        }
    };
    SnbcapitalHttpClientService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, SnbcapitalStateService, SnbcapitalErrorService])
    ], SnbcapitalHttpClientService);
    return SnbcapitalHttpClientService;
}());
export { SnbcapitalHttpClientService };
//# sourceMappingURL=snbcapital-http-client-service.js.map