import { KumoPlotTheme, LinePlotTheme } from '../Theme';
import { HorizontalLine } from './HorizontalLine';
import { ParameterValueType } from './Indicator';
import { ThemeType } from '../ThemeType';
export declare class IndicatorsDefaultSettings {
    private static savedDefaultSettings;
    static getIndicatorDefaultSettings(themeType: ThemeType, indicatorNumber: number): IndicatorSettings;
    static setIndicatorDefaultSettings(indicatorNumber: number, parameters: {
        [key: string]: ParameterValueType;
    }, horizontalLines: HorizontalLine[]): void;
    static resetIndicatorSettings(themeType: ThemeType, indicatorNumber: number): IndicatorSettings;
    static resetAllSavedSettings(): void;
    private static get indicatorsSavedDefaultSettings();
    private static getIndicatorOriginalSettings;
    private static writeIndicatorsDefaultSettings;
    private static getIndicatorParam;
    private static getIndicatorHorizontalLine;
}
export interface LineParameter {
    visible: boolean;
    priceLine: boolean;
    theme: LinePlotTheme | KumoPlotTheme;
}
export interface IndicatorSettings {
    parameters: {
        [key: string]: ParameterValueType;
    };
    horizontalLines: HorizontalLine[];
}
//# sourceMappingURL=IndicatorsDefaultSettings.d.ts.map