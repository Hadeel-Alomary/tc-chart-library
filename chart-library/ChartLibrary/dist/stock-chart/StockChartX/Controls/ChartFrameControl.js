import { __extends } from "tslib";
import { FrameControl } from "./FrameControl";
var ChartFrameControl = (function (_super) {
    __extends(ChartFrameControl, _super);
    function ChartFrameControl(config) {
        var _this = _super.call(this) || this;
        if (!config)
            throw new TypeError('Config is not specified.');
        _this._chart = config.chart;
        return _this;
    }
    Object.defineProperty(ChartFrameControl.prototype, "chart", {
        get: function () {
            return this._chart;
        },
        enumerable: false,
        configurable: true
    });
    ChartFrameControl.prototype._subscribeEvents = function () {
    };
    ChartFrameControl.prototype._unsubscribeEvents = function () {
    };
    ChartFrameControl.prototype.destroy = function () {
        this._unsubscribeEvents();
        _super.prototype.destroy.call(this);
    };
    return ChartFrameControl;
}(FrameControl));
export { ChartFrameControl };
//# sourceMappingURL=ChartFrameControl.js.map