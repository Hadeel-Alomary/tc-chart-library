/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


/**
 * The event handler callback.
 * @callback EventHandler
 * @param {Object} event The event object.
 * @memberOf StockChartX
 */

/**
 * The save image callback function.
 * @callback CanvasImageCallback
 * @param {HTMLCanvasElement} canvas The rendering canvas.
 * @memberOf StockChartX
 */

import {TimeSpan} from "./Data/TimeFrame";
import {EventableObject, EventHandler, IEventableObject} from "./Utils/EventableObject";
import {Drawing, IDrawingState} from "./Drawings/Drawing";
import {DateScale} from "./Scales/DateScale";
import {ValueScale} from "./Scales/ValueScale";
import {ChartPanelsContainer} from "./ChartPanels/ChartPanelsContainer";
import {DataManager, IBarDataSeries, IBar} from "./Data/DataManager";
import {ISize, Rect} from "./Graphics/Rect";
import {Indicator} from "./Indicators/Indicator";
import {IValueMarker} from "./Scales/ValueMarker";
import {IPriceStyle} from "./PriceStyles/PriceStyle";
import {CrossHair, CrossHairType} from './CrossHair';
import {SelectionMarker} from "./SelectionMarker";
import {ChartPanel} from "./ChartPanels/ChartPanel";
import {DataSeries} from "./Data/DataSeries";
import {ZoomTool} from "./Tools/ZoomTool";
import {MeasurementTool} from "./Tools/MeasurementTool";
import {ChartAnnotation} from "./ChartAnnotations/ChartAnnotation";
import {ChartPanelSplitter} from "./ChartPanels/ChartPanelSplitter";
import {AxisScaleType} from './Scales/axis-scale-type';
import {TradingOrder, TradingPosition} from '../../services/trading/broker/models';
import {CategoryNews} from '../../services/news';
import {IWaitingBarConfig, Plot} from '..';
import {ChartAlert} from '../../services/alert';
import {IChartState} from './ChartImplementation';
import {ChartTheme} from './Theme';
import {ThemeType} from './ThemeType';
import {MovingAverageOptions} from './MovingAverageOptions';

/**
 * The instrument structure.
 * @typedef {} Instrument
 * @type {object}
 * @property {string} symbol The symbol name. E.g. 'AAPL'.
 * @property {string} [company] The company name. E.g. 'Apple Inc.'.
 * @property {string} [exchange] The exchange. E.g. 'NSDQ'.
 * @memberOf StockChartX
 */

export interface IInstrument {
    symbol: string;
    company?: string;
    exchange?: string;
}


export interface IChartConfig {
    container?: JQuery;
    width?: number;
    height?: number;
    timeInterval?: number;
    theme?: ChartTheme;
    instrument?: IInstrument;
    priceStyle?: string;
    crossHair?: string;
    showToolbar?: boolean;
    showNavigation?: boolean;
    fullWindowMode?: boolean;
    readOnly?: boolean;
    onToolbarLoaded?: () => void;
    isInteractive?: boolean;
    hostId?: string;
    showBarInfoInTitle?:boolean;
    showPanelOptions?:boolean;
    enableKeyboardEvents?:boolean;
}

export interface ChartOptions {
    locale: string;
    enableKeyboardEvents: boolean;
    theme: ChartTheme;
    showBarInfoInTitle: boolean;
    showPanelOptions:boolean;
    priceStyle?: string;
    magnetRatio?: number;
}

export interface DateRange {
    startDate: Date,
    endDate: Date
}

export interface ICanvasImageCallback {
    (canvas: HTMLCanvasElement): void;
}

/**
 * Path to the folder which contains UI views (dialogs, menus, etc.).
 * @type {string}
 * @default 'view/'
 */

export const ChartState = {
    NORMAL: 0,
    RESIZING_PANELS: 1,
    USER_DRAWING: 2,
    ZOOMING: 3,
    MEASURING: 4
};
Object.freeze(ChartState);

/**
 * Chart events enumeration values.
 * @enum {string}
 * @readonly
 * @memberOf StockChartX
 */
export const ChartEvent = {
    /** Window mode changed (default | fullscreen). */
    WINDOW_MODE_CHANGED: 'chartWindowModeChanged',

    /** Chart toolbar loaded. */
    TOOLBAR_LOADED: 'chartToolbarLoaded',

    /** Chart state changed. */
    STATE_CHANGED: 'chartStateChanged',

    /** Chart time interval changed (gChart.timeInterval). */
    TIME_INTERVAL_CHANGED: 'chartTimeIntervalChanged',

    /** New indicator added. */
    INDICATOR_ADDED: 'chartIndicatorAdded',

    /** Indicator removed. */
    INDICATOR_REMOVED: 'chartIndicatorRemoved',

    /** Chart theme changed. */
    THEME_CHANGED: 'chartThemeChanged',

    /** Chart global theme changed. */
    GLOBAL_THEME_CHANGED: 'chartGlobalThemeChanged',

    /** Chart price style changed. */
    PRICE_STYLE_CHANGED: 'chartPriceStyleChanged',

    /** Chart hover record changed. */
    HOVER_RECORD_CHANGED: 'chartHoverRecordChanged',

    /** Chart instrument changed (object gChart.instrument). */
    INSTRUMENT_CHANGED: 'chartInstrumentChanged',

    /** Symbol changed in the toolbar's Instrument selector. */
    SYMBOL_ENTERED: 'chartSymbolEntered',

    /** Time frame changed in the toolbar. */
    TIME_FRAME_CHANGED: 'chartTimeFrameChanged',

    /** Crosshair type changed. */
    CROSS_HAIR_CHANGED: 'chartCrossHairChanged',

    /** Chart state loaded (after gChart.loadState). */
    STATE_LOADED: 'chartStateLoaded',

    /** Chart locale changed. */
    LOCALE_CHANGED: 'chartLocaleChanged',

    /** Chart value scale added. */
    VALUE_SCALE_ADDED: 'chartValueScaleAdded',

    /** Chart value scale removed. */
    VALUE_SCALE_REMOVED: 'chartValueScaleRemoved',


    /** Drawing started (by user). */
    USER_DRAWING_STARTED: 'chartUserDrawingStarted',

    /** Drawing finished (by user). */
    USER_DRAWING_FINISHED: 'chartUserDrawingFinished',

    /** New chart panel added. */
    PANEL_ADDED: 'chartPanelAdded',

    /** Chart panel removed. */
    PANEL_REMOVED: 'chartPanelRemoved',

    /** Chart panel toggle maximize */
    PANEL_TOGGLE_MAXIMIZE: 'chartPanelToggleMaximize',

    /** Date scale theme changed. */
    DATE_SCALE_THEME_CHANGED: 'dateScaleThemeChanged',

    /** First visible record changed. */
    FIRST_VISIBLE_RECORD_CHANGED: 'firstVisibleRecordChanged',

    /** Last visible record changed. */
    LAST_VISIBLE_RECORD_CHANGED: 'lastVisibleRecordChanged',

    /** More historical data requested. Can be used to dynamically load historical data gradually. Fired when user scrolls chart to the beginning. */
    MORE_HISTORY_REQUESTED: 'chartMoreHistoryRequested',

    /** Zooming finished */
    USER_ZOOMING_FINISHED: 'chartZoomingFinished',

    /** Measuring finished */
    USER_MEASURING_FINISHED: 'chartMeasuringFinished',

    /*Symbol Changed*/
    SYMBOL_CHANGED: 'chartSymbolChanged',

    /* show objects tree */
    SHOW_OBJECTS_TREE: 'showObjectsTree',

    SHOW_SETTINGS_DIALOG:'showSettingsDialog',

    BUY_SYMBOL: 'chartBuySymbol',

    SELL_SYMBOL: 'chartSellSymbol',

    STOP_SYMBOL: 'chartStopSymbol',

    EDIT_ORDER: 'chartEditOrder',

    EDIT_TAKE_PROFIT: 'chartEditTakeProfit',

    EDIT_STOP_LOSS: 'chartEditStopLoss',

    CANCEL_ORDER: 'chartCancelOrder',

    CANCEL_TAKE_PROFIT: 'chartCancelTakeProfit',

    CANCEL_STOP_LOSS: 'chartCancelStopLoss',

    SELL_POSITION: 'chartSellPosition',

    REVERSE_POSITION:'chartReversePosition',

    CLOSE_POSITION:'chartClosePosition',

    BOUND_POSITION_CLICKED:'chartBoundPositionClicked',

    ADD_ALERT: 'chartAddAlert',

    SHOW_NEWS_DETAILS: 'chartShowNewsDetails',

    SHOW_TREND_LINE_ALERT_DETAILS: 'chartShowTrendLineAlertDetails',

    UPDATE_TREND_LINE_ALERT: 'chartUpdateTrendLineAlert',

    DELETE_ALERT: 'chartDeleteAlert',

    UNSUPPORTED_TREND_LINE_ALERT_PANEL: 'chartUnsupportedTrendLineAlertPanel',

    SHOW_CHART_ALERT_DETAILS: 'chartShowChartAlertDetails',

    DELETE_INDICATOR_ALERTS: 'chartDeleteIndicatorAlerts',

    MOBILE_LONG_PRESS: 'chartMobileLongPress',

    DISABLE_REFRESH_TRADING_DRAWINGS: 'chartDisableRefreshTradingDrawings',

};


Object.freeze(ChartEvent);

export let getAllInstruments = (): IInstrument[] => {
    return [];
};

/**
 * Describes chart component.
 * @param {Object} config              The configuration object.
 * @param {String} config.container    The jQuery selector of html element to hold the chart.
 * @param {Number} [config.width]        The width of chart.
 * @param {Number} [config.height]       The height of chart.
 * @param {Number} [config.timeInterval] The bars time interval in milliseconds. See {@link TimeSpan} for predefined values.
 * @param {Object} [config.theme] The theme.
 * @param {Instrument} [config.instrument] The instrument.
 * @param {String} [config.priceStyle] The price style.
 * @param {String} [config.crossHair] The cross hair.
 * @param {Boolean} [config.showToolbar = true] Toolbar will be visible if true.
 * @param {Boolean} [config.showNavigation = true] Navigation bar will be visible if true.
 * @param {Boolean} [config.fullWindowMode = false] Tha chart will be ran in full window mode if true.
 * @constructor Chart
 * @example <caption>Add div element into the html.</caption>
 *  <div id="chartContainer"></div>

 * @example <caption>Instantiate chart object.</caption>
 *  var chart = new Chart({
     *      container: '#chartContainer',
     *      width: 800,
     *      height: 600
     *  });
 *
 *  @example <caption>Also it is possible to use it as jQuery plugin.</caption>
 *  var chart = $('#chartContainer').StockChartX({
     *      width: 800,
     *      height: 600
     *  });
 */


export interface Chart extends IEventableObject{

    //General
    instrument: IInstrument;
    timeInterval: number;
    marketTradingMinutesCount: number;
    magnetRatio: number;
    crossHairType: string;
    hoveredRecord: number;
    chartPanelsContainer: ChartPanelsContainer;
    theme: ChartTheme;
    rootDiv: JQuery;
    size: ISize;
    lastVisibleRecord: number;
    firstVisibleRecord: number;
    lastVisibleIndex: number;
    firstVisibleIndex: number;
    recordCount: number;
    selectedObject: Drawing | Plot;
    locale: string;
    chartPanelsFrame: Rect;
    state: number;
    readOnly: boolean;
    showBarInfoInTitle: boolean;
    showPanelOptions?:boolean;
    crossHair: CrossHair;
    selectionMarker: SelectionMarker;
    valueMarker: IValueMarker;
    isInFullWindowMode: boolean;
    allowsAutoScaling: boolean;
    isInteractive: boolean;
    hostId: string;
    numberOfDigitFormat:number;
    movingAverageOptions:MovingAverageOptions;

    updateSplitter(splitter: ChartPanelSplitter): void;

    _handleFullWindowResize(): void;

    isVisible(): boolean;

    toggleFullWindow(): void;

    resizeCanvas(): void;

    showWaitingBar(config: IWaitingBarConfig): void;

    hideWaitingBar(): void;

    saveImageWithSize(saveCallback: ICanvasImageCallback, size: ISize): void;

    getValueByGlobalPoint(x: number, y: number): number;

    selectObject(obj: Plot | Drawing): boolean;

    getPanelIndexByGlobalPoint(x: number, y: number): number;

    scrollOnPixels(pixels: number): void;

    handleZoom(pixels: number): void;

    layout(): void;

    setNeedsLayout(): void;

    onVisibilityChanged():void;

    //Theme
    resetDefaultSettings() :void;

    saveAsDefaultSettings():void;

    applyDarkTheme():void;

    applyLightTheme():void;

    //State
    loadState(state: IChartState): void;

    saveState(): IChartState;

    //Update/Layout
    update(): void;

    setNeedsAutoScale(): void;

    setNeedsAutoScaleAll(): void;

    setAxisScale(axisScaleType:AxisScaleType): void;
    getAxisScale(): AxisScaleType;

    setNeedsUpdate(needsAutoScale?: boolean): void;

    setAllowsAutoScaling(enable: boolean): void;

    resetToPeriodDefaultZoomForMobile(): void;

    //Data
    dataManager: DataManager;

    getCommonDataSeries(): IBarDataSeries;

    onData(priceData: { time: string, open: number, high: number, low: number, close: number, volume: number }[], zoomStartDate: string, maintainZoom: boolean, zoomRange: { start: Date, end: Date }, splits: { value: number, date: string }[], showBonusShares: boolean): void;

    getZoomedDateRange(): { start: Date, end: Date };

    dateRange(startDate?: Date, endDate?: Date): DateRange;

    updateComputedDataSeries(): void;

    barDataSeries(): IBarDataSeries;

    appendBars(bars: IBar | IBar[]): void;

    primaryBarDataSeries(symbol?: string): IBarDataSeries;

    primaryDataSeries(suffix: string, symbol?: string): DataSeries;

    removeDataSeries(dataSeries: string | DataSeries): void;

    getDataSeries(name: string): DataSeries;

    findDataSeries(suffix: string): DataSeries;


    //Indicators
    indicators: Indicator[];

    updateIndicators(): void;

    getIndicatorById(id: string): Indicator;

    addIndicators(indicators: number | number[] | Indicator | Indicator[]): Indicator | Indicator[];

    removeIndicators(indicators?: Indicator | Indicator[], removePanelIfNoPlots?: boolean): void;

    removeChildIndicators(sourceIndicatorId: string): void;

    updateCustomSourceIndicators(sourceIndicatorId: string): void;

    moveIndicatorIndexToEnd(indicator: Indicator): void;

    //Drawing
    showDrawings: boolean;

    loadDrawingsState(state: IDrawingState[]): void;

    disableContinuousDrawing(): void;

    enableContinuousDrawing(): void;

    deleteDrawings(): void;

    clearDrawingsOnLoadState(): void;

    cancelUserDrawing(): void;

    updateDrawingsLocking(locked: boolean): void;

    saveDrawingsState(): IDrawingState[];

    startUserDrawing(drawing: Drawing): void;

    getDrawingById(id: string): Drawing;

    updateTradingDrawings(orders: TradingOrder[], position: TradingPosition): void;

    updateChartAlertDrawings(alerts: ChartAlert[]): void;

    addNewsAnnotations(newsList: CategoryNews[]): void;

    _copyDrawing(drawing: Drawing): void;

    _pasteDrawing(): void;

    _finishUserDrawing(drawing:Drawing): void;

    //Panel
    mainPanel: ChartPanel;
    chartPanels: ChartPanel[];

    findPanelAt(y: number): ChartPanel;

    addChartPanel(index?: number, heightRatio?: number, shrinkMainPanel?: boolean): ChartPanel;


    //DateScale
    dateScale: DateScale;

    isVisibleDateScaleGridSessionLines(): boolean;

    toggleDateScaleGridSessionLinesVisibility(): void;


    //ValueScale
    valueScales: ValueScale[];
    valueScale: ValueScale;


    //Tools
    zoomTool: ZoomTool;
    measurementTool: MeasurementTool;

    cancelZoomingIfNeeded(): void;

    cancelMeasuringIfNeeded(): void;

    isZooming(): boolean;

    isMeasuring(): boolean;

    startZooming(): void;

    startMeasuring(): void;

    finishZooming(): void;

    finishMeasuring(): void;

    getChartAnnotations(): ChartAnnotation[];

    //PriceStyle
    priceStyleKind: string;
    priceStyle: IPriceStyle;


    //Eventable Object
    on(events: string, handler: EventHandler, target?: Object): EventableObject;
    off(events: string, target?: Object): EventableObject;
    fireTargetValueChanged(target: Object, eventType: string, newValue?: unknown, oldValue?: unknown): void;

    // helpers for cut off date used by chart-viewer
    setCutOffDate(cutoffDate:string):void;
    getCutOffDate():string;

    markCutoffDataAsLoaded():void;
    cutOffDataIsLoaded():boolean;

    getThemeType():ThemeType;


}
