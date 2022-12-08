import { ChartPanelValueScale } from "./ChartPanelValueScale";
import { IFillTheme, IStrokeTheme, ITextTheme } from "../Theme";
export interface IValueMarker {
    textOffset: number;
    theme: IValueMarkerTheme;
    draw(value: number, panelValueScale: ChartPanelValueScale, offset: number, plotType: string): void;
}
export interface IValueMarkerTheme {
    text: ITextTheme;
    line?: IStrokeTheme;
    fill: IFillTheme;
}
export interface IValueMarkerDefaults {
    textOffset: number;
}
export declare class ValueMarker implements IValueMarker {
    static defaults: IValueMarkerDefaults;
    constructor(theme: IValueMarkerTheme);
    private _textOffset;
    get textOffset(): number;
    set textOffset(value: number);
    private _theme;
    get theme(): IValueMarkerTheme;
    set theme(value: IValueMarkerTheme);
    draw(value: number, panelValueScale: ChartPanelValueScale, offset: number, plotType: string): void;
    private drawArrowValueMarker;
    private drawRectangleValueMarker;
}
//# sourceMappingURL=ValueMarker.d.ts.map