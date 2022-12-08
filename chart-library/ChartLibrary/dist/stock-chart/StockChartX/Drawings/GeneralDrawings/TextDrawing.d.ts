import { IDrawingOptions } from '../Drawing';
import { TextDrawingsBase } from './TextDrawingsBase';
export interface ITextDrawingOptions extends IDrawingOptions {
    textWrapWidth: number;
}
export declare class TextDrawing extends TextDrawingsBase {
    static get className(): string;
}
//# sourceMappingURL=TextDrawing.d.ts.map