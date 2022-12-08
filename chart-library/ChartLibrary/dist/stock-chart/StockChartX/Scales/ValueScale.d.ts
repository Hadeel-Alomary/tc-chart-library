import { IChartComponentConfig } from "../Controls/ChartComponent";
import { ValueScalePanel } from "./ValueScalePanel";
import { Rect } from "../Graphics/Rect";
import { Chart } from "../Chart";
export interface IValueScaleConfig extends IChartComponentConfig {
    showLeftPanel?: boolean;
    showRightPanel?: boolean;
    width?: number;
    useManualWidth?: boolean;
}
export interface ValueScale {
    saveState(): IValueScaleConfig;
    layout(frame: Rect): Rect;
    destroy(): void;
    index: number;
    leftPanel: ValueScalePanel;
    rightPanel: ValueScalePanel;
    leftPanelVisible: boolean;
    rightPanelVisible: boolean;
    useManualWidth: boolean;
    manualWidth: number;
    chart: Chart;
    leftPanelCssClass: string;
}
//# sourceMappingURL=ValueScale.d.ts.map