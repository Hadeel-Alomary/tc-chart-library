import { IDrawingConfig, IDrawingLevel, IDrawingOptions } from '../Drawing';
import { DrawingTheme, FibonacciEllipsesDrawingTheme, FibonacciExtendedLevelsDrawingTheme, FibonacciFanDrawingTheme, FibonacciTimeZonesDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
import { Chart } from '../../Chart';
export interface IFibonacciDrawingBaseConfig extends IDrawingConfig {
    levels: IDrawingLevel[];
}
export interface IFibonacciDrawingBaseOptions extends IDrawingOptions {
    levels?: IDrawingLevel[];
}
export declare class FibonacciDrawingBase<T extends DrawingTheme> extends ThemedDrawing<T> {
    static get subClassName(): string;
    protected _textOffset: number;
    get levels(): IDrawingLevel[];
    set levels(value: IDrawingLevel[]);
    get showLevelLines(): boolean;
    constructor(chart: Chart, config?: IFibonacciDrawingBaseConfig);
    showSettingsDialog(): void;
    protected _applyTextPosition(theme: FibonacciExtendedLevelsDrawingTheme | FibonacciEllipsesDrawingTheme | FibonacciTimeZonesDrawingTheme): void;
    protected _isLevelVisible(level: IDrawingLevel): boolean;
    protected _adjustXWithTextOffset(theme: FibonacciExtendedLevelsDrawingTheme | FibonacciEllipsesDrawingTheme | FibonacciTimeZonesDrawingTheme, x: number): number;
    protected _adjustYWithTextOffset(theme: FibonacciExtendedLevelsDrawingTheme | FibonacciEllipsesDrawingTheme | FibonacciTimeZonesDrawingTheme | FibonacciFanDrawingTheme, y: number): number;
}
//# sourceMappingURL=FibonacciDrawingBase.d.ts.map