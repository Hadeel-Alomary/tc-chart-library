import { __extends } from "tslib";
import { PriceStyle } from "./PriceStyle";
import { PlotType } from "../Plots/Plot";
import { BarPlot } from "../Plots/BarPlot";
var HollowCandlePriceStyle = (function (_super) {
    __extends(HollowCandlePriceStyle, _super);
    function HollowCandlePriceStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(HollowCandlePriceStyle, "className", {
        get: function () {
            return 'hollowCandle';
        },
        enumerable: false,
        configurable: true
    });
    HollowCandlePriceStyle.prototype.createPlot = function (chart) {
        return new BarPlot(chart, {
            plotStyle: BarPlot.Style.HOLLOW_CANDLE,
            plotType: PlotType.PRICE_STYLE,
        });
    };
    return HollowCandlePriceStyle;
}(PriceStyle));
export { HollowCandlePriceStyle };
PriceStyle.register(HollowCandlePriceStyle);
//# sourceMappingURL=HollowCandlePriceStyle.js.map