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