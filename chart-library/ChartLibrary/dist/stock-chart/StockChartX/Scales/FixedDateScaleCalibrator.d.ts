import { DateScaleCalibrator, IDateScaleCalibratorConfig } from "./DateScaleCalibrator";
import { DateScale } from "./DateScale";
export interface IFixedDateScaleCalibratorConfig extends IDateScaleCalibratorConfig {
    majorTicks?: {
        count?: number;
        format?: IFixedDateLabelsFormat;
    };
    minorTicks?: {
        count?: number;
    };
}
export interface IFixedDateScaleCalibratorDefaults {
    majorTicks: {
        count: number;
        format?: IFixedDateLabelsFormat;
    };
    minorTicks: {
        count: number;
    };
}
export interface IFixedDateLabelsFormat {
    first?: string;
    last?: string;
    other: string;
}
export declare class FixedDateScaleCalibrator extends DateScaleCalibrator {
    static defaults: IFixedDateScaleCalibratorDefaults;
    static get className(): string;
    private _formatter;
    get majorTicksCount(): number;
    set majorTicksCount(value: number);
    get minorTicksCount(): number;
    set minorTicksCount(value: number);
    get majorTicksFormat(): IFixedDateLabelsFormat;
    set majorTicksFormat(value: IFixedDateLabelsFormat);
    constructor(config?: IFixedDateScaleCalibratorConfig);
    calibrate(dateScale: DateScale): void;
    private _calibrateMajorTicks;
    private _updateFormatterForLabel;
    private static _createAutoFormat;
}
//# sourceMappingURL=FixedDateScaleCalibrator.d.ts.map