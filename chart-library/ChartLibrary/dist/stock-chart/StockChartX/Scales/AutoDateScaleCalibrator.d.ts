import { DateScaleCalibrator, IDateScaleCalibratorConfig } from './DateScaleCalibrator';
import { DateScale } from "./DateScale";
export interface IAutoDateScaleCalibratorConfig extends IDateScaleCalibratorConfig {
    majorTicks?: {
        minOffset?: number;
    };
    minorTicks?: {
        count?: number;
    };
}
export interface IAutoDateScaleCalibratorDefaults {
    majorTicks: {
        minOffset: number;
    };
    minorTicks: {
        count: number;
    };
}
export declare enum TickType {
    ThreeYears = 1,
    TwoYears = 2,
    OneYear = 3,
    SixMonths = 4,
    FourMonths = 5,
    ThreeMonths = 6,
    OneMonth = 7,
    FifteenDays = 8,
    TenDays = 9,
    FiveDays = 10,
    OneDay = 11,
    HalfTradingDay = 12,
    OneHour = 13,
    ThirteenMinutes = 14,
    FifteenMinutes = 15,
    TenMinutes = 16,
    FiveMinutes = 17,
    OneMinute = 18
}
export declare class AutoDateScaleCalibrator extends DateScaleCalibrator {
    static defaults: IAutoDateScaleCalibratorDefaults;
    static get className(): string;
    get minLabelsOffset(): number;
    set minLabelsOffset(value: number);
    get minorTicksCount(): number;
    set minorTicksCount(value: number);
    private _formatter;
    constructor(config?: IAutoDateScaleCalibratorConfig);
    calibrate(dateScale: DateScale): void;
    private _calibrateMajorTicks;
    private getTimeRangeAsMinutes;
    private getTickType;
    private passTickTypeCondition;
    private getFormattedDateAsString;
    private addFirstTickIfNeeded;
    private removeOverlappingTicks;
    private getMarketTradingMinutesCount;
    private isMajorTick;
}
//# sourceMappingURL=AutoDateScaleCalibrator.d.ts.map