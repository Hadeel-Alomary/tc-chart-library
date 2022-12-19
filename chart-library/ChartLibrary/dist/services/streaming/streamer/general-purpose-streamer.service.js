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
import { Subject } from 'rxjs';
import { MessageType } from '../shared/index';
import { Tc } from '../../../utils/index';
import { AbstractStreamer } from './abstract-streamer';
var GeneralPurposeStreamer = (function (_super) {
    __extends(GeneralPurposeStreamer, _super);
    function GeneralPurposeStreamer(heartbeatManager) {
        var _this = _super.call(this, heartbeatManager, 'GP') || this;
        _this.alertsStreamer = new Subject();
        _this.technicalScopeStreamer = new Subject();
        _this.technicalScopeQuoteStreamer = new Subject();
        _this.newsStreamer = new Subject();
        _this.analysisStreamer = new Subject();
        _this.tradingStreamer = new Subject();
        _this.communityNotificationsStreamer = new Subject();
        return _this;
    }
    GeneralPurposeStreamer.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    GeneralPurposeStreamer.prototype.getAlertsStream = function () {
        return this.alertsStreamer;
    };
    GeneralPurposeStreamer.prototype.getNewsStreamer = function () {
        return this.newsStreamer;
    };
    GeneralPurposeStreamer.prototype.getAnalysisStreamer = function () {
        return this.analysisStreamer;
    };
    GeneralPurposeStreamer.prototype.getTradingStreamer = function () {
        return this.tradingStreamer;
    };
    GeneralPurposeStreamer.prototype.getCommunityNotificationsStreamer = function () {
        return this.communityNotificationsStreamer;
    };
    GeneralPurposeStreamer.prototype.getTechnicalScopeStreamer = function () {
        return this.technicalScopeStreamer;
    };
    GeneralPurposeStreamer.prototype.getTechnicalScopeQuoteStreamer = function () {
        return this.technicalScopeQuoteStreamer;
    };
    GeneralPurposeStreamer.prototype.subscribeAlerts = function (userName) {
        userName = userName.toUpperCase();
        this.subscribeTopic("ALERT.TC.".concat(userName));
    };
    GeneralPurposeStreamer.prototype.subscribeNews = function (marketAbrv) {
        this.subscribeTopic("NEWS.NEWS.".concat(marketAbrv));
    };
    GeneralPurposeStreamer.prototype.subscribeAnalysis = function (marketAbrv) {
        this.subscribeTopic("COM.ANA.".concat(marketAbrv));
    };
    GeneralPurposeStreamer.prototype.subscribeVirtualTrading = function (user) {
        this.subscribeTopic("VT.TC.".concat(user.toUpperCase()));
    };
    GeneralPurposeStreamer.prototype.subscribeCommunityNotifications = function (userId) {
        this.subscribeTopic("COM.NOT.".concat(userId));
    };
    GeneralPurposeStreamer.prototype.reSubscribeTopics = function () {
        var _this = this;
        this.subscribedTopics.forEach(function (topic) {
            _this.channel.subscribeTopic(topic);
        });
    };
    GeneralPurposeStreamer.prototype.subscribeTechnicalScope = function (interval, marketAbbr) {
        this.subscribeTopic("".concat(interval, ".num-alerts.").concat(marketAbbr));
    };
    GeneralPurposeStreamer.prototype.unSubscribeTechnicalScope = function (interval, marketAbbr) {
        var topic = "".concat(interval, ".num-alerts.").concat(marketAbbr);
        this.unSubscribeTopic(topic);
    };
    GeneralPurposeStreamer.prototype.subscribeTechnicalScopeQuote = function (topics) {
        this.subscribeTopics(topics);
    };
    GeneralPurposeStreamer.prototype.unSubscribeTechnicalScopeQuote = function (topics) {
        this.unSubscribeTopics(topics);
    };
    GeneralPurposeStreamer.prototype.onMessageReceive = function (message) {
        var messageType = this.getMessageType(message['topic']);
        switch (messageType) {
            case MessageType.ALERTS:
                this.processAlertsMessage(message);
                break;
            case MessageType.NEWS:
                this.processNewsMessage(message);
                break;
            case MessageType.ANALYSIS:
                this.processAnalysisMessage(message);
                break;
            case MessageType.HEARTBEAT:
                this.processHeartbeatMessage(message);
                break;
            case MessageType.VIRTUAL_TRADING:
                this.processVirtualTradingMessage(message);
                break;
            case MessageType.COMMUNITY_NOTIFICATIONS:
                this.processCommunityNotificationsMessage(message);
                break;
            case MessageType.TECHNICAL_SCOPE:
                this.processTechnicalScopeMessage(message);
                break;
            case MessageType.TECHNICAL_SCOPE_QUOTE:
                this.processTechnicalScopeQuoteMessage(message);
                break;
            default:
                Tc.error('unknown message type: ' + MessageType[messageType]);
        }
    };
    GeneralPurposeStreamer.prototype.processAlertsMessage = function (message) {
        this.alertsStreamer.next(message);
    };
    GeneralPurposeStreamer.prototype.processNewsMessage = function (message) {
        this.newsStreamer.next(message);
    };
    GeneralPurposeStreamer.prototype.processAnalysisMessage = function (message) {
        this.analysisStreamer.next(message);
    };
    GeneralPurposeStreamer.prototype.processVirtualTradingMessage = function (message) {
        this.tradingStreamer.next(message);
    };
    GeneralPurposeStreamer.prototype.processCommunityNotificationsMessage = function (message) {
        this.communityNotificationsStreamer.next(message);
    };
    GeneralPurposeStreamer.prototype.processTechnicalScopeMessage = function (message) {
        this.technicalScopeStreamer.next(message);
    };
    GeneralPurposeStreamer.prototype.processTechnicalScopeQuoteMessage = function (message) {
        this.technicalScopeQuoteStreamer.next(message);
    };
    return GeneralPurposeStreamer;
}(AbstractStreamer));
export { GeneralPurposeStreamer };
//# sourceMappingURL=general-purpose-streamer.service.js.map