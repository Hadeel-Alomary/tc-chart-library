import { JsUtil } from "../Utils/JsUtil";
import { AnimationController } from "./AnimationController";
var Animation = (function () {
    function Animation(config) {
        this._isStarted = false;
        this.context = null;
        this._recurring = true;
        if (config) {
            this.context = config.context;
            if (config.recurring != null)
                this.recurring = config.recurring;
            this.callback = config.callback;
        }
    }
    Object.defineProperty(Animation.prototype, "callback", {
        get: function () {
            return this._callback;
        },
        set: function (value) {
            if (value != null && !JsUtil.isFunction(value))
                throw new TypeError("Callback must be a function.");
            this._callback = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "started", {
        get: function () {
            return this._isStarted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "recurring", {
        get: function () {
            return this._recurring;
        },
        set: function (value) {
            this._recurring = value;
        },
        enumerable: true,
        configurable: true
    });
    Animation.prototype.start = function () {
        if (!this.callback)
            throw new Error("Callback is not assigned.");
        if (this._isStarted)
            return false;
        if (AnimationController.add(this)) {
            this._isStarted = true;
            return true;
        }
        return false;
    };
    Animation.prototype.stop = function () {
        AnimationController.remove(this);
        this._isStarted = false;
    };
    Animation.prototype.handleAnimationFrame = function () {
        this.callback.call(this.context);
    };
    return Animation;
}());
export { Animation };
//# sourceMappingURL=Animation.js.map