import { IPlotConfig, Plot } from './Plot';
import { VolumeProfilerIndicatorData } from '../Indicators/VolumeProfilerBaseIndicator';
import { Chart } from '../Chart';
export interface IVolumeProfilerSessionPlotConfig extends IPlotConfig {
    resultData: VolumeProfilerIndicatorData;
}
export declare abstract class VolumeProfilerBasePlot extends Plot {
    protected volumeProfilerIndicatorData: VolumeProfilerIndicatorData;
    constructor(chart: Chart, config?: IVolumeProfilerSessionPlotConfig);
    drawSelectionPoints(): void;
    shouldAffectAutoScalingMaxAndMinLimits(): boolean;
}
//# sourceMappingURL=VolumeProfilerBasePlot.d.ts.map