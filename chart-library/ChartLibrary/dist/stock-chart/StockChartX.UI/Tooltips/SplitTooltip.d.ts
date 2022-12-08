import { ChartTooltip, ChartTooltipConfig, ChartTooltipType } from "../../../services/index";
import { IPoint } from "../../StockChartX/Graphics/ChartPoint";
import { ChartPanel } from "../../StockChartX/ChartPanels/ChartPanel";
import { AbstractTooltip } from "./AbstractTooltip";
export interface SplitTooltipConfig extends ChartTooltipConfig {
    chartPanel: ChartPanel;
    mousePosition: IPoint;
    data: {
        data: number;
        date: string;
    };
}
export declare class SplitTooltip extends AbstractTooltip implements ChartTooltip {
    private static _instance;
    static get instance(): SplitTooltip;
    private constructor();
    show(config: SplitTooltipConfig): void;
    hide(): void;
    getType(): ChartTooltipType;
    private _appendDataToHTML;
}
//# sourceMappingURL=SplitTooltip.d.ts.map