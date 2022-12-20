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
import { AbstractStreamer } from './abstract-streamer';
import { Subject } from 'rxjs';
import { MessageType } from '../shared';
import { Tc } from '../../../utils';
var TechnicalIndicatorStreamer = (function (_super) {
    __extends(TechnicalIndicatorStreamer, _super);
    function TechnicalIndicatorStreamer(heartbeatManager, streamerMarket, debugModeService) {
        var _this = _super.call(this, heartbeatManager, streamerMarket.abbreviation) || this;
        _this.streamerMarket = streamerMarket;
        _this.debugModeService = debugModeService;
        _this.technicalIndicatorStreamer = new Subject();
        if (_this.debugModeService.connectToDebugStreamer()) {
            _this.initChannel(_this.debugModeService.getDebugStreamerUrl(), true);
        }
        else {
            _this.initChannel(streamerMarket.technicalIndicatorStreamUrl, true);
        }
        return _this;
    }
    TechnicalIndicatorStreamer.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    TechnicalIndicatorStreamer.prototype.getTechnicalIndicator = function () {
        return this.technicalIndicatorStreamer;
    };
    TechnicalIndicatorStreamer.prototype.subscribeTechnicalIndicatorTopic = function (topic) {
        this.subscribeTopic(topic);
    };
    TechnicalIndicatorStreamer.prototype.unSubscribeTechnicalIndicatorTopic = function (topic) {
        this.unSubscribeTopic(topic);
    };
    TechnicalIndicatorStreamer.prototype.onMessageReceive = function (message) {
        var messageType = this.getMessageType(message['topic']);
        switch (messageType) {
            case MessageType.TECHNICAL_INDICATOR:
                this.processTechnicalIndicatorMessage(message);
                break;
            case MessageType.HEARTBEAT:
                this.processHeartbeatMessage(message);
                break;
            default:
                Tc.error('unknown message type: ' + MessageType[messageType]);
        }
    };
    TechnicalIndicatorStreamer.prototype.processTechnicalIndicatorMessage = function (message) {
        this.technicalIndicatorStreamer.next(message);
    };
    return TechnicalIndicatorStreamer;
}(AbstractStreamer));
export { TechnicalIndicatorStreamer };
//# sourceMappingURL=technical-indicator-streamer.js.map