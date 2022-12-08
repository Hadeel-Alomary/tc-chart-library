import { __extends } from "tslib";
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