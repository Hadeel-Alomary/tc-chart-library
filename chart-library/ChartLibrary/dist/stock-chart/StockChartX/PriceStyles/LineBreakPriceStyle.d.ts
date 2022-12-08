import { IPriceStyleConfig, IPriceStyleState, PriceStyle } from "./PriceStyle";
import { Plot } from "../Plots/Plot";
import { Chart } from '../Chart';
export interface ILineBreakPriceStyleDefaults {
    lines: number;
}
export interface ILineBreakPriceStyleConfig extends IPriceStyleConfig {
    lines: number;
}
export interface ILineBreakPriceStyleState extends IPriceStyleState {
    lines: number;
}
export declare class LineBreakPriceStyle extends PriceStyle {
    static defaults: ILineBreakPriceStyleDefaults;
    static get className(): string;
    private _lines;
    get lines(): number;
    set lines(value: number);
    constructor(config?: ILineBreakPriceStyleConfig);
    saveState(): ILineBreakPriceStyleState;
    loadState(state?: ILineBreakPriceStyleState): void;
    createPlot(chart: Chart): Plot;
    dataSeriesSuffix(): string;
    primaryDataSeriesSuffix(suffix: string): string;
    updateComputedDataSeries(): void;
}
//# sourceMappingURL=LineBreakPriceStyle.d.ts.map