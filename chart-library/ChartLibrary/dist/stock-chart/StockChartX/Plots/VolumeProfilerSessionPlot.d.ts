import { IPoint } from '../Graphics/ChartPoint';
import { IVolumeProfilerSessionPlotConfig, VolumeProfilerBasePlot } from './VolumeProfilerBasePlot';
import { Chart } from '../Chart';
export declare class VolumeProfilerSessionPlot extends VolumeProfilerBasePlot {
    private boxes;
    constructor(chart: Chart, config?: IVolumeProfilerSessionPlotConfig);
    isHoveredOverSessionBox(point: IPoint): boolean;
    hitTest(point: IPoint): boolean;
    draw(): void;
    private drawBoxes;
    private computeBoxes;
    private drawBox;
    private drawPointOfControlLine;
    private drawValueDownBars;
    private drawVolumeDownBars;
    private drawValueUpBars;
    private drawVolumeUpBars;
    private xPosForDownBar;
    private xPosForUpBar;
    private maximumTotalVolume;
    private addDataToBoxes;
}
//# sourceMappingURL=VolumeProfilerSessionPlot.d.ts.map