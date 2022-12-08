import { ITAIndicatorConfig, TAIndicator } from './TAIndicator';
import { Interval } from '../../../services/index';
import { VolumeProfilerRequest } from '../../../services/data/volume-profiler/volume-profiler-request-builder';
import { VolumeProfilerData, VolumeProfilerSettings } from '../../../services/data/volume-profiler/volume-profiler.service';
import { Gesture, WindowEvent } from '../Gestures/Gesture';
import { IPoint } from '../../StockChartX/Graphics/ChartPoint';
export declare abstract class VolumeProfilerBaseIndicator extends TAIndicator {
    private subscription;
    private debouncerFutureTimestamp;
    private intervalHandler;
    private titleValueExists;
    protected volumeProfilerIndicatorData: VolumeProfilerIndicatorData;
    protected volumeProfilerRequest: VolumeProfilerRequest;
    constructor(config?: ITAIndicatorConfig);
    destroy(): void;
    private register;
    protected _preUpdateSetup(): void;
    protected requestVolumeProfilerData(): void;
    private getVolumeProfilerSettings;
    protected getVolumeProfilerResultData(): VolumeProfilerIndicatorData;
    protected _initGestures(): void;
    protected hitClickTest(point: IPoint): boolean;
    updateHoverRecord(record?: number): void;
    private doPendingRequests;
    handleEvent(event: WindowEvent): boolean;
    protected showTitleValue(inVolume: number, outVolume: number, totalVolume: number): void;
    protected isTitleShown(): boolean;
    protected showNoTitleValue(): void;
    private formatTitleText;
    private formatTitleValue;
    protected abstract clearDataOnLoadingNewRequest(): boolean;
    protected abstract getDebounceTimer(): number;
    protected abstract buildSessionProfilerRequest(symbol: string, interval: Interval, settings: VolumeProfilerSettings, from: string, to: string): VolumeProfilerRequest;
    protected abstract _handleMoveHoverGesture(gesture: Gesture, event: WindowEvent): void;
    protected abstract isLastRequestEncapsulatingNewOne(request: VolumeProfilerRequest): boolean;
}
export interface VolumeProfilerIndicatorData {
    data: VolumeProfilerData[];
}
//# sourceMappingURL=VolumeProfilerBaseIndicator.d.ts.map