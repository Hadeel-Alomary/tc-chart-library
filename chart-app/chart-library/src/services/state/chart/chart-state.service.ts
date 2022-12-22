import {Injectable} from '@angular/core';
import {ChartTheme} from '../../../stock-chart/StockChartX/Theme';
import {DrawingDefaultSettings} from '../../../stock-chart/StockChartX/Drawings/DrawingsDefaultSettings';
import {IndicatorSettings} from '../../../stock-chart/StockChartX/Indicators/IndicatorsDefaultSettings';

@Injectable()
export class ChartStateService {

    private static TC_CHART_DEFAULT_SETTINGS: string = 'TC_CHART_DEFAULT_SETTINGS';

    public constructor() {

        if(localStorage.getItem(ChartStateService.TC_CHART_DEFAULT_SETTINGS) == null) {
            this.initChartStateService();
        }

    }

    private initChartStateService() {

        let LEGACY_TC_DRAWING_DEFAULT_SETTINGS: string = 'TC_DRAWING_DEFAULT_SETTINGS';
        let LEGACY_TC_INDICATOR_DEFAULT_SETTINGS: string = 'TC_INDICATOR_DEFAULT_SETTINGS';

        let initChartDefaultSettings: ChartDefaultSettingsState = {theme: null, drawing: null, indicator: null};

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // move legacy state into a centralized state
        if (localStorage.getItem(LEGACY_TC_DRAWING_DEFAULT_SETTINGS) != null) {
            initChartDefaultSettings.drawing = JSON.parse(localStorage.getItem(LEGACY_TC_DRAWING_DEFAULT_SETTINGS));
            localStorage.removeItem(LEGACY_TC_DRAWING_DEFAULT_SETTINGS);
        }

        if (localStorage.getItem(LEGACY_TC_INDICATOR_DEFAULT_SETTINGS) != null) {
            initChartDefaultSettings.drawing = JSON.parse(localStorage.getItem(LEGACY_TC_INDICATOR_DEFAULT_SETTINGS));
            localStorage.removeItem(LEGACY_TC_INDICATOR_DEFAULT_SETTINGS);
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        localStorage.setItem(ChartStateService.TC_CHART_DEFAULT_SETTINGS, JSON.stringify(initChartDefaultSettings));

    }

    /* chart default settings */

    public setThemeDefaultSettings(theme:ChartTheme) {
        let state = this.getState();
        state.theme = theme;
        this.saveState(state);
    }

    public getThemeDefaultSettings():ChartTheme {
        return this.getState().theme;
    }

    /* drawing default settings */

    public setDrawingDefaultSettings(defaultSettings: { [drawingClassName: string]: DrawingDefaultSettings}) {
        let state = this.getState();
        state.drawing = defaultSettings;
        this.saveState(state);
    }

    public getDrawingDefaultSettings():  { [drawingClassName: string]: DrawingDefaultSettings} {
        return this.getState().drawing;
    }

    /* indicator default settings */

    public setIndicatorDefaultSettings(defaultSettings:{[indicatorNumber: number]: IndicatorSettings}) {
        let state = this.getState();
        state.indicator = defaultSettings;
        this.saveState(state);
    }

    public getIndicatorDefaultSettings():{[indicatorNumber: number]: IndicatorSettings} {
        return this.getState().indicator;
    }

    /* local storage helper */

    private saveState(state:ChartDefaultSettingsState) {
        localStorage.setItem(ChartStateService.TC_CHART_DEFAULT_SETTINGS, JSON.stringify(state));
    }

    private getState():ChartDefaultSettingsState {
        return JSON.parse(localStorage.getItem(ChartStateService.TC_CHART_DEFAULT_SETTINGS));
    }

}

interface ChartDefaultSettingsState {
    theme: ChartTheme,
    drawing:{ [drawingClassName: string]: DrawingDefaultSettings},
    indicator:{[indicatorNumber: number]: IndicatorSettings}
}



