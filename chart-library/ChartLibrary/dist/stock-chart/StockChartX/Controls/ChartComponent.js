import { __extends } from "tslib";
import { Component } from "./Component";
var ChartComponent = (function (_super) {
    __extends(ChartComponent, _super);
    function ChartComponent(config) {
        var _this = _super.call(this) || this;
        _this._chart = config.chart;
        _this._subscribeEvents();
        return _this;
    }
    Object.defineProperty(ChartComponent.prototype, "chart", {
        get: function () {
            return this._chart;
        },
        enumerable: false,
        configurable: true
    });
    ChartComponent.prototype._subscribeEvents = function () {
    };
    ChartComponent.prototype._unsubscribeEvents = function () {
    };
    ChartComponent.prototype.destroy = function () {
        this._unsubscribeEvents();
    };
    return ChartComponent;
}(Component));
export { ChartComponent };
//# sourceMappingURL=ChartComponent.js.map