import { Control, IControl } from "./Control";
import { Rect } from "../Graphics/Rect";
import { IPoint } from "../Graphics/ChartPoint";
export interface IFrameControl extends IControl {
    rootDiv: JQuery;
    frame: Rect;
}
export declare abstract class FrameControl extends Control implements IFrameControl {
    protected _rootDiv: JQuery;
    get rootDiv(): JQuery;
    private _frame;
    get frame(): Rect;
    hitTest(point: IPoint): boolean;
    layout(frame: Rect): void;
    protected _createRootDiv(): JQuery;
    destroy(): void;
}
//# sourceMappingURL=FrameControl.d.ts.map