import { TAIndicator } from "./TAIndicator";
import { IchimokuIndicator } from "./IchimokuIndicator";
import { IchimokuKinkoHyo, VolumeProfilerSessionVolume, VolumeProfilerVisibleRange } from '../../TASdk/TASdk';
import { LiquidityIndicator } from './LiquidityIndicator';
import { IndicatorHelper } from './IndicatorHelper';
import { VolumeProfilerSessionVolumeIndicator } from './VolumeProfilerSessionVolumeIndicator';
import { VolumeProfilerVisibleRangeIndicator } from './VolumeProfilerVisibleRangeIndicator';
var IndicatorDeserializer = (function () {
    function IndicatorDeserializer() {
    }
    Object.defineProperty(IndicatorDeserializer, "instance", {
        get: function () {
            if (IndicatorDeserializer._instance == null) {
                IndicatorDeserializer._instance = new IndicatorDeserializer();
            }
            return IndicatorDeserializer._instance;
        },
        enumerable: false,
        configurable: true
    });
    IndicatorDeserializer.prototype.deserialize = function (state) {
        if (state.taIndicator == IchimokuKinkoHyo)
            return new IchimokuIndicator(state);
        if (IndicatorHelper.isLiquidityIndicator(state.taIndicator))
            return new LiquidityIndicator(state);
        if (state.taIndicator == VolumeProfilerSessionVolume)
            return new VolumeProfilerSessionVolumeIndicator(state);
        if (state.taIndicator == VolumeProfilerVisibleRange)
            return new VolumeProfilerVisibleRangeIndicator(state);
        return new TAIndicator(state);
    };
    IndicatorDeserializer._instance = null;
    return IndicatorDeserializer;
}());
export { IndicatorDeserializer };
//# sourceMappingURL=IndicatorDeserializer.js.map