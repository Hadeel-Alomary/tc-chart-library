import { Gesture, GestureConfig, WindowEvent } from "./Gesture";
export interface IMouseHoverGestureConfig extends GestureConfig {
    enterEventEnabled?: boolean;
    hoverEventEnabled?: boolean;
    leaveEventEnabled?: boolean;
}
export declare class MouseHoverGesture extends Gesture {
    enterEnabled: boolean;
    hoverEnabled: boolean;
    leaveEnabled: boolean;
    constructor(config: IMouseHoverGestureConfig);
    handleEvent(event: WindowEvent): boolean;
    private desktopHandleEvent;
    private mobileHandleEvent;
}
//# sourceMappingURL=MouseHoverGesture.d.ts.map