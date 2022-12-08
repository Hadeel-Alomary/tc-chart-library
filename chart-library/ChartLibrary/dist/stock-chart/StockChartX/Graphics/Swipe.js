import { SwipeAnimation } from './SwipeAnimation';
var Swipe = (function () {
    function Swipe() {
        this._startScrollingPos = null;
        this._isScrolling = false;
        this._swipeAnimation = null;
    }
    Swipe.prototype.handleTouchedPoint = function (event, callerObject) {
        var now = performance.now();
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
    };
    Swipe.prototype.startIfNeeded = function (event) {
        var _this = this;
        if (!this._isScrolling) {
            return;
        }
        var startAnimationTime = performance.now();
        if (this._swipeAnimation !== null) {
            this._swipeAnimation.start(event.pointerPosition.x, startAnimationTime);
        }
        if ((this._swipeAnimation === null || this._swipeAnimation.finished(startAnimationTime))) {
            this.terminate();
            return;
        }
        var swipeAnimation = this._swipeAnimation;
        var animationFn = function () {
            if ((swipeAnimation.isTerminated())) {
                return;
            }
            var now = performance.now();
            var swipeTimeFinished = swipeAnimation.finished(now);
            var finishAnimationFromCaller = false;
            if (!swipeAnimation.isTerminated()) {
                if (_this.callerObj.handler) {
                    finishAnimationFromCaller = _this._invokeSwipeHandler(swipeAnimation.getSwipedData(now));
                }
            }
            if (swipeTimeFinished || finishAnimationFromCaller) {
                _this.terminate();
                return;
            }
            requestAnimationFrame(animationFn);
        };
        requestAnimationFrame(animationFn);
    };
    Swipe.prototype._invokeSwipeHandler = function (event) {
        var handler = this.callerObj.handler;
        if (handler) {
            return handler.call(this.callerObj.caller, event);
        }
    };
    Swipe.prototype.terminate = function () {
        if (this._swipeAnimation !== null) {
            this._swipeAnimation.terminate();
            this._startScrollingPos = null;
            this._isScrolling = false;
            this._swipeAnimation = null;
        }
    };
    return Swipe;
}());
export { Swipe };
//# sourceMappingURL=Swipe.js.map