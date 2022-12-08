import { IStateProvider } from "../Data/IStateProvider";
import { ChartPanel } from './ChartPanel';
import { Chart } from "../Chart";
import { ValueScale } from "../Scales/ValueScale";
import { Projection } from "../Scales/Projection";
import { ChartEventsExtender } from "../Utils/ChartEventsExtender";
import { ChartPanelValueScale } from "../Scales/ChartPanelValueScale";
export interface IChartPanelObject extends IStateProvider<IChartPanelObjectState> {
    chartPanel: ChartPanel;
    chart: Chart;
    valueScale: ValueScale;
    projection: Projection;
}
export interface IChartPanelObjectConfig {
    options?: IChartPanelObjectOptions;
}
export interface IChartPanelObjectOptions {
    id: string;
    visible: boolean;
    valueScaleIndex: number;
    showValueMarkers: boolean;
    locked: boolean;
}
export interface IChartPanelObjectState {
    options?: IChartPanelObjectOptions;
    panelIndex?: number;
    valueScaleIndex?: number;
}
export declare abstract class ChartPanelObject extends ChartEventsExtender implements IChartPanelObject {
    protected _options: IChartPanelObjectOptions;
    private _panel;
    get options(): IChartPanelObjectOptions;
    get chartPanel(): ChartPanel;
    set chartPanel(value: ChartPanel);
    protected get context(): CanvasRenderingContext2D;
    private _valueScale;
    get valueScale(): ValueScale;
    set valueScale(value: ValueScale);
    get panelValueScale(): ChartPanelValueScale;
    get projection(): Projection;
    get visible(): boolean;
    set visible(value: boolean);
    constructor(chart: Chart, config: IChartPanelObjectConfig);
    protected _setOption(key: string, value: unknown, valueChangedEventName?: string): void;
    protected _onChartPanelChanged(oldValue: ChartPanel): void;
    protected _onValueScaleChanged(oldValue: ValueScale): void;
    protected _onVisibleChanged(oldValue: boolean): void;
    saveState(): IChartPanelObjectState;
    loadState(state: IChartPanelObjectState): void;
    draw(): void;
}
//# sourceMappingURL=ChartPanelObject.d.ts.map