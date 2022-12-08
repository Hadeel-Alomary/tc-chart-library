import {Tc} from '../../utils/index';
import {ViewLoadersService} from './view-loader/index';
import {TooltipService} from './tooltip/index';
import {TradingService} from '../trading';
import {NewsService} from '../data/news';
import {Company, Market} from '../loader/loader';
import {AlertService} from '../data/alert';
import {LiquidityPoint} from '../data/liquidity';
import {MarketsTickSizeService} from '../data';
import {ChannelRequest} from '../shared-channel';
import {ChartTheme} from '../../stock-chart/StockChartX/Theme';
import {DrawingDefaultSettings} from '../../stock-chart/StockChartX/Drawings/DrawingsDefaultSettings';
import {IndicatorSettings} from '../../stock-chart/StockChartX/Indicators/IndicatorsDefaultSettings';
import {Interval} from '../loader';
import {LiquidityHistoryLoadingState} from '../data/liquidity/liquidity.service';
import {Subject} from 'rxjs';
import {VolumeProfilerRequest, VolumeProfilerRequestBuilder} from '../data/volume-profiler/volume-profiler-request-builder';
import {VolumeProfilerResult} from '../data/volume-profiler/volume-profiler.service';
import {AppChartAccessorService} from './app-chart-accessor.service';


export abstract class ChartAccessorService {
    public static get instance():ChartAccessorService{
        Tc.assert(ChartAccessorService._instance !== null, "Trying to access chart accessor before initialize it");
        return ChartAccessorService._instance;
    }
    protected static _instance:ChartAccessorService | null = null;

    public abstract sendSharedChannelRequest(request:ChannelRequest):void;

    public abstract translate(arabic:string):string;

    public abstract translateHtml(element:JQuery):void;

    public abstract getAlertService():AlertService;

    public abstract getNewsService():NewsService;

    public abstract getViewLoaderService():ViewLoadersService;

    public abstract getChartTooltipService():TooltipService;

    public abstract getTradingService():TradingService;

    public abstract getCompanyBySymbol(symbol: string):Company;

    public abstract isArabic():boolean;

    public abstract getMarketBySymbol(symbol: string):Market;

    public abstract cleanVolumeProfilerData(requesterId:string):void;
    public abstract isVolumeProfilerRequested(requestData: VolumeProfilerRequest):boolean;
    public abstract requestVolumeProfilerData(requestParams:VolumeProfilerRequest): void;
    public abstract getVolumeProfilerRequestBuilder():VolumeProfilerRequestBuilder;
    public abstract getVolumeProfilerResultStream():Subject<VolumeProfilerResult>;

    public abstract getSymbolLiquidityPoints(symbol: string, interval: Interval): LiquidityPoint[];
    public abstract getSymbolLiquidityHistoryLoadState(symbol: string, interval: Interval):LiquidityHistoryLoadingState;
    public abstract requestToLoadSymbolLiquidityHistory(symbol: string, interval: Interval): void;
    public abstract getSymbolLiquidityUpdateStream(): Subject<{symbol:string, interval:Interval}>;

    public abstract getMarketByAbbreviation(marketAbbreviation:string):Market;

    public abstract getDefaultMarket():Market;

    public abstract getMarketsTickSizeService():MarketsTickSizeService;

    public abstract getThemeDefaultSettings():ChartTheme;
    public abstract setThemeDefaultSettings(theme:ChartTheme):void;
    public abstract getDrawingDefaultSettings():{[drawingClassName: string]:DrawingDefaultSettings};
    public abstract setDrawingDefaultSettings(drawings:{[drawingClassName: string]:DrawingDefaultSettings}):void;
    public abstract getIndicatorDefaultSettings():{[indicatorNumber: number]: IndicatorSettings};
    public abstract setIndicatorDefaultSettings(indicators:{[indicatorNumber: number]: IndicatorSettings}):void;

}








