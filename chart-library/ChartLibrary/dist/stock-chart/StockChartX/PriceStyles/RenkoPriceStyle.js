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
import { JsUtil } from "../Utils/JsUtil";
import { PlotType } from "../Plots/Plot";
import { BarPlot } from "../Plots/BarPlot";
import { DataSeriesSuffix } from "../Data/DataSeries";
import { BarConverter } from "../Data/BarConverter";
export var RenkoBoxSizeKind = {
    FIXED: 'fixed',
    ATR: 'atr'
};
Object.freeze(RenkoBoxSizeKind);
var RenkoPriceStyle = (function (_super) {
    __extends(RenkoPriceStyle, _super);
    function RenkoPriceStyle(config) {
        var _this = _super.call(this, config) || this;
        _this.loadState(config);
        return _this;
    }
    Object.defineProperty(RenkoPriceStyle, "className", {
        get: function () {
            return 'renko';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenkoPriceStyle.prototype, "boxSize", {
        get: function () {
            return this._boxSize;
        },
        set: function (value) {
            this._boxSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenkoPriceStyle.prototype, "boxSizeValue", {
        get: function () {
            return this._boxSizeValue;
        },
        enumerable: true,
        configurable: true
    });
    RenkoPriceStyle.prototype.saveState = function () {
        var state = _super.prototype.saveState.call(this);
        state.boxSize = JsUtil.clone(this._boxSize);
        return state;
    };
    RenkoPriceStyle.prototype.loadState = function (state) {
        _super.prototype.loadState.call(this, state);
        this.boxSize = (state && state.boxSize) || JsUtil.clone(RenkoPriceStyle.defaults.boxSize);
    };
    RenkoPriceStyle.prototype.createPlot = function (chart) {
        return new BarPlot(chart, {
            plotStyle: BarPlot.Style.RENKO,
            plotType: PlotType.PRICE_STYLE,
        });
    };
    RenkoPriceStyle.prototype.dataSeriesSuffix = function () {
        return DataSeriesSuffix.RENKO;
    };
    RenkoPriceStyle.prototype.primaryDataSeriesSuffix = function (suffix) {
        var psSuffix = _super.prototype.primaryDataSeriesSuffix.call(this, suffix);
        if (psSuffix)
            return psSuffix;
        switch (suffix) {
            case DataSeriesSuffix.DATE:
            case DataSeriesSuffix.VOLUME:
                return this.dataSeriesSuffix();
            default:
                return '';
        }
    };
    RenkoPriceStyle.prototype._calculateBoxSizeValue = function () {
        var boxSize = this.boxSize, value;
        switch (boxSize.kind) {
            case RenkoBoxSizeKind.ATR:
                value = this._calculateAtr(boxSize.value);
                break;
            case RenkoBoxSizeKind.FIXED:
                value = boxSize.value;
                break;
            default:
                throw new Error("Unknown box size kind: " + boxSize.kind);
        }
        this._boxSizeValue = value;
        return value;
    };
    RenkoPriceStyle.prototype.updateComputedDataSeries = function () {
        var boxSize = this._calculateBoxSizeValue();
        var dataManager = this.chart.dataManager, renko = dataManager.barDataSeries(DataSeriesSuffix.RENKO, true);
        BarConverter.convertToRenko(dataManager.barDataSeries(), boxSize, renko);
    };
    RenkoPriceStyle.defaults = {
        boxSize: {
            kind: RenkoBoxSizeKind.ATR,
            value: 20,
        },
    };
    return RenkoPriceStyle;
}(PriceStyle));
export { RenkoPriceStyle };
PriceStyle.register(RenkoPriceStyle);
//# sourceMappingURL=RenkoPriceStyle.js.map