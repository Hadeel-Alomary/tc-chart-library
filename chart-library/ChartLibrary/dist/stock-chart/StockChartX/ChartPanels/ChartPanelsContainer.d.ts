import { IPadding, IRect, Rect } from "../Graphics/Rect";
import { ChartPanel } from './ChartPanel';
import { ChartPanelSplitter } from "./ChartPanelSplitter";
import { Chart } from "../Chart";
import { AxisScaleType } from '../Scales/axis-scale-type';
import { IChartPanelsContainerOptions } from './ChartPanelsContainerImplementation';
export interface ChartPanelsContainer {
    panels: ChartPanel[];
    chart: Chart;
    rootDiv: JQuery;
    frame: Rect;
    panelsContentFrame: Rect;
    panelPadding: IPadding;
    movePanel(panel: ChartPanel, offset: number): void;
    addPanel(index?: number, heightRatio?: number, shrinkMainPanel?: boolean): ChartPanel;
    removePanel(panel: number | ChartPanel): void;
    saveState(): IChartPanelsContainerOptions;
    loadState(state: IChartPanelsContainerOptions): void;
    findPanelAt(y: number): ChartPanel;
    setPanelHeightRatio(panel: ChartPanel, ratio: number): void;
    getTotalPanelsHeight(): number;
    setNeedsAutoScale(): void;
    setAxisScale(axisScaleType: AxisScaleType): void;
    getAxisScale(): AxisScaleType;
    layoutSplitterPanels(splitter: ChartPanelSplitter): void;
    layout(frame: IRect): void;
    layoutScalePanel(chartPanelsFrame: Rect): Rect;
    draw(): void;
}
//# sourceMappingURL=ChartPanelsContainer.d.ts.map