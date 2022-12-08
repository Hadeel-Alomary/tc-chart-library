import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnumUtils} from './enum.utils';
import {TcUrlUtils} from './tc.url.utils';
import {PriceStyleType} from '../components/chart/price-style/price-style-type';
import {TechnicalIndicatorType} from '../components/chart/technical-indicators/technical-indicator-type';
import {GridBoxType} from "../components/shared/grid-box/grid-box-type";
import {Config} from '../config/config';
import {CredentialsStateService} from "../services/state/credentials/credentials-state.service";
import {ForceLogoutType} from "../services/logout/force-logout-type";
import {FontSize} from "../services/state/misc/misc-state.service";
import {IntervalType} from '../services/loader/price-loader/interval-type';
import {PeriodType} from '../services/loader/price-loader/period-type';
import {BrowserUtils} from './browser.utils';

@Injectable()
export class TcTracker  {

    private tracks:string[] = [];

    private static instance:TcTracker;

    constructor(private http:HttpClient, private credentialsService:CredentialsStateService) {
        window.setInterval(() => this.sendToServer(), 30 * 1000);
        TcTracker.instance = this;
        window.setInterval(() => TcTracker.trackConnected(), 5 * 60 * 1000);
    }

    static isEnabled():boolean {
        return TcTracker.instance != null;
    }

    /* track on login */
    static trackUserAgent(userAgent:string){
        TcTracker.instance.track('browser', userAgent);
    }

    static trackScreenSize(width:number, height:number){
        TcTracker.instance.track('screen', width + '-' + height);
    }

    static trackLoggedIn() {
        TcTracker.instance.track('login');
    }

    static trackLoggedOut() {
        TcTracker.instance.track('logout');
    }

    static trackForceLogout(type:ForceLogoutType) {
        TcTracker.instance.track('logout', 'error', EnumUtils.enumValueToString(ForceLogoutType, type).toLowerCase());
    }

    static trackFontSize(fontSize:FontSize) {
        TcTracker.instance.track('font', EnumUtils.enumValueToString(FontSize, fontSize).toLowerCase());
    }

    static trackCampaignId(campaignId: string, trackingId:string) {
        TcTracker.instance.track('cid', campaignId);
        TcTracker.instance.track('cid-trading-id', trackingId);
    }

    /* pulse */
    static trackConnected(){
        TcTracker.instance.track('connected');
    }

    /* track on loading workspace */
    static trackLoadWorkspace(){
        TcTracker.instance.track('workspace', 'load');
    }
    static trackFiltersCount(count:number) {
        TcTracker.instance.track('filters', 'c', count + '');
    }
    static trackWatchlistsCount(count:number) {
        TcTracker.instance.track('watchlists', 'c', count + '');
    }
    static trackUserDefinedIntervalsCount(count:number) {
        TcTracker.instance.track('userDefinedIntervals', 'c', count + '');
    }
    static trackPagesCount(count:number) {
        TcTracker.instance.track('pages', 'c', count + '');
    }
    static trackBoxesCount(count:number) {
        TcTracker.instance.track('boxes', 'c', count + '');
    }

    /* track news */
    static trackViewNews() {
        TcTracker.instance.track('news', 'view');
    }

    static trackViewAnalysis(){
        TcTracker.instance.track('analysis', 'view');
    }

    /* track mult-screen actions */
    static trackToggleToolbar() {
        TcTracker.instance.track('toolbar', 'toggle');
    }
    static trackAutoLink() {
        TcTracker.instance.track('autolink');
    }
    static trackToggleMaximizeBox() {
        TcTracker.instance.track('maximize-box', 'toggle');
    }
    static trackToggleMaximizeScreen() {
        TcTracker.instance.track('maximize-screen', 'toggle');
    }
    static trackToggleMarketDetails() {
        TcTracker.instance.track('market-details', 'toggle');
    }
    static trackDocking() {
        TcTracker.instance.track('docking', 'dock');
    }

    /* track chart operations */
    static trackChartScreenshot() {
        TcTracker.instance.track('chart', 'screenshot');
    }
    static trackChartPriceStyle(type:PriceStyleType) {
        TcTracker.instance.track('chart', 'pricestyle', EnumUtils.enumValueToString(PriceStyleType, type).toLowerCase());
    }
    static trackChartPeriod(type:PeriodType){
        TcTracker.instance.track('chart', 'period', EnumUtils.enumValueToString(PeriodType, type).toLowerCase());
    }
    static trackChartInterval(type:IntervalType) {
        TcTracker.instance.track('chart', 'interval', EnumUtils.enumValueToString(IntervalType, type).toLowerCase());
    }
    static trackChartIndicator(type:TechnicalIndicatorType) {
        TcTracker.instance.track('chart', 'indicator', EnumUtils.enumValueToString(TechnicalIndicatorType, type).toLowerCase());
    }
    static trackChartMovingAverage(type:TechnicalIndicatorType, period:number) {
        TcTracker.instance.track('chart', 'avg', EnumUtils.enumValueToString(TechnicalIndicatorType, type).toLowerCase() + '-' + period);
    }

    /* track volume profiler */
    static trackVolumeProfilerRequest() {
        TcTracker.instance.track('volume-profiler', 'request');
    }

    /* track connection */
    static trackConnectTo(hostname:string){
        TcTracker.instance.track('streamer', 'connect', hostname);
    }
    static trackHeartbeatDisconnection(market:string) {
        TcTracker.instance.track('heartbeat:' + market, 'disconnection');
    }
    static trackHeartbeatReloading(market:string) {
        TcTracker.instance.track('heartbeat:' + market, 'reloading');
    }

    /* track user operation */
    static trackContactUs() {
        TcTracker.instance.track('support', 'contactus');
    }

    /* track open screen */
    static trackAddBox(type:GridBoxType) {
        TcTracker.instance.track('grid', 'add-box', EnumUtils.enumValueToString(GridBoxType, type).toLowerCase());
    }
    static trackCloseBox(type:GridBoxType) {
        TcTracker.instance.track('grid', 'close-box', EnumUtils.enumValueToString(GridBoxType, type).toLowerCase());
    }
    static trackOpenWatchlistProperties() {
        TcTracker.instance.track('watchlist', 'properties');
    }
    static trackOpenAlertCenter() {
        TcTracker.instance.track('alert', 'center');
    }
    static trackOpenFilterProperties() {
        TcTracker.instance.track('filter', 'properties');
    }

    /* track cloud watchlist */
    static trackCreateSyncCloudWatchlist() {
        TcTracker.instance.track('watchlist-sync-cloud', 'create');
    }
    static trackDeleteSyncCloudWatchlist() {
        TcTracker.instance.track('watchlist-sync-cloud', 'delete');
    }
    static trackDeleteNonSyncedCloudWatchlist() {
        TcTracker.instance.track('watchlist-sync-cloud', 'delete-non-synced');
    }
    static trackUpdateSyncCloudWatchlist() {
        TcTracker.instance.track('watchlist-sync-cloud', 'update');
    }
    static trackRefreshSyncCloudWatchlist() {
        TcTracker.instance.track('watchlist-sync-cloud', 'refresh');
    }
    static trackDeleteCloudWatchlist() {
        TcTracker.instance.track('watchlist-cloud', 'delete');
    }
    static trackCreateOrUpdateCloudWatchlist() {
        TcTracker.instance.track('watchlist-cloud', 'create-or-update');
    }

    /* track watchlist */
    static trackCreateWatchlist() {
        TcTracker.instance.track('watchlist', 'create');
    }
    static trackDeleteWatchlist() {
        TcTracker.instance.track('watchlist', 'delete');
    }

    /* track filters */
    static trackCreateFilter() {
        TcTracker.instance.track('filter', 'create');
    }
    static trackDeleteFilter() {
        TcTracker.instance.track('filter', 'delete');
    }

    /* track pages */
    static trackChangePage() {
        TcTracker.instance.track('page', 'change');
    }
    static trackCreatePage() {
        TcTracker.instance.track('page', 'create');
    }
    static trackDeletePage() {
        TcTracker.instance.track('page', 'delete');
    }

    /* track drawings */
    static trackSaveDrawing() {
        TcTracker.instance.track('drawing', 'save');
    }
    static trackLoadDrawing() {
        TcTracker.instance.track('drawing', 'load');
    }
    static trackDeleteDrawing() {
        TcTracker.instance.track('drawing', 'delete');
    }

    /* track alert */
    static trackSaveAlert() {
        TcTracker.instance.track('alert', 'save');
    }
    static trackUpdateAlert() {
        TcTracker.instance.track('alert', 'update');
    }
    static trackDeleteAlert() {
        TcTracker.instance.track('alert', 'delete');
    }

    /* track workspace */
    static trackUpdateWorkspace() {
        TcTracker.instance.track('workspace', 'update');
    }
    static trackSelectWorkspace() {
        TcTracker.instance.track('workspace', 'select');
    }
    static trackResetWorkspace() {
        TcTracker.instance.track('workspace', 'reset');
    }
    static trackMigrateWorkspace() {
        TcTracker.instance.track('workspace', 'migrate');
    }
    static trackDeleteWorkspace() {
        TcTracker.instance.track('workspace', 'delete');
    }

    static trackCreateWorkspace() {
        TcTracker.instance.track('workspace', 'create');
    }

    static trackMarkDefaultWorkspace() {
        TcTracker.instance.track('workspace', 'mark-default');
    }

    /* track performance */
    static trackSlowRequest(request:string, duration:number) {
        TcTracker.instance.track('perf', request, '' + duration);
    }

    /* track derayah */

    static trackConnectedToDerayah(){
        TcTracker.instance.track('api', 'enabled');
    }

    /* track snbcapital */

    static trackConnectedToSnbcapital(){
        TcTracker.instance.track('api', 'enabled');
    }

    /* track virtual trading */
    static trackConnectedToVirtualTrading():void{
        TcTracker.instance.track("virtual-trading", "enabled");
    }

    static trackVirtualTradingAddBuyFromChart():void{
        TcTracker.instance.track("virtual-trading-chart", "add-buy");
    }

    static trackVirtualTradingAddStopFromChart():void{
        TcTracker.instance.track("virtual-trading-chart", "add-stop");
    }

    static trackVirtualTradingAddSellFromChart():void{
        TcTracker.instance.track("virtual-trading-chart", "add-sell");
    }

    static trackVirtualTradingUpdateOrderFromChart():void{
        TcTracker.instance.track("virtual-trading-chart", "update-order");
    }

    static trackVirtualTradingUpdateTakeProfitFromChart():void{
        TcTracker.instance.track("virtual-trading-chart", "update-take-profit");
    }

    static trackVirtualTradingUpdateStopLossFromChart():void{
        TcTracker.instance.track("virtual-trading-chart", "update-stop-loss");
    }

    static trackVirtualTradingSellPositionFromChart():void{
        TcTracker.instance.track("virtual-trading-chart", "position-sell");
    }

    static trackVirtualTradingDeleteOrderFromChart():void {
        TcTracker.instance.track("virtual-trading-chart", "delete-order");
    }

    static trackVirtualTradingCancelTakeProfitFromChart():void {
        TcTracker.instance.track("virtual-trading-chart", "cancel-take-profit");
    }

    static trackVirtualTradingCancelStopLossFromChart():void {
        TcTracker.instance.track("virtual-trading-chart", "cancel-stop-loss");
    }

    static trackVirtualTradingAddManualOrder():void{
        TcTracker.instance.track("virtual-trading-manual-order", "add");
    }

    static trackVirtualTradingAddCapital():void{
        TcTracker.instance.track("virtual-trading-capital", "add");
    }

    static trackVirtualTradingAddOrder():void{
        TcTracker.instance.track("virtual-trading-order", "add");
    }

    static trackVirtualTradingUpdateOrder():void{
        TcTracker.instance.track("virtual-trading-order", "update");
    }

    static trackVirtualTradingDeleteOrder():void{
        TcTracker.instance.track("virtual-trading-order", "delete");
    }

    static trackVirtualTradingDeleteAccount():void{
        TcTracker.instance.track("virtual-trading-account", "delete");
    }

    static trackVirtualTradingCreateAccount():void{
        TcTracker.instance.track("virtual-trading-account", "create");
    }

    static trackVirtualTradingShowTransactions():void{
        TcTracker.instance.track("virtual-trading-transactions", "view");
    }

    static trackTradestationShowTransactions(): void{
        TcTracker.instance.track("tradestation-transactions", "view");
    }
    static trackTradestationShowOrderDetails(): void{
        TcTracker.instance.track("tradestation-order-details", "view");
    }

    static trackTradestationDeleteOrder():void{
        TcTracker.instance.track("tradestation-order", "delete");
    }

    static trackVirtualTradingShowOrderDetails():void{
        TcTracker.instance.track("virtual-trading-order-details", "view");
    }

    /* language */

    static trackLanguage(language:string):void{
        TcTracker.instance.track("language", language);
    }

    /* theme */

    static trackTheme(theme:string):void{
        TcTracker.instance.track("theme", theme);
    }

    static trackSwitchTheme(theme:string):void{
        TcTracker.instance.track("switch-theme", theme);
    }

    /* device */
    static trackDevice(device:string):void{
        TcTracker.instance.track("device", device);
    }

    /* subscription messages */
    static trackSubscriptionMessage(messageType:string):void{
        TcTracker.instance.track("subscription-message", messageType);
    }

    static trackSubscriptionMessageAction(messageType:string):void{
        TcTracker.instance.track("subscription-message-action", messageType);
    }

    /* user tier */
    static trackTier(tier:string):void{
        TcTracker.instance.track("tier", tier);
    }

    /* messages */
    static trackUrgentMessage(message:string) {
        TcTracker.instance.track('message', message);
        TcTracker.instance.sendToServer(); // urgent message, sends immediately
    }

    static trackMessage(message:string) {
        TcTracker.instance.track('message', message);
    }

    /* login */
    static trackSignin() {
        TcTracker.instance.track('login', 'signin');
    }

    static trackSignup() {
        TcTracker.instance.track('login', 'signup');
    }

    /* what is new */
    static trackWhatIsNewAction() {
        TcTracker.instance.track('what-is-new', 'action');
    }

    /* proxy */
    static trackProxyNoCache() {
        TcTracker.instance.track('proxy-cache-enabled', 'no-cache');
    }

    static trackProxyEnabled() {
        TcTracker.instance.track('proxy-cache-enabled', 'true');
    }

    static trackProxyDisabled() {
        TcTracker.instance.track('proxy-cache-enabled', 'false');
    }

    static trackProxyTimeout() {
        TcTracker.instance.track('proxy-cache-enabled', 'timeout');
    }

    /* signature */
    static trackSaveSignature() {
        TcTracker.instance.track('signature', 'save');
    }
    static trackHasSignature(available:boolean) {
        TcTracker.instance.track('has-signature', available.toString());
    }
    static trackDeleteSignature() {
        TcTracker.instance.track('signature', 'delete');
    }

    /* sendNow */
    static sendNow(){
        TcTracker.instance.sendToServer();
    }

    /* report critical errors via email */
    static reportCriticalError(subject: string, message: string) {
        TcTracker.instance.http.post(TcUrlUtils.url('/m/liveweb/report/error'),
            JSON.stringify({subject: subject, message: message}))
            .subscribe(() => {}, error => {});
    }

    /* referer */
    // static trackReferer() {
    //     if(Tc.getParameterByName('r')) {
    //         let referer:string = Tc.getParameterByName('r');
    //         TcTracker.instance.track('referer', referer, this.instance.credentialsService.username);
    //     }
    // }

    /* tracking function */
    private track(feature:string, action:string = null, parameter:string = null){
        let entry:string = feature;
        if(action) {
            entry += ':' + action;
        }
        if(parameter) {
            entry += ':' + parameter;
        }
        console.log("Track:" + entry);
        this.tracks.push(entry);
    }

    private sendToServer() {
        if(this.tracks.length) {
            let username:string = this.credentialsService.trackingId;
            let version:string = Config.getVersion();
            if(Config.isProd()) {
                let loggingDomain = BrowserUtils.isMobile() ? 'https://netmobile-log.tickerchart.net' : 'https://netdesktop-log.tickerchart.net';
                this.http.post(TcUrlUtils.url(loggingDomain + `/l/r/v/${version}/u/${username}`), JSON.stringify(this.tracks)).subscribe(() => {}, error => {});
            } else {
                console.log("track: " + JSON.stringify(this.tracks));
            }
            this.tracks = [];
        }
    }



}
