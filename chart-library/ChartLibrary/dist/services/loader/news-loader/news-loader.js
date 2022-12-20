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
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Tc } from '../../../utils/index';
import { News } from '../../news/news';
import { map } from 'rxjs/operators';
import { CategoryNews } from '../../news/category-news';
import { ProxiedUrlLoader } from '../proxied-url-loader';
import { ProxyService } from "../../../services";
var NewsLoader = (function (_super) {
    __extends(NewsLoader, _super);
    function NewsLoader(http, proxyService) {
        var _this = _super.call(this, proxyService) || this;
        _this.http = http;
        _this.proxyService = proxyService;
        return _this;
    }
    NewsLoader.prototype.loadMarketNews = function (market) {
        var _this = this;
        var today = moment().format('YYYY-MM-DD');
        var lastWeek = moment().subtract(1, 'weeks').format('YYYY-MM-DD');
        var baseUrl = null;
        baseUrl = baseUrl.replace('{0}', market);
        var url = baseUrl + ("?from_date=" + lastWeek + "&to_date=" + today + "&keyword=&symbol=");
        Tc.info("market news url:" + url);
        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map(function (response) { return _this.onData(response); }));
    };
    NewsLoader.prototype.loadCompanyNews = function (symbol) {
        var _this = this;
        var url = null;
        url = url.replace('{0}', symbol);
        Tc.info("news url:" + url);
        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map(function (response) { return _this.onData(response); }));
    };
    NewsLoader.prototype.loadCategoryNews = function (marketId, category) {
        var url = null;
        url = url.replace('{0}', "" + marketId);
        url = url.replace('{1}', "" + category);
        Tc.info("news url:" + url);
        return this.http.get(this.getProxyAppliedUrl(url)).pipe(map(function (response) {
            return CategoryNews.fromLoaderData(response);
        }));
    };
    NewsLoader.prototype.loadNewsTitle = function (newsId) {
        var url = null;
        url = url.replace('{0}', "" + newsId);
        Tc.info("news url:" + url);
        return this.http.get(this.getProxyAppliedUrl(url)).pipe(map(function (response) {
            return response.title;
        }));
    };
    NewsLoader.prototype.onData = function (json) {
        var news = [];
        if (!json.values.forEach) {
            return news;
        }
        json.values.forEach(function (announcement) {
            var market = null;
            news.push(News.fromLoader(announcement, market));
        });
        return news;
    };
    NewsLoader = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, ProxyService])
    ], NewsLoader);
    return NewsLoader;
}(ProxiedUrlLoader));
export { NewsLoader };
//# sourceMappingURL=news-loader.js.map