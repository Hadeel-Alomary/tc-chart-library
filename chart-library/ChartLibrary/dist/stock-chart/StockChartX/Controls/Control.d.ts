import { Component, IComponent } from "./Component";
import { IPoint } from "../Graphics/ChartPoint";
import { Rect } from "../Graphics/Rect";
import { WindowEvent } from "../Gestures/Gesture";
import { GestureArray } from "../Gestures/GestureArray";
export interface IControl extends IComponent {
    hitTest(point: IPoint): boolean;
    layout(frame: Rect): void;
    handleEvent(event: WindowEvent): boolean;
    draw(): void;
}
export declare abstract class Control extends Component implements IControl {
    private _gestures;
    constructor();
    protected _initGestures(): GestureArray;
    hitTest(point: IPoint): boolean;
    layout(frame: Rect): void;
    handleEvent(event: WindowEvent): boolean;
    draw(): void;
    destroy(): void;
}
//# sourceMappingURL=Control.d.ts.map