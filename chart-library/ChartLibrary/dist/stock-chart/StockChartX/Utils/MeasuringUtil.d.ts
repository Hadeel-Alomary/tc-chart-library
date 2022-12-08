import { ChartPoint } from "../Graphics/ChartPoint";
import { ChartPanel } from "../ChartPanels/ChartPanel";
export interface IMeasurementValues {
    barsCount: number;
    change: number;
    changePercentage: number;
    period: string;
}
export interface IMeasurementPoint {
    date: Date;
    price: number;
}
export declare class MeasuringUtil {
    private constructor();
    static getMeasuringValues(points: ChartPoint[], chartPanel: ChartPanel): IMeasurementValues;
    private static getChangValues;
    private static getBarsCount;
    private static getPeriod;
    private static mapToCandleDate;
}
//# sourceMappingURL=MeasuringUtil.d.ts.map