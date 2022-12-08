import { Field } from "../../TASdk/Field";
export declare type TDataSeriesValue = Date | number;
export declare type TDataSeriesValues = Date[] | number[];
export interface IDataSeriesConfig {
    name: string;
    values: Date[] | number[];
}
export interface IMinMaxValues<T> {
    min?: T;
    max?: T;
}
export declare const DataSeriesSuffix: {
    DATE: string;
    OPEN: string;
    HIGH: string;
    LOW: string;
    CLOSE: string;
    VOLUME: string;
    HEIKIN_ASHI: string;
    RENKO: string;
    LINE_BREAK: string;
    POINT_AND_FIGURE: string;
    KAGI: string;
};
export declare class DataSeries {
    private _name;
    get name(): string;
    set name(value: string);
    private _values;
    get values(): TDataSeriesValues;
    set values(value: TDataSeriesValues);
    get length(): number;
    get nameSuffix(): string;
    get isValueDataSeries(): boolean;
    get isDateDataSeries(): boolean;
    get firstValue(): TDataSeriesValue;
    get lastValue(): TDataSeriesValue;
    constructor(config?: string | IDataSeriesConfig);
    static fromField(field: Field, startIndex: number): DataSeries;
    valueAtIndex(index: number, value?: TDataSeriesValue): TDataSeriesValue;
    itemsCountBetweenValues(startValue: number, endValue: number): number;
    add(value: TDataSeriesValue | TDataSeriesValues): void;
    updateLast(value: TDataSeriesValue): void;
    clear(): void;
    trim(maxLength: number): number;
    minMaxValues(startIndex: number, count: number): IMinMaxValues<number>;
    floorIndex(searchValue: TDataSeriesValue): number;
    ceilIndex(searchValue: TDataSeriesValue): number;
    binaryIndexOf(searchElement: TDataSeriesValue): number;
    leftNearestVisibleValueIndex(index: number): number;
    rightNearestVisibleValueIndex(index: number): number;
    toField(name: string): Field;
    fromField(field: Field, startIndex: number): void;
}
//# sourceMappingURL=DataSeries.d.ts.map