import { Chart } from '../Chart';
import { HorizontalLine } from './HorizontalLine';
import { ChartPanel } from '../ChartPanels/ChartPanel';
import { ValueScale } from '../Scales/ValueScale';
import { GestureArray } from '../Gestures/GestureArray';
import { Plot } from '../Plots/Plot';
import { DataSeries } from '../Data/DataSeries';
import { PanGesture } from '../Gestures/PanGesture';
import { Gesture, WindowEvent } from '../Gestures/Gesture';
import { IPoint } from '../Graphics/ChartPoint';
import { ConfirmationCaller } from '../../../components/modals/popup';
import { TAIndicatorParameters } from './TAIndicatorParameters';
import { LineParameter } from './IndicatorsDefaultSettings';
import { Recordset } from '../..';
import { ColumnPlotTheme, LabelConnectedPlotTheme, LineConnectedPlotTheme, LinePlotTheme, PlotTheme, PointPlotTheme } from '../Theme';
export declare type ParameterValueType = number | string | LineParameter[] | boolean;
export interface IIndicatorConfig {
    id?: string;
    chart: Chart;
    panelHeightRatio?: number;
    showParamsInTitle?: boolean;
    showValueMarkers?: boolean;
    showValuesInTitle?: boolean;
    visible?: boolean;
    valueScaleIndex?: number;
    panelIndex?: number;
    isCustomIndicator?: boolean;
    parameters?: Object;
    horizontalLines?: HorizontalLine[];
    customSourceIndicatorId?: string;
}
export interface IIndicatorOptions {
    id?: string;
    valueScaleIndex?: number;
    horizontalLines: HorizontalLine[];
    panelHeightRatio: number;
    showValueMarkers: boolean;
    showValuesInTitle: boolean;
    showParamsInTitle: boolean;
    parameters: {
        [key: string]: ParameterValueType;
    };
    visible: boolean;
    customSourceIndicatorId: string;
    panelIndex?: number;
}
interface IIndicatorTitleControls {
    name: JQuery;
    parameters: JQuery;
    rootDiv: JQuery;
}
export declare abstract class Indicator implements ConfirmationCaller {
    protected _chart: Chart;
    protected _isOverlay: boolean;
    protected _fieldNames: string[];
    protected _panel: ChartPanel;
    private _titleControls;
    protected _plotItems: PlotItem[];
    protected _options: IIndicatorOptions;
    private _valueScale;
    protected _gestures: GestureArray;
    _usePrimaryDataSeries: boolean;
    private _contextMenuPositionPrice;
    get indicatorTypeId(): number;
    get chart(): Chart;
    set chart(value: Chart);
    get chartPanel(): ChartPanel;
    get valueScale(): ValueScale;
    set valueScale(value: ValueScale);
    get isOverlay(): boolean;
    get panelHeightRatio(): number;
    get showValueMarkers(): boolean;
    set showValueMarkers(value: boolean);
    get showValuesInTitle(): boolean;
    set showValuesInTitle(value: boolean);
    get showParamsInTitle(): boolean;
    set showParamsInTitle(value: boolean);
    get parameters(): {
        [key: string]: ParameterValueType;
    };
    set parameters(value: {
        [key: string]: ParameterValueType;
    });
    get fieldNames(): string[];
    get plots(): Plot[];
    get visible(): boolean;
    set visible(value: boolean);
    get isInitialized(): boolean;
    get plotItems(): PlotItem[];
    get horizontalLines(): HorizontalLine[];
    private _contextMenu;
    get customSourceIndicatorId(): string;
    set customSourceIndicatorId(value: string);
    get id(): string;
    set id(value: string);
    get titleControl(): IIndicatorTitleControls;
    isValidAlertParameters(): boolean;
    constructor(config: IIndicatorConfig);
    isAlertable(): boolean;
    hasParameter(paramName: string): boolean;
    getParameterValue(paramName: string): ParameterValueType;
    setParameterValue(paramName: string, paramValue: ParameterValueType): void;
    getName(): string;
    getShortName(): string;
    getPlotName(fieldName: string): string;
    getPlots(): Plot[];
    serialize(): IIndicatorOptions;
    calculate(): CalculationResult;
    protected _initPanel(): void;
    protected _updatePlotItem(index: number): boolean;
    protected _preUpdateSetup(): void;
    update(): void;
    _getFillTheme(): {
        fill: {
            fillColor: ParameterValueType;
        };
    };
    _getFillDataSeries(): DataSeries[];
    _getHistogramTheme(fieldIndex: number): ColumnPlotTheme;
    _getLineConnectedPointsTheme(fieldIndex: number): LineConnectedPlotTheme;
    _getLabelConnectedPointsTheme(fieldIndex: number): LabelConnectedPlotTheme;
    _getPointsTheme(fieldIndex: number): PointPlotTheme;
    _getLineTheme(fieldIndex: number): LinePlotTheme;
    draw(): void;
    drawHorizontalLineValueMarkers(): void;
    destroy(): void;
    private _removeTitleControls;
    showSettingsDialog(): void;
    _getIndicatorPlotType(fieldName: string): string;
    updateHoverRecord(record?: number): void;
    _addPlot(plot: Plot, titleColor: string): PlotItem;
    _initPanelTitle(): void;
    private _updateVisibilityIconState;
    getParametersString(): string;
    getParameters(): TAIndicatorParameters;
    getAlertParameters(): (string | number)[];
    _updatePanelTitle(): void;
    updateTitleControlsVisibility(): void;
    addHorizontalLine(horizontalLine: HorizontalLine): void;
    removeHorizontalLine(index: number): void;
    canHaveHorizontalLine(): boolean;
    setHorizontalLines(horizontalLines: HorizontalLine[]): void;
    resetDefaultSettings(): void;
    saveAsDefaultSettings(): void;
    onSettingsUpdated(): void;
    private _hasDifferentParametersThanAlert;
    _initIndicator(config: IIndicatorConfig): void;
    protected _initIndicatorParameters(config: IIndicatorConfig): void;
    protected _initIndicatorHorizontalLines(config: IIndicatorConfig): void;
    _subscribeEvents(): void;
    _unSubscribeEvents(): void;
    _remove(): void;
    onConfirmation(confirmed: boolean, param: unknown): void;
    _onRemoveIndicator(): void;
    protected _getOverlayIndicatorDefaultSource(): string;
    getOverlayIndicatorDefaultSource(): string;
    protected _initGestures(): void;
    protected _handleDoubleClick(): void;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): void;
    moveIndicatorToNewPanel(newPanel: ChartPanel): void;
    setSelectedSource(source: string): void;
    moveIndicatorToNewAddedPanel(): void;
    protected hitTest(point: IPoint): boolean;
    handleEvent(event: WindowEvent): boolean;
    protected _handleContextMenuGesture(gesture: Gesture, event: WindowEvent): void;
    private _getIndicatorNewPanel;
    private _reInitiateNewPanelTitle;
    private _resetCurrentPanelPlots;
    private _onFinishIndicatorDrag;
    private _addCssClassesForNewIndicatorPanel;
    private _removeCssClassesForAllChartPanels;
    private _applyCurrentPanelCssClasses;
    private _canChangeIndicatorPanel;
    private _updateCustomSourceIndicatorIdIfNeeded;
    private hasSourcePlot;
    protected getVolumeProfilerPlot(index: number, dataSeries: DataSeries, theme: PlotTheme): Plot;
    private _getVolumeProfilerTheme;
}
export interface PlotItem {
    titlePlotSpan: JQuery;
    titleValueSpan: JQuery;
    dataSeries?: DataSeries;
    plot?: Plot;
    color?: string;
}
export interface CalculationResult {
    parameters: string;
    recordSet: Recordset;
    startIndex: number;
}
export interface AddChartAlertEventValue {
    price: number;
    panelIndex: number;
    selectedIndicatorId: string;
}
export {};
//# sourceMappingURL=Indicator.d.ts.map