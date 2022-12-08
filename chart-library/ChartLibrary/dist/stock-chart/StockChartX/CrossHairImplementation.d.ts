import { ChartComponent } from "./Controls/ChartComponent";
import { IPoint } from "./Graphics/ChartPoint";
import { Gesture, WindowEvent } from "./Gestures/Gesture";
import { CrossHair, ICrossHairConfig, ICrossHairState } from "./CrossHair";
export interface ICrossHairOptions {
    crossHairType: string;
}
export declare class CrossHairImplementation extends ChartComponent implements CrossHair {
    private _view;
    private _options;
    private _visible;
    private _chartSideContextMenu;
    private _currentPositionPrice;
    private _currentPositionPanelIndex;
    get crossHairType(): string;
    set crossHairType(type: string);
    get visible(): boolean;
    set visible(value: boolean);
    constructor(config: ICrossHairConfig);
    private onAlertSelected;
    private onBuySelected;
    private onSellSelected;
    private onStopSelected;
    showTradingContextMenu(e: JQueryEventObject, price: number, panelIndex: number): void;
    protected _subscribeEvents(): void;
    protected _unsubscribeEvents(): void;
    layout(): void;
    applyTheme(): void;
    update(): void;
    show(): void;
    hide(): void;
    saveState(): ICrossHairState;
    loadState(state: ICrossHairState): void;
    setPosition(point: IPoint, animated?: boolean): void;
    handleMouseHoverGesture(gesture: Gesture, event: WindowEvent): void;
    draw(): void;
    destroy(): void;
}
//# sourceMappingURL=CrossHairImplementation.d.ts.map