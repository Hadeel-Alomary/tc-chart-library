import { DrawingTheme, LevelThemeElement } from './DrawingThemeTypes';
import { IDrawingOptions } from './Drawing';
import { ThemeType } from '../ThemeType';
export declare class DrawingsDefaultSettings {
    private static savedDefaultSettings;
    static getDrawingDefaultSettings(themeType: ThemeType, className: string): DrawingDefaultSettings;
    static hasCustomSettings(themeType: ThemeType, className: string): boolean;
    static setDrawingDefaultSettings(themeType: ThemeType, className: string, settings: IDrawingOptions): void;
    static getResettedDrawingSettings(themeType: ThemeType, className: string, currentOptions: IDrawingOptions): IDrawingOptions;
    static resetAllSavedSettings(): void;
    private static get drawingSavedDefaultSettings();
    private static writeDrawingDefaultSettings;
    static getDrawingOriginalSettings(themeType: ThemeType, className: string): DrawingDefaultSettings;
    private static getDrawingOriginalDarkSettings;
    private static getDrawingOriginalLightSettings;
}
export interface DrawingDefaultLevelSettings {
    visible: boolean;
    value: number | string;
    theme: LevelThemeElement;
}
export interface DrawingDefaultSettings {
    theme: DrawingTheme;
    levels?: DrawingDefaultLevelSettings[];
    timeLevels?: DrawingDefaultLevelSettings[];
    fans?: DrawingDefaultLevelSettings[];
    arcs?: DrawingDefaultLevelSettings[];
}
//# sourceMappingURL=DrawingsDefaultSettings.d.ts.map