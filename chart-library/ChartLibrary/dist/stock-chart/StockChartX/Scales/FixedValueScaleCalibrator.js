import { __extends } from "tslib";
import { ValueScaleCalibrator } from "./ValueScaleCalibrator";
import { JsUtil } from "../Utils/JsUtil";
var FixedValueScaleCalibrator = (function (_super) {
    __extends(FixedValueScaleCalibrator, _super);
    function FixedValueScaleCalibrator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FixedValueScaleCalibrator, "className", {
        get: function () {
            return 'StockChartX.FixedValueScaleCalibrator';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FixedValueScaleCalibrator.prototype, "majorTicksCount", {
        get: function () {
            var majorTicks = this._options.majorTicks;
            return majorTicks && majorTicks.count != null
                ? majorTicks.count
                : FixedValueScaleCalibrator.defaults.majorTicks.count;
        },
        set: function (value) {
            if (value != null && JsUtil.isNegativeNumber(value))
                throw new Error('Tick count must be greater or equal to 0.');
            var options = this._options;
            (options.majorTicks || (options.majorTicks = {})).count = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FixedValueScaleCalibrator.prototype, "minorTicksCount", {
        get: function () {
            var minorTicks = this._options.minorTicks;
            return minorTicks && minorTicks.count != null
                ? minorTicks.count
                : FixedValueScaleCalibrator.defaults.minorTicks.count;
        },
        set: function (value) {
            if (value != null && JsUtil.isNegativeNumber(value))
                throw new Error('Tick count must be greater or equal to 0.');
            var options = this._options;
            (options.minorTicks || (options.minorTicks = {})).count = value;
        },
        enumerable: false,
        configurable: true
    });
    FixedValueScaleCalibrator.prototype.calibrate = function (valueScale) {
        _super.prototype.calibrate.call(this, valueScale);
        this._calibrateMajorTicks(valueScale);
        this._calibrateMinorTicks(this.minorTicksCount);
    };
    FixedValueScaleCalibrator.prototype._calibrateMajorTicks = function (valueScale) {
        var padding = valueScale.padding, panelPadding = valueScale.chartPanel.chartPanelsContainer.panelPadding, topOffset = Math.max(padding.top, panelPadding.top), height = valueScale.chartPanel.canvas.height() - Math.max(padding.bottom, panelPadding.bottom) - topOffset, projection = valueScale.projection, ticksCount = this.majorTicksCount, tickHeight = height / (ticksCount - 1);
        for (var i = 0; i < ticksCount; i++) {
            var y = Math.round(topOffset + i * tickHeight), value = projection.valueByY(y);
            this.majorTicks.push({
                y: y,
                value: value,
                text: valueScale.formatValue(value)
            });
        }
    };
    FixedValueScaleCalibrator.defaults = {
        majorTicks: {
            count: 3
        },
        minorTicks: {
            count: 0
        }
    };
    return FixedValueScaleCalibrator;
}(ValueScaleCalibrator));
export { FixedValueScaleCalibrator };
ValueScaleCalibrator.register(FixedValueScaleCalibrator);
//# sourceMappingURL=FixedValueScaleCalibrator.js.map