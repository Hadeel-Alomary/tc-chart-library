import { INumberFormatState, NumberFormat } from './NumberFormat';
export interface IValueScaleNumberFormat extends INumberFormatState {
    numberOfDigits: number;
}
export interface IValueScaleNumberFormatOptions {
    numberOfDigits: number;
}
export declare class ValueScaleNumberFormat extends NumberFormat {
    static get className(): string;
    private _options;
    private _maxVisibleValue;
    constructor(locale?: string);
    format(value: number): string;
    formatAllDigits(value: number): string;
    setDecimalDigits(value: number): void;
    setMaxVisibleValue(maxValue: number): void;
    saveState(): IValueScaleNumberFormat;
    loadState(state: IValueScaleNumberFormat): void;
}
//# sourceMappingURL=ValueScaleNumberFormat.d.ts.map