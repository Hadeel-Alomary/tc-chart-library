import { IPlotConfig, IPlotDefaults, IPlotOptions, Plot } from "./Plot";
import { IPoint } from "../Graphics/ChartPoint";
import { IMinMaxValues } from "../Data/DataSeries";
import { Chart } from '../Chart';
export interface IPointPlotOptions extends IPlotOptions {
    pointSize: number;
}
export interface IPointPlotConfig extends IPlotConfig {
    pointSize?: number;
}
export interface IPointPlotDefaults extends IPlotDefaults {
    pointSize: number;
}
export declare class PointPlot extends Plot {
    static Style: {
        DOT: string;
    };
    static defaults: IPointPlotDefaults;
    get pointSize(): number;
    constructor(chart: Chart, config?: IPointPlotConfig);
    draw(): void;
    drawSelectionPoints(): void;
    private drawPoints;
    hitTest(point: IPoint): boolean;
    updateMinMaxForSomePlotsIfNeeded(min: number, max: number): IMinMaxValues<number>;
}
//# sourceMappingURL=PointPlot.d.ts.map