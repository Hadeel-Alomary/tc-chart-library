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
import { TAIndicator } from './TAIndicator';
import { AccumulatedLiquidityByNetValue, AccumulatedLiquidityByNetVolume, LiquidityByNetValue, LiquidityByNetVolume, LiquidityByValue, LiquidityByVolume } from '../../TASdk/TASdk';
import { Recordset } from '../../TASdk/Recordset';
import { IndicatorField, IndicatorPlotTypes } from './IndicatorConst';
import { Field } from '../../TASdk/Field';
import { ChartAccessorService } from '../../../services/chart';
import { Interval, IntervalType } from '../../../services/loader';
import { LiquidityHistoryLoadingState } from '../../../services/liquidity/liquidity.service';
import { DataSeriesSuffix } from '../../StockChartX/Data/DataSeries';
var LiquidityIndicator = (function (_super) {
    __extends(LiquidityIndicator, _super);
    function LiquidityIndicator(config) {
        var _this = _super.call(this, config) || this;
        _this._recalculateRecordSet = true;
        _this._subscription = ChartAccessorService.instance.getSymbolLiquidityUpdateStream().subscribe(function (liquidityUpdateTopic) {
            var isSameSymbol = liquidityUpdateTopic.symbol == _this._activeSymbol;
            var isSameInterval = liquidityUpdateTopic.interval.type == IntervalType.Custom ? (liquidityUpdateTopic.interval.base == _this._activeInterval.base && liquidityUpdateTopic.interval.repeat == _this._activeInterval.repeat) : liquidityUpdateTopic.interval.type == _this._activeInterval.type;
            if (isSameSymbol && isSameInterval) {
                _this._redrawChartOnLiquidityChange();
            }
        });
        return _this;
    }
    LiquidityIndicator.prototype._initIndicator = function (config) {
        this._options.parameters = {};
        switch (config.taIndicator) {
            case AccumulatedLiquidityByNetValue:
            case AccumulatedLiquidityByNetVolume:
                this._fieldNames = [IndicatorField.INDICATOR];
                break;
            case LiquidityByValue:
                this._fieldNames = [
                    IndicatorField.LIQUIDITY_INFLOW_VALUE,
                    IndicatorField.LIQUIDITY_OUTFLOW_VALUE,
                    IndicatorField.LIQUIDITY_NET_VALUE
                ];
                break;
            case LiquidityByVolume:
                this._fieldNames = [
                    IndicatorField.LIQUIDITY_INFLOW_VOLUME,
                    IndicatorField.LIQUIDITY_OUTFLOW_VOLUME,
                    IndicatorField.LIQUIDITY_NET_VOLUME
                ];
                break;
            default:
                this._fieldNames = [IndicatorField.INDICATOR_HISTOGRAM];
        }
    };
    LiquidityIndicator.prototype.calculate = function () {
        return {
            parameters: this.getParametersString(),
            recordSet: this._getRecordSet(),
            startIndex: 0
        };
    };
    LiquidityIndicator.prototype.getParametersString = function () {
        return "";
    };
    LiquidityIndicator.prototype.destroy = function () {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        _super.prototype.destroy.call(this);
    };
    LiquidityIndicator.prototype._getIndicatorPlotType = function (fieldName) {
        switch (fieldName) {
            case IndicatorField.INDICATOR_HISTOGRAM:
            case IndicatorField.LIQUIDITY_NET_VALUE:
            case IndicatorField.LIQUIDITY_NET_VOLUME:
                return IndicatorPlotTypes.HISTOGRAM_PLOT;
            default:
                return IndicatorPlotTypes.LINE_PLOT;
        }
    };
    LiquidityIndicator.prototype._handlePanGesture = function (gesture) { };
    LiquidityIndicator.prototype._initPanel = function () {
        this._panel.valueScale.formatter.setDecimalDigits(0);
    };
    LiquidityIndicator.prototype._preUpdateSetup = function () {
        this._recalculateRecordSet = true;
        var chartInterval = Interval.fromChartInterval(this.chart.timeInterval);
        var isSameSymbol = this.chart.instrument.symbol == this._activeSymbol;
        var isSameInterval = this._activeInterval ? chartInterval.type == IntervalType.Custom ? (chartInterval.base == this._activeInterval.base && chartInterval.repeat == this._activeInterval.repeat) : chartInterval.type == this._activeInterval.type : false;
        if (!isSameSymbol || !isSameInterval) {
            this._activeSymbol = this.chart.instrument.symbol;
            this._activeInterval = chartInterval;
            switch (ChartAccessorService.instance.getSymbolLiquidityHistoryLoadState(this._activeSymbol, this._activeInterval)) {
                case LiquidityHistoryLoadingState.NOT_LOADED:
                    break;
                case LiquidityHistoryLoadingState.REQUESTED:
                    break;
                case LiquidityHistoryLoadingState.LOADED:
                    this._redrawChartOnLiquidityChange();
                    break;
            }
        }
    };
    LiquidityIndicator.prototype._getNetValues = function (liquidityPoints) {
        var results = [];
        for (var _i = 0, liquidityPoints_1 = liquidityPoints; _i < liquidityPoints_1.length; _i++) {
            var point = liquidityPoints_1[_i];
            results.push(point.netAmount);
        }
        return results;
    };
    LiquidityIndicator.prototype._getNetVolumeValues = function (liquidityPoints) {
        var results = [];
        for (var _i = 0, liquidityPoints_2 = liquidityPoints; _i < liquidityPoints_2.length; _i++) {
            var point = liquidityPoints_2[_i];
            results.push(point.netVolume);
        }
        return results;
    };
    LiquidityIndicator.prototype._getAccumulatedNetValues = function (liquidityPoints) {
        var results = [];
        for (var _i = 0, liquidityPoints_3 = liquidityPoints; _i < liquidityPoints_3.length; _i++) {
            var point = liquidityPoints_3[_i];
            var amount = point.netAmount;
            if (results.length > 0) {
                amount += results[results.length - 1];
            }
            results.push(amount);
        }
        return results;
    };
    LiquidityIndicator.prototype._getAccumulatedNetVolumeValues = function (liquidityPoints) {
        var results = [];
        for (var _i = 0, liquidityPoints_4 = liquidityPoints; _i < liquidityPoints_4.length; _i++) {
            var point = liquidityPoints_4[_i];
            var amount = point.netVolume;
            if (results.length > 0) {
                amount += results[results.length - 1];
            }
            results.push(amount);
        }
        return results;
    };
    LiquidityIndicator.prototype._getInflowValues = function (liquidityPoints) {
        var results = [];
        for (var _i = 0, liquidityPoints_5 = liquidityPoints; _i < liquidityPoints_5.length; _i++) {
            var point = liquidityPoints_5[_i];
            results.push(point.inflowAmount);
        }
        return results;
    };
    LiquidityIndicator.prototype._getOutflowValues = function (liquidityPoints) {
        var results = [];
        for (var _i = 0, liquidityPoints_6 = liquidityPoints; _i < liquidityPoints_6.length; _i++) {
            var point = liquidityPoints_6[_i];
            results.push(point.outflowAmount);
        }
        return results;
    };
    LiquidityIndicator.prototype._getInflowVolumeValues = function (liquidityPoints) {
        var results = [];
        for (var _i = 0, liquidityPoints_7 = liquidityPoints; _i < liquidityPoints_7.length; _i++) {
            var point = liquidityPoints_7[_i];
            results.push(point.inflowVolume);
        }
        return results;
    };
    LiquidityIndicator.prototype._getOutflowVolumeValues = function (liquidityPoints) {
        var results = [];
        for (var _i = 0, liquidityPoints_8 = liquidityPoints; _i < liquidityPoints_8.length; _i++) {
            var point = liquidityPoints_8[_i];
            results.push(point.outflowVolume);
        }
        return results;
    };
    LiquidityIndicator.prototype._getFieldValues = function (fieldName, liquidityPoints) {
        switch (this.indicatorTypeId) {
            case LiquidityByNetValue:
                return this._getNetValues(liquidityPoints);
            case LiquidityByNetVolume:
                return this._getNetVolumeValues(liquidityPoints);
            case AccumulatedLiquidityByNetValue:
                return this._getAccumulatedNetValues(liquidityPoints);
            case AccumulatedLiquidityByNetVolume:
                return this._getAccumulatedNetVolumeValues(liquidityPoints);
            case LiquidityByValue:
                if (fieldName == IndicatorField.LIQUIDITY_INFLOW_VALUE)
                    return this._getInflowValues(liquidityPoints);
                else if (fieldName == IndicatorField.LIQUIDITY_OUTFLOW_VALUE)
                    return this._getOutflowValues(liquidityPoints);
                else
                    return this._getNetValues(liquidityPoints);
            case LiquidityByVolume:
                if (fieldName == IndicatorField.LIQUIDITY_INFLOW_VOLUME)
                    return this._getInflowVolumeValues(liquidityPoints);
                else if (fieldName == IndicatorField.LIQUIDITY_OUTFLOW_VOLUME)
                    return this._getOutflowVolumeValues(liquidityPoints);
                else
                    return this._getNetVolumeValues(liquidityPoints);
            default:
                return [];
        }
    };
    LiquidityIndicator.prototype._getRecordSet = function () {
        if (this.getDateDataSeries().values.length == 0) {
            return new Recordset();
        }
        if (!this._recalculateRecordSet) {
            return this._cachedRecordSet;
        }
        var allLiquidityPoints = ChartAccessorService.instance.getSymbolLiquidityPoints(this._activeSymbol, this._activeInterval);
        var fromDate = moment(this.getDateDataSeries().firstValue).format('YYYY-MM-DD HH:mm:ss');
        var chartPeriodLiquidityPoints = allLiquidityPoints.filter(function (point) { return fromDate <= point.time; });
        this._cachedRecordSet = this._calculateRecordSet(chartPeriodLiquidityPoints);
        this._recalculateRecordSet = false;
        return this._cachedRecordSet;
    };
    LiquidityIndicator.prototype._calculateRecordSet = function (liquidityPoints) {
        var candlesCount = this.getDateDataSeries().values.length;
        var recordset = new Recordset();
        for (var i = 0, n = this._fieldNames.length; i < n; i++) {
            var fieldName = this._fieldNames[i], liquidityField = new Field(), valuesCount = liquidityPoints.length;
            liquidityField.initialize(candlesCount + 1, fieldName);
            var values = this._getFieldValues(fieldName, liquidityPoints);
            for (var j = candlesCount; j >= 0; j--) {
                var value = values[--valuesCount];
                value = isNaN(value) ? null : value;
                liquidityField.setValue(j, value);
            }
            recordset.addField(liquidityField);
        }
        return recordset;
    };
    LiquidityIndicator.prototype.getDateDataSeries = function () {
        return this._chart.primaryDataSeries(DataSeriesSuffix.DATE);
    };
    LiquidityIndicator.prototype._redrawChartOnLiquidityChange = function () {
        this._recalculateRecordSet = true;
        this.update();
        this._chart.setNeedsUpdate(true);
    };
    return LiquidityIndicator;
}(TAIndicator));
export { LiquidityIndicator };
//# sourceMappingURL=LiquidityIndicator.js.map