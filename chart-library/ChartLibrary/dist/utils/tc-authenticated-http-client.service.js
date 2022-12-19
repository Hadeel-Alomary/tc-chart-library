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
import { LoaderConfig, LoaderUrlType } from '../services/loader';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TcTracker } from './tc-tracker';
import { Tc } from './tc.utils';
var TcAuthenticatedHttpClient = (function () {
    function TcAuthenticatedHttpClient(http) {
        this.http = http;
    }
    TcAuthenticatedHttpClient.prototype.onLoaderConfig = function (loaderConfig) {
        this.renewTokenUrl = LoaderConfig.url(loaderConfig, LoaderUrlType.RenewToken);
    };
    TcAuthenticatedHttpClient.prototype.getWithAuth = function (url) {
        var _this = this;
        return this.http.get(url, this.getTcAuthOptions()).pipe(switchMap(function (response) {
            var isTokenExpired = 'error' in response && response.error === 'invalid-token';
            if (isTokenExpired) {
                TcTracker.trackMessage('Token is expired');
                return _this.renewToken().pipe(switchMap(function (success) {
                    if (success) {
                        return _this.get(url, _this.getTcAuthOptions()).pipe(map(function (response) {
                            return response;
                        }));
                    }
                    Tc.error('Unable to renew token');
                }));
            }
            return of(response);
        }));
    };
    TcAuthenticatedHttpClient.prototype.postWithAuth = function (url, body) {
        var _this = this;
        return this.http.post(url, body, this.getTcAuthOptions()).pipe(switchMap(function (response) {
            var isTokenExpired = 'error' in response && response.error === 'invalid-token';
            if (isTokenExpired) {
                TcTracker.trackMessage('Token is expired');
                return _this.renewToken().pipe(switchMap(function (success) {
                    if (success) {
                        return _this.post(url, body, _this.getTcAuthOptions()).pipe(map(function (response) {
                            return response;
                        }));
                    }
                    Tc.error('Unable to renew token');
                }));
            }
            return of(response);
        }));
    };
    TcAuthenticatedHttpClient.prototype.get = function (url, options) {
        return this.http.get(url, options).pipe(map(function (response) { return response; }));
    };
    TcAuthenticatedHttpClient.prototype.post = function (url, body, options) {
        return this.http.post(url, body, options).pipe(map(function (response) { return response; }));
    };
    TcAuthenticatedHttpClient.prototype.renewToken = function () {
        var data = {};
        return this.post(Tc.url(this.renewTokenUrl), data, this.getTcAuthOptions()).pipe(map(function (response) {
            if (!response.success) {
                Tc.assert(false, 'Failed renewToken url');
                return null;
            }
            return true;
        }));
    };
    TcAuthenticatedHttpClient.prototype.getTcAuthOptions = function () {
        return {
            headers: new HttpHeaders({
                'Authorization': null
            })
        };
    };
    TcAuthenticatedHttpClient = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], TcAuthenticatedHttpClient);
    return TcAuthenticatedHttpClient;
}());
export { TcAuthenticatedHttpClient };
//# sourceMappingURL=tc-authenticated-http-client.service.js.map