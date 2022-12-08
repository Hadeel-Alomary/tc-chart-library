import { INumberFormatState, NumberFormat } from "./NumberFormat";
export interface ICustomNumberFormatState extends INumberFormatState {
    formatString: string;
}
export declare class CustomNumberFormat extends NumberFormat {
    static get className(): string;
    private _options;
    private _formatString;
    get formatString(): string;
    set formatString(value: string);
    constructor(format?: string);
    private _parseFormat;
    format(value: string | number): string;
    saveState(): ICustomNumberFormatState;
    loadState(state: ICustomNumberFormatState): void;
    setDecimalDigits(value: number): void;
}
//# sourceMappingURL=CustomNumberFormat.d.ts.map