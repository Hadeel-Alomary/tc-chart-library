import { IPlotConfig, IPlotDefaults, Plot } from "./Plot";
import { DataSeries } from "../Data/DataSeries";
import { Chart } from '../Chart';
export interface IKumoPlotConfig extends IPlotConfig {
}
export interface IKumoPlotDefaults extends IPlotDefaults {
}
export declare class KumoPlot extends Plot {
    constructor(chart: Chart, config?: IKumoPlotConfig);
    private static pattern;
    draw(): void;
    drawSelectionPoints(): void;
    buildCloudPattern(context: CanvasRenderingContext2D): CanvasPattern;
    getFirstNotNullValueIndex(dataserie: DataSeries): number;
    getLastNotNullValueIndex(dataserie: DataSeries): number;
}
//# sourceMappingURL=KumoPlot.d.ts.map