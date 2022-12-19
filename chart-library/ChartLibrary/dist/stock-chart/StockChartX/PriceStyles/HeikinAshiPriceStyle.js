var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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