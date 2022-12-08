import { IPoint } from "../Graphics/ChartPoint";
import { ChartPanel } from '../..';
export interface GestureEvent extends Event {
    detail: number;
    wheelDelta: number;
    scale: number;
    touches: {
        pageX: number;
        pageY: number;
    }[];
}
export interface WindowEvent {
    pointerPosition: IPoint;
    evt: JQueryEventObject;
    stopPropagation: boolean;
    chartPanel?: ChartPanel;
}
export declare const MouseEvent: {
    ENTER: string;
    LEAVE: string;
    MOVE: string;
    DOWN: string;
    UP: string;
    CLICK: string;
    DOUBLE_CLICK: string;
    CONTEXT_MENU: string;
    WHEEL: string;
    SCROLL: string;
};
export declare const TouchEvent: {
    START: string;
    MOVE: string;
    END: string;
};
export declare const GestureState: {
    NONE: number;
    STARTED: number;
    CONTINUED: number;
    FINISHED: number;
};
export interface GestureConfig {
    handler?: GestureHandler;
    hitTest?: GestureHitTestHandler;
    context?: Object;
    button?: number;
}
export interface GestureHandler {
    (gesture: Gesture, event: WindowEvent): void;
}
export interface GestureHitTestHandler {
    (position: IPoint): boolean;
}
export declare class Gesture {
    handler: GestureHandler;
    hitTest: GestureHitTestHandler;
    context: Object;
    button: number;
    protected _state: number;
    get state(): number;
    constructor(config: GestureConfig);
    handleEvent(event: WindowEvent): boolean;
    protected _checkButton(event: WindowEvent): boolean;
    protected _checkHit(event: WindowEvent): boolean;
    protected _invokeHandler(event: WindowEvent): void;
    isActive(): boolean;
}
//# sourceMappingURL=Gesture.d.ts.map