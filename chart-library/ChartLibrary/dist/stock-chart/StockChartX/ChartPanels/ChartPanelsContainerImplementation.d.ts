import { IPadding, IRect, Rect } from "../Graphics/Rect";
import { ChartFrameControl, IChartFrameControlConfig } from '../Controls/ChartFrameControl';
import { ChartPanel } from './ChartPanel';
import { ChartPanelSplitter } from "./ChartPanelSplitter";
import { GestureArray } from "../Gestures/GestureArray";
import { WindowEvent } from "../Gestures/Gesture";
import { ChartPanelsContainer } from "./ChartPanelsContainer";
import { AxisScaleType } from '../Scales/axis-scale-type';
export interface IChartPanelsContainerOptions {
    newPanelHeightRatio: number;
    panelPadding: IPadding;
    maximized: boolean;
    panels?: ChartPanel[];
}
export declare class ChartPanelsContainerImplementation extends ChartFrameControl implements ChartPanelsContainer {
    private _panels;
    get panels(): ChartPanel[];
    get newPanelHeightRatio(): number;
    set newPanelHeightRatio(value: number);
    get panelPadding(): IPadding;
    set panelPadding(value: IPadding);
    private _splitters;
    private _options;
    private _panelsContentFrame;
    get panelsContentFrame(): Rect;
    constructor(config: IChartFrameControlConfig);
    protected _initGestures(): GestureArray;
    private _handleMobileContextMenuGesture;
    protected _subscribeEvents(): void;
    protected _unsubscribeEvents(): void;
    addPanel(index?: number, heightRatio?: number, shrinkMainPanel?: boolean): ChartPanel;
    removePanel(panel: number | ChartPanel): void;
    movePanel(panel: ChartPanel, offset: number): void;
    getTotalPanelsHeight(): number;
    findPanelAt(y: number): ChartPanel;
    private _updateSplitters;
    private _getAvailableHeightRatio;
    private _adjustHeightRatiosToEncloseNewRatio;
    setPanelHeightRatio(panel: ChartPanel, ratio: number): void;
    handleEvent(event: WindowEvent): boolean;
    private _handleMouseHoverGesture;
    private _mouseHoverHitTest;
    setNeedsAutoScale(): void;
    setAxisScale(axisScaleType: AxisScaleType): void;
    getAxisScale(): AxisScaleType;
    saveState(): IChartPanelsContainerOptions;
    loadState(stateOrConfig: IChartPanelsContainerOptions | IChartFrameControlConfig): void;
    protected _createRootDiv(): JQuery;
    layoutScalePanel(chartPanelsFrame: Rect): Rect;
    layout(frame: IRect): void;
    private maximizedLayout;
    private normalLayout;
    private hasMaximizedPanel;
    layoutSplitterPanels(splitter: ChartPanelSplitter): void;
    draw(): void;
    destroy(): void;
}
//# sourceMappingURL=ChartPanelsContainerImplementation.d.ts.map