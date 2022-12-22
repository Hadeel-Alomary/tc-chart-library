/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Gesture, GestureConfig, GestureState, MouseEvent, WindowEvent} from './Gesture';

export interface IClickGestureConfig extends GestureConfig {

}

/**
 * Represents click gesture.
 * @param {Object} [config] The configuration object.
 * @constructor ClickGesture
 * @augments Gesture
 */
export class ClickGesture extends Gesture {
    private _isTouch: boolean = false;

    constructor(config: IClickGestureConfig) {
        super(config);
    }

    /**
     * @override
     */
    handleEvent(event: WindowEvent): boolean {
        return this.desktopAndMobileHandleEvent(event);
    }

    private desktopAndMobileHandleEvent(event: WindowEvent): boolean {

        switch (event.evt.type) {
            case MouseEvent.CLICK:
                if (!this._isTouch && this._finishGesture(event)) {
                    return true;
                }
                break;
        }

        return false;
    }

    private _finishGesture(event: WindowEvent): boolean {
        if (this._checkButton(event) && this._checkHit(event)) {
            this._state = GestureState.FINISHED;
            this._invokeHandler(event);

            return true;
        }
    }
}
