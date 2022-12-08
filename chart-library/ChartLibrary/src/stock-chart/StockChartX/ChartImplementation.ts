//NK to enable .scx() function
import '../StockChartX.UI/jQueryExtension';
import '../StockChartX.UI/scxNumericField';

import {TimeSpan} from './Data/TimeFrame';
import {EventableObject} from './Utils/EventableObject';
import {Drawing, IDrawingState} from './Drawings/Drawing';
import {DateScale, IDateScaleState} from './Scales/DateScale';
import {IValueScaleConfig, ValueScale} from './Scales/ValueScale';
import {ChartPanelsContainer} from './ChartPanels/ChartPanelsContainer';
import {DataManager, IBar, IBarDataSeries} from './Data/DataManager';
import {ISize, Rect} from './Graphics/Rect';
import {IIndicatorOptions, Indicator} from './Indicators/Indicator';
import {IValueMarker, ValueMarker} from './Scales/ValueMarker';
import {IPriceStyle, IPriceStyleState, PriceStyle} from './PriceStyles/PriceStyle';
import {CrossHair, ICrossHairState} from './CrossHair';
import {SelectionMarker} from './SelectionMarker';
import {ChartPanel} from './ChartPanels/ChartPanel';
import {DataSeries, DataSeriesSuffix} from './Data/DataSeries';
import {Animation} from './Graphics/Animation';
import {ZoomTool} from './Tools/ZoomTool';
import {MeasurementTool} from './Tools/MeasurementTool';
import {ChartAnnotation, ChartAnnotationType} from './ChartAnnotations/ChartAnnotation';
import {CandlePriceStyle} from './PriceStyles/CandlePriceStyle';
import {JsUtil} from './Utils/JsUtil';
import {IchimokuKinkoHyo, VolumeProfilerSessionVolume, VolumeProfilerVisibleRange} from '../TASdk/TASdk';
import {IchimokuIndicator} from './Indicators/IchimokuIndicator';
import {TAIndicator} from './Indicators/TAIndicator';
import {ChartPanelSplitter} from './ChartPanels/ChartPanelSplitter';
import {WindowEvent, MouseEvent, TouchEvent} from './Gestures/Gesture';
import {ChartTheme, Theme, ThemeUtils} from './Theme';
import {SplitChartAnnotation} from './ChartAnnotations/SplitChartAnnotation';
import {Chart, ChartEvent, ChartOptions, ChartState, ICanvasImageCallback, IChartConfig, IInstrument} from './Chart';
import {ValueScaleImplementation} from './Scales/ValueScaleImplementation';
import {IndicatorDeserializer} from './Indicators/IndicatorDeserializer';
import {ChartPanelsContainerImplementation, IChartPanelsContainerOptions} from './ChartPanels/ChartPanelsContainerImplementation';
import {CrossHairImplementation} from './CrossHairImplementation';
import {DateScaleImplementation} from './Scales/DateScaleImplementation';
import {CategoryNews, ChartAccessorService, ChartAlert, ChartAlertIndicator} from '../../services/index';
import {BrowserUtils} from '../../utils';
import {AxisScaleType} from './Scales/axis-scale-type';
import {TradingOrder, TradingPosition} from '../../services/trading/broker/models';
import {TradingOrderStatusType} from '../../services/trading/broker/models/trading-order-status';
import {TradingOrderSideType} from '../../services/trading/broker/models/trading-order-side';
import {TradingOrderChartAnnotation} from './ChartAnnotations/TradingOrderChartAnnotation';
import {ChartAnnotationsManager} from './ChartAnnotations/ChartAnnotationsManager';
import {NewsChartAnnotation} from './ChartAnnotations/NewsChartAnnotation';
import {LiquidityIndicator} from './Indicators/LiquidityIndicator';
import {IWaitingBarConfig, Plot, WaitingBar} from '..';
import {IndicatorHelper} from './Indicators/IndicatorHelper';
import {VolumeProfilerSessionVolumeIndicator} from './Indicators/VolumeProfilerSessionVolumeIndicator';
import {VolumeProfilerVisibleRangeIndicator} from './Indicators/VolumeProfilerVisibleRangeIndicator';
import {ThemeType} from './ThemeType';
import {Config} from '../../config/config';
import {MovingAverageOptions} from './MovingAverageOptions';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;
const Class = {
    ROOT_CONTAINER: 'scxRootContainer',
    CONTAINER: 'scxContainer',
    BACKGROUND: 'scxBackground',
    UN_SELECTIVE: 'scxUnSelective',
    FULL_WINDOW: 'scxFullWindow'
};

const DEFAULT_TIME_INTERVAL = TimeSpan.MILLISECONDS_IN_MINUTE;

export class ChartImplementation extends EventableObject implements Chart{
    /**
     * Gets chart version.
     * @name version
     * @type {string}
     * @readonly
     * @memberOf Chart
     */
    static get version(): string {
        return "2.14.19";
    }

    private _themeType:ThemeType = ThemeType.Light;

    private _copyBuffer: Drawing;
    private _container: JQuery;
    /**
     * The chart's parent container.
     * @name container
     * @type {jQuery}
     * @readonly
     * @memberOf Chart#
     */
    get container(): JQuery {
        return this._container;
    }

    private _rootDiv: JQuery;
    get rootDiv(): JQuery {
        return this._rootDiv;
    }

    private _dateScale: DateScale;
    /**
     * The date scale.
     * @name dateScale
     * @type {DateScale}
     * @readonly
     * @memberOf Chart#
     */
    get dateScale(): DateScale {
        return this._dateScale;
    }

    private _valueScales: ValueScale[] = [];
    get valueScales(): ValueScale[] {
        return this._valueScales;
    }

    /**
     * The value scale.
     * @name valueScale
     * @type {ValueScale}
     * @readonly
     * @memberOf Chart#
     */
    get valueScale(): ValueScale {
        return this._valueScales[0];
    }

    private _chartPanelsContainer: ChartPanelsContainer;
    /**
     * The chart panels container.
     * @name chartPanelsContainer
     * @type {ChartPanelsContainer}
     * @readonly
     * @memberOf Chart#
     */
    get chartPanelsContainer(): ChartPanelsContainer {
        return this._chartPanelsContainer;
    }

    private _dataManager: DataManager;
    /**
     * The data manager (manages data series).
     * @name dataManager
     * @type {DataManager}
     * @readonly
     * @memberOf Chart#
     */
    get dataManager(): DataManager {
        return this._dataManager;
    }

    private _timeInterval: number;
    /**
     * The bars time interval in milliseconds.
     * @name timeInterval
     * @returns {Number}
     * @see {@linkcode TimeSpan}
     * @memberOf Chart#
     * @example
     *  chart.timeInterval = TimeSpan.MILLISECONDS_IN_DAY;      // set 1 day time interval
     *  chart.timeInterval = TimeSpan.MILLISECONDS_IN_HOUR * 4; // set 4 hours time interval
     */
    get timeInterval(): number {
        return this._timeInterval;
    }

    set timeInterval(value: number) {
        let interval = value, // MA compile typescript : instead of parseInt(<string> value, 10),
            oldInterval = this._timeInterval;

        if (oldInterval != interval) {
            if (!isFinite(interval) || interval <= 0)
                throw new Error("Time interval must be greater than 0.");

            this._timeInterval = interval;
            this.fireValueChanged(ChartEvent.TIME_INTERVAL_CHANGED, interval, oldInterval);
        }
    }

    private _marketTradingMinutesCountInDays: number;

    get marketTradingMinutesCount(): number {
        return this._marketTradingMinutesCountInDays;
    }

    set marketTradingMinutesCount(value: number) {
        this._marketTradingMinutesCountInDays = value;
    }

    private _chartPanelsFrame: Rect = new Rect();
    get chartPanelsFrame(): Rect {
        return this._chartPanelsFrame;
    }

    private _instrument: IInstrument;
    /**
     * The instrument.
     * @name instrument
     * @type {IInstrument}
     * @memberOf Chart#
     * @example
     *  chart.instrument = {
         *      symbol: 'GOOG',
         *      company: 'Google Inc.'
         *      exchange: 'NSDQ'
         *  };
     */
    get instrument() {
        return this._instrument;
    }

    set instrument(value) {
        let oldInstrument = value;
        this._instrument = value;
        this.fireValueChanged(ChartEvent.INSTRUMENT_CHANGED, value, oldInstrument);
    }

    private _indicators: Indicator[] = [];
    /**
     * The array of chart indicators.
     * @name indicators
     * @type {Indicator[]}
     * @readonly
     * @memberOf Chart#
     */
    get indicators(): Indicator[] {
        return this._indicators;
    }

    private _valueMarker: IValueMarker;
    get valueMarker(): ValueMarker {
        return <ValueMarker> this._valueMarker; // MA compile typescript
    }

    private _options: ChartOptions = <ChartOptions> {};


    private _movingAverageOptions:MovingAverageOptions;
    get movingAverageOptions(): MovingAverageOptions {
        return this._movingAverageOptions
    }
    /**
     * The locale string (e.g. 'en-US').
     * @name locale
     * @type {string}
     * @default 'en-US'
     * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation}
     * @memberOf Chart#
     * @example
     *  chart.locale = 'uk-UA';
     */
    get locale(): string {
        return this._options.locale;
    }

    set locale(value: string) {
        let oldLocale = this._options.locale;
        if (oldLocale != value) {
            this._options.locale = value;

            this.fireValueChanged(ChartEvent.LOCALE_CHANGED, value, oldLocale);
        }
    }

    /**
     * The flag that indicates whether keyboard events should be processed.
     * @name keyboardEventsEnabled
     * @type {boolean}
     * @default true
     * @memberOf Chart#
     * @example
     *  chart.keyboardEventsEnabled = true;     // enable keyboard events
     *  chart.keyboardEventsEnabled = false;    // disable keyboard events.
     */
    get keyboardEventsEnabled(): boolean {
        return this._options.enableKeyboardEvents;
    }

    set keyboardEventsEnabled(value: boolean) {
        this._options.enableKeyboardEvents = !!value;
    }

    private _numberOfDigitFormat: number;

    get numberOfDigitFormat(): number {
        return this._numberOfDigitFormat;
    }

    set numberOfDigitFormat(value: number) {
        let oldLocale = this._numberOfDigitFormat;
        if (oldLocale != value) {
            this._numberOfDigitFormat = value;
        }
    }

    /**
     * The chart theme.
     * @name theme
     * @type {Object}
     * @memberOf Chart#
     */
    get theme() {
        return this._options.theme;
    }

    set theme(value) {
        this._themeType = value.name == Theme.Light.name ? ThemeType.Light : ThemeType.Dark;
        this._options.theme = value;
        this._applyTheme();
        this.updateIndicators();
        this.fireValueChanged(ChartEvent.THEME_CHANGED);
    }

    get showBarInfoInTitle(): boolean {
        return this._options.showBarInfoInTitle;
    }

    set showBarInfoInTitle(value: boolean) {
        this._options.showBarInfoInTitle = !!value;
    }

    get showPanelOptions(): boolean {
        return this._options.showPanelOptions;
    }

    set showPanelOptions(value: boolean) {
        this._options.showPanelOptions = value;
    }

    private _priceStyle: IPriceStyle;
    /**
     * The price style.
     * @name priceStyle
     * @type {PriceStyle}
     * @see {@linkcode PriceStyle}
     * @memberOf Chart#
     * @example
     *  chart.priceStyle = PriceStyle.BAR; // set 'bars' price style.
     */
    get priceStyle(): IPriceStyle {
        return this._priceStyle;
    }

    set priceStyle(value: IPriceStyle) {
        let oldPriceStyle = this.priceStyle;
        if (oldPriceStyle !== value) {
            let dateRange = this.dateRange();

            this._priceStyle.destroy();

            value.chart = this;
            this._priceStyle = value;
            this._priceStyle.apply();

            let dateScale = this.dateScale,
                projection = dateScale.projection,
                firstRecord = projection.recordByX(projection.xByDate(dateRange.startDate, false), false),
                lastRecord = projection.recordByX(projection.xByDate(dateRange.endDate, false), false);

            if (!dateScale._canSetVisibleRecord(firstRecord) || !dateScale._canSetVisibleRecord(lastRecord)) {
                this.setNeedsAutoScaleAll();
            } else {
                this.firstVisibleRecord = firstRecord;
                this.lastVisibleRecord = lastRecord - 1;

                //this._chart.dateRange(dateRange.startDate, dateRange.endDate);
                if (this.lastVisibleRecord - this.firstVisibleRecord < dateScale.minVisibleRecords)
                    this.setNeedsAutoScaleAll();
                else
                    this.setNeedsAutoScale();
            }

            this.fireValueChanged(ChartEvent.PRICE_STYLE_CHANGED, value, oldPriceStyle);
        }
    }

    get priceStyleKind(): string {
        let priceStyle = this.priceStyle;

        return priceStyle && (priceStyle.constructor as typeof PriceStyle).className;
    }

    set priceStyleKind(value: string) {
        this.priceStyle = PriceStyle.create(value);
    }

    private _hoverRecord: number;

    get hoveredRecord(): number {
        return this._hoverRecord;
    }

    private _crossHair: CrossHair;
    /**
     * The cross hair object.
     * @name crossHair
     * @type {CrossHair}
     * @readonly
     * @memberOf Chart#
     */
    get crossHair(): CrossHair {
        return this._crossHair;
    }

    private _selectedObject: Plot | Drawing;
    /**
     * The currently selected object.
     * @name selectedObject
     * @type {Drawing}
     * @memberOf Chart#
     */
    get selectedObject() {
        return this._selectedObject;
    }

    set selectedObject(value) {
        this._selectedObject = value;
    }

    private _selectionMarker: SelectionMarker;
    get selectionMarker(): SelectionMarker {
        return this._selectionMarker;
    }

    private _preFullWindowSize: ISize;

    private _showDrawings = true;
    /**
     * The flag that indicates whether drawings should be drawn.
     * @name showDrawings
     * @type {boolean}
     * @default true
     * @memberOf Chart#
     */
    get showDrawings(): boolean {
        return this._showDrawings;
    }

    set showDrawings(value: boolean) {
        this._showDrawings = !!value;
    }

    private _state = ChartState.NORMAL;
    get state(): number {
        return this._state;
    }

    set state(value: number) {
        let oldState = this._state;

        if (oldState !== value) {
            this._state = value;

            this.fireValueChanged(ChartEvent.STATE_CHANGED, value, oldState);
        }
    }

    /**
     * The size of chart.
     * @name size
     * @type {Size}
     * @memberOf Chart#
     */
    get size(): ISize {
        return {
            width: this._rootDiv.width(),
            height: this._rootDiv.height()
        }
    }

    set size(value: ISize) {
        this._container.css('width', 'auto').css('height', 'auto');
        this._rootDiv.width(value.width).height(value.height);
        this._rootDiv.find('.' + Class.BACKGROUND).width(value.width).height(value.height);
    }

    /**
     * The main chart panel.
     * @name mainPanel
     * @type {ChartPanel}
     * @readonly
     * @memberOf Chart#
     */
    get mainPanel(): ChartPanel {
        return (<PriceStyle>this._priceStyle).chartPanel || this._chartPanelsContainer.panels[0]; // MA compile typescript
    }

    /**
     * The number of records on the chart.
     * @name recordCount
     * @type {number}
     * @readonly
     * @memberOf Chart#
     */
    get recordCount(): number {
        return this.primaryDataSeries(DataSeriesSuffix.DATE).length;
    }

    /**
     * The first visible record.
     * @name firstVisibleRecord
     * @type {number}
     * @memberOf Chart#
     */
    get firstVisibleRecord(): number {
        return this._dateScale.firstVisibleRecord;
    }

    set firstVisibleRecord(value: number) {
        this._dateScale.firstVisibleRecord = value;
    }

    /**
     * The last visible record.
     * @name lastVisibleRecord
     * @type {number}
     * @memberOf Chart#
     */
    get lastVisibleRecord(): number {
        return this._dateScale.lastVisibleRecord;
    }

    set lastVisibleRecord(value: number) {
        this._dateScale.lastVisibleRecord = value;
    }

    /**
     * Gets index of first visible record.
     * @name firstVisibleIndex
     * @type {number}
     * @readonly
     * @memberOf Chart#
     */
    get firstVisibleIndex(): number {
        return this._dateScale.firstVisibleIndex;
    }

    /**
     * Gets index of last visible record.
     * @name lastVisibleIndex
     * @type {number}
     * @readonly
     * @memberOf Chart#
     */
    get lastVisibleIndex(): number {
        return this._dateScale.lastVisibleIndex;
    }

    /**
     * An array of chart panels.
     * @name chartPanels
     * @type {ChartPanel[]}
     * @readonly
     * @memberOf Chart#
     */
    get chartPanels(): ChartPanel[] {
        return this._chartPanelsContainer.panels;
    }

    /**
     * The cross hair type.
     * @name crossHairType
     * @type {CrossHairType}
     * @memberOf Chart#
     */
    get crossHairType(): string {
        return this._crossHair.crossHairType;
    }

    set crossHairType(value: string) {
        this._crossHair.crossHairType = value;
    }

    /* read start and end date displayed chart area (returns null when no zooming) */
    getZoomedDateRange(): { start: Date, end: Date } {
        if (this.firstVisibleRecord == this.lastVisibleRecord) {
            return null; // MA no zooming
        }
        if (!this.dateScale.zoomed) {
            return null; // MA if there is no zooming, return null (so next company will show all of its data)
        }
        return {
            start: this.dateScale.projection.dateByRecord(Math.floor(this.firstVisibleRecord)),
            end: this.dateScale.projection.dateByRecord(Math.ceil(this.lastVisibleRecord))
        };
    }


    private _waitingBar: WaitingBar;
    private _updateAnimation = new Animation({
        context: this,
        recurring: false,
        callback: this._onUpdateAnimationCallback
    });


    private _readOnly: boolean;
    get readOnly(): boolean {
        return this._readOnly;
    }

    private _zoomTool: ZoomTool;
    get zoomTool(): ZoomTool {
        return this._zoomTool;
    }

    private _measurementTool: MeasurementTool;
    get measurementTool(): MeasurementTool {
        return this._measurementTool;
    }

    get magnetRatio() {
        return this._options.magnetRatio;
    }

    set magnetRatio(ratio: number) {
        this._options.magnetRatio = ratio;
    }

    private _isInteractive: boolean;
    get isInteractive(): boolean {
        return this._isInteractive;
    }

    private _hostId: string;
    get hostId(): string {
        return this._hostId;
    }

    private customChartPanelObjectsManager: ChartAnnotationsManager = new ChartAnnotationsManager();
    private continuousDrawing: boolean = false;
    private lastUsedDrawingClassName: string = null;

    allowsAutoScaling: boolean = true;

    constructor(config: IChartConfig) {
        super();

        if (typeof config !== 'object')
            throw new Error('Config must be an object.');

        if (!config.hostId)
            throw new Error('Chart host id is not specified.');

        if(!config.theme)
            config.theme = ChartAccessorService.instance.getThemeDefaultSettings();

        if(config.theme)
            this._themeType = config.theme.name == Theme.Light.name ? ThemeType.Light : ThemeType.Dark;

        this._hostId = config.hostId;

        if (!config.container)
            throw new Error('Chart container is not specified.');
        this._container = $(config.container);
        if (this._container.length === 0)
            throw new Error("Unable to find HTML element by selector '" + config.container + '".');

        let width = config.width || DEFAULT_WIDTH;
        if (width <= 0)
            throw new Error("Width must be a positive number.");

        let height = config.height || DEFAULT_HEIGHT;
        if (height <= 0)
            throw new Error("Height must be a positive number.");

        this._readOnly = config.readOnly;
        this._instrument = config.instrument;

        this._movingAverageOptions = new MovingAverageOptions();

        this.timeInterval = config.timeInterval || DEFAULT_TIME_INTERVAL;

        this._loadOptionsState(config);

        this._valueMarker = new ValueMarker(this._options.theme.valueScale.valueMarker);

        this._selectionMarker = new SelectionMarker({chart: this});

        this._layoutHtmlElements(width, height);

        this._applyTheme();

        this._dataManager = new DataManager();
        this._dataManager.addBarDataSeries();

        this._dateScale = new DateScaleImplementation({chart: this});
        this.valueScales.push(new ValueScaleImplementation({chart: this}));
        this._chartPanelsContainer = new ChartPanelsContainerImplementation({chart: this});
        this._crossHair = new CrossHairImplementation({chart: this});
        if (config.crossHair != null) {
            this.crossHairType = config.crossHair;
        }

        this._priceStyle = new CandlePriceStyle({chart: this});
        this._priceStyle.apply();
        if (config.priceStyle != null) {
            this.priceStyleKind = config.priceStyle;
        }

        this._subscribeEvents(config.readOnly);

        this.layout();

        if (config.showToolbar !== false) {
            if (JsUtil.isFunction(config.onToolbarLoaded))
                this.on(ChartEvent.TOOLBAR_LOADED, config.onToolbarLoaded);

            this._container.scx().toolbar(this);
        }

        if (config.showNavigation !== false)
            this._rootDiv.scx().chartNavigation(this);

        if (config.fullWindowMode)
            this.toggleFullWindow();

        this._zoomTool = new ZoomTool({chart: this});
        this._measurementTool = new MeasurementTool({chart: this});

        this._isInteractive = config.isInteractive;
    }

    isVisible(): boolean {
        return this._rootDiv.is(':visible');
    }

    /**
     * Returns chart bounds rectangle.
     * @method getBounds
     * @returns {Rect}
     * @memberOf Chart#
     */
    getBounds(): Rect {
        return new Rect({
            left: 0,
            top: 0,
            width: this._rootDiv.width(),
            height: this._rootDiv.height()
        });
    }

    /**
     * Selects new chart object. E.g. drawing.
     * @method selectObject
     * @param {Drawing} obj
     * @returns {boolean} True if selection is changed, false otherwise.
     * @memberOf Chart#
     */
    selectObject(obj: Plot | Drawing): boolean {
        let oldSelectedObj = this._selectedObject;
        if (!oldSelectedObj && !obj)
            return false;
        if (oldSelectedObj === obj && obj.selected)
            return false;

        if (oldSelectedObj)
            oldSelectedObj.selected = false;
        if (obj)
            obj.selected = true;
        this.selectedObject = obj;

        this.setNeedsUpdate();

        return true;
    }

    /**
     * Adds new value scale.
     * @method addValueScale
     * @param {ValueScale} [valueScale] The value scale.
     * @returns ValueScale
     * @memberOf Chart#
     */
    addValueScale(valueScale: ValueScale) {
        let scales = this.valueScales;
        if (valueScale) {
            for (let scale of scales) {
                if (scale === valueScale)
                    throw new Error("Value scale has been added already.");
            }
        } else {
            valueScale = new ValueScaleImplementation({chart: this});
        }

        scales.push(valueScale);
        this.fireValueChanged(ChartEvent.VALUE_SCALE_ADDED, valueScale);

        return valueScale;
    }

    removeValueScale(valueScale: ValueScale | ValueScale[]) {
        let i: number;

        if (Array.isArray(valueScale)) {
            for (let scale of valueScale) {
                this.removeValueScale(scale);
            }

            return;
        }

        let scales = this.valueScales;
        for (i = 0; i < scales.length; i++) {
            if (scales[i] === valueScale) {
                if (i === 0)
                    throw new Error("Cannot remove main scale.");

                scales.splice(i, 1);
                this.fireValueChanged(ChartEvent.VALUE_SCALE_REMOVED, i);

                break;
            }
        }
    }

    /**
     * Adds one or more indicators.
     * @method addIndicators
     * @param {number | Indicator | number[] | Indicator[]} indicators The indicator(s) to be added.
     * It can be TA indicator number or Indicator instance.
     * @returns {Indicator|Indicator[]} Added indicators.
     * @memberOf Chart#
     * @see [removeIndicators]{@linkcode Chart#removeIndicators} to remove indicators.
     * @example <caption>Add bollinger bands indicator</caption>
     *  var bollingerBandsIndicator = chart.addIndicators(BollingerBands);

     * @example <caption>Add RSI and Bollinger bands indicators.</caption>
     *  var indicators = chart.addIndicators([RelativeStrengthIndex, BollingerBands]);

     *  @example <caption>Configure and add indicator.</caption>
     *  var rsi = new TAIndicator({taIndicator: RelativeStrengthIndex});
     *  rsi.setParameterValue(IndicatorParam.PERIODS, 20);
     *  chart.addIndicators(rsi);
     */
    addIndicators(indicators: number | number[] | Indicator | Indicator[] | IIndicatorOptions | IIndicatorOptions[]): Indicator | Indicator[] {
        if (Array.isArray(indicators)) {
            // An array of indicators passed. Add indicators one by one.
            return this.addArrayOfIndicators(indicators as Indicator[]);
        }

        let newIndicator = indicators;

        // Check if it's a TA indicator number.
        if (JsUtil.isNumber(newIndicator)) {
            if (IndicatorHelper.isLiquidityIndicator(<number>newIndicator))
                return this.addIndicators(new LiquidityIndicator({chart:this, taIndicator: <number>newIndicator}));
            else if (VolumeProfilerSessionVolume == newIndicator)
                return this.addIndicators(new VolumeProfilerSessionVolumeIndicator({chart:this, taIndicator: <number>newIndicator}));
            else if (VolumeProfilerVisibleRange == newIndicator)
                return this.addIndicators(new VolumeProfilerVisibleRangeIndicator({chart:this, taIndicator: <number>newIndicator}));
            else if (newIndicator == IchimokuKinkoHyo)//NK we handle IchimokuIndicator here instead of pass it as object, we will pass his type only and this function will create his instance
                return this.addIndicators(new IchimokuIndicator({chart:this, taIndicator: IchimokuKinkoHyo}));
            else
                return this.addIndicators(new TAIndicator({chart:this, taIndicator: <number>newIndicator})); // MA compile typescript
        }

        // Check if it's an indicator object.
        if (newIndicator instanceof Indicator) {
            let chartIndicators = this._indicators;

            // Do nothing if indicator already added.
            for (let item of chartIndicators) {
                if (item === newIndicator)
                    return newIndicator;
            }

            newIndicator.chart = this;
            chartIndicators.push(newIndicator);
            newIndicator.update();

            // HA : take true value because if we set volume as default settings for (MA ENV indicator) the AutoScale will not update until make a scroll .
            this.setNeedsUpdate(true);

            this.fireValueChanged(ChartEvent.INDICATOR_ADDED, newIndicator);

            return newIndicator;
        }

        // Check
        if (typeof newIndicator === 'object') {
            let state = $.extend(true, {chart: this}, newIndicator);

            newIndicator = IndicatorDeserializer.instance.deserialize(state);
            return this.addIndicators(newIndicator);
        }

        throw new TypeError("Unknown indicator.");
    }

    /**
     * Removes one or more indicators.
     * @method removeIndicators
     * @param {Indicator | Indicator[]} [indicators] Indicator(s) to remove. All indicators are removed if omitted.
     * @param {boolean} [removePanelIfNoPlots] The flag that indicates if panel should be removed  if there are no plots on it any more. True by default.
     * @memberOf Chart#
     * @see [addIndicators]{@linkcode Chart#addIndicators} to add indicators.
     * @example <caption>Remove all indicators from the chart.</caption>
     * chart.removeIndicators();
     *
     * @example <caption>Remove RSI indicator</caption>
     * // Assume that rsi indicator was added already.
     * // var rsi = chart.addIndicators(RelativeStrengthIndex);
     *
     * chart.removeIndicators(rsi);
     * @example <caption>Remove all indicators</caption>
     * chart.removeIndicators();
     */
    removeIndicators(indicators?: Indicator | Indicator[], removePanelIfNoPlots?: boolean) {
        if (removePanelIfNoPlots === undefined)
            removePanelIfNoPlots = true;

        if (Array.isArray(indicators)) {
            // Argument is an array of indicators. Remove indicators one by one.
            for (let item of indicators) {
                if (item)
                    this.removeIndicators(item, removePanelIfNoPlots);
            }

            return;
        }

        let chartIndicators = this._indicators,
            indicator = indicators;

        let removeIndicator = (indicator: Indicator) => {
            let panel = indicator.chartPanel;
            if (panel) {
                panel.removePlot(indicator.plots);

                // Remove panel if there are no plots on it.
                if (removePanelIfNoPlots && panel.plots.length == 0 && panel !== this.mainPanel)
                    panel.chartPanelsContainer.removePanel(panel);
            }

            indicator.destroy();

            this.fireValueChanged(ChartEvent.INDICATOR_REMOVED, indicator);
        };

        for (let i = 0; i < chartIndicators.length; i++) {
            if (indicator) {
                // Indicator is specified. Remove it.
                if (chartIndicators[i] === indicator) {
                    chartIndicators.splice(i, 1);
                    removeIndicator(<Indicator> indicator);

                    break;
                }
            } else {
                // Indicator is not specified. Remove all indicators.
                let item = chartIndicators[i];

                chartIndicators.splice(i, 1);
                removeIndicator(item);
                i--;
            }
        }
    }

    /**
     * Updates all indicators. It needs to be called after data series values are changed.
     * @method updateIndicators
     * @memberOf Chart#
     * @see [addIndicators]{@linkcode Chart#addIndicators} to add indicators.
     * @see [removeIndicators]{@linkcode Chart#removeIndicators} to remove indicators.
     * @example
     *  chart.updateIndicators();
     */
    updateIndicators() {
        let customSourceIndicators: Indicator[] = [];
        for (let indicator of this._indicators) {
            if (indicator.customSourceIndicatorId) {
                customSourceIndicators.push(indicator);
            } else {
                indicator.update();
            }
        }

        for (let indicator of customSourceIndicators) {
            indicator.update();
        }
    }

    /**
     * Saves indicators state.
     * @method saveIndicatorsState
     * @returns {Object[]} An array of indicator states.
     * @memberOf Chart#
     * @see [loadIndicatorsState]{@linkcode Chart#loadIndicatorsState} to load indicators.
     * @example
     *  var state = chart.saveIndicatorsState();
     */
    saveIndicatorsState(): IIndicatorOptions[] {
        let states: IIndicatorOptions[] = [],
            panels = this.chartPanels,
            indicators = this._indicators;

        for (let panel of panels) {
            for (let indicator of indicators) {
                if (indicator.chartPanel === panel)
                    states.push(indicator.serialize());
            }
        }

        return states;
    }

    /**
     * Loads indicators state.
     * @method loadIndicatorsState
     * @param {String | Object} state The indicators state serialized by saveIndicatorsState function.
     * @memberOf Chart#
     * @see [saveIndicatorsState]{@linkcode Chart#saveIndicatorsState} to save indicators.
     * @example <caption>Save and load indicators state</caption
     *  var state = chart.saveIndicatorsState();
     *  chart.loadIndicatorsState(state);
     */
    loadIndicatorsState(state: IIndicatorOptions[]) {
        if (typeof state === 'string')
            state = JSON.parse(state);

        this.removeIndicators();
        if (state)
            this.addIndicators(state);
    }

    /**
     * Saves all drawings.
     * @method saveDrawingsState
     * @returns {Object[]} The array of drawing states.
     * @memberOf Chart#
     * @see [loadDrawingsState]{@linkcode Chart#loadDrawingsState} to load drawings.
     * @example
     *  var state = chart.saveDrawingsState();
     */
    saveDrawingsState(): IDrawingState[] {
        let state: IDrawingState[] = [];

        let panels = this._chartPanelsContainer.panels;
        for (let panel of panels) {
            for (let drawing of panel.drawings) {
                if (this.isValidDrawingChartPoints(drawing)) {
                    state.push(drawing.saveState());
                }
            }
        }

        return state;
    }

    updateTradingDrawings(orders: TradingOrder[], position: TradingPosition) {
        let activeOrders = orders.filter(order => order.status.type == TradingOrderStatusType.ACTIVE);
        let executedOrders = orders.filter(order => order.status.type == TradingOrderStatusType.EXECUTED);

        let panel = this.mainPanel;

        let panelOrders = panel.getTradingOrders();

        // add new order
        for(let order of activeOrders) {
            if(!panelOrders.find(o => o.id == order.id)) {
                panel.addTradingOrder(order);
            } else {
                panel.updateTradingOrder(order);
            }
        }

        // remove deleted orders
        for(let order of panelOrders) {
            if(!activeOrders.find(o => o.id == order.id)) {
                panel.removeTradingOrder(order);
            }
        }

        // always update position
        panel.removeTradingPosition();
        if(position) {
            panel.addTradingPosition(position);
        }

        this.addExecutedOrders(executedOrders);

        //HA :we need direct update (when set it setNeedsUpdate and make refresh and go to another browser tab and return to project after loaded done it will make a problem ) ,
        // so every function called before onData() , i kept it to updated directly for precaution
        panel.update();

    }

    updateChartAlertDrawings(alerts: ChartAlert[]) {
        for(let panel of this.chartPanels) {
            let alertsBelongingToPanel = alerts.filter(alert => {
                if(panel == this.mainPanel && alert.parameter.indicatorId == ChartAlertIndicator.CLOSE_INDICATOR_ID) {
                    return true;
                }
                return panel.hasIndicator(alert.parameter.indicatorId)
            });
            let alertsInPanel = panel.getChartAlerts();

            // add new alerts
            for(let alert of alertsBelongingToPanel) {
                if(!alertsInPanel.find(o => o.id == alert.id)) {
                    panel.addChartAlert(alert);
                } else {
                    panel.updateChartAlert(alert);
                }
            }

            // remove deleted alerts
            for(let alert of alertsInPanel) {
                if(!alertsBelongingToPanel.find(o => o.id == alert.id)) {
                    panel.removeChartAlert(alert);
                }
            }

            // HA :we need direct update
            panel.update();
        }
    }

    addNewsAnnotations(newsList: CategoryNews[]): void {
        this.addNews(newsList);
        this.setNeedsUpdate();
    }

    /**
     * Loads drawings.
     * @method loadDrawingsState
     * @param {String | Object} state The drawings state serialized by saveDrawingsState function.
     * @memberOf Chart#
     * @see [saveDrawingsState]{@linkcode Chart#saveDrawingsState} to save drawings.
     * @example
     *  var state = chart.saveDrawingsState();
     *  chart.loadDrawingsState(state);
     */
    loadDrawingsState(state: IDrawingState[]) {
        if (typeof state === 'string')
            state = JSON.parse(state);

        this.clearDrawingsOnLoadState();

        if (!state)
            return;

        let panels = this._chartPanelsContainer.panels;
        for (let stateItem of state) {
            let panel = panels[stateItem.panelIndex];
            if (!panel)
                continue;
            let drawing = Drawing.deserialize(this, stateItem);
            // NK For backward compatibility, do not load the drawing if there is any invalid chart point.
            if (drawing && this.isValidDrawingChartPoints(drawing))
                panel.addDrawings(drawing);
        }
    }

    /**
     * Removes all drawings.
     * @method removeDrawings
     * @memberOf Chart#
     * @see [saveDrawingsState]{@linkcode Chart#saveDrawingsState} to save drawings.
     * @see [loadDrawingsState]{@linkcode Chart#loadDrawingsState} to load drawings.
     * @example
     *  chart.removeDrawings();
     */

    // -------------------------------------------------------------------------------------------------------------------------------->
    // MA difference between deleteDrawings and removeDrawingsOnLoadState:
    // 1. both of them remove drawings from the chart.
    // 2. deleteDrawing is called when drawings are intended to be "deleted", therefore, it calls drawing preDeleteCleanUp to release
    //    and resources, as in drawing alerts. However, removeDrawingsOnLoadState doesn't do that, as it expects drawings are removed
    //    because another symbol is loaded in the chart, and the user still have drawing saved in chart.component state.
    // <--------------------------------------------------------------------------------------------------------------------------------

    deleteDrawings() {
        let panels = this._chartPanelsContainer.panels;
        for (let panel of panels) {
            panel.deleteDrawings();
        }
    }

    clearDrawingsOnLoadState() {
        let panels = this._chartPanelsContainer.panels;
        for (let panel of panels) {
            panel.clearPanelOnLoadState();
        }
    }

    /**
     * Saves chart state (including indicators and drawings).
     * @method saveState
     * @returns {Object} The chart state.
     * @memberOf Chart#
     * @see [loadState]{@linkcode Chart#loadState} to load state.
     * @example
     *  var state = chart.saveState();
     */
    saveState(): IChartState {
        let scalesState: IValueScaleConfig[] = [];
        for (let scale of this.valueScales) {
            scalesState.push(scale.saveState());
        }

        return {
            chart: $.extend(true, {}, this._options),
            priceStyle: this._priceStyle.saveState() as IPriceStyleState,
            dateScale: this._dateScale.saveState(),
            valueScales: scalesState,
            crossHair: this._crossHair.saveState(),
            chartPanelsContainer: this._chartPanelsContainer.saveState(),
            indicators: this.saveIndicatorsState(),
            drawings: this.saveDrawingsState(),
        };
    }

    /**
     * Loads chart state.
     * @method loadState
     * @param {String | {chart: Object, dateScale: Object, valueScale: Object, crossHair: Object, chartPanelsContainer: Object, indicators: Object, drawings: Object}} state The chart state serialized by saveState function.
     * @memberOf Chart#
     * @see [saveState]{@linkcode Chart#saveState} to save state.
     * @example
     *  var state = chart.saveState();
     *  chart.loadState(state);
     */
    loadState(state: IChartState) {
        if (typeof state === 'string')
            state = JSON.parse(state);

        state = state || <IChartState>{};

        this.suppressEvents();

        this.removeIndicators();

        this._loadOptionsState(state.chart);
        this._dateScale.loadState(state.dateScale);
        this.theme = this._options.theme; // apply any theme update

        this._restoreValueScales(state);

        this._crossHair.loadState(state.crossHair);
        this._chartPanelsContainer.loadState(state.chartPanelsContainer);
        this._priceStyle = PriceStyle.deserialize(state.priceStyle);
        this._priceStyle.chart = this;
        this._priceStyle.apply();
        this.layout();

        this.loadIndicatorsState(state.indicators);
        this.loadDrawingsState(state.drawings);

        this.suppressEvents(false);

        // MA because events were suppressed above when theme is set, now throw THEME_CHANGED
        this.fireValueChanged(ChartEvent.THEME_CHANGED);

        this.fireValueChanged(ChartEvent.STATE_LOADED);

    }

    _restoreValueScales(state: IChartState) {
        let valueScales = this.valueScales,
            i: number;
        for (let valueScale of valueScales) {
            valueScale.destroy();
        }

        let scalesState = state.valueScales;
        valueScales.length = 0;
        for (i = 0; i < scalesState.length; i++) {
            let scale = new ValueScaleImplementation({chart: this});

            valueScales.push(scale);
            scale.loadState(scalesState[i]);
        }
        if (valueScales.length === 0)
            valueScales.push(new ValueScaleImplementation({chart: this}));
    }

    /**
     * Starts new user drawing.
     * @method startUserDrawing
     * @param {Drawing} drawing The new user drawing object.
     * @memberOf Chart#
     * @see [cancelUserDrawing]{@linkcode Chart#cancelUserDrawing} to cancel user drawing.
     * @example
     *  var line = new LineSegmentDrawing();
     *  chart.startUserDrawing(line);
     */
    startUserDrawing(drawing: Drawing) {
        switch (this.state) {
            case ChartState.USER_DRAWING:
                this.cancelUserDrawing();
                break;
            case ChartState.NORMAL:
                break;
            default:
                throw new Error("Unable to start user drawing in this chart state.");
        }

        this.lastUsedDrawingClassName = drawing.className;

        this.state = ChartState.USER_DRAWING;
        this.selectObject(null);
        drawing.startUserDrawing();
        this.selectedObject = drawing;

        this.fireValueChanged(ChartEvent.USER_DRAWING_STARTED, drawing);
    }

    /**
     * Cancels user drawing.
     * @method cancelUserDrawing
     * @memberOf Chart#
     * @see [startUserDrawing]{@linkcode Chart#startUserDrawing} to start user drawing.
     * @example
     *  chart.cancelUserDrawing();
     */
    cancelUserDrawing() {
        if (this.state === ChartState.USER_DRAWING) {
            let panel: ChartPanel = this._selectedObject.chartPanel;
            if (panel) {
                //NK in this case we do not have to check if the selected object is plot or drawing because the chart on USER_DRAWING state
                panel.deleteDrawings(this._selectedObject as Drawing);
            }

            this.selectObject(null);
            this.state = ChartState.NORMAL;
            this.checkContinuousDrawing();
        }
    }

    _finishUserDrawing(drawing:Drawing) {
        this.state = ChartState.NORMAL;
        this.checkContinuousDrawing();
        this.fireTargetValueChanged(drawing, ChartEvent.USER_DRAWING_FINISHED);
    }

    enableContinuousDrawing() {
        this.continuousDrawing = true;
    }

    disableContinuousDrawing() {
        this.continuousDrawing = false;
        this.cancelUserDrawing();
    }

    /**
     * Marks that auto-scaling needs to be performed on next layout (affects all scales, including date scale).
     * @method setNeedsAutoScaleAll
     * @memberOf Chart#
     */
    setNeedsAutoScaleAll() {
        this._dateScale.setNeedsAutoScale();
        this._chartPanelsContainer.setNeedsAutoScale();
    }

    /**
     * Determines whether chart is in 'full window' mode.
     * @name isInFullWindowMode
     * @type {boolean}
     * @memberOf Chart#
     * @see [toggleFullWindow]{@linkcode Chart#toggleFullWindow} to enter/exit 'full window' mode.
     */
    get isInFullWindowMode(): boolean {
        return !!this._preFullWindowSize;
    }

    /**
     * Enters/Exits full window mode.
     * @method toggleFullWindow
     * @memberOf Chart#
     */
    toggleFullWindow() {
        if (this.isInFullWindowMode) {
            this._container.removeClass(Class.FULL_WINDOW);
            this.size = this._preFullWindowSize;
            this._preFullWindowSize = null;
            this.setNeedsUpdate();
        } else {
            this._preFullWindowSize = this.size;
            this._container.addClass(Class.FULL_WINDOW);
            this._handleFullWindowResize();
        }
    }

    resizeCanvas() {
        if (!this.isInFullWindowMode) {

            /*****************************Handle Exception************************/
            /*Container Element is null*/
            /*Exception Message: cannot read property style of null */
            if (!document.getElementById(this._container.attr('id'))) {
                return;
            }
            /*********************************************************************/

            let styleWidth = document.getElementById(this._container.attr('id')).style.width;
            let styleHeight = document.getElementById(this._container.attr('id')).style.height;

            // MA Original logic was taking width and height from container. We added capability to pass them
            // during style and use them instead (needed for better controlling).

            let width: number = this._container.innerWidth();
            let height: number = this._container.innerHeight();

            if (styleWidth != "" && styleWidth != "auto") {
                width = parseInt(styleWidth.replace('px', ''));
            }

            if (styleHeight != "" && styleHeight != "auto") {
                height = parseInt(styleHeight.replace('px', ''));
            }

            this.size = {
                width: width - 2,
                height: height - this._rootDiv.position().top - 2
            };
            this.setNeedsUpdate();

        }
    }

    setNeedsLayout() {
        // TODO: to be implemented.
        this.layout();
    }

    /**
     * Layouts chart elements.
     * @method layout
     * @memberOf Chart#
     */
    layout() {
        let frame = this.getBounds();

        // Calculate chart panels frame.
        let panelsFrame = this._dateScale.layoutScalePanel(frame);
        this._chartPanelsFrame = this._chartPanelsContainer.layoutScalePanel(panelsFrame);

        // Layout date scales
        let dateScaleFrame = new Rect({
            left: panelsFrame.left,
            top: frame.top,
            width: panelsFrame.width,
            height: frame.height
        });
        let dateScaleProjectionFrame = new Rect({
            left: this._chartPanelsFrame.left,
            top: frame.top,
            width: this._chartPanelsFrame.width,
            height: frame.height
        });
        this._dateScale.layout(dateScaleFrame, dateScaleProjectionFrame);

        // Layout chart panels, value scales, etc..
        this._chartPanelsContainer.layout(this._chartPanelsFrame);

        this._crossHair.layout();
    }


    /**
     * Draws chart.
     * @method draw
     * @memberOf Chart#
     */
    draw() {
        this._dateScale.draw();
        this._chartPanelsContainer.draw();
    }

    /**
     * Layouts and draws chart.
     * @method update
     * @memberOf Chart#
     */
    update() {
        this._updatePriceStylePlotDataSeriesIfNeeded();
        this.layout();
        this.draw();
    }

    setNeedsUpdate(needsAutoScale?: boolean) {
        if (needsAutoScale)
            this.setNeedsAutoScale();

        this._updateAnimation.start();
    }

    _onUpdateAnimationCallback() {
        this.update();
    }

    updateSplitter(splitter: ChartPanelSplitter) {
        this._chartPanelsContainer.layoutSplitterPanels(splitter);
    }

    destroy() {
        if (this._container)
            this._container.remove();
        $(window).off("resize.scx keydown.scx");
    }

    _updatePriceStylePlotDataSeriesIfNeeded() {
        this.mainPanel.updatePriceStylePlotDataSeriesIfNeeded();
    }

    showWaitingBar(config: IWaitingBarConfig) {
        if (!this._waitingBar) {
            this._waitingBar = this._container.scx().waitingBar();
        }
        this._waitingBar.show(config);
    }

    hideWaitingBar() {
        if (this._waitingBar) {
            this._waitingBar.hide();
            this._waitingBar = null;
        }
    }

    _handleWindowResize(event: JQueryEventObject) {
        let self = event.data;
        if (self.isInFullWindowMode)
            self._handleFullWindowResize();
    }

    _handleKeyDown(event: JQueryEventObject) {
        let self = event.data,
            ctrlDown = event.ctrlKey || event.metaKey; // Mac support;

        if (!self.keyboardEventsEnabled)
            return;
        if (event.target !== document.body || $(event.target).hasClass('modal-open'))
            return;

        switch (event.keyCode) {
            case 107: // +
                self.zoomOnPixels(0.05 * self.size.width);
                break;
            case 109: // -
                self.zoomOnPixels(-0.05 * self.size.width);
                break;
            case 37: // Arrow Left
                self.scrollOnPixels(0.05 * self.size.width);
                break;
            case 39: // Arrow Right
                self.scrollOnPixels(-0.05 * self.size.width);
                break;
            case 46: { // Delete
                let selectedObj = self.selectedObject;
                let panel: ChartPanel = selectedObj && selectedObj.chartPanel;
                if (!panel)
                    return;

                if (selectedObj instanceof Drawing) {
                    panel.deleteDrawings(selectedObj);
                }

                break;
            }
            case 67: { //C Key
                if (ctrlDown) {
                    //Ctl + C
                    self._copyDrawing((<Drawing>this.selectedObject));
                }
                break;
            }
            case 86: { //V Key
                if (ctrlDown) {
                    //Ctl + V
                    self._pasteDrawing();
                }
                break;
            }
            default:
                return;
        }
        self.setNeedsUpdate(true);

        event.preventDefault();
    }

    _copyDrawing(drawing: Drawing ): void {
        if (drawing) {
            this._copyBuffer = drawing.clone();
            this._copyBuffer.chartPanel = drawing.chartPanel;
        }
    }

    _pasteDrawing(): void {
        if (this._copyBuffer) {
            this._copyBuffer.chartPanel.addDrawings(this._copyBuffer);
            this._copyBuffer.translate(20, 20);
            this._copyBuffer.chartPanel.setNeedsUpdate();
            let copyBufferPanel: ChartPanel = this._copyBuffer.chartPanel;
            this._copyBuffer = this._copyBuffer.clone();
            this._copyBuffer.chartPanel = copyBufferPanel;
        }
    }

    _handleMouseEvents(event: JQueryEventObject): boolean {
        let self = event.data,
            origEvent = <JQueryEventObject> event.originalEvent,
            clientX = event.pageX !== undefined ? event.pageX : origEvent.pageX,
            clientY = event.pageY !== undefined ? event.pageY : origEvent.pageY,
            changedTouches = origEvent && (<TouchEvent> event.originalEvent).changedTouches;
        if (!clientX && !clientY && changedTouches && changedTouches.length > 0) {
            let lastTouch = changedTouches[changedTouches.length - 1];

            clientX = lastTouch.pageX;
            clientY = lastTouch.pageY;
        }
        let eventObj = <WindowEvent> {
            pointerPosition: self._rootDiv.scxClientToLocalPoint(clientX, clientY),
            evt: event
        };

        self._updateHoverRecord.call(self, eventObj.pointerPosition.x);

        if (!self._dateScale.handleEvent(eventObj))
            self._chartPanelsContainer.handleEvent(eventObj);

        // NK Kill mouse and touch events to prevent zooming on iPad, iPhone and iPod
        if(BrowserUtils.isMobile()) {
            switch (event.type) {
                case MouseEvent.CLICK:
                case MouseEvent.DOWN:
                case TouchEvent.START:
                case TouchEvent.END:
                    if (!eventObj.stopPropagation)
                        return;
            }
            event.preventDefault();
            event.stopPropagation();
            return false;
        }

        // MA Don't kill mouse events, as it may be used to resize the chart (from the grid)
        // switch (event.type) {
        //     case 'click':
        //     case 'mousedown':
        //     case 'touchstart':
        //     case 'touchend':
        //         if (!eventObj.stopPropagation)
        //             return;
        // }
        // event.preventDefault();
        // event.stopPropagation();
        // return false;
        return true;
    }

    /**
     * Saves chart as image with given size.
     * @method saveImage
     * @param {CanvasImageCallback} [saveCallback] The callback for custom saving.
     * @param {ISize} [screenshotCanvasSize] the size of the image.
     * @memberOf Chart#
     */
    saveImageWithSize(saveCallback: ICanvasImageCallback, screenshotCanvasSize: ISize) {

        $(this._rootDiv).addClass('thumbnail-screenshot');

        html2canvas(this._rootDiv.get(0), {
            onrendered: (canvas: HTMLCanvasElement) => {

                $(this._rootDiv).removeClass('thumbnail-screenshot');

                let screenshotCanvas:HTMLCanvasElement =<HTMLCanvasElement>document.createElement("canvas");

                let widthResizeRatio = screenshotCanvasSize.width / this.size.width;
                let heightResizeRatio = screenshotCanvasSize.height / this.size.height;
                let resizeRatio = Math.min(widthResizeRatio, heightResizeRatio);

                let borderFactor = 0.95;
                let screenshotWidth = Math.floor(borderFactor * this.size.width * resizeRatio);
                let screenshotHeight = Math.floor(borderFactor * this.size.height * resizeRatio);

                screenshotCanvas.setAttribute('width', screenshotCanvasSize.width.toString());
                screenshotCanvas.setAttribute('height', screenshotCanvasSize.height.toString());

                let ctx = screenshotCanvas.getContext('2d');
                ctx.fillStyle = "#888";
                ctx.fillRect(0, 0, screenshotCanvas.width, screenshotCanvas.height); // set background color

                let xCenterOffset = Math.floor( (screenshotCanvasSize.width - screenshotWidth) / 2);
                let yCenterOffset = Math.floor( (screenshotCanvasSize.height - screenshotHeight) / 2);

                ctx.drawImage(canvas,0, 0,canvas.width, canvas.height,xCenterOffset,yCenterOffset,screenshotWidth, screenshotHeight);

                if (saveCallback) {
                    saveCallback(screenshotCanvas);
                }
                else {
                    // works for all except IE
                    let fileName = "Chart.png";
                    let imageData = screenshotCanvas.toDataURL().replace(/^data:image\/[^;]/, "data:application/octet-stream");
                    let a: HTMLAnchorElement = document.createElement("a");
                    a.download = fileName;
                    a.href = imageData;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
            }
        });
    }

    public resetDefaultSettings():void {
        ChartAccessorService.instance.setThemeDefaultSettings(null);
        this._options.theme = $.extend(true, {}, this.getDefaultTheme());
        this.theme = this._options.theme;
    }

    private getDefaultTheme() {
        return this._themeType == ThemeType.Light ? Theme.Light : Theme.Dark;
    }

    public saveAsDefaultSettings():void {
        ChartAccessorService.instance.setThemeDefaultSettings(this._options.theme);
    }


    public applyDarkTheme():void {
        this._options.theme = $.extend(true, {}, Theme.Dark);
        this.theme = this._options.theme;
    }

    public applyLightTheme():void {
        this._options.theme = $.extend(true, {}, Theme.Light);
        this.theme = this._options.theme;
    }

    _loadOptionsState(optionsOrConfig: ChartOptions | IChartConfig) {

        let options = (optionsOrConfig as ChartOptions) || <ChartOptions> {};

        this._options = {
            theme: options.theme || $.extend(true, {}, this.getDefaultTheme()) ,
            locale: options.locale || 'en-GB',
            enableKeyboardEvents: options.enableKeyboardEvents !== undefined ? !!options.enableKeyboardEvents : true,
            showBarInfoInTitle: options.showBarInfoInTitle !== undefined ? !!options.showBarInfoInTitle : true,
            showPanelOptions: options.showPanelOptions !== undefined ? options.showPanelOptions : true,
            magnetRatio: options.magnetRatio !== undefined ? options.magnetRatio : 0
        };

        // MA update "stored" theme with any changes done on the default code theme (for backward compatibility).
        ThemeUtils.mapThemeValuesForBackwardCompatibility(this._options.theme, this.getDefaultTheme())

    }

    _layoutHtmlElements(width: number, height: number) {
        this._container.addClass(Class.ROOT_CONTAINER);
        this._rootDiv = this._container.scxAppend('div', Class.CONTAINER).addClass(Class.UN_SELECTIVE)
            .width(width)
            .height(height);

        this._rootDiv.scxAppend('div', Class.BACKGROUND)
            .width(width)
            .height(height);
    }

    _applyTheme() {
        let theme = this.theme,
            chartTheme = theme.chart;

        // Chart background
        let backColors = chartTheme.background,
            background: string;
        if (Array.isArray(backColors)) {
            if (backColors.length == 0)
                throw new Error("Invalid theme: 'background' must be a color or array of colors.");

            // MA if we have a single color or two colors the same, then use normal background (single color)
            if (backColors.length == 1 || (backColors.length == 2 && backColors[0] == backColors[1])) {
                background = backColors[0];
            } else {
                // MA linear-gradient settings doesn't work with html2canvas used to get a screenshot for the chart
                background = 'linear-gradient(to top, ' + backColors.join(', ') + ')';
            }
        } else {
            background = backColors;
        }

        this._container.find('.' + Class.BACKGROUND).css('background', background);

        // Chart border
        let border = chartTheme.border;
        this._container.find('.' + Class.CONTAINER).css('border', border.width + 'px ' + border.lineStyle + ' ' + border.strokeColor);

        this._container.find('.' + Class.CONTAINER).removeClass('dark-theme light-theme');
        this._container.find('.' + Class.CONTAINER).addClass(this._themeType == ThemeType.Light ? 'light-theme' : 'dark-theme');

        this._valueMarker.theme = theme.valueScale.valueMarker;

    }

    _subscribeEvents(readOnly: boolean) {
        let events = [
            MouseEvent.ENTER,
            MouseEvent.LEAVE,
            MouseEvent.DOWN,
            MouseEvent.MOVE,
            MouseEvent.UP,
            MouseEvent.CLICK,
            MouseEvent.DOUBLE_CLICK,
            MouseEvent.WHEEL,
            MouseEvent.SCROLL,
            MouseEvent.CONTEXT_MENU,
            TouchEvent.START,
            TouchEvent.MOVE,
            TouchEvent.END,
            ''
        ];

        // MA for element build, disable scrolling events (similar to TradingView) in order for chart scrolling not to interfere
        // with external page scrolling.
        if(Config.isElementBuild()) {
            events = [
                MouseEvent.ENTER,
                MouseEvent.LEAVE,
                MouseEvent.DOWN,
                MouseEvent.MOVE,
                MouseEvent.UP,
                MouseEvent.CLICK,
                MouseEvent.DOUBLE_CLICK,
                TouchEvent.START,
                TouchEvent.MOVE,
                TouchEvent.END,
                ''
            ];
        }

        if (readOnly) {
            events = [MouseEvent.MOVE]; // only allow mousemove, to show "crosshair"
        }

        this._rootDiv.on(events.join('.scx, '), this, this._handleMouseEvents);
        $(window)
            .on("resize.scx", this, this._handleWindowResize)
            .on("keydown.scx", this, this._handleKeyDown);
    }

    _updateHoverRecord(x: number) {
        let record = this._dateScale.projection.recordByX(x);

        if (record != this._hoverRecord) {
            this._hoverRecord = record;
            this.fireValueChanged(ChartEvent.HOVER_RECORD_CHANGED, record);
        }
    }

    _handleFullWindowResize() {
        this._container.outerWidth(window.innerWidth - 3).outerHeight(window.innerHeight - 3);
        this.size = {
            width: this._container.innerWidth() - 1,
            height: this._container.innerHeight() - this._rootDiv.position().top - 1
        };
        this.setNeedsUpdate();
    }

    /**
     * Returns bar data series.
     * @method barDataSeries
     * @returns {BarDataSeries} An object with date, open, high, low, close, volume properties.
     * @memberOf Chart#
     * @example
     *  var obj = chart.barDataSeries();
     *  var dates = obj.date;       // Date data series
     *  var opens = obj.open;       // Open data series
     *  var highs = obj.high;       // High data series
     *  var lows = obj.low;         // Low data series
     *  var closes = obj.close;     // Close data series
     *  var volumes = obj.volume;   // Volume data series
     */
    barDataSeries(): IBarDataSeries {
        return this._dataManager.barDataSeries();
    }

    /**
     * Returns bar data series.
     * @method getCommonDataSeries
     * @returns {BarDataSeries}
     * @memberOf Chart#
     * @deprecated since version 2.12.4
     */
    getCommonDataSeries(): IBarDataSeries {
        return this.barDataSeries();
    }

    /**
     * Adds data series into the data manager.
     * @method addDataSeries
     * If you specify data series name a new data series will be created and added.
     * @param {String | DataSeries} dataSeries The data series name or data series object.
     * @param {Boolean} [replaceIfExists = false] Determines whether existing data series with the same name should be replace or an exception should be thrown.
     * @returns {DataSeries} The data series that has been added.
     * @memberOf Chart#
     * @example
     *  // Add existing data series.
     *  chart.addDataSeries(new DataSeries("OpenInterest"));
     *
     *  // Add new data series with a given name.
     *  chart.addDataSeries("OpenInterest2");
     *
     *  // Add/Replace data series.
     *  chart.addDataSeries("OpenInterest", true);
     */
    addDataSeries(dataSeries: string | DataSeries, replaceIfExists?: boolean): DataSeries {
        return this._dataManager.addDataSeries(dataSeries, replaceIfExists);
    }

    /**
     * Removes given data series. Removes all data series if parameter is omitted.
     * @method removeDataSeries
     * @param {String | DataSeries} [dataSeries] The data series object or data series name.
     * @memberOf Chart#
     * @example
     *  chart.removeDataSeries('OpenInterest'); // Removes 'OpenInterest' data series.
     *  chart.removeDataSeries();               // Removes all data series.
     */
    removeDataSeries(dataSeries: string | DataSeries) {
        this._dataManager.removeDataSeries(dataSeries);
    }

    /**
     * Removes all values from a given data series. Clears all values in all data series if parameter is omitted.
     * @method clearDataSeries
     * @param {String | DataSeries} [dataSeries] The data series name or data series object.
     * @memberOf Chart#
     */
    clearDataSeries(dataSeries: string | DataSeries) {
        this._dataManager.clearDataSeries(dataSeries);
    }

    /**
     * Trims all data series to a given maximum length.
     * @method trimDataSeries
     * @param {number} maxLength The new maximum length of data series.
     * @memberOf Chart#
     */
    trimDataSeries(maxLength: number) {
        this.dataManager.trimDataSeries(maxLength);
    }

    /**
     * Returns data series with a given name.
     * @method getDataSeries
     * @param {String} name The data series name.
     * @returns {DataSeries}
     * @memberOf Chart#
     * @example
     *  var dataSeries = chart.getDataSeries("OpenInterest");
     */
    getDataSeries(name: string): DataSeries {
        return this._dataManager.getDataSeries(name);
    }

    primaryDataSeries(suffix: string, symbol: string = ''): DataSeries {
        let priceStyleSuffix = this.priceStyle.primaryDataSeriesSuffix(suffix),
            dsName = symbol + priceStyleSuffix + suffix;

        return this.getDataSeries(dsName);
    }

    primaryBarDataSeries(symbol?: string): IBarDataSeries {
        let dsSuffix = DataSeriesSuffix;

        return {
            date: this.primaryDataSeries(dsSuffix.DATE, symbol),
            open: this.primaryDataSeries(dsSuffix.OPEN, symbol),
            high: this.primaryDataSeries(dsSuffix.HIGH, symbol),
            low: this.primaryDataSeries(dsSuffix.LOW, symbol),
            close: this.primaryDataSeries(dsSuffix.CLOSE, symbol),
            volume: this.primaryDataSeries(dsSuffix.VOLUME, symbol)
        };
    }

    /**
     * Finds data series with a given suffix.
     * @method findDataSeries
     * @param {String} suffix The data series suffix.
     * @returns {DataSeries}
     * @memberOf Chart#
     * @example
     *  var dataSeries = chart.findDataSeries(OPEN_DATA_SERIES_SUFFIX);
     */
    findDataSeries(suffix: string): DataSeries {
        return this._dataManager.findDataSeries(suffix);
    }

    /**
     * Appends values from single bar or an array of bars into the corresponding data series.
     * @method appendBars
     * @param {Bar | Bar[]} bars The single bar or an array of bars.
     * @memberOf Chart#
     * @example
     *  // Append 1 bar
     *  chart.appendBars({
         *      date: new Date(),
         *      open: 100.0,
         *      high: 101.0,
         *      low: 99.0,
         *      close: 100.5,
         *      volume: 200
         *  });
     *
     *  // Append 2 bars
     *  chart.appendBars({
         *  [
         *      {
         *          date: new Date(),
         *          open: 100.0,
         *          high: 101.0,
         *          low: 99.0,
         *          close: 100.5,
         *          volume: 200
         *      },
         *      {
         *          date: new Date(),
         *          open: 100.5,
         *          high: 101.0,
         *          low: 100.0,
         *          close: 100.2,
         *          volume: 300
         *      }
         *  ]
         *  });
     */
    appendBars(bars: IBar | IBar[]) {
        this._dataManager.appendBars(bars);
    }

    /**
     * Adds new chart panel.
     * @method addChartPanel
     * @param {Number} [index] The index to insert panel at.
     * @param {Number} [heightRatio] The height ratio of new panel. The value in range (0..1).
     * @param {Boolean} [shrinkMainPanel] True to shrink main panel, false to shrink all panels.
     * @returns {ChartPanel} The newly created chart panel.
     * @memberOf Chart#
     * @example
     *  chart.addChartPanel();  // Add new chart panel.
     *  chart.addChartPanel(2); // Insert new chart panel at index 2.
     */
    addChartPanel(index?: number, heightRatio?: number, shrinkMainPanel?: boolean): ChartPanel {
        return this._chartPanelsContainer.addPanel(index, heightRatio, shrinkMainPanel);
    }

    /**
     * Returns chart panel at a given Y coordinate.
     * @method findPanelAt
     * @param {number} y The Y coordinate.
     * @returns {ChartPanel}
     * @memberOf Chart#
     */
    findPanelAt(y: number): ChartPanel {
        return this._chartPanelsContainer.findPanelAt(y);
    }

    /**
     * Marks that all value scales need to be auto-scaled on next layout.
     * @method setNeedsAutoScale
     * @memberOf Chart#
     */
    setNeedsAutoScale() {
        if(!this.allowsAutoScaling) {
            return;
        }
        this._chartPanelsContainer.setNeedsAutoScale();
    }

    setAllowsAutoScaling(enable: boolean): void {
        this.allowsAutoScaling = enable;
    }

    setAxisScale(axisScaleType:AxisScaleType) {
        this._chartPanelsContainer.setAxisScale(axisScaleType);
    }

    getAxisScale():AxisScaleType {
        return this._chartPanelsContainer.getAxisScale();
    }

    /**
     * Scrolls chart on a given number of pixels.
     * @method scrollOnPixels
     * @param {number} pixels The number of pixels to scroll.
     * @memberOf Chart#
     */
    scrollOnPixels(pixels: number) {
        this._dateScale.scrollOnPixels(pixels);
    }

    /**
     * Scrolls chart on a given number of records.
     * @method scrollOnRecords
     * @param {number} records The number of records to scroll.
     * @memberOf Chart#
     */
    scrollOnRecords(records: number) {
        this._dateScale.scrollOnRecords(records);
    }

    /**
     * Zooms chart on a given number of pixels.
     * @method zoomOnPixels
     * @param {number} pixels The number of pixels to zoom.
     * @memberOf Chart#
     */
    zoomOnPixels(pixels: number) {
        this._dateScale.zoomOnPixels(pixels);
    }

    /**
     * Zooms chart on a given number of records.
     * @method zoomOnRecords
     * @param {number} records The number of records to zoom.
     * @memberOf Chart#
     */
    zoomOnRecords(records: number) {
        this._dateScale.zoomOnRecords(records);
    }

    /**
     * Zooms chart on a given number of pixels.
     * @method handleZoom
     * @param {number} pixels The number of pixels to zoom.
     * @memberOf Chart#
     */
    handleZoom(pixels: number) {
        this._dateScale._handleZoom(pixels);
    }

    /**
     * Updates visible range to show records in a given range.
     * @method recordRange
     * @param {number} firstRecord The first record to show. Or number of last records to show if second argument is omitted.
     * @param {number} [lastRecord] The last record to show.
     * @memberOf Chart#
     */
    recordRange(firstRecord: number, lastRecord?: number) {
        if (firstRecord == null && lastRecord == null) {
            return {
                firstVisibleRecord: this.firstVisibleRecord,
                lastVisibleRecord: this.lastVisibleRecord
            };
        }

        let count = this.recordCount;

        if (lastRecord == null) {
            // Show last n records.
            let records = firstRecord;

            if (!JsUtil.isFiniteNumber(records) || records <= 0)
                throw new TypeError("Positive number expected.");

            this.firstVisibleRecord = Math.max(count - records, 0);
            this.lastVisibleRecord = count - 1;
        } else {
            if (!JsUtil.isFiniteNumber(firstRecord) || firstRecord < 0)
                throw new TypeError("First record must be a positive number or 0.");
            if (!JsUtil.isFiniteNumber(lastRecord))
                throw new TypeError("Last record must be a positive number.");
            if (lastRecord <= firstRecord)
                throw new Error("Last record must be greater than first record.");

            this.firstVisibleRecord = firstRecord;
            this.lastVisibleRecord = lastRecord;
        }
    }

    /**
     * Updates visible range to show values in a given date range.
     * @method dateRange
     * @param {Date} [startDate] The start date.
     * @param {Date} [endDate] The end date.
     * @memberOf Chart#
     */
    dateRange(startDate?: Date, endDate?: Date) {
        let dateScale = this.dateScale,
            projection = dateScale.projection;

        if (!startDate && !endDate) {
            let frame = dateScale.projectionFrame;

            return {
                startDate: projection.dateByX(frame.left),
                endDate: projection.dateByX(frame.right)
            };
        }

        let firstRecord = projection.recordByX(projection.xByDate(startDate, false), false),
            lastRecord = projection.recordByX(projection.xByDate(endDate, false), false);

        this.firstVisibleRecord = firstRecord;
        this.lastVisibleRecord = lastRecord - 1;
    }

    updateComputedDataSeries() {
        this.priceStyle.updateComputedDataSeries();
    }

    /* Zooming tool methods */

    startZooming() {
        if (this.isZooming()) {
            return;
        }
        this._state = ChartState.ZOOMING;
        this._zoomTool.startZooming();
    }

    finishZooming() {
        this._state = ChartState.NORMAL;
        this.setNeedsUpdate();
    }

    isZooming() {
        return this._state == ChartState.ZOOMING;
    }

    cancelZoomingIfNeeded() {
        if (this._state == ChartState.ZOOMING) {
            this._zoomTool.finishZoomingWithoutEvent();
        }
    }

    /* Measurement tool methods */

    startMeasuring(): void {
        if (this.isMeasuring()) {
            return;
        }
        this._state = ChartState.MEASURING;
        this._measurementTool.startMeasuring();
    }

    finishMeasuring(): void {
        this._state = ChartState.NORMAL;
        this.setNeedsUpdate();
    }

    isMeasuring(): boolean {
        return this._state == ChartState.MEASURING;
    }

    cancelMeasuringIfNeeded(): void {
        if (this._state == ChartState.MEASURING) {
            this._measurementTool.finishMeasuring();
            this.finishMeasuring();
        }
    }

    onData(priceData: { time: string, open: number, high: number, low: number, close: number, volume: number }[], zoomStartDate: string, maintainZoom: boolean, zoomRange: { start: Date, end: Date }, splits: { value: number, date: string }[], showBonusShares: boolean): void {

        // MA clear any previous data before adding new one
        this.dataManager.clearDataSeries();

        this.fillMainDataSeries(priceData);
        this.updateComputedDataSeries();
        this.setNeedsAutoScaleAll();
        this.dateScale.zoomed = false;

        // MA When zooming is currently broken?
        // Assume you have 3 companies, A, B, C. Company B has data less than A and C
        // 1) User zoom on company A
        // 2) User goes to company B that has data less than zooming range. Zooming is "canceled"
        // 3) User goes to company C, getting that Zooming is cancelled and therefore, showing all the data
        //    for company C for the selected period. The zooming that was done for company A is discarded.
        //
        // This behaviour could be improved by adding more state. However, for complexity-vs-value, we think
        // current implementation should be an OK tradeoff

        // MA apply any needed zooming after filling data
        if (priceData.length) {
            if (this.canApplySavedZoom(maintainZoom, zoomRange, priceData[0].time)) {
                this.applySavedSpace(zoomRange);
                this.dateScale.zoomed = true; // mark data scale as "zoomed"
            } else {
                this.applySelectedPeriodZoom(priceData, zoomStartDate);
            }
        }

        showBonusShares ? this.addSplitsAnnotation(splits) : this.addSplitsAnnotation([]);

        this.setAllowsAutoScaling(true);
        this.setNeedsAutoScale();
        this.updateIndicators();
        this.update();
    }

    private periodZoomCounterForMobile:number = -1;
    resetToPeriodDefaultZoomForMobile(){
        if(BrowserUtils.isMobile()) {
            if(this.periodZoomCounterForMobile !== -1) {
                this.addExtraSpaceRightOfChart(this.periodZoomCounterForMobile);
                this.setNeedsUpdate(true);
            }
        }
    }

    getIndicatorById(id: string): Indicator {
        for (let indicator of this._indicators) {
            if (indicator.id == id) {
                return indicator;
            }
        }

        return null;
    }

    updateCustomSourceIndicators(sourceIndicatorId: string) {
        let indicatorsDependsOnAnotherIndicator: Indicator[] = this.getIndicatorsThatDependOnAnotherIndicator(sourceIndicatorId);

        for (let indicator of indicatorsDependsOnAnotherIndicator) {
            indicator.update();
        }
    }

    removeChildIndicators(sourceIndicatorId: string) {
        let indicatorsDependsOnAnotherIndicator: Indicator[] = this.getIndicatorsThatDependOnAnotherIndicator(sourceIndicatorId);
        this.removeIndicators(indicatorsDependsOnAnotherIndicator);
    }

    moveIndicatorIndexToEnd(indicator: Indicator) {
        this._indicators.push(this._indicators.splice(this._indicators.indexOf(indicator), 1)[0]);
    }

    /* Date scale options */

    toggleDateScaleGridSessionLinesVisibility() {
        this.dateScale.showGridSessionLines = !this.dateScale.showGridSessionLines;
        this.setNeedsUpdate();
    }

    isVisibleDateScaleGridSessionLines(): boolean {
        return this.dateScale.showGridSessionLines;
    }

    /* Custom chart panel object*/

    private addCustomChartPanelObject(type: ChartAnnotationType, date: string, data: number | TradingOrder | CategoryNews, isBelowCandle: boolean) {

        let customObject: ChartAnnotation;

        switch (type) {
            case ChartAnnotationType.Split:
                customObject = new SplitChartAnnotation(this, {type: type, splitValue: data as number, date: date, belowCandle: isBelowCandle});
                break;
            case ChartAnnotationType.TradingOrder:
                customObject = new TradingOrderChartAnnotation(this, {type: type, order: data as TradingOrder, date: date, belowCandle: isBelowCandle});
                break;
            case ChartAnnotationType.News:
                customObject = new NewsChartAnnotation(this, {type: type, categoryNews: data as CategoryNews, date: date, belowCandle: isBelowCandle});
                break;
            default:
                throw new Error('unknown annotation type : ' + type);
        }

        customObject.setPanel(this.mainPanel);
        this.customChartPanelObjectsManager.register(customObject);

    }


    private addExecutedOrders(executedOrders:TradingOrder[]) {
        this.customChartPanelObjectsManager.removeByType(ChartAnnotationType.TradingOrder);
        for (let order of executedOrders) {
            let isBelowCandle = order.side.type == TradingOrderSideType.BUY;
            // MA not all brokers provide executionTime, as in Derayah, and therefore, we don't then show the order annotation
            // on the chart.
            if(order.executionTime) {
                this.addCustomChartPanelObject(ChartAnnotationType.TradingOrder, order.executionTime, order, isBelowCandle);
            }
        }
    }

    private addSplitsAnnotation(splits: { value: number, date: string }[]) {
        this.customChartPanelObjectsManager.removeByType(ChartAnnotationType.Split);
        for (let split of splits) {
            this.addCustomChartPanelObject(ChartAnnotationType.Split, split.date, split.value, false);
        }
    }

    private addNews(newsList: CategoryNews[]) {
        this.customChartPanelObjectsManager.removeByType(ChartAnnotationType.News);
        for (let news of newsList) {
            this.addCustomChartPanelObject(ChartAnnotationType.News, news.date, news, false);
        }
    }

    /* Object tree */

    getDrawingById(id: string): Drawing {
        for (let panel of this.chartPanels) {
            let index: number = -1;
            for (let i = 0; i < panel.drawings.length; i++) {
                let drawing = panel.drawings[i];
                if (drawing.id == id) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                return panel.drawings[index];
            }
        }
        throw new Error('cannot find drawing with the provided id ' + id);
    }

    updateDrawingsLocking(locked: boolean): void {
        for (let panel of this.chartPanels) {
            for (let drawing of panel.drawings) {
                drawing.locked = locked;
            }
        }
    }

    private getIndicatorsThatDependOnAnotherIndicator(sourceIndicatorId: string): Indicator[] {
        let indicatorsDependsOnAnotherIndicator: Indicator [] = [];

        for (let item of this._indicators) {
            if (item.customSourceIndicatorId == sourceIndicatorId) {
                indicatorsDependsOnAnotherIndicator.push(item);
            }
        }
        return indicatorsDependsOnAnotherIndicator;
    }

    private canApplySavedZoom(maintainZoom: boolean, zoomRange: { start: Date, end: Date }, firstPriceDataDate: string): boolean {
        if (maintainZoom && zoomRange) {
            // NK we can not apply saved zoom unless the first date in the data is less than the saved zoom to avoid buggy behavior
            // while we are switching between companies and get company that contains data less than the previous one
            if (new Date(firstPriceDataDate) < zoomRange.start) {
                return true;
            }
        }
        return false;
    }

    getValueByGlobalPoint(x: number, y: number) {
        let localPoint = this._rootDiv.scxClientToLocalPoint(x, y);
        let panel = this.chartPanelsContainer.findPanelAt(localPoint.y);
        return panel.projection.valueByY(localPoint.y - panel.frame.top);
    }

    getPanelIndexByGlobalPoint(x: number, y: number): number {
        let localPoint = this._rootDiv.scxClientToLocalPoint(x, y);
        let panel = this.chartPanelsContainer.findPanelAt(localPoint.y);
        return panel.getIndex();
    }

    onVisibilityChanged():void {
        // NK when chart visibility change, we should insure that the chart has rendered correctly.
        // In some cases when we load the application on page that does not have a chart
        // and move to another page that has one, we faced wrong behavior on rendering the cross hair and the value scale labels.
        // So we are forcing the chart and the cross hair to update themselves on every visibility change.

        // HA : if we set it (setNeedsUpdate) indicator scale will appear empty .
        // to show it : go to page that does not have a chart then connect or disconnect with trading broker then go back to page that have chart , the scale of
        // indicator panel will appear empty .(market must be closed)
        this.update();
        this.crossHair.update();
    }

    private fillMainDataSeries(priceData: { time: string, open: number, high: number, low: number, close: number, volume: number }[]) {
        let barDataSeries = this.barDataSeries();
        priceData.forEach((pData) => {
            // MA if cut off date is set, then don't load data beyond it
            if (!this.cutOffDataIsLoaded() && this._cutOffDate && this._cutOffDate < pData.time) {
                return;
            }
            let date = moment(pData.time).toDate();
            barDataSeries.date.add(date);
            barDataSeries.open.add(pData.open);
            barDataSeries.high.add(pData.high);
            barDataSeries.low.add(pData.low);
            barDataSeries.close.add(pData.close);
            barDataSeries.volume.add(pData.volume);
        });
    }

    private applySelectedPeriodZoom(priceData: { time: string, open: number, high: number, low: number, close: number, volume: number }[], zoomStartDate: string) {
        let zoomCounter = 0;
        priceData.forEach((pData) => {
            if (zoomStartDate <= pData.time) {
                zoomCounter += 1;
            }
        });

        if (zoomCounter) {
            this.periodZoomCounterForMobile = zoomCounter;
            this.recordRange(zoomCounter);
            // HA : we need this direct update , if i set it (setNeedsUpdate) the extra space right of chart will not always be there especially when open new chart .
            this.update();
            this.addExtraSpaceRightOfChart(zoomCounter);
        }
    }

    private applySavedSpace(zoomRange: { start: Date, end: Date }): void {
        this.dateRange(zoomRange.start, zoomRange.end);
    }

    private addExtraSpaceRightOfChart(zoomCounter: number): void {
        let additionalRecords: number = this.getAdditionalNeededRecords();
        if (additionalRecords) {
            this.recordRange(zoomCounter + additionalRecords);
            this.scrollOnRecords(-additionalRecords);
            this.dateScale.zoomed = false;
        }
    }

    private getAdditionalNeededRecords(): number {
        let columnsCount = this.dateScale.columnsCount;
        let additionalRecords = 0;
        if (columnsCount <= 20) {
            additionalRecords = 2;
        } else {
            additionalRecords = 2 * (columnsCount / 20);
        }

        return additionalRecords;
    }

    private checkContinuousDrawing() {
        if (this.continuousDrawing) {
            this.startUserDrawing(Drawing.deserialize(this, {className: this.lastUsedDrawingClassName}));
        }
    }

    private isValidDrawingChartPoints(drawing: Drawing) {
        for (let point of drawing.chartPoints) {

            // MA We added xPercent and yPercent points for Fixed drawings. For those points, skip the below
            // validation that is done to ensure value & date are correct (doesn't apply to fixed points)
            if(!point.isPercentBasedChartPoint()) {
                let validDate = point.date && moment(point.date).isValid();
                let validValue = !isNaN(point.value);
                if (!validDate || !validValue)
                    return false;
            }

        }

        return true;
    }

    private addArrayOfIndicators(indicators: Indicator[]): Indicator[] {
        let addedIndicators: Indicator[] = [];
        let customSourceIndicators: Indicator [] = [];

        for (let item of indicators) {
            if (item.customSourceIndicatorId) {
                // NK do not add custom source indicators now
                customSourceIndicators.push(item);
            } else {
                addedIndicators.push(this.addIndicators(item) as Indicator);
            }
        }

        // NK add all custom source indicators now after normal indicator has been added
        for (let item of customSourceIndicators) {
            addedIndicators.push(this.addIndicators(item) as Indicator);
        }

        return addedIndicators;
    }

    getChartAnnotations(): ChartAnnotation[] {
        return this.customChartPanelObjectsManager.getChartAnnotations();
    }

    // MA cutOffData is used when chart should show data up to a certain point (cut-off date).
    // initially added for "ideas" concept, as we will show data only up to the idea taken date.
    private _cutOffDate: string = null;

    setCutOffDate(cutoffDate:string):void {
        this._cutOffDate = cutoffDate;
    }

    getCutOffDate():string {
        return this._cutOffDate;
    }

    private _cutOffDataLoaded: boolean = false;

    markCutoffDataAsLoaded():void {
        this._cutOffDataLoaded = true;
    }
    cutOffDataIsLoaded():boolean {
        return this._cutOffDataLoaded;
    }

    private mapThemeForBackwardCompatibility(theme: ChartTheme) {
        ThemeUtils.mapThemeValuesForBackwardCompatibility(theme, this.getDefaultTheme())
    }

    public getThemeType():ThemeType {
        return this._themeType;
    }
}

export interface IChartState {
    chart: ChartOptions,
    priceStyle: IPriceStyleState,
    dateScale: IDateScaleState,
    valueScales: IValueScaleConfig[],
    crossHair: ICrossHairState,
    chartPanelsContainer: IChartPanelsContainerOptions,
    indicators: IIndicatorOptions[],
    drawings: IDrawingState[]
}
