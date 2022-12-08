import { IFillTheme, IStrokeTheme, ITextTheme } from '../Theme';
export declare class TradingDrawingsDefaultSettings {
    static getTradingOrderTheme(): {
        [key: string]: TradingOrderTheme;
    };
    static getTradingPositionTheme(): {
        [key: string]: TradingPositionTheme;
    };
}
export interface TradingColorThemeElement {
    solidColor: string;
    opaqueColor: string;
    highOpacityColor: string;
}
export interface TradingOrderTheme {
    buyColors: TradingColorThemeElement;
    sellColors: TradingColorThemeElement;
    line: IStrokeTheme;
    dashedLine: IStrokeTheme;
    fill: IFillTheme;
    coloredFill: IFillTheme;
    valueMarkerFill: IFillTheme;
    text: ITextTheme;
    quantityText: ITextTheme;
    cancelText: ITextTheme;
    valueMarketText: ITextTheme;
}
export interface TradingPositionTheme {
    dashedLine: IStrokeTheme;
    borderLine: IStrokeTheme;
    fill: IFillTheme;
    coloredFill: IFillTheme;
    valueMarkerFill: IFillTheme;
    text: ITextTheme;
    cancelText: ITextTheme;
    quantityText: ITextTheme;
    valueMarketText: ITextTheme;
}
//# sourceMappingURL=TradingDrawingsDefaultSettings.d.ts.map