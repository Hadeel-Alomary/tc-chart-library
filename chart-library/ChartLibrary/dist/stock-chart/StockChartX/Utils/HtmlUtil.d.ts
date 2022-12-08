import { IStrokeTheme, ITextTheme } from "../Theme";
export declare class HtmlUtil {
    static getLineWidth(theme: IStrokeTheme): number;
    static getFontSize(theme: ITextTheme): number;
    private static colorDiv;
    private static colorTypeCache;
    static isDarkColor(color: string): boolean;
    static setVisibility(control: JQuery, visible: boolean): void;
    static isHidden(control: JQuery): boolean;
}
//# sourceMappingURL=HtmlUtil.d.ts.map