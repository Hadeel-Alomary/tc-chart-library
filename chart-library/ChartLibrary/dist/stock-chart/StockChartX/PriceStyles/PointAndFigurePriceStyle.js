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
import { PointAndFigurePlot } from "../Plots/PointAndFigurePlot";
import { BarPlot } from "../Plots/BarPlot";
import { DataSeriesSuffix } from "../Data/DataSeries";
import { BarConverter } from "../Data/BarConverter";
export var PointAndFigureBoxSizeKind = {
    ATR: 'atr',
    FIXED: 'fixed',
};
Object.freeze(PointAndFigureBoxSizeKind);
var PointAndFigurePriceStyle = (function (_super) {
    __extends(PointAndFigurePriceStyle, _super);
    function PointAndFigurePriceStyle(config) {
        var _this = _super.call(this, config) || this;
        _this.loadState(config);
        return _this;
    }
    Object.defineProperty(PointAndFigurePriceStyle, "className", {
        get: function () {
            return 'pointAndFigure';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointAndFigurePriceStyle.prototype, "boxSize", {
        get: function () {
            return this._boxSize;
        },
        set: function (value) {
            this._boxSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointAndFigurePriceStyle.prototype, "reversal", {
        get: function () {
            return this._reversal;
        },
        set: function (value) {
            if (value != null && !JsUtil.isPositiveNumber(value))
                throw new TypeError("Reversal must be a positive number.");
            this._reversal = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointAndFigurePriceStyle.prototype, "boxSizeValue", {
        get: function () {
            return this._boxSizeValue;
        },
        enumerable: true,
        configurable: true
    });
    PointAndFigurePriceStyle.prototype.saveState = function () {
        var state = _super.prototype.saveState.call(this);
        state.boxSize = JsUtil.clone(this._boxSize);
        state.reversal = this._reversal;
        return state;
    };
    PointAndFigurePriceStyle.prototype.loadState = function (state) {
        _super.prototype.loadState.call(this, state);
        this.boxSize = (state && state.boxSize) || JsUtil.clone(PointAndFigurePriceStyle.defaults.boxSize);
        this.reversal = (state && state.reversal) || PointAndFigurePriceStyle.defaults.reversal;
    };
    PointAndFigurePriceStyle.prototype.createPlot = function (chart) {
        var plot = new PointAndFigurePlot(chart, {
            plotStyle: BarPlot.Style.POINT_AND_FIGURE,
            plotType: PlotType.PRICE_STYLE,
        });
        plot.boxSize = this._boxSizeValue;
        return plot;
    };
    PointAndFigurePriceStyle.prototype.dataSeriesSuffix = function () {
        return DataSeriesSuffix.POINT_AND_FIGURE;
    };
    PointAndFigurePriceStyle.prototype.primaryDataSeriesSuffix = function (suffix) {
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
    PointAndFigurePriceStyle.prototype._calculateBoxSizeValue = function () {
        var boxSize = this.boxSize, value;
        switch (boxSize.kind) {
            case PointAndFigureBoxSizeKind.ATR:
                value = this._calculateAtr(boxSize.value);
                break;
            case PointAndFigureBoxSizeKind.FIXED:
                value = boxSize.value;
                break;
            default:
                throw new Error("Unknown box size kind: " + boxSize.kind);
        }
        this._boxSizeValue = value;
        return value;
    };
    PointAndFigurePriceStyle.prototype.updateComputedDataSeries = function () {
        var boxSize = this._calculateBoxSizeValue();
        if (!boxSize)
            return;
        var plot = this._plot;
        if (plot)
            plot.boxSize = boxSize;
        var dataManager = this.chart.dataManager, pf = dataManager.barDataSeries(DataSeriesSuffix.POINT_AND_FIGURE, true);
        BarConverter.convertToPointAndFigure(dataManager.barDataSeries(), boxSize, this.reversal, pf);
    };
    PointAndFigurePriceStyle.defaults = {
        boxSize: {
            kind: PointAndFigureBoxSizeKind.ATR,
            value: 20,
        },
        reversal: 3
    };
    return PointAndFigurePriceStyle;
}(PriceStyle));
export { PointAndFigurePriceStyle };
PriceStyle.register(PointAndFigurePriceStyle);
//# sourceMappingURL=PointAndFigurePriceStyle.js.map