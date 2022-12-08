import { WindowEvent } from '../Gestures/Gesture';
import { SwipeHandler } from '../Gestures/PanGesture';
export interface ISwipeObject {
    x: number;
    pixels: number;
}
interface SwipeCallerObject {
    caller: Object;
    handler: SwipeHandler;
}
export declare class Swipe {
    private _startScrollingPos;
    private _isScrolling;
    private _swipeAnimation;
    private callerObj;
    handleTouchedPoint(event: WindowEvent, callerObject: SwipeCallerObject): void;
    startIfNeeded(event: WindowEvent): void;
    private _invokeSwipeHandler;
    terminate(): void;
}
export {};
//# sourceMappingURL=Swipe.d.ts.map