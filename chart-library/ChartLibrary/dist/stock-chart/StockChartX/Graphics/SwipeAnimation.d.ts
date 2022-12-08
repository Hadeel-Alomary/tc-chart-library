import { ISwipeObject } from './Swipe';
export declare class SwipeAnimation {
    private touchedPoints;
    private animationStartPoint_x_time;
    private durationMsecs;
    private speedMsec;
    private terminated;
    private prevSwipedX;
    constructor();
    addTouchedPoint(x: number, time: number): void;
    start(x: number, time: number): void;
    private speedPxInMSec;
    private distanceBetweenPoints;
    getSwipedData(time: number): ISwipeObject;
    private progressDuration;
    private durationInMSec;
    isTerminated(): boolean;
    terminate(): void;
    finished(time: number): boolean;
}
//# sourceMappingURL=SwipeAnimation.d.ts.map