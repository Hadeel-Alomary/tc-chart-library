var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Gesture, GestureState, MouseEvent, TouchEvent } from "./Gesture";
import { Animation } from "../Graphics/Animation";
import { BrowserUtils } from '../../../utils';
var MouseWheelGesture = (function (_super) {
    __extends(MouseWheelGesture, _super);
    function MouseWheelGesture(config) {
        var _this = _super.call(this, config) || this;
        _this.delta = 0;
        _this.length = 0;
        _this._prevLength = 0;
        _this._lengthThreshold = 5;
        _this._animation = new Animation({
            context: _this,
            recurring: false
        });
        return _this;
    }
    MouseWheelGesture.prototype.handleEvent = function (event) {
        return BrowserUtils.isDesktop() ? this.desktopHandleEvent(event) : this.mobileHandleEvent(event);
    };
    MouseWheelGesture.prototype.desktopHandleEvent = function (event) {
        var evt = event.evt, origEvent = evt.originalEvent;
        switch (evt.type) {
            case MouseEvent.WHEEL:
            case MouseEvent.SCROLL:
                if (this._checkHit(event)) {
                    if (evt.type == MouseEvent.SCROLL)
                        this.delta = origEvent.detail > 0 ? 1 : -1;
                    else
                        this.delta = origEvent.wheelDelta < 0 ? 1 : -1;
                    this._state = GestureState.FINISHED;
                    this._invokeHandler(event);
                    return true;
                }
                break;
        }
        return false;
    };
    MouseWheelGesture.prototype.mobileHandleEvent = function (event) {
        var evt = event.evt, origEvent = evt.originalEvent;
        switch (evt.type) {
            case TouchEvent.START:
                if (this._state == GestureState.STARTED) {
                    this._state = GestureState.FINISHED;
                }
                if (this._checkHit(event) && !this.isActive() && origEvent.touches.length === 2) {
                    this.middlePoint = this.calculateMiddlePoint(origEvent.touches);
                    this._prevLength = MouseWheelGesture._calculateLength(origEvent.touches);
                    this._state = GestureState.STARTED;
                    return true;
                }
                break;
            case TouchEvent.MOVE:
                if (this.isActive()) {
                    var touches = origEvent.touches;
                    if (touches.length !== 2)
                        return true;
                    var middlePoint = this.calculateMiddlePoint(origEvent.touches);
                    var length_1 = MouseWheelGesture._calculateLength(touches);
                    var offset = length_1 - this._prevLength, isSignChanged = (this._prevLength > 0 && length_1 < 0) || (this._prevLength < 0 && length_1 > 0), threshold = (isSignChanged ? 2 : 1) * this._lengthThreshold;
                    if (Math.abs(offset) >= threshold) {
                        this.delta = offset < 0 ? 1 : -1;
                        this.length = offset;
                        this._state = GestureState.CONTINUED;
                        var animation = this._animation;
                        if (!animation.started) {
                            var e_1 = $.extend(true, {}, event);
                            this.scale = length_1 / this._prevLength;
                            this._prevLength = length_1;
                            this.middlePoint = middlePoint;
                            animation.callback = function () {
                                this._invokeHandler(e_1);
                            };
                            animation.start();
                        }
                    }
                    return true;
                }
                break;
            case TouchEvent.END:
                if (this.isActive()) {
                    if (origEvent.touches.length == 0) {
                        this._state = GestureState.FINISHED;
                    }
                    return true;
                }
                break;
        }
        return false;
    };
    MouseWheelGesture._calculateLength = function (touches) {
        var dx = touches[0].pageX - touches[1].pageX, dy = touches[0].pageY - touches[1].pageY, len = Math.sqrt(dx * dx + dy * dy);
        return len;
    };
    MouseWheelGesture.prototype.calculateMiddlePoint = function (touches) {
        var point0 = touches[0];
        var point1 = touches[1];
        var x = (point0.pageX + point1.pageX) / 2;
        var y = (point0.pageY + point1.pageY) / 2;
        return { x: x, y: y };
    };
    return MouseWheelGesture;
}(Gesture));
export { MouseWheelGesture };
//# sourceMappingURL=MouseWheelGesture.js.map