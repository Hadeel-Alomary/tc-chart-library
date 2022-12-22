import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {TcTracker} from "../../../utils/index";
import {StreamerLoader, Market} from '../../loader/index';
import {HeartbeatManager} from "./heartbeat-manager";
import {SharedChannel, ChannelRequestType} from "../../shared-channel/index";
import {QuoteMessage, TimeAndSaleMessage, MarketSummaryMessage, MarketDepthMessage, MarketAlertMessage} from "../shared/index";
import {MarketStreamer} from './market-streamer';
import {GeneralPurposeStreamer} from "./general-purpose-streamer.service";
import {DebugModeService} from '../../debug-mode/index';
import {ForceScreenReloadRequest} from '../../shared-channel/channel-request';
import {TechnicalReportsStreamer} from './technical-reports-streamer.service';
import {RealTimeChartUpdaterMessage} from '../shared/message';
import {TechnicalIndicatorStreamer} from './technical-indicator-streamer';

@Injectable()
export class Streamer {
    private heartbeatManager:HeartbeatManager;
    private marketStreamers:{[marketAbbreviation:string]:MarketStreamer} = {};
    private generalPurposeStreamer:GeneralPurposeStreamer;
    private technicalReportsStreamer:TechnicalReportsStreamer;
    private technicalIndicatorStreamer: {[marketAbbreviation: string]: TechnicalIndicatorStreamer} = {};


    constructor(private streamerLoader:StreamerLoader,
                private sharedChannel:SharedChannel,
                private debugModeService: DebugModeService) {

        this.heartbeatManager = new HeartbeatManager(this);
        // this.loader.getMarketStream().subscribe((market:Market) => {
        //     this.marketStreamers[market.abbreviation] = new MarketStreamer(this.heartbeatManager, market, this.debugModeService, this.authorizationService);
        //     this.technicalIndicatorStreamer['I_' + market.abbreviation] = new TechnicalIndicatorStreamer(this.heartbeatManager, market, this.debugModeService, this.authorizationService);
        // });

        this.generalPurposeStreamer = new GeneralPurposeStreamer(this.heartbeatManager);
        this.technicalReportsStreamer = new TechnicalReportsStreamer(this.heartbeatManager);
        //
        // this.loader.isLoadingDoneStream().subscribe(loadingDone => {
        //     if(loadingDone) {
        //         this.generalPurposeStreamer.initChannel(loader.getGeneralPurposeStreamerUrl(), true);
        //         this.technicalReportsStreamer.initChannel(loader.getTechnicalReportsStreamerUrl(), false);
        //     }
        // });
    }

    onDestroy() {
        this.heartbeatManager.disconnect();
        Object.values(this.marketStreamers).forEach((marketStreamer:MarketStreamer) => {
            marketStreamer.onDestroy();
        });

        Object.values(this.technicalIndicatorStreamer).forEach((technicalIndicatorStream: TechnicalIndicatorStreamer) => {
            technicalIndicatorStream.onDestroy();
        })

        this.generalPurposeStreamer.onDestroy();
    }

    getGeneralPurposeStreamer():GeneralPurposeStreamer {
        return this.generalPurposeStreamer;
    }

    getTechnicalReportsStreamer():TechnicalReportsStreamer {
        return this.technicalReportsStreamer;
    }

    getTechnicalIndicatorStream(market: string): TechnicalIndicatorStreamer {
        let indicatorMarket = 'I_' + market;
        return this.technicalIndicatorStreamer[indicatorMarket]
    }

    subscribeQuote(market:string , symbol:string){
        this.marketStreamers[market].subscribeQuote(symbol);
    }

    subscribeQuotes(market:string , symbols:string[]){
        this.marketStreamers[market].subscribeQuotes(symbols);
    }

    unSubscribeQuote(market:string , symbol:string){
        this.marketStreamers[market].unSubscribeQuote(symbol);
    }

    unSubscribeQuotes(market:string , symbols:string[]) {
        this.marketStreamers[market].unSubscribeQuotes(symbols);
    }

    subscribeTimeAndSale(market:Market , symbol:string){
        this.marketStreamers[market.abbreviation].subscribeTimeAndSale(symbol);
    }

    unSubscribeTimeAndSale(market:Market , symbol:string){
        this.marketStreamers[market.abbreviation].unSubscribeTimeAndSale(symbol);
    }

    subscribeChartIntraday(market:Market , symbol:string){
        this.marketStreamers[market.abbreviation].subscribeChartIntrday(symbol);
    }

    unSubscribeChartIntraday(market:Market , symbol:string) {
        this.marketStreamers[market.abbreviation].unSubscribeChartIntrday(symbol);
    }

    subscribeChartDaily(market:Market ,symbol:string){
        this.marketStreamers[market.abbreviation].subscribeChartDaily(symbol);
    }

    unSubscribeChartDaily(market:Market ,symbol:string) {
        this.marketStreamers[market.abbreviation].unSubscribeChartDaily(symbol);
    }

    subscribeMarketSummary(market:string){
        this.marketStreamers[market].subscribeMarketSummary();
    }

    subscribeMarketDepthByOrder(market:Market , symbol:string) {
        this.marketStreamers[market.abbreviation].subscribeMarketDepthByOrder(symbol);
    }

    subscribeMarketDepthByPrice(market:Market , symbol:string) {
        this.marketStreamers[market.abbreviation].subscribeMarketDepthByPrice(symbol);
    }

    subscribeMarketAlerts(market:string) {
        this.marketStreamers[market].subscribeMarketAlerts();
    }

    subscribeBigTrade(market:string) {
        this.marketStreamers[market].subscribeBigTrade();
    }

    getQuoteMessageStream(market:string):Subject<QuoteMessage> {
        return this.marketStreamers[market].getQuoteMessageStream();
    }

    getTimeAndSaleMessageStream(market:string):Subject<TimeAndSaleMessage> {
        return this.marketStreamers[market].getTimeAndSaleMessageStream();
    }

    getChartIntradayMessageStream(market:string):Subject<RealTimeChartUpdaterMessage> {
        return this.marketStreamers[market].getChartIntradayMessageStream();
    }

    getChartDailyMessageStream(market:string):Subject<RealTimeChartUpdaterMessage> {
        return this.marketStreamers[market].getChartDailyMessageStream();
    }

    getMarketSummaryStream(market:string):Subject<MarketSummaryMessage> {
        return this.marketStreamers[market].getMarketSummaryStream();
    }

    getMarketDepthByOrderStream(market:string):Subject<MarketDepthMessage> {
        return this.marketStreamers[market].getMarketDepthByOrderStream();
    }

    getMarketAlertStream(market:string):Subject<MarketAlertMessage> {
        return this.marketStreamers[market].getMarketAlertStream();
    }

    getBigTradeStream(market:string):Subject<TimeAndSaleMessage> {
        return this.marketStreamers[market].getBigTradeStream();
    }

    // MA when heartbeat times out, we need to get a new url and re-subscribe our topics
    onHeartbeatTimeout(market:string) {
        // first step, get host_port (new streamer url) to ensure that we are connected to
        // the internet (even though next logic is not using it and instead reload workspace).
        this.streamerLoader.loadStreamerUrl(market).subscribe(url => {
            this.initStreamerChannel(market, url);
            TcTracker.trackHeartbeatReloading(market);

            let forceScreenReloadRequest: ForceScreenReloadRequest = {
                type: ChannelRequestType.ForceScreenReload,
                market: market
            };
            this.sharedChannel.request(forceScreenReloadRequest);
        });
    }

    private initStreamerChannel(market:string, url:string) {
        if(market === 'GP')
            this.generalPurposeStreamer.reInitChannel(url);
        else if(market === 'TECHNICAL_REPORTS')
            this.technicalReportsStreamer.reInitChannel(url);
        else if(market.startsWith('I_'))
            this.technicalIndicatorStreamer[market].reInitChannel(url);
        else
            this.marketStreamers[market].reInitChannel(url);
    }
}
