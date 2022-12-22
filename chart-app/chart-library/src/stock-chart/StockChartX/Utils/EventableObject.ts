/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {EventsDispatcher} from "./EventsDispatcher";

export interface IEventObject {
    type: string;
    sender: Object;
    target: Object;
}

export interface IValueChangedEvent extends IEventObject {
    value?: unknown;
    oldValue?: unknown;
}

export interface EventHandler {
    (eventObject: IEventObject): void;
}

export interface IEventableObject {
    suppressEvents(suppress?: boolean): void;

    fire(eventType: string, event: IEventObject): void;

    fireValueChanged(eventType: string, newValue?: unknown, oldValue?: unknown): void;
}

export class EventableObject implements IEventableObject {
    private _eventsDispatcher: EventsDispatcher = new EventsDispatcher();

    protected _suppressEvents: boolean = false;

    private _event: IValueChangedEvent = {
        type: null,
        sender: this,
        target: this,
        value: undefined,
        oldValue: undefined
    };

    /**
     * Suppresses/Allows all events.
     * @method suppressEvents
     * @param {boolean} [suppress = true] The flag to suppress or resume events raising.
     * @returns {boolean} The old value.
     * @memberOf EventableObject#
     * @example <caption>Suppress events</caption>
     *  obj.suppressEvents();
     * @example <caption>Resume events</caption>
     *  obj.suppressEvents(false);
     */
    suppressEvents(suppress?: boolean): boolean {
        let oldValue = this._suppressEvents;
        this._suppressEvents = suppress != null ? suppress : true;

        return oldValue;
    }

    /**
     * Subscribes to events.
     * @method on
     * @param {String} events The event names to subscribe.
     * @param {EventHandler} handler The event handler.
     * @param {Object} [target] The optional target. For internal use.
     * @returns {EventableObject}
     * @memberOf EventableObject#
     * @see [off]{@linkcode EventableObject#off} to unsubscribe events.
     * @example <caption>Subscribe to 'my_event' event.</caption>
     *      obj.on('my_event', function(event) {});
     *
     * @example <caption>Subscribe to two events at once.</caption>
     *      obj.on('click key_press', function(event) {});
     */
    on(events: string, handler: EventHandler, target?: Object): EventableObject {
        this._eventsDispatcher.on(events, handler, target);

        return this;
    }

    /**
     * Unsubscribes from events.
     * @method off
     * @param {String} events The event names to unsubscribe.
     * @param {Object} [target] The optional target. For internal use.
     * @returns {EventableObject}
     * @memberOf EventableObject#
     * @see [on]{@linkcode EventableObject#on} to subscribe events.
     * @example <caption>Unsubscribe from 'my_event' event.</caption>
     *      obj.off('my_event');
     *
     * @example <caption>Unsubscribe from two events.</caption>
     *      obj.off('click key_press');
     */
    off(events: string, target?: Object): EventableObject {
        this._eventsDispatcher.off(events, target);

        return this;
    }

    /**
     * Fires event.
     * @method fire
     * @param {String} event The event name.
     * @param {Object} data The event data.
     * @memberOf EventableObject#
     * @example
     *  obj.fire('custom_event', {customData: 'some data'});
     */
    fire(event: string, data: IEventObject) {
        if (!this._suppressEvents) {
            if (data)
                data.sender = this;
            this._eventsDispatcher.fire(event, data);
        }
    }

    fireValueChanged(eventType: string, newValue?: unknown, oldValue?: unknown) {
        this.fireTargetValueChanged(this, eventType, newValue, oldValue);
    }

    fireTargetValueChanged(target: Object, eventType: string, newValue?: unknown, oldValue?: unknown) {
        if (!this._suppressEvents) {
            let event = this._event;

            event.target = target || this;
            event.value = newValue;
            event.oldValue = oldValue;
            this.fire(eventType, event);
        }
    }
}
