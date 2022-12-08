import {Injectable} from '@angular/core';
import {ViewLoadersService} from './view-loader';
import {TooltipService} from './tooltip';
import {TradingService} from '../trading';
import {NewsService} from '../data/news';
import {Company, Market, MarketsManager} from '../loader/loader';
import {AlertService} from '../data/alert';
import {LiquidityPoint, MarketsTickSizeService, VolumeProfilerService} from '../data';
import {ChannelRequest} from '../shared-channel';
import {ChartAccessorService} from './chart-accessor.service';
import {Tc} from '../../utils';
import {DrawingDefaultSettings} from '../../stock-chart/StockChartX/Drawings/DrawingsDefaultSettings';
import {IndicatorSettings} from '../../stock-chart/StockChartX/Indicators/IndicatorsDefaultSettings';
import {ChartTheme} from '../../stock-chart/StockChartX/Theme';
import {ElementLiquidityService} from '../data/liquidity/element-liquidity.service';
import {Interval} from '../loader';
import {LiquidityHistoryLoadingState} from '../data/liquidity/liquidity.service';
import {Subject} from 'rxjs';
import {VolumeProfilerRequest, VolumeProfilerRequestBuilder} from '../data/volume-profiler/volume-profiler-request-builder';
import {VolumeProfilerResult} from '../data/volume-profiler/volume-profiler.service';

@Injectable()
export class ElementChartAccessorService extends ChartAccessorService{

    private liquidityUrl:string = "https://liquidity.tickerchart.net/liquidity/history/{0}/{1}/{2}/{3}";

    constructor(
        private viewLoadersService:ViewLoadersService,
        private chartTooltipService: TooltipService,
        private elementLiquidityService: ElementLiquidityService,
        private volumeProfilerService:VolumeProfilerService,
        private elementMarketsManager:MarketsManager
    ){
        super();
        ChartAccessorService._instance = this;
    }

    public sendSharedChannelRequest(request:ChannelRequest) {
        Tc.error("element chart: no shared channel service");
    }

    public translate(arabic:string){
        return arabic;
    }

    public translateHtml(element:JQuery){
        // do nothing
    }

    public getAlertService():AlertService {
        Tc.error("element chart: no alert service");
        return null;
    }

    public getNewsService():NewsService {
        Tc.error("element chart: no news service");
        return null;
    }

    public getViewLoaderService():ViewLoadersService {
        return this.viewLoadersService;
    }

    public getChartTooltipService():TooltipService {
        return this.chartTooltipService;
    }

    public getTradingService():TradingService {
        Tc.error("element chart: no trading service");
        return null;
    }

    getCompanyBySymbol(symbol: string):Company {
        Tc.error("element chart: no trading service");
        return null;
    }

    isArabic():boolean {
        return true;
    }

    getMarketBySymbol(symbol: string):Market {
        Tc.error("element chart: no trading service");
        return null;
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
        return this.elementLiquidityService.getSymbolLiquidityPoints(symbol, interval);
    }

    public getSymbolLiquidityHistoryLoadState(symbol: string, interval: Interval):LiquidityHistoryLoadingState {
        return this.elementLiquidityService.getSymbolHistoryLoadState(symbol, interval);
    }

    public requestToLoadSymbolLiquidityHistory(symbol: string, interval: Interval): void {
        let market = this.elementMarketsManager.getMarketBySymbol(symbol).abbreviation;
        if (market !== 'USA' && market !== 'FRX') {
            this.elementLiquidityService.requestToLoadSymbolHistory(this.liquidityUrl, symbol, interval);
        }
    }

    public getSymbolLiquidityUpdateStream(): Subject<{symbol:string, interval:Interval}>{
        return this.elementLiquidityService.getSymbolLiquidityUpdateStream();
    }

    public getMarketsTickSizeService(): MarketsTickSizeService {
        Tc.error("element chart: no MarketsTickSize service");
        return null;
    }

    getMarketByAbbreviation(marketAbbreviation:string):Market {
        return this.elementMarketsManager.getMarketByAbbreviation(marketAbbreviation);
    }

    getDefaultMarket():Market {
        return this.elementMarketsManager.getDefaultMarket();
    }

    public getDrawingDefaultSettings(): {[drawingClassName: string]:DrawingDefaultSettings} {
        return null;
    }

    public getIndicatorDefaultSettings(): {[indicatorNumber: number]: IndicatorSettings} {
        return null;
    }

    public getThemeDefaultSettings(): ChartTheme {
        return null;
    }

    public setDrawingDefaultSettings(drawings:{[drawingClassName: string]:DrawingDefaultSettings}):void {
        // nothing
    }

    public setIndicatorDefaultSettings(indicators:{[indicatorNumber: number]: IndicatorSettings} ):void {
        // nothing
    }

    public setThemeDefaultSettings(theme:ChartTheme):void {
        // nothing
    }


}


