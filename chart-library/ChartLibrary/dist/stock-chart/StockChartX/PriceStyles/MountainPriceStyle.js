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