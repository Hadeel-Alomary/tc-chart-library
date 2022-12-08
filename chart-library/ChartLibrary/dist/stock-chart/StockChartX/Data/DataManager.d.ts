import { DataSeries } from "./DataSeries";
export interface IBar {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
export interface IOHLCDataSeries {
    open: DataSeries;
    high: DataSeries;
    low: DataSeries;
    close: DataSeries;
}
export interface IBarDataSeries extends IOHLCDataSeries {
    date: DataSeries;
    volume: DataSeries;
}
export declare class DataManager {
    private _dataSeries;
    get dateDataSeries(): DataSeries;
    findDataSeries(suffix: string): DataSeries;
    getDataSeries(name: string, addIfNotFound?: boolean): DataSeries;
    addBarDataSeries(symbol?: string): IBarDataSeries;
    clearDataSeries(dataSeries?: string | DataSeries): void;
    trimDataSeries(maxLength: number): void;
    barDataSeries(prefix?: string, createIfNotFound?: boolean): IBarDataSeries;
    ohlcDataSeries(prefix?: string, createIfNotFound?: boolean): IOHLCDataSeries;
    addDataSeries(dataSeries: string | DataSeries, replaceIfExists?: boolean): DataSeries;
    removeDataSeries(dataSeries?: string | DataSeries): void;
    appendBars(bars: IBar | IBar[]): void;
    bar(index: number): IBar;
}
//# sourceMappingURL=DataManager.d.ts.map