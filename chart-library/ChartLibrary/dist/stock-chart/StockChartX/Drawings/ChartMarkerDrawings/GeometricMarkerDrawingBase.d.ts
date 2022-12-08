import { IDrawingConfig, IDrawingDefaults, IDrawingOptions } from "../Drawing";
import { ISize } from "../../Graphics/Rect";
import { IPoint } from "../../Graphics/ChartPoint";
import { ThemedDrawing } from '../ThemedDrawing';
import { DrawingTheme } from '../DrawingThemeTypes';
import { Chart } from '../../Chart';
export interface IGeometricMarkerDrawingBaseConfig extends IDrawingConfig {
    size?: ISize;
}
export interface IGeometricMarkerDrawingBaseOptions extends IDrawingOptions {
    size?: ISize;
}
export interface IGeometricMarkerDrawingBaseDefaults extends IDrawingDefaults {
    size?: ISize;
}
export declare namespace DrawingEvent {
    const SIZE_CHANGED = "drawingSizeChanged";
}
export declare abstract class GeometricMarkerDrawingBase<T extends DrawingTheme> extends ThemedDrawing<T> {
    static get subClassName(): string;
    static defaults: IGeometricMarkerDrawingBaseDefaults;
    get size(): ISize;
    set size(value: ISize);
    constructor(chart: Chart, config?: IGeometricMarkerDrawingBaseConfig);
    hitTest(point: IPoint): boolean;
}
//# sourceMappingURL=GeometricMarkerDrawingBase.d.ts.map