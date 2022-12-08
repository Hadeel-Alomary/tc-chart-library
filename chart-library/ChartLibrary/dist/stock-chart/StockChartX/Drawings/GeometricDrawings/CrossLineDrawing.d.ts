import { IPoint } from "../../Graphics/ChartPoint";
import { IRect } from "../../Graphics/Rect";
import { LineWithLabelDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class CrossLineDrawing extends ThemedDrawing<LineWithLabelDrawingTheme> {
    static get className(): string;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    draw(): void;
    drawVerticalValue(): void;
    private getFormattedDate;
    private intradDayTimeIntervals;
    drawHorizontalValue(): void;
    protected shouldDrawMarkers(): boolean;
}
//# sourceMappingURL=CrossLineDrawing.d.ts.map