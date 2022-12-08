import { IStateProvider } from "../Data/IStateProvider";
import { ChartPanelValueScale } from "./ChartPanelValueScale";
import { IConstructor } from "../Utils/ClassRegistrar";
export interface IValueScaleMajorTick {
    y: number;
    value: number;
    text: string;
}
export interface IValueScaleMinorTick {
    y: number;
}
export interface IValueScaleCalibratorConfig {
}
export interface IValueScaleCalibratorOptions {
}
export interface IValueScaleCalibratorState {
    className: string;
    options: IValueScaleCalibratorOptions;
}
export interface IValueScaleCalibrator extends IStateProvider<IValueScaleCalibratorState> {
    majorTicks: IValueScaleMajorTick[];
    minorTicks: IValueScaleMinorTick[];
    calibrate(valueScale: ChartPanelValueScale): void;
}
export declare abstract class ValueScaleCalibrator implements IValueScaleCalibrator {
    static get className(): string;
    static registeredCalibrators: Object;
    static register: (typeOrClassName: string | typeof ValueScaleCalibrator, constructor?: IConstructor<IValueScaleCalibrator>) => void;
    static deserialize: (state: IValueScaleCalibratorState) => IValueScaleCalibrator;
    private _majorTicks;
    get majorTicks(): IValueScaleMajorTick[];
    private _minorTicks;
    get minorTicks(): IValueScaleMinorTick[];
    protected _options: IValueScaleCalibratorOptions;
    constructor(config?: IValueScaleCalibratorConfig);
    calibrate(valueScale: ChartPanelValueScale): void;
    protected _calibrateMinorTicks(ticksCount: number): void;
    saveState(): IValueScaleCalibratorState;
    loadState(state: IValueScaleCalibratorState): void;
}
//# sourceMappingURL=ValueScaleCalibrator.d.ts.map