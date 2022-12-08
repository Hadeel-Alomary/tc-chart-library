import { IPlotConfig, IPlotOptions, IPlotDefaults, Plot } from './Plot';
import { IPoint } from "../Graphics/ChartPoint";
import { Chart } from '../Chart';
export interface IBarPlotOptions extends IPlotOptions {
    columnWidthRatio: number;
    minWidth: number;
}
export interface IBarPlotConfig extends IPlotConfig {
    columnWidthRatio?: number;
    minWidth?: number;
}
export interface IBarPlotDefaults extends IPlotDefaults {
    columnWidthRatio: number;
    minWidth: number;
}
export declare class BarPlot extends Plot {
    static Style: {
        OHLC: string;
        COLORED_OHLC: string;
        HLC: string;
        COLORED_HLC: string;
        HL: string;
        COLORED_HL: string;
        CANDLE: string;
        HOLLOW_CANDLE: string;
        HEIKIN_ASHI: string;
        RENKO: string;
        LINE_BREAK: string;
        POINT_AND_FIGURE: string;
        KAGI: string;
    };
    static defaults: IBarPlotDefaults;
    get columnWidthRatio(): number;
    set columnWidthRatio(value: number);
    get minWidth(): number;
    set minWidth(value: number);
    constructor(chart: Chart, config?: IBarPlotConfig);
    updateDataSeriesIfNeeded(): void;
    draw(): void;
    drawValueMarkers(): void;
    hitTest(point: IPoint): boolean;
    drawSelectionPoints(): void;
    private _drawBars;
    private _drawColoredBars;
    private _drawColoredBarItems;
    private _drawCandles;
    private _drawCandleItems;
    private _drawHollowCandles;
    private _drawHollowCandleItems;
    private _drawBricks;
    private _drawBrickItems;
    private _drawKagi;
    private _drawKagiItems;
    private updateRenkoDataSeries;
    private updateHeikinAshiDataSeries;
}
//# sourceMappingURL=BarPlot.d.ts.map