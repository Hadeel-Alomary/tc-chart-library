import {Injectable} from '@angular/core';
import {LanguageService} from '../state/language';
import {ViewLoadersService} from './view-loader';
import {TooltipService} from './tooltip';
import {TradingService} from '../trading';
import {NewsService} from '../data/news';
import {Company, Market, MarketsManager} from '../loader/loader';
import {AlertService} from '../data/alert';
import {LiquidityPoint, LiquidityService} from '../data/liquidity';
import {VolumeProfilerService} from '../data';
import {ChannelRequest, SharedChannel} from '../shared-channel';
import {ChartAccessorService} from './chart-accessor.service';
import {ChartStateService} from '../state';
import {DrawingDefaultSettings} from '../../stock-chart/StockChartX/Drawings/DrawingsDefaultSettings';
import {IndicatorSettings} from '../../stock-chart/StockChartX/Indicators/IndicatorsDefaultSettings';
import {ChartTheme} from '../../stock-chart/StockChartX/Theme';
import {Interval, MarketsTickSizeService} from '../index';
import {LiquidityHistoryLoadingState} from '../data/liquidity/liquidity.service';
import {Subject} from 'rxjs';
import {VolumeProfilerRequest, VolumeProfilerRequestBuilder} from '../data/volume-profiler/volume-profiler-request-builder';
import {VolumeProfilerResult} from '../data/volume-profiler/volume-profiler.service';

@Injectable()
export class AppChartAccessorService extends ChartAccessorService{

    constructor(
        private languageService:LanguageService,
        private viewLoadersService:ViewLoadersService,
        private chartTooltipService: TooltipService,
        private tradingService: TradingService,
        private newsService: NewsService,
        private marketsManager: MarketsManager,
        private alertService: AlertService,
        private liquidityService: LiquidityService,
        private volumeProfilerService:VolumeProfilerService,
        private sharedChannel: SharedChannel,
        private chartStateService:ChartStateService ,
        public marketsTickSizeService: MarketsTickSizeService,
    ){
        super();
        ChartAccessorService._instance = this;
    }

    public sendSharedChannelRequest(request:ChannelRequest) {
        this.sharedChannel.request(request);
    }

    public translate(arabic:string){
        return this.languageService.translate(arabic);
    }

    public translateHtml(element:JQuery){
        return this.languageService.translateHtml(element);
    }

    public getAlertService():AlertService {
        return this.alertService;
    }

    public getNewsService():NewsService {
        return this.newsService;
    }

    public getViewLoaderService():ViewLoadersService {
        return this.viewLoadersService;
    }

    public getChartTooltipService():TooltipService {
        return this.chartTooltipService;
    }

    public getTradingService():TradingService {
        return this.tradingService;
    }

    public getMarketsTickSizeService():MarketsTickSizeService {
        return this.marketsTickSizeService;
    }

    getCompanyBySymbol(symbol: string):Company {
        return this.marketsManager.getCompanyBySymbol(symbol);
    }

    isArabic():boolean {
        return this.languageService.arabic;
    }

    getMarketBySymbol(symbol: string):Market {
        return this.marketsManager.getMarketBySymbol(symbol);
    }

    public cleanVolumeProfilerData(requesterId:string):void {
        this.volumeProfilerService.cleanData(requesterId);
    }

    public isVolumeProfilerRequested(requestData: VolumeProfilerRequest):boolean {
        return this.volumeProfilerService.isRequested(requestData);
    }

    public requestVolumeProfilerData(requestParams:VolumeProfilerRequest): void {
        this.volumeProfilerService.requestVolumeProfilerData(requestParams);
    }

    public getVolumeProfilerRequestBuilder():VolumeProfilerRequestBuilder {
        return this.volumeProfilerService.getRequestBuilder();
    }

    public getVolumeProfilerResultStream():Subject<VolumeProfilerResult> {
        return this.volumeProfilerService.getResultStream();
    }

    public getSymbolLiquidityPoints(symbol: string, interval: Interval): LiquidityPoint[] {
        return this.liquidityService.getSymbolLiquidityPoints(symbol, interval);
    }

    public getSymbolLiquidityHistoryLoadState(symbol: string, interval: Interval):LiquidityHistoryLoadingState {
        return this.liquidityService.getSymbolHistoryLoadState(symbol, interval);
    }

    public requestToLoadSymbolLiquidityHistory(symbol: string, interval: Interval): void {
        let market = this.marketsManager.getMarketBySymbol(symbol).abbreviation;
        if (market !== 'USA' && market !== 'FRX') {
            this.liquidityService.requestToLoadSymbolHistory(symbol, interval);
        }
    }

    public getSymbolLiquidityUpdateStream(): Subject<{symbol:string, interval:Interval}>{
        return this.liquidityService.getSymbolLiquidityUpdateStream();
    }

    getMarketByAbbreviation(marketAbbreviation:string):Market {
        return this.marketsManager.getMarketByAbbreviation(marketAbbreviation);
    }

    getDefaultMarket():Market {
        return this.marketsManager.getDefaultMarket();
    }

    public getDrawingDefaultSettings(): {[drawingClassName: string]:DrawingDefaultSettings} {
        return this.chartStateService.getDrawingDefaultSettings();
    }

    public getIndicatorDefaultSettings(): {[indicatorNumber: number]: IndicatorSettings} {
        return this.chartStateService.getIndicatorDefaultSettings();
    }

    public getThemeDefaultSettings(): ChartTheme {
        return this.chartStateService.getThemeDefaultSettings();
    }

    public setDrawingDefaultSettings(drawings:{[drawingClassName: string]:DrawingDefaultSettings}):void {
        this.chartStateService.setDrawingDefaultSettings(drawings);
    }

    public setIndicatorDefaultSettings(indicators:{[indicatorNumber: number]: IndicatorSettings} ):void {
        this.chartStateService.setIndicatorDefaultSettings(indicators);
    }

    public setThemeDefaultSettings(theme:ChartTheme):void {
        this.chartStateService.setThemeDefaultSettings(theme);
    }

}
