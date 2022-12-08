import { __extends } from "tslib";
import { PriceStyle } from "./PriceStyle";
import { PlotType } from "../Plots/Plot";
import { BarPlot } from "../Plots/BarPlot";
var CandlePriceStyle = (function (_super) {
    __extends(CandlePriceStyle, _super);
    function CandlePriceStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CandlePriceStyle, "className", {
        get: function () {
            return 'candle';
        },
        enumerable: false,
        configurable: true
    });
    CandlePriceStyle.prototype.createPlot = function (chart) {
        return new BarPlot(chart, {
            plotStyle: BarPlot.Style.CANDLE,
            plotType: PlotType.PRICE_STYLE,
        });
    };
    return CandlePriceStyle;
}(PriceStyle));
export { CandlePriceStyle };
PriceStyle.register(CandlePriceStyle);
//# sourceMappingURL=CandlePriceStyle.js.map