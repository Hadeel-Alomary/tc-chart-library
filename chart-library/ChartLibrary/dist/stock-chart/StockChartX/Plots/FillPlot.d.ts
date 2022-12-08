import { IPlotConfig, IPlotDefaults, Plot } from "./Plot";
import { DataSeries } from "../Data/DataSeries";
import { Chart } from '../Chart';
export interface IFillPlotConfig extends IPlotConfig {
}
export interface IFillPlotDefaults extends IPlotDefaults {
}
export declare class FillPlot extends Plot {
    constructor(chart: Chart, config?: IFillPlotConfig);
    draw(): void;
    drawSelectionPoints(): void;
    getFirstNotNullValueIndex(dataserie: DataSeries): number;
    getLastNotNullValueIndex(dataserie: DataSeries): number;
    drawValueMarkers(): void;
}
//# sourceMappingURL=FillPlot.d.ts.map