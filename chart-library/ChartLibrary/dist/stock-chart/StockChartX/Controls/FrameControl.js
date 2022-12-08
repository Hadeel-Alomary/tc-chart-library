import { __extends } from "tslib";
import { Control } from "./Control";
import { Rect } from "../Graphics/Rect";
import { Geometry } from "../Graphics/Geometry";
var FrameControl = (function (_super) {
    __extends(FrameControl, _super);
    function FrameControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._frame = new Rect();
        return _this;
    }
    Object.defineProperty(FrameControl.prototype, "rootDiv", {
        get: function () {
            return this._rootDiv;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameControl.prototype, "frame", {
        get: function () {
            return this._frame;
        },
        enumerable: false,
        configurable: true
    });
    FrameControl.prototype.hitTest = function (point) {
        return Geometry.isPointInsideOrNearRect(point, this._frame);
    };
    FrameControl.prototype.layout = function (frame) {
        if (!this._rootDiv) {
            this._rootDiv = this._createRootDiv();
        }
        this._rootDiv.scxFrame(frame);
        this._frame.copyFrom(frame);
    };
    FrameControl.prototype._createRootDiv = function () {
        return null;
    };
    FrameControl.prototype.destroy = function () {
        if (this._rootDiv) {
            this._rootDiv.remove();
            this._rootDiv = null;
        }
        _super.prototype.destroy.call(this);
    };
    return FrameControl;
}(Control));
export { FrameControl };
//# sourceMappingURL=FrameControl.js.map