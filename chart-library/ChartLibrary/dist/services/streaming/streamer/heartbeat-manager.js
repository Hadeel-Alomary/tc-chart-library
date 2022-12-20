import { Tc, TcTracker } from "../../../utils/index";
var HeartbeatManager = (function () {
    function HeartbeatManager(streamer) {
        var _this = this;
        this.streamer = streamer;
        this.lastReceivedLog = {};
        this.disconnectionCounter = {};
        this.timerId = window.setInterval(function () { return _this.checkHeartbeatTimeout(); }, 1000);
    }
    HeartbeatManager.prototype.monitorMarket = function (market) {
        this.lastReceivedLog[market] = Date.now();
        this.disconnectionCounter[market] = 0;
    };
    HeartbeatManager.prototype.heartbeatReceived = function (market) {
        this.lastReceivedLog[market] = Date.now();
        this.disconnectionCounter[market] = 0;
    };
    HeartbeatManager.prototype.disconnect = function () {
        window.clearInterval(this.timerId);
    };
    HeartbeatManager.prototype.checkHeartbeatTimeout = function () {
        var _this = this;
        var disconnectedMarkets = [];
        Object.keys(this.lastReceivedLog).forEach(function (market) {
            if ((Date.now() - _this.lastReceivedLog[market]) > HeartbeatManager.THRESHOLD) {
                disconnectedMarkets.push(market);
            }
        });
        disconnectedMarkets.every(function (market) {
            _this.disconnectionCounter[market] += 1;
            if (_this.disconnectionCounter[market] == 10) {
                _this.disconnectionCounter[market] = 0;
                _this.disconnect();
                Tc.warn("too much heartbeat disconnection, log out");
                return false;
            }
            Tc.warn("heartbeat disconnection detected for market " + market + ", request restart");
            TcTracker.trackHeartbeatDisconnection(market);
            _this.streamer.onHeartbeatTimeout(market);
            _this.lastReceivedLog[market] = Date.now();
            return true;
        });
    };
    HeartbeatManager.THRESHOLD = 45000;
    return HeartbeatManager;
}());
export { HeartbeatManager };
//# sourceMappingURL=heartbeat-manager.js.map