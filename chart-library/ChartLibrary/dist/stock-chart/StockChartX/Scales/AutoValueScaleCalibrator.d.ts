import { IValueScaleCalibratorConfig, ValueScaleCalibrator } from "./ValueScaleCalibrator";
import { ChartPanelValueScale } from "./ChartPanelValueScale";
export interface IAutoValueScaleCalibratorConfig extends IValueScaleCalibratorConfig {
    majorTicks?: {
        minOffset?: number;
    };
    minorTicks?: {
        count?: number;
    };
}
export interface IAutoValueScaleCalibratorDefaults {
    majorTicks: {
        minOffset: number;
    };
    minorTicks: {
        count: number;
    };
}
export declare class AutoValueScaleCalibrator extends ValueScaleCalibrator {
    static defaults: IAutoValueScaleCalibratorDefaults;
    static get className(): string;
    get minValuesOffset(): number;
    set minValuesOffset(value: number);
    get minorTicksCount(): number;
    set minorTicksCount(value: number);
    calibrate(valueScale: ChartPanelValueScale): void;
    private _calibrateMajorTicks;
}
//# sourceMappingURL=AutoValueScaleCalibrator.d.ts.map