/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Gesture, GestureConfig, GestureState, WindowEvent, MouseEvent, TouchEvent, GestureEvent} from './Gesture';
import {BrowserUtils} from '../../../utils';

export interface IContextMenuGestureConfig extends GestureConfig {

}

/**
 * Represents context menu (right mouse click) gesture.
 * @param {Object} [config] The configuration object.
 * @constructor ContextMenuGesture
 * @augments Gesture
 */
export class ContextMenuGesture extends Gesture {

    constructor(config?: IContextMenuGestureConfig) {
        super(config);
    }

    /**
     * @override
     */
    handleEvent(event: WindowEvent): boolean {
        return BrowserUtils.isMobile() ? this.mobileHandleEvent(event) : this.desktopHandleEvent(event);
    }

    private desktopHandleEvent(event: WindowEvent) {
        switch (event.evt.type) {
            case MouseEvent.CONTEXT_MENU:
                if (this._finishGesture(event)) {
                    return true;
                }
                break;
        }
        return false;
    }

    private longTouchTimeout: number;
    private isContextMenuShown: boolean;

    private mobileHandleEvent(event: WindowEvent) {

        switch (event.evt.type) {

            case TouchEvent.START:

                this.isContextMenuShown = false;

                if (this._checkHit(event)) {
                    this.longTouchTimeout = window.setTimeout(() => {
                        this._state = GestureState.STARTED;

                        let evt = event.evt, origEvent = evt.originalEvent as GestureEvent;
                        event.evt.pageX = origEvent.touches[0].pageX;
                        event.evt.pageY = origEvent.touches[0].pageY;

                        if (this._finishGesture(event)) {
                            this.isContextMenuShown = true;
                            return true;
                        }

                    }, 500);
                }

                break;

            case TouchEvent.MOVE:
                this._state = GestureState.CONTINUED;
            case TouchEvent.END:
                if (this.longTouchTimeout) {
                    clearTimeout(this.longTouchTimeout);
                    this.longTouchTimeout = null;
                }

                if (this.isContextMenuShown) {
                    event.evt.stopPropagation();
                    event.evt.preventDefault();
                }
                break;
        }

        return false;
    }

    private _finishGesture(event: WindowEvent): boolean {
        if (this._checkHit(event) || this.isActive()) {
            this._state = GestureState.FINISHED;
            this._invokeHandler(event);

            return true;
        }
    }
}
