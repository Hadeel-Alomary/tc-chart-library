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
import { Gesture, GestureState, MouseEvent, TouchEvent } from './Gesture';
import { BrowserUtils } from '../../../utils';
var ContextMenuGesture = (function (_super) {
    __extends(ContextMenuGesture, _super);
    function ContextMenuGesture(config) {
        return _super.call(this, config) || this;
    }
    ContextMenuGesture.prototype.handleEvent = function (event) {
        return BrowserUtils.isMobile() ? this.mobileHandleEvent(event) : this.desktopHandleEvent(event);
    };
    ContextMenuGesture.prototype.desktopHandleEvent = function (event) {
        switch (event.evt.type) {
            case MouseEvent.CONTEXT_MENU:
                if (this._finishGesture(event)) {
                    return true;
                }
                break;
        }
        return false;
    };
    ContextMenuGesture.prototype.mobileHandleEvent = function (event) {
        var _this = this;
        switch (event.evt.type) {
            case TouchEvent.START:
                this.isContextMenuShown = false;
                if (this._checkHit(event)) {
                    this.longTouchTimeout = window.setTimeout(function () {
                        _this._state = GestureState.STARTED;
                        var evt = event.evt, origEvent = evt.originalEvent;
                        event.evt.pageX = origEvent.touches[0].pageX;
                        event.evt.pageY = origEvent.touches[0].pageY;
                        if (_this._finishGesture(event)) {
                            _this.isContextMenuShown = true;
                            return true;
                        }
                    }, 500);
                }
                break;
            case TouchEvent.MOVE:
                this._state = GestureState.CONTINUED;
            case TouchEvent.END:
                if (this.longTouchTimeout) {
                    clearTimeout(this.longTouchTimeout);
                    this.longTouchTimeout = null;
                }
                if (this.isContextMenuShown) {
                    event.evt.stopPropagation();
                    event.evt.preventDefault();
                }
                break;
        }
        return false;
    };
    ContextMenuGesture.prototype._finishGesture = function (event) {
        if (this._checkHit(event) || this.isActive()) {
            this._state = GestureState.FINISHED;
            this._invokeHandler(event);
            return true;
        }
    };
    return ContextMenuGesture;
}(Gesture));
export { ContextMenuGesture };
//# sourceMappingURL=ContextMenuGesture.js.map