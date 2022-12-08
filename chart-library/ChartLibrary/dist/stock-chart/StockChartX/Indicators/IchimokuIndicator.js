import { __extends } from "tslib";
import { TAIndicator } from './TAIndicator';
import { DataSeries } from '../Data/DataSeries';
import { Bands } from '../../TASdk/Bands';
import { LinePlot } from '../Plots/LinePlot';
import { PlotType } from '../Plots/Plot';
import { KumoPlot } from '../Plots/KumoPlot';
import { ChartAccessorService } from '../../../services/index';
import { IchimokuIndicatorParam, IndicatorField } from './IndicatorConst';
import { ChannelRequestType } from '../../../services';
var IchimokuIndicator = (function (_super) {
    __extends(IchimokuIndicator, _super);
    function IchimokuIndicator(config) {
        var _this = _super.call(this, config) || this;
        _this._tenkanSenDataseries = null;
        _this._kijunSenDataseries = null;
        _this._chikouSpanDataseries = null;
        _this._senkouSpanADataseries = null;
        _this._senkouSpanBDataseries = null;
        _this._tenkanSenPlotItem = null;
        _this._kijunSenPlotItem = null;
        _this._chikouSpanPlotItem = null;
        _this._senkouSpanAPlotItem = null;
        _this._senkouSpanBPlotItem = null;
        _this._kumoPlotItem = null;
        return _this;
    }
    Object.defineProperty(IchimokuIndicator.prototype, "lines", {
        get: function () {
            return this._options.parameters[IchimokuIndicatorParam.LINES];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IchimokuIndicator.prototype, "conversionLinePeriods", {
        get: function () {
            return this._options.parameters[IchimokuIndicatorParam.CONVERSIONLINEPERIODS];
        },
        set: function (val) {
            this._options.parameters[IchimokuIndicatorParam.CONVERSIONLINEPERIODS] = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IchimokuIndicator.prototype, "baseLinePeriods", {
        get: function () {
            return this._options.parameters[IchimokuIndicatorParam.BASELINEPERIODS];
        },
        set: function (val) {
            this._options.parameters[IchimokuIndicatorParam.BASELINEPERIODS] = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IchimokuIndicator.prototype, "loggingSpan2Periods", {
        get: function () {
            return this._options.parameters[IchimokuIndicatorParam.LOGGINGSPAN2PERIODS];
        },
        set: function (val) {
            this._options.parameters[IchimokuIndicatorParam.LOGGINGSPAN2PERIODS] = val;
        },
        enumerable: false,
        configurable: true
    });
    IchimokuIndicator.prototype.getAlertParameters = function () {
        var parameters = this.getParameters();
        return [parameters.conversionLinePeriods, parameters.baseLinePeriods, parameters.loggingSpan2Periods];
    };
    IchimokuIndicator.prototype.getParameters = function () {
        return {
            conversionLinePeriods: this.conversionLinePeriods,
            baseLinePeriods: this.baseLinePeriods,
            loggingSpan2Periods: this.loggingSpan2Periods
        };
    };
    IchimokuIndicator.prototype.getParametersString = function () {
        var parameters = this.getParameters();
        return [parameters.conversionLinePeriods, parameters.baseLinePeriods, parameters.loggingSpan2Periods].join(', ');
    };
    IchimokuIndicator.prototype._initIndicator = function () {
        this._options.parameters = {};
        this._isOverlay = true;
        this._fieldNames = [
            IndicatorField.ICHIMOKU_TENKAN_SEN,
            IndicatorField.ICHIMOKU_KIJUN_SEN,
            IndicatorField.ICHIMOKU_CHIKOU_SPAN,
            IndicatorField.ICHIMOKU_SENKOU_SPAN_A,
            IndicatorField.ICHIMOKU_SENKOU_SPAN_B,
            IndicatorField.ICHIMOKU_KUMO
        ];
    };
    IchimokuIndicator.prototype.calculate = function () {
        var bands = Bands.prototype;
        return {
            parameters: this.getParametersString(),
            recordSet: bands.ichimoku(this._createRecordset(), this.conversionLinePeriods, this.baseLinePeriods, this.loggingSpan2Periods),
            startIndex: 1
        };
    };
    IchimokuIndicator.prototype.fixFirstNotNullIncorrectValue = function (dataserie) {
        if (!dataserie)
            return dataserie;
        var index = 0, isContinue = true;
        while (isContinue && index < dataserie.length) {
            if (dataserie.values[index] != null) {
                dataserie.values[index] = null;
                isContinue = false;
            }
            index++;
        }
        return dataserie;
    };
    IchimokuIndicator.prototype.getDataserieFromRecordSet = function (recordSet, fieldName, startIndex) {
        var field = recordSet && recordSet.getField(fieldName);
        return this.fixFirstNotNullIncorrectValue(field ? DataSeries.fromField(field, startIndex) : new DataSeries(fieldName));
    };
    IchimokuIndicator.prototype.shiftInToThePast = function (dataserie, positionsCount) {
        if (dataserie.values.length <= positionsCount)
            return dataserie;
        for (var i = 0; i < positionsCount; i++) {
            dataserie.add(null);
        }
        var newDataserie = new DataSeries(dataserie.name), values = dataserie.values;
        values.splice(0, positionsCount);
        newDataserie.add(values);
        return newDataserie;
    };
    IchimokuIndicator.prototype.shiftInToTheFuture = function (dataserie, positionsCount) {
        var newDataserie = new DataSeries(dataserie.name);
        for (var i = 0; i <= dataserie.length + positionsCount; i++) {
            if (i < positionsCount)
                newDataserie.add(null);
            else
                newDataserie.add(dataserie.values[i - positionsCount]);
        }
        return newDataserie;
    };
    IchimokuIndicator.prototype.hidePlotItem = function (plotItem) {
        plotItem.plot.visible = false;
        plotItem.titlePlotSpan.hide();
        plotItem.titleValueSpan.hide();
    };
    IchimokuIndicator.prototype.showPlotItem = function (plotItem) {
        plotItem.plot.visible = true;
        plotItem.titlePlotSpan.show();
        plotItem.titleValueSpan.show();
    };
    IchimokuIndicator.prototype.update = function () {
        if (!this.isInitialized) {
            this.showValuesInTitle = true;
            this._tenkanSenDataseries = new DataSeries(this.getName() + " Ichimoku Tenkan Sen");
            this._kijunSenDataseries = new DataSeries(this.getName() + " Ichimoku Kijun Sen");
            this._chikouSpanDataseries = new DataSeries(this.getName() + " Ichimoku Chikou Span");
            this._senkouSpanADataseries = new DataSeries(this.getName() + " Ichimoku Senkou Span A");
            this._senkouSpanBDataseries = new DataSeries(this.getName() + " Ichimoku Senkou Span B");
            if (!this._panel) {
                this._panel = this._chart.mainPanel;
                this._initPanelTitle();
            }
            var tenkanSenPlot = new LinePlot(this.chart, {
                dataSeries: this._tenkanSenDataseries,
                theme: this.lines[0].theme,
                plotType: PlotType.INDICATOR
            });
            var kijunSenPlot = new LinePlot(this.chart, {
                dataSeries: this._kijunSenDataseries,
                theme: this.lines[1].theme,
                plotType: PlotType.INDICATOR
            });
            var chikouSpanPlot = new LinePlot(this.chart, {
                dataSeries: this._chikouSpanDataseries,
                theme: this.lines[2].theme,
                plotType: PlotType.INDICATOR
            });
            var senkouSpanAPlot = new LinePlot(this.chart, {
                dataSeries: this._senkouSpanADataseries,
                theme: this.lines[3].theme,
                plotType: PlotType.INDICATOR
            });
            var senkouSpanBPlot = new LinePlot(this.chart, {
                dataSeries: this._senkouSpanBDataseries,
                theme: this.lines[4].theme,
                plotType: PlotType.INDICATOR
            });
            var kumoPlot = new KumoPlot(this.chart, {
                dataSeries: [this._senkouSpanADataseries, this._senkouSpanBDataseries],
                theme: this.lines[5].theme,
                plotType: PlotType.INDICATOR
            });
            this._tenkanSenPlotItem = this._addPlot(tenkanSenPlot, this.lines[0].theme.strokeColor);
            this._kijunSenPlotItem = this._addPlot(kijunSenPlot, this.lines[1].theme.strokeColor);
            this._chikouSpanPlotItem = this._addPlot(chikouSpanPlot, this.lines[2].theme.strokeColor);
            this._senkouSpanAPlotItem = this._addPlot(senkouSpanAPlot, this.lines[3].theme.strokeColor);
            this._senkouSpanBPlotItem = this._addPlot(senkouSpanBPlot, this.lines[4].theme.strokeColor);
            this._kumoPlotItem = this._addPlot(kumoPlot, "transparent");
        }
        else {
            this._tenkanSenPlotItem.plot.theme = this.lines[0].theme;
            this._kijunSenPlotItem.plot.theme = this.lines[1].theme;
            this._chikouSpanPlotItem.plot.theme = this.lines[2].theme;
            this._senkouSpanAPlotItem.plot.theme = this.lines[3].theme;
            this._senkouSpanBPlotItem.plot.theme = this.lines[4].theme;
            this._kumoPlotItem.plot.theme = this.lines[5].theme;
        }
        this._tenkanSenDataseries.clear();
        this._kijunSenDataseries.clear();
        this._chikouSpanDataseries.clear();
        this._senkouSpanADataseries.clear();
        this._senkouSpanBDataseries.clear();
        this.visible && this.lines[0].visible
            ? this.showPlotItem(this._tenkanSenPlotItem)
            : this.hidePlotItem(this._tenkanSenPlotItem);
        this.visible && this.lines[1].visible
            ? this.showPlotItem(this._kijunSenPlotItem)
            : this.hidePlotItem(this._kijunSenPlotItem);
        this.visible && this.lines[2].visible
            ? this.showPlotItem(this._chikouSpanPlotItem)
            : this.hidePlotItem(this._chikouSpanPlotItem);
        this.visible && this.lines[3].visible
            ? this.showPlotItem(this._senkouSpanAPlotItem)
            : this.hidePlotItem(this._senkouSpanAPlotItem);
        this.visible && this.lines[4].visible
            ? this.showPlotItem(this._senkouSpanBPlotItem)
            : this.hidePlotItem(this._senkouSpanBPlotItem);
        this.visible && this.lines[5].visible
            ? this.showPlotItem(this._kumoPlotItem)
            : this.hidePlotItem(this._kumoPlotItem);
        var result = this.calculate();
        this._tenkanSenDataseries.add(this.getDataserieFromRecordSet(result.recordSet, "Ichimoku Tenkan Sen", result.startIndex).values);
        this._kijunSenDataseries.add(this.getDataserieFromRecordSet(result.recordSet, "Ichimoku Kijun Sen", result.startIndex).values);
        this._chikouSpanDataseries.add(this.shiftInToThePast(this.getDataserieFromRecordSet(result.recordSet, "Ichimoku Chikou Span", result.startIndex), this.baseLinePeriods).values);
        this._senkouSpanADataseries.add(this.shiftInToTheFuture(this.getDataserieFromRecordSet(result.recordSet, "Ichimoku Senkou Span A", result.startIndex), this.baseLinePeriods).values);
        this._senkouSpanBDataseries.add(this.shiftInToTheFuture(this.getDataserieFromRecordSet(result.recordSet, "Ichimoku Senkou Span B", result.startIndex), this.baseLinePeriods).values);
        this._updatePanelTitle();
        this.updateHoverRecord();
    };
    IchimokuIndicator.prototype.showSettingsDialog = function () {
        var showIchmokuSettingsRequest = { type: ChannelRequestType.IchimokuCloudSettingsDialog, indicator: this };
        ChartAccessorService.instance.sendSharedChannelRequest(showIchmokuSettingsRequest);
    };
    IchimokuIndicator.prototype._handlePanGesture = function (gesture) {
    };
    return IchimokuIndicator;
}(TAIndicator));
export { IchimokuIndicator };
//# sourceMappingURL=IchimokuIndicator.js.map