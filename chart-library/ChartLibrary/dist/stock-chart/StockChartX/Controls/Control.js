import { __extends } from "tslib";
import { Component } from "./Component";
import { GestureArray } from "../Gestures/GestureArray";
var Control = (function (_super) {
    __extends(Control, _super);
    function Control() {
        var _this = _super.call(this) || this;
        _this._gestures = _this._initGestures() || new GestureArray();
        return _this;
    }
    Control.prototype._initGestures = function () {
        return null;
    };
    Control.prototype.hitTest = function (point) {
        return false;
    };
    Control.prototype.layout = function (frame) {
    };
    Control.prototype.handleEvent = function (event) {
        return this._gestures.handleEvent(event);
    };
    Control.prototype.draw = function () {
    };
    Control.prototype.destroy = function () {
    };
    return Control;
}(Component));
export { Control };
//# sourceMappingURL=Control.js.map