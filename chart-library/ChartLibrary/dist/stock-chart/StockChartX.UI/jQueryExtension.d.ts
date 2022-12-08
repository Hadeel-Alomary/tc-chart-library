import { ChartContextMenu, IChartContextMenuConfig } from "./ChartContextMenu";
import { ChartNavigation } from "./Navigation";
import { Chart } from "../StockChartX/Chart";
import { ColorPicker, ColorPickerOptions } from "./ColorPicker";
import { IndicatorContextMenu, IndicatorContextMenuConfig } from "./IndicatorContextMenu";
import { IInstrumentSearchConfig, InstrumentSearch } from "./InstrumentSearch";
import { ITimeFramePickerConfig, TimeFramePicker } from './TimeFramePicker';
import { IToolbarDropDownButtonConfig, ToolbarDropDownButton } from "./ToolbarDropDownButton";
import { WaitingBar } from "./WaitingBar";
import { DateTimePicker } from "./DateTimePicker";
import { ChartPanelMenu, IChartPanelMenuConfig } from './ChartPanelMenu';
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
//# sourceMappingURL=jQueryExtension.d.ts.map