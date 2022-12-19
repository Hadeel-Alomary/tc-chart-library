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
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Tc } from '../../../utils';
import { TradestationStateService } from '../../state/trading/tradestation';
import { TradestationClientService } from './tradestation-client-service';
import { TradestationLogoutService } from './tradestation-logout-service';
var TradestationHttpClientService = (function () {
    function TradestationHttpClientService(http, tradestationLogoutService, tradestationClientService, tradestationStateService) {
        this.http = http;
        this.tradestationLogoutService = tradestationLogoutService;
        this.tradestationClientService = tradestationClientService;
        this.tradestationStateService = tradestationStateService;
    }
    TradestationHttpClientService.prototype.getToken = function () {
        return this.tradestationStateService.getTradestationToken();
    };
    TradestationHttpClientService.prototype.getRefreshToken = function () {
        return this.tradestationStateService.getTradestationRefreshToken();
    };
    TradestationHttpClientService.prototype.getWithAuth = function (url) {
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
            Tc.error('Tradestation unknown error');
            return of(error);
        }), catchError(function (error) {
            _this.onLogout();
            Tc.error('Tradestation unable to renew token');
            return of(error);
        }));
    };
    TradestationHttpClientService.prototype.postWithAuth = function (url, body) {
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
            Tc.error('Tradestation unknown error');
            return of(error);
        }), catchError(function (error) {
            _this.onLogout();
            Tc.error('Tradestation unable to renew token');
            return of(error);
        }));
    };
    TradestationHttpClientService.prototype.putWithAuth = function (url, body) {
        var _this = this;
        return this.http.put(url, body, this.getTcAuthOptions(this.getToken())).pipe(switchMap(function (response) {
            return of(response);
        }), catchError(function (error) {
            if (error.status == 401) {
                _this.onTokenExpired();
                return _this.renewToken().pipe(switchMap(function (success) {
                    if (success) {
                        return _this.put(url, body, _this.getTcAuthOptions(_this.getToken())).pipe(map(function (response) {
                            return response;
                        }));
                    }
                }));
            }
            Tc.error('Tradestation unknown error');
            return of(error);
        }), catchError(function (error) {
            _this.onLogout();
            Tc.error('Tradestation unable to renew token');
            return of(error);
        }));
    };
    TradestationHttpClientService.prototype.deleteWithAuth = function (url) {
        var _this = this;
        return this.http.delete(url, this.getTcAuthOptions(this.getToken())).pipe(switchMap(function (response) {
            return of(response);
        }), catchError(function (error) {
            if (error.status == 401) {
                _this.onTokenExpired();
                return _this.renewToken().pipe(switchMap(function (success) {
                    if (success) {
                        return _this.delete(url, _this.getTcAuthOptions(_this.getToken())).pipe(map(function (response) {
                            return response;
                        }));
                    }
                }));
            }
            Tc.error('Tradestation unknown error');
            return of(error);
        }), catchError(function (error) {
            _this.onLogout();
            Tc.error('Tradestation unable to renew token');
            return of(error);
        }));
    };
    TradestationHttpClientService.prototype.onTokenExpired = function () {
        this.tradestationStateService.disableTradestationSession();
    };
    TradestationHttpClientService.prototype.onLogout = function () {
        this.onTokenExpired();
        this.tradestationLogoutService.onLogout();
    };
    TradestationHttpClientService.prototype.get = function (url, options) {
        return this.http.get(url, options).pipe(map(function (response) { return response; }));
    };
    TradestationHttpClientService.prototype.post = function (url, body, options) {
        return this.http.post(url, body, options).pipe(map(function (response) { return response; }));
    };
    TradestationHttpClientService.prototype.put = function (url, body, options) {
        return this.http.put(url, body, options).pipe(map(function (response) { return response; }));
    };
    TradestationHttpClientService.prototype.delete = function (url, options) {
        return this.http.delete(url, options).pipe(map(function (response) { return response; }));
    };
    TradestationHttpClientService.prototype.renewToken = function () {
        var _this = this;
        var headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        var data = "refresh_token=".concat(this.getRefreshToken(), "&client_id=").concat(this.tradestationClientService.getClientId(), "&client_secret=").concat(this.tradestationClientService.getClientSecret(), "&grant_type=refresh_token&response_type=token");
        return this.post(Tc.url("".concat(this.tradestationClientService.getBaseUrl(), "/security/authorize")), data, headers).pipe(map(function (response) {
            if (response.access_token) {
                _this.tradestationStateService.setTradestationToken(response.access_token);
                _this.tradestationStateService.enableTradestationSession();
                return true;
            }
            Tc.assert(false, 'Tradestation Renew Token is failed');
            return null;
        }));
    };
    TradestationHttpClientService.prototype.getTcAuthOptions = function (token) {
        return {
            headers: new HttpHeaders({
                'Authorization': 'Bearer' + ' ' + token
            })
        };
    };
    TradestationHttpClientService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, TradestationLogoutService, TradestationClientService, TradestationStateService])
    ], TradestationHttpClientService);
    return TradestationHttpClientService;
}());
export { TradestationHttpClientService };
//# sourceMappingURL=tradestation.http-client-service.js.map