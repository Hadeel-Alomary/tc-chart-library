import { __extends } from "tslib";
import { PriceStyle } from "./PriceStyle";
import { PlotType } from "../Plots/Plot";
import { BarPlot } from "../Plots/BarPlot";
var BarPriceStyle = (function (_super) {
    __extends(BarPriceStyle, _super);
    function BarPriceStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BarPriceStyle, "className", {
        get: function () {
            return 'bar';
        },
        enumerable: false,
        configurable: true
    });
    BarPriceStyle.prototype.createPlot = function (chart) {
        return new BarPlot(chart, {
            plotStyle: BarPlot.Style.OHLC,
            plotType: PlotType.PRICE_STYLE,
        });
    };
    return BarPriceStyle;
}(PriceStyle));
export { BarPriceStyle };
PriceStyle.register(BarPriceStyle);
//# sourceMappingURL=BarPriceStyle.js.map