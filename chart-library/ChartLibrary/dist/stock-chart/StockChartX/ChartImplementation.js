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
import '../StockChartX.UI/jQueryExtension';
import '../StockChartX.UI/scxNumericField';
import { TimeSpan } from './Data/TimeFrame';
import { EventableObject } from './Utils/EventableObject';
import { Drawing } from './Drawings/Drawing';
import { DataManager } from './Data/DataManager';
import { Rect } from './Graphics/Rect';
import { Indicator } from './Indicators/Indicator';
import { ValueMarker } from './Scales/ValueMarker';
import { PriceStyle } from './PriceStyles/PriceStyle';
import { SelectionMarker } from './SelectionMarker';
import { DataSeriesSuffix } from './Data/DataSeries';
import { Animation } from './Graphics/Animation';
import { ZoomTool } from './Tools/ZoomTool';
import { MeasurementTool } from './Tools/MeasurementTool';
import { ChartAnnotationType } from './ChartAnnotations/ChartAnnotation';
import { CandlePriceStyle } from './PriceStyles/CandlePriceStyle';
import { JsUtil } from './Utils/JsUtil';
import { IchimokuKinkoHyo, VolumeProfilerSessionVolume, VolumeProfilerVisibleRange } from '../TASdk/TASdk';
import { IchimokuIndicator } from './Indicators/IchimokuIndicator';
import { TAIndicator } from './Indicators/TAIndicator';
import { MouseEvent, TouchEvent } from './Gestures/Gesture';
import { Theme, ThemeUtils } from './Theme';
import { SplitChartAnnotation } from './ChartAnnotations/SplitChartAnnotation';
import { ChartEvent, ChartState } from './Chart';
import { ValueScaleImplementation } from './Scales/ValueScaleImplementation';
import { IndicatorDeserializer } from './Indicators/IndicatorDeserializer';
import { ChartPanelsContainerImplementation } from './ChartPanels/ChartPanelsContainerImplementation';
import { CrossHairImplementation } from './CrossHairImplementation';
import { DateScaleImplementation } from './Scales/DateScaleImplementation';
import { BrowserUtils } from '../../utils';
import { TradingOrderStatusType } from '../../services/trading/broker/models/trading-order-status';
import { TradingOrderSideType } from '../../services/trading/broker/models/trading-order-side';
import { TradingOrderChartAnnotation } from './ChartAnnotations/TradingOrderChartAnnotation';
import { ChartAnnotationsManager } from './ChartAnnotations/ChartAnnotationsManager';
import { NewsChartAnnotation } from './ChartAnnotations/NewsChartAnnotation';
import { LiquidityIndicator } from './Indicators/LiquidityIndicator';
import { IndicatorHelper } from './Indicators/IndicatorHelper';
import { VolumeProfilerSessionVolumeIndicator } from './Indicators/VolumeProfilerSessionVolumeIndicator';
import { VolumeProfilerVisibleRangeIndicator } from './Indicators/VolumeProfilerVisibleRangeIndicator';
import { ThemeType } from './ThemeType';
import { MovingAverageOptions } from './MovingAverageOptions';
import { ChartAccessorService } from "../../services/chart";
import { ChartAlertIndicator } from "../../services/alert";
var DEFAULT_WIDTH = 800;
var DEFAULT_HEIGHT = 600;
var Class = {
    ROOT_CONTAINER: 'scxRootContainer',
    CONTAINER: 'scxContainer',
    BACKGROUND: 'scxBackground',
    UN_SELECTIVE: 'scxUnSelective',
    FULL_WINDOW: 'scxFullWindow'
};
var DEFAULT_TIME_INTERVAL = TimeSpan.MILLISECONDS_IN_MINUTE;
var ChartImplementation = (function (_super) {
    __extends(ChartImplementation, _super);
    function ChartImplementation(config) {
        var _this = _super.call(this) || this;
        _this._themeType = ThemeType.Light;
        _this._valueScales = [];
        _this._chartPanelsFrame = new Rect();
        _this._indicators = [];
        _this._options = {};
        _this._showDrawings = true;
        _this._state = ChartState.NORMAL;
        _this._updateAnimation = new Animation({
            context: _this,
            recurring: false,
            callback: _this._onUpdateAnimationCallback
        });
        _this.customChartPanelObjectsManager = new ChartAnnotationsManager();
        _this.continuousDrawing = false;
        _this.lastUsedDrawingClassName = null;
        _this.allowsAutoScaling = true;
        _this.periodZoomCounterForMobile = -1;
        _this._cutOffDate = null;
        _this._cutOffDataLoaded = false;
        if (typeof config !== 'object')
            throw new Error('Config must be an object.');
        if (!config.hostId)
            throw new Error('Chart host id is not specified.');
        if (!config.theme)
            config.theme = ChartAccessorService.instance.getThemeDefaultSettings();
        if (config.theme)
            _this._themeType = config.theme.name == Theme.Light.name ? ThemeType.Light : ThemeType.Dark;
        _this._hostId = config.hostId;
        if (!config.container)
            throw new Error('Chart container is not specified.');
        _this._container = $(config.container);
        if (_this._container.length === 0)
            throw new Error("Unable to find HTML element by selector '" + config.container + '".');
        var width = config.width || DEFAULT_WIDTH;
        if (width <= 0)
            throw new Error("Width must be a positive number.");
        var height = config.height || DEFAULT_HEIGHT;
        if (height <= 0)
            throw new Error("Height must be a positive number.");
        _this._readOnly = config.readOnly;
        _this._instrument = config.instrument;
        _this._movingAverageOptions = new MovingAverageOptions();
        _this.timeInterval = config.timeInterval || DEFAULT_TIME_INTERVAL;
        _this._loadOptionsState(config);
        _this._valueMarker = new ValueMarker(_this._options.theme.valueScale.valueMarker);
        _this._selectionMarker = new SelectionMarker({ chart: _this });
        _this._layoutHtmlElements(width, height);
        _this._applyTheme();
        _this._dataManager = new DataManager();
        _this._dataManager.addBarDataSeries();
        _this._dateScale = new DateScaleImplementation({ chart: _this });
        _this.valueScales.push(new ValueScaleImplementation({ chart: _this }));
        _this._chartPanelsContainer = new ChartPanelsContainerImplementation({ chart: _this });
        _this._crossHair = new CrossHairImplementation({ chart: _this });
        if (config.crossHair != null) {
            _this.crossHairType = config.crossHair;
        }
        _this._priceStyle = new CandlePriceStyle({ chart: _this });
        _this._priceStyle.apply();
        if (config.priceStyle != null) {
            _this.priceStyleKind = config.priceStyle;
        }
        _this._subscribeEvents(config.readOnly);
        _this.layout();
        if (config.showToolbar !== false) {
            if (JsUtil.isFunction(config.onToolbarLoaded))
                _this.on(ChartEvent.TOOLBAR_LOADED, config.onToolbarLoaded);
            _this._container.scx().toolbar(_this);
        }
        if (config.showNavigation !== false)
            _this._rootDiv.scx().chartNavigation(_this);
        if (config.fullWindowMode)
            _this.toggleFullWindow();
        _this._zoomTool = new ZoomTool({ chart: _this });
        _this._measurementTool = new MeasurementTool({ chart: _this });
        _this._isInteractive = config.isInteractive;
        return _this;
    }
    Object.defineProperty(ChartImplementation, "version", {
        get: function () {
            return "2.14.19";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "container", {
        get: function () {
            return this._container;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "rootDiv", {
        get: function () {
            return this._rootDiv;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "dateScale", {
        get: function () {
            return this._dateScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "valueScales", {
        get: function () {
            return this._valueScales;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "valueScale", {
        get: function () {
            return this._valueScales[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "chartPanelsContainer", {
        get: function () {
            return this._chartPanelsContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "dataManager", {
        get: function () {
            return this._dataManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "timeInterval", {
        get: function () {
            return this._timeInterval;
        },
        set: function (value) {
            var interval = value, oldInterval = this._timeInterval;
            if (oldInterval != interval) {
                if (!isFinite(interval) || interval <= 0)
                    throw new Error("Time interval must be greater than 0.");
                this._timeInterval = interval;
                this.fireValueChanged(ChartEvent.TIME_INTERVAL_CHANGED, interval, oldInterval);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "marketTradingMinutesCount", {
        get: function () {
            return this._marketTradingMinutesCountInDays;
        },
        set: function (value) {
            this._marketTradingMinutesCountInDays = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "chartPanelsFrame", {
        get: function () {
            return this._chartPanelsFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "instrument", {
        get: function () {
            return this._instrument;
        },
        set: function (value) {
            var oldInstrument = value;
            this._instrument = value;
            this.fireValueChanged(ChartEvent.INSTRUMENT_CHANGED, value, oldInstrument);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "indicators", {
        get: function () {
            return this._indicators;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "valueMarker", {
        get: function () {
            return this._valueMarker;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "movingAverageOptions", {
        get: function () {
            return this._movingAverageOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "locale", {
        get: function () {
            return this._options.locale;
        },
        set: function (value) {
            var oldLocale = this._options.locale;
            if (oldLocale != value) {
                this._options.locale = value;
                this.fireValueChanged(ChartEvent.LOCALE_CHANGED, value, oldLocale);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "keyboardEventsEnabled", {
        get: function () {
            return this._options.enableKeyboardEvents;
        },
        set: function (value) {
            this._options.enableKeyboardEvents = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "numberOfDigitFormat", {
        get: function () {
            return this._numberOfDigitFormat;
        },
        set: function (value) {
            var oldLocale = this._numberOfDigitFormat;
            if (oldLocale != value) {
                this._numberOfDigitFormat = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "theme", {
        get: function () {
            return this._options.theme;
        },
        set: function (value) {
            this._themeType = value.name == Theme.Light.name ? ThemeType.Light : ThemeType.Dark;
            this._options.theme = value;
            this._applyTheme();
            this.updateIndicators();
            this.fireValueChanged(ChartEvent.THEME_CHANGED);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "showBarInfoInTitle", {
        get: function () {
            return this._options.showBarInfoInTitle;
        },
        set: function (value) {
            this._options.showBarInfoInTitle = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "showPanelOptions", {
        get: function () {
            return this._options.showPanelOptions;
        },
        set: function (value) {
            this._options.showPanelOptions = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "priceStyle", {
        get: function () {
            return this._priceStyle;
        },
        set: function (value) {
            var oldPriceStyle = this.priceStyle;
            if (oldPriceStyle !== value) {
                var dateRange = this.dateRange();
                this._priceStyle.destroy();
                value.chart = this;
                this._priceStyle = value;
                this._priceStyle.apply();
                var dateScale = this.dateScale, projection = dateScale.projection, firstRecord = projection.recordByX(projection.xByDate(dateRange.startDate, false), false), lastRecord = projection.recordByX(projection.xByDate(dateRange.endDate, false), false);
                if (!dateScale._canSetVisibleRecord(firstRecord) || !dateScale._canSetVisibleRecord(lastRecord)) {
                    this.setNeedsAutoScaleAll();
                }
                else {
                    this.firstVisibleRecord = firstRecord;
                    this.lastVisibleRecord = lastRecord - 1;
                    if (this.lastVisibleRecord - this.firstVisibleRecord < dateScale.minVisibleRecords)
                        this.setNeedsAutoScaleAll();
                    else
                        this.setNeedsAutoScale();
                }
                this.fireValueChanged(ChartEvent.PRICE_STYLE_CHANGED, value, oldPriceStyle);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "priceStyleKind", {
        get: function () {
            var priceStyle = this.priceStyle;
            return priceStyle && priceStyle.constructor.className;
        },
        set: function (value) {
            this.priceStyle = PriceStyle.create(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "hoveredRecord", {
        get: function () {
            return this._hoverRecord;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "crossHair", {
        get: function () {
            return this._crossHair;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "selectedObject", {
        get: function () {
            return this._selectedObject;
        },
        set: function (value) {
            this._selectedObject = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "selectionMarker", {
        get: function () {
            return this._selectionMarker;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "showDrawings", {
        get: function () {
            return this._showDrawings;
        },
        set: function (value) {
            this._showDrawings = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            var oldState = this._state;
            if (oldState !== value) {
                this._state = value;
                this.fireValueChanged(ChartEvent.STATE_CHANGED, value, oldState);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "size", {
        get: function () {
            return {
                width: this._rootDiv.width(),
                height: this._rootDiv.height()
            };
        },
        set: function (value) {
            this._container.css('width', 'auto').css('height', 'auto');
            this._rootDiv.width(value.width).height(value.height);
            this._rootDiv.find('.' + Class.BACKGROUND).width(value.width).height(value.height);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "mainPanel", {
        get: function () {
            return this._priceStyle.chartPanel || this._chartPanelsContainer.panels[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "recordCount", {
        get: function () {
            return this.primaryDataSeries(DataSeriesSuffix.DATE).length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "firstVisibleRecord", {
        get: function () {
            return this._dateScale.firstVisibleRecord;
        },
        set: function (value) {
            this._dateScale.firstVisibleRecord = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "lastVisibleRecord", {
        get: function () {
            return this._dateScale.lastVisibleRecord;
        },
        set: function (value) {
            this._dateScale.lastVisibleRecord = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "firstVisibleIndex", {
        get: function () {
            return this._dateScale.firstVisibleIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "lastVisibleIndex", {
        get: function () {
            return this._dateScale.lastVisibleIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "chartPanels", {
        get: function () {
            return this._chartPanelsContainer.panels;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "crossHairType", {
        get: function () {
            return this._crossHair.crossHairType;
        },
        set: function (value) {
            this._crossHair.crossHairType = value;
        },
        enumerable: true,
        configurable: true
    });
    ChartImplementation.prototype.getZoomedDateRange = function () {
        if (this.firstVisibleRecord == this.lastVisibleRecord) {
            return null;
        }
        if (!this.dateScale.zoomed) {
            return null;
        }
        return {
            start: this.dateScale.projection.dateByRecord(Math.floor(this.firstVisibleRecord)),
            end: this.dateScale.projection.dateByRecord(Math.ceil(this.lastVisibleRecord))
        };
    };
    Object.defineProperty(ChartImplementation.prototype, "readOnly", {
        get: function () {
            return this._readOnly;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "zoomTool", {
        get: function () {
            return this._zoomTool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "measurementTool", {
        get: function () {
            return this._measurementTool;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "magnetRatio", {
        get: function () {
            return this._options.magnetRatio;
        },
        set: function (ratio) {
            this._options.magnetRatio = ratio;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "isInteractive", {
        get: function () {
            return this._isInteractive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartImplementation.prototype, "hostId", {
        get: function () {
            return this._hostId;
        },
        enumerable: true,
        configurable: true
    });
    ChartImplementation.prototype.isVisible = function () {
        return this._rootDiv.is(':visible');
    };
    ChartImplementation.prototype.getBounds = function () {
        return new Rect({
            left: 0,
            top: 0,
            width: this._rootDiv.width(),
            height: this._rootDiv.height()
        });
    };
    ChartImplementation.prototype.selectObject = function (obj) {
        var oldSelectedObj = this._selectedObject;
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
    };
    ChartImplementation.prototype.addValueScale = function (valueScale) {
        var scales = this.valueScales;
        if (valueScale) {
            for (var _i = 0, scales_1 = scales; _i < scales_1.length; _i++) {
                var scale = scales_1[_i];
                if (scale === valueScale)
                    throw new Error("Value scale has been added already.");
            }
        }
        else {
            valueScale = new ValueScaleImplementation({ chart: this });
        }
        scales.push(valueScale);
        this.fireValueChanged(ChartEvent.VALUE_SCALE_ADDED, valueScale);
        return valueScale;
    };
    ChartImplementation.prototype.removeValueScale = function (valueScale) {
        var i;
        if (Array.isArray(valueScale)) {
            for (var _i = 0, valueScale_1 = valueScale; _i < valueScale_1.length; _i++) {
                var scale = valueScale_1[_i];
                this.removeValueScale(scale);
            }
            return;
        }
        var scales = this.valueScales;
        for (i = 0; i < scales.length; i++) {
            if (scales[i] === valueScale) {
                if (i === 0)
                    throw new Error("Cannot remove main scale.");
                scales.splice(i, 1);
                this.fireValueChanged(ChartEvent.VALUE_SCALE_REMOVED, i);
                break;
            }
        }
    };
    ChartImplementation.prototype.addIndicators = function (indicators) {
        if (Array.isArray(indicators)) {
            return this.addArrayOfIndicators(indicators);
        }
        var newIndicator = indicators;
        if (JsUtil.isNumber(newIndicator)) {
            if (IndicatorHelper.isLiquidityIndicator(newIndicator))
                return this.addIndicators(new LiquidityIndicator({ chart: this, taIndicator: newIndicator }));
            else if (VolumeProfilerSessionVolume == newIndicator)
                return this.addIndicators(new VolumeProfilerSessionVolumeIndicator({ chart: this, taIndicator: newIndicator }));
            else if (VolumeProfilerVisibleRange == newIndicator)
                return this.addIndicators(new VolumeProfilerVisibleRangeIndicator({ chart: this, taIndicator: newIndicator }));
            else if (newIndicator == IchimokuKinkoHyo)
                return this.addIndicators(new IchimokuIndicator({ chart: this, taIndicator: IchimokuKinkoHyo }));
            else
                return this.addIndicators(new TAIndicator({ chart: this, taIndicator: newIndicator }));
        }
        if (newIndicator instanceof Indicator) {
            var chartIndicators = this._indicators;
            for (var _i = 0, chartIndicators_1 = chartIndicators; _i < chartIndicators_1.length; _i++) {
                var item = chartIndicators_1[_i];
                if (item === newIndicator)
                    return newIndicator;
            }
            newIndicator.chart = this;
            chartIndicators.push(newIndicator);
            newIndicator.update();
            this.setNeedsUpdate(true);
            this.fireValueChanged(ChartEvent.INDICATOR_ADDED, newIndicator);
            return newIndicator;
        }
        if (typeof newIndicator === 'object') {
            var state = $.extend(true, { chart: this }, newIndicator);
            newIndicator = IndicatorDeserializer.instance.deserialize(state);
            return this.addIndicators(newIndicator);
        }
        throw new TypeError("Unknown indicator.");
    };
    ChartImplementation.prototype.removeIndicators = function (indicators, removePanelIfNoPlots) {
        var _this = this;
        if (removePanelIfNoPlots === undefined)
            removePanelIfNoPlots = true;
        if (Array.isArray(indicators)) {
            for (var _i = 0, indicators_1 = indicators; _i < indicators_1.length; _i++) {
                var item = indicators_1[_i];
                if (item)
                    this.removeIndicators(item, removePanelIfNoPlots);
            }
            return;
        }
        var chartIndicators = this._indicators, indicator = indicators;
        var removeIndicator = function (indicator) {
            var panel = indicator.chartPanel;
            if (panel) {
                panel.removePlot(indicator.plots);
                if (removePanelIfNoPlots && panel.plots.length == 0 && panel !== _this.mainPanel)
                    panel.chartPanelsContainer.removePanel(panel);
            }
            indicator.destroy();
            _this.fireValueChanged(ChartEvent.INDICATOR_REMOVED, indicator);
        };
        for (var i = 0; i < chartIndicators.length; i++) {
            if (indicator) {
                if (chartIndicators[i] === indicator) {
                    chartIndicators.splice(i, 1);
                    removeIndicator(indicator);
                    break;
                }
            }
            else {
                var item = chartIndicators[i];
                chartIndicators.splice(i, 1);
                removeIndicator(item);
                i--;
            }
        }
    };
    ChartImplementation.prototype.updateIndicators = function () {
        var customSourceIndicators = [];
        for (var _i = 0, _a = this._indicators; _i < _a.length; _i++) {
            var indicator = _a[_i];
            if (indicator.customSourceIndicatorId) {
                customSourceIndicators.push(indicator);
            }
            else {
                indicator.update();
            }
        }
        for (var _b = 0, customSourceIndicators_1 = customSourceIndicators; _b < customSourceIndicators_1.length; _b++) {
            var indicator = customSourceIndicators_1[_b];
            indicator.update();
        }
    };
    ChartImplementation.prototype.saveIndicatorsState = function () {
        var states = [], panels = this.chartPanels, indicators = this._indicators;
        for (var _i = 0, panels_1 = panels; _i < panels_1.length; _i++) {
            var panel = panels_1[_i];
            for (var _a = 0, indicators_2 = indicators; _a < indicators_2.length; _a++) {
                var indicator = indicators_2[_a];
                if (indicator.chartPanel === panel)
                    states.push(indicator.serialize());
            }
        }
        return states;
    };
    ChartImplementation.prototype.loadIndicatorsState = function (state) {
        if (typeof state === 'string')
            state = JSON.parse(state);
        this.removeIndicators();
        if (state)
            this.addIndicators(state);
    };
    ChartImplementation.prototype.saveDrawingsState = function () {
        var state = [];
        var panels = this._chartPanelsContainer.panels;
        for (var _i = 0, panels_2 = panels; _i < panels_2.length; _i++) {
            var panel = panels_2[_i];
            for (var _a = 0, _b = panel.drawings; _a < _b.length; _a++) {
                var drawing = _b[_a];
                if (this.isValidDrawingChartPoints(drawing)) {
                    state.push(drawing.saveState());
                }
            }
        }
        return state;
    };
    ChartImplementation.prototype.updateTradingDrawings = function (orders, position) {
        var activeOrders = orders.filter(function (order) { return order.status.type == TradingOrderStatusType.ACTIVE; });
        var executedOrders = orders.filter(function (order) { return order.status.type == TradingOrderStatusType.EXECUTED; });
        var panel = this.mainPanel;
        var panelOrders = panel.getTradingOrders();
        var _loop_1 = function (order) {
            if (!panelOrders.find(function (o) { return o.id == order.id; })) {
                panel.addTradingOrder(order);
            }
            else {
                panel.updateTradingOrder(order);
            }
        };
        for (var _i = 0, activeOrders_1 = activeOrders; _i < activeOrders_1.length; _i++) {
            var order = activeOrders_1[_i];
            _loop_1(order);
        }
        var _loop_2 = function (order) {
            if (!activeOrders.find(function (o) { return o.id == order.id; })) {
                panel.removeTradingOrder(order);
            }
        };
        for (var _a = 0, panelOrders_1 = panelOrders; _a < panelOrders_1.length; _a++) {
            var order = panelOrders_1[_a];
            _loop_2(order);
        }
        panel.removeTradingPosition();
        if (position) {
            panel.addTradingPosition(position);
        }
        this.addExecutedOrders(executedOrders);
        panel.update();
    };
    ChartImplementation.prototype.updateChartAlertDrawings = function (alerts) {
        var _this = this;
        var _loop_3 = function (panel) {
            var alertsBelongingToPanel = alerts.filter(function (alert) {
                if (panel == _this.mainPanel && alert.parameter.indicatorId == ChartAlertIndicator.CLOSE_INDICATOR_ID) {
                    return true;
                }
                return panel.hasIndicator(alert.parameter.indicatorId);
            });
            var alertsInPanel = panel.getChartAlerts();
            var _loop_4 = function (alert_1) {
                if (!alertsInPanel.find(function (o) { return o.id == alert_1.id; })) {
                    panel.addChartAlert(alert_1);
                }
                else {
                    panel.updateChartAlert(alert_1);
                }
            };
            for (var _i = 0, alertsBelongingToPanel_1 = alertsBelongingToPanel; _i < alertsBelongingToPanel_1.length; _i++) {
                var alert_1 = alertsBelongingToPanel_1[_i];
                _loop_4(alert_1);
            }
            var _loop_5 = function (alert_2) {
                if (!alertsBelongingToPanel.find(function (o) { return o.id == alert_2.id; })) {
                    panel.removeChartAlert(alert_2);
                }
            };
            for (var _a = 0, alertsInPanel_1 = alertsInPanel; _a < alertsInPanel_1.length; _a++) {
                var alert_2 = alertsInPanel_1[_a];
                _loop_5(alert_2);
            }
            panel.update();
        };
        for (var _i = 0, _a = this.chartPanels; _i < _a.length; _i++) {
            var panel = _a[_i];
            _loop_3(panel);
        }
    };
    ChartImplementation.prototype.addNewsAnnotations = function (newsList) {
        this.addNews(newsList);
        this.setNeedsUpdate();
    };
    ChartImplementation.prototype.loadDrawingsState = function (state) {
        if (typeof state === 'string')
            state = JSON.parse(state);
        this.clearDrawingsOnLoadState();
        if (!state)
            return;
        var panels = this._chartPanelsContainer.panels;
        for (var _i = 0, state_1 = state; _i < state_1.length; _i++) {
            var stateItem = state_1[_i];
            var panel = panels[stateItem.panelIndex];
            if (!panel)
                continue;
            var drawing = Drawing.deserialize(this, stateItem);
            if (drawing && this.isValidDrawingChartPoints(drawing))
                panel.addDrawings(drawing);
        }
    };
    ChartImplementation.prototype.deleteDrawings = function () {
        var panels = this._chartPanelsContainer.panels;
        for (var _i = 0, panels_3 = panels; _i < panels_3.length; _i++) {
            var panel = panels_3[_i];
            panel.deleteDrawings();
        }
    };
    ChartImplementation.prototype.clearDrawingsOnLoadState = function () {
        var panels = this._chartPanelsContainer.panels;
        for (var _i = 0, panels_4 = panels; _i < panels_4.length; _i++) {
            var panel = panels_4[_i];
            panel.clearPanelOnLoadState();
        }
    };
    ChartImplementation.prototype.saveState = function () {
        var scalesState = [];
        for (var _i = 0, _a = this.valueScales; _i < _a.length; _i++) {
            var scale = _a[_i];
            scalesState.push(scale.saveState());
        }
        return {
            chart: $.extend(true, {}, this._options),
            priceStyle: this._priceStyle.saveState(),
            dateScale: this._dateScale.saveState(),
            valueScales: scalesState,
            crossHair: this._crossHair.saveState(),
            chartPanelsContainer: this._chartPanelsContainer.saveState(),
            indicators: this.saveIndicatorsState(),
            drawings: this.saveDrawingsState(),
        };
    };
    ChartImplementation.prototype.loadState = function (state) {
        if (typeof state === 'string')
            state = JSON.parse(state);
        state = state || {};
        this.suppressEvents();
        this.removeIndicators();
        this._loadOptionsState(state.chart);
        this._dateScale.loadState(state.dateScale);
        this.theme = this._options.theme;
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
        this.fireValueChanged(ChartEvent.THEME_CHANGED);
        this.fireValueChanged(ChartEvent.STATE_LOADED);
    };
    ChartImplementation.prototype._restoreValueScales = function (state) {
        var valueScales = this.valueScales, i;
        for (var _i = 0, valueScales_1 = valueScales; _i < valueScales_1.length; _i++) {
            var valueScale = valueScales_1[_i];
            valueScale.destroy();
        }
        var scalesState = state.valueScales;
        valueScales.length = 0;
        for (i = 0; i < scalesState.length; i++) {
            var scale = new ValueScaleImplementation({ chart: this });
            valueScales.push(scale);
            scale.loadState(scalesState[i]);
        }
        if (valueScales.length === 0)
            valueScales.push(new ValueScaleImplementation({ chart: this }));
    };
    ChartImplementation.prototype.startUserDrawing = function (drawing) {
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
    };
    ChartImplementation.prototype.cancelUserDrawing = function () {
        if (this.state === ChartState.USER_DRAWING) {
            var panel = this._selectedObject.chartPanel;
            if (panel) {
                panel.deleteDrawings(this._selectedObject);
            }
            this.selectObject(null);
            this.state = ChartState.NORMAL;
            this.checkContinuousDrawing();
        }
    };
    ChartImplementation.prototype._finishUserDrawing = function (drawing) {
        this.state = ChartState.NORMAL;
        this.checkContinuousDrawing();
        this.fireTargetValueChanged(drawing, ChartEvent.USER_DRAWING_FINISHED);
    };
    ChartImplementation.prototype.enableContinuousDrawing = function () {
        this.continuousDrawing = true;
    };
    ChartImplementation.prototype.disableContinuousDrawing = function () {
        this.continuousDrawing = false;
        this.cancelUserDrawing();
    };
    ChartImplementation.prototype.setNeedsAutoScaleAll = function () {
        this._dateScale.setNeedsAutoScale();
        this._chartPanelsContainer.setNeedsAutoScale();
    };
    Object.defineProperty(ChartImplementation.prototype, "isInFullWindowMode", {
        get: function () {
            return !!this._preFullWindowSize;
        },
        enumerable: true,
        configurable: true
    });
    ChartImplementation.prototype.toggleFullWindow = function () {
        if (this.isInFullWindowMode) {
            this._container.removeClass(Class.FULL_WINDOW);
            this.size = this._preFullWindowSize;
            this._preFullWindowSize = null;
            this.setNeedsUpdate();
        }
        else {
            this._preFullWindowSize = this.size;
            this._container.addClass(Class.FULL_WINDOW);
            this._handleFullWindowResize();
        }
    };
    ChartImplementation.prototype.resizeCanvas = function () {
        if (!this.isInFullWindowMode) {
            if (!document.getElementById(this._container.attr('id'))) {
                return;
            }
            var styleWidth = document.getElementById(this._container.attr('id')).style.width;
            var styleHeight = document.getElementById(this._container.attr('id')).style.height;
            var width = this._container.innerWidth();
            var height = this._container.innerHeight();
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
    };
    ChartImplementation.prototype.setNeedsLayout = function () {
        this.layout();
    };
    ChartImplementation.prototype.layout = function () {
        var frame = this.getBounds();
        var panelsFrame = this._dateScale.layoutScalePanel(frame);
        this._chartPanelsFrame = this._chartPanelsContainer.layoutScalePanel(panelsFrame);
        var dateScaleFrame = new Rect({
            left: panelsFrame.left,
            top: frame.top,
            width: panelsFrame.width,
            height: frame.height
        });
        var dateScaleProjectionFrame = new Rect({
            left: this._chartPanelsFrame.left,
            top: frame.top,
            width: this._chartPanelsFrame.width,
            height: frame.height
        });
        this._dateScale.layout(dateScaleFrame, dateScaleProjectionFrame);
        this._chartPanelsContainer.layout(this._chartPanelsFrame);
        this._crossHair.layout();
    };
    ChartImplementation.prototype.draw = function () {
        this._dateScale.draw();
        this._chartPanelsContainer.draw();
    };
    ChartImplementation.prototype.update = function () {
        this._updatePriceStylePlotDataSeriesIfNeeded();
        this.layout();
        this.draw();
    };
    ChartImplementation.prototype.setNeedsUpdate = function (needsAutoScale) {
        if (needsAutoScale)
            this.setNeedsAutoScale();
        this._updateAnimation.start();
    };
    ChartImplementation.prototype._onUpdateAnimationCallback = function () {
        this.update();
    };
    ChartImplementation.prototype.updateSplitter = function (splitter) {
        this._chartPanelsContainer.layoutSplitterPanels(splitter);
    };
    ChartImplementation.prototype.destroy = function () {
        if (this._container)
            this._container.remove();
        $(window).off("resize.scx keydown.scx");
    };
    ChartImplementation.prototype._updatePriceStylePlotDataSeriesIfNeeded = function () {
        this.mainPanel.updatePriceStylePlotDataSeriesIfNeeded();
    };
    ChartImplementation.prototype.showWaitingBar = function (config) {
        if (!this._waitingBar) {
            this._waitingBar = this._container.scx().waitingBar();
        }
        this._waitingBar.show(config);
    };
    ChartImplementation.prototype.hideWaitingBar = function () {
        if (this._waitingBar) {
            this._waitingBar.hide();
            this._waitingBar = null;
        }
    };
    ChartImplementation.prototype._handleWindowResize = function (event) {
        var self = event.data;
        if (self.isInFullWindowMode)
            self._handleFullWindowResize();
    };
    ChartImplementation.prototype._handleKeyDown = function (event) {
        var self = event.data, ctrlDown = event.ctrlKey || event.metaKey;
        if (!self.keyboardEventsEnabled)
            return;
        if (event.target !== document.body || $(event.target).hasClass('modal-open'))
            return;
        switch (event.keyCode) {
            case 107:
                self.zoomOnPixels(0.05 * self.size.width);
                break;
            case 109:
                self.zoomOnPixels(-0.05 * self.size.width);
                break;
            case 37:
                self.scrollOnPixels(0.05 * self.size.width);
                break;
            case 39:
                self.scrollOnPixels(-0.05 * self.size.width);
                break;
            case 46: {
                var selectedObj = self.selectedObject;
                var panel = selectedObj && selectedObj.chartPanel;
                if (!panel)
                    return;
                if (selectedObj instanceof Drawing) {
                    panel.deleteDrawings(selectedObj);
                }
                break;
            }
            case 67: {
                if (ctrlDown) {
                    self._copyDrawing(this.selectedObject);
                }
                break;
            }
            case 86: {
                if (ctrlDown) {
                    self._pasteDrawing();
                }
                break;
            }
            default:
                return;
        }
        self.setNeedsUpdate(true);
        event.preventDefault();
    };
    ChartImplementation.prototype._copyDrawing = function (drawing) {
        if (drawing) {
            this._copyBuffer = drawing.clone();
            this._copyBuffer.chartPanel = drawing.chartPanel;
        }
    };
    ChartImplementation.prototype._pasteDrawing = function () {
        if (this._copyBuffer) {
            this._copyBuffer.chartPanel.addDrawings(this._copyBuffer);
            this._copyBuffer.translate(20, 20);
            this._copyBuffer.chartPanel.setNeedsUpdate();
            var copyBufferPanel = this._copyBuffer.chartPanel;
            this._copyBuffer = this._copyBuffer.clone();
            this._copyBuffer.chartPanel = copyBufferPanel;
        }
    };
    ChartImplementation.prototype._handleMouseEvents = function (event) {
        var self = event.data, origEvent = event.originalEvent, clientX = event.pageX !== undefined ? event.pageX : origEvent.pageX, clientY = event.pageY !== undefined ? event.pageY : origEvent.pageY, changedTouches = origEvent && event.originalEvent.changedTouches;
        if (!clientX && !clientY && changedTouches && changedTouches.length > 0) {
            var lastTouch = changedTouches[changedTouches.length - 1];
            clientX = lastTouch.pageX;
            clientY = lastTouch.pageY;
        }
        var eventObj = {
            pointerPosition: self._rootDiv.scxClientToLocalPoint(clientX, clientY),
            evt: event
        };
        self._updateHoverRecord.call(self, eventObj.pointerPosition.x);
        if (!self._dateScale.handleEvent(eventObj))
            self._chartPanelsContainer.handleEvent(eventObj);
        if (BrowserUtils.isMobile()) {
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
        return true;
    };
    ChartImplementation.prototype.saveImageWithSize = function (saveCallback, screenshotCanvasSize) {
        var _this = this;
        $(this._rootDiv).addClass('thumbnail-screenshot');
        html2canvas(this._rootDiv.get(0), {
            onrendered: function (canvas) {
                $(_this._rootDiv).removeClass('thumbnail-screenshot');
                var screenshotCanvas = document.createElement("canvas");
                var widthResizeRatio = screenshotCanvasSize.width / _this.size.width;
                var heightResizeRatio = screenshotCanvasSize.height / _this.size.height;
                var resizeRatio = Math.min(widthResizeRatio, heightResizeRatio);
                var borderFactor = 0.95;
                var screenshotWidth = Math.floor(borderFactor * _this.size.width * resizeRatio);
                var screenshotHeight = Math.floor(borderFactor * _this.size.height * resizeRatio);
                screenshotCanvas.setAttribute('width', screenshotCanvasSize.width.toString());
                screenshotCanvas.setAttribute('height', screenshotCanvasSize.height.toString());
                var ctx = screenshotCanvas.getContext('2d');
                ctx.fillStyle = "#888";
                ctx.fillRect(0, 0, screenshotCanvas.width, screenshotCanvas.height);
                var xCenterOffset = Math.floor((screenshotCanvasSize.width - screenshotWidth) / 2);
                var yCenterOffset = Math.floor((screenshotCanvasSize.height - screenshotHeight) / 2);
                ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, xCenterOffset, yCenterOffset, screenshotWidth, screenshotHeight);
                if (saveCallback) {
                    saveCallback(screenshotCanvas);
                }
                else {
                    var fileName = "Chart.png";
                    var imageData = screenshotCanvas.toDataURL().replace(/^data:image\/[^;]/, "data:application/octet-stream");
                    var a = document.createElement("a");
                    a.download = fileName;
                    a.href = imageData;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
            }
        });
    };
    ChartImplementation.prototype.resetDefaultSettings = function () {
        ChartAccessorService.instance.setThemeDefaultSettings(null);
        this._options.theme = $.extend(true, {}, this.getDefaultTheme());
        this.theme = this._options.theme;
    };
    ChartImplementation.prototype.getDefaultTheme = function () {
        return this._themeType == ThemeType.Light ? Theme.Light : Theme.Dark;
    };
    ChartImplementation.prototype.saveAsDefaultSettings = function () {
        ChartAccessorService.instance.setThemeDefaultSettings(this._options.theme);
    };
    ChartImplementation.prototype.applyDarkTheme = function () {
        this._options.theme = $.extend(true, {}, Theme.Dark);
        this.theme = this._options.theme;
    };
    ChartImplementation.prototype.applyLightTheme = function () {
        this._options.theme = $.extend(true, {}, Theme.Light);
        this.theme = this._options.theme;
    };
    ChartImplementation.prototype._loadOptionsState = function (optionsOrConfig) {
        var options = optionsOrConfig || {};
        this._options = {
            theme: options.theme || $.extend(true, {}, this.getDefaultTheme()),
            locale: options.locale || 'en-GB',
            enableKeyboardEvents: options.enableKeyboardEvents !== undefined ? !!options.enableKeyboardEvents : true,
            showBarInfoInTitle: options.showBarInfoInTitle !== undefined ? !!options.showBarInfoInTitle : true,
            showPanelOptions: options.showPanelOptions !== undefined ? options.showPanelOptions : true,
            magnetRatio: options.magnetRatio !== undefined ? options.magnetRatio : 0
        };
        ThemeUtils.mapThemeValuesForBackwardCompatibility(this._options.theme, this.getDefaultTheme());
    };
    ChartImplementation.prototype._layoutHtmlElements = function (width, height) {
        this._container.addClass(Class.ROOT_CONTAINER);
        this._rootDiv = this._container.scxAppend('div', Class.CONTAINER).addClass(Class.UN_SELECTIVE)
            .width(width)
            .height(height);
        this._rootDiv.scxAppend('div', Class.BACKGROUND)
            .width(width)
            .height(height);
    };
    ChartImplementation.prototype._applyTheme = function () {
        var theme = this.theme, chartTheme = theme.chart;
        var backColors = chartTheme.background, background;
        if (Array.isArray(backColors)) {
            if (backColors.length == 0)
                throw new Error("Invalid theme: 'background' must be a color or array of colors.");
            if (backColors.length == 1 || (backColors.length == 2 && backColors[0] == backColors[1])) {
                background = backColors[0];
            }
            else {
                background = 'linear-gradient(to top, ' + backColors.join(', ') + ')';
            }
        }
        else {
            background = backColors;
        }
        this._container.find('.' + Class.BACKGROUND).css('background', background);
        var border = chartTheme.border;
        this._container.find('.' + Class.CONTAINER).css('border', border.width + 'px ' + border.lineStyle + ' ' + border.strokeColor);
        this._container.find('.' + Class.CONTAINER).removeClass('dark-theme light-theme');
        this._container.find('.' + Class.CONTAINER).addClass(this._themeType == ThemeType.Light ? 'light-theme' : 'dark-theme');
        this._valueMarker.theme = theme.valueScale.valueMarker;
    };
    ChartImplementation.prototype._subscribeEvents = function (readOnly) {
        var events = [
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
        if (readOnly) {
            events = [MouseEvent.MOVE];
        }
        this._rootDiv.on(events.join('.scx, '), this, this._handleMouseEvents);
        $(window)
            .on("resize.scx", this, this._handleWindowResize)
            .on("keydown.scx", this, this._handleKeyDown);
    };
    ChartImplementation.prototype._updateHoverRecord = function (x) {
        var record = this._dateScale.projection.recordByX(x);
        if (record != this._hoverRecord) {
            this._hoverRecord = record;
            this.fireValueChanged(ChartEvent.HOVER_RECORD_CHANGED, record);
        }
    };
    ChartImplementation.prototype._handleFullWindowResize = function () {
        this._container.outerWidth(window.innerWidth - 3).outerHeight(window.innerHeight - 3);
        this.size = {
            width: this._container.innerWidth() - 1,
            height: this._container.innerHeight() - this._rootDiv.position().top - 1
        };
        this.setNeedsUpdate();
    };
    ChartImplementation.prototype.barDataSeries = function () {
        return this._dataManager.barDataSeries();
    };
    ChartImplementation.prototype.getCommonDataSeries = function () {
        return this.barDataSeries();
    };
    ChartImplementation.prototype.addDataSeries = function (dataSeries, replaceIfExists) {
        return this._dataManager.addDataSeries(dataSeries, replaceIfExists);
    };
    ChartImplementation.prototype.removeDataSeries = function (dataSeries) {
        this._dataManager.removeDataSeries(dataSeries);
    };
    ChartImplementation.prototype.clearDataSeries = function (dataSeries) {
        this._dataManager.clearDataSeries(dataSeries);
    };
    ChartImplementation.prototype.trimDataSeries = function (maxLength) {
        this.dataManager.trimDataSeries(maxLength);
    };
    ChartImplementation.prototype.getDataSeries = function (name) {
        return this._dataManager.getDataSeries(name);
    };
    ChartImplementation.prototype.primaryDataSeries = function (suffix, symbol) {
        if (symbol === void 0) { symbol = ''; }
        var priceStyleSuffix = this.priceStyle.primaryDataSeriesSuffix(suffix), dsName = symbol + priceStyleSuffix + suffix;
        return this.getDataSeries(dsName);
    };
    ChartImplementation.prototype.primaryBarDataSeries = function (symbol) {
        var dsSuffix = DataSeriesSuffix;
        return {
            date: this.primaryDataSeries(dsSuffix.DATE, symbol),
            open: this.primaryDataSeries(dsSuffix.OPEN, symbol),
            high: this.primaryDataSeries(dsSuffix.HIGH, symbol),
            low: this.primaryDataSeries(dsSuffix.LOW, symbol),
            close: this.primaryDataSeries(dsSuffix.CLOSE, symbol),
            volume: this.primaryDataSeries(dsSuffix.VOLUME, symbol)
        };
    };
    ChartImplementation.prototype.findDataSeries = function (suffix) {
        return this._dataManager.findDataSeries(suffix);
    };
    ChartImplementation.prototype.appendBars = function (bars) {
        this._dataManager.appendBars(bars);
    };
    ChartImplementation.prototype.addChartPanel = function (index, heightRatio, shrinkMainPanel) {
        return this._chartPanelsContainer.addPanel(index, heightRatio, shrinkMainPanel);
    };
    ChartImplementation.prototype.findPanelAt = function (y) {
        return this._chartPanelsContainer.findPanelAt(y);
    };
    ChartImplementation.prototype.setNeedsAutoScale = function () {
        if (!this.allowsAutoScaling) {
            return;
        }
        this._chartPanelsContainer.setNeedsAutoScale();
    };
    ChartImplementation.prototype.setAllowsAutoScaling = function (enable) {
        this.allowsAutoScaling = enable;
    };
    ChartImplementation.prototype.setAxisScale = function (axisScaleType) {
        this._chartPanelsContainer.setAxisScale(axisScaleType);
    };
    ChartImplementation.prototype.getAxisScale = function () {
        return this._chartPanelsContainer.getAxisScale();
    };
    ChartImplementation.prototype.scrollOnPixels = function (pixels) {
        this._dateScale.scrollOnPixels(pixels);
    };
    ChartImplementation.prototype.scrollOnRecords = function (records) {
        this._dateScale.scrollOnRecords(records);
    };
    ChartImplementation.prototype.zoomOnPixels = function (pixels) {
        this._dateScale.zoomOnPixels(pixels);
    };
    ChartImplementation.prototype.zoomOnRecords = function (records) {
        this._dateScale.zoomOnRecords(records);
    };
    ChartImplementation.prototype.handleZoom = function (pixels) {
        this._dateScale._handleZoom(pixels);
    };
    ChartImplementation.prototype.recordRange = function (firstRecord, lastRecord) {
        if (firstRecord == null && lastRecord == null) {
            return {
                firstVisibleRecord: this.firstVisibleRecord,
                lastVisibleRecord: this.lastVisibleRecord
            };
        }
        var count = this.recordCount;
        if (lastRecord == null) {
            var records = firstRecord;
            if (!JsUtil.isFiniteNumber(records) || records <= 0)
                throw new TypeError("Positive number expected.");
            this.firstVisibleRecord = Math.max(count - records, 0);
            this.lastVisibleRecord = count - 1;
        }
        else {
            if (!JsUtil.isFiniteNumber(firstRecord) || firstRecord < 0)
                throw new TypeError("First record must be a positive number or 0.");
            if (!JsUtil.isFiniteNumber(lastRecord))
                throw new TypeError("Last record must be a positive number.");
            if (lastRecord <= firstRecord)
                throw new Error("Last record must be greater than first record.");
            this.firstVisibleRecord = firstRecord;
            this.lastVisibleRecord = lastRecord;
        }
    };
    ChartImplementation.prototype.dateRange = function (startDate, endDate) {
        var dateScale = this.dateScale, projection = dateScale.projection;
        if (!startDate && !endDate) {
            var frame = dateScale.projectionFrame;
            return {
                startDate: projection.dateByX(frame.left),
                endDate: projection.dateByX(frame.right)
            };
        }
        var firstRecord = projection.recordByX(projection.xByDate(startDate, false), false), lastRecord = projection.recordByX(projection.xByDate(endDate, false), false);
        this.firstVisibleRecord = firstRecord;
        this.lastVisibleRecord = lastRecord - 1;
    };
    ChartImplementation.prototype.updateComputedDataSeries = function () {
        this.priceStyle.updateComputedDataSeries();
    };
    ChartImplementation.prototype.startZooming = function () {
        if (this.isZooming()) {
            return;
        }
        this._state = ChartState.ZOOMING;
        this._zoomTool.startZooming();
    };
    ChartImplementation.prototype.finishZooming = function () {
        this._state = ChartState.NORMAL;
        this.setNeedsUpdate();
    };
    ChartImplementation.prototype.isZooming = function () {
        return this._state == ChartState.ZOOMING;
    };
    ChartImplementation.prototype.cancelZoomingIfNeeded = function () {
        if (this._state == ChartState.ZOOMING) {
            this._zoomTool.finishZoomingWithoutEvent();
        }
    };
    ChartImplementation.prototype.startMeasuring = function () {
        if (this.isMeasuring()) {
            return;
        }
        this._state = ChartState.MEASURING;
        this._measurementTool.startMeasuring();
    };
    ChartImplementation.prototype.finishMeasuring = function () {
        this._state = ChartState.NORMAL;
        this.setNeedsUpdate();
    };
    ChartImplementation.prototype.isMeasuring = function () {
        return this._state == ChartState.MEASURING;
    };
    ChartImplementation.prototype.cancelMeasuringIfNeeded = function () {
        if (this._state == ChartState.MEASURING) {
            this._measurementTool.finishMeasuring();
            this.finishMeasuring();
        }
    };
    ChartImplementation.prototype.onData = function (priceData, zoomStartDate, maintainZoom, zoomRange, splits, showBonusShares) {
        this.dataManager.clearDataSeries();
        this.fillMainDataSeries(priceData);
        this.updateComputedDataSeries();
        this.setNeedsAutoScaleAll();
        this.dateScale.zoomed = false;
        if (priceData.length) {
            if (this.canApplySavedZoom(maintainZoom, zoomRange, priceData[0].time)) {
                this.applySavedSpace(zoomRange);
                this.dateScale.zoomed = true;
            }
            else {
                this.applySelectedPeriodZoom(priceData, zoomStartDate);
            }
        }
        showBonusShares ? this.addSplitsAnnotation(splits) : this.addSplitsAnnotation([]);
        this.setAllowsAutoScaling(true);
        this.setNeedsAutoScale();
        this.updateIndicators();
        this.update();
    };
    ChartImplementation.prototype.resetToPeriodDefaultZoomForMobile = function () {
        if (BrowserUtils.isMobile()) {
            if (this.periodZoomCounterForMobile !== -1) {
                this.addExtraSpaceRightOfChart(this.periodZoomCounterForMobile);
                this.setNeedsUpdate(true);
            }
        }
    };
    ChartImplementation.prototype.getIndicatorById = function (id) {
        for (var _i = 0, _a = this._indicators; _i < _a.length; _i++) {
            var indicator = _a[_i];
            if (indicator.id == id) {
                return indicator;
            }
        }
        return null;
    };
    ChartImplementation.prototype.updateCustomSourceIndicators = function (sourceIndicatorId) {
        var indicatorsDependsOnAnotherIndicator = this.getIndicatorsThatDependOnAnotherIndicator(sourceIndicatorId);
        for (var _i = 0, indicatorsDependsOnAnotherIndicator_1 = indicatorsDependsOnAnotherIndicator; _i < indicatorsDependsOnAnotherIndicator_1.length; _i++) {
            var indicator = indicatorsDependsOnAnotherIndicator_1[_i];
            indicator.update();
        }
    };
    ChartImplementation.prototype.removeChildIndicators = function (sourceIndicatorId) {
        var indicatorsDependsOnAnotherIndicator = this.getIndicatorsThatDependOnAnotherIndicator(sourceIndicatorId);
        this.removeIndicators(indicatorsDependsOnAnotherIndicator);
    };
    ChartImplementation.prototype.moveIndicatorIndexToEnd = function (indicator) {
        this._indicators.push(this._indicators.splice(this._indicators.indexOf(indicator), 1)[0]);
    };
    ChartImplementation.prototype.toggleDateScaleGridSessionLinesVisibility = function () {
        this.dateScale.showGridSessionLines = !this.dateScale.showGridSessionLines;
        this.setNeedsUpdate();
    };
    ChartImplementation.prototype.isVisibleDateScaleGridSessionLines = function () {
        return this.dateScale.showGridSessionLines;
    };
    ChartImplementation.prototype.addCustomChartPanelObject = function (type, date, data, isBelowCandle) {
        var customObject;
        switch (type) {
            case ChartAnnotationType.Split:
                customObject = new SplitChartAnnotation(this, { type: type, splitValue: data, date: date, belowCandle: isBelowCandle });
                break;
            case ChartAnnotationType.TradingOrder:
                customObject = new TradingOrderChartAnnotation(this, { type: type, order: data, date: date, belowCandle: isBelowCandle });
                break;
            case ChartAnnotationType.News:
                customObject = new NewsChartAnnotation(this, { type: type, categoryNews: data, date: date, belowCandle: isBelowCandle });
                break;
            default:
                throw new Error('unknown annotation type : ' + type);
        }
        customObject.setPanel(this.mainPanel);
        this.customChartPanelObjectsManager.register(customObject);
    };
    ChartImplementation.prototype.addExecutedOrders = function (executedOrders) {
        this.customChartPanelObjectsManager.removeByType(ChartAnnotationType.TradingOrder);
        for (var _i = 0, executedOrders_1 = executedOrders; _i < executedOrders_1.length; _i++) {
            var order = executedOrders_1[_i];
            var isBelowCandle = order.side.type == TradingOrderSideType.BUY;
            if (order.executionTime) {
                this.addCustomChartPanelObject(ChartAnnotationType.TradingOrder, order.executionTime, order, isBelowCandle);
            }
        }
    };
    ChartImplementation.prototype.addSplitsAnnotation = function (splits) {
        this.customChartPanelObjectsManager.removeByType(ChartAnnotationType.Split);
        for (var _i = 0, splits_1 = splits; _i < splits_1.length; _i++) {
            var split = splits_1[_i];
            this.addCustomChartPanelObject(ChartAnnotationType.Split, split.date, split.value, false);
        }
    };
    ChartImplementation.prototype.addNews = function (newsList) {
        this.customChartPanelObjectsManager.removeByType(ChartAnnotationType.News);
        for (var _i = 0, newsList_1 = newsList; _i < newsList_1.length; _i++) {
            var news = newsList_1[_i];
            this.addCustomChartPanelObject(ChartAnnotationType.News, news.date, news, false);
        }
    };
    ChartImplementation.prototype.getDrawingById = function (id) {
        for (var _i = 0, _a = this.chartPanels; _i < _a.length; _i++) {
            var panel = _a[_i];
            var index = -1;
            for (var i = 0; i < panel.drawings.length; i++) {
                var drawing = panel.drawings[i];
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
    };
    ChartImplementation.prototype.updateDrawingsLocking = function (locked) {
        for (var _i = 0, _a = this.chartPanels; _i < _a.length; _i++) {
            var panel = _a[_i];
            for (var _b = 0, _c = panel.drawings; _b < _c.length; _b++) {
                var drawing = _c[_b];
                drawing.locked = locked;
            }
        }
    };
    ChartImplementation.prototype.getIndicatorsThatDependOnAnotherIndicator = function (sourceIndicatorId) {
        var indicatorsDependsOnAnotherIndicator = [];
        for (var _i = 0, _a = this._indicators; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.customSourceIndicatorId == sourceIndicatorId) {
                indicatorsDependsOnAnotherIndicator.push(item);
            }
        }
        return indicatorsDependsOnAnotherIndicator;
    };
    ChartImplementation.prototype.canApplySavedZoom = function (maintainZoom, zoomRange, firstPriceDataDate) {
        if (maintainZoom && zoomRange) {
            if (new Date(firstPriceDataDate) < zoomRange.start) {
                return true;
            }
        }
        return false;
    };
    ChartImplementation.prototype.getValueByGlobalPoint = function (x, y) {
        var localPoint = this._rootDiv.scxClientToLocalPoint(x, y);
        var panel = this.chartPanelsContainer.findPanelAt(localPoint.y);
        return panel.projection.valueByY(localPoint.y - panel.frame.top);
    };
    ChartImplementation.prototype.getPanelIndexByGlobalPoint = function (x, y) {
        var localPoint = this._rootDiv.scxClientToLocalPoint(x, y);
        var panel = this.chartPanelsContainer.findPanelAt(localPoint.y);
        return panel.getIndex();
    };
    ChartImplementation.prototype.onVisibilityChanged = function () {
        this.update();
        this.crossHair.update();
    };
    ChartImplementation.prototype.fillMainDataSeries = function (priceData) {
        var _this = this;
        var barDataSeries = this.barDataSeries();
        priceData.forEach(function (pData) {
            if (!_this.cutOffDataIsLoaded() && _this._cutOffDate && _this._cutOffDate < pData.time) {
                return;
            }
            var date = moment(pData.time).toDate();
            barDataSeries.date.add(date);
            barDataSeries.open.add(pData.open);
            barDataSeries.high.add(pData.high);
            barDataSeries.low.add(pData.low);
            barDataSeries.close.add(pData.close);
            barDataSeries.volume.add(pData.volume);
        });
    };
    ChartImplementation.prototype.applySelectedPeriodZoom = function (priceData, zoomStartDate) {
        var zoomCounter = 0;
        priceData.forEach(function (pData) {
            if (zoomStartDate <= pData.time) {
                zoomCounter += 1;
            }
        });
        if (zoomCounter) {
            this.periodZoomCounterForMobile = zoomCounter;
            this.recordRange(zoomCounter);
            this.update();
            this.addExtraSpaceRightOfChart(zoomCounter);
        }
    };
    ChartImplementation.prototype.applySavedSpace = function (zoomRange) {
        this.dateRange(zoomRange.start, zoomRange.end);
    };
    ChartImplementation.prototype.addExtraSpaceRightOfChart = function (zoomCounter) {
        var additionalRecords = this.getAdditionalNeededRecords();
        if (additionalRecords) {
            this.recordRange(zoomCounter + additionalRecords);
            this.scrollOnRecords(-additionalRecords);
            this.dateScale.zoomed = false;
        }
    };
    ChartImplementation.prototype.getAdditionalNeededRecords = function () {
        var columnsCount = this.dateScale.columnsCount;
        var additionalRecords = 0;
        if (columnsCount <= 20) {
            additionalRecords = 2;
        }
        else {
            additionalRecords = 2 * (columnsCount / 20);
        }
        return additionalRecords;
    };
    ChartImplementation.prototype.checkContinuousDrawing = function () {
        if (this.continuousDrawing) {
            this.startUserDrawing(Drawing.deserialize(this, { className: this.lastUsedDrawingClassName }));
        }
    };
    ChartImplementation.prototype.isValidDrawingChartPoints = function (drawing) {
        for (var _i = 0, _a = drawing.chartPoints; _i < _a.length; _i++) {
            var point = _a[_i];
            if (!point.isPercentBasedChartPoint()) {
                var validDate = point.date && moment(point.date).isValid();
                var validValue = !isNaN(point.value);
                if (!validDate || !validValue)
                    return false;
            }
        }
        return true;
    };
    ChartImplementation.prototype.addArrayOfIndicators = function (indicators) {
        var addedIndicators = [];
        var customSourceIndicators = [];
        for (var _i = 0, indicators_3 = indicators; _i < indicators_3.length; _i++) {
            var item = indicators_3[_i];
            if (item.customSourceIndicatorId) {
                customSourceIndicators.push(item);
            }
            else {
                addedIndicators.push(this.addIndicators(item));
            }
        }
        for (var _a = 0, customSourceIndicators_2 = customSourceIndicators; _a < customSourceIndicators_2.length; _a++) {
            var item = customSourceIndicators_2[_a];
            addedIndicators.push(this.addIndicators(item));
        }
        return addedIndicators;
    };
    ChartImplementation.prototype.getChartAnnotations = function () {
        return this.customChartPanelObjectsManager.getChartAnnotations();
    };
    ChartImplementation.prototype.setCutOffDate = function (cutoffDate) {
        this._cutOffDate = cutoffDate;
    };
    ChartImplementation.prototype.getCutOffDate = function () {
        return this._cutOffDate;
    };
    ChartImplementation.prototype.markCutoffDataAsLoaded = function () {
        this._cutOffDataLoaded = true;
    };
    ChartImplementation.prototype.cutOffDataIsLoaded = function () {
        return this._cutOffDataLoaded;
    };
    ChartImplementation.prototype.mapThemeForBackwardCompatibility = function (theme) {
        ThemeUtils.mapThemeValuesForBackwardCompatibility(theme, this.getDefaultTheme());
    };
    ChartImplementation.prototype.getThemeType = function () {
        return this._themeType;
    };
    return ChartImplementation;
}(EventableObject));
export { ChartImplementation };
//# sourceMappingURL=ChartImplementation.js.map