import { __extends } from "tslib";
import { Plot } from './Plot';
var VolumeProfilerBasePlot = (function (_super) {
    __extends(VolumeProfilerBasePlot, _super);
    function VolumeProfilerBasePlot(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this._options.showValueMarkers = false;
        _this.volumeProfilerIndicatorData = config.resultData;
        return _this;
    }
    VolumeProfilerBasePlot.prototype.drawSelectionPoints = function () {
    };
    VolumeProfilerBasePlot.prototype.shouldAffectAutoScalingMaxAndMinLimits = function () {
        return false;
    };
    return VolumeProfilerBasePlot;
}(Plot));
export { VolumeProfilerBasePlot };
//# sourceMappingURL=VolumeProfilerBasePlot.js.map