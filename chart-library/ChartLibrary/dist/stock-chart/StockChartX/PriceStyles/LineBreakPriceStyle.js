import { __extends } from "tslib";
import { PriceStyle } from "./PriceStyle";
import { BarPlot } from "../Plots/BarPlot";
import { PlotType } from "../Plots/Plot";
import { DataSeriesSuffix } from "../Data/DataSeries";
import { BarConverter } from "../Data/BarConverter";
var LineBreakPriceStyle = (function (_super) {
    __extends(LineBreakPriceStyle, _super);
    function LineBreakPriceStyle(config) {
        var _this = _super.call(this, config) || this;
        _this.loadState(config);
        return _this;
    }
    Object.defineProperty(LineBreakPriceStyle, "className", {
        get: function () {
            return 'lineBreak';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LineBreakPriceStyle.prototype, "lines", {
        get: function () {
            return this._lines;
        },
        set: function (value) {
            this._lines = value;
        },
        enumerable: false,
        configurable: true
    });
    LineBreakPriceStyle.prototype.saveState = function () {
        var state = _super.prototype.saveState.call(this);
        state.lines = this.lines;
        return state;
    };
    LineBreakPriceStyle.prototype.loadState = function (state) {
        _super.prototype.loadState.call(this, state);
        this.lines = (state && state.lines) || LineBreakPriceStyle.defaults.lines;
    };
    LineBreakPriceStyle.prototype.createPlot = function (chart) {
        return new BarPlot(chart, {
            plotStyle: BarPlot.Style.CANDLE,
            plotType: PlotType.PRICE_STYLE,
        });
    };
    LineBreakPriceStyle.prototype.dataSeriesSuffix = function () {
        return DataSeriesSuffix.LINE_BREAK;
    };
    LineBreakPriceStyle.prototype.primaryDataSeriesSuffix = function (suffix) {
        var psSuffix = _super.prototype.primaryDataSeriesSuffix.call(this, suffix);
        if (psSuffix)
            return psSuffix;
        switch (suffix) {
            case DataSeriesSuffix.DATE:
            case DataSeriesSuffix.VOLUME:
                return this.dataSeriesSuffix();
            default:
                return '';
        }
    };
    LineBreakPriceStyle.prototype.updateComputedDataSeries = function () {
        var dataManager = this.chart.dataManager, lineBreak = dataManager.barDataSeries(DataSeriesSuffix.LINE_BREAK, true);
        BarConverter.convertToLineBreak(dataManager.barDataSeries(), this.lines, lineBreak);
    };
    LineBreakPriceStyle.defaults = {
        lines: 3
    };
    return LineBreakPriceStyle;
}(PriceStyle));
export { LineBreakPriceStyle };
PriceStyle.register(LineBreakPriceStyle);
//# sourceMappingURL=LineBreakPriceStyle.js.map