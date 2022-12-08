import { ValueScaleCalibrator } from "./ValueScaleCalibrator";
import { ChartPanelValueScale } from "./ChartPanelValueScale";
export interface IFixedValueScaleCalibratorDefaults {
    majorTicks: {
        count: number;
    };
    minorTicks: {
        count: number;
    };
}
export declare class FixedValueScaleCalibrator extends ValueScaleCalibrator {
    static defaults: IFixedValueScaleCalibratorDefaults;
    static get className(): string;
    get majorTicksCount(): number;
    set majorTicksCount(value: number);
    get minorTicksCount(): number;
    set minorTicksCount(value: number);
    calibrate(valueScale: ChartPanelValueScale): void;
    private _calibrateMajorTicks;
}
//# sourceMappingURL=FixedValueScaleCalibrator.d.ts.map