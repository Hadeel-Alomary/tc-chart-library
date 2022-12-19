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
import { Subject } from 'rxjs';
import { TechnicalScopeSignal } from './technical-scope-signal';
import { Interval, TechnicalScopeLoader } from '../loader';
import { map } from 'rxjs/operators';
var TechnicalScopeService = (function () {
    function TechnicalScopeService(streamer, technicalScopeLoader) {
        this.streamer = streamer;
        this.technicalScopeLoader = technicalScopeLoader;
        this.streamerSubscription = new Subject();
        this.subscribedTopics = {};
        this.subscribeToStreamerMessages();
    }
    TechnicalScopeService.prototype.getOnStreamDataSubscription = function () {
        return this.streamerSubscription;
    };
    TechnicalScopeService.prototype.loadHistoricalData = function (interval, market) {
        var _this = this;
        return this.technicalScopeLoader.loadTechnicalScopeHistoricalData(this.getServerInterval(interval), market.abbreviation)
            .pipe(map(function (message) { return _this.processHistoricalData(message); }));
    };
    TechnicalScopeService.prototype.processHistoricalData = function (messages) {
        var historicalData = [];
        messages.forEach(function (message) {
        });
        return historicalData;
    };
    TechnicalScopeService.prototype.getTechnicalScopeStrategies = function () {
        return TechnicalScopeSignal.getTechnicalScopeStrategies();
    };
    TechnicalScopeService.prototype.subscribeTopic = function (interval, marketAbbr) {
        var topic = this.getTopic(interval, marketAbbr);
        if (Object.keys(this.subscribedTopics).includes(topic)) {
            this.subscribedTopics[topic]++;
        }
        else {
            this.subscribedTopics[topic] = 1;
        }
        if (this.subscribedTopics[topic] == 1) {
            this.streamer.getGeneralPurposeStreamer().subscribeTechnicalScope(this.getServerInterval(interval), marketAbbr);
        }
    };
    TechnicalScopeService.prototype.unsubscribeTopic = function (interval, marketAbbr) {
        var topic = this.getTopic(interval, marketAbbr);
        if (Object.keys(this.subscribedTopics).includes(topic)) {
            this.subscribedTopics[topic]--;
        }
        if (this.subscribedTopics[topic] == 0) {
            this.streamer.getGeneralPurposeStreamer().unSubscribeTechnicalScope(this.getServerInterval(interval), marketAbbr);
        }
    };
    TechnicalScopeService.prototype.getTopic = function (interval, marketAbbr) {
        return this.getServerInterval(interval) + '.num-alerts.' + marketAbbr;
    };
    TechnicalScopeService.prototype.getServerInterval = function (interval) {
        return Interval.toAlertServerInterval(interval.type);
    };
    TechnicalScopeService.prototype.subscribeToStreamerMessages = function () {
        var _this = this;
        this.streamer.getGeneralPurposeStreamer().getTechnicalScopeStreamer()
            .subscribe(function (message) { return _this.onStreamerMessage(message); });
    };
    TechnicalScopeService.prototype.onStreamerMessage = function (message) {
        this.streamerSubscription.next(this.getTechnicalScopeMessage(message));
    };
    TechnicalScopeService.prototype.getTechnicalScopeMessage = function (message) {
        var company = null;
        return TechnicalScopeSignal.formatTechnicalScopeSignal(company, message);
    };
    TechnicalScopeService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Streamer, TechnicalScopeLoader])
    ], TechnicalScopeService);
    return TechnicalScopeService;
}());
export { TechnicalScopeService };
//# sourceMappingURL=technical-scope.service.js.map