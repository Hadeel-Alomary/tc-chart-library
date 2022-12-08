import { ChartPanel } from "./ChartPanel";
import { FrameControl } from "../Controls/FrameControl";
import { IPoint } from "../Graphics/ChartPoint";
import { GestureArray } from "../Gestures/GestureArray";
import { WindowEvent } from '../Gestures/Gesture';
import { ChartPanelsContainer } from "./ChartPanelsContainer";
import { Chart } from "../Chart";
import { ChartPanelValueScale, IChartPanelValueScaleState } from '../Scales/ChartPanelValueScale';
import { INumberFormat } from "../Data/NumberFormat";
import { Plot } from "../Plots/Plot";
import { Drawing } from "../Drawings/Drawing";
import { Projection } from "../Scales/Projection";
import { Indicator } from '../Indicators/Indicator';
import { Rect } from "../Graphics/Rect";
import { ValueScale } from "../Scales/ValueScale";
import { IMinMaxValues } from "../Data/DataSeries";
import { ChartAlert } from '../../../services/index';
import { AxisScaleType } from '../Scales/axis-scale-type';
import { TradingDrawing } from '../TradingDrawings/TradingDrawing';
import { TradingOrder, TradingPosition } from '../../../services/trading/broker/models';
import { ChartAlertDrawing } from '../AlertDrawings/ChartAlertDrawing';
export declare class ChartPanelImplementation extends FrameControl implements ChartPanel {
    private _panelsContainer;
    get chartPanelsContainer(): ChartPanelsContainer;
    get chart(): Chart;
    private _valueScales;
    get valueScales(): ChartPanelValueScale[];
    get valueScale(): ChartPanelValueScale;
    get formatter(): INumberFormat;
    set formatter(value: INumberFormat);
    private _canvas;
    get canvas(): JQuery;
    private _context;
    get context(): CanvasRenderingContext2D;
    private _options;
    get heightRatio(): number;
    set heightRatio(ratio: number);
    get minHeightRatio(): number;
    set minHeightRatio(ratio: number);
    get maxHeightRatio(): number;
    set maxHeightRatio(ratio: number);
    get moveDirection(): string;
    set moveDirection(direction: string);
    get moveKind(): string;
    set moveKind(value: string);
    get xGridVisible(): boolean;
    set xGridVisible(visible: boolean);
    get yGridVisible(): boolean;
    set yGridVisible(visible: boolean);
    private _plots;
    get plots(): Plot[];
    private _drawings;
    get drawings(): Drawing[];
    private _tradingDrawings;
    private _futureOrderDrawings;
    get tradingDrawings(): TradingDrawing[];
    private _chartAlertDrawings;
    get chartAlertDrawing(): ChartAlertDrawing[];
    get actualTheme(): import("../Theme").ChartPanelTheme;
    get projection(): Projection;
    get titleDiv(): JQuery<HTMLElement>;
    get indicators(): Indicator[];
    private _contentFrame;
    get contentFrame(): Rect;
    private _controls;
    private _barInfoControls;
    private _updateAnimation;
    private _updateHoverRecordAnimation;
    get maximized(): boolean;
    set maximized(value: boolean);
    constructor(config: IChartPanelState);
    private _fire;
    getIndex(): number;
    getProjection(chartValueScale: ValueScale): Projection;
    getValueScale(chartValueScale: ValueScale): ChartPanelValueScale;
    setHeightRatio(ratio: number): void;
    setNeedsAutoScale(): void;
    setAxisScale(axisScaleType: AxisScaleType): void;
    getAxisScale(): AxisScaleType;
    containsPlot(plot: Plot): boolean;
    addPlot(plot: Plot | Plot[]): void;
    removePlot(plot: Plot | Plot[]): void;
    containsDrawing(drawing: Drawing): boolean;
    addDrawings(drawings: Drawing | Drawing[]): void;
    getTradingOrders(): TradingOrder[];
    updateTradingOrder(order: TradingOrder): void;
    addTradingOrder(order: TradingOrder): void;
    addTradingPosition(position: TradingPosition): void;
    removeTradingPosition(): void;
    removeTradingOrder(order: TradingOrder): void;
    private removeFutureOrders;
    private addFutureOrders;
    getChartAlerts(): ChartAlert[];
    updateChartAlert(alert: ChartAlert): void;
    addChartAlert(alert: ChartAlert): void;
    removeChartAlert(alert: ChartAlert): void;
    deleteDrawings(drawings?: Drawing | Drawing[]): void;
    clearPanelOnLoadState(): void;
    private removeDrawingsFromPanel;
    handleEvent(event: WindowEvent): boolean;
    getMinMaxValues(startIndex: number, count: number, valueScale: ValueScale): IMinMaxValues<number>;
    getAutoScaledMinMaxValues(valueScale: ValueScale): IMinMaxValues<number>;
    formatValue(value: number): string;
    hitTest(point: IPoint): boolean;
    saveState(): IChartPanelState;
    loadState(state: IChartPanelState): void;
    getPreferredValueScaleWidth(chartScale: ValueScale): number;
    layout(frame: Rect): void;
    draw(): void;
    private getReferenceValueMarkerOwner;
    private getValueMarkerOwners;
    private drawValueMarkers;
    drawPlots(): void;
    drawGridLines(): void;
    update(): void;
    setNeedsUpdate(needsAutoScale?: boolean): void;
    _onUpdateAnimationCallback(): void;
    private _hoverRecord?;
    setNeedsUpdateHoverRecord(record?: number): void;
    _onUpdateHoverRecordAnimationCallback(): void;
    destroy(): void;
    private _titleNeedsUpdate;
    private _initInstrumentPanelTitle;
    showPriceStyleFormatDialog(): void;
    updateHoverRecord(record?: number): void;
    hasIndicator(id: string): boolean;
    getPlotIndicator(plot: Plot): Indicator;
    updatePriceStylePlotDataSeriesIfNeeded(): void;
    private _subscribeEvents;
    private _unSubscribeEvents;
    protected _initGestures(): GestureArray;
    private _panGestureHitTest;
    private _handlePanGesture;
    private _handleSwipe;
    private _handleMobileMouseWheel;
    private _handleDesktopMouseWheel;
    private _handleClickGesture;
    private _handleDoubleClickGesture;
    protected _createRootDiv(): JQuery;
    private _layoutHtmlElements;
    private _layoutOptions;
    private _updateInstrument;
    private _applyTheme;
    private _updateWatermark;
    private drawSeparatorForCutOffData;
    private _chartPanelMenu;
    private _initChartPanelMenu;
    private onSelectingMovingAverage;
    private addMovingAverageToCurrentPanel;
}
interface IChartPanelOptions {
    heightRatio?: number;
    minHeightRatio?: number;
    maxHeightRatio?: number;
    moveDirection?: string;
    moveKind?: string;
    showXGrid?: boolean;
    showYGrid?: boolean;
    maximized?: boolean;
}
export interface IChartPanelState {
    chartPanelsContainer?: ChartPanelsContainer;
    options?: IChartPanelOptions;
    valueScales?: IChartPanelValueScaleState[];
    valueScale?: IChartPanelValueScaleState;
}
export {};
//# sourceMappingURL=ChartPanelImplementation.d.ts.map