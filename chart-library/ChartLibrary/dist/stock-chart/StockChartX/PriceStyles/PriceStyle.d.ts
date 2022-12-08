import { IStateProvider } from "../Data/IStateProvider";
import { Chart } from "../Chart";
import { IConstructor } from "../Utils/ClassRegistrar";
import { Plot } from "../Plots/Plot";
import { ChartPanel } from "../ChartPanels/ChartPanel";
export interface IPriceStyle extends IStateProvider<IPriceStyleState> {
    chart: Chart;
    primaryDataSeriesSuffix(suffix: string): string;
    updateComputedDataSeries(): void;
    apply(): void;
    destroy(): void;
}
export interface IPriceStyleConfig {
    chart?: Chart;
}
export interface IPriceStyleState {
    className: string;
}
export declare abstract class PriceStyle implements IPriceStyle {
    static get className(): string;
    static registeredPriceStyles: Object;
    static register: (typeOrClassName: string | typeof PriceStyle, constructor?: IConstructor<IPriceStyle>) => void;
    static create: (className: string) => IPriceStyle;
    static deserialize: (state: IPriceStyleState) => IPriceStyle;
    protected _plot: Plot;
    get plot(): Plot;
    private _chart;
    get chart(): Chart;
    set chart(value: Chart);
    get chartPanel(): ChartPanel;
    constructor(config?: IPriceStyleConfig);
    saveState(): IPriceStyleState;
    loadState(state: IPriceStyleState): void;
    apply(): void;
    protected createPlot(chart: Chart): Plot;
    dataSeriesSuffix(): string;
    primaryDataSeriesSuffix(suffix: string): string;
    protected removeComputedDataSeries(): void;
    updateComputedDataSeries(): void;
    protected _calculateAtr(period: number): number;
    destroy(): void;
}
//# sourceMappingURL=PriceStyle.d.ts.map