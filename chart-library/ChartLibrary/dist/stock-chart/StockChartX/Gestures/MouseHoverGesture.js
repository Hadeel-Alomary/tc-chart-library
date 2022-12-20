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
import { Gesture, GestureState, MouseEvent } from "./Gesture";
import { BrowserUtils } from '../../../utils';
var MouseHoverGesture = (function (_super) {
    __extends(MouseHoverGesture, _super);
    function MouseHoverGesture(config) {
        var _this = _super.call(this, config) || this;
        _this.enterEnabled = true;
        _this.hoverEnabled = true;
        _this.leaveEnabled = true;
        if (config.enterEventEnabled != null)
            _this.enterEnabled = !!config.enterEventEnabled;
        if (config.hoverEventEnabled != null)
            _this.hoverEnabled = !!config.hoverEventEnabled;
        if (config.leaveEventEnabled != null)
            _this.leaveEnabled = !!config.leaveEventEnabled;
        return _this;
    }
    MouseHoverGesture.prototype.handleEvent = function (event) {
        return BrowserUtils.isDesktop() ? this.desktopHandleEvent(event) : this.mobileHandleEvent(event);
    };
    MouseHoverGesture.prototype.desktopHandleEvent = function (event) {
        switch (event.evt.type) {
            case MouseEvent.ENTER:
            case MouseEvent.MOVE:
                {
                    if (this._checkHit(event)) {
                        if (this.isActive()) {
                            this._state = GestureState.CONTINUED;
                            if (this.hoverEnabled)
                                this._invokeHandler(event);
                        }
                        else {
                            this._state = GestureState.STARTED;
                            if (this.enterEnabled)
                                this._invokeHandler(event);
                        }
                        return true;
                    }
                    else if (this.isActive()) {
                        this._state = GestureState.FINISHED;
                        if (this.leaveEnabled)
                            this._invokeHandler(event);
                        return true;
                    }
                    break;
                }
            case MouseEvent.LEAVE:
                {
                    if (this.isActive()) {
                        this._state = GestureState.FINISHED;
                        if (this.leaveEnabled)
                            this._invokeHandler(event);
                        return true;
                    }
                    break;
                }
        }
        return false;
    };
    MouseHoverGesture.prototype.mobileHandleEvent = function (event) {
        return false;
    };
    return MouseHoverGesture;
}(Gesture));
export { MouseHoverGesture };
//# sourceMappingURL=MouseHoverGesture.js.map