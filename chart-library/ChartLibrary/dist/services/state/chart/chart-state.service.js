var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
var ChartStateService = (function () {
    function ChartStateService() {
        if (localStorage.getItem(ChartStateService_1.TC_CHART_DEFAULT_SETTINGS) == null) {
            this.initChartStateService();
        }
    }
    ChartStateService_1 = ChartStateService;
    ChartStateService.prototype.initChartStateService = function () {
        var LEGACY_TC_DRAWING_DEFAULT_SETTINGS = 'TC_DRAWING_DEFAULT_SETTINGS';
        var LEGACY_TC_INDICATOR_DEFAULT_SETTINGS = 'TC_INDICATOR_DEFAULT_SETTINGS';
        var initChartDefaultSettings = { theme: null, drawing: null, indicator: null };
        if (localStorage.getItem(LEGACY_TC_DRAWING_DEFAULT_SETTINGS) != null) {
            initChartDefaultSettings.drawing = JSON.parse(localStorage.getItem(LEGACY_TC_DRAWING_DEFAULT_SETTINGS));
            localStorage.removeItem(LEGACY_TC_DRAWING_DEFAULT_SETTINGS);
        }
        if (localStorage.getItem(LEGACY_TC_INDICATOR_DEFAULT_SETTINGS) != null) {
            initChartDefaultSettings.drawing = JSON.parse(localStorage.getItem(LEGACY_TC_INDICATOR_DEFAULT_SETTINGS));
            localStorage.removeItem(LEGACY_TC_INDICATOR_DEFAULT_SETTINGS);
        }
        localStorage.setItem(ChartStateService_1.TC_CHART_DEFAULT_SETTINGS, JSON.stringify(initChartDefaultSettings));
    };
    ChartStateService.prototype.setThemeDefaultSettings = function (theme) {
        var state = this.getState();
        state.theme = theme;
        this.saveState(state);
    };
    ChartStateService.prototype.getThemeDefaultSettings = function () {
        return this.getState().theme;
    };
    ChartStateService.prototype.setDrawingDefaultSettings = function (defaultSettings) {
        var state = this.getState();
        state.drawing = defaultSettings;
        this.saveState(state);
    };
    ChartStateService.prototype.getDrawingDefaultSettings = function () {
        return this.getState().drawing;
    };
    ChartStateService.prototype.setIndicatorDefaultSettings = function (defaultSettings) {
        var state = this.getState();
        state.indicator = defaultSettings;
        this.saveState(state);
    };
    ChartStateService.prototype.getIndicatorDefaultSettings = function () {
        return this.getState().indicator;
    };
    ChartStateService.prototype.saveState = function (state) {
        localStorage.setItem(ChartStateService_1.TC_CHART_DEFAULT_SETTINGS, JSON.stringify(state));
    };
    ChartStateService.prototype.getState = function () {
        return JSON.parse(localStorage.getItem(ChartStateService_1.TC_CHART_DEFAULT_SETTINGS));
    };
    var ChartStateService_1;
    ChartStateService.TC_CHART_DEFAULT_SETTINGS = 'TC_CHART_DEFAULT_SETTINGS';
    ChartStateService = ChartStateService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], ChartStateService);
    return ChartStateService;
}());
export { ChartStateService };
//# sourceMappingURL=chart-state.service.js.map