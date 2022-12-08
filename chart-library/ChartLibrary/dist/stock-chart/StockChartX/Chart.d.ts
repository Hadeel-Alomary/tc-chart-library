import { EventableObject, EventHandler, IEventableObject } from "./Utils/EventableObject";
import { Drawing, IDrawingState } from "./Drawings/Drawing";
import { DateScale } from "./Scales/DateScale";
import { ValueScale } from "./Scales/ValueScale";
import { ChartPanelsContainer } from "./ChartPanels/ChartPanelsContainer";
import { DataManager, IBarDataSeries, IBar } from "./Data/DataManager";
import { ISize, Rect } from "./Graphics/Rect";
import { Indicator } from "./Indicators/Indicator";
import { IValueMarker } from "./Scales/ValueMarker";
import { IPriceStyle } from "./PriceStyles/PriceStyle";
import { CrossHair } from './CrossHair';
import { SelectionMarker } from "./SelectionMarker";
import { ChartPanel } from "./ChartPanels/ChartPanel";
import { DataSeries } from "./Data/DataSeries";
import { ZoomTool } from "./Tools/ZoomTool";
import { MeasurementTool } from "./Tools/MeasurementTool";
import { ChartAnnotation } from "./ChartAnnotations/ChartAnnotation";
import { ChartPanelSplitter } from "./ChartPanels/ChartPanelSplitter";
import { AxisScaleType } from './Scales/axis-scale-type';
import { TradingOrder, TradingPosition } from '../../services/trading/broker/models';
import { CategoryNews } from '../../services/data/news';
import { IWaitingBarConfig, Plot } from '..';
import { ChartAlert } from '../../services/data/alert';
import { IChartState } from './ChartImplementation';
import { ChartTheme } from './Theme';
import { ThemeType } from './ThemeType';
import { MovingAverageOptions } from './MovingAverageOptions';
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
    showBarInfoInTitle?: boolean;
    showPanelOptions?: boolean;
    enableKeyboardEvents?: boolean;
}
export interface ChartOptions {
    locale: string;
    enableKeyboardEvents: boolean;
    theme: ChartTheme;
    showBarInfoInTitle: boolean;
    showPanelOptions: boolean;
    priceStyle?: string;
    magnetRatio?: number;
}
export interface DateRange {
    startDate: Date;
    endDate: Date;
}
export interface ICanvasImageCallback {
    (canvas: HTMLCanvasElement): void;
}
export declare const ChartState: {
    NORMAL: number;
    RESIZING_PANELS: number;
    USER_DRAWING: number;
    ZOOMING: number;
    MEASURING: number;
};
export declare const ChartEvent: {
    WINDOW_MODE_CHANGED: string;
    TOOLBAR_LOADED: string;
    STATE_CHANGED: string;
    TIME_INTERVAL_CHANGED: string;
    INDICATOR_ADDED: string;
    INDICATOR_REMOVED: string;
    THEME_CHANGED: string;
    GLOBAL_THEME_CHANGED: string;
    PRICE_STYLE_CHANGED: string;
    HOVER_RECORD_CHANGED: string;
    INSTRUMENT_CHANGED: string;
    SYMBOL_ENTERED: string;
    TIME_FRAME_CHANGED: string;
    CROSS_HAIR_CHANGED: string;
    STATE_LOADED: string;
    LOCALE_CHANGED: string;
    VALUE_SCALE_ADDED: string;
    VALUE_SCALE_REMOVED: string;
    USER_DRAWING_STARTED: string;
    USER_DRAWING_FINISHED: string;
    PANEL_ADDED: string;
    PANEL_REMOVED: string;
    PANEL_TOGGLE_MAXIMIZE: string;
    DATE_SCALE_THEME_CHANGED: string;
    FIRST_VISIBLE_RECORD_CHANGED: string;
    LAST_VISIBLE_RECORD_CHANGED: string;
    MORE_HISTORY_REQUESTED: string;
    USER_ZOOMING_FINISHED: string;
    USER_MEASURING_FINISHED: string;
    SYMBOL_CHANGED: string;
    SHOW_OBJECTS_TREE: string;
    SHOW_SETTINGS_DIALOG: string;
    BUY_SYMBOL: string;
    SELL_SYMBOL: string;
    STOP_SYMBOL: string;
    EDIT_ORDER: string;
    EDIT_TAKE_PROFIT: string;
    EDIT_STOP_LOSS: string;
    CANCEL_ORDER: string;
    CANCEL_TAKE_PROFIT: string;
    CANCEL_STOP_LOSS: string;
    SELL_POSITION: string;
    REVERSE_POSITION: string;
    CLOSE_POSITION: string;
    BOUND_POSITION_CLICKED: string;
    ADD_ALERT: string;
    SHOW_NEWS_DETAILS: string;
    SHOW_TREND_LINE_ALERT_DETAILS: string;
    UPDATE_TREND_LINE_ALERT: string;
    DELETE_ALERT: string;
    UNSUPPORTED_TREND_LINE_ALERT_PANEL: string;
    SHOW_CHART_ALERT_DETAILS: string;
    DELETE_INDICATOR_ALERTS: string;
    MOBILE_LONG_PRESS: string;
    DISABLE_REFRESH_TRADING_DRAWINGS: string;
};
export declare let getAllInstruments: () => IInstrument[];
export interface Chart extends IEventableObject {
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
    showPanelOptions?: boolean;
    crossHair: CrossHair;
    selectionMarker: SelectionMarker;
    valueMarker: IValueMarker;
    isInFullWindowMode: boolean;
    allowsAutoScaling: boolean;
    isInteractive: boolean;
    hostId: string;
    numberOfDigitFormat: number;
    movingAverageOptions: MovingAverageOptions;
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
    onVisibilityChanged(): void;
    resetDefaultSettings(): void;
    saveAsDefaultSettings(): void;
    applyDarkTheme(): void;
    applyLightTheme(): void;
    loadState(state: IChartState): void;
    saveState(): IChartState;
    update(): void;
    setNeedsAutoScale(): void;
    setNeedsAutoScaleAll(): void;
    setAxisScale(axisScaleType: AxisScaleType): void;
    getAxisScale(): AxisScaleType;
    setNeedsUpdate(needsAutoScale?: boolean): void;
    setAllowsAutoScaling(enable: boolean): void;
    resetToPeriodDefaultZoomForMobile(): void;
    dataManager: DataManager;
    getCommonDataSeries(): IBarDataSeries;
    onData(priceData: {
        time: string;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    }[], zoomStartDate: string, maintainZoom: boolean, zoomRange: {
        start: Date;
        end: Date;
    }, splits: {
        value: number;
        date: string;
    }[], showBonusShares: boolean): void;
    getZoomedDateRange(): {
        start: Date;
        end: Date;
    };
    dateRange(startDate?: Date, endDate?: Date): DateRange;
    updateComputedDataSeries(): void;
    barDataSeries(): IBarDataSeries;
    appendBars(bars: IBar | IBar[]): void;
    primaryBarDataSeries(symbol?: string): IBarDataSeries;
    primaryDataSeries(suffix: string, symbol?: string): DataSeries;
    removeDataSeries(dataSeries: string | DataSeries): void;
    getDataSeries(name: string): DataSeries;
    findDataSeries(suffix: string): DataSeries;
    indicators: Indicator[];
    updateIndicators(): void;
    getIndicatorById(id: string): Indicator;
    addIndicators(indicators: number | number[] | Indicator | Indicator[]): Indicator | Indicator[];
    removeIndicators(indicators?: Indicator | Indicator[], removePanelIfNoPlots?: boolean): void;
    removeChildIndicators(sourceIndicatorId: string): void;
    updateCustomSourceIndicators(sourceIndicatorId: string): void;
    moveIndicatorIndexToEnd(indicator: Indicator): void;
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
    _finishUserDrawing(drawing: Drawing): void;
    mainPanel: ChartPanel;
    chartPanels: ChartPanel[];
    findPanelAt(y: number): ChartPanel;
    addChartPanel(index?: number, heightRatio?: number, shrinkMainPanel?: boolean): ChartPanel;
    dateScale: DateScale;
    isVisibleDateScaleGridSessionLines(): boolean;
    toggleDateScaleGridSessionLinesVisibility(): void;
    valueScales: ValueScale[];
    valueScale: ValueScale;
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
    priceStyleKind: string;
    priceStyle: IPriceStyle;
    on(events: string, handler: EventHandler, target?: Object): EventableObject;
    off(events: string, target?: Object): EventableObject;
    fireTargetValueChanged(target: Object, eventType: string, newValue?: unknown, oldValue?: unknown): void;
    setCutOffDate(cutoffDate: string): void;
    getCutOffDate(): string;
    markCutoffDataAsLoaded(): void;
    cutOffDataIsLoaded(): boolean;
    getThemeType(): ThemeType;
}
//# sourceMappingURL=Chart.d.ts.map