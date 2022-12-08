import { IRect } from "../../Graphics/Rect";
import { IPoint } from '../../Graphics/ChartPoint';
import { BorderedTextDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class PriceLabelDrawing extends ThemedDrawing<BorderedTextDrawingTheme> {
    static get className(): string;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    draw(): void;
    private priceNumber;
    private textWidth;
    private textHeight;
}
//# sourceMappingURL=PriceLabelDrawing.d.ts.map