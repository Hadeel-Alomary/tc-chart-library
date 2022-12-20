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
import { Gesture, GestureState, TouchEvent, MouseEvent } from "./Gesture";
import { JsUtil } from "../Utils/JsUtil";
import { Animation } from "../Graphics/Animation";
import { BrowserUtils } from '../../../utils';
import { Swipe } from '../Graphics/Swipe';
var PanGesture = (function (_super) {
    __extends(PanGesture, _super);
    function PanGesture(config) {
        var _this = _super.call(this, config) || this;
        _this.moveOffset = {
            x: 0,
            y: 0
        };
        _this.swipeHandler = null;
        _this._minMoveDistance = 1;
        _this.horizontalMoveEnabled = true;
        _this.verticalMoveEnabled = true;
        _this._prevPoint = null;
        _this._lastPoint = null;
        _this._animation = new Animation({
            context: _this,
            recurring: false
        });
        _this._swipe = new Swipe();
        _this._which = 0;
        if (config.minMoveDistance != null)
            _this.minMoveDistance = config.minMoveDistance;
        if (config.horizontalMoveEnabled != null)
            _this.horizontalMoveEnabled = !!config.horizontalMoveEnabled;
        if (config.verticalMoveEnabled)
            _this.verticalMoveEnabled = !!config.verticalMoveEnabled;
        if (config.swipeHandler) {
            _this.swipeHandler = config.swipeHandler;
        }
        return _this;
    }
    Object.defineProperty(PanGesture.prototype, "minMoveDistance", {
        get: function () {
            return this._minMoveDistance;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumber(value))
                throw new Error('minMoveDistance must be a positive number.');
            this._minMoveDistance = value;
        },
        enumerable: true,
        configurable: true
    });
    PanGesture.prototype.handleEvent = function (event) {
        return BrowserUtils.isDesktop() ? this.desktopHandleEvent(event) : this.mobileHandleEvent(event);
    };
    PanGesture.prototype.desktopHandleEvent = function (event) {
        var pos = this._lastPoint = { x: event.pointerPosition.x, y: event.pointerPosition.y };
        switch (event.evt.type) {
            case MouseEvent.DOWN: {
                if (this._checkButton(event) && this._checkHit(event)) {
                    this._prevPoint = { x: pos.x, y: pos.y };
                    this._which = event.evt.type === TouchEvent.START ? 1 : event.evt.which;
                    this._state = GestureState.STARTED;
                    this._invokeHandler(event);
                    return true;
                }
                break;
            }
            case MouseEvent.MOVE: {
                var offset = this.moveOffset;
                if (this.isActive()) {
                    offset.x = pos.x - this._prevPoint.x;
                    offset.y = pos.y - this._prevPoint.y;
                    var minMoveDistance = this.minMoveDistance;
                    if ((this.horizontalMoveEnabled && Math.abs(offset.x) >= minMoveDistance) ||
                        (this.verticalMoveEnabled && Math.abs(offset.y) >= minMoveDistance)) {
                        var animation = this._animation;
                        this._state = GestureState.CONTINUED;
                        if (!animation.started) {
                            var e_1 = $.extend(true, {}, event);
                            animation.callback = function () {
                                this._prevPoint = this._lastPoint;
                                e_1.evt.which = this._which;
                                this._invokeHandler(e_1);
                            };
                            animation.start();
                        }
                    }
                    return true;
                }
                break;
            }
            case MouseEvent.UP:
            case MouseEvent.LEAVE: {
                if (this.isActive()) {
                    this._animation.stop();
                    this._state = GestureState.FINISHED;
                    this._invokeHandler(event);
                    return true;
                }
                break;
            }
        }
        return false;
    };
    PanGesture.prototype.mobileHandleEvent = function (event) {
        var pos = this._lastPoint = { x: event.pointerPosition.x, y: event.pointerPosition.y };
        switch (event.evt.type) {
            case TouchEvent.START: {
                if (this._checkButton(event) && this._checkHit(event)) {
                    this._swipe.terminate();
                    this._prevPoint = { x: pos.x, y: pos.y };
                    this._which = event.evt.type === TouchEvent.START ? 1 : event.evt.which;
                    this._state = GestureState.STARTED;
                    this._invokeHandler(event);
                    return true;
                }
                break;
            }
            case TouchEvent.MOVE: {
                var offset = this.moveOffset;
                if (this.isActive()) {
                    offset.x = 1.5 * (pos.x - this._prevPoint.x);
                    offset.y = 1.5 * (pos.y - this._prevPoint.y);
                    var minMoveDistance = this.minMoveDistance;
                    if ((this.horizontalMoveEnabled && Math.abs(offset.x) >= minMoveDistance) ||
                        (this.verticalMoveEnabled && Math.abs(offset.y) >= minMoveDistance)) {
                        this._swipe.handleTouchedPoint(event, { caller: this.context, handler: this.swipeHandler });
                        var animation = this._animation;
                        this._state = GestureState.CONTINUED;
                        if (!animation.started) {
                            var e_2 = $.extend(true, {}, event);
                            animation.callback = function () {
                                this._prevPoint = this._lastPoint;
                                e_2.evt.which = this._which;
                                this._invokeHandler(e_2);
                            };
                            animation.start();
                        }
                    }
                    return true;
                }
                break;
            }
            case TouchEvent.END: {
                if (this.isActive()) {
                    this._animation.stop();
                    this._state = GestureState.FINISHED;
                    this._invokeHandler(event);
                    this._swipe.startIfNeeded(event);
                    return true;
                }
                break;
            }
        }
        return false;
    };
    return PanGesture;
}(Gesture));
export { PanGesture };
//# sourceMappingURL=PanGesture.js.map