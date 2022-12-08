import { Drawing } from './Drawing';
import { DrawingTheme } from './DrawingThemeTypes';
export declare abstract class ThemedDrawing<T extends DrawingTheme> extends Drawing {
    protected getDrawingTheme(): T;
    hasBorderedTextDrawingTheme(): boolean;
}
//# sourceMappingURL=ThemedDrawing.d.ts.map