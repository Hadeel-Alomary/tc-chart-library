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