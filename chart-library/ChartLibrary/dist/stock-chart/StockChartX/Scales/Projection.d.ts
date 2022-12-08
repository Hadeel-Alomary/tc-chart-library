import { DateScale } from './DateScale';
import { ChartPanelValueScale } from './ChartPanelValueScale';
export declare class Projection {
    private _dateScale;
    get dateScale(): DateScale;
    private _valueScale;
    get valueScale(): ChartPanelValueScale;
    get canResolveX(): boolean;
    get canResolveY(): boolean;
    constructor(dateScale: DateScale, valueScale?: ChartPanelValueScale);
    columnByRecord(record: number, isIntegral?: boolean): number;
    recordByColumn(column: number, isIntegral?: boolean): number;
    xByColumn(column: number, isColumnIntegral?: boolean, isXIntegral?: boolean): number;
    columnByX(x: number, isIntegral?: boolean): number;
    xByRecord(record: number, isIntegral?: boolean, isXIntegral?: boolean): number;
    recordByX(x: number, isIntegral?: boolean): number;
    dateByRecord(record: number): Date;
    recordByDate(date: Date): number;
    private getMarketAbbreviation;
    dateByColumn(column: number): Date;
    columnByDate(date: Date): number;
    dateByX(x: number): Date;
    xByDate(date: Date, isIntegral?: boolean): number;
    percentageByX(x: number): number;
    xByPercentage(percentage: number): number;
    percentageByY(y: number): number;
    yByPercentage(percentage: number): number;
    yByValue(value: number): number;
    private yByValueLinearScale;
    private yByValueLogScale;
    valueByY(y: number): number;
    private isLinearScale;
    private valueByYLinearScale;
    private valueByYLogScale;
    private log;
    private isMainPanel;
}
//# sourceMappingURL=Projection.d.ts.map