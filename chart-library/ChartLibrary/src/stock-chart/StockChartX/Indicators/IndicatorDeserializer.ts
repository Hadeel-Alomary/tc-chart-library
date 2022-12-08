import {Indicator} from "./Indicator";
import {ITAIndicatorConfig, TAIndicator} from "./TAIndicator";
import {IchimokuIndicator} from "./IchimokuIndicator";
import {IchimokuKinkoHyo, VolumeProfilerSessionVolume, VolumeProfilerVisibleRange} from '../../TASdk/TASdk';
import {LiquidityIndicator} from './LiquidityIndicator';
import {IndicatorHelper} from './IndicatorHelper';
import {VolumeProfilerSessionVolumeIndicator} from './VolumeProfilerSessionVolumeIndicator';
import {VolumeProfilerVisibleRangeIndicator} from './VolumeProfilerVisibleRangeIndicator';

export class IndicatorDeserializer{

    private static _instance:IndicatorDeserializer = null;
    public static get instance():IndicatorDeserializer{
        if(IndicatorDeserializer._instance == null){
            IndicatorDeserializer._instance = new IndicatorDeserializer();
        }

        return IndicatorDeserializer._instance;
    }
    private constructor(){}

    public deserialize(state: ITAIndicatorConfig): Indicator {
        if (state.taIndicator == IchimokuKinkoHyo)
            return new IchimokuIndicator(state);
        if (IndicatorHelper.isLiquidityIndicator(state.taIndicator))
            return new LiquidityIndicator(state);
        if (state.taIndicator == VolumeProfilerSessionVolume)
            return new VolumeProfilerSessionVolumeIndicator(state);
        if (state.taIndicator == VolumeProfilerVisibleRange)
            return new VolumeProfilerVisibleRangeIndicator(state);

        return new TAIndicator(state);
    }
}
