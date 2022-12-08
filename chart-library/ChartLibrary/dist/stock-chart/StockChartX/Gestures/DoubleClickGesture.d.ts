import { Gesture, GestureConfig, WindowEvent } from "./Gesture";
export interface IDoubleClickGestureConfig extends GestureConfig {
}
export declare class DoubleClickGesture extends Gesture {
    private _startDate;
    private _maxClickSeparationInterval;
    private _minClickSeparationInterval;
    private _resumeDoubleClickDetectionTime;
    constructor(config: IDoubleClickGestureConfig);
    handleEvent(event: WindowEvent): boolean;
    private desktopHandleEvent;
    private mobileHandleEvent;
    private _finishGesture;
}
//# sourceMappingURL=DoubleClickGesture.d.ts.map