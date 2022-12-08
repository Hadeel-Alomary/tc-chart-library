import { ChartTooltip, ChartTooltipConfig, ChartTooltipType } from "../../../services/index";
import { IPoint } from "../../StockChartX/Graphics/ChartPoint";
import { ChartPanel } from "../../StockChartX/ChartPanels/ChartPanel";
import { Indicator } from "../../StockChartX/Indicators/Indicator";
import { AbstractTooltip } from "./AbstractTooltip";
export interface IndicatorTooltipConfig extends ChartTooltipConfig {
    indicator: Indicator;
    chartPanel: ChartPanel;
    mousePosition: IPoint;
}
export declare class IndicatorTooltip extends AbstractTooltip implements ChartTooltip {
    private static _instance;
    static get instance(): IndicatorTooltip;
    private constructor();
    show(config: IndicatorTooltipConfig): void;
    hide(): void;
    getType(): ChartTooltipType;
    private _removeAddedRow;
    private _outsideTheSeries;
    private _appendDataToHTML;
}
//# sourceMappingURL=IndicatorTooltip.d.ts.map