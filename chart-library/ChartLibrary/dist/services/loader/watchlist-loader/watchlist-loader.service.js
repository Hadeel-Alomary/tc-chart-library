var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tc, TcTracker } from '../../../utils/index';
import { WatchlistType } from '../../watchlist/watchlist';
var WatchlistLoader = (function () {
    function WatchlistLoader(http) {
        this.http = http;
    }
    WatchlistLoader.prototype.saveWatchlist = function (watchlist) {
        TcTracker.trackCreateOrUpdateCloudWatchlist();
        var data = {
            identifier: watchlist.id,
            companies: this.fromSymbolsToCompanyIds(watchlist.symbols),
            name: watchlist.name
        };
        this.http.post(Tc.url('https://www.tickerchart.com/m/watchlist/replace'), data, this.getAuthorizationHeader())
            .pipe(map(function (jsonResponse) {
            Tc.assert(jsonResponse.success, "fail to save watchlist");
            return null;
        })).subscribe();
    };
    WatchlistLoader.prototype.deleteWatchlist = function (watchlist) {
        TcTracker.trackDeleteCloudWatchlist();
        this.http.get(Tc.url("https://www.tickerchart.com/m/watchlist/".concat(watchlist.id, "/delete")), this.getAuthorizationHeader())
            .pipe(map(function (jsonResponse) {
            Tc.assert(jsonResponse.success, "fail to delete watchlist");
            return null;
        })).subscribe();
    };
    WatchlistLoader.prototype.loadWatchlists = function () {
        var _this = this;
        return this.http.get(Tc.url('https://www.tickerchart.com/m/watchlist/list'), this.getAuthorizationHeader())
            .pipe(map(function (jsonResponse) {
            var result = { deleted: [], active: [] };
            Tc.assert(jsonResponse.success, "fail to load watchlists");
            jsonResponse.response.watchlists.forEach(function (jsonWatchlist) {
                if (jsonWatchlist.deleted == "0") {
                    result.active.push({
                        type: WatchlistType.UserDefined,
                        name: jsonWatchlist.name,
                        id: jsonWatchlist.identifier,
                        symbols: _this.fromCompanyIdsToSymbols(jsonWatchlist.companies)
                    });
                }
                else {
                    result.deleted.push(jsonWatchlist.identifier);
                }
            });
            return result;
        }));
    };
    WatchlistLoader.prototype.fromCompanyIdsToSymbols = function (companyIds) {
        var symbols = {};
        companyIds.forEach(function (companyId) {
        });
        return symbols;
    };
    WatchlistLoader.prototype.fromSymbolsToCompanyIds = function (symbols) {
        var companyIds = [];
        Object.values(symbols).forEach(function (symbol) {
        });
        return companyIds;
    };
    WatchlistLoader.prototype.getAuthorizationHeader = function () {
        return {
            headers: new HttpHeaders({
                'Authorization': null
            })
        };
    };
    WatchlistLoader = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], WatchlistLoader);
    return WatchlistLoader;
}());
export { WatchlistLoader };
//# sourceMappingURL=watchlist-loader.service.js.map