import { Tc } from '../../../utils';
var ChartEventsExtender = (function () {
    function ChartEventsExtender(chart) {
        this._suppressEvents = false;
        Tc.assert(chart != null, "chart is not defined");
        this._chart = chart;
    }
    Object.defineProperty(ChartEventsExtender.prototype, "chart", {
        get: function () {
            return this._chart;
        },
        enumerable: false,
        configurable: true
    });
    ChartEventsExtender.prototype.suppressEvents = function (suppress) {
        var oldValue = this._suppressEvents;
        this._suppressEvents = suppress != null ? suppress : true;
        return oldValue;
    };
    ChartEventsExtender.prototype.fire = function (event, newValue, oldValue) {
        var chart = this._chart;
        if (chart && !this._suppressEvents)
            chart.fireTargetValueChanged(this, event, newValue, oldValue);
    };
    return ChartEventsExtender;
}());
export { ChartEventsExtender };
//# sourceMappingURL=ChartEventsExtender.js.map