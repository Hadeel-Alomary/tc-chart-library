/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {ITAIndicatorConfig, TAIndicator} from './TAIndicator';
import {DataSeries, TDataSeriesValues} from '../Data/DataSeries';
import {IchimokuKinkoHyo} from '../../TASdk/TASdk';
import {Bands} from '../../TASdk/Bands';
import {Recordset} from '../../TASdk/Recordset';
import {LinePlot} from '../Plots/LinePlot';
import {PlotType} from '../Plots/Plot';
import {KumoPlot} from '../Plots/KumoPlot';
import {PanGesture} from '../Gestures/PanGesture';
import {ChartAccessorService} from '../../../services/index';
import {IchimokuIndicatorParam, IndicatorField} from './IndicatorConst';
import {TAIndicatorParameters} from './TAIndicatorParameters';
import {PlotItem} from './Indicator';
import {LineParameter} from './IndicatorsDefaultSettings';
import {LinePlotTheme} from '../Theme';
import {ShowIndicatorSettingsDialogRequest} from '../../../services/shared-channel/channel-request';
import {ChannelRequestType} from '../../../services';

export interface IIchimukoIndicatorConfig extends ITAIndicatorConfig {

}

export class IchimokuIndicator extends TAIndicator {

    private _tenkanSenDataseries: DataSeries = null;
    private _kijunSenDataseries: DataSeries = null;
    private _chikouSpanDataseries: DataSeries = null;
    private _senkouSpanADataseries: DataSeries = null;
    private _senkouSpanBDataseries: DataSeries = null;

    private _tenkanSenPlotItem: PlotItem = null;
    private _kijunSenPlotItem: PlotItem = null;
    private _chikouSpanPlotItem: PlotItem = null;
    private _senkouSpanAPlotItem: PlotItem = null;
    private _senkouSpanBPlotItem: PlotItem = null;
    private _kumoPlotItem: PlotItem = null;

    constructor(config: IIchimukoIndicatorConfig) {
        super(config);
    }

    get lines(): LineParameter[] {
        return this._options.parameters[IchimokuIndicatorParam.LINES] as LineParameter[];
    }

    get conversionLinePeriods(): number {
        return this._options.parameters[IchimokuIndicatorParam.CONVERSIONLINEPERIODS] as number;
    }

    set conversionLinePeriods(val: number) {
        this._options.parameters[IchimokuIndicatorParam.CONVERSIONLINEPERIODS] = val;
    }

    get baseLinePeriods(): number {
        return this._options.parameters[IchimokuIndicatorParam.BASELINEPERIODS] as number;
    }

    set baseLinePeriods(val: number) {
        this._options.parameters[IchimokuIndicatorParam.BASELINEPERIODS] = val;
    }

    get loggingSpan2Periods(): number {
        return this._options.parameters[IchimokuIndicatorParam.LOGGINGSPAN2PERIODS] as number;
    }

    set loggingSpan2Periods(val: number) {
        this._options.parameters[IchimokuIndicatorParam.LOGGINGSPAN2PERIODS] = val;
    }

    getAlertParameters() {
        let parameters = this.getParameters();
        return [parameters.conversionLinePeriods, parameters.baseLinePeriods, parameters.loggingSpan2Periods];
    }

    getParameters(): TAIndicatorParameters {
        return {
            conversionLinePeriods: this.conversionLinePeriods,
            baseLinePeriods: this.baseLinePeriods,
            loggingSpan2Periods: this.loggingSpan2Periods
        };
    }

    getParametersString() {
        let parameters = this.getParameters();
        return [parameters.conversionLinePeriods, parameters.baseLinePeriods, parameters.loggingSpan2Periods].join(', ');
    }

    _initIndicator() {
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
    }

    calculate() {
        let bands = Bands.prototype;

        return {
            parameters: this.getParametersString(),
            recordSet: bands.ichimoku(this._createRecordset(), this.conversionLinePeriods, this.baseLinePeriods, this.loggingSpan2Periods),
            startIndex: 1
        }
    }

    fixFirstNotNullIncorrectValue(dataserie: DataSeries): DataSeries {
        if (!dataserie) return dataserie;

        let index: number = 0,
            isContinue: boolean = true;

        while (isContinue && index < dataserie.length) {
            if (dataserie.values[index] != null) {
                dataserie.values[index] = null;
                isContinue = false;
            }
            index++;
        }

        return dataserie;
    }

    getDataserieFromRecordSet(recordSet: Recordset, fieldName: string, startIndex: number): DataSeries {
        let field = recordSet && recordSet.getField(fieldName);
        return this.fixFirstNotNullIncorrectValue(field ? DataSeries.fromField(field, startIndex) : new DataSeries(fieldName));
    }

    shiftInToThePast(dataserie: DataSeries, positionsCount: number): DataSeries {
        if (dataserie.values.length <= positionsCount) return dataserie;

        for (let i = 0; i < positionsCount; i++) {
            dataserie.add(null);
        }

        let newDataserie = new DataSeries(dataserie.name),
            values: TDataSeriesValues = dataserie.values;

        values.splice(0, positionsCount);
        newDataserie.add(values);

        return newDataserie;
    }

    shiftInToTheFuture(dataserie: DataSeries, positionsCount: number): DataSeries {
        let newDataserie = new DataSeries(dataserie.name);

        for (let i = 0; i <= dataserie.length + positionsCount; i++) {
            if (i < positionsCount)
                newDataserie.add(null);
            else
                newDataserie.add(dataserie.values[i - positionsCount]);
        }

        return newDataserie;
    }

    hidePlotItem(plotItem: PlotItem) {
        plotItem.plot.visible = false;
        plotItem.titlePlotSpan.hide();
        plotItem.titleValueSpan.hide();
    }

    showPlotItem(plotItem: PlotItem) {
        plotItem.plot.visible = true;
        plotItem.titlePlotSpan.show();
        plotItem.titleValueSpan.show();
    }

    /**
     * Updates indicator.
     */
    update() {
        // Calculate your indicator values
        if (!this.isInitialized) {

            this.showValuesInTitle = true;
            //this._panel = this._chart.mainPanel;

            this._tenkanSenDataseries = new DataSeries(this.getName() + " Ichimoku Tenkan Sen");
            this._kijunSenDataseries = new DataSeries(this.getName() + " Ichimoku Kijun Sen");
            this._chikouSpanDataseries = new DataSeries(this.getName() + " Ichimoku Chikou Span");
            this._senkouSpanADataseries = new DataSeries(this.getName() + " Ichimoku Senkou Span A");
            this._senkouSpanBDataseries = new DataSeries(this.getName() + " Ichimoku Senkou Span B");
            if (!this._panel) {
                this._panel = this._chart.mainPanel;
                this._initPanelTitle();
            }

            var tenkanSenPlot = new LinePlot(this.chart,{
                dataSeries: this._tenkanSenDataseries,
                theme: this.lines[0].theme,
                plotType: PlotType.INDICATOR
            });

            var kijunSenPlot = new LinePlot(this.chart,{
                dataSeries: this._kijunSenDataseries,
                theme: this.lines[1].theme,
                plotType: PlotType.INDICATOR
            });

            var chikouSpanPlot = new LinePlot(this.chart,{
                dataSeries: this._chikouSpanDataseries,
                theme: this.lines[2].theme,
                plotType: PlotType.INDICATOR
            });

            var senkouSpanAPlot = new LinePlot(this.chart,{
                dataSeries: this._senkouSpanADataseries,
                theme: this.lines[3].theme,
                plotType: PlotType.INDICATOR
            });

            var senkouSpanBPlot = new LinePlot(this.chart, {
                dataSeries: this._senkouSpanBDataseries,
                theme: this.lines[4].theme,
                plotType: PlotType.INDICATOR
            });

            var kumoPlot = new KumoPlot(this.chart,{
                dataSeries: [this._senkouSpanADataseries, this._senkouSpanBDataseries],
                theme: this.lines[5].theme,
                plotType: PlotType.INDICATOR
            });

            this._tenkanSenPlotItem = this._addPlot(tenkanSenPlot, (this.lines[0].theme as LinePlotTheme).strokeColor);
            this._kijunSenPlotItem = this._addPlot(kijunSenPlot, (this.lines[1].theme  as LinePlotTheme).strokeColor);
            this._chikouSpanPlotItem = this._addPlot(chikouSpanPlot, (this.lines[2].theme  as LinePlotTheme).strokeColor);
            this._senkouSpanAPlotItem = this._addPlot(senkouSpanAPlot, (this.lines[3].theme  as LinePlotTheme).strokeColor);
            this._senkouSpanBPlotItem = this._addPlot(senkouSpanBPlot, (this.lines[4].theme  as LinePlotTheme).strokeColor);
            this._kumoPlotItem = this._addPlot(kumoPlot, "transparent");
        } else {
            // NK update plots theme
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

        let result = this.calculate();
        this._tenkanSenDataseries.add(this.getDataserieFromRecordSet(result.recordSet, "Ichimoku Tenkan Sen", result.startIndex).values);
        this._kijunSenDataseries.add(this.getDataserieFromRecordSet(result.recordSet, "Ichimoku Kijun Sen", result.startIndex).values);
        this._chikouSpanDataseries.add(this.shiftInToThePast(this.getDataserieFromRecordSet(result.recordSet, "Ichimoku Chikou Span", result.startIndex), this.baseLinePeriods).values);
        this._senkouSpanADataseries.add(this.shiftInToTheFuture(this.getDataserieFromRecordSet(result.recordSet, "Ichimoku Senkou Span A", result.startIndex), this.baseLinePeriods).values);
        this._senkouSpanBDataseries.add(this.shiftInToTheFuture(this.getDataserieFromRecordSet(result.recordSet, "Ichimoku Senkou Span B", result.startIndex), this.baseLinePeriods).values);

        this._updatePanelTitle();
        this.updateHoverRecord();
    }

    /**
     * Shows indicator properties dialog.
     */
    showSettingsDialog() {
        let showIchmokuSettingsRequest : ShowIndicatorSettingsDialogRequest = {type: ChannelRequestType.IchimokuCloudSettingsDialog,indicator:this};
        ChartAccessorService.instance.sendSharedChannelRequest(showIchmokuSettingsRequest);
    }

    _handlePanGesture(gesture: PanGesture) {
        // Do nothing so we can not move ichimuko indicator
    }

}
