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
import { DerayahClientService } from './derayah-client.service';
import { DerayahStateService } from '../../state/trading/derayah';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Tc } from '../../../utils';
import { DerayahLogoutService } from './derayah-logout.service';
import { LanguageService } from '../../language';
var DerayahHttpClientService = (function () {
    function DerayahHttpClientService(http, derayahClientService, derayahStateService, derayahLogoutService, languageService) {
        this.http = http;
        this.derayahClientService = derayahClientService;
        this.derayahStateService = derayahStateService;
        this.derayahLogoutService = derayahLogoutService;
        this.languageService = languageService;
    }
    DerayahHttpClientService.prototype.getToken = function () {
        return this.derayahStateService.getDerayahToken();
    };
    DerayahHttpClientService.prototype.getRefreshToken = function () {
        return this.derayahStateService.getDerayahRefreshToken();
    };
    DerayahHttpClientService.prototype.getWithAuth = function (url) {
        var _this = this;
        return this.http.get(url, this.getTcAuthOptions(this.getToken())).pipe(switchMap(function (response) {
            return of(response);
        }), catchError(function (error) {
            if (error.status == 401) {
                _this.onTokenExpired();
                return _this.renewToken().pipe(switchMap(function (success) {
                    if (success) {
                        return _this.get(url, _this.getTcAuthOptions(_this.getToken())).pipe(map(function (response) {
                            return response;
                        }));
                    }
                }));
            }
            Tc.error('Derayah unknown error');
            return of(error);
        }), catchError(function (error) {
            if (error.status == 400) {
                _this.onLogout();
            }
            Tc.error('Derayah unable to renew token');
            return of(error);
        }));
    };
    DerayahHttpClientService.prototype.postWithAuth = function (url, body) {
        var _this = this;
        return this.http.post(url, body, this.getTcAuthOptions(this.getToken())).pipe(switchMap(function (response) {
            return of(response);
        }), catchError(function (error) {
            if (error.status == 401) {
                _this.onTokenExpired();
                return _this.renewToken().pipe(switchMap(function (success) {
                    if (success) {
                        return _this.post(url, body, _this.getTcAuthOptions(_this.getToken())).pipe(map(function (response) {
                            return response;
                        }));
                    }
                }));
            }
            Tc.error('Derayah unknown error');
            return of(error);
        }), catchError(function (error) {
            if (error.status == 400) {
                _this.onLogout();
            }
            Tc.error('Derayah unable to renew token');
            return of(error);
        }));
    };
    DerayahHttpClientService.prototype.getTcAuthOptions = function (token) {
        return {
            headers: new HttpHeaders({
                'Authorization': 'Bearer' + ' ' + token,
                'Accept-Language': this.languageService.arabic ? 'ar' : 'en'
            })
        };
    };
    DerayahHttpClientService.prototype.get = function (url, options) {
        return this.http.get(url, options).pipe(map(function (response) { return response; }));
    };
    DerayahHttpClientService.prototype.post = function (url, body, options) {
        return this.http.post(url, body, options).pipe(map(function (response) { return response; }));
    };
    DerayahHttpClientService.prototype.renewToken = function () {
        var _this = this;
        var headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        var data = "client_id=".concat(this.derayahClientService.getClientId(), "&client_secret=").concat(this.derayahClientService.getClientSecretId(), "&grant_type=refresh_token&refresh_token=").concat(this.getRefreshToken());
        return this.post(null, data, headers).pipe(map(function (response) {
            if (response.access_token) {
                _this.derayahStateService.setDerayahToken(response.access_token);
                _this.derayahStateService.setDerayahRefreshToken(response.refresh_token);
                _this.derayahStateService.enableDerayahSession();
                return true;
            }
            Tc.assert(false, 'Derayah Renew Token is failed');
            return null;
        }));
    };
    DerayahHttpClientService.prototype.onLogout = function () {
        this.onTokenExpired();
        this.derayahLogoutService.onLogout();
    };
    DerayahHttpClientService.prototype.onTokenExpired = function () {
        this.derayahStateService.disableDerayahSession();
    };
    DerayahHttpClientService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, DerayahClientService, DerayahStateService, DerayahLogoutService, LanguageService])
    ], DerayahHttpClientService);
    return DerayahHttpClientService;
}());
export { DerayahHttpClientService };
//# sourceMappingURL=derayah-http-client.service.js.map