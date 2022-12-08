import { __extends } from "tslib";
import { PriceStyle } from "./PriceStyle";
import { PlotType } from "../Plots/Plot";
import { LinePlot } from "../Plots/LinePlot";
var MountainPriceStyle = (function (_super) {
    __extends(MountainPriceStyle, _super);
    function MountainPriceStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MountainPriceStyle, "className", {
        get: function () {
            return 'mountain';
        },
        enumerable: false,
        configurable: true
    });
    MountainPriceStyle.prototype.createPlot = function (chart) {
        return new LinePlot(chart, {
            plotStyle: LinePlot.Style.MOUNTAIN,
            plotType: PlotType.PRICE_STYLE,
        });
    };
    return MountainPriceStyle;
}(PriceStyle));
export { MountainPriceStyle };
PriceStyle.register(MountainPriceStyle);
//# sourceMappingURL=MountainPriceStyle.js.map