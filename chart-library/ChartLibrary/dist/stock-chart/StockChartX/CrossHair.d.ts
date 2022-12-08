import { IChartComponentConfig } from "./Controls/ChartComponent";
import { IFillTheme, IStrokeTheme, ITextTheme } from "./Theme";
import { Chart } from "./Chart";
import { IPoint } from "./Graphics/ChartPoint";
import { Gesture, WindowEvent } from "./Gestures/Gesture";
export interface ICrossHairState {
    crossHairType: string;
}
export interface ICrossHairConfig extends IChartComponentConfig {
    crossHairType?: string;
}
export interface ICrossHairTheme {
    line: IStrokeTheme;
    fill: IFillTheme;
    text: ITextTheme;
}
export interface CrossHair {
    crossHairType: string;
    chart: Chart;
    visible: boolean;
    saveState(): ICrossHairState;
    loadState(state: ICrossHairState): void;
    layout(): void;
    update(): void;
    setPosition(point: IPoint, animated?: boolean): void;
    hide(): void;
    show(): void;
    handleMouseHoverGesture(gesture: Gesture, event: WindowEvent): void;
    applyTheme(): void;
    showTradingContextMenu(e: JQueryEventObject, value: number, panelIndex: number): void;
}
export declare const CrossHairType: {
    NONE: string;
    MARKERS: string;
    CROSS: string;
};
//# sourceMappingURL=CrossHair.d.ts.map