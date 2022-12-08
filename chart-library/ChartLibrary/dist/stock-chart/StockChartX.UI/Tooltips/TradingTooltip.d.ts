import { ChartTooltip, ChartTooltipConfig, ChartTooltipType } from "../../../services/index";
import { IPoint } from "../../StockChartX/Graphics/ChartPoint";
import { ChartPanel } from "../../StockChartX/ChartPanels/ChartPanel";
import { AbstractTooltip } from "./AbstractTooltip";
export interface TradingTooltipConfig extends ChartTooltipConfig {
    chartPanel: ChartPanel;
    mousePosition: IPoint;
    text: string;
}
export declare class TradingTooltip extends AbstractTooltip implements ChartTooltip {
    private static _instance;
    static get instance(): TradingTooltip;
    private constructor();
    show(config: TradingTooltipConfig): void;
    hide(): void;
    getType(): ChartTooltipType;
    private _appendDataToHTML;
}
//# sourceMappingURL=TradingTooltip.d.ts.map