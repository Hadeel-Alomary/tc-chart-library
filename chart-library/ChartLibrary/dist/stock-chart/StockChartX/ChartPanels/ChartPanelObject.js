import { __extends } from "tslib";
import { ChartEventsExtender } from "../Utils/ChartEventsExtender";
import { JsUtil } from "../Utils/JsUtil";
var ChartPanelObject = (function (_super) {
    __extends(ChartPanelObject, _super);
    function ChartPanelObject(chart, config) {
        var _this = _super.call(this, chart) || this;
        _this._options = {};
        _this.loadState(config);
        return _this;
    }
    Object.defineProperty(ChartPanelObject.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelObject.prototype, "chartPanel", {
        get: function () {
            return this._panel;
        },
        set: function (value) {
            var oldValue = this._panel;
            if (oldValue === value)
                return;
            this._panel = value;
            this._onChartPanelChanged(oldValue);
            if (value && !this._valueScale) {
                var index = this._options.valueScaleIndex;
                if (index)
                    this.valueScale = this.chart.valueScales[index];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelObject.prototype, "context", {
        get: function () {
            return this._panel.context;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelObject.prototype, "valueScale", {
        get: function () {
            return this._valueScale || this.chart.valueScale;
        },
        set: function (value) {
            var oldValue = this._valueScale;
            if (oldValue !== value) {
                this._valueScale = value;
                this._onValueScaleChanged(oldValue);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelObject.prototype, "panelValueScale", {
        get: function () {
            return this._panel.getValueScale(this.valueScale);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelObject.prototype, "projection", {
        get: function () {
            return this._panel && this._panel.getProjection(this.valueScale);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelObject.prototype, "visible", {
        get: function () {
            return this._options.visible;
        },
        set: function (value) {
            var oldValue = this.visible;
            if (oldValue !== value) {
                this._options.visible = value;
                this._onVisibleChanged(oldValue);
            }
        },
        enumerable: false,
        configurable: true
    });
    ChartPanelObject.prototype._setOption = function (key, value, valueChangedEventName) {
        var options = this._options, oldValue = options[key];
        if (oldValue !== value) {
            options[key] = value;
            if (valueChangedEventName)
                this.fire(valueChangedEventName, value, oldValue);
        }
    };
    ChartPanelObject.prototype._onChartPanelChanged = function (oldValue) {
    };
    ChartPanelObject.prototype._onValueScaleChanged = function (oldValue) {
    };
    ChartPanelObject.prototype._onVisibleChanged = function (oldValue) {
    };
    ChartPanelObject.prototype.saveState = function () {
        var state = {
            options: JsUtil.clone(this._options)
        };
        if (this.chartPanel)
            state.panelIndex = this.chartPanel.getIndex();
        if (this.valueScale)
            state.valueScaleIndex = this.valueScale.index;
        return state;
    };
    ChartPanelObject.prototype.loadState = function (state) {
        var suppress = this.suppressEvents();
        state = state || {};
        this._options = (state && state.options) || {};
        this.suppressEvents(suppress);
    };
    ChartPanelObject.prototype.draw = function () {
    };
    return ChartPanelObject;
}(ChartEventsExtender));
export { ChartPanelObject };
//# sourceMappingURL=ChartPanelObject.js.map