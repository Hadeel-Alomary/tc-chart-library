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
import { MarketUtils, Tc } from '../../../utils/index';
import { AbstractStreamer } from './abstract-streamer';
var TechnicalReportsStreamer = (function (_super) {
    __extends(TechnicalReportsStreamer, _super);
    function TechnicalReportsStreamer(heartbeatManager) {
        var _this = _super.call(this, heartbeatManager, 'TECHNICAL_REPORTS') || this;
        _this.liquidityStreamer = new Subject();
        return _this;
    }
    TechnicalReportsStreamer.prototype.getHeartBeatTopic = function () {
        return 'HB.HB.GP';
    };
    TechnicalReportsStreamer.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    TechnicalReportsStreamer.prototype.getLiquidityStreamer = function () {
        return this.liquidityStreamer;
    };
    TechnicalReportsStreamer.prototype.subscribeLiquidity = function (intervalString, market) {
        if (market !== 'USA' && market !== 'FRX') {
            this.subscribeTopic("".concat(intervalString, ".liquidity.").concat(market));
        }
    };
    TechnicalReportsStreamer.prototype.onMessageReceive = function (message) {
        var messageType = this.getMessageType(message['topic']);
        switch (messageType) {
            case MessageType.LIQUIDITY:
                this.processLiquidityMessage(message);
                break;
            case MessageType.HEARTBEAT:
                this.processHeartbeatMessage(message);
                break;
            default:
                Tc.error('unknown message type: ' + MessageType[messageType]);
        }
    };
    TechnicalReportsStreamer.prototype.processLiquidityMessage = function (message) {
        var topicParts = MarketUtils.splitTopic(message['topic']);
        var liquidityMessage = {
            topic: message['topic'],
            symbol: "".concat(message['symbol'], ".").concat(topicParts[2]),
            interval: topicParts[0],
            time: message['time'],
            percent: message['percent'],
            inflowAmount: message['inf-amnt'],
            inflowVolume: message['inf-vol'],
            outflowAmount: message['outf-amnt'],
            outflowVolume: message['outf-vol'],
            netAmount: message['net-amnt'],
            netVolume: message['net-vol']
        };
        this.liquidityStreamer.next(liquidityMessage);
    };
    return TechnicalReportsStreamer;
}(AbstractStreamer));
export { TechnicalReportsStreamer };
//# sourceMappingURL=technical-reports-streamer.service.js.map