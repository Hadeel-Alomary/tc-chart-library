import {ITAIndicatorConfig, TAIndicator} from './TAIndicator';
import {ChartAccessorService, Interval, IntervalType} from '../../../services/index';
import {VolumeProfilerRequest} from '../../../services/volume-profiler/volume-profiler-request-builder';
import {VolumeProfilerData, VolumeProfilerSettings} from '../../../services/volume-profiler/volume-profiler.service';
import {IndicatorParam} from './IndicatorConst';
import {Subscription} from 'rxjs/internal/Subscription';
import {GestureArray} from '../Gestures/GestureArray';
import {Gesture, WindowEvent} from '../Gestures/Gesture';
import {StringUtils, Tc} from '../../../utils';
import {MouseHoverGesture} from '../Gestures/MouseHoverGesture';
import {ChartEvent} from '../Chart';
import {IValueChangedEvent} from '../../StockChartX/Utils/EventableObject';
import {DataSeries, DataSeriesSuffix} from '../../StockChartX/Data/DataSeries';
import {IPoint} from '../../StockChartX/Graphics/ChartPoint';
import {ContextMenuGesture} from '../../StockChartX/Gestures/ContextMenuGesture';
import {DoubleClickGesture} from '../../StockChartX/Gestures/DoubleClickGesture';

const isEqual = require('lodash/isEqual');

export abstract class VolumeProfilerBaseIndicator extends TAIndicator {

    private subscription: Subscription;
    private debouncerFutureTimestamp: number;
    private intervalHandler: number;
    private titleValueExists: boolean = true;

    protected volumeProfilerIndicatorData: VolumeProfilerIndicatorData;
    protected volumeProfilerRequest: VolumeProfilerRequest;

    constructor(config?: ITAIndicatorConfig) {
        super(config);
        this.volumeProfilerIndicatorData = {data: []};
        this.intervalHandler = window.setInterval(() => {
            this.doPendingRequests();
        }, 1000);

    }

    destroy() {
        super.destroy();
        clearInterval(this.intervalHandler);
        ChartAccessorService.instance.cleanVolumeProfilerData(this.id);
        this.subscription.unsubscribe();
    }

    private register(): void {

        this.subscription = ChartAccessorService.instance.getVolumeProfilerResultStream().subscribe(result => {
            if (result.requesterId == this.id) {
                this.volumeProfilerIndicatorData.data = result.data;
                this.chart.setNeedsUpdate();
            }
        });

        this._chart.on(ChartEvent.FIRST_VISIBLE_RECORD_CHANGED, (event: IValueChangedEvent) => {
            this.requestVolumeProfilerData();
        });

        this._chart.on(ChartEvent.LAST_VISIBLE_RECORD_CHANGED, (event: IValueChangedEvent) => {
            this.requestVolumeProfilerData();
        });

    }

    protected _preUpdateSetup() {
        if (!this.subscription) {
            this.register();
        }
    }

    protected requestVolumeProfilerData(): void {

        if (this.chart.recordCount == 0) {
            return;
        }

        if (this.chart.firstVisibleRecord === null || this.chart.lastVisibleRecord === null) {
            return;
        }

        let firstVisibleRecord = Math.floor(this.chart.firstVisibleRecord);
        let lastVisibleRecord = Math.min(Math.ceil(this.chart.lastVisibleRecord), this.chart.recordCount - 1);

        let dateSeries: DataSeries = this.chart.getDataSeries(DataSeriesSuffix.DATE);
        let firstDate = dateSeries.values[firstVisibleRecord];
        let lastDate = dateSeries.values[lastVisibleRecord];

        if (!firstDate || !lastDate) {
            return;
        }

        let symbol = this.chart.instrument.symbol;
        let interval = Interval.fromChartInterval(this.chart.timeInterval);
        let settings = this.getVolumeProfilerSettings();
        let from = moment(firstDate).format('YYYY-MM-DD HH:mm:ss');
        let to = moment(lastDate).format('YYYY-MM-DD HH:mm:ss');
        let request = this.buildSessionProfilerRequest(symbol, interval, settings, from, to);

        if (this.volumeProfilerRequest && isEqual(this.volumeProfilerRequest, request)) {
            return;
        }

        if (this.volumeProfilerRequest && this.isLastRequestEncapsulatingNewOne(request)) {
            return;
        }

        if (this.clearDataOnLoadingNewRequest()) {
            this.volumeProfilerIndicatorData.data = [];
        }

        this.volumeProfilerRequest = request;

        this.debouncerFutureTimestamp = Date.now() + this.getDebounceTimer();

    }

    private getVolumeProfilerSettings(): VolumeProfilerSettings {
        return {
            rowSize: this.parameters[IndicatorParam.VP_ROW_SIZE] as number,
            valueAreaVolumeRatio: this.parameters[IndicatorParam.VP_VALUE_AREA_VOLUME_RATIO] as number * 0.01,
            rowLayout: this.parameters[IndicatorParam.VP_ROW_LAYOUT] as number
        }
    }

    protected getVolumeProfilerResultData(): VolumeProfilerIndicatorData {
        return this.volumeProfilerIndicatorData;
    }

    protected _initGestures() {
        // if(Config.isElementBuild()) {
        //     this._gestures = new GestureArray([]); // no indicator gesture in viewer
        //     return;
        // }
        this._gestures = new GestureArray([
            new MouseHoverGesture({
                handler: this._handleMoveHoverGesture,
                hitTest: this.hitTest
            }),
            new DoubleClickGesture({
                handler: this._handleDoubleClick,
                hitTest: this.hitClickTest
            }),
            new ContextMenuGesture({
                handler: this._handleContextMenuGesture,
                hitTest: this.hitClickTest
            }),
        ], this);
    }

    protected hitClickTest(point: IPoint): boolean {

        if (!this.visible){
            return false;
        }

        if(!this.volumeProfilerIndicatorData.data.length) {
            return false;
        }

        if(!this._plotItems[0].plot) {
            return false;
        }

        return this._plotItems[0].plot.hitTest(point);

    }

    updateHoverRecord(record?: number) {
        // MA nothing is here, as title value is updated on mouse hover and not record hover (as we need x & y)
    }


    private doPendingRequests() {
        if (this.debouncerFutureTimestamp && this.debouncerFutureTimestamp < Date.now()) {
            if(!ChartAccessorService.instance.isVolumeProfilerRequested(this.volumeProfilerRequest)) {
                ChartAccessorService.instance.requestVolumeProfilerData(this.volumeProfilerRequest);
                this.debouncerFutureTimestamp = null;
            }
        }
    }

    public handleEvent(event: WindowEvent) {
        this._gestures.handleEvent(event);
        return false;
    }

    protected showTitleValue(inVolume: number, outVolume: number, totalVolume: number) {
        let textValue = this.formatTitleText(inVolume, outVolume, totalVolume);
        this._plotItems[0].titleValueSpan.text(textValue);
        this.titleValueExists = true;
    }

    protected isTitleShown():boolean {
        return this.titleValueExists;
    }

    protected showNoTitleValue() {
        let textValue = this.formatTitleText(null, null, null);
        this._plotItems[0].titleValueSpan.text(textValue);
        this.titleValueExists = false;
    }

    private formatTitleText(inVolume:number, outVolume:number, totalVolume:number):string {
        return 'inVolume: ' + this.formatTitleValue(inVolume) +
            ' , outVolume: ' + this.formatTitleValue(outVolume) +
            ' , netVolume: ' + this.formatTitleValue(totalVolume);
    }

    private formatTitleValue(value:number):string {
        return value || value === 0 ? StringUtils.formatWholeNumber(value) : 'n/a';
    }


    protected abstract clearDataOnLoadingNewRequest(): boolean;

    protected abstract getDebounceTimer(): number;

    protected abstract buildSessionProfilerRequest(symbol: string, interval: Interval, settings: VolumeProfilerSettings, from: string, to: string): VolumeProfilerRequest;

    protected abstract _handleMoveHoverGesture(gesture: Gesture, event: WindowEvent): void;

    protected abstract isLastRequestEncapsulatingNewOne(request: VolumeProfilerRequest): boolean;


}

export interface VolumeProfilerIndicatorData {
    data:VolumeProfilerData[];
}
