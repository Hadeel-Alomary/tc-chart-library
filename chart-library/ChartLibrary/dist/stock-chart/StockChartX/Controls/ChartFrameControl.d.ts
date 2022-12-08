import { Chart } from "../Chart";
import { FrameControl, IFrameControl } from "./FrameControl";
export interface IChartFrameControlConfig {
    chart: Chart;
}
export interface IChartFrameControl extends IFrameControl {
    chart: Chart;
}
export declare class ChartFrameControl extends FrameControl implements IChartFrameControl {
    _chart: Chart;
    get chart(): Chart;
    constructor(config: IChartFrameControlConfig);
    protected _subscribeEvents(): void;
    protected _unsubscribeEvents(): void;
    destroy(): void;
}
//# sourceMappingURL=ChartFrameControl.d.ts.map