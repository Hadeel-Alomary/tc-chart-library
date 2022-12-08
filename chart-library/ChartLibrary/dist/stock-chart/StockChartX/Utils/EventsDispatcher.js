var EVENT_DELIMITER = ' ';
var NAME_DELIMITER = '.';
var DEFAULT_EVENT_NAME = '';
var EventsDispatcher = (function () {
    function EventsDispatcher() {
        this._listeners = {};
    }
    EventsDispatcher.prototype.on = function (eventNames, handler, target) {
        var events = eventNames.split(EVENT_DELIMITER);
        var listeners = this._listeners;
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            if (!event_1)
                continue;
            var parts = event_1.split(NAME_DELIMITER), baseEvent = parts[0], name_1 = parts[1] || DEFAULT_EVENT_NAME;
            if (!listeners[baseEvent])
                listeners[baseEvent] = [];
            var eventListeners = listeners[baseEvent];
            eventListeners.push({
                name: name_1,
                handler: handler,
                target: target
            });
        }
    };
    EventsDispatcher.prototype.off = function (eventNames, target) {
        var events = eventNames.split(EVENT_DELIMITER);
        for (var _i = 0, events_2 = events; _i < events_2.length; _i++) {
            var event_2 = events_2[_i];
            if (!event_2)
                continue;
            var parts = event_2.split(NAME_DELIMITER), baseEvent = parts[0], name_2 = parts[1] || DEFAULT_EVENT_NAME;
            if (baseEvent)
                this._off(baseEvent, name_2, target);
            else {
                var listeners = this._listeners;
                for (var key in listeners) {
                    if (listeners.hasOwnProperty(key))
                        this._off(key, name_2, target);
                }
            }
        }
    };
    EventsDispatcher.prototype._off = function (baseEvent, name, target) {
        name = name || DEFAULT_EVENT_NAME;
        var eventListeners = this._listeners[baseEvent];
        if (eventListeners) {
            for (var i = 0; i < eventListeners.length; i++) {
                if ((eventListeners[i].name === name) && (!target || target === eventListeners[i].target)) {
                    eventListeners.splice(i, 1);
                    i--;
                }
            }
            if (eventListeners.length === 0)
                delete this._listeners[baseEvent];
        }
    };
    EventsDispatcher.prototype.fire = function (eventName, event) {
        var eventListeners = this._listeners[eventName];
        if (eventListeners) {
            event = event || {};
            event.type = eventName;
            for (var _i = 0, eventListeners_1 = eventListeners; _i < eventListeners_1.length; _i++) {
                var listener = eventListeners_1[_i];
                listener.handler(event);
            }
        }
    };
    return EventsDispatcher;
}());
export { EventsDispatcher };
//# sourceMappingURL=EventsDispatcher.js.map