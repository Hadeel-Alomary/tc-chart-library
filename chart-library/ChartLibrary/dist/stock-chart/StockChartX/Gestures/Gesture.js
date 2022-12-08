export var MouseEvent = {
    ENTER: 'mouseenter',
    LEAVE: 'mouseleave',
    MOVE: 'mousemove',
    DOWN: 'mousedown',
    UP: 'mouseup',
    CLICK: 'click',
    DOUBLE_CLICK: 'dblclick',
    CONTEXT_MENU: 'contextmenu',
    WHEEL: 'mousewheel',
    SCROLL: 'DOMMouseScroll'
};
Object.freeze(MouseEvent);
export var TouchEvent = {
    START: 'touchstart',
    MOVE: 'touchmove',
    END: 'touchend'
};
Object.freeze(TouchEvent);
export var GestureState = {
    NONE: 0,
    STARTED: 1,
    CONTINUED: 2,
    FINISHED: 3
};
Object.freeze(GestureState);
var Gesture = (function () {
    function Gesture(config) {
        this.handler = null;
        this.hitTest = null;
        this.context = null;
        this.button = null;
        this._state = GestureState.NONE;
        this.handler = config.handler;
        this.hitTest = config.hitTest;
        this.context = config.context;
        this.button = config.button;
    }
    Object.defineProperty(Gesture.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    Gesture.prototype.handleEvent = function (event) {
        return false;
    };
    Gesture.prototype._checkButton = function (event) {
        var button = this.button;
        return button == null ? true : event.evt.which == button;
    };
    Gesture.prototype._checkHit = function (event) {
        if (event.evt.type === MouseEvent.LEAVE)
            return false;
        var hitTest = this.hitTest;
        if (hitTest) {
            return hitTest.call(this.context, event.pointerPosition);
        }
        return false;
    };
    Gesture.prototype._invokeHandler = function (event) {
        var handler = this.handler;
        if (handler) {
            handler.call(this.context, this, event);
        }
    };
    Gesture.prototype.isActive = function () {
        var state = this._state;
        return state === GestureState.STARTED ||
            state === GestureState.CONTINUED;
    };
    return Gesture;
}());
export { Gesture };
//# sourceMappingURL=Gesture.js.map