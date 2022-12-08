import { Chart } from "../Chart";
export declare abstract class ChartEventsExtender {
    private _suppressEvents;
    private _chart;
    constructor(chart: Chart);
    get chart(): Chart;
    suppressEvents(suppress?: boolean): boolean;
    fire(event: string, newValue?: unknown, oldValue?: unknown): void;
}
//# sourceMappingURL=ChartEventsExtender.d.ts.map