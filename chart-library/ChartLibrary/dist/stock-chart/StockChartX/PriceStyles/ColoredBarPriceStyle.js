var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        enumerable: true,
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