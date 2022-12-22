/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {EventHandler, IEventObject} from "./EventableObject";

interface IEventListenerItem {
    name: string;
    handler: EventHandler;
    target?: Object;
}

const EVENT_DELIMITER = ' ';
const NAME_DELIMITER = '.';
const DEFAULT_EVENT_NAME = '';

/**
 * The callback to handle next animation frame.
 * @callback EventsDispatcher~EventHandler
 * @memberOf StockChartX
 */

/**
 * Represent events dispatcher that manages events subscriptions.
 * @constructor EventsDispatcher
 * @memberOf StockChartX
 */
export class EventsDispatcher {
    private _listeners: {[key: string]: IEventListenerItem[]} = {};

    /**
     * Subscribes to event(s).
     * @method on
     * @param {String} eventNames The event names to subscribe separated by space.
     * @param {Function} handler The event handler.
     * @param {Object} [target] The optional event target object (for internal use).
     * @memberOf EventsDispatcher#
     * @example
     * // Subscribe to 'click' event.
     *  obj.on('click', function() {});
     *
     *  // Subscribe to 'click' and 'doubleclick' events.
     *  obj.on('click doubleclick', function() {});
     *
     *  // Subscribe to 'click' event with 'my' namespace.
     *  obj.on('click.my', function() {});
     */
    on(eventNames: string, handler: EventHandler, target?: Object) {
        let events = eventNames.split(EVENT_DELIMITER);
        let listeners = this._listeners;

        for (let event of events) {
            if (!event)
                continue;

            let parts = event.split(NAME_DELIMITER),
                baseEvent = parts[0],
                name = parts[1] || DEFAULT_EVENT_NAME;

            if (!listeners[baseEvent])
                listeners[baseEvent] = [];

            let eventListeners = listeners[baseEvent];
            eventListeners.push({
                name: name,
                handler: handler,
                target: target
            });
        }
    }

    /**
     * Unsubscribes from event(s).
     * @method off
     * @param {String} eventNames The event names to unsubscribe.
     * @param {Object} [target] The optional target to unsubscribe from events with a given target.
     * @memberOf EventsDispatcher#
     * @example
     *  // Unsubscribe from 'click' event
     *  obj.off('click');
     *
     *  // Unsubscribe from 'click' event with 'my' namespace.
     *  obj.off('click.my');
     *
     *  // Unsubscribe from 'click' and 'doubleclick' events.
     *  obj.off('click doubleclick');
     *
     *  // Unsbuscribe from all events with a given target.
     *  obj.off(null, target);
     */
    off(eventNames: string, target?: Object) {
        let events = eventNames.split(EVENT_DELIMITER);

        for (let event of events) {
            if (!event)
                continue;

            let parts = event.split(NAME_DELIMITER),
                baseEvent = parts[0],
                name = parts[1] || DEFAULT_EVENT_NAME;

            if (baseEvent)
                this._off(baseEvent, name, target);
            else {
                let listeners = this._listeners;
                for (let key in listeners) {
                    if (listeners.hasOwnProperty(key))
                        this._off(key, name, target);
                }
            }
        }
    }

    private _off(baseEvent: string, name: string, target?: Object) {
        name = name || DEFAULT_EVENT_NAME;

        let eventListeners = <IEventListenerItem[]> this._listeners[baseEvent];
        if (eventListeners) {
            for (let i = 0; i < eventListeners.length; i++) {
                if ((eventListeners[i].name === name) && (!target || target === eventListeners[i].target)) {
                    eventListeners.splice(i, 1);
                    i--;
                }
            }
            if (eventListeners.length === 0)
                delete this._listeners[baseEvent];
        }
    }

    /**
     * Fires given event.
     * @method fire
     * @param {String} eventName The event name.
     * @param {Object} event The event object.
     * @memberOf EventsDispatcher#
     * @example
     *  obj.fire('click', {x: 10, y: 20});
     */
    fire(eventName: string, event?: IEventObject) {
        let eventListeners = <IEventListenerItem[]> this._listeners[eventName];

        if (eventListeners) {
            event = event || <IEventObject> {};
            event.type = eventName;
            for (let listener of eventListeners) {
                listener.handler(event);
            }
        }
    }
}
