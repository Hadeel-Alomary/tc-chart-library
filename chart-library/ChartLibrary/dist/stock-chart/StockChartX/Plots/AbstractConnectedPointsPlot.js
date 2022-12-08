import { __extends } from "tslib";
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