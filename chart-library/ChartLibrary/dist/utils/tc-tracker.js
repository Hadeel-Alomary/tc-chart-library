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
import { EnumUtils } from './enum.utils';
import { TcUrlUtils } from './tc.url.utils';
import { IntervalType } from '../services/loader/price-loader/interval-type';
import { PeriodType } from '../services/loader/price-loader/period-type';
import { TechnicalIndicatorType } from "../components";
var TcTracker = (function () {
    function TcTracker(http) {
        var _this = this;
        this.http = http;
        this.tracks = [];
        window.setInterval(function () { return _this.sendToServer(); }, 30 * 1000);
        TcTracker_1.instance = this;
        window.setInterval(function () { return TcTracker_1.trackConnected(); }, 5 * 60 * 1000);
    }
    TcTracker_1 = TcTracker;
    TcTracker.isEnabled = function () {
        return TcTracker_1.instance != null;
    };
    TcTracker.trackUserAgent = function (userAgent) {
        TcTracker_1.instance.track('browser', userAgent);
    };
    TcTracker.trackScreenSize = function (width, height) {
        TcTracker_1.instance.track('screen', width + '-' + height);
    };
    TcTracker.trackLoggedIn = function () {
        TcTracker_1.instance.track('login');
    };
    TcTracker.trackLoggedOut = function () {
        TcTracker_1.instance.track('logout');
    };
    TcTracker.trackCampaignId = function (campaignId, trackingId) {
        TcTracker_1.instance.track('cid', campaignId);
        TcTracker_1.instance.track('cid-trading-id', trackingId);
    };
    TcTracker.trackConnected = function () {
        TcTracker_1.instance.track('connected');
    };
    TcTracker.trackLoadWorkspace = function () {
        TcTracker_1.instance.track('workspace', 'load');
    };
    TcTracker.trackFiltersCount = function (count) {
        TcTracker_1.instance.track('filters', 'c', count + '');
    };
    TcTracker.trackWatchlistsCount = function (count) {
        TcTracker_1.instance.track('watchlists', 'c', count + '');
    };
    TcTracker.trackUserDefinedIntervalsCount = function (count) {
        TcTracker_1.instance.track('userDefinedIntervals', 'c', count + '');
    };
    TcTracker.trackPagesCount = function (count) {
        TcTracker_1.instance.track('pages', 'c', count + '');
    };
    TcTracker.trackBoxesCount = function (count) {
        TcTracker_1.instance.track('boxes', 'c', count + '');
    };
    TcTracker.trackViewNews = function () {
        TcTracker_1.instance.track('news', 'view');
    };
    TcTracker.trackViewAnalysis = function () {
        TcTracker_1.instance.track('analysis', 'view');
    };
    TcTracker.trackToggleToolbar = function () {
        TcTracker_1.instance.track('toolbar', 'toggle');
    };
    TcTracker.trackAutoLink = function () {
        TcTracker_1.instance.track('autolink');
    };
    TcTracker.trackToggleMaximizeBox = function () {
        TcTracker_1.instance.track('maximize-box', 'toggle');
    };
    TcTracker.trackToggleMaximizeScreen = function () {
        TcTracker_1.instance.track('maximize-screen', 'toggle');
    };
    TcTracker.trackToggleMarketDetails = function () {
        TcTracker_1.instance.track('market-details', 'toggle');
    };
    TcTracker.trackDocking = function () {
        TcTracker_1.instance.track('docking', 'dock');
    };
    TcTracker.trackChartScreenshot = function () {
        TcTracker_1.instance.track('chart', 'screenshot');
    };
    TcTracker.trackChartPeriod = function (type) {
        TcTracker_1.instance.track('chart', 'period', EnumUtils.enumValueToString(PeriodType, type).toLowerCase());
    };
    TcTracker.trackChartInterval = function (type) {
        TcTracker_1.instance.track('chart', 'interval', EnumUtils.enumValueToString(IntervalType, type).toLowerCase());
    };
    TcTracker.trackChartIndicator = function (type) {
        TcTracker_1.instance.track('chart', 'indicator', EnumUtils.enumValueToString(TechnicalIndicatorType, type).toLowerCase());
    };
    TcTracker.trackChartMovingAverage = function (type, period) {
        TcTracker_1.instance.track('chart', 'avg', EnumUtils.enumValueToString(TechnicalIndicatorType, type).toLowerCase() + '-' + period);
    };
    TcTracker.trackVolumeProfilerRequest = function () {
        TcTracker_1.instance.track('volume-profiler', 'request');
    };
    TcTracker.trackConnectTo = function (hostname) {
        TcTracker_1.instance.track('streamer', 'connect', hostname);
    };
    TcTracker.trackHeartbeatDisconnection = function (market) {
        TcTracker_1.instance.track('heartbeat:' + market, 'disconnection');
    };
    TcTracker.trackHeartbeatReloading = function (market) {
        TcTracker_1.instance.track('heartbeat:' + market, 'reloading');
    };
    TcTracker.trackContactUs = function () {
        TcTracker_1.instance.track('support', 'contactus');
    };
    TcTracker.trackOpenWatchlistProperties = function () {
        TcTracker_1.instance.track('watchlist', 'properties');
    };
    TcTracker.trackOpenAlertCenter = function () {
        TcTracker_1.instance.track('alert', 'center');
    };
    TcTracker.trackOpenFilterProperties = function () {
        TcTracker_1.instance.track('filter', 'properties');
    };
    TcTracker.trackCreateSyncCloudWatchlist = function () {
        TcTracker_1.instance.track('watchlist-sync-cloud', 'create');
    };
    TcTracker.trackDeleteSyncCloudWatchlist = function () {
        TcTracker_1.instance.track('watchlist-sync-cloud', 'delete');
    };
    TcTracker.trackDeleteNonSyncedCloudWatchlist = function () {
        TcTracker_1.instance.track('watchlist-sync-cloud', 'delete-non-synced');
    };
    TcTracker.trackUpdateSyncCloudWatchlist = function () {
        TcTracker_1.instance.track('watchlist-sync-cloud', 'update');
    };
    TcTracker.trackRefreshSyncCloudWatchlist = function () {
        TcTracker_1.instance.track('watchlist-sync-cloud', 'refresh');
    };
    TcTracker.trackDeleteCloudWatchlist = function () {
        TcTracker_1.instance.track('watchlist-cloud', 'delete');
    };
    TcTracker.trackCreateOrUpdateCloudWatchlist = function () {
        TcTracker_1.instance.track('watchlist-cloud', 'create-or-update');
    };
    TcTracker.trackCreateWatchlist = function () {
        TcTracker_1.instance.track('watchlist', 'create');
    };
    TcTracker.trackDeleteWatchlist = function () {
        TcTracker_1.instance.track('watchlist', 'delete');
    };
    TcTracker.trackCreateFilter = function () {
        TcTracker_1.instance.track('filter', 'create');
    };
    TcTracker.trackDeleteFilter = function () {
        TcTracker_1.instance.track('filter', 'delete');
    };
    TcTracker.trackChangePage = function () {
        TcTracker_1.instance.track('page', 'change');
    };
    TcTracker.trackCreatePage = function () {
        TcTracker_1.instance.track('page', 'create');
    };
    TcTracker.trackDeletePage = function () {
        TcTracker_1.instance.track('page', 'delete');
    };
    TcTracker.trackSaveDrawing = function () {
        TcTracker_1.instance.track('drawing', 'save');
    };
    TcTracker.trackLoadDrawing = function () {
        TcTracker_1.instance.track('drawing', 'load');
    };
    TcTracker.trackDeleteDrawing = function () {
        TcTracker_1.instance.track('drawing', 'delete');
    };
    TcTracker.trackSaveAlert = function () {
        TcTracker_1.instance.track('alert', 'save');
    };
    TcTracker.trackUpdateAlert = function () {
        TcTracker_1.instance.track('alert', 'update');
    };
    TcTracker.trackDeleteAlert = function () {
        TcTracker_1.instance.track('alert', 'delete');
    };
    TcTracker.trackUpdateWorkspace = function () {
        TcTracker_1.instance.track('workspace', 'update');
    };
    TcTracker.trackSelectWorkspace = function () {
        TcTracker_1.instance.track('workspace', 'select');
    };
    TcTracker.trackResetWorkspace = function () {
        TcTracker_1.instance.track('workspace', 'reset');
    };
    TcTracker.trackMigrateWorkspace = function () {
        TcTracker_1.instance.track('workspace', 'migrate');
    };
    TcTracker.trackDeleteWorkspace = function () {
        TcTracker_1.instance.track('workspace', 'delete');
    };
    TcTracker.trackCreateWorkspace = function () {
        TcTracker_1.instance.track('workspace', 'create');
    };
    TcTracker.trackMarkDefaultWorkspace = function () {
        TcTracker_1.instance.track('workspace', 'mark-default');
    };
    TcTracker.trackSlowRequest = function (request, duration) {
        TcTracker_1.instance.track('perf', request, '' + duration);
    };
    TcTracker.trackConnectedToDerayah = function () {
        TcTracker_1.instance.track('api', 'enabled');
    };
    TcTracker.trackConnectedToSnbcapital = function () {
        TcTracker_1.instance.track('api', 'enabled');
    };
    TcTracker.trackConnectedToVirtualTrading = function () {
        TcTracker_1.instance.track("virtual-trading", "enabled");
    };
    TcTracker.trackVirtualTradingAddBuyFromChart = function () {
        TcTracker_1.instance.track("virtual-trading-chart", "add-buy");
    };
    TcTracker.trackVirtualTradingAddStopFromChart = function () {
        TcTracker_1.instance.track("virtual-trading-chart", "add-stop");
    };
    TcTracker.trackVirtualTradingAddSellFromChart = function () {
        TcTracker_1.instance.track("virtual-trading-chart", "add-sell");
    };
    TcTracker.trackVirtualTradingUpdateOrderFromChart = function () {
        TcTracker_1.instance.track("virtual-trading-chart", "update-order");
    };
    TcTracker.trackVirtualTradingUpdateTakeProfitFromChart = function () {
        TcTracker_1.instance.track("virtual-trading-chart", "update-take-profit");
    };
    TcTracker.trackVirtualTradingUpdateStopLossFromChart = function () {
        TcTracker_1.instance.track("virtual-trading-chart", "update-stop-loss");
    };
    TcTracker.trackVirtualTradingSellPositionFromChart = function () {
        TcTracker_1.instance.track("virtual-trading-chart", "position-sell");
    };
    TcTracker.trackVirtualTradingDeleteOrderFromChart = function () {
        TcTracker_1.instance.track("virtual-trading-chart", "delete-order");
    };
    TcTracker.trackVirtualTradingCancelTakeProfitFromChart = function () {
        TcTracker_1.instance.track("virtual-trading-chart", "cancel-take-profit");
    };
    TcTracker.trackVirtualTradingCancelStopLossFromChart = function () {
        TcTracker_1.instance.track("virtual-trading-chart", "cancel-stop-loss");
    };
    TcTracker.trackVirtualTradingAddManualOrder = function () {
        TcTracker_1.instance.track("virtual-trading-manual-order", "add");
    };
    TcTracker.trackVirtualTradingAddCapital = function () {
        TcTracker_1.instance.track("virtual-trading-capital", "add");
    };
    TcTracker.trackVirtualTradingAddOrder = function () {
        TcTracker_1.instance.track("virtual-trading-order", "add");
    };
    TcTracker.trackVirtualTradingUpdateOrder = function () {
        TcTracker_1.instance.track("virtual-trading-order", "update");
    };
    TcTracker.trackVirtualTradingDeleteOrder = function () {
        TcTracker_1.instance.track("virtual-trading-order", "delete");
    };
    TcTracker.trackVirtualTradingDeleteAccount = function () {
        TcTracker_1.instance.track("virtual-trading-account", "delete");
    };
    TcTracker.trackVirtualTradingCreateAccount = function () {
        TcTracker_1.instance.track("virtual-trading-account", "create");
    };
    TcTracker.trackVirtualTradingShowTransactions = function () {
        TcTracker_1.instance.track("virtual-trading-transactions", "view");
    };
    TcTracker.trackTradestationShowTransactions = function () {
        TcTracker_1.instance.track("tradestation-transactions", "view");
    };
    TcTracker.trackTradestationShowOrderDetails = function () {
        TcTracker_1.instance.track("tradestation-order-details", "view");
    };
    TcTracker.trackTradestationDeleteOrder = function () {
        TcTracker_1.instance.track("tradestation-order", "delete");
    };
    TcTracker.trackVirtualTradingShowOrderDetails = function () {
        TcTracker_1.instance.track("virtual-trading-order-details", "view");
    };
    TcTracker.trackLanguage = function (language) {
        TcTracker_1.instance.track("language", language);
    };
    TcTracker.trackTheme = function (theme) {
        TcTracker_1.instance.track("theme", theme);
    };
    TcTracker.trackSwitchTheme = function (theme) {
        TcTracker_1.instance.track("switch-theme", theme);
    };
    TcTracker.trackDevice = function (device) {
        TcTracker_1.instance.track("device", device);
    };
    TcTracker.trackSubscriptionMessage = function (messageType) {
        TcTracker_1.instance.track("subscription-message", messageType);
    };
    TcTracker.trackSubscriptionMessageAction = function (messageType) {
        TcTracker_1.instance.track("subscription-message-action", messageType);
    };
    TcTracker.trackTier = function (tier) {
        TcTracker_1.instance.track("tier", tier);
    };
    TcTracker.trackUrgentMessage = function (message) {
        TcTracker_1.instance.track('message', message);
        TcTracker_1.instance.sendToServer();
    };
    TcTracker.trackMessage = function (message) {
        TcTracker_1.instance.track('message', message);
    };
    TcTracker.trackSignin = function () {
        TcTracker_1.instance.track('login', 'signin');
    };
    TcTracker.trackSignup = function () {
        TcTracker_1.instance.track('login', 'signup');
    };
    TcTracker.trackWhatIsNewAction = function () {
        TcTracker_1.instance.track('what-is-new', 'action');
    };
    TcTracker.trackProxyNoCache = function () {
        TcTracker_1.instance.track('proxy-cache-enabled', 'no-cache');
    };
    TcTracker.trackProxyEnabled = function () {
        TcTracker_1.instance.track('proxy-cache-enabled', 'true');
    };
    TcTracker.trackProxyDisabled = function () {
        TcTracker_1.instance.track('proxy-cache-enabled', 'false');
    };
    TcTracker.trackProxyTimeout = function () {
        TcTracker_1.instance.track('proxy-cache-enabled', 'timeout');
    };
    TcTracker.trackSaveSignature = function () {
        TcTracker_1.instance.track('signature', 'save');
    };
    TcTracker.trackHasSignature = function (available) {
        TcTracker_1.instance.track('has-signature', available.toString());
    };
    TcTracker.trackDeleteSignature = function () {
        TcTracker_1.instance.track('signature', 'delete');
    };
    TcTracker.sendNow = function () {
        TcTracker_1.instance.sendToServer();
    };
    TcTracker.reportCriticalError = function (subject, message) {
        TcTracker_1.instance.http.post(TcUrlUtils.url('/m/liveweb/report/error'), JSON.stringify({ subject: subject, message: message }))
            .subscribe(function () { }, function (error) { });
    };
    TcTracker.prototype.track = function (feature, action, parameter) {
        if (action === void 0) { action = null; }
        if (parameter === void 0) { parameter = null; }
        var entry = feature;
        if (action) {
            entry += ':' + action;
        }
        if (parameter) {
            entry += ':' + parameter;
        }
        console.log("Track:" + entry);
        this.tracks.push(entry);
    };
    TcTracker.prototype.sendToServer = function () {
    };
    var TcTracker_1;
    TcTracker = TcTracker_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], TcTracker);
    return TcTracker;
}());
export { TcTracker };
//# sourceMappingURL=tc-tracker.js.map