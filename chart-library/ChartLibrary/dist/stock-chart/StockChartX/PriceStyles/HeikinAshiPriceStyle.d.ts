import { PriceStyle } from "./PriceStyle";
import { Plot } from "../Plots/Plot";
import { Chart } from '../Chart';
export declare class HeikinAshiPriceStyle extends PriceStyle {
    static get className(): string;
    createPlot(chart: Chart): Plot;
    dataSeriesSuffix(): string;
    updateComputedDataSeries(): void;
}
//# sourceMappingURL=HeikinAshiPriceStyle.d.ts.map