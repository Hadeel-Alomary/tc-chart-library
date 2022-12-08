import { IDrawingConfig, IDrawingOptions, IDrawingState } from '../Drawing';
import { IRect } from "../../Graphics/Rect";
import { IPoint } from "../../Graphics/ChartPoint";
import { ThemedDrawing } from '../ThemedDrawing';
import { ImageDrawingTheme } from '../DrawingThemeTypes';
import { Chart } from '../../Chart';
export interface IImageDrawingConfig extends IDrawingConfig {
    url: string;
}
export interface IImageDrawingOptions extends IDrawingOptions {
    url: string;
}
export declare namespace DrawingEvent {
    const URL_CHANGED = "drawingUrlChanged";
}
export declare class ImageDrawing extends ThemedDrawing<ImageDrawingTheme> {
    static get className(): string;
    private _image;
    get url(): string;
    set url(value: string);
    constructor(chart: Chart, config?: IImageDrawingConfig);
    loadState(state: IDrawingState): void;
    bounds(): IRect;
    private _markerPoints;
    _finishUserDrawing(): void;
    hitTest(point: IPoint): boolean;
    draw(): void;
    private loadImage;
}
//# sourceMappingURL=ImageDrawing.d.ts.map