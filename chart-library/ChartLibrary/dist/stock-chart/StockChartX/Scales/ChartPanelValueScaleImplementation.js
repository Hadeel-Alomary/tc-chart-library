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
import { Rect } from '../Graphics/Rect';
import { Control } from '../Controls/Control';
import { ChartEvent } from '../Chart';
import { Projection } from './Projection';
import { NumberFormat } from '../Data/NumberFormat';
import { JsUtil } from '../Utils/JsUtil';
import { ValueScaleCalibrator } from './ValueScaleCalibrator';
import { GestureArray } from '../Gestures/GestureArray';
import { DoubleClickGesture } from '../Gestures/DoubleClickGesture';
import { PanGesture } from '../Gestures/PanGesture';
import { MouseWheelGesture } from '../Gestures/MouseWheelGesture';
import { DummyCanvasContext } from '../Utils/DummyCanvasContext';
import { Geometry } from '../Graphics/Geometry';
import { IntervalValueScaleCalibrator } from './IntervalValueScaleCalibrator';
import { GestureState } from '../Gestures/Gesture';
import { BrowserUtils } from '../../../utils';
import { AxisScaleType } from './axis-scale-type';
import { HtmlUtil } from '../Utils/HtmlUtil';
import { ValueScaleNumberFormat } from '../Data/ValueScaleNumberFormat';
var MIN_VALUE_RANGE = 1E-3;
var CLASS_SCROLL = "scxValueScaleScroll";
var ChartPanelValueScaleImplementation = (function (_super) {
    __extends(ChartPanelValueScaleImplementation, _super);
    function ChartPanelValueScaleImplementation(config) {
        var _this = _super.call(this) || this;
        _this._projectionFrame = new Rect();
        _this.range = {};
        if (!config)
            throw new Error("Config is not specified.");
        _this._panel = config.chartPanel;
        _this._projection = new Projection(_this.chart.dateScale, _this);
        _this.loadState(config);
        _this._updateFormatter();
        _this._initGestures();
        _this.chart.on(ChartEvent.LOCALE_CHANGED + '.scxValueScale', function () {
            _this._updateFormatter();
        }, _this);
        return _this;
    }
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "chartPanel", {
        get: function () {
            return this._panel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "chart", {
        get: function () {
            return this._panel.chart;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "projectionFrame", {
        get: function () {
            return this._projectionFrame;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "leftFrame", {
        get: function () {
            return this._leftFrame;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "rightFrame", {
        get: function () {
            return this._rightFrame;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "formatter", {
        get: function () {
            return this._formatter;
        },
        set: function (value) {
            if (!value || !JsUtil.isFunction(value.format))
                throw new TypeError("Invalid formatter.");
            this._formatter = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "minVisibleValue", {
        get: function () {
            return this._minVisibleValue;
        },
        set: function (value) {
            if (!JsUtil.isFiniteNumberOrNaN(value))
                throw new TypeError("Value must be a number.");
            this._setMinVisibleValue(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "maxVisibleValue", {
        get: function () {
            return this._maxVisibleValue;
        },
        set: function (value) {
            if (!JsUtil.isFiniteNumberOrNaN(value))
                throw new TypeError("Value must be a number.");
            this._setMaxVisibleValue(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "minAllowedValue", {
        get: function () {
            return this._options.minAllowedValue;
        },
        set: function (value) {
            if (!JsUtil.isNumber(value))
                throw new TypeError("Value must be a number.");
            this._options.minAllowedValue = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "maxAllowedValue", {
        get: function () {
            return this._options.maxAllowedValue;
        },
        set: function (value) {
            if (!JsUtil.isNumber(value))
                throw new TypeError("Value must be a number.");
            this._options.maxAllowedValue = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "minAllowedValueRatio", {
        get: function () {
            return this._options.minAllowedValueRatio;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumberOrNaN(value))
                throw new Error("Ratio must be a positive number.");
            this._options.minAllowedValueRatio = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "maxAllowedValueRatio", {
        get: function () {
            return this._options.maxAllowedValueRatio;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumberOrNaN(value))
                throw new Error("Ratio must be a positive number or NaN.");
            this._options.maxAllowedValueRatio = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "minValueRangeRatio", {
        get: function () {
            return this._options.minValueRangeRatio;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumberOrNaN(value) || value > 1)
                throw new Error("Ratio must be in range (0..1]");
            this._options.minValueRangeRatio = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "maxValueRangeRatio", {
        get: function () {
            return this._options.maxValueRangeRatio;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumberOrNaN(value) || value < 1)
                throw new Error("Ratio must be greater or equal to 1.");
            this._options.maxValueRangeRatio = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "majorTickMarkLength", {
        get: function () {
            return this._options.majorTickMarkLength;
        },
        set: function (value) {
            this._options.majorTickMarkLength = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "minorTickMarkLength", {
        get: function () {
            return this._options.minorTickMarkLength;
        },
        set: function (value) {
            this._options.minorTickMarkLength = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "axisScale", {
        get: function () {
            return this._options.axisScaleType;
        },
        set: function (value) {
            this._options.axisScaleType = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "projection", {
        get: function () {
            return this._projection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "padding", {
        get: function () {
            return this._options.padding;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "calibrator", {
        get: function () {
            return this._calibrator;
        },
        set: function (value) {
            this._calibrator = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "actualTheme", {
        get: function () {
            return this.chart.theme.valueScale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelValueScaleImplementation.prototype, "chartValueScale", {
        get: function () {
            var index = this._index();
            return index >= 0 ? this.chart.valueScales[index] : null;
        },
        enumerable: false,
        configurable: true
    });
    ChartPanelValueScaleImplementation.prototype._initGestures = function () {
        var gestures;
        if (BrowserUtils.isMobile()) {
            gestures = new GestureArray([
                new DoubleClickGesture({
                    handler: this._handleDoubleClickGesture
                }),
                new MouseWheelGesture({
                    handler: this._handleMouseWheelGesture
                }),
                new PanGesture({
                    handler: this._handlePanGesture,
                    horizontalMoveEnabled: false
                })
            ], this, this.hitTest);
        }
        else {
            gestures = new GestureArray([
                new DoubleClickGesture({
                    handler: this._handleDoubleClickGesture
                }),
                new PanGesture({
                    handler: this._handlePanGesture,
                    horizontalMoveEnabled: false
                }),
                new MouseWheelGesture({
                    handler: this._handleMouseWheelGesture
                })
            ], this, this.hitTest);
        }
        return gestures;
    };
    ChartPanelValueScaleImplementation.prototype._updateFormatter = function () {
        var locale = this.chart.locale, formatter = this.formatter;
        if (!formatter) {
            this.formatter = new ValueScaleNumberFormat(this.chart.locale);
        }
        else {
            formatter.locale = locale;
        }
    };
    ChartPanelValueScaleImplementation.prototype._setMinVisibleValue = function (value) {
        this._minVisibleValue = value;
    };
    ChartPanelValueScaleImplementation.prototype._setMaxVisibleValue = function (value) {
        this._maxVisibleValue = value;
        if (!isNaN(value) && this.formatter instanceof ValueScaleNumberFormat) {
            this.formatter.setMaxVisibleValue(value);
        }
    };
    ChartPanelValueScaleImplementation.prototype._index = function () {
        var scales = this._panel.valueScales;
        for (var i = 0; i < scales.length; i++) {
            if (scales[i] === this)
                return i;
        }
        return -1;
    };
    ChartPanelValueScaleImplementation.prototype.needsAutoScale = function () {
        return isNaN(this._minVisibleValue) || isNaN(this._maxVisibleValue);
    };
    ChartPanelValueScaleImplementation.prototype.setNeedsAutoScale = function () {
        this.minVisibleValue = NaN;
        this.maxVisibleValue = NaN;
    };
    ChartPanelValueScaleImplementation.prototype.autoScale = function () {
        var dateScale = this.chart.dateScale, startIndex = dateScale.firstVisibleIndex, count = dateScale.lastVisibleIndex - startIndex + 1, min = Infinity, max = -Infinity, chartScale = this.chartValueScale;
        for (var _i = 0, _a = this._panel.plots; _i < _a.length; _i++) {
            var plot = _a[_i];
            if (plot.valueScale !== chartScale)
                continue;
            if (plot.shouldAffectAutoScalingMaxAndMinLimits()) {
                var res = plot.minMaxValues(startIndex, count);
                if (res.min < min)
                    min = res.min;
                if (res.max > max)
                    max = res.max;
            }
        }
        if (!isFinite(min))
            min = -1;
        if (!isFinite(max))
            max = 1;
        if (min === max) {
            min--;
            max++;
        }
        var range = this.range;
        if (range) {
            if (range.min != null && min > range.min)
                min = range.min;
            if (range.max != null && max < range.max)
                max = range.max;
        }
        var height = this._projectionFrame.height, pixelsPerUnit = (max - min) / height;
        max += 30 * pixelsPerUnit;
        var minMaxValues = {
            min: min,
            max: max
        };
        for (var _b = 0, _c = this._panel.plots; _b < _c.length; _b++) {
            var plot = _c[_b];
            if (plot.valueScale !== chartScale)
                continue;
            var newMinMax = plot.updateMinMaxForSomePlotsIfNeeded(min, max);
            if (newMinMax.min < minMaxValues.min) {
                minMaxValues.min = newMinMax.min;
            }
            if (newMinMax.max > minMaxValues.max) {
                minMaxValues.max = newMinMax.max;
            }
        }
        this._setMinVisibleValue(minMaxValues.min);
        this._setMaxVisibleValue(minMaxValues.max);
    };
    ChartPanelValueScaleImplementation.prototype.formatValue = function (value) {
        return this.formatter.format(value);
    };
    ChartPanelValueScaleImplementation.prototype.formatAllDigitsValue = function (value) {
        return this.formatter instanceof ValueScaleNumberFormat ?
            this.formatter.formatAllDigits(value) :
            this.formatValue(value);
    };
    ChartPanelValueScaleImplementation.prototype.preferredWidth = function () {
        if (this.needsAutoScale())
            this.autoScale();
        var options = this._options, theme = this.actualTheme.text, minText = this.formatValue(this._minVisibleValue), maxText = this.formatValue(this._maxVisibleValue), minTextWidth = DummyCanvasContext.measureText(minText, theme).width, maxTextWidth = DummyCanvasContext.measureText(maxText, theme).width, padding = options.padding;
        return Math.max(minTextWidth, maxTextWidth) + padding.left + padding.right;
    };
    ChartPanelValueScaleImplementation.prototype.hitTest = function (point) {
        var leftFrame = this._leftContentFrame, rightFrame = this._rightContentFrame;
        return (leftFrame && Geometry.isPointInsideOrNearRect(point, leftFrame)) ||
            (rightFrame && Geometry.isPointInsideOrNearRect(point, rightFrame));
    };
    ChartPanelValueScaleImplementation.prototype.scrollOnPixels = function (pixels) {
        if (!isFinite(pixels))
            throw new Error("Finite number expected.");
        if (!pixels)
            return false;
        var valueOffset = this._valueOffset(pixels);
        return this.scrollOnValue(valueOffset);
    };
    ChartPanelValueScaleImplementation.prototype.scrollOnValue = function (valueOffset) {
        if (!valueOffset)
            return false;
        var newMinValue = this.minVisibleValue + valueOffset, newMaxValue = this.maxVisibleValue + valueOffset;
        var range = this.range;
        if (range) {
            if (range.min != null && newMinValue > range.min)
                newMinValue = range.min;
            if (range.max != null && newMaxValue < range.max)
                newMaxValue = range.max;
        }
        if (!this._canSetVisibleValueRange(newMinValue, newMaxValue))
            return false;
        this._setMinVisibleValue(newMinValue);
        this._setMaxVisibleValue(newMaxValue);
        return true;
    };
    ChartPanelValueScaleImplementation.prototype.zoomOnPixels = function (pixels) {
        if (!isFinite(pixels))
            throw new Error("Finite number expected.");
        if (!pixels)
            return false;
        var valueOffset = this._valueOffset(pixels);
        return this.zoomOnValue(valueOffset);
    };
    ChartPanelValueScaleImplementation.prototype.zoomOnValue = function (valueOffset) {
        if (!valueOffset)
            return false;
        var oldMinValue = this.minVisibleValue, oldMaxValue = this.maxVisibleValue, newMinValue = oldMinValue - valueOffset, newMaxValue = oldMaxValue + valueOffset;
        var range = this.range;
        if (!this._canSetVisibleValueRange(newMinValue, newMaxValue)) {
            if (this._canSetVisibleValueRange(oldMinValue, newMaxValue)) {
                newMinValue = oldMinValue;
            }
            else if (this._canSetVisibleValueRange(newMinValue, oldMaxValue)) {
                newMaxValue = oldMaxValue;
            }
            else if (!range) {
                return false;
            }
        }
        if (range) {
            if (range.min != null && newMinValue > range.min)
                newMinValue = range.min;
            if (range.max != null && newMaxValue < range.max)
                newMaxValue = range.max;
        }
        if ((newMinValue !== oldMinValue || newMaxValue !== oldMaxValue) && newMaxValue - newMinValue >= MIN_VALUE_RANGE) {
            this._setMinVisibleValue(newMinValue);
            this._setMaxVisibleValue(newMaxValue);
            return true;
        }
        return false;
    };
    ChartPanelValueScaleImplementation.prototype._zoomOrScrollWithUpdate = function (offset, func) {
        var useManualWidth = this.chartValueScale.useManualWidth, prevWidth = useManualWidth || this.preferredWidth(), isUpdated = func.call(this, offset), newWidth = useManualWidth || this.preferredWidth();
        if (isUpdated) {
            if (prevWidth === newWidth)
                this._panel.setNeedsUpdate();
            else
                this.chart.setNeedsUpdate();
        }
        return isUpdated;
    };
    ChartPanelValueScaleImplementation.prototype.saveState = function () {
        return {
            options: JsUtil.clone(this._options),
            formatter: this.formatter.saveState(),
            calibrator: this.calibrator.saveState()
        };
    };
    ChartPanelValueScaleImplementation.prototype.loadState = function (stateOrConfig) {
        stateOrConfig = stateOrConfig || {};
        var state = stateOrConfig;
        var optionsState = state.options || {};
        this._options = {};
        this._minVisibleValue = NaN;
        this._maxVisibleValue = NaN;
        this.minAllowedValue = optionsState.minAllowedValue != null ? optionsState.minAllowedValue : NaN;
        this.maxAllowedValue = optionsState.maxAllowedValue != null ? optionsState.maxAllowedValue : NaN;
        this.minAllowedValueRatio = optionsState.minAllowedValue || 0.8;
        this.maxAllowedValueRatio = optionsState.maxAllowedValueRatio || 0.8;
        this.minValueRangeRatio = optionsState.minValueRangeRatio || 0.1;
        this.maxValueRangeRatio = optionsState.maxValueRangeRatio || 5.0;
        this.majorTickMarkLength = optionsState.majorTickMarkLength || 3;
        this.minorTickMarkLength = optionsState.minorTickMarkLength || 3;
        this.axisScale = optionsState.axisScaleType || AxisScaleType.Linear;
        this._options.padding = optionsState.padding || {
            left: 6,
            top: 3,
            right: 3,
            bottom: 3
        };
        this.range = optionsState.range || {};
        if (state.formatter)
            this.formatter = NumberFormat.deserialize(state.formatter);
        else {
            this.formatter = new ValueScaleNumberFormat(this.chart.locale);
        }
        this.calibrator = state.calibrator
            ? ValueScaleCalibrator.deserialize(state.calibrator)
            : new IntervalValueScaleCalibrator();
    };
    ChartPanelValueScaleImplementation.prototype.layout = function (frame) {
        if (this.needsAutoScale())
            this.autoScale();
        else {
            if (this.maxVisibleValue - this.minVisibleValue < MIN_VALUE_RANGE)
                this.autoScale();
        }
        var prevHeight = this._projectionFrame.height;
        var projectionFrame = this._projectionFrame;
        projectionFrame.left = 0;
        projectionFrame.top = 0;
        projectionFrame.width = this._panel.canvas.width();
        projectionFrame.height = this._panel.canvas.height();
        projectionFrame.applyPadding(this._panel.chartPanelsContainer.panelPadding);
        this._calibrator.calibrate(this);
        this._layoutContentFrames();
        if (prevHeight !== projectionFrame.height) {
            this.autoScale();
        }
    };
    ChartPanelValueScaleImplementation.prototype._layoutContentFrames = function () {
        var panel = this._panel, chartValueScale = this.chartValueScale, drawLeft = chartValueScale.leftPanelVisible, drawRight = chartValueScale.rightPanelVisible, padding = this._options.padding;
        if (drawLeft) {
            var leftPanel = chartValueScale.leftPanel, leftScaleLeftBorder = parseFloat(leftPanel.rootDiv.css('border-left-width')), panelLeftBorder = parseFloat(panel.rootDiv.css('border-left-width')), leftScaleWidth = leftPanel.contentSize.width, startLeftX = Math.round(Math.max(leftScaleLeftBorder - panelLeftBorder, 0));
            var leftFrame = this._leftFrame;
            if (!leftFrame)
                leftFrame = this._leftFrame = new Rect();
            leftFrame.left = startLeftX;
            leftFrame.top = 0;
            leftFrame.width = leftScaleWidth - Math.max(panelLeftBorder - leftScaleLeftBorder);
            leftFrame.height = panel.rootDiv.height();
            var leftContentFrame = this._leftContentFrame;
            if (!leftContentFrame)
                leftContentFrame = this._leftContentFrame = new Rect();
            leftContentFrame.left = leftFrame.left + padding.right;
            leftContentFrame.top = leftFrame.top;
            leftContentFrame.width = leftFrame.width - padding.left - padding.right;
            leftContentFrame.height = leftFrame.height;
        }
        else {
            this._leftFrame = this._leftContentFrame = null;
        }
        if (drawRight) {
            var rightPanel = chartValueScale.rightPanel, rightScaleLeftBorder = parseFloat(rightPanel.rootDiv.css('border-left-width')), rightScaleWidth = rightPanel.contentSize.width, startRightX = rightPanel.frame.left + rightScaleLeftBorder;
            var rightFrame = this._rightFrame;
            if (!rightFrame)
                rightFrame = this._rightFrame = new Rect();
            rightFrame.left = startRightX;
            rightFrame.top = 0;
            rightFrame.width = rightScaleWidth;
            rightFrame.height = panel.rootDiv.height();
            var rightContentFrame = this._rightContentFrame;
            if (!rightContentFrame)
                rightContentFrame = this._rightContentFrame = new Rect();
            rightContentFrame.left = rightFrame.left + padding.left;
            rightContentFrame.top = rightFrame.top;
            rightContentFrame.width = rightFrame.width - padding.left - padding.right;
            rightContentFrame.height = rightFrame.height;
        }
        else {
            this._rightFrame = this._rightContentFrame = null;
        }
    };
    ChartPanelValueScaleImplementation.prototype.clip = function () {
        var leftFrame = this._leftFrame, rightFrame = this._rightFrame;
        if (!leftFrame && !rightFrame)
            return false;
        var context = this._panel.context;
        if (leftFrame) {
            context.rect(leftFrame.left, leftFrame.top, leftFrame.width, leftFrame.height);
        }
        if (rightFrame) {
            context.rect(rightFrame.left, rightFrame.top, rightFrame.width, rightFrame.height);
        }
        context.clip();
        return true;
    };
    ChartPanelValueScaleImplementation.prototype.draw = function () {
        var context = this._panel.context;
        context.save();
        if (this.clip()) {
            var theme = this.actualTheme, leftContentFrame = this._leftContentFrame, rightContentFrame = this._rightContentFrame, leftFrame = this._leftFrame, rightFrame = this._rightFrame, leftFrameRight = leftFrame && (leftFrame.right - 1), majorTickLen = this.majorTickMarkLength, minorTickLen = this.minorTickMarkLength;
            context.scxApplyTextTheme(theme.text);
            context.textBaseline = "middle";
            var tickTextHeight = HtmlUtil.getFontSize(theme.text);
            var yPositionForLastPrintedMajorTick = 0;
            context.beginPath();
            for (var _i = 0, _a = this.calibrator.majorTicks; _i < _a.length; _i++) {
                var tick = _a[_i];
                var textOverlapping = true;
                if (tickTextHeight < Math.abs(tick.y - yPositionForLastPrintedMajorTick)) {
                    textOverlapping = false;
                    yPositionForLastPrintedMajorTick = tick.y;
                }
                if (leftContentFrame) {
                    context.moveTo(leftFrameRight, tick.y);
                    context.lineTo(leftFrameRight - majorTickLen, tick.y);
                    if (!textOverlapping) {
                        context.textAlign = 'right';
                        context.fillText(tick.text, leftContentFrame.right, tick.y);
                    }
                }
                if (rightContentFrame) {
                    context.moveTo(rightFrame.left, tick.y);
                    context.lineTo(rightFrame.left + majorTickLen, tick.y);
                    if (!textOverlapping) {
                        context.textAlign = 'left';
                        context.fillText(tick.text, rightContentFrame.left, tick.y);
                    }
                }
            }
            for (var _b = 0, _c = this.calibrator.minorTicks; _b < _c.length; _b++) {
                var tick = _c[_b];
                if (leftFrame) {
                    context.moveTo(leftFrameRight, tick.y);
                    context.lineTo(leftFrameRight - minorTickLen, tick.y);
                }
                if (rightFrame) {
                    context.moveTo(rightFrame.left, tick.y);
                    context.lineTo(rightFrame.left + minorTickLen, tick.y);
                }
            }
            context.scxApplyStrokeTheme(theme.line);
            context.stroke();
        }
        context.restore();
    };
    ChartPanelValueScaleImplementation.prototype._handleDoubleClickGesture = function () {
        var useManualWidth = this.chartValueScale.useManualWidth, prevWidth = useManualWidth || this.preferredWidth();
        this.chartPanel.chart.setAllowsAutoScaling(true);
        this.autoScale();
        var newWidth = useManualWidth || this.preferredWidth();
        if (prevWidth === newWidth)
            this._panel.setNeedsUpdate();
        else
            this.chart.setNeedsUpdate();
    };
    ChartPanelValueScaleImplementation.prototype._handlePanGesture = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this.chart.rootDiv.addClass(CLASS_SCROLL);
                break;
            case GestureState.FINISHED:
                this.chart.rootDiv.removeClass(CLASS_SCROLL);
                break;
            case GestureState.CONTINUED:
                var offset = gesture.moveOffset.y, func = event.evt.which === 1 ? this.scrollOnPixels : this.zoomOnPixels;
                this._zoomOrScrollWithUpdate(offset, func);
                this.chartPanel.chart.setAllowsAutoScaling(false);
                break;
        }
    };
    ChartPanelValueScaleImplementation.prototype._handleMouseWheelGesture = function (gesture) {
        var frame = this._panel.frame, pixels = 0.05 * frame.height;
        this._zoomOrScrollWithUpdate(gesture.delta * pixels, this.zoomOnPixels);
        this.chartPanel.chart.setAllowsAutoScaling(false);
    };
    ChartPanelValueScaleImplementation.prototype._valueOffset = function (pixels) {
        var frame = this._panel.contentFrame, factor = (this.maxVisibleValue - this.minVisibleValue) / frame.height;
        return factor * pixels;
    };
    ChartPanelValueScaleImplementation.prototype._canSetVisibleValueRange = function (newMinValue, newMaxValue) {
        var newRange = newMaxValue - newMinValue;
        if (newRange < MIN_VALUE_RANGE)
            return false;
        var minAllowedValue = this.minAllowedValue;
        if (!isNaN(minAllowedValue) && newMinValue < minAllowedValue)
            return false;
        var maxAllowedValue = this.maxAllowedValue;
        if (!isNaN(maxAllowedValue) && newMaxValue > maxAllowedValue)
            return false;
        var minMaxRange = this._panel.getAutoScaledMinMaxValues(this.chartValueScale), minRatio = this.minAllowedValueRatio, maxRatio = this.maxAllowedValueRatio, ratio;
        if (!isNaN(minRatio)) {
            ratio = (minMaxRange.min - newMinValue) / newRange;
            if (ratio > minRatio)
                return false;
        }
        if (!isNaN(maxRatio)) {
            ratio = (newMaxValue - minMaxRange.max) / newRange;
            if (ratio > maxRatio)
                return false;
        }
        var valueRangeRatio = this.minValueRangeRatio;
        ratio = (minMaxRange.max - minMaxRange.min) / newRange;
        if (!isNaN(valueRangeRatio) && ratio < valueRangeRatio)
            return false;
        valueRangeRatio = this.maxValueRangeRatio;
        if (!isNaN(valueRangeRatio) && ratio > valueRangeRatio)
            return false;
        return true;
    };
    return ChartPanelValueScaleImplementation;
}(Control));
export { ChartPanelValueScaleImplementation };
//# sourceMappingURL=ChartPanelValueScaleImplementation.js.map