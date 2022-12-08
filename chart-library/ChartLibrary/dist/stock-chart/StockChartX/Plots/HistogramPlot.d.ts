import { IPlotConfig, IPlotDefaults, IPlotOptions, Plot } from './Plot';
import { IPoint } from "../Graphics/ChartPoint";
import { IMinMaxValues } from "../Data/DataSeries";
import { Chart } from '../Chart';
export interface IHistogramPlotOptions extends IPlotOptions {
    baseValue: number;
    columnWidthRatio: number;
    minColumnWidth: number;
}
export interface IHistogramPlotConfig extends IPlotConfig {
    baseValue?: number;
    columnWidthRatio?: number;
    minColumnWidth?: number;
}
export interface IHistogramPlotDefaults extends IPlotDefaults {
    baseValue: number;
    columnWidthRatio: number;
    minWidth: number;
}
export declare class HistogramPlot extends Plot {
    static Style: {
        COLUMNBYPRICE: string;
        COLUMNBYVALUE: string;
    };
    static defaults: IHistogramPlotDefaults;
    get baseValue(): number;
    set baseValue(value: number);
    get columnWidthRatio(): number;
    set columnWidthRatio(value: number);
    get minColumnWidth(): number;
    set minColumnWidth(value: number);
    constructor(chart: Chart, config?: IHistogramPlotConfig);
    draw(): void;
    drawSelectionPoints(): void;
    private _drawColumnsByValue;
    private _drawColumnsByPrice;
    private _drawColoredColumns;
    hitTest(point: IPoint): boolean;
    drawValueMarkers(): void;
    updateMinMaxForSomePlotsIfNeeded(min: number, max: number): IMinMaxValues<number>;
}
//# sourceMappingURL=HistogramPlot.d.ts.map