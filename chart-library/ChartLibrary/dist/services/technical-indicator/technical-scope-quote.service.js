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
import { BehaviorSubject } from 'rxjs';
import { Streamer } from '../streaming/streamer';
import { MarketUtils } from '../../utils';
var TechnicalScopeQuoteService = (function () {
    function TechnicalScopeQuoteService(streamer) {
        var _this = this;
        this.streamer = streamer;
        this.subscribedTopics = {};
        this.technicalScopeMessage = new BehaviorSubject(null);
        this.streamer.getGeneralPurposeStreamer().getTechnicalScopeQuoteStreamer()
            .subscribe(function (message) { return _this.onStreamingMessage(message); });
    }
    TechnicalScopeQuoteService.prototype.getTechnicalScopeQuoteStream = function () {
        return this.technicalScopeMessage;
    };
    TechnicalScopeQuoteService.prototype.onStreamingMessage = function (message) {
        this.technicalScopeMessage.next(message);
    };
    TechnicalScopeQuoteService.prototype.subscribeTopic = function (symbols) {
        var _this = this;
        var newTopics = [];
        symbols.forEach(function (symbol) {
            var topicSegments = MarketUtils.splitTopic(symbol);
            var symbolWithoutMarket = topicSegments[0];
            var marketAbbr = topicSegments[2];
            var topic = "NA.".concat(symbolWithoutMarket, "_1day.").concat(marketAbbr);
            if (Object.keys(_this.subscribedTopics).includes(topic)) {
                _this.subscribedTopics[topic]++;
            }
            else {
                _this.subscribedTopics[topic] = 1;
            }
            if (_this.subscribedTopics[topic] == 1) {
                newTopics.push(topic);
            }
        });
        if (newTopics.length > 0) {
            this.streamer.getGeneralPurposeStreamer().subscribeTechnicalScopeQuote(newTopics);
        }
    };
    TechnicalScopeQuoteService.prototype.unSubscribeTopic = function (symbols) {
        var _this = this;
        var newTopics = [];
        symbols.forEach(function (symbol) {
            var topicSegments = MarketUtils.splitTopic(symbol);
            var symbolWithoutMarket = topicSegments[0];
            var marketAbbr = topicSegments[2];
            var topic = "NA.".concat(symbolWithoutMarket, "_1day.").concat(marketAbbr);
            if (Object.keys(_this.subscribedTopics).includes(topic)) {
                _this.subscribedTopics[topic]--;
            }
            if (_this.subscribedTopics[topic] == 0) {
                newTopics.push(topic);
                delete _this.subscribedTopics[topic];
            }
        });
        if (newTopics.length > 0) {
            this.streamer.getGeneralPurposeStreamer().unSubscribeTechnicalScopeQuote(newTopics);
        }
    };
    TechnicalScopeQuoteService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Streamer])
    ], TechnicalScopeQuoteService);
    return TechnicalScopeQuoteService;
}());
export { TechnicalScopeQuoteService };
//# sourceMappingURL=technical-scope-quote.service.js.map