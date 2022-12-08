import { IDrawingOptions } from "../Drawing";
import { IRect } from "../../Graphics/Rect";
import { IPoint } from "../../Graphics/ChartPoint";
import { LineWithLabelDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export interface IVerticalLineDrawingOptions extends IDrawingOptions {
}
export declare class VerticalLineDrawing extends ThemedDrawing<LineWithLabelDrawingTheme> {
    static get className(): string;
    private intradDayTimeIntervals;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    draw(): void;
    drawValue(): void;
    private getFormattedDate;
    protected shouldDrawMarkers(): boolean;
}
//# sourceMappingURL=VerticalLineDrawing.d.ts.map