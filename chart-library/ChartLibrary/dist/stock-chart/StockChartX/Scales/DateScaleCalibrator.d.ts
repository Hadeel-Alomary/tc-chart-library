import { IStateProvider } from "../Data/IStateProvider";
import { DateScale } from "./DateScale";
import { IConstructor } from "../Utils/ClassRegistrar";
export interface IDateScaleMajorTick {
    x: number;
    date: Date;
    textX: number;
    textAlign: string;
    text: string;
    major: boolean;
}
export interface IDateScaleMinorTick {
    x: number;
}
export interface IDateScaleCalibratorConfig {
}
export interface IDateScaleCalibratorOptions {
}
export interface IDateScaleCalibratorState {
    className: string;
    options: IDateScaleCalibratorOptions;
}
export interface IDateScaleCalibrator extends IStateProvider<IDateScaleCalibratorState> {
    majorTicks: IDateScaleMajorTick[];
    minorTicks: IDateScaleMinorTick[];
    calibrate(dateScale: DateScale): void;
}
export declare abstract class DateScaleCalibrator implements IDateScaleCalibrator {
    static get className(): string;
    static registeredCalibrators: Object;
    static register: (typeOrClassName: string | typeof DateScaleCalibrator, constructor?: IConstructor<IDateScaleCalibrator>) => void;
    static deserialize: (state: IDateScaleCalibratorState) => IDateScaleCalibrator;
    protected _majorTicks: IDateScaleMajorTick[];
    get majorTicks(): IDateScaleMajorTick[];
    private _minorTicks;
    get minorTicks(): IDateScaleMinorTick[];
    protected _options: IDateScaleCalibratorOptions;
    constructor(config?: IDateScaleCalibratorConfig);
    calibrate(dateScale: DateScale): void;
    protected _calibrateMinorTicks(ticksCount: number): void;
    saveState(): IDateScaleCalibratorState;
    loadState(state: IDateScaleCalibratorState): void;
}
//# sourceMappingURL=DateScaleCalibrator.d.ts.map