import { ChartTooltip, ChartTooltipConfig, ChartTooltipType } from "../../../services/index";
import { ChartPoint } from "../../StockChartX/Graphics/ChartPoint";
import { ChartPanel } from "../../StockChartX/ChartPanels/ChartPanel";
import { AbstractTooltip } from "./AbstractTooltip";
export interface DrawingTooltipConfig extends ChartTooltipConfig {
    chartPanel: ChartPanel;
    points: ChartPoint[];
}
export declare class DrawingTooltip extends AbstractTooltip implements ChartTooltip {
    private static _instance;
    static get instance(): DrawingTooltip;
    private constructor();
    show(config: DrawingTooltipConfig): void;
    hide(): void;
    getType(): ChartTooltipType;
    private update;
    private updateValues;
    private getTooltipValues;
    private fillHtmlValues;
    private getTooltipPosition;
}
//# sourceMappingURL=DrawingTooltip.d.ts.map