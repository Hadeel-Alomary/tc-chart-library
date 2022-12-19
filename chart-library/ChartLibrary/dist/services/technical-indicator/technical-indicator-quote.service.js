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
import { Streamer } from '../streaming/streamer';
import { BehaviorSubject } from 'rxjs';
var TechnicalIndicatorQuoteService = (function () {
    function TechnicalIndicatorQuoteService(streamer) {
        this.streamer = streamer;
        this.subscribedTopics = {};
        this.technicalIndicatorUpdateStream = new BehaviorSubject(null);
    }
    TechnicalIndicatorQuoteService.prototype.getTechnicalIndicatorUpdateStream = function () {
        return this.technicalIndicatorUpdateStream;
    };
    TechnicalIndicatorQuoteService.prototype.onMarketData = function (market) {
        var _this = this;
        this.streamer.getTechnicalIndicatorStream(market.abbreviation).getTechnicalIndicator()
            .subscribe(function (message) { return _this.onReceivingTechnicalIndicatorMessage(message); });
    };
    TechnicalIndicatorQuoteService.prototype.onReceivingTechnicalIndicatorMessage = function (message) {
        this.technicalIndicatorUpdateStream.next(message);
    };
    TechnicalIndicatorQuoteService.prototype.subscribeTopic = function (market, colTopic) {
        var topic = 'I.' + colTopic + '.' + market;
        if (Object.keys(this.subscribedTopics).includes(topic)) {
            this.subscribedTopics[topic]++;
        }
        else {
            this.subscribedTopics[topic] = 1;
        }
        if (this.subscribedTopics[topic] == 1) {
            this.streamer.getTechnicalIndicatorStream(market).subscribeTechnicalIndicatorTopic(topic);
        }
    };
    TechnicalIndicatorQuoteService.prototype.unSubscribeTopic = function (market, colTopic) {
        var topic = 'I.' + colTopic + '.' + market;
        if (Object.keys(this.subscribedTopics).includes(topic)) {
            this.subscribedTopics[topic]--;
        }
        if (this.subscribedTopics[topic] == 0) {
            this.streamer.getTechnicalIndicatorStream(market).unSubscribeTechnicalIndicatorTopic(topic);
            delete this.subscribedTopics[topic];
        }
    };
    TechnicalIndicatorQuoteService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Streamer])
    ], TechnicalIndicatorQuoteService);
    return TechnicalIndicatorQuoteService;
}());
export { TechnicalIndicatorQuoteService };
//# sourceMappingURL=technical-indicator-quote.service.js.map