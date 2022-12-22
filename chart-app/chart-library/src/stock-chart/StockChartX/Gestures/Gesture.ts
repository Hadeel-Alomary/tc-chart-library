/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

//
// MA compile typescript
import {IPoint} from "../Graphics/ChartPoint";
import {ChartPanel} from '../..';

export interface GestureEvent extends Event {
    detail: number;
    wheelDelta: number;
    scale: number;
    touches: {pageX:number, pageY:number}[];
}

export interface WindowEvent {
    pointerPosition: IPoint;
    evt: JQueryEventObject;
    stopPropagation: boolean;
    chartPanel?: ChartPanel
}

export const MouseEvent = {
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

export const TouchEvent = {
    START: 'touchstart',
    MOVE: 'touchmove',
    END: 'touchend'
};
Object.freeze(TouchEvent);

/**
 * The window mouse/touch event.
 * @typedef {} WindowEvent
 * @type {Object}
 * @property {Point} pointerPosition The current pointer position.
 * @property {JQueryEventObject} evt The jQuery event object.
 * @property {boolean} [stopPropagation] The flag that indicates whether bubbling of an event to parent elements should be stopped.
 * @memberOf StockChartX
 */


/**
 * Gesture state enumeration.
 * @enum {number}
 * @readonly
 * @memberOf StockChartX
 */
export const GestureState = {
    /** Gesture is not recognized. */
    NONE: 0,

    /** Gesture started. */
    STARTED: 1,

    /** Gesture continued. */
    CONTINUED: 2,

    /** Gesture finished. */
    FINISHED: 3
};
Object.freeze(GestureState);


export interface GestureConfig {
    handler?: GestureHandler;
    hitTest?: GestureHitTestHandler;
    context?: Object;
    button?: number;
}

export interface GestureHandler {
    (gesture: Gesture, event: WindowEvent): void;
}

export interface GestureHitTestHandler {
    (position: IPoint): boolean;
}

/**
 * The gesture handler function.
 * @callback Gesture~GestureHandler
 * @param {Gesture} gesture The gesture.
 * @param {WindowEvent} event The current event.
 * @memberOf StockChartX
 * @example
 *  var handler = function(gesture, event) {};
 */

/**
 * The gesture hit test function.
 * @callback Gesture~GestureHitTestHandler
 * @param {Point} position The pointer position.
 * @returns {boolean} The flag that indicates whether gesture should be processed.
 * @memberOf StockChartX
 * @example
 *  var hitTest = function(position) {
     *      return true;
     *  }
 */


/**
 * Represents abstract gesture.
 * @param {Object} [config] The configuration object.
 * @param {Gesture~GestureHandler} [config.handler] The function to handle gesture events.
 * @param {Gesture~GestureHitTestHandler} [config.hitTest] The hit test function.
 * @param {Object} [config.context] The execution context.
 * @param {Number} [config.button] The button to be used in gesture.
 * @constructor Gesture
 */
export class Gesture {
    /**
     * Gesture event handler
     * @name handler
     * @type {Gesture~GestureHandler}
     * @memberOf Gesture#
     */
    public handler: GestureHandler = null;

    /**
     * Hit test function.
     * @name hitTest
     * @type {Gesture~GestureHitTestHandler}
     * @memberOf Gesture#
     */
    public hitTest: GestureHitTestHandler = null;

    /**
     * The execution context.
     * @name context
     * @type {Object}
     * @memberOf Gesture#
     */
    public context: Object = null;

    /**
     * The mouse button that needs to be used in gesture.
     * @name button
     * @type {number}
     * @memberOf Gesture#
     */
    public button: number = null;

    /**
     * Current gesture state.
     * @name state
     * @type {number}
     * @memberOf Gesture#
     * @readonly
     */
    protected _state = GestureState.NONE;
    get state() {
        return this._state;
    }

    constructor(config: GestureConfig) {
        this.handler = config.handler;
        this.hitTest = config.hitTest;
        this.context = config.context;
        this.button = config.button;
    }

    /**
     * Handles event.
     * @method handleEvent
     * @param {WindowEvent} event The event object.
     * @returns {boolean} True if event was handled, false otherwise.
     * @memberOf Gesture#
     */
    handleEvent(event: WindowEvent): boolean {
        return false;
    }

    /**
     * Checks whether event's button conforms to gesture.
     * @method _checkButton
     * @param {WindowEvent} event The event object.
     * @returns {boolean}
     * @memberOf Gesture#
     * @private
     */
    protected _checkButton(event: WindowEvent): boolean {
        let button = this.button;

        return button == null ? true : event.evt.which == button;
    }

    /**
     * Checks whether gesture should process event at the specified pointer position.
     * @method _checkHit
     * @param {WindowEvent} event The event object.
     * @returns {boolean}
     * @memberOf Gesture#
     * @private
     */
    protected _checkHit(event: WindowEvent): boolean {
        if (event.evt.type === MouseEvent.LEAVE)
            return false;

        let hitTest = this.hitTest;
        if (hitTest) {
            return hitTest.call(this.context, event.pointerPosition);
        }

        return false;
    }

    /**
     * Invokes gesture handler.
     * @method _invokeHandler
     * @param {WindowEvent} event The current event.
     * @memberOf Gesture#
     * @private
     */
    protected _invokeHandler(event: WindowEvent) {
        let handler = this.handler;

        if (handler) {
            handler.call(this.context, this, event);
        }
    }

    /**
     * Checks if gesture is active (in STARTED or CONTINUED state).
     * @method isActive
     * @returns {boolean}
     * @memberOf Gesture#
     */
    isActive(): boolean {
        let state = this._state;

        return state === GestureState.STARTED ||
            state === GestureState.CONTINUED;
    }
}
