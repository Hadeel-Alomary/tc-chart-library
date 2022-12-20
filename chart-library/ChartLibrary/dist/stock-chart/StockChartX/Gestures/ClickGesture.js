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