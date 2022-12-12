import {Injectable} from '@angular/core';
import {LanguageService} from '../language';
import {ViewLoadersService} from './view-loader';
import {TooltipService} from './tooltip';
import {TradingService} from '../trading';
import {NewsService} from '../news';
import {AlertService} from '../alert';
import {LiquidityPoint, LiquidityService} from '../liquidity';
import {VolumeProfilerService} from '../volume-profiler';
import {ChannelRequest, SharedChannel} from '../shared-channel';
import {ChartStateService} from '../state';
import {DrawingDefaultSettings} from '../../stock-chart/StockChartX/Drawings/DrawingsDefaultSettings';
import {IndicatorSettings} from '../../stock-chart/StockChartX/Indicators/IndicatorsDefaultSettings';
import {ChartTheme} from '../../stock-chart/StockChartX/Theme';
import {Interval, MarketsTickSizeService} from '../index';
import {LiquidityHistoryLoadingState} from '../liquidity/liquidity.service';
import {Subject} from 'rxjs';
import {VolumeProfilerRequest, VolumeProfilerRequestBuilder} from '../volume-profiler/volume-profiler-request-builder';
import {VolumeProfilerResult} from '../volume-profiler/volume-profiler.service';

@Injectable()
export abstract class ChartAccessorService {

  constructor(
	private languageService:LanguageService,
	private viewLoadersService:ViewLoadersService,
	private chartTooltipService: TooltipService,
	private tradingService: TradingService,
	private newsService: NewsService,
	private alertService: AlertService,
	private liquidityService: LiquidityService,
	private volumeProfilerService:VolumeProfilerService,
	private sharedChannel: SharedChannel,
	private chartStateService:ChartStateService ,
	public marketsTickSizeService: MarketsTickSizeService,
  ){}

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

  isArabic():boolean {
	return this.languageService.arabic;
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

  public requestToLoadSymbolLiquidityHistory(symbol: string, interval: Interval , marketAbbr:string): void {
	if (marketAbbr !== 'USA' && marketAbbr !== 'FRX') {
	  this.liquidityService.requestToLoadSymbolHistory(symbol, interval);
	}
  }

  public getSymbolLiquidityUpdateStream(): Subject<{symbol:string, interval:Interval}>{
	return this.liquidityService.getSymbolLiquidityUpdateStream();
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
