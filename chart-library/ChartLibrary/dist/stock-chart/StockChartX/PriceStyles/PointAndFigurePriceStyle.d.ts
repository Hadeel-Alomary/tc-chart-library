import { IPriceStyleConfig, IPriceStyleState, PriceStyle } from "./PriceStyle";
import { Plot } from "../Plots/Plot";
import { Chart } from '../Chart';
export declare const PointAndFigureBoxSizeKind: {
    ATR: string;
    FIXED: string;
};
export interface IPointAndFigureBoxSize {
    kind: string;
    value: number;
}
export interface IPointAndFigurePriceStyleDefaults {
    boxSize: IPointAndFigureBoxSize;
    reversal: number;
}
export interface IPointAndFigurePriceStyleConfig extends IPriceStyleConfig {
    boxSize: IPointAndFigureBoxSize;
    reversal: number;
}
export interface IPointAndFigurePriceStyleState extends IPriceStyleState {
    boxSize: IPointAndFigureBoxSize;
    reversal: number;
}
export declare class PointAndFigurePriceStyle extends PriceStyle {
    static defaults: IPointAndFigurePriceStyleDefaults;
    static get className(): string;
    private _boxSize;
    get boxSize(): IPointAndFigureBoxSize;
    set boxSize(value: IPointAndFigureBoxSize);
    private _reversal;
    get reversal(): number;
    set reversal(value: number);
    private _boxSizeValue;
    get boxSizeValue(): number;
    constructor(config?: IPointAndFigurePriceStyleConfig);
    saveState(): IPointAndFigurePriceStyleState;
    loadState(state?: IPointAndFigurePriceStyleState): void;
    createPlot(chart: Chart): Plot;
    dataSeriesSuffix(): string;
    primaryDataSeriesSuffix(suffix: string): string;
    private _calculateBoxSizeValue;
    updateComputedDataSeries(): void;
}
//# sourceMappingURL=PointAndFigurePriceStyle.d.ts.map