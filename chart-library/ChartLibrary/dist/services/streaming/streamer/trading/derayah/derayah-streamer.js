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
import { AbstractStreamer } from '../../abstract-streamer';
import { Subject } from 'rxjs';
import { Tc, TcTracker } from '../../../../../utils';
import { DerayahMessageType } from './derayahMessageType';
import { DerayahOrderTypeWrapper } from '../../../../trading/derayah/derayah-order/derayah-order-type';
import { DerayahOrderStatus, DerayahOrderStatusType } from '../../../../trading/derayah/derayah-order/derayah-order-status';
import { DerayahOrderExecution, DerayahOrderLastActionStatus } from '../../../../trading/derayah/derayah-order';
var DerayahStreamer = (function (_super) {
    __extends(DerayahStreamer, _super);
    function DerayahStreamer() {
        var _this = _super.call(this, null, null) || this;
        _this.derayahOrderStream = new Subject();
        _this.derayahPositionStream = new Subject();
        _this.derayahNotificationTimeOutStream = new Subject();
        _this.derayahNotFoundQueueStream = new Subject();
        return _this;
    }
    DerayahStreamer.prototype.onDestroy = function () {
        this.disconnect();
        _super.prototype.onDestroy.call(this);
    };
    DerayahStreamer.prototype.disconnect = function () {
        if (this.channel) {
            this.channel.disconnect();
        }
        this.channel = null;
        window.clearInterval(this.timerId);
        TcTracker.trackMessage('disconnect derayah streamer');
    };
    DerayahStreamer.prototype.start = function (url) {
        var _this = this;
        this.initChannel(url, false);
        this.timerId = window.setInterval(function () { return _this.checkHeartbeatTimeout(); }, 1000);
        TcTracker.trackMessage('start derayah streamer');
    };
    DerayahStreamer.prototype.getDerayahOrderStream = function () {
        return this.derayahOrderStream;
    };
    DerayahStreamer.prototype.getDerayahPositionStream = function () {
        return this.derayahPositionStream;
    };
    DerayahStreamer.prototype.getDerayahNotificationTimeOutStream = function () {
        return this.derayahNotificationTimeOutStream;
    };
    DerayahStreamer.prototype.getDerayahNotFoundQueueStream = function () {
        return this.derayahNotFoundQueueStream;
    };
    DerayahStreamer.prototype.subscribeHeartbeat = function () {
        this.subscribeTopic(this.getHeartBeatTopic());
    };
    DerayahStreamer.prototype.getHeartBeatTopic = function () {
        return 'HB.HB.DN';
    };
    DerayahStreamer.prototype.subscribeDerayahTopic = function (topicId, userName) {
        var topic = "DN." + topicId + "." + userName;
        this.subscribeTopic(topic);
    };
    DerayahStreamer.prototype.unSubscribederayahTopics = function (portfolios, userName) {
        for (var _i = 0, portfolios_1 = portfolios; _i < portfolios_1.length; _i++) {
            var portfolio = portfolios_1[_i];
            var purchasePowerTopic = "DN." + portfolio + "." + userName;
            this.unSubscribeTopic(purchasePowerTopic);
        }
    };
    DerayahStreamer.prototype.getDerayahMessageType = function (message) {
        var topic = message['topic'];
        if (topic.startsWith('HB.HB.')) {
            return DerayahMessageType.HEARTBEAT;
        }
        else if (topic.startsWith('DN.')) {
            if ('status' in message) {
                var messageStatus = message['status'];
                return this.getDerayahMessageTypeBasedOnMessageStatus(messageStatus.toLowerCase());
            }
            else if ('message' in message) {
                var derayahStreamingMessage = JSON.parse((message['message']));
                var updatedOrderInfo = this.mapDerayahStreamerMessage(derayahStreamingMessage);
                return this.getDerayahMessageTypeBasedOnOrderStatus(updatedOrderInfo.status.type);
            }
        }
        Tc.error('fail to extract message type from topic ' + topic);
        return null;
    };
    DerayahStreamer.prototype.mapDerayahStreamerMessage = function (derayahStreamingMessage) {
        return {
            id: derayahStreamingMessage.$id,
            type: DerayahOrderTypeWrapper.fromType(derayahStreamingMessage.orderSide),
            portfolio: derayahStreamingMessage.portfolioID,
            symbol: derayahStreamingMessage.stockID,
            date: derayahStreamingMessage.orderDate,
            execution: DerayahOrderExecution.getExecutionByType(derayahStreamingMessage.orderType),
            quantity: derayahStreamingMessage.dealQuantity,
            executedQuantity: derayahStreamingMessage.filledQuantity,
            price: derayahStreamingMessage.price,
            status: DerayahOrderStatus.getStatusByType(derayahStreamingMessage.orderStatus),
            lastActionStatus: DerayahOrderLastActionStatus.getStatusByType(derayahStreamingMessage.lastActionStatus),
        };
    };
    DerayahStreamer.prototype.getDerayahMessageTypeBasedOnOrderStatus = function (orderStatus) {
        switch (orderStatus) {
            case DerayahOrderStatusType.Open:
            case DerayahOrderStatusType.StopOrCancelled:
            case DerayahOrderStatusType.New:
            case DerayahOrderStatusType.Cancelled:
            case DerayahOrderStatusType.Rejected:
            case DerayahOrderStatusType.ActivePurchaseOrSaleEquityInternetOrder:
            case DerayahOrderStatusType.CancelledPurchaseOrSaleEquityOrder:
            case DerayahOrderStatusType.Expired:
                return DerayahMessageType.DERAYAH_ORDER;
            default:
                return DerayahMessageType.DERAYAH_POSITION;
        }
    };
    DerayahStreamer.prototype.getDerayahMessageTypeBasedOnMessageStatus = function (messageStatus) {
        switch (messageStatus) {
            case 'canceled':
            case 'shutdown':
            case 'not_found':
                TcTracker.trackMessage('derayah notificaton ' + messageStatus);
                return DerayahMessageType.DERAYAH_RENEW_QUEUE_ID;
        }
    };
    DerayahStreamer.prototype.onMessageReceive = function (message) {
        var messageType = this.getDerayahMessageType(message);
        switch (messageType) {
            case DerayahMessageType.DERAYAH_ORDER:
                this.derayahOrderStream.next(true);
                break;
            case DerayahMessageType.DERAYAH_POSITION:
                this.derayahPositionStream.next(true);
                this.derayahOrderStream.next(true);
                break;
            case DerayahMessageType.DERAYAH_RENEW_QUEUE_ID:
                this.derayahNotFoundQueueStream.next();
                break;
            case DerayahMessageType.HEARTBEAT:
                this.processHeartbeatMessage();
                break;
            default:
                Tc.error('unknown message type: ' + DerayahMessageType[messageType]);
        }
    };
    DerayahStreamer.prototype.monitorMarket = function () {
    };
    DerayahStreamer.prototype.processHeartbeatMessage = function () {
        this.heartbeatReceived();
    };
    DerayahStreamer.prototype.heartbeatReceived = function () {
        this.lastReceivedHeartBeat = Date.now();
    };
    DerayahStreamer.prototype.checkHeartbeatTimeout = function () {
        if ((Date.now() - this.lastReceivedHeartBeat > DerayahStreamer.THRESHOLD)) {
            this.derayahNotificationTimeOutStream.next();
            Tc.warn("heartbeat disconnection detected for derayah notification streamer, request restart");
            TcTracker.trackHeartbeatDisconnection('derayah notification streamer disconnection ');
            this.lastReceivedHeartBeat = Date.now();
        }
    };
    DerayahStreamer.THRESHOLD = 45000;
    return DerayahStreamer;
}(AbstractStreamer));
export { DerayahStreamer };
//# sourceMappingURL=derayah-streamer.js.map