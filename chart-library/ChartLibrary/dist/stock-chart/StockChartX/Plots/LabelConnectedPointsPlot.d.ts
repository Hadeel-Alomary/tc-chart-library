import { AbstractConnectedPointsPlot, IAbstractConnectedPointsPlotConfig } from "./AbstractConnectedPointsPlot";
import { IPoint } from "../Graphics/ChartPoint";
import { PlotDrawingOrderType } from "./Plot";
import { IMinMaxValues } from "../Data/DataSeries";
import { Chart } from '../Chart';
export interface ILabelConnectedPointsPlotConfig extends IAbstractConnectedPointsPlotConfig {
}
export declare class LabelConnectedPointsPlot extends AbstractConnectedPointsPlot {
    private size;
    private textTheme;
    private angle;
    private padding;
    get height(): number;
    constructor(chart: Chart, config: ILabelConnectedPointsPlotConfig);
    draw(): void;
    drawValueMarkers(): void;
    hitTest(point: IPoint): boolean;
    drawSelectionPoints(): void;
    get drawingOrder(): PlotDrawingOrderType;
    updateMinMaxForSomePlotsIfNeeded(min: number, max: number): IMinMaxValues<number>;
    private drawPopupRectangle;
    private drawText;
}
//# sourceMappingURL=LabelConnectedPointsPlot.d.ts.map