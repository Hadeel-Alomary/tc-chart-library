import { __extends } from "tslib";
import { PriceStyle } from "./PriceStyle";
import { PlotType } from "../Plots/Plot";
import { LinePlot } from "../Plots/LinePlot";
var LinePriceStyle = (function (_super) {
    __extends(LinePriceStyle, _super);
    function LinePriceStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LinePriceStyle, "className", {
        get: function () {
            return 'line';
        },
        enumerable: false,
        configurable: true
    });
    LinePriceStyle.prototype.createPlot = function (chart) {
        return new LinePlot(chart, {
            plotStyle: LinePlot.Style.SIMPLE,
            plotType: PlotType.PRICE_STYLE,
        });
    };
    return LinePriceStyle;
}(PriceStyle));
export { LinePriceStyle };
PriceStyle.register(LinePriceStyle);
//# sourceMappingURL=LinePriceStyle.js.map