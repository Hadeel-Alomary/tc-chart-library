import { __extends } from "tslib";
import { VolumeProfilerBaseIndicator } from './VolumeProfilerBaseIndicator';
import { ChartAccessorService } from '../../../services/chart';
import { VolumeProfilerSessionPlot } from '../Plots/VolumeProfilerSessionPlot';
import { Field } from '../../TASdk/Field';
import { Recordset } from '../../TASdk/Recordset';
import { IndicatorField } from './IndicatorConst';
var isEqual = require('lodash/isEqual');
var cloneDeep = require('lodash/cloneDeep');
var VolumeProfilerSessionVolumeIndicator = (function (_super) {
    __extends(VolumeProfilerSessionVolumeIndicator, _super);
    function VolumeProfilerSessionVolumeIndicator(config) {
        return _super.call(this, config) || this;
    }
    VolumeProfilerSessionVolumeIndicator.prototype.buildSessionProfilerRequest = function (symbol, interval, settings, from, to) {
        return ChartAccessorService.instance.getVolumeProfilerRequestBuilder()
            .prepareSessionBasedVolumeProfilerRequest(this.id, symbol, interval, settings, from, to);
    };
    VolumeProfilerSessionVolumeIndicator.prototype.isLastRequestEncapsulatingNewOne = function (request) {
        var lastRequestClone = cloneDeep(this.volumeProfilerRequest);
        lastRequestClone.durationInDays = request.durationInDays;
        if (lastRequestClone.from < request.from) {
            lastRequestClone.from = request.from;
        }
        if (request.to.substr(0, 'YYYY-MM-DD HH:mm'.length) <= lastRequestClone.to.substr(0, 'YYYY-MM-DD HH:mm'.length)) {
            lastRequestClone.to = request.to;
        }
        return isEqual(lastRequestClone, request);
    };
    VolumeProfilerSessionVolumeIndicator.prototype.hitTest = function (point) {
        if (!this.visible) {
            return false;
        }
        var result = false;
        if (this.volumeProfilerIndicatorData.data.length) {
            var sessionPlot = this._plotItems[0].plot;
            result = sessionPlot.isHoveredOverSessionBox(point);
        }
        if (!result && this.isTitleShown()) {
            this.showNoTitleValue();
        }
        return result;
    };
    VolumeProfilerSessionVolumeIndicator.prototype._handleMoveHoverGesture = function (gesture, event) {
        var value = this._panel.projection.valueByY(event.pointerPosition.y);
        var date = moment(this._panel.projection.dateByX(event.pointerPosition.x)).format('YYYY-MM-DD HH:mm:ss');
        var volumeProfilerData = this.volumeProfilerIndicatorData.data.find(function (result) { return result.fromDate <= date && date <= result.toDate; });
        if (!volumeProfilerData) {
            this.showNoTitleValue();
            return;
        }
        var bar = volumeProfilerData.bars.find(function (bar) { return bar.fromPrice <= value && value <= bar.toPrice; });
        if (!bar) {
            this.showNoTitleValue();
            return;
        }
        this.showTitleValue(bar.greenVolume, bar.redVolume, bar.totalVolume);
    };
    VolumeProfilerSessionVolumeIndicator.prototype.getVolumeProfilerPlot = function (index, dataSeries, theme) {
        return new VolumeProfilerSessionPlot(this.chart, {
            dataSeries: dataSeries,
            theme: theme,
            resultData: this.getVolumeProfilerResultData(),
        });
    };
    VolumeProfilerSessionVolumeIndicator.prototype.calculateCustomRecordset = function (pSource) {
        this.requestVolumeProfilerData();
        var sAlias = IndicatorField.INDICATOR;
        var Field1;
        var Results = new Recordset();
        var iRecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(iRecordCount, sAlias);
        var startBoxDate = null;
        var startBoxRecordIndex = null;
        for (var iRecord = 1; iRecord < iRecordCount + 1; iRecord++) {
            var recordDate = pSource.value(iRecord);
            if ((startBoxDate == null) || (startBoxDate.getDay() != recordDate.getDay())) {
                startBoxDate = recordDate;
                startBoxRecordIndex = iRecord;
            }
            Field1.setValue(iRecord, startBoxRecordIndex - 1);
        }
        Results.addField(Field1);
        return Results;
    };
    VolumeProfilerSessionVolumeIndicator.prototype.clearDataOnLoadingNewRequest = function () {
        return true;
    };
    VolumeProfilerSessionVolumeIndicator.prototype.getDebounceTimer = function () {
        return 500;
    };
    return VolumeProfilerSessionVolumeIndicator;
}(VolumeProfilerBaseIndicator));
export { VolumeProfilerSessionVolumeIndicator };
//# sourceMappingURL=VolumeProfilerSessionVolumeIndicator.js.map