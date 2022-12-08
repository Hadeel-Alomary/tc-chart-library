import { Gesture, GestureConfig, WindowEvent } from './Gesture';
export interface IClickGestureConfig extends GestureConfig {
}
export declare class ClickGesture extends Gesture {
    private _isTouch;
    constructor(config: IClickGestureConfig);
    handleEvent(event: WindowEvent): boolean;
    private desktopAndMobileHandleEvent;
    private _finishGesture;
}
//# sourceMappingURL=ClickGesture.d.ts.map