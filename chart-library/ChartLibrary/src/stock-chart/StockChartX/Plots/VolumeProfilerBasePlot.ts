import {IPlotConfig, Plot} from './Plot';
import {VolumeProfilerIndicatorData} from '../Indicators/VolumeProfilerBaseIndicator';
import {Chart} from '../Chart';

export interface IVolumeProfilerSessionPlotConfig extends IPlotConfig {
    resultData:VolumeProfilerIndicatorData
}

export abstract class VolumeProfilerBasePlot extends Plot {

    protected volumeProfilerIndicatorData:VolumeProfilerIndicatorData;

    constructor(chart:Chart, config?: IVolumeProfilerSessionPlotConfig) {
        super(chart, config);
        this._options.showValueMarkers = false;
        this.volumeProfilerIndicatorData = config.resultData;
    }

    drawSelectionPoints(): void {
        // do nothing
    }

    shouldAffectAutoScalingMaxAndMinLimits() {
        return false;
    }
    
}

