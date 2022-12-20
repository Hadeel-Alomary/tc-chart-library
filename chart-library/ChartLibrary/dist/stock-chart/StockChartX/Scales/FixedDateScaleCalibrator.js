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
import { DateScaleCalibrator } from "./DateScaleCalibrator";
import { CustomDateTimeFormat } from "../Data/CustomDateTimeFormat";
import { JsUtil } from "../Utils/JsUtil";
import { DummyCanvasContext } from "../Utils/DummyCanvasContext";
import { TimeSpan } from "../Data/TimeFrame";
var FixedDateScaleCalibrator = (function (_super) {
    __extends(FixedDateScaleCalibrator, _super);
    function FixedDateScaleCalibrator(config) {
        var _this = _super.call(this, config) || this;
        _this._formatter = new CustomDateTimeFormat();
        return _this;
    }
    Object.defineProperty(FixedDateScaleCalibrator, "className", {
        get: function () {
            return 'StockChartX.FixedDateScaleCalibrator';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FixedDateScaleCalibrator.prototype, "majorTicksCount", {
        get: function () {
            var majorTicks = this._options.majorTicks;
            return majorTicks && majorTicks.count != null
                ? majorTicks.count
                : FixedDateScaleCalibrator.defaults.majorTicks.count;
        },
        set: function (value) {
            if (value != null && JsUtil.isNegativeNumber(value))
                throw new Error('Ticks count must be a positive number.');
            var options = this._options;
            (options.majorTicks || (options.majorTicks = {})).count = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FixedDateScaleCalibrator.prototype, "minorTicksCount", {
        get: function () {
            var minorTicks = this._options.minorTicks;
            return minorTicks && minorTicks.count != null
                ? minorTicks.count
                : FixedDateScaleCalibrator.defaults.minorTicks.count;
        },
        set: function (value) {
            if (value != null && JsUtil.isNegativeNumber(value))
                throw new Error('Ticks count must be a positive number.');
            var options = this._options;
            (options.minorTicks || (options.minorTicks = {})).count = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FixedDateScaleCalibrator.prototype, "majorTicksFormat", {
        get: function () {
            var majorTicks = this._options.majorTicks;
            return (majorTicks && majorTicks.format) || FixedDateScaleCalibrator.defaults.majorTicks.format;
        },
        set: function (value) {
            var options = this._options;
            (options.majorTicks || (options.majorTicks = {})).format = value;
        },
        enumerable: true,
        configurable: true
    });
    FixedDateScaleCalibrator.prototype.calibrate = function (dateScale) {
        _super.prototype.calibrate.call(this, dateScale);
        this._calibrateMajorTicks(dateScale);
        this._calibrateMinorTicks(this.minorTicksCount);
    };
    FixedDateScaleCalibrator.prototype._calibrateMajorTicks = function (dateScale) {
        var frame = dateScale.projectionFrame, textDrawBounds = dateScale._textDrawBounds(), minTextX = textDrawBounds.left, maxTextX = textDrawBounds.left + textDrawBounds.width, projection = dateScale.projection, padding = dateScale.chart.chartPanelsContainer.panelPadding, startX = frame.left - padding.left, endX = frame.right + padding.right, dummyContext = DummyCanvasContext, ticksCount = this.majorTicksCount, tickWidth = (endX - startX) / (ticksCount - 1), formats = this.majorTicksFormat;
        if (!formats)
            formats = {};
        if (!formats.other)
            formats.other = FixedDateScaleCalibrator._createAutoFormat(dateScale.chart);
        dummyContext.applyTextTheme(dateScale.actualTheme.text);
        for (var i = 0; i < ticksCount; i++) {
            var x = startX + i * tickWidth;
            this._updateFormatterForLabel(i, i === ticksCount - 1, formats);
            var date = projection.dateByX(x), dateString = this._formatter.format(date), textWidth = dummyContext.textWidth(dateString), textAlign = 'center', textX = x;
            if (textX - textWidth / 2 < minTextX) {
                textX = minTextX;
                textAlign = 'left';
            }
            else if (textX + textWidth / 2 > maxTextX) {
                textX = maxTextX;
                textAlign = 'right';
            }
            this.majorTicks.push({
                x: x,
                textX: x,
                textAlign: textAlign,
                date: date,
                text: dateString,
                major: true
            });
        }
    };
    FixedDateScaleCalibrator.prototype._updateFormatterForLabel = function (labelIndex, isLastLabel, formats) {
        var formatString;
        if (isLastLabel)
            formatString = formats.last || formats.other;
        else if (labelIndex === 0)
            formatString = formats.first || formats.other;
        else
            formatString = formats.other;
        this._formatter.formatString = formatString;
    };
    FixedDateScaleCalibrator._createAutoFormat = function (chart) {
        var timeInterval = chart.timeInterval, format;
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_YEAR)
            format = "YYYY";
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_MONTH)
            format = "YYYY MMM";
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_DAY)
            format = "YYYY-MM-DD";
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_MINUTE)
            format = "YYYY-MM-DD HH:mm";
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_SECOND)
            format = "YYYY-MM-DD HH:mm:ss";
        else
            format = "YYYY-MM-DD HH:mm:ss.SSS";
        return format;
    };
    FixedDateScaleCalibrator.defaults = {
        majorTicks: {
            count: 3
        },
        minorTicks: {
            count: 0
        }
    };
    return FixedDateScaleCalibrator;
}(DateScaleCalibrator));
export { FixedDateScaleCalibrator };
DateScaleCalibrator.register(FixedDateScaleCalibrator);
//# sourceMappingURL=FixedDateScaleCalibrator.js.map