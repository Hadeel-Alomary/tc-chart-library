import { Gesture, GestureConfig, WindowEvent } from "./Gesture";
import { IPoint } from "../Graphics/ChartPoint";
import { ISwipeObject } from '../Graphics/Swipe';
export interface SwipeHandler {
    (event: ISwipeObject): void;
}
export interface IPanGestureConfig extends GestureConfig {
    minMoveDistance?: number;
    horizontalMoveEnabled?: boolean;
    verticalMoveEnabled?: boolean;
    swipeHandler?: SwipeHandler;
}
export declare class PanGesture extends Gesture {
    moveOffset: IPoint;
    swipeHandler: SwipeHandler;
    private _minMoveDistance;
    get minMoveDistance(): number;
    set minMoveDistance(value: number);
    horizontalMoveEnabled: boolean;
    verticalMoveEnabled: boolean;
    private _prevPoint;
    private _lastPoint;
    private _animation;
    private _swipe;
    private _which;
    constructor(config: IPanGestureConfig);
    handleEvent(event: WindowEvent): boolean;
    private desktopHandleEvent;
    private mobileHandleEvent;
}
//# sourceMappingURL=PanGesture.d.ts.map