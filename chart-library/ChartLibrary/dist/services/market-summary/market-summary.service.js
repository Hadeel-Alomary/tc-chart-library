var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Streamer } from "../streaming/index";
import { MarketSummary } from "./market-summary";
import { Subject, BehaviorSubject } from "rxjs";
import { Tc } from "../../utils/index";
import { Injectable } from "@angular/core";
var MarketSummaryService = (function () {
    function MarketSummaryService(streamer) {
        this.streamer = streamer;
        this.marketSnapshots = {};
        this.marketSummaryStream = new BehaviorSubject(null);
        this.marketStatusChangeStream = new Subject();
    }
    MarketSummaryService.prototype.getMarketSummaryStream = function () {
        return this.marketSummaryStream;
    };
    MarketSummaryService.prototype.getMarketStatusChangeStream = function () {
        return this.marketStatusChangeStream;
    };
    MarketSummaryService.prototype.getSnapshot = function (marketAbbreviation) {
        return this.marketSnapshots[marketAbbreviation];
    };
    MarketSummaryService.prototype.setSelectedMarket = function (market) {
    };
    MarketSummaryService.prototype.onReceivingMarketSummaryMessage = function (message) {
        var marketSummary = new MarketSummary(message.market, message.date, message.time, +message.trades, +message.volume, +message.value, +message.change, +message.pchange, +message.index, +message.liq, message.status, +message.totaltraded, +message.advances, +message.declined, +message.nochange);
        this.marketSnapshots[marketSummary.market] = marketSummary;
        var selectedMarketAbbreviation = null;
        if (selectedMarketAbbreviation == marketSummary.market) {
            this.streamStatusOnChange(marketSummary);
            this.marketSummaryStream.next(marketSummary);
        }
    };
    MarketSummaryService.prototype.streamStatusOnChange = function (marketSummary) {
        if (!this.lastMarketStatus) {
            this.lastMarketStatus = marketSummary.status;
        }
        if (this.lastMarketStatus != marketSummary.status) {
            this.lastMarketStatus = marketSummary.status;
            this.marketStatusChangeStream.next(marketSummary);
        }
    };
    MarketSummaryService.prototype.onMarketData = function (market) {
        var _this = this;
        this.streamer.subscribeMarketSummary(market.abbreviation);
        this.streamer.getMarketSummaryStream(market.abbreviation)
            .subscribe(function (message) { return _this.onReceivingMarketSummaryMessage(message); }, function (error) { return Tc.error(error); });
    };
    MarketSummaryService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Streamer])
    ], MarketSummaryService);
    return MarketSummaryService;
}());
export { MarketSummaryService };
//# sourceMappingURL=market-summary.service.js.map