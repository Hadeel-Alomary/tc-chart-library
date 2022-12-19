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
import { WatchlistType } from './watchlist';
import { StringUtils, Tc, TcTracker } from '../../utils/index';
import { LanguageService, } from '../language/index';
import { ArrayUtils } from '../../utils/array.utils';
import { ChannelRequestType } from "../../services/shared-channel/channel-request";
import { SharedChannel, WatchlistLoader } from "../../services";
var remove = require("lodash/remove");
var isEqual = require("lodash/isEqual");
var WatchlistService = (function () {
    function WatchlistService(languageService, watchlistLoader, sharedChannel) {
        this.languageService = languageService;
        this.watchlistLoader = watchlistLoader;
        this.sharedChannel = sharedChannel;
        this.userDefinedWatchlists = [];
        this.marketBuiltinWatchlist = {};
        this.tradingWatchlists = [];
    }
    WatchlistService.prototype.syncCloudWatchlists = function () {
    };
    WatchlistService.prototype.initWatchlists = function () {
    };
    WatchlistService.prototype.create = function (name) {
        TcTracker.trackCreateWatchlist();
        var watchlist = { type: WatchlistType.UserDefined, id: StringUtils.guid(), name: name, symbols: {} };
        this.userDefinedWatchlists.push(watchlist);
        this.save();
        this.watchlistLoader.saveWatchlist(watchlist);
        return watchlist;
    };
    WatchlistService.prototype.get = function (id) {
        var watchlist = this.getUserDefined(id);
        if (watchlist == null) {
            watchlist = this.getTradingWatchlist(id);
        }
        if (watchlist == null) {
            watchlist = this.getBuiltin(id);
        }
        return watchlist;
    };
    WatchlistService.prototype.getUserDefined = function (id) {
        return this.userDefinedWatchlists.find(function (watchlist) { return watchlist.id == id; });
    };
    WatchlistService.prototype.getBuiltin = function (id) {
        for (var _i = 0, _a = ArrayUtils.values(this.marketBuiltinWatchlist); _i < _a.length; _i++) {
            var marketWatchlists = _a[_i];
            var result = marketWatchlists.find(function (watchlist) { return watchlist.id == id; });
            if (result) {
                return result;
            }
        }
        return null;
    };
    WatchlistService.prototype.isBuiltin = function (id) {
        return this.getBuiltin(id) != null;
    };
    WatchlistService.prototype.remove = function (watchlist) {
        TcTracker.trackDeleteWatchlist();
        remove(this.userDefinedWatchlists, function (w) { return w === watchlist; });
        this.watchlistLoader.deleteWatchlist(watchlist);
        this.save();
    };
    WatchlistService.prototype.isDeleted = function (id) {
        return this.get(id) == null;
    };
    WatchlistService.prototype.save = function () {
        var storedWatchlists = this.userDefinedWatchlists.concat(this.tradingWatchlists);
    };
    WatchlistService.prototype.getBuiltinWatchlists = function (marketAbbreviation) {
        return this.marketBuiltinWatchlist[marketAbbreviation];
    };
    WatchlistService.prototype.getAllMarketWatchlist = function (marketAbbreviation) {
        return this.getBuiltinWatchlists(marketAbbreviation).find(function (watchlist) { return watchlist.type == WatchlistType.All; });
    };
    WatchlistService.prototype.getUserDefinedWatchlists = function () {
        return this.userDefinedWatchlists;
    };
    WatchlistService.prototype.filter = function (watchlist, symbol) {
        return false;
    };
    WatchlistService.prototype.getWatchListSymbols = function (watchList) {
        if (watchList.type == WatchlistType.UserDefined || watchList.type == WatchlistType.Trading) {
            return Object.keys(watchList.symbols);
        }
        return null;
    };
    WatchlistService.prototype.updateWatchlistName = function (watchlist, name) {
        watchlist.name = name;
        this.save();
        this.watchlistLoader.saveWatchlist(watchlist);
    };
    WatchlistService.prototype.addSymbolToWatchlist = function (watchlist, symbol) {
        this.addSymbolsToWatchlist(watchlist, [symbol]);
    };
    WatchlistService.prototype.showExceedMessage = function () {
        var message = this.languageService.translate('لا يمكن إضافة جميع الشركات المختارة إلى لائحة الأسهم .');
        var message2 = this.languageService.translate('عدد الشركات في لائحة الأسهم سيتجاوز الحد المسموح به وهو (700) شركة , الرجاء حذف بعض الشركات من اللائحة لتتمكن من إضافة شركات اخرى .');
        var request = { type: ChannelRequestType.MessageBox, messageLine: message, messageLine2: message2 };
        this.sharedChannel.request(request);
    };
    WatchlistService.prototype.addSymbolsToWatchlist = function (watchlist, symbols) {
        if (Object.keys(watchlist.symbols).length + symbols.length > 700) {
            this.showExceedMessage();
        }
        else {
            Tc.assert(watchlist.type == WatchlistType.UserDefined, "can only add symbol to user defined watchlist");
            symbols.forEach(function (symbol) { return watchlist.symbols[symbol] = symbol; });
            this.save();
            this.watchlistLoader.saveWatchlist(watchlist);
            this.sharedChannel.request(({ type: ChannelRequestType.UserDefinedWatchListUpdated }));
        }
    };
    WatchlistService.prototype.removeSymbolFromWatchlist = function (watchlist, symbol) {
        this.removeSymbolsFromWatchlist(watchlist, [symbol]);
    };
    WatchlistService.prototype.removeSymbolsFromWatchlist = function (watchlist, symbols) {
        Tc.assert(watchlist.type == WatchlistType.UserDefined, "can only add symbol to user defined watchlist");
        symbols.forEach(function (symbol) { return delete watchlist.symbols[symbol]; });
        this.save();
        this.watchlistLoader.saveWatchlist(watchlist);
        this.sharedChannel.request(({ type: ChannelRequestType.UserDefinedWatchListUpdated }));
    };
    WatchlistService.prototype.doBelongToSameMarket = function (watchlist1, watchlist2) {
        if (watchlist1.type == WatchlistType.UserDefined || watchlist2.type == WatchlistType.UserDefined) {
            return false;
        }
        if (watchlist1.type == WatchlistType.Trading || watchlist2.type == WatchlistType.Trading) {
            return false;
        }
        var marketAbbr1 = this.getMarketAbbrForBuiltinWatchlist(watchlist1);
        var marketAbbr2 = this.getMarketAbbrForBuiltinWatchlist(watchlist2);
        return marketAbbr1 == marketAbbr2;
    };
    WatchlistService.prototype.getMarketsForWatchlist = function (watchlist) {
        var markets = [];
        if (watchlist.type == WatchlistType.UserDefined || watchlist.type == WatchlistType.Trading) {
            Object.keys(watchlist.symbols).forEach(function (symbol) {
            });
        }
        else {
        }
        return markets;
    };
    WatchlistService.prototype.getTradingWatchlists = function () {
        return this.tradingWatchlists;
    };
    WatchlistService.prototype.addTradingWatchlist = function (watchlist) {
        this.tradingWatchlists.push(watchlist);
        this.save();
    };
    WatchlistService.prototype.removeTradingWatchlist = function (watchlist) {
        remove(this.tradingWatchlists, function (w) { return w === watchlist; });
        this.save();
    };
    WatchlistService.prototype.removeAllTradingWatchlists = function () {
        this.tradingWatchlists = [];
        this.save();
    };
    WatchlistService.prototype.getTradingWatchlist = function (id) {
        return this.tradingWatchlists.find(function (watchlist) { return watchlist.id == id; });
    };
    WatchlistService.prototype.getMarketAbbrForBuiltinWatchlist = function (watchlist) {
        Tc.assert(watchlist.type != WatchlistType.UserDefined, "not built-in watchlist");
        for (var _i = 0, _a = Object.keys(this.marketBuiltinWatchlist); _i < _a.length; _i++) {
            var marketAbbr = _a[_i];
            if (this.marketBuiltinWatchlist[marketAbbr].includes(watchlist)) {
                return marketAbbr;
            }
        }
        Tc.error("fail to find market for given built-in watchlist");
        return null;
    };
    WatchlistService.prototype.onMarket = function (market) {
        this.initMarketBuiltinWatchlists(market);
    };
    WatchlistService.prototype.initMarketBuiltinWatchlists = function (market) {
        if (market.abbreviation == 'USA') {
            this.marketBuiltinWatchlist[market.abbreviation] = [{ type: WatchlistType.All, id: market.abbreviation, name: market.name }];
        }
        else {
            var allMarketWatchlist = { type: WatchlistType.All, id: market.abbreviation, name: this.getMarketBuiltinWatchlistsName(WatchlistType.All, market) };
            var builtinWatchlists_1 = [allMarketWatchlist];
            builtinWatchlists_1.push({ type: WatchlistType.Indices, id: market.abbreviation + '.IDX', name: this.getMarketBuiltinWatchlistsName(WatchlistType.Indices, market) });
            market.companies.forEach(function (company) {
                if (company.index && !company.generalIndex) {
                    builtinWatchlists_1.push({ type: WatchlistType.Sector, id: company.symbol, name: company.name, sectorId: company.categoryId });
                }
            });
            this.marketBuiltinWatchlist[market.abbreviation] = builtinWatchlists_1;
        }
    };
    WatchlistService.prototype.getMarketBuiltinWatchlistsName = function (type, market) {
        var name = '';
        if (type == WatchlistType.All) {
            name = this.languageService.translate('جميع الأسهم');
        }
        else if (type == WatchlistType.Indices) {
            name = this.languageService.translate('جميع المؤشرات');
        }
        return name;
    };
    WatchlistService.prototype.syncCloudWatchlistsWithUserDefinedOnes = function (deletedServerWatchlists, activeServerWatchlists) {
        var _this = this;
        var syncChanged = false;
        deletedServerWatchlists.forEach(function (serverWatchlistId) {
            var userDefinedWatchlist = _this.getUserDefined(serverWatchlistId);
            if (userDefinedWatchlist) {
                remove(_this.userDefinedWatchlists, function (w) { return w === userDefinedWatchlist; });
                TcTracker.trackDeleteSyncCloudWatchlist();
                syncChanged = true;
            }
        });
        activeServerWatchlists.forEach(function (serverWatchlist) {
            var userDefinedWatchlist = _this.getUserDefined(serverWatchlist.id);
            if (!userDefinedWatchlist) {
                _this.userDefinedWatchlists.push({
                    type: WatchlistType.UserDefined,
                    id: serverWatchlist.id,
                    name: serverWatchlist.name,
                    symbols: serverWatchlist.symbols
                });
                TcTracker.trackCreateSyncCloudWatchlist();
                syncChanged = true;
            }
            else {
                var needsUpdate = (userDefinedWatchlist.name != serverWatchlist.name) ||
                    !isEqual(userDefinedWatchlist.symbols, serverWatchlist.symbols);
                if (needsUpdate) {
                    userDefinedWatchlist.name = serverWatchlist.name;
                    userDefinedWatchlist.symbols = serverWatchlist.symbols;
                    TcTracker.trackUpdateSyncCloudWatchlist();
                    syncChanged = true;
                }
            }
        });
        this.getUserDefinedWatchlists().slice(0).forEach(function (userDefinedWatchlist) {
            if (!activeServerWatchlists.find(function (w) { return w.id == userDefinedWatchlist.id; })) {
                remove(_this.userDefinedWatchlists, function (w) { return w === userDefinedWatchlist; });
                TcTracker.trackDeleteNonSyncedCloudWatchlist();
                syncChanged = true;
            }
        });
        if (syncChanged) {
            this.save();
        }
        return syncChanged;
    };
    WatchlistService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LanguageService,
            WatchlistLoader,
            SharedChannel])
    ], WatchlistService);
    return WatchlistService;
}());
export { WatchlistService };
//# sourceMappingURL=watchlist.service.js.map