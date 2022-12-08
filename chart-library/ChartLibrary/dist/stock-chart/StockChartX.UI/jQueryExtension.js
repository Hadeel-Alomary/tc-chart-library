import { ChartContextMenu } from "./ChartContextMenu";
import { ChartNavigation } from "./Navigation";
import { ColorPicker } from "./ColorPicker";
import { IndicatorContextMenu } from "./IndicatorContextMenu";
import { InstrumentSearch } from "./InstrumentSearch";
import { TimeFramePicker } from './TimeFramePicker';
import { ToolbarDropDownButton } from "./ToolbarDropDownButton";
import { WaitingBar } from "./WaitingBar";
import { DateTimePicker } from "./DateTimePicker";
import { ChartPanelMenu } from './ChartPanelMenu';
$.fn.extend({
    scx: function () {
        var _this = this;
        return {
            chartContextMenu: function (config) {
                return new ChartContextMenu(_this, config);
            },
            chartNavigation: function (chart) {
                return new ChartNavigation({ target: _this, chart: chart });
            },
            colorPicker: function (config) {
                return new ColorPicker(_this, config);
            },
            indicatorContextMenu: function (config) {
                return new IndicatorContextMenu(config);
            },
            instrumentSearch: function (config) {
                return new InstrumentSearch(_this, config);
            },
            timeFramePicker: function (config) {
                return new TimeFramePicker(_this, config);
            },
            toolbarDropDownButton: function (config) {
                return new ToolbarDropDownButton(_this, config);
            },
            waitingBar: function () {
                return new WaitingBar(_this);
            },
            dateTimePicker: function (options) {
                return new DateTimePicker(_this, options);
            },
            chartPanelMenu: function (config) {
                return new ChartPanelMenu(config);
            },
        };
    }
});
//# sourceMappingURL=jQueryExtension.js.map