import { IPriceStyleConfig, IPriceStyleState, PriceStyle } from "./PriceStyle";
import { Plot } from "../Plots/Plot";
import { Chart } from '../Chart';
export interface IRenkoBoxSize {
    kind: string;
    value: number;
}
export interface IRenkoPriceStyleDefaults {
    boxSize: IRenkoBoxSize;
}
export interface IRenkoPriceStyleConfig extends IPriceStyleConfig {
    boxSize: IRenkoBoxSize;
}
export interface IRenkoPriceStyleState extends IPriceStyleState {
    boxSize: IRenkoBoxSize;
}
export declare const RenkoBoxSizeKind: {
    FIXED: string;
    ATR: string;
};
export declare class RenkoPriceStyle extends PriceStyle {
    static defaults: IRenkoPriceStyleDefaults;
    static get className(): string;
    private _boxSize;
    get boxSize(): IRenkoBoxSize;
    set boxSize(value: IRenkoBoxSize);
    private _boxSizeValue;
    get boxSizeValue(): number;
    constructor(config?: IRenkoPriceStyleConfig);
    saveState(): IRenkoPriceStyleState;
    loadState(state?: IRenkoPriceStyleState): void;
    createPlot(chart: Chart): Plot;
    dataSeriesSuffix(): string;
    primaryDataSeriesSuffix(suffix: string): string;
    private _calculateBoxSizeValue;
    updateComputedDataSeries(): void;
}
//# sourceMappingURL=RenkoPriceStyle.d.ts.map