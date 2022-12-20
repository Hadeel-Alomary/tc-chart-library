var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ValueScaleCalibrator } from "./ValueScaleCalibrator";
import { JsUtil } from "../Utils/JsUtil";
import { HtmlUtil } from "../Utils/HtmlUtil";
var IntervalValueScaleCalibrator = (function (_super) {
    __extends(IntervalValueScaleCalibrator, _super);
    function IntervalValueScaleCalibrator(config) {
        return _super.call(this, config) || this;
    }
    Object.defineProperty(IntervalValueScaleCalibrator, "className", {
        get: function () {
            return 'StockChartX.IntervalValueScaleCalibrator';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IntervalValueScaleCalibrator.prototype, "interval", {
        get: function () {
            var majorTicks = this._options.majorTicks;
            return majorTicks != null && majorTicks.interval != null
                ? majorTicks.interval
                : IntervalValueScaleCalibrator.defaults.majorTicks.interval;
        },
        set: function (value) {
            if (value != null && !JsUtil.isPositiveNumber(value))
                throw new Error('Interval must be a value greater or equal to 0.');
            var options = this._options;
            (options.majorTicks || (options.majorTicks = {})).interval = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IntervalValueScaleCalibrator.prototype, "minValuesOffset", {
        get: function () {
            var majorTicks = this._options.majorTicks;
            return majorTicks != null && majorTicks.minOffset != null
                ? majorTicks.minOffset
                : IntervalValueScaleCalibrator.defaults.majorTicks.minOffset;
        },
        set: function (value) {
            if (value != null && JsUtil.isNegativeNumber(value))
                throw new Error('Values offset must be a value greater or equal to 0.');
            var options = this._options;
            (options.majorTicks || (options.majorTicks = {})).minOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IntervalValueScaleCalibrator.prototype, "minorTicksCount", {
        get: function () {
            var minorTicks = this._options.minorTicks;
            return minorTicks && minorTicks.count != null
                ? minorTicks.count
                : IntervalValueScaleCalibrator.defaults.minorTicks.count;
        },
        set: function (value) {
            if (value != null && JsUtil.isNegativeNumber(value))
                throw new Error('Tick count must be greater or equal to 0.');
            var options = this._options;
            (options.minorTicks || (options.minorTicks = {})).count = value;
        },
        enumerable: true,
        configurable: true
    });
    IntervalValueScaleCalibrator.prototype.calibrate = function (valueScale) {
        _super.prototype.calibrate.call(this, valueScale);
        this._calibrateMajorTicks(valueScale);
        this._calibrateMinorTicks(this.minorTicksCount);
    };
    IntervalValueScaleCalibrator.prototype._getValueStep = function (minValue, maxValue, frameHeight, textHeight) {
        var valueSpan = maxValue - minValue;
        var step = Math.pow(10, Math.floor(Math.log10(valueSpan)) + 1);
        var divStep = [2, 2.5, 2];
        for (var k = 0; ((valueSpan / step) * textHeight * 2) < frameHeight; k++) {
            step /= divStep[k % divStep.length];
        }
        return step;
    };
    IntervalValueScaleCalibrator.prototype._calibrateMajorTicks = function (valueScale) {
        var interval = this.interval;
        if ((valueScale.maxVisibleValue - valueScale.minVisibleValue) <= interval)
            return;
        var theme = valueScale.actualTheme, textHeight = HtmlUtil.getFontSize(theme.text), minValuesOffset = this.minValuesOffset, projection = valueScale.projection, minValue = valueScale.minVisibleValue, maxValue = valueScale.maxVisibleValue;
        var step = this._getValueStep(minValue, maxValue, valueScale.projectionFrame.height, textHeight + minValuesOffset);
        var minLabelValue = Math.floor(minValue / step) * step - step;
        var maxLabelValue = Math.ceil(maxValue / step) * step;
        var ticksCount = Math.trunc((maxLabelValue - minLabelValue) / step);
        for (var i = 1; i <= ticksCount; i++) {
            var value = minLabelValue + step * i;
            var y = projection.yByValue(value);
            this.majorTicks.push({
                y: y,
                value: value,
                text: valueScale.formatValue(value)
            });
        }
    };
    IntervalValueScaleCalibrator.defaults = {
        majorTicks: {
            interval: 0.00001,
            minOffset: 10
        },
        minorTicks: {
            count: 0
        }
    };
    return IntervalValueScaleCalibrator;
}(ValueScaleCalibrator));
export { IntervalValueScaleCalibrator };
ValueScaleCalibrator.register(IntervalValueScaleCalibrator);
//# sourceMappingURL=IntervalValueScaleCalibrator.js.map