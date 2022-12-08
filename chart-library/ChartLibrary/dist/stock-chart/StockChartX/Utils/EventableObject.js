import { EventsDispatcher } from "./EventsDispatcher";
var EventableObject = (function () {
    function EventableObject() {
        this._eventsDispatcher = new EventsDispatcher();
        this._suppressEvents = false;
        this._event = {
            type: null,
            sender: this,
            target: this,
            value: undefined,
            oldValue: undefined
        };
    }
    EventableObject.prototype.suppressEvents = function (suppress) {
        var oldValue = this._suppressEvents;
        this._suppressEvents = suppress != null ? suppress : true;
        return oldValue;
    };
    EventableObject.prototype.on = function (events, handler, target) {
        this._eventsDispatcher.on(events, handler, target);
        return this;
    };
    EventableObject.prototype.off = function (events, target) {
        this._eventsDispatcher.off(events, target);
        return this;
    };
    EventableObject.prototype.fire = function (event, data) {
        if (!this._suppressEvents) {
            if (data)
                data.sender = this;
            this._eventsDispatcher.fire(event, data);
        }
    };
    EventableObject.prototype.fireValueChanged = function (eventType, newValue, oldValue) {
        this.fireTargetValueChanged(this, eventType, newValue, oldValue);
    };
    EventableObject.prototype.fireTargetValueChanged = function (target, eventType, newValue, oldValue) {
        if (!this._suppressEvents) {
            var event_1 = this._event;
            event_1.target = target || this;
            event_1.value = newValue;
            event_1.oldValue = oldValue;
            this.fire(eventType, event_1);
        }
    };
    return EventableObject;
}());
export { EventableObject };
//# sourceMappingURL=EventableObject.js.map