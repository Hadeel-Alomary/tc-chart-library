/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Gesture, GestureHitTestHandler, WindowEvent} from "./Gesture";
import {BrowserUtils} from '../../../utils';


/**
 * Represents a collection of gestures
 * @param {Gesture | Gesture[]} gestures The gesture or array of gestures to add into the collection.
 * @param {Object} [context] Function's 'this' context.
 * @param {Gesture~GestureHitTestHandler} [hitTestFunc] The hit test function.
 * @constructor GestureArray
 */
export class GestureArray {
    private _gestures: Gesture[] = [];
    /**
     * An array of gestures.
     * @name gestures
     * @type {Gesture[]}
     * @memberOf GestureArray#
     */
    get gestures(): Gesture[] {
        return this._gestures;
    }

    constructor(gestures?: Gesture | Gesture[], context?: Object, hitTestFunc?: GestureHitTestHandler) {
        if (!gestures)
            return;

        this.add(gestures);

        if (context || hitTestFunc) {
            let items = this.gestures;

            for (let gesture of items) {
                if (!gesture.context)
                    gesture.context = context;
                if (!gesture.hitTest)
                    gesture.hitTest = hitTestFunc;
            }
        }
    }

    /**
     * Adds gesture(s) into the collection.
     * @method add
     * @param {Gesture | Gesture[]} gesture The gesture or an array of gestures to add into the collection.
     * @memberOf GestureArray#
     * @see [remove]{@linkcode GestureArray#remove}
     */
    add(gesture: Gesture | Gesture[]) {
        if (!gesture)
            return;

        if (Array.isArray(gesture)) {
            for (let item of gesture) {
                this.add(item);
            }
        } else {
            if (!(gesture instanceof Gesture))
                throw new TypeError('Item must be an instance of Gesture.');

            for (let item of this._gestures) {
                if (item === gesture) {
                    return;
                }
            }

            this._gestures.push(gesture);
        }
    }

    /**
     * Removes gesture(s) from the collection.
     * @method remove
     * @param {Gesture | Gesture[]} gesture The gesture or an array of gestures to remove.
     * @memberOf GestureArray#
     * @see [add]{@linkcode GestureArray#add}
     */
    remove(gesture: Gesture | Gesture[]) {
        if (Array.isArray(gesture)) {
            for (let item of gesture) {
                this.remove(item);
            }
        } else {
            let gestures = this._gestures;

            for (let i = 0; i < gestures.length; i++) {
                if (gestures[i] === gesture) {
                    gestures.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * Iterates through inner gestures and passes event to it. Breaks if event is handled by gesture.
     * @method handleEvent
     * @param {WindowEvent} event The event object.
     * @returns {boolean} True if event was handled by some gesture, false otherwise.
     * @memberOf GestureArray#
     */
    handleEvent(event: WindowEvent): boolean {
        let isHandled = false;

        for (let gesture of this._gestures) {
            if (gesture.handleEvent(event)){
                isHandled = true;
                // MA for the mobile, stop when handing the first "gesture" and don't continue afterwards.
                // This is needed to separate, for example, PanGesture from interfering with MouseWheelGesture.
                if(BrowserUtils.isMobile()) {
                    break;
                }
            }
        }

        return isHandled;
    }
}
