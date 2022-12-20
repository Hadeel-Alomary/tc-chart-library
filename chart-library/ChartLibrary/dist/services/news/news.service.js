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
import { MarketSummaryService, MarketSummaryStatus } from '../market-summary/index';
import { News } from './news';
import { of } from 'rxjs/internal/observable/of';
import { tap } from 'rxjs/operators';
import { NewsLoader } from "../../services/loader/news-loader";
var remove = require("lodash/remove");
var NewsService = (function () {
    function NewsService(marketSummaryService, newsLoader, streamer) {
        var _this = this;
        this.marketSummaryService = marketSummaryService;
        this.newsLoader = newsLoader;
        this.marketCategoryNews = {};
        this.newsTitles = {};
        this.newsStreamer = new Subject();
        this.newsCache = [];
        marketSummaryService.getMarketStatusChangeStream().subscribe(function (status) { return _this.onMarketStatusChange(status); });
    }
    NewsService.prototype.getNewsStreamer = function () {
        return this.newsStreamer;
    };
    NewsService.prototype.loadNewsTitle = function (newsId) {
        var _this = this;
        var title = this.getNewsTitle(newsId);
        if (title) {
            return of(title);
        }
        return this.newsLoader.loadNewsTitle(newsId).pipe(tap(function (title) {
            _this.newsTitles[newsId] = title;
        }));
    };
    NewsService.prototype.getNewsTitle = function (newsId) {
        return this.newsTitles[newsId];
    };
    NewsService.prototype.getCategoryNews = function (marketId, category) {
        var _this = this;
        var key = marketId + "." + category;
        if (Object.keys(this.marketCategoryNews).indexOf(key) > -1) {
            return of(this.marketCategoryNews[key]);
        }
        return this.newsLoader.loadCategoryNews(marketId, category).pipe(tap(function (categoryNews) {
            _this.marketCategoryNews[key] = categoryNews;
        }));
    };
    NewsService.prototype.markAsViewed = function (news) {
        if (!news.viewed) {
            news.viewed = true;
            this.newsStreamer.next(news);
        }
    };
    NewsService.prototype.onStreamerMessage = function (message) {
        var market = null;
        var news = News.fromStreamer(message, market);
        if (news.deleted) {
            remove(this.newsCache, function (n) { return n.id == news.id; });
            this.newsStreamer.next(news);
            return;
        }
        this.newsCache.push(news);
        this.newsStreamer.next(news);
    };
    NewsService.prototype.onMarketStatusChange = function (marketSummary) {
        var _this = this;
        var deletedNews = remove(this.newsCache, function (news) { return news.date != marketSummary.date; });
        deletedNews.forEach(function (news) {
            news.deleted = true;
            _this.newsStreamer.next(news);
        });
        if (marketSummary.status == MarketSummaryStatus.OPEN) {
        }
    };
    NewsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [MarketSummaryService,
            NewsLoader,
            Streamer])
    ], NewsService);
    return NewsService;
}());
export { NewsService };
//# sourceMappingURL=news.service.js.map