import { IPriceStyleConfig, IPriceStyleState, PriceStyle } from "./PriceStyle";
import { Plot } from "../Plots/Plot";
import { Chart } from '../Chart';
export declare const KagiReversalKind: {
    ATR: string;
    FIXED: string;
};
export interface IKagiReversalAmount {
    kind: string;
    value: number;
}
export interface IKagiPriceStyleDefaults {
    reversal: IKagiReversalAmount;
}
export interface IKagiPriceStyleConfig extends IPriceStyleConfig {
    reversal: IKagiReversalAmount;
}
export interface IKagiPriceStyleState extends IPriceStyleState {
    reversal: IKagiReversalAmount;
}
export declare class KagiPriceStyle extends PriceStyle {
    static defaults: IKagiPriceStyleDefaults;
    static get className(): string;
    private _reversal;
    get reversal(): IKagiReversalAmount;
    set reversal(value: IKagiReversalAmount);
    private _reversalValue;
    get reversalValue(): number;
    constructor(config?: IKagiPriceStyleConfig);
    saveState(): IKagiPriceStyleState;
    loadState(state?: IKagiPriceStyleState): void;
    createPlot(chart: Chart): Plot;
    dataSeriesSuffix(): string;
    primaryDataSeriesSuffix(suffix: string): string;
    private _calculateReversalValue;
    updateComputedDataSeries(): void;
}
//# sourceMappingURL=KagiPriceStyle.d.ts.map