import { __extends } from "tslib";
import { ValueScaleCalibrator } from "./ValueScaleCalibrator";
import { JsUtil } from "../Utils/JsUtil";
import { HtmlUtil } from "../Utils/HtmlUtil";
var AutoValueScaleCalibrator = (function (_super) {
    __extends(AutoValueScaleCalibrator, _super);
    function AutoValueScaleCalibrator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AutoValueScaleCalibrator, "className", {
        get: function () {
            return 'StockChartX.AutoValueScaleCalibrator';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AutoValueScaleCalibrator.prototype, "minValuesOffset", {
        get: function () {
            var majorTicks = this._options.majorTicks;
            return majorTicks != null && majorTicks.minOffset != null
                ? majorTicks.minOffset
                : AutoValueScaleCalibrator.defaults.majorTicks.minOffset;
        },
        set: function (value) {
            if (value != null && JsUtil.isNegativeNumber(value))
                throw new Error('Values offset must be a value greater or equal to 0.');
            var options = this._options;
            (options.majorTicks || (options.majorTicks = {})).minOffset = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AutoValueScaleCalibrator.prototype, "minorTicksCount", {
        get: function () {
            var minorTicks = this._options.minorTicks;
            return minorTicks && minorTicks.count != null
                ? minorTicks.count
                : AutoValueScaleCalibrator.defaults.minorTicks.count;
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
    AutoValueScaleCalibrator.prototype.calibrate = function (valueScale) {
        _super.prototype.calibrate.call(this, valueScale);
        this._calibrateMajorTicks(valueScale);
        this._calibrateMinorTicks(this.minorTicksCount);
    };
    AutoValueScaleCalibrator.prototype._calibrateMajorTicks = function (valueScale) {
        var theme = valueScale.actualTheme, textHeight = HtmlUtil.getFontSize(theme.text), minValuesOffset = this.minValuesOffset, padding = valueScale.padding, panelPadding = valueScale.chartPanel.chartPanelsContainer.panelPadding, y = Math.round(Math.max(padding.top, panelPadding.top) + textHeight / 2), bottom = valueScale.chartPanel.canvas.height() - padding.bottom - textHeight / 2, projection = valueScale.projection;
        while (y < bottom) {
            var value = projection.valueByY(y);
            this.majorTicks.push({
                y: y,
                value: value,
                text: valueScale.formatValue(value)
            });
            y += textHeight + minValuesOffset;
        }
    };
    AutoValueScaleCalibrator.defaults = {
        majorTicks: {
            minOffset: 10
        },
        minorTicks: {
            count: 0
        }
    };
    return AutoValueScaleCalibrator;
}(ValueScaleCalibrator));
export { AutoValueScaleCalibrator };
ValueScaleCalibrator.register(AutoValueScaleCalibrator);
//# sourceMappingURL=AutoValueScaleCalibrator.js.map