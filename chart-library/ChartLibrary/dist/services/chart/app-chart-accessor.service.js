var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
import { LanguageService } from '../language';
import { ViewLoadersService } from './view-loader';
import { TooltipService } from './tooltip';
import { TradingService } from '../trading';
import { NewsService } from '../news';
import { AlertService } from '../alert';
import { LiquidityService } from '../liquidity';
import { SharedChannel } from '../shared-channel';
import { ChartAccessorService } from './chart-accessor.service';
import { ChartStateService } from '../state';
import { MarketsTickSizeService, VolumeProfilerService } from '../index';
var AppChartAccessorService = (function (_super) {
    __extends(AppChartAccessorService, _super);
    function AppChartAccessorService(languageService, viewLoadersService, chartTooltipService, tradingService, newsService, alertService, liquidityService, volumeProfilerService, sharedChannel, chartStateService, marketsTickSizeService) {
        var _this = _super.call(this) || this;
        _this.languageService = languageService;
        _this.viewLoadersService = viewLoadersService;
        _this.chartTooltipService = chartTooltipService;
        _this.tradingService = tradingService;
        _this.newsService = newsService;
        _this.alertService = alertService;
        _this.liquidityService = liquidityService;
        _this.volumeProfilerService = volumeProfilerService;
        _this.sharedChannel = sharedChannel;
        _this.chartStateService = chartStateService;
        _this.marketsTickSizeService = marketsTickSizeService;
        ChartAccessorService._instance = _this;
        return _this;
    }
    AppChartAccessorService.prototype.sendSharedChannelRequest = function (request) {
        this.sharedChannel.request(request);
    };
    AppChartAccessorService.prototype.translate = function (arabic) {
        return this.languageService.translate(arabic);
    };
    AppChartAccessorService.prototype.translateHtml = function (element) {
        return this.languageService.translateHtml(element);
    };
    AppChartAccessorService.prototype.getAlertService = function () {
        return this.alertService;
    };
    AppChartAccessorService.prototype.getNewsService = function () {
        return this.newsService;
    };
    AppChartAccessorService.prototype.getViewLoaderService = function () {
        return this.viewLoadersService;
    };
    AppChartAccessorService.prototype.getChartTooltipService = function () {
        return this.chartTooltipService;
    };
    AppChartAccessorService.prototype.getTradingService = function () {
        return this.tradingService;
    };
    AppChartAccessorService.prototype.getMarketsTickSizeService = function () {
        return this.marketsTickSizeService;
    };
    AppChartAccessorService.prototype.isArabic = function () {
        return this.languageService.arabic;
    };
    AppChartAccessorService.prototype.cleanVolumeProfilerData = function (requesterId) {
        this.volumeProfilerService.cleanData(requesterId);
    };
    AppChartAccessorService.prototype.isVolumeProfilerRequested = function (requestData) {
        return this.volumeProfilerService.isRequested(requestData);
    };
    AppChartAccessorService.prototype.requestVolumeProfilerData = function (requestParams) {
        this.volumeProfilerService.requestVolumeProfilerData(requestParams);
    };
    AppChartAccessorService.prototype.getVolumeProfilerRequestBuilder = function () {
        return this.volumeProfilerService.getRequestBuilder();
    };
    AppChartAccessorService.prototype.getVolumeProfilerResultStream = function () {
        return this.volumeProfilerService.getResultStream();
    };
    AppChartAccessorService.prototype.getSymbolLiquidityPoints = function (symbol, interval) {
        return this.liquidityService.getSymbolLiquidityPoints(symbol, interval);
    };
    AppChartAccessorService.prototype.getSymbolLiquidityHistoryLoadState = function (symbol, interval) {
        return this.liquidityService.getSymbolHistoryLoadState(symbol, interval);
    };
    AppChartAccessorService.prototype.getSymbolLiquidityUpdateStream = function () {
        return this.liquidityService.getSymbolLiquidityUpdateStream();
    };
    AppChartAccessorService.prototype.getDrawingDefaultSettings = function () {
        return this.chartStateService.getDrawingDefaultSettings();
    };
    AppChartAccessorService.prototype.getIndicatorDefaultSettings = function () {
        return this.chartStateService.getIndicatorDefaultSettings();
    };
    AppChartAccessorService.prototype.getThemeDefaultSettings = function () {
        return this.chartStateService.getThemeDefaultSettings();
    };
    AppChartAccessorService.prototype.setDrawingDefaultSettings = function (drawings) {
        this.chartStateService.setDrawingDefaultSettings(drawings);
    };
    AppChartAccessorService.prototype.setIndicatorDefaultSettings = function (indicators) {
        this.chartStateService.setIndicatorDefaultSettings(indicators);
    };
    AppChartAccessorService.prototype.setThemeDefaultSettings = function (theme) {
        this.chartStateService.setThemeDefaultSettings(theme);
    };
    AppChartAccessorService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LanguageService,
            ViewLoadersService,
            TooltipService,
            TradingService,
            NewsService,
            AlertService,
            LiquidityService,
            VolumeProfilerService,
            SharedChannel,
            ChartStateService,
            MarketsTickSizeService])
    ], AppChartAccessorService);
    return AppChartAccessorService;
}(ChartAccessorService));
export { AppChartAccessorService };
//# sourceMappingURL=app-chart-accessor.service.js.map