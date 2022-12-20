var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Subject } from "rxjs";
import { MarketUtils, Tc } from '../../../utils/index';
import { MessageType } from '../shared/index';
import { AbstractStreamer } from "./abstract-streamer";
var MarketStreamer = (function (_super) {
    __extends(MarketStreamer, _super);
    function MarketStreamer(heartbeatManager, streamerMarket, debugModeService) {
        var _this = _super.call(this, heartbeatManager, streamerMarket.abbreviation) || this;
        _this.streamerMarket = streamerMarket;
        _this.debugModeService = debugModeService;
        _this.marketDepthByPriceTopic = 'MBP';
        _this.marketDepthByOrderTopic = 'MBO';
        _this.market = streamerMarket;
        _this.quoteMessageStream = new Subject();
        _this.timeAndSaleMessageStream = new Subject();
        _this.marketSummaryStream = new Subject();
        _this.marketDepthByOrderStream = new Subject();
        _this.marketAlertStream = new Subject();
        _this.bigTradeStream = new Subject();
        _this.ChartIntradayMessageStream = new Subject();
        _this.ChartDailyMessageStream = new Subject();
        _this.marketDepthByPriceTopic = _this.market.marketDepthByPriceTopic;
        if (_this.marketDepthByPriceTopic == 'MBP10') {
            _this.marketDepthByOrderTopic = 'MBO10';
        }
        if (_this.debugModeService.connectToDebugStreamer()) {
            _this.initChannel(_this.debugModeService.getDebugStreamerUrl(), true);
        }
        else {
            _this.initChannel(_this.market.streamerUrl, true);
        }
        return _this;
    }
    MarketStreamer.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    MarketStreamer.prototype.subscribeQuote = function (symbol) {
        var topic = "QO." + symbol;
        this.subscribeTopic(topic);
    };
    MarketStreamer.prototype.subscribeQuotes = function (symbols) {
        var topics = [];
        symbols.forEach(function (symbol) {
            topics.push("QO." + symbol);
        });
        this.subscribeTopics(topics);
    };
    MarketStreamer.prototype.unSubscribeQuote = function (symbol) {
        var topic = "QO." + symbol;
        this.unSubscribeTopic(topic);
    };
    MarketStreamer.prototype.unSubscribeQuotes = function (symbols) {
        var topics = [];
        symbols.forEach(function (symbol) {
            topics.push("QO." + symbol);
        });
        this.unSubscribeTopics(topics);
    };
    MarketStreamer.prototype.subscribeTimeAndSale = function (symbol) {
        var topic = "TAS." + symbol;
        this.subscribeTopic(topic);
    };
    MarketStreamer.prototype.unSubscribeTimeAndSale = function (symbol) {
        var topic = "TAS." + symbol;
        this.unSubscribeTopic(topic);
    };
    MarketStreamer.prototype.subscribeMarketSummary = function () {
        if (this.market.abbreviation == 'TAD') {
            this.subscribeTopic("MSE.MSE." + this.market.abbreviation);
        }
        else {
            this.subscribeTopic("MS.MS." + this.market.abbreviation);
        }
    };
    MarketStreamer.prototype.subscribeMarketDepthByOrder = function (symbol) {
        this.subscribeTopic(this.marketDepthByOrderTopic + "." + symbol);
    };
    MarketStreamer.prototype.subscribeMarketDepthByPrice = function (symbol) {
        this.subscribeTopic(this.marketDepthByPriceTopic + "." + symbol);
    };
    MarketStreamer.prototype.subscribeMarketAlerts = function () {
        this.subscribeTopic("MA.MA." + this.market.abbreviation);
    };
    MarketStreamer.prototype.subscribeBigTrade = function () {
        this.subscribeTopic("BT.BT." + this.market.abbreviation);
    };
    MarketStreamer.prototype.subscribeChartIntrday = function (symbol) {
        var topic = "CMIN." + symbol;
        this.subscribeTopic(topic);
    };
    MarketStreamer.prototype.unSubscribeChartIntrday = function (symbol) {
        var topic = "CMIN." + symbol;
        this.unSubscribeTopic(topic);
    };
    MarketStreamer.prototype.subscribeChartDaily = function (symbol) {
        var topic = "CDAY." + symbol;
        this.subscribeTopic(topic);
    };
    MarketStreamer.prototype.unSubscribeChartDaily = function (symbol) {
        var topic = "CDAY." + symbol;
        this.unSubscribeTopic(topic);
    };
    MarketStreamer.prototype.getQuoteMessageStream = function () {
        return this.quoteMessageStream;
    };
    MarketStreamer.prototype.getTimeAndSaleMessageStream = function () {
        return this.timeAndSaleMessageStream;
    };
    MarketStreamer.prototype.getChartIntradayMessageStream = function () {
        return this.ChartIntradayMessageStream;
    };
    MarketStreamer.prototype.getChartDailyMessageStream = function () {
        return this.ChartDailyMessageStream;
    };
    MarketStreamer.prototype.getMarketSummaryStream = function () {
        return this.marketSummaryStream;
    };
    MarketStreamer.prototype.getMarketDepthByOrderStream = function () {
        return this.marketDepthByOrderStream;
    };
    MarketStreamer.prototype.getMarketAlertStream = function () {
        return this.marketAlertStream;
    };
    MarketStreamer.prototype.getBigTradeStream = function () {
        return this.bigTradeStream;
    };
    MarketStreamer.prototype.onMessageReceive = function (message) {
        var messageType = this.getMessageType(message['topic']);
        switch (messageType) {
            case MessageType.QUOTE:
                this.processQuoteMessage(message);
                break;
            case MessageType.TIME_AND_SALE:
                this.processTimeAndSaleMessage(message);
                break;
            case MessageType.HEARTBEAT:
                this.processHeartbeatMessage(message);
                break;
            case MessageType.MARKET_SUMMARY:
                this.processMarketSummaryMessage(message);
                break;
            case MessageType.MARKET_DEPTH_BY_ORDER:
            case MessageType.MARKET_DEPTH_BY_PRICE:
            case MessageType.MARKET_DEPTH_BY_PRICE_10:
            case MessageType.MARKET_DEPTH_BY_ORDER_10:
                this.processMarketDepthMessage(messageType, message);
                break;
            case MessageType.MARKET_ALERT:
                this.processMarketAlertMessage(message);
                break;
            case MessageType.BIG_TRADE:
                this.processBigTradeMessage(message);
                break;
            case MessageType.CHART_INTRADAY:
                this.processChartIntradayMessage(message);
                break;
            case MessageType.CHART_DAILY:
                this.processChartDailyMessage(message);
                break;
            default:
                Tc.error("unknown message type " + messageType + " for message " + message);
                break;
        }
    };
    MarketStreamer.prototype.processQuoteMessage = function (message) {
        var topicSegments = MarketUtils.splitTopic(message.topic);
        message.symbol = topicSegments[1] + '.' + topicSegments[2];
        this.quoteMessageStream.next(message);
    };
    MarketStreamer.prototype.processTimeAndSaleMessage = function (groupedMessage) {
        var _this = this;
        this.splitGroupedMessage(groupedMessage).forEach(function (message) {
            var topicSegments = MarketUtils.splitTopic(message['topic']);
            message.symbol = topicSegments[1] + '.' + topicSegments[2];
            _this.timeAndSaleMessageStream.next(message);
        });
    };
    MarketStreamer.prototype.processChartIntradayMessage = function (message) {
        var topicSegments = MarketUtils.splitTopic(message['topic']);
        message.symbol = topicSegments[1] + '.' + topicSegments[2];
        this.ChartIntradayMessageStream.next(message);
    };
    MarketStreamer.prototype.processChartDailyMessage = function (message) {
        var topicSegments = MarketUtils.splitTopic(message['topic']);
        message.symbol = topicSegments[1] + '.' + topicSegments[2];
        this.ChartDailyMessageStream.next(message);
    };
    MarketStreamer.prototype.processBigTradeMessage = function (groupedMessage) {
        var _this = this;
        this.splitGroupedMessage(groupedMessage).forEach(function (message) {
            message.symbol = message['symbol'];
            _this.bigTradeStream.next(message);
        });
    };
    MarketStreamer.prototype.processMarketSummaryMessage = function (message) {
        message.market = this.market.abbreviation;
        this.marketSummaryStream.next(message);
    };
    MarketStreamer.prototype.processMarketDepthMessage = function (messageType, message) {
        var topicSegments = MarketUtils.splitTopic(message['topic']);
        message.symbol = topicSegments[1] + '.' + topicSegments[2];
        message.groupedByPrice =
            (messageType != MessageType.MARKET_DEPTH_BY_ORDER &&
                messageType != MessageType.MARKET_DEPTH_BY_ORDER_10);
        this.marketDepthByOrderStream.next(message);
    };
    MarketStreamer.prototype.processMarketAlertMessage = function (groupedMessage) {
        var _this = this;
        this.splitGroupedMessage(groupedMessage).forEach(function (message) {
            _this.marketAlertStream.next(message);
        });
    };
    MarketStreamer.prototype.splitGroupedMessage = function (groupedMessage) {
        var fields = {};
        var numberOfMessages = -1;
        Object.keys(groupedMessage).forEach(function (key) {
            if (key == 'topic') {
                return;
            }
            var values = groupedMessage[key].split(';');
            values.pop();
            if (numberOfMessages == -1) {
                numberOfMessages = values.length;
            }
            else {
                Tc.assert(numberOfMessages == values.length, "wrong number of grouped fields");
            }
            fields[key] = values;
        });
        var messages = [];
        var _loop_1 = function (index) {
            var message = {};
            message['topic'] = groupedMessage['topic'];
            Object.keys(fields).forEach(function (key) {
                message[key] = fields[key][index];
            });
            messages.push(message);
        };
        for (var index = 0; index < numberOfMessages; ++index) {
            _loop_1(index);
        }
        return messages;
    };
    return MarketStreamer;
}(AbstractStreamer));
export { MarketStreamer };
//# sourceMappingURL=market-streamer.js.map