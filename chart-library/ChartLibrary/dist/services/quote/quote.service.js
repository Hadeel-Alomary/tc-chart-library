var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { Quote, Quotes } from "./quote";
import { BehaviorSubject, Subject } from "rxjs";
import { Tc, MarketUtils } from '../../utils/index';
import { AlertService } from "../alert/index";
import { NewsService } from '../news/index';
import { AnalysisCenterService } from '../analysis-center/index';
import { Streamer } from "../streaming/index";
import { ChannelRequestType, SharedChannel } from '../shared-channel';
import { LanguageService } from '../language';
import { TechnicalScopeQuoteService, TechnicalIndicatorQuoteService } from '../technical-indicator';
var QuoteService = (function () {
    function QuoteService(alertService, newsService, technicalIndicatorQuoteService, technicalScopeQuoteService, streamer, analysisCenterService, languageService, sharedChannel) {
        this.alertService = alertService;
        this.newsService = newsService;
        this.technicalIndicatorQuoteService = technicalIndicatorQuoteService;
        this.technicalScopeQuoteService = technicalScopeQuoteService;
        this.streamer = streamer;
        this.analysisCenterService = analysisCenterService;
        this.languageService = languageService;
        this.sharedChannel = sharedChannel;
        this.snapshotReceived = false;
        this.snapshotTimerStarted = false;
        this.subscribedSymbol = {};
        this.snapshotStream = new BehaviorSubject(null);
        this.updateStream = new Subject();
        Quotes.quotes = new Quotes();
    }
    QuoteService_1 = QuoteService;
    QuoteService.prototype.getSnapshotStream = function () {
        return this.snapshotStream;
    };
    QuoteService.prototype.getUpdateStream = function () {
        return this.updateStream;
    };
    QuoteService.prototype.getQuotes = function () {
        return Quotes.quotes;
    };
    QuoteService.prototype.subscribeOnUpdaters = function (streamerUpdater, newsUpdater, alertUpdater, analysisUpdater, technicalIndicatorQuoteUpdater, technicalScopeQuoteUpdater) {
        var _this = this;
        streamerUpdater.getQuoteUpdaterStream()
            .subscribe(function (symbol) {
            _this.pushQuoteUpdate(symbol);
        });
        newsUpdater.getQuoteUpdaterStream()
            .subscribe(function (symbol) {
            _this.pushQuoteUpdate(symbol);
        });
        alertUpdater.getQuoteUpdaterStream()
            .subscribe(function (symbol) {
            _this.pushQuoteUpdate(symbol);
        });
        analysisUpdater.getQuoteUpdaterStream()
            .subscribe(function (symbol) {
            _this.pushQuoteUpdate(symbol);
        });
        technicalIndicatorQuoteUpdater.getQuoteUpdaterStream()
            .subscribe(function (symbol) {
            _this.pushQuoteUpdate(symbol);
        });
        technicalScopeQuoteUpdater.getQuoteUpdaterStream()
            .subscribe(function (symbol) {
            _this.pushQuoteUpdate(symbol);
        });
    };
    QuoteService.prototype.pushQuoteUpdate = function (symbol) {
        if (this.snapshotReceived) {
            this.updateStream.next(symbol);
        }
        else if (!this.snapshotTimerStarted) {
            this.startSnapshotTimer();
        }
    };
    QuoteService.prototype.createQuotes = function (market) {
        var _this = this;
        market.sortedCompanies.forEach(function (company) { return _this.createQuote(market, company); });
    };
    QuoteService.prototype.createQuote = function (market, company) {
        var companyFlag = market.companyFlags.find(function (companyFlag) { return companyFlag.symbol == company.symbol; });
        var sector = market.sectors.find(function (sector) { return sector.id == company.categoryId; });
        var quote = new Quote(company, market.abbreviation, companyFlag, sector, true);
        Tc.assert(!(company.symbol in Quotes.quotes.data), "attempt to insert duplicates of symbol: " + company.symbol);
        Quotes.quotes.data[company.symbol] = quote;
        Quotes.quotes.list.push(quote);
    };
    QuoteService.prototype.startSnapshotTimer = function () {
        var _this = this;
        this.snapshotTimerStarted = true;
        setTimeout(function () {
            _this.snapshotReceived = true;
            _this.snapshotStream.next(Quotes.quotes);
        }, QuoteService_1.SNAPSHOT_WAIT_TIME_PER_MARKET * 1);
    };
    QuoteService.prototype.subscribeQuote = function (symbol) {
        if (symbol) {
            this.subscribeQuotes([symbol]);
        }
    };
    QuoteService.prototype.subscribeQuotes = function (symbols) {
        var _this = this;
        var newSymbols = [];
        symbols.forEach(function (symbol) {
            if (Object.keys(_this.subscribedSymbol).includes(symbol)) {
                _this.subscribedSymbol[symbol]++;
            }
            else {
                newSymbols.push(symbol);
            }
        });
        if (newSymbols.length > 0) {
            var needToSubscribe_1 = this.groupSymbolsByMarket(newSymbols);
            var subscribedSymbolsMarket_1 = this.groupSymbolsByMarket(Object.keys(this.subscribedSymbol));
            Object.keys(needToSubscribe_1).forEach(function (marketAbrv) {
                var subscriptionCount = subscribedSymbolsMarket_1[marketAbrv] ? subscribedSymbolsMarket_1[marketAbrv].length + needToSubscribe_1[marketAbrv].length : 0;
                if (subscriptionCount > 700) {
                    _this.showExceedMessage(null);
                    return;
                }
                else {
                    needToSubscribe_1[marketAbrv].forEach(function (symbol) { return _this.subscribedSymbol[symbol] = 1; });
                    _this.streamer.subscribeQuotes(marketAbrv, needToSubscribe_1[marketAbrv]);
                }
            });
        }
    };
    QuoteService.prototype.unSubscribeQuote = function (symbol) {
        if (symbol) {
            this.unSubscribeQuotes([symbol]);
        }
    };
    QuoteService.prototype.unSubscribeQuotes = function (symbols) {
        var _this = this;
        var newSymbols = [];
        symbols.forEach(function (symbol) {
            if (symbol) {
                if (Object.keys(_this.subscribedSymbol).includes(symbol)) {
                    _this.subscribedSymbol[symbol]--;
                }
                if (_this.subscribedSymbol[symbol] == 0) {
                    delete _this.subscribedSymbol[symbol];
                    newSymbols.push(symbol);
                }
            }
        });
        if (newSymbols.length > 0) {
            var needToUnSubscribe_1 = this.groupSymbolsByMarket(newSymbols);
            Object.keys(needToUnSubscribe_1).forEach(function (marketAbrv) {
                _this.streamer.unSubscribeQuotes(marketAbrv, needToUnSubscribe_1[marketAbrv]);
            });
        }
    };
    QuoteService.prototype.groupSymbolsByMarket = function (symbols) {
        var symbolsByMarket = {};
        symbols.forEach(function (symbol) {
            var marketAbbr = MarketUtils.marketAbbr(symbol);
            if (!Object.keys(symbolsByMarket).includes(marketAbbr)) {
                symbolsByMarket[marketAbbr] = [symbol];
            }
            else {
                symbolsByMarket[marketAbbr].push(symbol);
            }
        });
        return symbolsByMarket;
    };
    QuoteService.prototype.showExceedMessage = function (marketName) {
        var message = this.languageService.translate('اشتراكك الحالي يدعم متابعة (700) شركة في') + ' ' + marketName;
        var message2 = this.languageService.translate('الرجاء حذف بعض الشركات الحالية لتتمكن من متابعة شركات أخرى .');
        var request = { type: ChannelRequestType.MessageBox, messageLine: message, messageLine2: message2 };
        this.sharedChannel.request(request);
    };
    var QuoteService_1;
    QuoteService.SNAPSHOT_WAIT_TIME_PER_MARKET = 500;
    QuoteService = QuoteService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AlertService,
            NewsService,
            TechnicalIndicatorQuoteService,
            TechnicalScopeQuoteService,
            Streamer,
            AnalysisCenterService,
            LanguageService,
            SharedChannel])
    ], QuoteService);
    return QuoteService;
}());
export { QuoteService };
//# sourceMappingURL=quote.service.js.map