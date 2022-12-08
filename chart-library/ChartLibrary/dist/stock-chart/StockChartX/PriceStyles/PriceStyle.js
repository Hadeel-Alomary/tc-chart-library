import { ClassRegistrar } from "../Utils/ClassRegistrar";
import { DataSeries, DataSeriesSuffix } from "../Data/DataSeries";
import { AverageTrueRange } from "../../TASdk/TASdk";
import { JsUtil } from "../Utils/JsUtil";
import { TAIndicator } from "../Indicators/TAIndicator";
import { IndicatorField, IndicatorParam } from "../Indicators/IndicatorConst";
var PriceStyleRegistrar = (function () {
    function PriceStyleRegistrar() {
    }
    Object.defineProperty(PriceStyleRegistrar, "registeredPriceStyles", {
        get: function () {
            return this._priceStyles.registeredItems;
        },
        enumerable: false,
        configurable: true
    });
    PriceStyleRegistrar.register = function (typeOrClassName, constructor) {
        if (typeof typeOrClassName === 'string')
            this._priceStyles.register(typeOrClassName, constructor);
        else
            this._priceStyles.register(typeOrClassName.className, typeOrClassName);
    };
    PriceStyleRegistrar.create = function (className) {
        return this._priceStyles.createInstance(className);
    };
    PriceStyleRegistrar.deserialize = function (state) {
        if (!state)
            return null;
        var priceStyle = this._priceStyles.createInstance(state.className);
        priceStyle.loadState(state);
        return priceStyle;
    };
    PriceStyleRegistrar._priceStyles = new ClassRegistrar();
    return PriceStyleRegistrar;
}());
var PriceStyle = (function () {
    function PriceStyle(config) {
        if (config) {
            this.chart = config.chart;
        }
    }
    Object.defineProperty(PriceStyle, "className", {
        get: function () {
            return '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PriceStyle.prototype, "plot", {
        get: function () {
            return this._plot;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PriceStyle.prototype, "chart", {
        get: function () {
            return this._chart;
        },
        set: function (value) {
            if (this._chart !== value) {
                this.destroy();
                this._chart = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PriceStyle.prototype, "chartPanel", {
        get: function () {
            return this._plot && this._plot.chartPanel;
        },
        enumerable: false,
        configurable: true
    });
    PriceStyle.prototype.saveState = function () {
        return {
            className: this.constructor.className
        };
    };
    PriceStyle.prototype.loadState = function (state) {
    };
    PriceStyle.prototype.apply = function () {
        var chart = this._chart;
        if (!chart)
            return;
        var plot = this._plot;
        if (!plot)
            this._plot = plot = this.createPlot(chart);
        if (!plot)
            throw new Error('Price style plot is not created.');
        this.updateComputedDataSeries();
        chart.updateIndicators();
        var dsSuffix = DataSeriesSuffix;
        plot.dataSeries = [
            chart.primaryDataSeries(dsSuffix.CLOSE),
            chart.primaryDataSeries(dsSuffix.OPEN),
            chart.primaryDataSeries(dsSuffix.HIGH),
            chart.primaryDataSeries(dsSuffix.LOW)
        ];
        chart.mainPanel.addPlot(plot);
        chart.setNeedsLayout();
    };
    PriceStyle.prototype.createPlot = function (chart) {
        return null;
    };
    PriceStyle.prototype.dataSeriesSuffix = function () {
        return '';
    };
    PriceStyle.prototype.primaryDataSeriesSuffix = function (suffix) {
        var dsSuffix = DataSeriesSuffix;
        switch (suffix) {
            case dsSuffix.OPEN:
            case dsSuffix.HIGH:
            case dsSuffix.LOW:
            case dsSuffix.CLOSE:
                return this.dataSeriesSuffix();
            default:
                return '';
        }
    };
    PriceStyle.prototype.removeComputedDataSeries = function () {
        var chart = this._chart;
        if (!chart)
            return;
        var psSuffix = this.dataSeriesSuffix(), dsSuffix = DataSeriesSuffix;
        if (!psSuffix)
            return;
        chart.removeDataSeries(psSuffix + dsSuffix.DATE);
        chart.removeDataSeries(psSuffix + dsSuffix.OPEN);
        chart.removeDataSeries(psSuffix + dsSuffix.HIGH);
        chart.removeDataSeries(psSuffix + dsSuffix.LOW);
        chart.removeDataSeries(psSuffix + dsSuffix.CLOSE);
        chart.removeDataSeries(psSuffix + dsSuffix.VOLUME);
    };
    PriceStyle.prototype.updateComputedDataSeries = function () {
    };
    PriceStyle.prototype._calculateAtr = function (period) {
        var atr = new TAIndicator({
            taIndicator: AverageTrueRange,
            chart: this.chart
        });
        atr.setParameterValue(IndicatorParam.PERIODS, period);
        atr._usePrimaryDataSeries = false;
        var res = atr.calculate();
        if (!res.recordSet)
            return null;
        var field = res.recordSet.getField(IndicatorField.INDICATOR);
        if (!field)
            return null;
        var atrDataSeries = DataSeries.fromField(field, res.startIndex);
        var value = atrDataSeries.lastValue;
        if (!value)
            return null;
        return Math.roundToDecimals(value, 5);
    };
    PriceStyle.prototype.destroy = function () {
        var plot = this._plot;
        if (plot && plot.chartPanel)
            plot.chartPanel.removePlot(plot);
        this.removeComputedDataSeries();
    };
    return PriceStyle;
}());
export { PriceStyle };
JsUtil.applyMixins(PriceStyle, [PriceStyleRegistrar]);
//# sourceMappingURL=PriceStyle.js.map