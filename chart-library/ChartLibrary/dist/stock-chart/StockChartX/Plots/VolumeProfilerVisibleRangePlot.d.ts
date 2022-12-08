import { VolumeProfilerBasePlot } from './VolumeProfilerBasePlot';
import { IPoint } from '../../StockChartX/Graphics/ChartPoint';
export declare class VolumeProfilerVisibleRangePlot extends VolumeProfilerBasePlot {
    private rectangles;
    hitTest(point: IPoint): boolean;
    draw(): void;
    private getData;
    private maximumTotalVolume;
    private drawBars;
    private drawPointOfControlLine;
    private getChartWidthInPixels;
    private drawUpDownBars;
    private xPosForDownBars;
    private xPosForUpBars;
}
//# sourceMappingURL=VolumeProfilerVisibleRangePlot.d.ts.map