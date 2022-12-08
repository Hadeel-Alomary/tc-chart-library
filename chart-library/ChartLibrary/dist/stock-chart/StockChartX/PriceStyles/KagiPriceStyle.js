import { __extends } from "tslib";
import { PriceStyle } from "./PriceStyle";
import { JsUtil } from "../Utils/JsUtil";
import { PlotType } from "../Plots/Plot";
import { BarPlot } from "../Plots/BarPlot";
import { DataSeriesSuffix } from "../Data/DataSeries";
import { BarConverter } from "../Data/BarConverter";
export var KagiReversalKind = {
    ATR: 'atr',
    FIXED: 'fixed',
};
Object.freeze(KagiReversalKind);
var KagiPriceStyle = (function (_super) {
    __extends(KagiPriceStyle, _super);
    function KagiPriceStyle(config) {
        var _this = _super.call(this, config) || this;
        _this.loadState(config);
        return _this;
    }
    Object.defineProperty(KagiPriceStyle, "className", {
        get: function () {
            return 'kagi';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KagiPriceStyle.prototype, "reversal", {
        get: function () {
            return this._reversal;
        },
        set: function (value) {
            this._reversal = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KagiPriceStyle.prototype, "reversalValue", {
        get: function () {
            return this._reversalValue;
        },
        enumerable: false,
        configurable: true
    });
    KagiPriceStyle.prototype.saveState = function () {
        var state = _super.prototype.saveState.call(this);
        state.reversal = JsUtil.clone(this._reversal);
        return state;
    };
    KagiPriceStyle.prototype.loadState = function (state) {
        _super.prototype.loadState.call(this, state);
        this.reversal = (state && state.reversal) || JsUtil.clone(KagiPriceStyle.defaults.reversal);
    };
    KagiPriceStyle.prototype.createPlot = function (chart) {
        return new BarPlot(chart, {
            plotStyle: BarPlot.Style.KAGI,
            plotType: PlotType.PRICE_STYLE,
        });
    };
    KagiPriceStyle.prototype.dataSeriesSuffix = function () {
        return DataSeriesSuffix.KAGI;
    };
    KagiPriceStyle.prototype.primaryDataSeriesSuffix = function (suffix) {
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
    KagiPriceStyle.prototype._calculateReversalValue = function () {
        var reversal = this.reversal, value;
        switch (reversal.kind) {
            case KagiReversalKind.ATR:
                value = this._calculateAtr(reversal.value);
                break;
            case KagiReversalKind.FIXED:
                value = reversal.value;
                break;
            default:
                throw new Error("Unknown reversal amount kind: " + reversal.kind);
        }
        this._reversalValue = value;
        return value;
    };
    KagiPriceStyle.prototype.updateComputedDataSeries = function () {
        var reversal = this._calculateReversalValue();
        if (!reversal)
            return;
        var dataManager = this.chart.dataManager, kagi = dataManager.barDataSeries(DataSeriesSuffix.KAGI, true);
        BarConverter.convertToKagi(dataManager.barDataSeries(), reversal, kagi);
    };
    KagiPriceStyle.defaults = {
        reversal: {
            kind: KagiReversalKind.ATR,
            value: 20,
        },
    };
    return KagiPriceStyle;
}(PriceStyle));
export { KagiPriceStyle };
PriceStyle.register(KagiPriceStyle);
//# sourceMappingURL=KagiPriceStyle.js.map