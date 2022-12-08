import { DateTimeFormat, IDateTimeFormatState } from "./DateTimeFormat";
export interface ITimeIntervalDateTimeFormatState extends IDateTimeFormatState {
    timeInterval: number;
}
export declare const DateTimeFormatName: {
    YEAR_MONTH: string;
    MONTH_DAY: string;
    DATE: string;
    SHORT_DATE_TIME: string;
    LONG_DATE_TIME: string;
    SHORT_TIME: string;
    LONG_TIME: string;
};
export declare class TimeIntervalDateTimeFormat extends DateTimeFormat {
    static get className(): string;
    private _formatters;
    private _timeInterval;
    get timeInterval(): number;
    set timeInterval(value: number);
    constructor(timeInterval?: number);
    protected _onLocaleChanged(): void;
    private _clearFormatters;
    private _createFormatter;
    format(date: Date, timeInterval?: number): string;
    formatWithFormatter(date: Date, formatName: string): string;
    formatter(name: string): Intl.DateTimeFormat;
    saveState(): ITimeIntervalDateTimeFormatState;
    loadState(state: ITimeIntervalDateTimeFormatState): void;
}
//# sourceMappingURL=TimeIntervalDateTimeFormat.d.ts.map