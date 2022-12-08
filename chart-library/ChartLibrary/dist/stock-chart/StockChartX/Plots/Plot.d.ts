import { ChartPanelObject, IChartPanelObjectConfig, IChartPanelObjectOptions } from "../ChartPanels/ChartPanelObject";
import { DataSeries, IMinMaxValues } from "../Data/DataSeries";
import { ChartPanel } from "../ChartPanels/ChartPanel";
import { ValueScale } from "../Scales/ValueScale";
import { Projection } from "../Scales/Projection";
import { GestureArray } from "../Gestures/GestureArray";
import { WindowEvent } from "../Gestures/Gesture";
import { IPoint } from "../Graphics/ChartPoint";
import { ValueMarkerOwner } from '../ValueMarkerOwner';
import { PlotTheme } from '../Theme';
import { Chart } from '../Chart';
export interface IPlotOptions extends IChartPanelObjectOptions {
    plotStyle: string;
    showValueMarkers: boolean;
}
export interface IPlotConfig extends IChartPanelObjectConfig {
    dataSeries?: DataSeries | DataSeries[];
    chartPanel?: ChartPanel;
    theme?: PlotTheme;
    plotType?: string;
    valueScale?: ValueScale;
    plotStyle?: string;
}
export interface IPlotDrawParams {
    context: CanvasRenderingContext2D;
    projection: Projection;
    dates: Date[];
    values: number[];
    startIndex: number;
    endIndex: number;
    startColumn: number;
    theme: PlotTheme;
}
export interface IPlotValueDrawParams extends IPlotDrawParams {
}
export interface IPlotBarDrawParams extends IPlotDrawParams {
    open: number[];
    high: number[];
    low: number[];
    close: number[];
}
export interface IPlotDefaults {
    plotStyle: string;
}
export declare const PlotType: {
    INDICATOR: string;
    PRICE_STYLE: string;
    USER: string;
};
export declare enum PlotDrawingOrderType {
    IndicatorPlot = 1,
    PricePlot = 2,
    LabelConnectedPlot = 3,
    SelectedPlot = 4,
    PlotsMaxOrder = 5
}
export declare namespace PlotEvent {
    const DATA_SERIES_CHANGED = "plotDataSeriesChanged";
    const PANEL_CHANGED = "plotPanelChanged";
    const THEME_CHANGED = "plotThemeChanged";
    const STYLE_CHANGED = "plotStyleChanged";
    const SHOW_VALUE_MARKERS_CHANGED = "plotShowValueMarkersChanged";
    const VISIBLE_CHANGED = "plotVisibleChanged";
    const VALUE_SCALE_CHANGED = "plotValueScaleChanged";
    const BASE_VALUE_CHANGED = "plotBaseValueChanged";
    const COLUMN_WIDTH_RATIO_CHANGED = "plotColumnWidthRatioChanged";
    const MIN_WIDTH_CHANGED = "plotMinWidthChanged";
    const POINT_SIZE_CHANGED = "plotPointSizeChanged";
}
export declare abstract class Plot extends ChartPanelObject implements ValueMarkerOwner {
    static defaults: IPlotDefaults;
    private _valueMarkerOffset;
    get valueMarkerOffset(): number;
    set valueMarkerOffset(value: number);
    get top(): number;
    private get lastVisibleValue();
    protected _plotThemeKey: string;
    protected _gestures: GestureArray;
    private _dataSeries;
    get dataSeries(): DataSeries[];
    set dataSeries(value: DataSeries[]);
    setDataSeries(dataSeries: DataSeries | DataSeries[]): void;
    private _theme;
    get theme(): PlotTheme;
    set theme(value: PlotTheme);
    get actualTheme(): PlotTheme;
    get plotStyle(): string;
    set plotStyle(value: string);
    get showValueMarkers(): boolean;
    set showValueMarkers(value: boolean);
    protected _plotType: string;
    get plotType(): string;
    set plotType(value: string);
    selected: boolean;
    get drawingOrder(): PlotDrawingOrderType;
    constructor(chart: Chart, config?: IPlotConfig);
    protected _onChartPanelChanged(oldValue: ChartPanel): void;
    protected _onValueScaleChanged(oldValue: ValueScale): void;
    protected _onVisibleChanged(oldValue: boolean): void;
    protected findDataSeries(nameSuffix: string): DataSeries;
    minMaxValues(startIndex: number, count: number): IMinMaxValues<number>;
    updateMinMaxForSomePlotsIfNeeded(min: number, max: number): IMinMaxValues<number>;
    abstract drawSelectionPoints(): void;
    protected _valueDrawParams(): IPlotValueDrawParams;
    protected _barDrawParams(): IPlotBarDrawParams;
    drawValueMarkers(): void;
    updateDataSeriesIfNeeded(): void;
    handleEvent(event: WindowEvent): boolean;
    hitTest(point: IPoint): boolean;
    protected drawSelectionCircle(x: number, y: number): void;
    protected _initGestures(): void;
    private _handleMouseClick;
    private _handleMouseHover;
    private _handleMouseHoverForIndicatorPlot;
    private _handleMouseHoverForPricePlot;
    private _applyCss;
    shouldAffectAutoScalingMaxAndMinLimits(): boolean;
}
//# sourceMappingURL=Plot.d.ts.map