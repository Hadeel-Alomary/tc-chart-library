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
import { Subject } from 'rxjs';
import { Streamer } from '../streaming/index';
import { AnalysisCenterLoaderService } from "../../services/loader/analysis-center-loader";
var AnalysisCenterService = (function () {
    function AnalysisCenterService(streamer, analysisCenterLoaderService) {
        this.analysisCenterLoaderService = analysisCenterLoaderService;
        this.analysisStreamer = new Subject();
    }
    AnalysisCenterService.prototype.getAnalysisStreamer = function () {
        return this.analysisStreamer;
    };
    AnalysisCenterService.prototype.analysisByAnalyzer = function (marketId, nickName, sortType, pageNumber) {
        return this.analysisCenterLoaderService.getAnalysesByAnalyst(marketId, nickName, sortType, pageNumber);
    };
    AnalysisCenterService.prototype.analysisByMarket = function (marketId, sortType, pageNumber) {
        return this.analysisCenterLoaderService.getAnalysesByMarket(marketId, sortType, pageNumber);
    };
    AnalysisCenterService.prototype.getAnalyzersList = function (marketId) {
        return this.analysisCenterLoaderService.getAnalystsList(marketId);
    };
    AnalysisCenterService.prototype.communityHomePageUrl = function () {
        return this.analysisCenterLoaderService.getCommunityHomePageUrl();
    };
    AnalysisCenterService.prototype.communityIdeasUrl = function (ideaId) {
        return this.analysisCenterLoaderService.getCommunityIdeasUrl(ideaId);
    };
    AnalysisCenterService.prototype.communityCompaniesUrl = function (companyId) {
        return this.analysisCenterLoaderService.getCommunityCompaniesUrl(companyId);
    };
    AnalysisCenterService.prototype.communityUsersUrl = function (nickName) {
        return this.analysisCenterLoaderService.getCommunityUsersUrl(nickName);
    };
    AnalysisCenterService.prototype.communityMarketIdeasUrl = function (marketId) {
        return this.analysisCenterLoaderService.getCommunityMarketIdeasUrl(marketId);
    };
    AnalysisCenterService.prototype.markAnalysisAsViewed = function (analysis) {
        if (!analysis.viewed) {
            analysis.viewed = true;
            this.analysisStreamer.next(analysis);
        }
    };
    AnalysisCenterService.prototype.onStreamerMessage = function (message) {
        this.analysisStreamer.next(this.analysisCenterLoaderService.mapStreamerMessageToAnalysis(message));
    };
    AnalysisCenterService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Streamer,
            AnalysisCenterLoaderService])
    ], AnalysisCenterService);
    return AnalysisCenterService;
}());
export { AnalysisCenterService };
//# sourceMappingURL=analysis-center.service.js.map