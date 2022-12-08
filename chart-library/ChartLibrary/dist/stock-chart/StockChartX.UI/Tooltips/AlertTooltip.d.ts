import { ChartTooltip, ChartTooltipConfig, ChartTooltipType } from "../../../services/index";
import { IPoint } from "../../StockChartX/Graphics/ChartPoint";
import { ChartPanel } from "../../StockChartX/ChartPanels/ChartPanel";
import { AbstractTooltip } from "./AbstractTooltip";
export interface AlertTooltipConfig extends ChartTooltipConfig {
    chartPanel: ChartPanel;
    position: IPoint;
    text: string;
}
export declare class AlertTooltip extends AbstractTooltip implements ChartTooltip {
    private static _instance;
    static get instance(): AlertTooltip;
    private constructor();
    show(config: AlertTooltipConfig): void;
    hide(): void;
    getType(): ChartTooltipType;
    private _appendDataToHTML;
}
//# sourceMappingURL=AlertTooltip.d.ts.map