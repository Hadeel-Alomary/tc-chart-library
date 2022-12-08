import { __extends } from "tslib";
import { PriceStyle } from "./PriceStyle";
import { PlotType } from "../Plots/Plot";
import { BarPlot } from "../Plots/BarPlot";
var ColoredBarPriceStyle = (function (_super) {
    __extends(ColoredBarPriceStyle, _super);
    function ColoredBarPriceStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ColoredBarPriceStyle, "className", {
        get: function () {
            return 'coloredBar';
        },
        enumerable: false,
        configurable: true
    });
    ColoredBarPriceStyle.prototype.createPlot = function (chart) {
        return new BarPlot(chart, {
            plotStyle: BarPlot.Style.COLORED_OHLC,
            plotType: PlotType.PRICE_STYLE,
        });
    };
    return ColoredBarPriceStyle;
}(PriceStyle));
export { ColoredBarPriceStyle };
PriceStyle.register(ColoredBarPriceStyle);
//# sourceMappingURL=ColoredBarPriceStyle.js.map