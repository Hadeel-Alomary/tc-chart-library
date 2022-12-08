import { Gesture, GestureHitTestHandler, WindowEvent } from "./Gesture";
export declare class GestureArray {
    private _gestures;
    get gestures(): Gesture[];
    constructor(gestures?: Gesture | Gesture[], context?: Object, hitTestFunc?: GestureHitTestHandler);
    add(gesture: Gesture | Gesture[]): void;
    remove(gesture: Gesture | Gesture[]): void;
    handleEvent(event: WindowEvent): boolean;
}
//# sourceMappingURL=GestureArray.d.ts.map