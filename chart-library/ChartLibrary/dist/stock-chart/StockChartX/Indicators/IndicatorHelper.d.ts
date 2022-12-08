export declare class IndicatorHelper {
    static indicatorToString(indicatorTypeId: number): string;
    static isExistedIndicator(indicatorTypeId: number): boolean;
    static getDesktopShortName(indicatorTypeId: number): string;
    static getMobileShortName(indicatorTypeId: number): string;
    static getPlotName(fieldName: string): string;
    static isLiquidityIndicator(indicator: number): boolean;
    static allIndicators(): number[];
    static bands(): number[];
    static general(): number[];
    static indices(): number[];
    static regressions(): number[];
    static movingAverages(): number[];
    static oscillators(): number[];
    static getMaTypeString(maType: number): string;
    static getVwapTypeString(vwapType: number): string;
    static isAlertable(indicatorTypeId: number): boolean;
    static getServerIndicatorFields(indicatorTypeId: number): string[];
}
//# sourceMappingURL=IndicatorHelper.d.ts.map