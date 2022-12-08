import { Gesture, GestureConfig, WindowEvent } from './Gesture';
export interface IContextMenuGestureConfig extends GestureConfig {
}
export declare class ContextMenuGesture extends Gesture {
    constructor(config?: IContextMenuGestureConfig);
    handleEvent(event: WindowEvent): boolean;
    private desktopHandleEvent;
    private longTouchTimeout;
    private isContextMenuShown;
    private mobileHandleEvent;
    private _finishGesture;
}
//# sourceMappingURL=ContextMenuGesture.d.ts.map