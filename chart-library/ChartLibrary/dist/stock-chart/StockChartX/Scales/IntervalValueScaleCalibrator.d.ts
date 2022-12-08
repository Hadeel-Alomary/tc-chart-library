import { IValueScaleCalibratorConfig, ValueScaleCalibrator } from "./ValueScaleCalibrator";
import { ChartPanelValueScale } from "./ChartPanelValueScale";
export interface IIntervalValueScaleCalibratorConfig extends IValueScaleCalibratorConfig {
    majorTicks?: {
        interval?: number;
        minOffset?: number;
    };
    minorTicks?: {
        count?: number;
    };
}
export interface IIntervalValueScaleCalibratorDefaults {
    majorTicks: {
        interval: number;
        minOffset: number;
    };
    minorTicks: {
        count: number;
    };
}
export declare class IntervalValueScaleCalibrator extends ValueScaleCalibrator {
    static defaults: IIntervalValueScaleCalibratorDefaults;
    static get className(): string;
    get interval(): number;
    set interval(value: number);
    get minValuesOffset(): number;
    set minValuesOffset(value: number);
    get minorTicksCount(): number;
    set minorTicksCount(value: number);
    constructor(config?: IIntervalValueScaleCalibratorConfig);
    calibrate(valueScale: ChartPanelValueScale): void;
    private _getValueStep;
    private _calibrateMajorTicks;
}
//# sourceMappingURL=IntervalValueScaleCalibrator.d.ts.map