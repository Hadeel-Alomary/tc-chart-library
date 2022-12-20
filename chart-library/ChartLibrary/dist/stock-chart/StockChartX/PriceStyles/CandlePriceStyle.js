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
var CandlePriceStyle = (function (_super) {
    __extends(CandlePriceStyle, _super);
    function CandlePriceStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CandlePriceStyle, "className", {
        get: function () {
            return 'candle';
        },
        enumerable: true,
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