import { IPlotConfig, IPlotDefaults, Plot } from "./Plot";
import { IPoint } from "../Graphics/ChartPoint";
import { Chart } from '../Chart';
export interface ILinePlotConfig extends IPlotConfig {
}
export interface ILinePlotDefaults extends IPlotDefaults {
}
export declare class LinePlot extends Plot {
    static Style: {
        SIMPLE: string;
        MOUNTAIN: string;
        STEP: string;
    };
    static defaults: ILinePlotDefaults;
    constructor(chart: Chart, config?: ILinePlotConfig);
    draw(): void;
    drawSelectionPoints(): void;
    private _drawSimpleLine;
    private _drawMountainLine;
    private _drawStepLine;
    hitTest(point: IPoint): boolean;
}
//# sourceMappingURL=LinePlot.d.ts.map