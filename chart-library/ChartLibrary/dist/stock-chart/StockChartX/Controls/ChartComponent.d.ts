import { Chart } from "../Chart";
import { Component, IComponent } from "./Component";
import { IStateProvider } from "../Data/IStateProvider";
export interface IChartComponentConfig {
    chart: Chart;
}
export interface IChartComponentState {
}
export interface IChartComponent extends IComponent, IStateProvider<IChartComponentState> {
    chart: Chart;
    draw(): void;
    destroy(): void;
}
export declare abstract class ChartComponent extends Component implements IChartComponent {
    private _chart;
    get chart(): Chart;
    constructor(config: IChartComponentConfig);
    protected _subscribeEvents(): void;
    protected _unsubscribeEvents(): void;
    abstract saveState(): IChartComponentState;
    abstract loadState(state: IChartComponentState): void;
    abstract draw(): void;
    destroy(): void;
}
//# sourceMappingURL=ChartComponent.d.ts.map