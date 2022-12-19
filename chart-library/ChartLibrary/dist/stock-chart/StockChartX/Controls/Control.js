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