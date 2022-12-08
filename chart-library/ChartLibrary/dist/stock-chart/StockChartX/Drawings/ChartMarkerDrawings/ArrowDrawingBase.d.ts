import { GeometricMarkerDrawingBase, IGeometricMarkerDrawingBaseConfig, IGeometricMarkerDrawingBaseDefaults, IGeometricMarkerDrawingBaseOptions } from "./GeometricMarkerDrawingBase";
import { ArrowDrawingTheme } from '../DrawingThemeTypes';
import { Chart } from '../../Chart';
export interface IArrowDrawingBaseConfig extends IGeometricMarkerDrawingBaseConfig {
    headRatio?: number;
    tailRatio?: number;
}
export interface IArrowDrawingBaseOptions extends IGeometricMarkerDrawingBaseOptions {
    headRatio?: number;
    tailRatio?: number;
    text?: string;
}
export interface IArrowDrawingBaseDefaults extends IGeometricMarkerDrawingBaseDefaults {
    headRatio: number;
    tailRatio: number;
}
export declare namespace DrawingEvent {
    const ARROW_HEAD_RATIO_CHANGED = "drawingArrowHeadRatioChanged";
    const ARROW_TAIL_RATIO_CHANGED = "drawingArrowTailRatioChanged";
    const TEXT_CHANGED = "drawingTextChanged";
}
export declare class ArrowDrawingBase extends GeometricMarkerDrawingBase<ArrowDrawingTheme> {
    static defaults: IArrowDrawingBaseDefaults;
    get text(): string;
    set text(value: string);
    get headRatio(): number;
    set headRatio(value: number);
    get tailRatio(): number;
    set tailRatio(value: number);
    constructor(chart: Chart, config?: IArrowDrawingBaseConfig);
}
//# sourceMappingURL=ArrowDrawingBase.d.ts.map