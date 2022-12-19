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