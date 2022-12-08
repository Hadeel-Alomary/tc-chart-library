export declare class AlertDrawingsDefaultSettings {
    static getChartAlertDrawingTheme(className: string): AlertDrawingTheme;
}
export interface AlertDrawingTheme {
    line: {
        strokeColor: string;
        width: number;
        lineStyle: 'solid' | 'dash';
    };
    bridge: {
        strokeColor: string;
        width: number;
        lineStyle: string;
    };
    dashedLine: {
        strokeColor: string;
        width: number;
        lineStyle: string;
    };
    valueMarkerFill: {
        fillColor: string;
    };
    valueMarketText: {
        fontFamily: string;
        fontSize: number;
        fillColor: string;
    };
}
//# sourceMappingURL=AlertDrawingsDefaultSettings.d.ts.map