import {LanguageService} from "../../language/index";

export enum ViewLoaderType{
    IndicatorSettingsDialog,
    IchimokuIndicatorSettingsDialog,
    IndicatorInfoDialog,
    IndicatorsDialog,
    PriceStyleDialog,
    ThemeDialog,
    ChartElementsContainerDialog,
    DrawingToolbar,
}

export interface ICallbackFunction {
    (instance: unknown): unknown;
}

export interface ViewLoader{
    type:ViewLoaderType;
    load(onLoad: ICallbackFunction, languageService:LanguageService):void;
}
