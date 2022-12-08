import { ChartTooltip, ChartTooltipConfig, ChartTooltipType } from "../../../services/index";
import { IPoint } from "../../StockChartX/Graphics/ChartPoint";
import { ChartPanel } from "../../StockChartX/ChartPanels/ChartPanel";
import { AbstractTooltip } from "./AbstractTooltip";
export interface PriceTooltipConfig extends ChartTooltipConfig {
    chartPanel: ChartPanel;
    mousePosition: IPoint;
}
export declare class PriceTooltip extends AbstractTooltip implements ChartTooltip {
    private static _instance;
    static get instance(): PriceTooltip;
    private constructor();
    show(config: PriceTooltipConfig): void;
    hide(): void;
    getType(): ChartTooltipType;
    private _outsideTheSeries;
    private _appendDataToHTML;
    private _calculateData;
}
//# sourceMappingURL=PriceTooltip.d.ts.map