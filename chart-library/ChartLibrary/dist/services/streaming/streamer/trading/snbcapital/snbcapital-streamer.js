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
import { AbstractStreamer } from '../../abstract-streamer';
import { Subject } from 'rxjs';
import { Tc, TcTracker } from '../../../../../utils';
import { SnbcapitalMessageType } from './snbcapitalMessageType';
var SnbcapitalStreamer = (function (_super) {
    __extends(SnbcapitalStreamer, _super);
    function SnbcapitalStreamer() {
        var _this = _super.call(this, null, null) || this;
        _this.snbcapitalOrderStream = new Subject();
        _this.snbcapitalPositionStream = new Subject();
        _this.snbcapitalPurchasePowerStream = new Subject();
        _this.snbcapitalNotificationTimeOutStream = new Subject();
        return _this;
    }
    SnbcapitalStreamer.prototype.onDestroy = function () {
        this.disconnect();
        _super.prototype.onDestroy.call(this);
    };
    SnbcapitalStreamer.prototype.disconnect = function () {
        if (this.channel) {
            this.channel.disconnect();
        }
        this.channel = null;
        window.clearInterval(this.timerId);
    };
    SnbcapitalStreamer.prototype.start = function (url) {
        var _this = this;
        this.initChannel(url, false);
        this.timerId = window.setInterval(function () { return _this.checkHeartbeatTimeout(); }, 1000);
    };
    SnbcapitalStreamer.prototype.getSnbCapitalOrderStream = function () {
        return this.snbcapitalOrderStream;
    };
    SnbcapitalStreamer.prototype.getSnbCapitalPositionStream = function () {
        return this.snbcapitalPositionStream;
    };
    SnbcapitalStreamer.prototype.getSnbCapitalPurchasePowerStream = function () {
        return this.snbcapitalPurchasePowerStream;
    };
    SnbcapitalStreamer.prototype.getsnbcapitalNotificationTimeOutStream = function () {
        return this.snbcapitalNotificationTimeOutStream;
    };
    SnbcapitalStreamer.prototype.subscribeHeartbeat = function () {
        this.subscribeTopic(this.getHeartBeatTopic());
    };
    SnbcapitalStreamer.prototype.getHeartBeatTopic = function () {
        return 'HB.HB.SNB';
    };
    SnbcapitalStreamer.prototype.subscribeSnbCapitalTopics = function (portfolios) {
        var orderTopic = "SNB.".concat(portfolios[0].gBSCustomerCode, ".ORDER");
        var positionTopic = "SNB.".concat(portfolios[0].gBSCustomerCode, ".POSITION");
        for (var _i = 0, portfolios_1 = portfolios; _i < portfolios_1.length; _i++) {
            var portfolio = portfolios_1[_i];
            var purchasePowerTopic = "SNB.".concat(portfolio.cashAccountCode, "_").concat(portfolio.cashAccountBranchCode, ".CASHBALANCE");
            this.subscribeTopic(purchasePowerTopic);
        }
        this.subscribeTopic(orderTopic);
        this.subscribeTopic(positionTopic);
    };
    SnbcapitalStreamer.prototype.unSubscribeSnbCapitalTopics = function (portfolios) {
        var orderTopic = "SNB.".concat(portfolios[0].gBSCustomerCode, ".ORDER");
        var positionTopic = "SNB.".concat(portfolios[0].gBSCustomerCode, ".POSITION");
        for (var _i = 0, portfolios_2 = portfolios; _i < portfolios_2.length; _i++) {
            var portfolio = portfolios_2[_i];
            var purchasePowerTopic = "SNB.".concat(portfolio.cashAccountCode, "_").concat(portfolio.cashAccountBranchCode, ".CASHBALANCE");
            this.unSubscribeTopic(purchasePowerTopic);
        }
        this.unSubscribeTopic(orderTopic);
        this.unSubscribeTopic(positionTopic);
    };
    SnbcapitalStreamer.prototype.getSnbcapitalMessageType = function (topic) {
        if (topic.startsWith('HB.HB.')) {
            return SnbcapitalMessageType.HEARTBEAT;
        }
        else if (topic.startsWith('SNB.')) {
            if (topic.endsWith('.ORDER'))
                return SnbcapitalMessageType.SNBCAPITAL_ORDER;
            else if (topic.endsWith('.POSITION'))
                return SnbcapitalMessageType.SNBCAPITAL_POSITION;
            else if (topic.endsWith('.CASHBALANCE')) {
                return SnbcapitalMessageType.SNBCAPITAL_PURCHASE_POWER;
            }
        }
        Tc.error("fail to extract message type from topic " + topic);
        return null;
    };
    SnbcapitalStreamer.prototype.onMessageReceive = function (message) {
        var messageType = this.getSnbcapitalMessageType(message['topic']);
        switch (messageType) {
            case SnbcapitalMessageType.SNBCAPITAL_ORDER:
                this.snbcapitalOrderStream.next(true);
                break;
            case SnbcapitalMessageType.SNBCAPITAL_POSITION:
                var positionStreamingMessage = JSON.parse((message['message']));
                var portfolioId = positionStreamingMessage.saCode;
                this.snbcapitalPositionStream.next(portfolioId);
                break;
            case SnbcapitalMessageType.SNBCAPITAL_PURCHASE_POWER:
                var purchasePowerStreamingMessage = JSON.parse((message['message']));
                var purchasePowerMessage = this.mapPurchasePowerMessage(purchasePowerStreamingMessage);
                this.snbcapitalPurchasePowerStream.next(purchasePowerMessage);
                break;
            case SnbcapitalMessageType.HEARTBEAT:
                this.processHeartbeatMessage();
                break;
            default:
                Tc.error('unknown message type: ' + SnbcapitalMessageType[messageType]);
        }
    };
    SnbcapitalStreamer.prototype.monitorMarket = function () {
    };
    SnbcapitalStreamer.prototype.processHeartbeatMessage = function () {
        this.heartbeatReceived();
    };
    SnbcapitalStreamer.prototype.heartbeatReceived = function () {
        this.lastReceivedHeartBeat = Date.now();
    };
    SnbcapitalStreamer.prototype.checkHeartbeatTimeout = function () {
        if ((Date.now() - this.lastReceivedHeartBeat > SnbcapitalStreamer.THRESHOLD)) {
            this.snbcapitalNotificationTimeOutStream.next(true);
            Tc.warn("heartbeat disconnection detected for SnbCapital notification streamer, request restart");
            TcTracker.trackHeartbeatDisconnection("SnbCapital notification streamer disconnection ");
            this.lastReceivedHeartBeat = Date.now();
        }
    };
    SnbcapitalStreamer.prototype.mapPurchasePowerMessage = function (purchasePowerMessage) {
        return {
            purchasePower: +purchasePowerMessage.buyingPower_value,
            cashAccountCode: purchasePowerMessage.caCode,
            currencyType: purchasePowerMessage.currencyCode
        };
    };
    SnbcapitalStreamer.THRESHOLD = 45000;
    return SnbcapitalStreamer;
}(AbstractStreamer));
export { SnbcapitalStreamer };
//# sourceMappingURL=snbcapital-streamer.js.map