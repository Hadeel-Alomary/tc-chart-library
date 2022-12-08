import { IRect } from '../../Graphics/Rect';
import { IPoint } from '../../Graphics/ChartPoint';
import { FlagDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class FlagDrawing extends ThemedDrawing<FlagDrawingTheme> {
    static get className(): string;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    draw(): void;
    private flagInfo;
    private drawFlagStaff;
    private drawLeftRectangle;
    private drawFlagCrossLine;
    private drawFlagTriangles;
}
//# sourceMappingURL=FlagDrawing.d.ts.map