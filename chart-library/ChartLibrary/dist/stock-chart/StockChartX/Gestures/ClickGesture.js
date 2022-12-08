import { __extends } from "tslib";
import { Gesture, GestureState, MouseEvent } from './Gesture';
var ClickGesture = (function (_super) {
    __extends(ClickGesture, _super);
    function ClickGesture(config) {
        var _this = _super.call(this, config) || this;
        _this._isTouch = false;
        return _this;
    }
    ClickGesture.prototype.handleEvent = function (event) {
        return this.desktopAndMobileHandleEvent(event);
    };
    ClickGesture.prototype.desktopAndMobileHandleEvent = function (event) {
        switch (event.evt.type) {
            case MouseEvent.CLICK:
                if (!this._isTouch && this._finishGesture(event)) {
                    return true;
                }
                break;
        }
        return false;
    };
    ClickGesture.prototype._finishGesture = function (event) {
        if (this._checkButton(event) && this._checkHit(event)) {
            this._state = GestureState.FINISHED;
            this._invokeHandler(event);
            return true;
        }
    };
    return ClickGesture;
}(Gesture));
export { ClickGesture };
//# sourceMappingURL=ClickGesture.js.map