import { Gesture, GestureConfig, WindowEvent } from "./Gesture";
export interface IMouseWheelGestureConfig extends GestureConfig {
}
export declare class MouseWheelGesture extends Gesture {
    delta: number;
    length: number;
    private _prevLength;
    private _lengthThreshold;
    private _animation;
    scale: number;
    middlePoint: {
        x: number;
        y: number;
    };
    constructor(config: IMouseWheelGestureConfig);
    handleEvent(event: WindowEvent): boolean;
    private desktopHandleEvent;
    private mobileHandleEvent;
    private static _calculateLength;
    private calculateMiddlePoint;
}
//# sourceMappingURL=MouseWheelGesture.d.ts.map