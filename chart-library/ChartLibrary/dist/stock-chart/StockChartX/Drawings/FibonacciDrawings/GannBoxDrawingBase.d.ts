import { IDrawingConfig, IDrawingLevel, IDrawingOptions } from '../Drawing';
import { ThemedDrawing } from '../ThemedDrawing';
import { DrawingTheme } from '../DrawingThemeTypes';
export interface IGannBoxDrawingBaseConfig extends IDrawingConfig {
    levels: IDrawingLevel[];
}
export interface IGannBoxDrawingBaseOptions extends IDrawingOptions {
    levels?: IDrawingLevel[];
    timeLevels?: IDrawingLevel[];
}
export declare class GannBoxDrawingBase<T extends DrawingTheme> extends ThemedDrawing<T> {
    get levels(): IDrawingLevel[];
    set levels(value: IDrawingLevel[]);
    get timeLevels(): IDrawingLevel[];
    set timeLevels(value: IDrawingLevel[]);
    protected _isLevelVisible(level: IDrawingLevel): boolean;
    showSettingsDialog(): void;
}
//# sourceMappingURL=GannBoxDrawingBase.d.ts.map