import { ReplaySubject, Subject } from 'rxjs';
import { DomUtils, StringUtils, Tc, TcTracker } from '../../../utils/index';
var StreamerChannel = (function () {
    function StreamerChannel() {
        this.receivingStream = new Subject();
        this.sendingStream = new ReplaySubject(500);
    }
    StreamerChannel.prototype.buildWebSocketUrl = function (url) {
        url = url.replace(/^https:\/\//, "wss://");
        url = url.replace(/^http:\/\//, "ws://");
        if (url.lastIndexOf("/") === url.length - 1) {
            url = url.substring(0, url.length - 1);
            url = url + "ws/";
        }
        else {
            url = url + "ws/";
        }
        return url;
    };
    StreamerChannel.prototype.subscribeTopic = function (topic) {
        this.sendingStream.next("subscribe=" + topic);
    };
    StreamerChannel.prototype.unSubscribeTopic = function (topic) {
        this.sendingStream.next("unsubscribe=" + topic);
    };
    StreamerChannel.prototype.getMessageStream = function () {
        return this.receivingStream;
    };
    StreamerChannel.prototype.initWebSocket = function (url) {
        var _this = this;
        Tc.info("connect to streamer " + url);
        TcTracker.trackConnectTo(DomUtils.hostname(url));
        var websocketUrl = this.buildWebSocketUrl(url);
        this.websocket = new WebSocket(websocketUrl);
        this.websocket.onopen = function (evt) { return _this.onOpen(evt); };
        this.websocket.onclose = function (evt) { return _this.onClose(evt); };
        this.websocket.onmessage = function (evt) { return _this.onMessage(evt); };
        this.websocket.onerror = function (evt) { return _this.onError(evt); };
    };
    StreamerChannel.prototype.disconnect = function () {
        this.websocket.onclose = function () { };
        this.websocket.close();
    };
    StreamerChannel.prototype.onOpen = function (event) {
        var _this = this;
        console.log("getting onOpen event");
        if (this.websocket.readyState) {
            console.log("send websocket data");
            this.websocket.send("uid=" + StringUtils.guid());
            this.sendingStream.subscribe(function (data) {
                _this.websocket.send(data);
            });
        }
    };
    StreamerChannel.prototype.onClose = function (event) {
        console.log(event);
    };
    StreamerChannel.prototype.onMessage = function (event) {
        this.receivingStream.next(JSON.parse(event.data));
    };
    StreamerChannel.prototype.onError = function (event) {
        console.log(event);
        if (event && event.srcElement && event.srcElement["url"]) {
            Tc.warn("fail to open websocket " + event.srcElement["url"]);
        }
        else {
            Tc.warn("fail to open websocket on firefox");
        }
    };
    return StreamerChannel;
}());
export { StreamerChannel };
//# sourceMappingURL=streamer-channel.js.map