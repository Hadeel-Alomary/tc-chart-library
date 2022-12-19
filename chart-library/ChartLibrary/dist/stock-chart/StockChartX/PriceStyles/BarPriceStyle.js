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