import { ChartComponent } from "../Controls/ChartComponent";
import { ValueScalePanel } from "./ValueScalePanel";
import { Rect } from "../Graphics/Rect";
import { IValueScaleConfig, ValueScale } from "./ValueScale";
export declare class ValueScaleImplementation extends ChartComponent implements ValueScale {
    private _leftPanel;
    get leftPanel(): ValueScalePanel;
    private _rightPanel;
    get rightPanel(): ValueScalePanel;
    private _options;
    get leftPanelCssClass(): string;
    get rightPanelCssClass(): string;
    get useManualWidth(): boolean;
    set useManualWidth(value: boolean);
    get manualWidth(): number;
    set manualWidth(value: number);
    get leftPanelVisible(): boolean;
    set leftPanelVisible(value: boolean);
    get rightPanelVisible(): boolean;
    set rightPanelVisible(value: boolean);
    get index(): number;
    constructor(config: IValueScaleConfig);
    saveState(): IValueScaleConfig;
    loadState(state: IValueScaleConfig): void;
    layout(frame: Rect): Rect;
    draw(): void;
    destroy(): void;
}
//# sourceMappingURL=ValueScaleImplementation.d.ts.map