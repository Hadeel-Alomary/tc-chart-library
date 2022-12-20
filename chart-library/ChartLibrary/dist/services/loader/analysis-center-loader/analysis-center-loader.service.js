var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { HttpClient } from '@angular/common/http';
import { ProxyService } from '../../loader/index';
import { Analyzer, } from '../../analysis-center/analysis';
import { map } from 'rxjs/operators';
import { Tc } from '../../../utils/index';
import { LanguageService } from '../../index';
import { ProxiedUrlLoader } from '../proxied-url-loader';
import { Interval } from '.././price-loader/interval';
import { LoaderConfig, LoaderUrlType } from '../../loader';
import { AnalysisSortType, AuthorType } from "../../../data-types/types";
var AnalysisCenterLoaderService = (function (_super) {
    __extends(AnalysisCenterLoaderService, _super);
    function AnalysisCenterLoaderService(http, proxyService, languageService) {
        var _this = _super.call(this, proxyService) || this;
        _this.http = http;
        _this.proxyService = proxyService;
        _this.languageService = languageService;
        return _this;
    }
    AnalysisCenterLoaderService.prototype.getAnalystsList = function (marketId) {
        var _this = this;
        var url = null;
        Tc.info('analyzers list url: ' + url);
        return this.http.get(url)
            .pipe(map(function (response) {
            Tc.assert(response.success, 'fail to get analyzers list');
            return _this.processAnalyzers(response.response.profiles);
        }));
    };
    AnalysisCenterLoaderService.prototype.getAnalysesByAnalyst = function (marketId, nickName, sortType, pageNumber) {
        var _this = this;
        var basicUrl = '';
        var url = basicUrl.replace('{0}', "" + marketId);
        url = url.replace('{1}', "" + this.getSortTypeAsString(sortType));
        url = url.replace('{2}', "" + pageNumber);
        url = url + ("?analyst=" + nickName);
        Tc.info('analysis search url: ' + url);
        return this.http.get(url)
            .pipe(map(function (response) {
            Tc.assert(response.success, 'fail on analysis search');
            return _this.processAnalyses(response.response.ideas);
        }));
    };
    AnalysisCenterLoaderService.prototype.getAnalysesByMarket = function (marketId, sortType, pageNumber) {
        var _this = this;
        var basicUrl = '';
        var url = basicUrl.replace('{0}', "" + marketId);
        url = url.replace('{1}', "" + this.getSortTypeAsString(sortType));
        url = url.replace('{2}', "" + pageNumber);
        Tc.info('analysis search by market url: ' + url);
        return this.http.get(url)
            .pipe(map(function (response) {
            Tc.assert(response.success, 'fail on analysis search by market');
            return _this.processAnalyses(response.response.ideas);
        }));
    };
    AnalysisCenterLoaderService.prototype.processAnalyzers = function (profiles) {
        var analyzers = [];
        for (var _i = 0, profiles_1 = profiles; _i < profiles_1.length; _i++) {
            var profile = profiles_1[_i];
            var analyzer = new Analyzer(profile.name, profile.nick_name);
            analyzers.push(analyzer);
        }
        return analyzers;
    };
    AnalysisCenterLoaderService.prototype.processAnalyses = function (ideas) {
        var analysis = [];
        for (var _i = 0, ideas_1 = ideas; _i < ideas_1.length; _i++) {
            var value = ideas_1[_i];
            var item = {
                id: value.name,
                title: value.title,
                description: value.description,
                created: moment(value.created).format('YYYY-MM-DD'),
                url: value.url,
                thumbnailUrl: value.thumbnail,
                videoUrl: value.video_url,
                nickName: value.nick_name,
                profileName: value.profile_name,
                authorType: this.getAuthorType(value.user_type),
                avatarUrl: value.avatar,
                views: value.views,
                likes: value.likes,
                comments: value.comments,
                followers: value.followers,
                deleted: false,
                viewed: false,
                symbol: this.getCompanyById(value.company_id).symbol,
                company: this.getCompanyById(value.company_id),
                intervalName: Interval.getIntervalNameFromCommunityServerMessage(value.interval_name, value.interval_repeat, this.languageService),
            };
            if (item.company) {
                analysis.push(item);
            }
        }
        return analysis;
    };
    AnalysisCenterLoaderService.prototype.mapStreamerMessageToAnalysis = function (message) {
        return {
            id: message.name,
            title: message.title,
            description: message.description,
            created: moment(message.created).format('YYYY-MM-DD'),
            url: message.url,
            thumbnailUrl: message.thumbnail,
            videoUrl: message.video_url,
            nickName: message.nick_name,
            profileName: message.profile_name,
            authorType: this.getAuthorType(message.user_type),
            avatarUrl: message.avatar,
            views: message.views,
            likes: message.likes,
            comments: message.comments,
            followers: message.followers,
            deleted: false,
            viewed: false,
            symbol: this.getCompanyById(message.company_id).symbol,
            company: this.getCompanyById(message.company_id),
            intervalName: Interval.getIntervalNameFromCommunityServerMessage(message.interval_name, message.interval_repeat, this.languageService),
        };
    };
    AnalysisCenterLoaderService.prototype.getCompanyById = function (companyId) {
        return null;
    };
    AnalysisCenterLoaderService.prototype.getCommunityHomePageUrl = function () {
        return LoaderConfig.url(null, LoaderUrlType.CommunityHomePageUrl);
    };
    AnalysisCenterLoaderService.prototype.getCommunityIdeasUrl = function (ideaId) {
        var url = '';
        return url.replace('{1}', "" + ideaId);
    };
    AnalysisCenterLoaderService.prototype.getCommunityCompaniesUrl = function (companyId) {
        var url = '';
        return url.replace('{1}', "" + companyId);
    };
    AnalysisCenterLoaderService.prototype.getCommunityUsersUrl = function (nickName) {
        var url = '';
        return url.replace('{1}', "" + nickName);
    };
    AnalysisCenterLoaderService.prototype.getCommunityMarketIdeasUrl = function (marketId) {
        var url = '';
        return url.replace('{1}', "" + marketId);
    };
    AnalysisCenterLoaderService.prototype.getAuthorType = function (authorType) {
        switch (authorType) {
            case 'user':
                return { type: AuthorType.USER, arabicDescription: 'مستخدم', englishDescription: 'User', className: 'user' };
            case 'analyst':
                return { type: AuthorType.ANALYST, arabicDescription: 'محترف', englishDescription: 'PRO', className: 'analyst' };
            default:
                Tc.error("Invalid community author type " + authorType);
        }
    };
    AnalysisCenterLoaderService.prototype.getSortTypeAsString = function (sortType) {
        if (sortType == AnalysisSortType.Time)
            return 'time';
        if (sortType == AnalysisSortType.Popularity)
            return 'popularity';
    };
    AnalysisCenterLoaderService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient,
            ProxyService, LanguageService])
    ], AnalysisCenterLoaderService);
    return AnalysisCenterLoaderService;
}(ProxiedUrlLoader));
export { AnalysisCenterLoaderService };
//# sourceMappingURL=analysis-center-loader.service.js.map