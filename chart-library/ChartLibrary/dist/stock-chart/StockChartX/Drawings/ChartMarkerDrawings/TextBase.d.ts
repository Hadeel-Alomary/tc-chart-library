import { IDrawingConfig, IDrawingOptions } from '../Drawing';
import { BorderedTextDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
import { Chart } from '../../Chart';
export interface ITextBaseConfig extends IDrawingConfig {
    text: string;
}
export interface ITextBaseOptions extends IDrawingOptions {
    text: string;
    textWrapWidth: number;
}
export declare namespace DrawingEvent {
    const TEXT_CHANGED = "drawingTextChanged";
}
export declare class TextBase extends ThemedDrawing<BorderedTextDrawingTheme> {
    constructor(chart: Chart, config?: ITextBaseConfig);
    get text(): string;
    set text(value: string);
    get textWrapWidth(): number;
    set textWrapWidth(value: number);
    private getDefaultText;
    protected get lines(): string[];
    protected getWrappedLines(): string[];
    protected getLines(): string[];
    protected getLongestLineSize(): {
        width: number;
        height: number;
    };
    protected wrapLine(text: string, maxWidth: number, lineHeight: number): string[];
    _finishUserDrawing(): void;
}
//# sourceMappingURL=TextBase.d.ts.map