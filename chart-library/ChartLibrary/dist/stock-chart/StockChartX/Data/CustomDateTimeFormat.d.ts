import { DateTimeFormat, IDateTimeFormatState } from "./DateTimeFormat";
export interface ICustomDateTimeFormatState extends IDateTimeFormatState {
    formatString: string;
}
export declare class CustomDateTimeFormat extends DateTimeFormat {
    static get className(): string;
    formatString: string;
    constructor(format?: string);
    format(date: Date): string;
    saveState(): ICustomDateTimeFormatState;
    loadState(state: ICustomDateTimeFormatState): void;
}
//# sourceMappingURL=CustomDateTimeFormat.d.ts.map