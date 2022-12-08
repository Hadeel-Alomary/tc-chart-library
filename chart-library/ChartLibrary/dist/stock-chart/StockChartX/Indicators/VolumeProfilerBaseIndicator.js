import { __extends } from "tslib";
import { TAIndicator } from './TAIndicator';
import { ChartAccessorService, Interval } from '../../../services/index';
import { IndicatorParam } from './IndicatorConst';
import { GestureArray } from '../Gestures/GestureArray';
import { StringUtils } from '../../../utils';
import { MouseHoverGesture } from '../Gestures/MouseHoverGesture';
import { ChartEvent } from '../Chart';
import { DataSeriesSuffix } from '../../StockChartX/Data/DataSeries';
import { ContextMenuGesture } from '../../StockChartX/Gestures/ContextMenuGesture';
import { DoubleClickGesture } from '../../StockChartX/Gestures/DoubleClickGesture';
import { Config } from '../../../config/config';
var isEqual = require('lodash/isEqual');
var VolumeProfilerBaseIndicator = (function (_super) {
    __extends(VolumeProfilerBaseIndicator, _super);
    function VolumeProfilerBaseIndicator(config) {
        var _this = _super.call(this, config) || this;
        _this.titleValueExists = true;
        _this.volumeProfilerIndicatorData = { data: [] };
        _this.intervalHandler = window.setInterval(function () {
            _this.doPendingRequests();
        }, 1000);
        return _this;
    }
    VolumeProfilerBaseIndicator.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        clearInterval(this.intervalHandler);
        ChartAccessorService.instance.cleanVolumeProfilerData(this.id);
        this.subscription.unsubscribe();
    };
    VolumeProfilerBaseIndicator.prototype.register = function () {
        var _this = this;
        this.subscription = ChartAccessorService.instance.getVolumeProfilerResultStream().subscribe(function (result) {
            if (result.requesterId == _this.id) {
                _this.volumeProfilerIndicatorData.data = result.data;
                _this.chart.setNeedsUpdate();
            }
        });
        this._chart.on(ChartEvent.FIRST_VISIBLE_RECORD_CHANGED, function (event) {
            _this.requestVolumeProfilerData();
        });
        this._chart.on(ChartEvent.LAST_VISIBLE_RECORD_CHANGED, function (event) {
            _this.requestVolumeProfilerData();
        });
    };
    VolumeProfilerBaseIndicator.prototype._preUpdateSetup = function () {
        if (!this.subscription) {
            this.register();
        }
    };
    VolumeProfilerBaseIndicator.prototype.requestVolumeProfilerData = function () {
        if (this.chart.recordCount == 0) {
            return;
        }
        if (this.chart.firstVisibleRecord === null || this.chart.lastVisibleRecord === null) {
            return;
        }
        var firstVisibleRecord = Math.floor(this.chart.firstVisibleRecord);
        var lastVisibleRecord = Math.min(Math.ceil(this.chart.lastVisibleRecord), this.chart.recordCount - 1);
        var dateSeries = this.chart.getDataSeries(DataSeriesSuffix.DATE);
        var firstDate = dateSeries.values[firstVisibleRecord];
        var lastDate = dateSeries.values[lastVisibleRecord];
        if (!firstDate || !lastDate) {
            return;
        }
        var symbol = this.chart.instrument.symbol;
        var interval = Interval.fromChartInterval(this.chart.timeInterval);
        var settings = this.getVolumeProfilerSettings();
        var from = moment(firstDate).format('YYYY-MM-DD HH:mm:ss');
        var to = moment(lastDate).format('YYYY-MM-DD HH:mm:ss');
        var request = this.buildSessionProfilerRequest(symbol, interval, settings, from, to);
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
    };
    VolumeProfilerBaseIndicator.prototype.getVolumeProfilerSettings = function () {
        return {
            rowSize: this.parameters[IndicatorParam.VP_ROW_SIZE],
            valueAreaVolumeRatio: this.parameters[IndicatorParam.VP_VALUE_AREA_VOLUME_RATIO] * 0.01,
            rowLayout: this.parameters[IndicatorParam.VP_ROW_LAYOUT]
        };
    };
    VolumeProfilerBaseIndicator.prototype.getVolumeProfilerResultData = function () {
        return this.volumeProfilerIndicatorData;
    };
    VolumeProfilerBaseIndicator.prototype._initGestures = function () {
        if (Config.isElementBuild()) {
            this._gestures = new GestureArray([]);
            return;
        }
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
    };
    VolumeProfilerBaseIndicator.prototype.hitClickTest = function (point) {
        if (!this.visible) {
            return false;
        }
        if (!this.volumeProfilerIndicatorData.data.length) {
            return false;
        }
        if (!this._plotItems[0].plot) {
            return false;
        }
        return this._plotItems[0].plot.hitTest(point);
    };
    VolumeProfilerBaseIndicator.prototype.updateHoverRecord = function (record) {
    };
    VolumeProfilerBaseIndicator.prototype.doPendingRequests = function () {
        if (this.debouncerFutureTimestamp && this.debouncerFutureTimestamp < Date.now()) {
            if (!ChartAccessorService.instance.isVolumeProfilerRequested(this.volumeProfilerRequest)) {
                ChartAccessorService.instance.requestVolumeProfilerData(this.volumeProfilerRequest);
                this.debouncerFutureTimestamp = null;
            }
        }
    };
    VolumeProfilerBaseIndicator.prototype.handleEvent = function (event) {
        this._gestures.handleEvent(event);
        return false;
    };
    VolumeProfilerBaseIndicator.prototype.showTitleValue = function (inVolume, outVolume, totalVolume) {
        var textValue = this.formatTitleText(inVolume, outVolume, totalVolume);
        this._plotItems[0].titleValueSpan.text(textValue);
        this.titleValueExists = true;
    };
    VolumeProfilerBaseIndicator.prototype.isTitleShown = function () {
        return this.titleValueExists;
    };
    VolumeProfilerBaseIndicator.prototype.showNoTitleValue = function () {
        var textValue = this.formatTitleText(null, null, null);
        this._plotItems[0].titleValueSpan.text(textValue);
        this.titleValueExists = false;
    };
    VolumeProfilerBaseIndicator.prototype.formatTitleText = function (inVolume, outVolume, totalVolume) {
        return 'inVolume: ' + this.formatTitleValue(inVolume) +
            ' , outVolume: ' + this.formatTitleValue(outVolume) +
            ' , netVolume: ' + this.formatTitleValue(totalVolume);
    };
    VolumeProfilerBaseIndicator.prototype.formatTitleValue = function (value) {
        return value || value === 0 ? StringUtils.formatWholeNumber(value) : 'n/a';
    };
    return VolumeProfilerBaseIndicator;
}(TAIndicator));
export { VolumeProfilerBaseIndicator };
//# sourceMappingURL=VolumeProfilerBaseIndicator.js.map