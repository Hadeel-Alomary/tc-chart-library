import {WindowEvent} from '../Gestures/Gesture';
import {SwipeAnimation} from './SwipeAnimation';
import {SwipeHandler} from '../Gestures/PanGesture';

export interface ISwipeObject {
    x: number,
    pixels: number
}

interface StartScrollPosition {
    timestamp: number;
    x: number;
    y: number;
}

interface SwipeCallerObject {
    caller: Object,
    handler: SwipeHandler
}

export class Swipe {

    private _startScrollingPos: StartScrollPosition | null = null;
    private _isScrolling: boolean = false;
    private _swipeAnimation: SwipeAnimation | null = null;

    private callerObj: SwipeCallerObject;

    public handleTouchedPoint (event: WindowEvent, callerObject: SwipeCallerObject) {
        let now = performance.now();

        if (this._startScrollingPos === null) {
            this._startScrollingPos = {
                timestamp: now,
                x: event.pointerPosition.x,
                y: event.pointerPosition.y,
            };
        }
        if (this._swipeAnimation !== null) {
            this._swipeAnimation.addTouchedPoint(event.pointerPosition.x, now);
        }

        if (this._startScrollingPos !== null && !this._isScrolling &&
            (this._startScrollingPos.x !== event.pointerPosition.x || this._startScrollingPos.y !== event.pointerPosition.y)) {
            if (this._swipeAnimation === null) {
                this.callerObj = callerObject;
                this._swipeAnimation = new SwipeAnimation();

                this._swipeAnimation.addTouchedPoint(this._startScrollingPos.x, this._startScrollingPos.timestamp);
                this._swipeAnimation.addTouchedPoint(event.pointerPosition.x, now);
            }

            this._isScrolling = true;
        }
    }

    public startIfNeeded(event: WindowEvent): void {
        if (!this._isScrolling) {
            return;
        }

        let startAnimationTime = performance.now();

        if (this._swipeAnimation !== null) {
            this._swipeAnimation.start(event.pointerPosition.x, startAnimationTime);
        }

        if ((this._swipeAnimation === null || this._swipeAnimation.finished(startAnimationTime))) {
            this.terminate();
            return;
        }

        let swipeAnimation = this._swipeAnimation;

        let animationFn = () => {
            if ((swipeAnimation.isTerminated())) {
                return;
            }

            let now = performance.now();
            let swipeTimeFinished = swipeAnimation.finished(now);
            let finishAnimationFromCaller = false;
            if (!swipeAnimation.isTerminated()) {
                if (this.callerObj.handler) {
                    finishAnimationFromCaller = this._invokeSwipeHandler(swipeAnimation.getSwipedData(now));
                }
            }

            if (swipeTimeFinished || finishAnimationFromCaller) {
                this.terminate();
                return;
            }
            requestAnimationFrame(animationFn);
        };
        requestAnimationFrame(animationFn);
    }

    //HA : return true if we need to stop animation any time .
    private _invokeSwipeHandler(event: ISwipeObject):boolean {
        let handler = this.callerObj.handler;

        if (handler) {
           return handler.call(this.callerObj.caller, event);
        }
    }

    public terminate(): void {
        if (this._swipeAnimation !== null) {
            this._swipeAnimation.terminate();
            this._startScrollingPos = null;
            this._isScrolling = false;
            this._swipeAnimation = null;
        }
    }

}
