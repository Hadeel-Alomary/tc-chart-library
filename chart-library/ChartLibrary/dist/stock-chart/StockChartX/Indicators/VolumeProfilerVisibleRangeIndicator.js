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
import { VolumeProfilerBaseIndicator } from './VolumeProfilerBaseIndicator';
import { ChartAccessorService } from '../../../services/chart';
import { VolumeProfilerVisibleRangePlot } from '../Plots/VolumeProfilerVisibleRangePlot';
import { Field } from '../../TASdk/Field';
import { Recordset } from '../../TASdk/Recordset';
import { IndicatorField } from './IndicatorConst';
var VolumeProfilerVisibleRangeIndicator = (function (_super) {
    __extends(VolumeProfilerVisibleRangeIndicator, _super);
    function VolumeProfilerVisibleRangeIndicator(config) {
        return _super.call(this, config) || this;
    }
    VolumeProfilerVisibleRangeIndicator.prototype.buildSessionProfilerRequest = function (symbol, interval, settings, from, to) {
        return ChartAccessorService.instance.getVolumeProfilerRequestBuilder()
            .prepareHistoricalVolumeProfilerRequest(this.id, symbol, interval, settings, from, to);
    };
    VolumeProfilerVisibleRangeIndicator.prototype.isLastRequestEncapsulatingNewOne = function (request) {
        return false;
    };
    VolumeProfilerVisibleRangeIndicator.prototype.getDebounceTimer = function () {
        return 250;
    };
    VolumeProfilerVisibleRangeIndicator.prototype.clearDataOnLoadingNewRequest = function () {
        return false;
    };
    VolumeProfilerVisibleRangeIndicator.prototype._handleMoveHoverGesture = function (gesture, event) {
        var value = this._panel.projection.valueByY(event.pointerPosition.y);
        var bar = this.volumeProfilerIndicatorData.data[0].bars.find(function (bar) { return bar.fromPrice <= value && value <= bar.toPrice; });
        if (!bar) {
            this.showNoTitleValue();
            return;
        }
        this.showTitleValue(bar.greenVolume, bar.redVolume, bar.totalVolume);
    };
    VolumeProfilerVisibleRangeIndicator.prototype.hitTest = function (point) {
        if (!this.visible) {
            return false;
        }
        return 0 < this.volumeProfilerIndicatorData.data.length;
    };
    VolumeProfilerVisibleRangeIndicator.prototype.getVolumeProfilerPlot = function (index, dataSeries, theme) {
        return new VolumeProfilerVisibleRangePlot(this.chart, {
            dataSeries: dataSeries,
            theme: theme,
            resultData: this.getVolumeProfilerResultData(),
        });
    };
    VolumeProfilerVisibleRangeIndicator.prototype.calculateCustomRecordset = function (pSource) {
        this.requestVolumeProfilerData();
        var sAlias = IndicatorField.INDICATOR;
        var Field1;
        var Results = new Recordset();
        var iRecordCount = pSource.recordCount;
        Field1 = new Field();
        Field1.initialize(iRecordCount, sAlias);
        for (var iRecord = 1; iRecord < iRecordCount + 1; iRecord++) {
            Field1.setValue(iRecord, iRecord);
        }
        Results.addField(Field1);
        return Results;
    };
    return VolumeProfilerVisibleRangeIndicator;
}(VolumeProfilerBaseIndicator));
export { VolumeProfilerVisibleRangeIndicator };
//# sourceMappingURL=VolumeProfilerVisibleRangeIndicator.js.map