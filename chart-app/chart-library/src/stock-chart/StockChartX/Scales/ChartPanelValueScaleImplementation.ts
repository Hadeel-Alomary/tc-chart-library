import {ChartPanel} from '../ChartPanels/ChartPanel';
import {IPadding, Rect} from '../Graphics/Rect';
import {Control} from '../Controls/Control';
import {IStateProvider} from '../Data/IStateProvider';
import {Chart, ChartEvent} from '../Chart';
import {Projection} from './Projection';
import {IMinMaxValues} from '../Data/DataSeries';
import {INumberFormat, INumberFormatState, NumberFormat} from '../Data/NumberFormat';
import {JsUtil} from '../Utils/JsUtil';
import {IValueScaleCalibrator, IValueScaleCalibratorState, ValueScaleCalibrator} from './ValueScaleCalibrator';
import {ValueScale} from './ValueScale';
import {GestureArray} from '../Gestures/GestureArray';
import {DoubleClickGesture} from '../Gestures/DoubleClickGesture';
import {PanGesture} from '../Gestures/PanGesture';
import {MouseWheelGesture} from '../Gestures/MouseWheelGesture';
import {IntlNumberFormat} from '../Data/IntlNumberFormat';
import {DummyCanvasContext} from '../Utils/DummyCanvasContext';
import {IPoint} from '../Graphics/ChartPoint';
import {Geometry} from '../Graphics/Geometry';
import {IntervalValueScaleCalibrator} from './IntervalValueScaleCalibrator';
import {GestureState, WindowEvent} from '../Gestures/Gesture';
import {ChartPanelValueScale, IChartPanelValueScaleConfig, IChartPanelValueScaleState} from './ChartPanelValueScale';
import {BrowserUtils} from '../../../utils';
import {AxisScaleType} from './axis-scale-type';
import {HtmlUtil} from '../Utils/HtmlUtil';
import {ValueScaleNumberFormat} from '../Data/ValueScaleNumberFormat';


// Abu5, for forex with prices range below 0.1, zooming y-axis is not working
// I changed this value from 1E-1 to 1E-3
const MIN_VALUE_RANGE = 1E-3;
const CLASS_SCROLL = "scxValueScaleScroll";

/**
 * Represents value scale on the chart panel.
 * @param {Object} config The configuration object.
 * @param {ChartPanel} config.chartPanel The parent chart panel.
 * @constructor ChartPanelValueScale
 */
export class ChartPanelValueScaleImplementation extends Control implements IStateProvider<IChartPanelValueScaleState>, ChartPanelValueScale {
    private _panel: ChartPanel;

    /**
     * The parent chart panel.
     * @name chartPanel
     * @type {ChartPanel}
     * @readonly
     * @memberOf ChartPanelValueScale#
     */
    get chartPanel(): ChartPanel {
        return this._panel;
    }

    /**
     * The parent chart.
     * @name chart
     * @type {Chart}
     * @readonly
     * @memberOf ChartPanelValueScale#
     */
    get chart(): Chart {
        return this._panel.chart;
    }

    /**
     * The projection frame rectangle.
     * @name projectionFrame
     * @type {Rect}
     * @memberOf ChartPanelValueScale#
     */
    private _projectionFrame: Rect = new Rect();
    get projectionFrame(): Rect {
        return this._projectionFrame;
    }

    /**
     * The value scale options.
     * @type {Object}
     * @memberOf ChartPanelValueScale#
     * @private
     */
    private _options: IChartPanelValueScaleConfig;

    /**
     * The projection to convert x coordinate to value and vise versa.
     * @type {Projection}
     * @memberOf ChartPanelValueScale#
     * @private
     */
    private _projection: Projection;

    private _leftFrame: Rect;
    get leftFrame(): Rect {
        return this._leftFrame;
    }

    private _rightFrame: Rect;
    get rightFrame(): Rect {
        return this._rightFrame;
    }

    private _leftContentFrame: Rect;
    private _rightContentFrame: Rect;
    private range = <IMinMaxValues<number>> {};

    private _formatter: INumberFormat;
    /**
     * The value formatter that is used to convert values to text.
     * @name formatter
     * @type {IntlPolyfill.NumberFormat | NumberFormat}
     * @memberOf ChartPanelValueScale#
     */
    get formatter(): INumberFormat {
        return this._formatter;
    }

    set formatter(value: INumberFormat) {
        if (!value || !JsUtil.isFunction(value.format))
            throw new TypeError("Invalid formatter.");

        this._formatter = value;
    }

    /**
     * Gets/Sets minimum visible value.
     * @name minVisibleValue
     * @type {Number}
     * @memberOf ChartPanelValueScale#
     * @see [maxVisibleValue]{@linkcode ChartPanelValueScale#maxVisibleValue} to get/set max visible value.
     * @throws TypeError if value is not a finite number or NaN.
     */
    private _minVisibleValue:number;
    get minVisibleValue(): number {
        return this._minVisibleValue;
    }

    set minVisibleValue(value: number) {
        if (!JsUtil.isFiniteNumberOrNaN(value))
            throw new TypeError("Value must be a number.");

        this._setMinVisibleValue(value);
    }

    /**
     * Gets/Sets maximum visible value.
     * @name maxVisibleValue
     * @type {Number}
     * @memberOf ChartPanelValueScale#
     * @see [minVisibleValue]{@linkcode ChartPanelValueScale#minVisibleValue} to get/set min visible value.
     * @throws TypeError if value is not a finite number or NaN.
     */
    private _maxVisibleValue:number;
    get maxVisibleValue(): number {
        return this._maxVisibleValue;
    }

    set maxVisibleValue(value: number) {
        if (!JsUtil.isFiniteNumberOrNaN(value))
            throw new TypeError("Value must be a number.");

        this._setMaxVisibleValue(value);
    }

    /**
     * Gets/Sets the minimum allowed value on the scale.
     * @name minAllowedValue
     * @type {Number}
     * @memberOf ChartPanelValueScale#
     * @see [maxAllowedValue]{@linkcode ChartPanelValueScale#maxAllowedValue} to get/set max allowed value.
     * @throws TypeError if value is not a number.
     */
    get minAllowedValue(): number {
        return this._options.minAllowedValue;
    }

    set minAllowedValue(value: number) {
        if (!JsUtil.isNumber(value))
            throw new TypeError("Value must be a number.");

        this._options.minAllowedValue = value;
    }

    /**
     * Gets/Sets the maximum allowed value on the scale.
     * @name maxAllowedValue
     * @type {Number}
     * @memberOf ChartPanelValueScale#
     * @see [minAllowedValue]{@linkcode ChartPanelValueScale#minAllowedValue} to get/set min allowed value.
     * @throws TypeError if value is not a number.
     */
    get maxAllowedValue(): number {
        return this._options.maxAllowedValue;
    }

    set maxAllowedValue(value: number) {
        if (!JsUtil.isNumber(value))
            throw new TypeError("Value must be a number.");

        this._options.maxAllowedValue = value;
    }

    get minAllowedValueRatio(): number {
        return this._options.minAllowedValueRatio;
    }

    set minAllowedValueRatio(value: number) {
        if (!JsUtil.isPositiveNumberOrNaN(value))
            throw new Error("Ratio must be a positive number.");

        this._options.minAllowedValueRatio = value;
    }

    get maxAllowedValueRatio(): number {
        return this._options.maxAllowedValueRatio;
    }

    set maxAllowedValueRatio(value: number) {
        if (!JsUtil.isPositiveNumberOrNaN(value))
            throw new Error("Ratio must be a positive number or NaN.");

        this._options.maxAllowedValueRatio = value;
    }

    get minValueRangeRatio(): number {
        return this._options.minValueRangeRatio;
    }

    set minValueRangeRatio(value: number) {
        if (!JsUtil.isPositiveNumberOrNaN(value) || value > 1)
            throw new Error("Ratio must be in range (0..1]");

        this._options.minValueRangeRatio = value;
    }

    get maxValueRangeRatio(): number {
        return this._options.maxValueRangeRatio;
    }

    set maxValueRangeRatio(value: number) {
        if (!JsUtil.isPositiveNumberOrNaN(value) || value < 1)
            throw new Error("Ratio must be greater or equal to 1.");

        this._options.maxValueRangeRatio = value;
    }

    get majorTickMarkLength(): number {
        return this._options.majorTickMarkLength;
    }

    set majorTickMarkLength(value: number) {
        this._options.majorTickMarkLength = value;
    }

    get minorTickMarkLength(): number {
        return this._options.minorTickMarkLength;
    }

    set minorTickMarkLength(value: number) {
        this._options.minorTickMarkLength = value;
    }

    get axisScale(): AxisScaleType {
        return this._options.axisScaleType;
    }

    set axisScale(value: AxisScaleType) {
        this._options.axisScaleType = value;
    }

    /**
     * Gets projection object to convert Y coordinate into value and vise versa.
     * @name projection
     * @type {Projection}
     * @readonly
     * @memberOf ChartPanelValueScale#
     */
    get projection(): Projection {
        return this._projection;
    }

    get padding(): IPadding {
        return this._options.padding;
    }

    private _calibrator: IValueScaleCalibrator;
    get calibrator(): IValueScaleCalibrator {
        return this._calibrator;
    }

    set calibrator(value: IValueScaleCalibrator) {
        this._calibrator = value;
    }

    /**
     * Returns actual theme.
     * @name actualTheme
     * @type {Object}
     * @readonly
     * @memberOf ChartPanelValueScale#
     */
    get actualTheme() {
        return this.chart.theme.valueScale;
    }

    get chartValueScale(): ValueScale {
        let index = this._index();

        return index >= 0 ? this.chart.valueScales[index] : null;
    }

    constructor(config: IChartPanelValueScaleConfig) {
        super();

        if (!config)
            throw new Error("Config is not specified.");

        this._panel = config.chartPanel;

        this._projection = new Projection(this.chart.dateScale, this);

        this.loadState(config);

        this._updateFormatter();
        this._initGestures();

        this.chart.on(ChartEvent.LOCALE_CHANGED + '.scxValueScale', () => {
            this._updateFormatter();
        }, this);
    }

    protected _initGestures(): GestureArray {

        let gestures;

        if(BrowserUtils.isMobile()) {
            // MA for mobile, handle MouseWheel before Pan gestures (to reduce interference between both).
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
        } else {
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
    }

    private _updateFormatter() {
        let locale = this.chart.locale,
            formatter = this.formatter;

        if (!formatter) {
            this.formatter = new ValueScaleNumberFormat(this.chart.locale);
        } else {
            formatter.locale = locale;
        }
    }

    private _setMinVisibleValue(value: number) {
        this._minVisibleValue = value;
    }

    private _setMaxVisibleValue(value: number) {
        this._maxVisibleValue = value;
        // MA instanceof used for backward compatibility before using ValueScaleNumberFormat
        if(!isNaN(value) && this.formatter instanceof ValueScaleNumberFormat) {
            (this.formatter as ValueScaleNumberFormat).setMaxVisibleValue(value);
        }
    }

    private _index(): number {
        let scales = this._panel.valueScales;

        for (let i = 0; i < scales.length; i++) {
            if (scales[i] === this)
                return i;
        }

        return -1;
    }

    /**
     * Determines whether auto-scaling needs to be performed.
     * @method needsAutoScale
     * @returns {boolean}
     * @memberOf ChartPanelValueScale#
     */
    needsAutoScale() {
        return isNaN(this._minVisibleValue) || isNaN(this._maxVisibleValue);
    }

    /**
     * Marks that auto-scaling needs to be performed on next layout.
     * @method setNeedsAutoScale
     * @memberOf ChartPanelValueScale#
     */
    setNeedsAutoScale() {
        this.minVisibleValue = NaN;
        this.maxVisibleValue = NaN;
    }

    /**
     * Auto-scales value scale.
     * @name autoScale
     * @memberOf ChartPanelValueScale#
     */
    autoScale() {
        let dateScale = this.chart.dateScale,
            startIndex = dateScale.firstVisibleIndex,
            count = dateScale.lastVisibleIndex - startIndex + 1,
            min = Infinity,
            max = -Infinity,
            chartScale = this.chartValueScale;

        for (let plot of this._panel.plots) {
            if (plot.valueScale !== chartScale)
                continue;

            if(plot.shouldAffectAutoScalingMaxAndMinLimits()) {
                let res = plot.minMaxValues(startIndex, count);
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

        let range = this.range;
        if (range) {
            if (range.min != null && min > range.min)
                min = range.min;
            if (range.max != null && max < range.max)
                max = range.max;
        }

        //NK add more space to the top of chart
        let height = this._projectionFrame.height,
            pixelsPerUnit = (max - min) / height;

        max += 30 * pixelsPerUnit; //NK Add extra 30 pixels to the top of the chart

        let minMaxValues = {
            min: min,
            max: max
        };

        //NK update min max values when there is special plot type
        for (let plot of this._panel.plots) {
            if (plot.valueScale !== chartScale)
                continue;

            let newMinMax = plot.updateMinMaxForSomePlotsIfNeeded(min, max);

            if (newMinMax.min < minMaxValues.min) {
                minMaxValues.min = newMinMax.min;
            }

            if (newMinMax.max > minMaxValues.max) {
                minMaxValues.max = newMinMax.max;
            }
        }
        this._setMinVisibleValue(minMaxValues.min);
        this._setMaxVisibleValue(minMaxValues.max);
    }

    /**
     * Returns string representation of a given value.
     * @method formatValue
     * @param {number} value The value
     * @returns {string}
     * @memberOf ChartPanelValueScale#
     */
    formatValue(value: number): string {
        return this.formatter.format(value);
    }

    formatAllDigitsValue(value: number): string {
        // MA instanceof is used for backward compatibility before using ValueScaleNumberFormat
        return this.formatter instanceof ValueScaleNumberFormat ?
            (this.formatter as ValueScaleNumberFormat).formatAllDigits(value):
            this.formatValue(value);
    }

    /**
     * Returns preferred with of the scale.
     * @method preferredWidth
     * @returns {number}
     * @memberOf ChartPanelValueScale#
     */
    preferredWidth(): number {
        if (this.needsAutoScale())
            this.autoScale();

        let options = this._options,
            theme = this.actualTheme.text,
            minText = this.formatValue(this._minVisibleValue),
            maxText = this.formatValue(this._maxVisibleValue),
            minTextWidth = DummyCanvasContext.measureText(minText, theme).width,
            maxTextWidth = DummyCanvasContext.measureText(maxText, theme).width,
            padding = options.padding;

        return Math.max(minTextWidth, maxTextWidth) + padding.left + padding.right;
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint) {
        let leftFrame = this._leftContentFrame,
            rightFrame = this._rightContentFrame;

        return (leftFrame && Geometry.isPointInsideOrNearRect(point, leftFrame)) ||
            (rightFrame && Geometry.isPointInsideOrNearRect(point, rightFrame));
    }

    /**
     * Scrolls scale on a given number of pixels.
     * @method scrollOnPixels
     * @param {Number} pixels The number of pixels to scroll.
     * @returns {Boolean} True if scroll was performed, false otherwise.
     * @memberOf ChartPanelValueScale#
     */
    scrollOnPixels(pixels: number) {
        if (!isFinite(pixels))
            throw new Error("Finite number expected.");
        if (!pixels)
            return false;

        let valueOffset = this._valueOffset(pixels);

        return this.scrollOnValue(valueOffset);
    }

    /**
     * Scrolls scale on a given value offset.
     * @method scrollOnValue
     * @param {Number} valueOffset The value offset to scroll.
     * @returns {boolean} True if scroll was performed, false otherwise.
     * @memberOf ChartPanelValueScale#
     */
    scrollOnValue(valueOffset: number) {
        if (!valueOffset)
            return false;

        let newMinValue = this.minVisibleValue + valueOffset,
            newMaxValue = this.maxVisibleValue + valueOffset;

        let range = this.range;
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
    }

    /**
     * Zooms scale on a given number of pixels.
     * @method zoomOnPixels
     * @param {Number} pixels The number of pixels to zoom.
     * @returns {Boolean} True if zoom was performed, false otherwise.
     * @memberOf ChartPanelValueScale#
     */
    zoomOnPixels(pixels: number) {
        if (!isFinite(pixels))
            throw new Error("Finite number expected.");
        if (!pixels)
            return false;

        let valueOffset = this._valueOffset(pixels);

        return this.zoomOnValue(valueOffset);
    }

    /**
     * Zooms scale on a given value offset.
     * @method zoomOnValue
     * @param {Number} valueOffset The value offset to zoom.
     * @returns {boolean} True if zoom was performed, false otherwise.
     * @memberOf ChartPanelValueScale#
     */
    zoomOnValue(valueOffset: number) {
        if (!valueOffset)
            return false;

        let oldMinValue = this.minVisibleValue,
            oldMaxValue = this.maxVisibleValue,
            newMinValue = oldMinValue - valueOffset,
            newMaxValue = oldMaxValue + valueOffset;

        let range = this.range;
        if (!this._canSetVisibleValueRange(newMinValue, newMaxValue)) {
            if (this._canSetVisibleValueRange(oldMinValue, newMaxValue)) {
                newMinValue = oldMinValue;
            } else if (this._canSetVisibleValueRange(newMinValue, oldMaxValue)) {
                newMaxValue = oldMaxValue;
            } else if (!range) {
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
    }

    public _zoomOrScrollWithUpdate(offset: number, func: (value: number) => void) {
        let useManualWidth = this.chartValueScale.useManualWidth,
            prevWidth = useManualWidth || this.preferredWidth(),
            isUpdated = func.call(this, offset),
            newWidth = useManualWidth || this.preferredWidth();

        if (isUpdated) {
            if (prevWidth === newWidth)
                this._panel.setNeedsUpdate();
            else
                this.chart.setNeedsUpdate();
        }

        return isUpdated;
    }

    /**
     * Save state.
     * @method saveState
     * @returns {Object}
     * @see [loadState]{@linkcode ChartPanelValueScale#loadState} to load state.
     * @memberOf ChartPanelValueScale#
     */
    saveState(): IChartPanelValueScaleState {
        return {
            options: JsUtil.clone(this._options),
            formatter: this.formatter.saveState() as INumberFormatState,
            calibrator: this.calibrator.saveState() as IValueScaleCalibratorState
        };
    }

    /**
     * Loads state.
     * @method loadState
     * @param {object} state The state.
     * @memberOf ChartPanelValueScale#
     * @see [saveState]{@linkcode ChartPanelValueScale#saveState} to save state.
     */
    loadState(stateOrConfig: IChartPanelValueScaleState | IChartPanelValueScaleConfig) {
        stateOrConfig = stateOrConfig || <IChartPanelValueScaleState>{};
        let state = stateOrConfig as IChartPanelValueScaleState;
        let optionsState = state.options || <IChartPanelValueScaleConfig>{};

        this._options = <IChartPanelValueScaleConfig>{};
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
    }

    /**
     * @inheritdoc
     */
    layout(frame: Rect) {
        if (this.needsAutoScale())
            this.autoScale();
        else {
            if (this.maxVisibleValue - this.minVisibleValue < MIN_VALUE_RANGE)
                this.autoScale();
        }

        let prevHeight = this._projectionFrame.height;
        let projectionFrame = this._projectionFrame;
        projectionFrame.left = 0;
        projectionFrame.top = 0;
        projectionFrame.width = this._panel.canvas.width();
        projectionFrame.height = this._panel.canvas.height();
        projectionFrame.applyPadding(this._panel.chartPanelsContainer.panelPadding);

        this._calibrator.calibrate(this);
        this._layoutContentFrames();

        // MA when adding extra space at the top of the chart (done above), we need to call again autoScale
        // on changing the height of the layout for the extra space to be updated.
        if (prevHeight !== projectionFrame.height) {
            this.autoScale();
        }
    }

    private _layoutContentFrames() {
        let panel = this._panel,
            chartValueScale = this.chartValueScale,
            drawLeft = chartValueScale.leftPanelVisible,
            drawRight = chartValueScale.rightPanelVisible,
            padding = this._options.padding;

        if (drawLeft) {
            let leftPanel = chartValueScale.leftPanel,
                leftScaleLeftBorder = parseFloat(leftPanel.rootDiv.css('border-left-width')),
                panelLeftBorder = parseFloat(panel.rootDiv.css('border-left-width')),
                leftScaleWidth = leftPanel.contentSize.width,
                startLeftX = Math.round(Math.max(leftScaleLeftBorder - panelLeftBorder, 0));

            let leftFrame = this._leftFrame;
            if (!leftFrame)
                leftFrame = this._leftFrame = new Rect();
            leftFrame.left = startLeftX;
            leftFrame.top = 0;
            leftFrame.width = leftScaleWidth - Math.max(panelLeftBorder - leftScaleLeftBorder);
            leftFrame.height = panel.rootDiv.height();

            let leftContentFrame = this._leftContentFrame;
            if (!leftContentFrame)
                leftContentFrame = this._leftContentFrame = new Rect();
            leftContentFrame.left = leftFrame.left + padding.right;
            leftContentFrame.top = leftFrame.top;
            leftContentFrame.width = leftFrame.width - padding.left - padding.right;
            leftContentFrame.height = leftFrame.height;
        } else {
            this._leftFrame = this._leftContentFrame = null;
        }

        if (drawRight) {
            let rightPanel = chartValueScale.rightPanel,
                rightScaleLeftBorder = parseFloat(rightPanel.rootDiv.css('border-left-width')),
                rightScaleWidth = rightPanel.contentSize.width,
                startRightX = rightPanel.frame.left + rightScaleLeftBorder;

            let rightFrame = this._rightFrame;
            if (!rightFrame)
                rightFrame = this._rightFrame = new Rect();
            rightFrame.left = startRightX;
            rightFrame.top = 0;
            rightFrame.width = rightScaleWidth;
            rightFrame.height = panel.rootDiv.height();

            let rightContentFrame = this._rightContentFrame;
            if (!rightContentFrame)
                rightContentFrame = this._rightContentFrame = new Rect();
            rightContentFrame.left = rightFrame.left + padding.left;
            rightContentFrame.top = rightFrame.top;
            rightContentFrame.width = rightFrame.width - padding.left - padding.right;
            rightContentFrame.height = rightFrame.height;
        } else {
            this._rightFrame = this._rightContentFrame = null;
        }
    }

    clip() {
        let leftFrame = this._leftFrame,
            rightFrame = this._rightFrame;

        if (!leftFrame && !rightFrame)
            return false;

        let context = this._panel.context;

        if (leftFrame) {
            context.rect(leftFrame.left, leftFrame.top, leftFrame.width, leftFrame.height);
        }
        if (rightFrame) {
            context.rect(rightFrame.left, rightFrame.top, rightFrame.width, rightFrame.height);
        }
        context.clip();

        return true;
    }

    /**
     * @inheritdoc
     */
    draw() {
        let context = this._panel.context;

        context.save();

        if (this.clip()) {
            let theme = this.actualTheme,
                leftContentFrame = this._leftContentFrame,
                rightContentFrame = this._rightContentFrame,
                leftFrame = this._leftFrame,
                rightFrame = this._rightFrame,
                leftFrameRight = leftFrame && (leftFrame.right - 1),
                majorTickLen = this.majorTickMarkLength,
                minorTickLen = this.minorTickMarkLength;

            context.scxApplyTextTheme(theme.text);
            context.textBaseline = "middle";

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////
            // MA within this chart object, we DO NOT use minor ticks, but only major ticks. Idea is that major tick
            // never overlap (by the way they ware calculated), so no need for minor ticks.
            // However, for the "log" scale, it could happen to have major tick labels overlapping. To address this,
            // we need to have minor and major ticks (in order to drop the label whenever an overlap happens).
            // To avoid such a complexity for such an uncritical uncommon case, I added the following hack. I check if the labels
            // are going to overlap, and when they do, I drop drawing the label text (emulating a minor tick).
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////

            let tickTextHeight:number = HtmlUtil.getFontSize(theme.text);
            let yPositionForLastPrintedMajorTick:number = 0;

            context.beginPath();

            for (let tick of this.calibrator.majorTicks) {

                let textOverlapping:boolean = true; // assume by default a minor tick (no tick text printed)

                if(tickTextHeight < Math.abs(tick.y - yPositionForLastPrintedMajorTick)) {
                    // MA no overlapping, print tick text (major tick). This is the 99% case ;-)
                    textOverlapping = false;
                    yPositionForLastPrintedMajorTick = tick.y;
                }

                if (leftContentFrame) {
                    context.moveTo(leftFrameRight, tick.y);
                    context.lineTo(leftFrameRight - majorTickLen, tick.y);
                    if(!textOverlapping) { // no overlapping
                        context.textAlign = 'right';
                        context.fillText(tick.text, leftContentFrame.right, tick.y);
                    }
                }
                if (rightContentFrame) {
                    context.moveTo(rightFrame.left, tick.y);
                    context.lineTo(rightFrame.left + majorTickLen, tick.y);
                    if(!textOverlapping) { // no overlapping
                        context.textAlign = 'left';
                        context.fillText(tick.text, rightContentFrame.left, tick.y);
                    }
                }
            }

            // MA never called (we do not use minorTicks)
            for (let tick of this.calibrator.minorTicks) {
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
    }

    private _handleDoubleClickGesture() {
        let useManualWidth = this.chartValueScale.useManualWidth,
            prevWidth = useManualWidth || this.preferredWidth();

        this.chartPanel.chart.setAllowsAutoScaling(true);
        this.autoScale();

        let newWidth = useManualWidth || this.preferredWidth();
        if (prevWidth === newWidth)
            this._panel.setNeedsUpdate();
        else
            this.chart.setNeedsUpdate();
    }

    private _handlePanGesture(gesture: PanGesture, event: WindowEvent) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this.chart.rootDiv.addClass(CLASS_SCROLL);
                break;
            case GestureState.FINISHED:
                this.chart.rootDiv.removeClass(CLASS_SCROLL);
                break;
            case GestureState.CONTINUED:
                let offset = gesture.moveOffset.y,
                    func = event.evt.which === 1 ? this.scrollOnPixels : this.zoomOnPixels;

                // MA for element build, scroll is disabled. zoomOnPixels is only activated by scroll, and therefore, it is disabled too.
                // However, since zoomOnPixels could be more useful than scrollOnPixels, we activate it instead on panning for element
                // build, which is similar to functionality provided by tradingview.
                // if(Config.isElementBuild()) {
                //     func = this.zoomOnPixels;
                // }

                this._zoomOrScrollWithUpdate(offset, func);
                this.chartPanel.chart.setAllowsAutoScaling(false);
                break;
        }
    }

    private _handleMouseWheelGesture(gesture: MouseWheelGesture) {
        let frame = this._panel.frame,
            pixels = 0.05 * frame.height;

        this._zoomOrScrollWithUpdate(gesture.delta * pixels, this.zoomOnPixels);
        this.chartPanel.chart.setAllowsAutoScaling(false);
    }

    private _valueOffset(pixels: number): number {
        let frame = this._panel.contentFrame,
            factor = (this.maxVisibleValue - this.minVisibleValue) / frame.height;

        return factor * pixels;
    }

    private _canSetVisibleValueRange(newMinValue: number, newMaxValue: number): boolean {
        // Check if min/max are almost equal
        let newRange = newMaxValue - newMinValue;
        if (newRange < MIN_VALUE_RANGE)
            return false;

        // Check if new min/max values are in allowed range.
        let minAllowedValue = this.minAllowedValue;
        if (!isNaN(minAllowedValue) && newMinValue < minAllowedValue)
            return false;

        let maxAllowedValue = this.maxAllowedValue;
        if (!isNaN(maxAllowedValue) && newMaxValue > maxAllowedValue)
            return false;

        // Check min/max allowed value ratio
        let minMaxRange = this._panel.getAutoScaledMinMaxValues(this.chartValueScale),
            minRatio = this.minAllowedValueRatio,
            maxRatio = this.maxAllowedValueRatio,
            ratio: number;
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

        // Check value range ratio
        let valueRangeRatio = this.minValueRangeRatio;

        ratio = (minMaxRange.max - minMaxRange.min) / newRange;
        if (!isNaN(valueRangeRatio) && ratio < valueRangeRatio)
            return false;

        valueRangeRatio = this.maxValueRangeRatio;
        if (!isNaN(valueRangeRatio) && ratio > valueRangeRatio)
            return false;

        return true;
    }
}
