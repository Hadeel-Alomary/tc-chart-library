import { Tc } from "../../../utils/index";
import { StreamerChannel } from "../streamer-channel/streamer-channel";
import { MessageType } from "../shared/index";
var AbstractStreamer = (function () {
    function AbstractStreamer(heartbeatManager, marketAbbr) {
        this.heartbeatManager = heartbeatManager;
        this.marketAbbr = marketAbbr;
        this.subscribedTopics = [];
    }
    AbstractStreamer.prototype.initChannel = function (streamerUrl, connectImmediately) {
        this.streamerUrl = streamerUrl;
        if (connectImmediately) {
            this.initConnectionOnce();
        }
    };
    AbstractStreamer.prototype.reInitChannel = function (streamerUrl) {
        this.streamerUrl = streamerUrl;
        this.initStreamerChannel();
    };
    AbstractStreamer.prototype.onDestroy = function () {
        this.channel.disconnect();
    };
    AbstractStreamer.prototype.subscribeHeartbeat = function () {
        this.subscribeTopic(this.getHeartBeatTopic());
        this.monitorMarket();
    };
    AbstractStreamer.prototype.monitorMarket = function () {
        this.heartbeatManager.monitorMarket(this.marketAbbr);
    };
    AbstractStreamer.prototype.getHeartBeatTopic = function () {
        return "HB.HB." + this.marketAbbr;
    };
    AbstractStreamer.prototype.getMessageType = function (topic) {
        if (topic.startsWith('QO.')) {
            return MessageType.QUOTE;
        }
        else if (topic.startsWith('TAS.')) {
            return MessageType.TIME_AND_SALE;
        }
        else if (topic.startsWith('HB.HB.')) {
            return MessageType.HEARTBEAT;
        }
        else if (topic.startsWith('MSE.MSE') || (this.marketAbbr !== 'TAD' && topic.startsWith('MS.MS'))) {
            return MessageType.MARKET_SUMMARY;
        }
        else if (topic.startsWith('MBO.')) {
            return MessageType.MARKET_DEPTH_BY_ORDER;
        }
        else if (topic.startsWith('MBO10.')) {
            return MessageType.MARKET_DEPTH_BY_ORDER_10;
        }
        else if (topic.startsWith('MBP.')) {
            return MessageType.MARKET_DEPTH_BY_PRICE;
        }
        else if (topic.startsWith('MBP10.')) {
            return MessageType.MARKET_DEPTH_BY_PRICE_10;
        }
        else if (topic.startsWith('MA.MA.')) {
            return MessageType.MARKET_ALERT;
        }
        else if (topic.startsWith('BT.BT.')) {
            return MessageType.BIG_TRADE;
        }
        else if (topic.startsWith('ALERT.TC.')) {
            return MessageType.ALERTS;
        }
        else if (topic.startsWith('NEWS.NEWS.')) {
            return MessageType.NEWS;
        }
        else if (topic.startsWith('COM.ANA.')) {
            return MessageType.ANALYSIS;
        }
        else if (topic.startsWith('VT.TC.')) {
            return MessageType.VIRTUAL_TRADING;
        }
        else if (topic.indexOf('.liquidity.') > -1) {
            return MessageType.LIQUIDITY;
        }
        else if (topic.startsWith('COM.NOT.')) {
            return MessageType.COMMUNITY_NOTIFICATIONS;
        }
        else if (topic.startsWith('CMIN.')) {
            return MessageType.CHART_INTRADAY;
        }
        else if (topic.startsWith('CDAY.')) {
            return MessageType.CHART_DAILY;
        }
        else if (topic.indexOf('.num-alerts.') > -1) {
            return MessageType.TECHNICAL_SCOPE;
        }
        else if (topic.indexOf('NA.') > -1) {
            return MessageType.TECHNICAL_SCOPE_QUOTE;
        }
        else if (topic.indexOf('I.') > -1) {
            return MessageType.TECHNICAL_INDICATOR;
        }
        Tc.error("fail to extract message type from topic " + topic);
        return null;
    };
    AbstractStreamer.prototype.subscribeTopic = function (topic) {
        this.initConnectionOnce();
        if (!this.subscribedTopics.includes(topic)) {
            this.subscribedTopics.push(topic);
            this.channel.subscribeTopic(topic);
        }
    };
    AbstractStreamer.prototype.unSubscribeTopic = function (topic) {
        if (this.subscribedTopics.includes(topic)) {
            this.subscribedTopics.splice(this.subscribedTopics.indexOf(topic), 1);
            this.channel.unSubscribeTopic(topic);
        }
    };
    AbstractStreamer.prototype.subscribeTopics = function (topics) {
        var _this = this;
        this.initConnectionOnce();
        var notSubscribedTopics = topics.filter(function (topic) { return !_this.subscribedTopics.includes(topic); });
        var groupedTopics = this.groupTopics(notSubscribedTopics);
        notSubscribedTopics.forEach(function (topic) { return _this.subscribedTopics.push(topic); });
        groupedTopics.forEach(function (groupedTopic) { return _this.channel.subscribeTopic(groupedTopic); });
    };
    AbstractStreamer.prototype.unSubscribeTopics = function (topics) {
        var _this = this;
        var subscribedTopics = topics.filter(function (topic) { return _this.subscribedTopics.includes(topic); });
        var groupedTopics = this.groupTopics(subscribedTopics);
        subscribedTopics.forEach(function (topic) { return _this.subscribedTopics.splice(_this.subscribedTopics.indexOf(topic), 1); });
        groupedTopics.forEach(function (groupedTopic) { return _this.channel.unSubscribeTopic(groupedTopic); });
    };
    AbstractStreamer.prototype.groupTopics = function (topics) {
        var groupedTopics = [];
        var tmpTopics = topics.slice(0);
        while (0 < tmpTopics.length) {
            var topicsBatch = tmpTopics.splice(0, 50);
            groupedTopics.push(topicsBatch.join(','));
        }
        return groupedTopics;
    };
    AbstractStreamer.prototype.processHeartbeatMessage = function (message) {
        message.market = this.marketAbbr;
        this.heartbeatManager.heartbeatReceived(message.market);
        console.log("Heartbeat " + message.market);
    };
    AbstractStreamer.prototype.initConnectionOnce = function () {
        if (!this.isConnectionEstablished()) {
            this.initStreamerChannel();
            this.subscribeHeartbeat();
        }
    };
    AbstractStreamer.prototype.isConnectionEstablished = function () {
        return this.channel != null;
    };
    AbstractStreamer.prototype.initStreamerChannel = function () {
        var _this = this;
        if (this.channel) {
            this.channel.disconnect();
        }
        var url = this.streamerUrl;
        this.channel = new StreamerChannel();
        this.channel.getMessageStream()
            .subscribe(function (message) { return _this.onMessageReceive(message); });
        this.channel.initWebSocket(url);
        this.reSubscribeTopics();
    };
    AbstractStreamer.prototype.reSubscribeTopics = function () {
        var _this = this;
        var groupedTopics = this.groupTopics(this.subscribedTopics);
        groupedTopics.forEach(function (groupedTopic) { return _this.channel.subscribeTopic(groupedTopic); });
    };
    return AbstractStreamer;
}());
export { AbstractStreamer };
//# sourceMappingURL=abstract-streamer.js.map