import { Gesture } from "./Gesture";
import { BrowserUtils } from '../../../utils';
var GestureArray = (function () {
    function GestureArray(gestures, context, hitTestFunc) {
        this._gestures = [];
        if (!gestures)
            return;
        this.add(gestures);
        if (context || hitTestFunc) {
            var items = this.gestures;
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var gesture = items_1[_i];
                if (!gesture.context)
                    gesture.context = context;
                if (!gesture.hitTest)
                    gesture.hitTest = hitTestFunc;
            }
        }
    }
    Object.defineProperty(GestureArray.prototype, "gestures", {
        get: function () {
            return this._gestures;
        },
        enumerable: true,
        configurable: true
    });
    GestureArray.prototype.add = function (gesture) {
        if (!gesture)
            return;
        if (Array.isArray(gesture)) {
            for (var _i = 0, gesture_1 = gesture; _i < gesture_1.length; _i++) {
                var item = gesture_1[_i];
                this.add(item);
            }
        }
        else {
            if (!(gesture instanceof Gesture))
                throw new TypeError('Item must be an instance of Gesture.');
            for (var _a = 0, _b = this._gestures; _a < _b.length; _a++) {
                var item = _b[_a];
                if (item === gesture) {
                    return;
                }
            }
            this._gestures.push(gesture);
        }
    };
    GestureArray.prototype.remove = function (gesture) {
        if (Array.isArray(gesture)) {
            for (var _i = 0, gesture_2 = gesture; _i < gesture_2.length; _i++) {
                var item = gesture_2[_i];
                this.remove(item);
            }
        }
        else {
            var gestures = this._gestures;
            for (var i = 0; i < gestures.length; i++) {
                if (gestures[i] === gesture) {
                    gestures.splice(i, 1);
                    break;
                }
            }
        }
    };
    GestureArray.prototype.handleEvent = function (event) {
        var isHandled = false;
        for (var _i = 0, _a = this._gestures; _i < _a.length; _i++) {
            var gesture = _a[_i];
            if (gesture.handleEvent(event)) {
                isHandled = true;
                if (BrowserUtils.isMobile()) {
                    break;
                }
            }
        }
        return isHandled;
    };
    return GestureArray;
}());
export { GestureArray };
//# sourceMappingURL=GestureArray.js.map