import { IDrawingConfig, IDrawingOptions } from '../Drawing';
import { IRect } from '../../Graphics/Rect';
import { IPoint } from '../../Graphics/ChartPoint';
import { BorderedTextDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export interface IBalloonDrawingConfig extends IDrawingConfig {
    text: string;
}
export interface IBalloonDrawingOptions extends IDrawingOptions {
    text: string;
}
export declare namespace DrawingEvent {
    const TEXT_CHANGED = "drawingTextChanged";
}
export declare class BalloonDrawing extends ThemedDrawing<BorderedTextDrawingTheme> {
    static get className(): string;
    get text(): string;
    set text(value: string);
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    draw(): void;
    private getDefaultText;
    private drawBalloon;
    private drawText;
    private padding;
    private textWidth;
    private balloonInfo;
    _finishUserDrawing(): void;
}
//# sourceMappingURL=BalloonDrawing.d.ts.map