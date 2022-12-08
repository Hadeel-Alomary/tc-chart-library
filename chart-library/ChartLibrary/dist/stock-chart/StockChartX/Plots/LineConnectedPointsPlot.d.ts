import { AbstractConnectedPointsPlot, IAbstractConnectedPointsPlotConfig } from "./AbstractConnectedPointsPlot";
import { IPoint } from "../Graphics/ChartPoint";
import { Chart } from '../Chart';
export interface ILineConnectedPointsPlotConfig extends IAbstractConnectedPointsPlotConfig {
}
export declare class LineConnectedPointsPlot extends AbstractConnectedPointsPlot {
    constructor(chart: Chart, config: ILineConnectedPointsPlotConfig);
    draw(): void;
    drawValueMarkers(): void;
    hitTest(point: IPoint): boolean;
    drawSelectionPoints(): void;
    private drawColoredLine;
}
//# sourceMappingURL=LineConnectedPointsPlot.d.ts.map