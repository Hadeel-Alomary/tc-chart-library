var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Gesture, GestureState, MouseEvent } from "./Gesture";
import { BrowserUtils } from '../../../utils';
var DoubleClickGesture = (function (_super) {
    __extends(DoubleClickGesture, _super);
    function DoubleClickGesture(config) {
        var _this = _super.call(this, config) || this;
        _this._startDate = null;
        _this._maxClickSeparationInterval = 1500;
        _this._minClickSeparationInterval = 100;
        return _this;
    }
    DoubleClickGesture.prototype.handleEvent = function (event) {
        return BrowserUtils.isDesktop() ? this.desktopHandleEvent(event) : this.mobileHandleEvent(event);
    };
    DoubleClickGesture.prototype.desktopHandleEvent = function (event) {
        switch (event.evt.type) {
            case MouseEvent.DOUBLE_CLICK:
                if (this._finishGesture(event))
                    return true;
                break;
        }
        return false;
    };
    DoubleClickGesture.prototype.mobileHandleEvent = function (event) {
        switch (event.evt.type) {
            case MouseEvent.CLICK:
                if (this._resumeDoubleClickDetectionTime && (new Date().getTime() < this._resumeDoubleClickDetectionTime.getTime())) {
                    return false;
                }
                if (this._startDate == null) {
                    this._startDate = new Date();
                }
                else if ((new Date().getTime() - this._startDate.getTime()) < this._minClickSeparationInterval) {
                    return false;
                }
                else if ((new Date().getTime() - this._startDate.getTime()) > this._maxClickSeparationInterval) {
                    this._startDate = new Date();
                }
                else {
                    this._startDate = null;
                    this._resumeDoubleClickDetectionTime = new Date();
                    this._resumeDoubleClickDetectionTime.setSeconds(this._resumeDoubleClickDetectionTime.getSeconds() + 1);
                    if (this._finishGesture(event)) {
                        return true;
                    }
                }
                break;
        }
        return false;
    };
    DoubleClickGesture.prototype._finishGesture = function (event) {
        if (this._checkButton(event) && this._checkHit(event)) {
            this._state = GestureState.FINISHED;
            this._invokeHandler(event);
            event.stopPropagation = true;
            return true;
        }
        return false;
    };
    return DoubleClickGesture;
}(Gesture));
export { DoubleClickGesture };
//# sourceMappingURL=DoubleClickGesture.js.map