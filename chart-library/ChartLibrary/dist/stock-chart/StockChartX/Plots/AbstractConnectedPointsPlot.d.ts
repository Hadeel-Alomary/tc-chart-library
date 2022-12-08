import { IPlotConfig, Plot } from "./Plot";
import { DataSeries } from "../Data/DataSeries";
import { Chart } from '../Chart';
export interface IAbstractConnectedPointsPlotConfig extends IPlotConfig {
    connectedPointsSeries: DataSeries;
}
export declare class AbstractConnectedPointsPlot extends Plot {
    protected connectedPointsSeries: DataSeries;
    constructor(chart: Chart, config: IAbstractConnectedPointsPlotConfig);
    private createDefaultDataSeries;
    drawSelectionPoints(): void;
}
//# sourceMappingURL=AbstractConnectedPointsPlot.d.ts.map