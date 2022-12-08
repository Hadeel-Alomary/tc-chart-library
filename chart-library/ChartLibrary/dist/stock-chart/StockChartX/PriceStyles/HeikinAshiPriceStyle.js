import { __extends } from "tslib";
import { PriceStyle } from "./PriceStyle";
import { PlotType } from "../Plots/Plot";
import { BarPlot } from "../Plots/BarPlot";
import { DataSeriesSuffix } from "../Data/DataSeries";
import { BarConverter } from "../Data/BarConverter";
var HeikinAshiPriceStyle = (function (_super) {
    __extends(HeikinAshiPriceStyle, _super);
    function HeikinAshiPriceStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(HeikinAshiPriceStyle, "className", {
        get: function () {
            return 'heikinAshi';
        },
        enumerable: false,
        configurable: true
    });
    HeikinAshiPriceStyle.prototype.createPlot = function (chart) {
        return new BarPlot(chart, {
            plotStyle: BarPlot.Style.HEIKIN_ASHI,
            plotType: PlotType.PRICE_STYLE,
        });
    };
    HeikinAshiPriceStyle.prototype.dataSeriesSuffix = function () {
        return DataSeriesSuffix.HEIKIN_ASHI;
    };
    HeikinAshiPriceStyle.prototype.updateComputedDataSeries = function () {
        var dataManager = this.chart.dataManager, heikinAshi = dataManager.ohlcDataSeries(DataSeriesSuffix.HEIKIN_ASHI, true);
        BarConverter.convertToHeikinAshi(dataManager.ohlcDataSeries(), heikinAshi);
    };
    return HeikinAshiPriceStyle;
}(PriceStyle));
export { HeikinAshiPriceStyle };
PriceStyle.register(HeikinAshiPriceStyle);
//# sourceMappingURL=HeikinAshiPriceStyle.js.map