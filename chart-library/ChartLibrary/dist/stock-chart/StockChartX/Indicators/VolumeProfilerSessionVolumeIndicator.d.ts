import { VolumeProfilerBaseIndicator } from './VolumeProfilerBaseIndicator';
import { Interval } from '../../../services/loader';
import { VolumeProfilerSettings } from '../../../services/data/volume-profiler/volume-profiler.service';
import { VolumeProfilerRequest } from '../../../services/data/volume-profiler/volume-profiler-request-builder';
import { ITAIndicatorConfig } from './TAIndicator';
import { Gesture, WindowEvent } from '../../StockChartX/Gestures/Gesture';
import { IPoint } from '../../StockChartX/Graphics/ChartPoint';
import { DataSeries } from '../../StockChartX/Data/DataSeries';
import { Plot } from '../../StockChartX/Plots/Plot';
import { Field } from '../../TASdk/Field';
import { Recordset } from '../../TASdk/Recordset';
import { PlotTheme } from '../Theme';
export declare class VolumeProfilerSessionVolumeIndicator extends VolumeProfilerBaseIndicator {
    constructor(config?: ITAIndicatorConfig);
    protected buildSessionProfilerRequest(symbol: string, interval: Interval, settings: VolumeProfilerSettings, from: string, to: string): VolumeProfilerRequest;
    protected isLastRequestEncapsulatingNewOne(request: VolumeProfilerRequest): boolean;
    protected hitTest(point: IPoint): boolean;
    protected _handleMoveHoverGesture(gesture: Gesture, event: WindowEvent): void;
    protected getVolumeProfilerPlot(index: number, dataSeries: DataSeries, theme: PlotTheme): Plot;
    protected calculateCustomRecordset(pSource: Field): Recordset;
    protected clearDataOnLoadingNewRequest(): boolean;
    protected getDebounceTimer(): number;
}
//# sourceMappingURL=VolumeProfilerSessionVolumeIndicator.d.ts.map