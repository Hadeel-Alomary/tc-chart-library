import { IDrawingConfig, IDrawingLevel, IDrawingOptions } from '../Drawing';
import { IFillTheme, IStrokeTheme, ITextTheme } from '../../Theme';
import { DrawingTheme, LevelThemeElement } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export interface IGannSquareDrawingBaseLevel {
    value: number;
    visible?: boolean;
    theme?: LevelThemeElement;
}
export interface IGannSquareDrawingBaseLevelTheme {
    text?: ITextTheme;
    line?: IStrokeTheme;
    fill?: IFillTheme;
}
export interface IGannSquareDrawingBaseConfig extends IDrawingConfig {
    levels: IGannSquareDrawingBaseLevel[];
    fans: IGannSquareDrawingBaseLevel[];
    arcs: IGannSquareDrawingBaseLevel[];
}
export interface IGannSquareDrawingBaseOptions extends IDrawingOptions {
    levels?: IGannSquareDrawingBaseLevel[];
    fans?: IGannSquareDrawingBaseLevel[];
    arcs?: IGannSquareDrawingBaseLevel[];
}
export declare class GannSquareDrawingBase<T extends DrawingTheme> extends ThemedDrawing<T> {
    get levels(): IGannSquareDrawingBaseLevel[];
    set levels(value: IGannSquareDrawingBaseLevel[]);
    get fans(): IGannSquareDrawingBaseLevel[];
    set fans(value: IGannSquareDrawingBaseLevel[]);
    get arcs(): IGannSquareDrawingBaseLevel[];
    set arcs(value: IGannSquareDrawingBaseLevel[]);
    protected _isLevelVisible(level: IDrawingLevel): boolean;
    showSettingsDialog(): void;
}
//# sourceMappingURL=GannSquareDrawingBase.d.ts.map