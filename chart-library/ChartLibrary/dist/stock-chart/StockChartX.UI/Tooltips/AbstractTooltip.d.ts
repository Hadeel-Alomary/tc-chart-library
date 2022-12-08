import { Chart } from "../../StockChartX/Chart";
import { ChartPanel } from "../../StockChartX/ChartPanels/ChartPanel";
import { IPoint } from "../../StockChartX/Graphics/ChartPoint";
export declare abstract class AbstractTooltip {
    protected static offset: number;
    protected static defaultWidth: number;
    protected shown: boolean;
    constructor();
    protected isIntradayChart(chart: Chart): boolean;
    protected setPosition(chartPanel: ChartPanel, mousePosition: IPoint, htmlId: string, width?: number, flipped?: boolean): void;
    private forceTooltipWithinScreenBounds;
}
//# sourceMappingURL=AbstractTooltip.d.ts.map