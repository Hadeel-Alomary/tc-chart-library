import {ITAIndicatorConfig, TAIndicator} from './TAIndicator';
import {
    AccumulatedLiquidityByNetValue,
    AccumulatedLiquidityByNetVolume,
    LiquidityByNetValue,
    LiquidityByNetVolume,
    LiquidityByValue,
    LiquidityByVolume
} from '../../TASdk/TASdk';
import {Recordset} from '../../TASdk/Recordset';
import {PanGesture} from '../Gestures/PanGesture';
import {IndicatorField, IndicatorPlotTypes} from './IndicatorConst';
import {Field} from '../../TASdk/Field';
import {ChartAccessorService} from '../../../services/chart';
import {Interval, IntervalType} from '../../../services/loader';
import {Subscription} from 'rxjs/internal/Subscription';
import {LiquidityPoint} from '../../../services/liquidity';
import {LiquidityHistoryLoadingState} from '../../../services/liquidity/liquidity.service';
import {DataSeries, DataSeriesSuffix} from '../../StockChartX/Data/DataSeries';
import {IntlNumberFormat} from '../..';

export interface LiquidityIndicatorConfig extends ITAIndicatorConfig {
}

export class LiquidityIndicator extends TAIndicator {
    private _activeSymbol: string;
    private _activeInterval: Interval;
    private _subscription: Subscription;
    private _cachedRecordSet: Recordset;
    private _recalculateRecordSet:boolean = true;

    constructor(config?: LiquidityIndicatorConfig) {
        super(config);
        this._subscription = ChartAccessorService.instance.getSymbolLiquidityUpdateStream().subscribe(
            (liquidityUpdateTopic) => {
                let isSameSymbol = liquidityUpdateTopic.symbol == this._activeSymbol;
                let isSameInterval = liquidityUpdateTopic.interval.type == IntervalType.Custom ? (liquidityUpdateTopic.interval.base == this._activeInterval.base && liquidityUpdateTopic.interval.repeat == this._activeInterval.repeat) : liquidityUpdateTopic.interval.type == this._activeInterval.type;
                if(isSameSymbol && isSameInterval) {
                    this._redrawChartOnLiquidityChange();
                }
            }
        );
    }

    _initIndicator(config: LiquidityIndicatorConfig) {
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
    }

    calculate() {
        return {
            parameters: this.getParametersString(),
            recordSet: this._getRecordSet(),
            startIndex: 0
        }
    }

    getParametersString() {
        return "";
    }

    destroy() {
        if(this._subscription) {
            this._subscription.unsubscribe();
        }
        super.destroy();
    }

    _getIndicatorPlotType(fieldName: string) {
        switch (fieldName) {
            case IndicatorField.INDICATOR_HISTOGRAM:
            case IndicatorField.LIQUIDITY_NET_VALUE:
            case IndicatorField.LIQUIDITY_NET_VOLUME:
                return IndicatorPlotTypes.HISTOGRAM_PLOT;
            default:
                return IndicatorPlotTypes.LINE_PLOT;
        }
    }

    _handlePanGesture(gesture: PanGesture) {}

    _initPanel() {
        this._panel.valueScale.formatter.setDecimalDigits(0);
    }

    _preUpdateSetup() {

        // MA whenever an update setup is called, then request to recalculate recordset (as period may have changed)
        this._recalculateRecordSet = true;

        // MA if interval or symbol changes, then request to load liquidity history if needed
        let chartInterval = Interval.fromChartInterval(this.chart.timeInterval);
        let isSameSymbol = this.chart.instrument.symbol == this._activeSymbol;
        let isSameInterval = this._activeInterval? chartInterval.type == IntervalType.Custom ? (chartInterval.base == this._activeInterval.base && chartInterval.repeat == this._activeInterval.repeat) : chartInterval.type == this._activeInterval.type : false;
        if(!isSameSymbol || !isSameInterval) {
            this._activeSymbol = this.chart.instrument.symbol;
            this._activeInterval = chartInterval;
            switch(ChartAccessorService.instance.getSymbolLiquidityHistoryLoadState(this._activeSymbol, this._activeInterval)){
                case LiquidityHistoryLoadingState.NOT_LOADED:
                    // MA history is not loaded, so request to load it
                    // ChartAccessorService.instance.requestToLoadSymbolLiquidityHistory(this._activeSymbol, this._activeInterval);
                    break;
                case LiquidityHistoryLoadingState.REQUESTED:
                    // MA do nothing, as we are waiting for history to finish loading and be notified by LiquidityUpdateStream
                    break;
                case LiquidityHistoryLoadingState.LOADED:
                    // MA history is fully loaded, so request to draw indicator to reflect that
                    this._redrawChartOnLiquidityChange();
                    break;
            }
        }

    }

    private _getNetValues(liquidityPoints:LiquidityPoint[]): number[] {
        let results: number[] = [];
        for(let point of liquidityPoints) {
            results.push(point.netAmount);
        }
        return results;
    }

    private _getNetVolumeValues(liquidityPoints:LiquidityPoint[]): number[] {
        let results: number[] = [];
        for(let point of liquidityPoints) {
            results.push(point.netVolume);
        }
        return results;
    }

    private _getAccumulatedNetValues(liquidityPoints:LiquidityPoint[]): number[] {
        let results: number[] = [];
        for(let point of liquidityPoints) {
            let amount = point.netAmount;
            if(results.length > 0) {
                amount += results[results.length - 1];
            }
            results.push(amount);
        }
        return results;
    }

    private _getAccumulatedNetVolumeValues(liquidityPoints:LiquidityPoint[]): number[] {
        let results: number[] = [];
        for(let point of liquidityPoints) {
            let amount = point.netVolume;
            if(results.length > 0) {
                amount += results[results.length - 1];
            }
            results.push(amount);
        }
        return results;
    }

    private _getInflowValues(liquidityPoints:LiquidityPoint[]): number[] {
        let results: number[] = [];
        for(let point of liquidityPoints) {
            results.push(point.inflowAmount);
        }
        return results;
    }

    private _getOutflowValues(liquidityPoints:LiquidityPoint[]): number[] {
        let results: number[] = [];
        for(let point of liquidityPoints) {
            results.push(point.outflowAmount);
        }
        return results;
    }

    private _getInflowVolumeValues(liquidityPoints:LiquidityPoint[]): number[] {
        let results: number[] = [];
        for(let point of liquidityPoints) {
            results.push(point.inflowVolume);
        }
        return results;
    }

    private _getOutflowVolumeValues(liquidityPoints:LiquidityPoint[]): number[] {
        let results: number[] = [];
        for(let point of liquidityPoints) {
            results.push(point.outflowVolume);
        }
        return results;
    }

    private _getFieldValues(fieldName: string, liquidityPoints:LiquidityPoint[]): number[] {
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
                if(fieldName == IndicatorField.LIQUIDITY_INFLOW_VALUE) return this._getInflowValues(liquidityPoints);
                else if(fieldName == IndicatorField.LIQUIDITY_OUTFLOW_VALUE) return this._getOutflowValues(liquidityPoints);
                else return this._getNetValues(liquidityPoints);
            case LiquidityByVolume:
                if(fieldName == IndicatorField.LIQUIDITY_INFLOW_VOLUME) return this._getInflowVolumeValues(liquidityPoints);
                else if(fieldName == IndicatorField.LIQUIDITY_OUTFLOW_VOLUME) return this._getOutflowVolumeValues(liquidityPoints);
                else return this._getNetVolumeValues(liquidityPoints);
            default:
                return [];
        }
    }

    private _getRecordSet(): Recordset {
        if(this.getDateDataSeries().values.length == 0) { // no data, just return an empty recordset
            return new Recordset();
        }
        if(!this._recalculateRecordSet) { // no request to recalculat, so return last cached recordset
            return this._cachedRecordSet;
        }
        let allLiquidityPoints = ChartAccessorService.instance.getSymbolLiquidityPoints(this._activeSymbol, this._activeInterval);
        let fromDate = moment(this.getDateDataSeries().firstValue).format('YYYY-MM-DD HH:mm:ss');
        // filter liquidity points to include only the points viewed on the chart (based on period setting) to match TickerChart desktop in accumulative values.
        let chartPeriodLiquidityPoints = allLiquidityPoints.filter(point => fromDate <= point.time);
        // recompute recordset
        this._cachedRecordSet = this._calculateRecordSet(chartPeriodLiquidityPoints);
        this._recalculateRecordSet = false;
        return this._cachedRecordSet;
    }

    private _calculateRecordSet(liquidityPoints:LiquidityPoint[]): Recordset {

        let candlesCount = this.getDateDataSeries().values.length;

        let recordset = new Recordset();

        for(let i = 0, n = this._fieldNames.length; i < n; i++) {
            let fieldName = this._fieldNames[i],
                liquidityField = new Field(),
                valuesCount = liquidityPoints.length;

            // MA candlesCount + 1 is *BY* intention because the candles count on the screen is less
            // by one from the count of the data series (candlesCount) for mysterious reasons ...
            liquidityField.initialize(candlesCount + 1, fieldName);

            let values = this._getFieldValues(fieldName, liquidityPoints);

            for (let j = candlesCount; j >= 0; j--) {
                let value = values[--valuesCount];
                value = isNaN(value) ? null : value;
                liquidityField.setValue(j, value);
            }
            recordset.addField(liquidityField);
        }

        return recordset;

    }

    private getDateDataSeries():DataSeries{
        return this._chart.primaryDataSeries(DataSeriesSuffix.DATE);
    }

    private _redrawChartOnLiquidityChange() {
        this._recalculateRecordSet = true; // recalculate recordSet to reflect changes
        this.update();
        this._chart.setNeedsUpdate(true);
    }

}
