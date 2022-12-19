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
import { TcTracker } from "../../../utils/index";
import { StreamerLoader } from '../../loader/index';
import { HeartbeatManager } from "./heartbeat-manager";
import { SharedChannel, ChannelRequestType } from "../../shared-channel/index";
import { GeneralPurposeStreamer } from "./general-purpose-streamer.service";
import { DebugModeService } from '../../debug-mode/index';
import { TechnicalReportsStreamer } from './technical-reports-streamer.service';
var Streamer = (function () {
    function Streamer(streamerLoader, sharedChannel, debugModeService) {
        this.streamerLoader = streamerLoader;
        this.sharedChannel = sharedChannel;
        this.debugModeService = debugModeService;
        this.marketStreamers = {};
        this.technicalIndicatorStreamer = {};
        this.heartbeatManager = new HeartbeatManager(this);
        this.generalPurposeStreamer = new GeneralPurposeStreamer(this.heartbeatManager);
        this.technicalReportsStreamer = new TechnicalReportsStreamer(this.heartbeatManager);
    }
    Streamer.prototype.onDestroy = function () {
        this.heartbeatManager.disconnect();
        Object.values(this.marketStreamers).forEach(function (marketStreamer) {
            marketStreamer.onDestroy();
        });
        Object.values(this.technicalIndicatorStreamer).forEach(function (technicalIndicatorStream) {
            technicalIndicatorStream.onDestroy();
        });
        this.generalPurposeStreamer.onDestroy();
    };
    Streamer.prototype.getGeneralPurposeStreamer = function () {
        return this.generalPurposeStreamer;
    };
    Streamer.prototype.getTechnicalReportsStreamer = function () {
        return this.technicalReportsStreamer;
    };
    Streamer.prototype.getTechnicalIndicatorStream = function (market) {
        var indicatorMarket = 'I_' + market;
        return this.technicalIndicatorStreamer[indicatorMarket];
    };
    Streamer.prototype.subscribeQuote = function (market, symbol) {
        this.marketStreamers[market].subscribeQuote(symbol);
    };
    Streamer.prototype.subscribeQuotes = function (market, symbols) {
        this.marketStreamers[market].subscribeQuotes(symbols);
    };
    Streamer.prototype.unSubscribeQuote = function (market, symbol) {
        this.marketStreamers[market].unSubscribeQuote(symbol);
    };
    Streamer.prototype.unSubscribeQuotes = function (market, symbols) {
        this.marketStreamers[market].unSubscribeQuotes(symbols);
    };
    Streamer.prototype.subscribeTimeAndSale = function (market, symbol) {
        this.marketStreamers[market.abbreviation].subscribeTimeAndSale(symbol);
    };
    Streamer.prototype.unSubscribeTimeAndSale = function (market, symbol) {
        this.marketStreamers[market.abbreviation].unSubscribeTimeAndSale(symbol);
    };
    Streamer.prototype.subscribeChartIntraday = function (market, symbol) {
        this.marketStreamers[market.abbreviation].subscribeChartIntrday(symbol);
    };
    Streamer.prototype.unSubscribeChartIntraday = function (market, symbol) {
        this.marketStreamers[market.abbreviation].unSubscribeChartIntrday(symbol);
    };
    Streamer.prototype.subscribeChartDaily = function (market, symbol) {
        this.marketStreamers[market.abbreviation].subscribeChartDaily(symbol);
    };
    Streamer.prototype.unSubscribeChartDaily = function (market, symbol) {
        this.marketStreamers[market.abbreviation].unSubscribeChartDaily(symbol);
    };
    Streamer.prototype.subscribeMarketSummary = function (market) {
        this.marketStreamers[market].subscribeMarketSummary();
    };
    Streamer.prototype.subscribeMarketDepthByOrder = function (market, symbol) {
        this.marketStreamers[market.abbreviation].subscribeMarketDepthByOrder(symbol);
    };
    Streamer.prototype.subscribeMarketDepthByPrice = function (market, symbol) {
        this.marketStreamers[market.abbreviation].subscribeMarketDepthByPrice(symbol);
    };
    Streamer.prototype.subscribeMarketAlerts = function (market) {
        this.marketStreamers[market].subscribeMarketAlerts();
    };
    Streamer.prototype.subscribeBigTrade = function (market) {
        this.marketStreamers[market].subscribeBigTrade();
    };
    Streamer.prototype.getQuoteMessageStream = function (market) {
        return this.marketStreamers[market].getQuoteMessageStream();
    };
    Streamer.prototype.getTimeAndSaleMessageStream = function (market) {
        return this.marketStreamers[market].getTimeAndSaleMessageStream();
    };
    Streamer.prototype.getChartIntradayMessageStream = function (market) {
        return this.marketStreamers[market].getChartIntradayMessageStream();
    };
    Streamer.prototype.getChartDailyMessageStream = function (market) {
        return this.marketStreamers[market].getChartDailyMessageStream();
    };
    Streamer.prototype.getMarketSummaryStream = function (market) {
        return this.marketStreamers[market].getMarketSummaryStream();
    };
    Streamer.prototype.getMarketDepthByOrderStream = function (market) {
        return this.marketStreamers[market].getMarketDepthByOrderStream();
    };
    Streamer.prototype.getMarketAlertStream = function (market) {
        return this.marketStreamers[market].getMarketAlertStream();
    };
    Streamer.prototype.getBigTradeStream = function (market) {
        return this.marketStreamers[market].getBigTradeStream();
    };
    Streamer.prototype.onHeartbeatTimeout = function (market) {
        var _this = this;
        this.streamerLoader.loadStreamerUrl(market).subscribe(function (url) {
            _this.initStreamerChannel(market, url);
            TcTracker.trackHeartbeatReloading(market);
            var forceScreenReloadRequest = {
                type: ChannelRequestType.ForceScreenReload,
                market: market
            };
            _this.sharedChannel.request(forceScreenReloadRequest);
        });
    };
    Streamer.prototype.initStreamerChannel = function (market, url) {
        if (market === 'GP')
            this.generalPurposeStreamer.reInitChannel(url);
        else if (market === 'TECHNICAL_REPORTS')
            this.technicalReportsStreamer.reInitChannel(url);
        else if (market.startsWith('I_'))
            this.technicalIndicatorStreamer[market].reInitChannel(url);
        else
            this.marketStreamers[market].reInitChannel(url);
    };
    Streamer = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [StreamerLoader,
            SharedChannel,
            DebugModeService])
    ], Streamer);
    return Streamer;
}());
export { Streamer };
//# sourceMappingURL=streamer.service.js.map