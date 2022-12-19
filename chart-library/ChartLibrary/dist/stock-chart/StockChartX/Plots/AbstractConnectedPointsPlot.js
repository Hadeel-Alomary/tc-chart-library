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
import { Plot } from "./Plot";
import { DataSeries } from "../Data/DataSeries";
var AbstractConnectedPointsPlot = (function (_super) {
    __extends(AbstractConnectedPointsPlot, _super);
    function AbstractConnectedPointsPlot(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this.connectedPointsSeries = null;
        if (typeof config.connectedPointsSeries == 'undefined') {
            throw new TypeError('main points Series is required');
        }
        _this.connectedPointsSeries = config.connectedPointsSeries;
        _this.createDefaultDataSeries();
        return _this;
    }
    AbstractConnectedPointsPlot.prototype.createDefaultDataSeries = function () {
        var last = -1;
        var values = this.connectedPointsSeries.values;
        var newValues = [];
        for (var i = 0; i < this.connectedPointsSeries.length; i++) {
            var value = values[i];
            if (value == null || isNaN(value) || value == 0)
                continue;
            if (last !== -1) {
                var slope = (value - values[last]) / (i - last);
                var intercept = value - (slope * i);
                for (var j = last + 1; j < i; j++) {
                    newValues[j] = (slope * j) + intercept;
                }
                newValues[i] = value;
            }
            else {
                newValues[i] = value;
            }
            last = i;
        }
        this.setDataSeries(new DataSeries({
            name: 'Indicator',
            values: newValues
        }));
    };
    AbstractConnectedPointsPlot.prototype.drawSelectionPoints = function () {
    };
    return AbstractConnectedPointsPlot;
}(Plot));
export { AbstractConnectedPointsPlot };
//# sourceMappingURL=AbstractConnectedPointsPlot.js.map