/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {ChartContextMenu, IChartContextMenuConfig} from "./ChartContextMenu";
import {ChartNavigation} from "./Navigation";
import {Chart} from "../StockChartX/Chart";
import {ColorPicker, ColorPickerOptions} from "./ColorPicker";
import {IndicatorContextMenu, IndicatorContextMenuConfig} from "./IndicatorContextMenu";
import {IInstrumentSearchConfig, InstrumentSearch} from "./InstrumentSearch";
import {ITimeFramePickerConfig, TimeFramePicker} from './TimeFramePicker';
import {IToolbarDropDownButtonConfig, ToolbarDropDownButton} from "./ToolbarDropDownButton";
import {WaitingBar} from "./WaitingBar";
import {DateTimePicker} from "./DateTimePicker";
import {ChartPanelMenu, IChartPanelMenuConfig} from './ChartPanelMenu';

/* tslint:disable:interface-name */

export interface IScxJQuery {
    chartContextMenu(config: IChartContextMenuConfig): ChartContextMenu;

    chartNavigation(chart: Chart): ChartNavigation;

    colorPicker(config: ColorPickerOptions): ColorPicker;


    indicatorContextMenu(config: IndicatorContextMenuConfig): IndicatorContextMenu;

    instrumentSearch(config: IInstrumentSearchConfig): InstrumentSearch;

    timeFramePicker(config: ITimeFramePickerConfig): TimeFramePicker;

    toolbarDropDownButton(config: IToolbarDropDownButtonConfig): ToolbarDropDownButton;

    waitingBar(): WaitingBar;

    dateTimePicker(options: EonasdanBootstrapDatetimepicker.GetOptions): DateTimePicker;

    chartPanelMenu(config: IChartPanelMenuConfig): ChartPanelMenu;
}

/* tslint:enable */

$.fn.extend({
    scx: function (): IScxJQuery {
        return {
            chartContextMenu: (config: IChartContextMenuConfig): ChartContextMenu => {
                return new ChartContextMenu(this, config);
            },

            chartNavigation: (chart: Chart): ChartNavigation => {
                return new ChartNavigation({target: this, chart: chart});
            },

            colorPicker: (config: ColorPickerOptions): ColorPicker => {
                return new ColorPicker(this, config);
            },

            indicatorContextMenu: (config: IndicatorContextMenuConfig): IndicatorContextMenu => {
                return new IndicatorContextMenu(config);
            },

            instrumentSearch: (config: IInstrumentSearchConfig) => {
                return new InstrumentSearch(this, config);
            },

            timeFramePicker: (config) => {
                return new TimeFramePicker(this, config);
            },


            toolbarDropDownButton: (config: IToolbarDropDownButtonConfig): ToolbarDropDownButton => {
                return new ToolbarDropDownButton(this, config);
            },

            waitingBar: (): WaitingBar => {
                return new WaitingBar(this);
            },

            dateTimePicker: (options: EonasdanBootstrapDatetimepicker.GetOptions): DateTimePicker => {
                return new DateTimePicker(this, options);
            },

            chartPanelMenu: (config: IChartPanelMenuConfig): ChartPanelMenu => {
                return new ChartPanelMenu(config);
            },
        };
    }
});
