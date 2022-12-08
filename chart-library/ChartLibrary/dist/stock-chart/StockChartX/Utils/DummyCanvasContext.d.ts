import { ITextTheme } from "../Theme";
export declare class DummyCanvasContext {
    private static _context;
    static get context(): CanvasRenderingContext2D;
    static applyTextTheme(theme: ITextTheme): void;
    static textWidth(text: string, textTheme?: ITextTheme): number;
    static measureText(text: string, textTheme: ITextTheme): {
        width: number;
        height: number;
    };
}
//# sourceMappingURL=DummyCanvasContext.d.ts.map