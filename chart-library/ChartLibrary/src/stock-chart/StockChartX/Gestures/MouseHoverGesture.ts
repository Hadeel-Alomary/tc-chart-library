/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {Gesture, GestureConfig, GestureState, WindowEvent, MouseEvent, TouchEvent} from "./Gesture";
import {BrowserUtils} from '../../../utils';

export interface IMouseHoverGestureConfig extends GestureConfig {
        enterEventEnabled?: boolean;
        hoverEventEnabled?: boolean;
        leaveEventEnabled?: boolean;
}

/**
     * Represents mouse hover gesture.
     * @param {Object} [config] The configuration object.
     * @param {Boolean} [config.enterEventEnabled = true] The flag that indicates whether mouse enter event should be raised.
     * @param {Boolean} [config.hoverEventEnabled = true] The flag that indicates whether mouse hover event should be raised.
     * @param {Boolean} [config.leaveEventEnabled = true] The flag that indicates whether mouse leave event should be raise.
 * @constructor MouseHoverGesture
 * @augments Gesture
     */
export class MouseHoverGesture extends Gesture {
        /**
         * The flag that indicates whether mouse enter event should be raised.
         * @name enterEnabled
         * @type {boolean}
     * @memberOf MouseHoverGesture#
     * @see [hoverEnabled]{@linkcode MouseHoverGesture#hoverEnabled}
     * @see [leaveEnabled]{@linkcode MouseHoverGesture#leaveEnabled}
         */
        public enterEnabled: boolean = true;

        /**
         * The flag that indicates whether mouse hover event should be raised.
         * @name hoverEnabled
         * @type {boolean}
     * @memberOf MouseHoverGesture#
     * @see [enterEnabled]{@linkcode MouseHoverGesture#enterEnabled}
     * @see [leaveEnabled]{@linkcode MouseHoverGesture#leaveEnabled}
         */
        public hoverEnabled = true;

        /**
         * The flag that indicates whether mouse leave event should be raised.
         * @name leaveEnabled
         * @type {boolean}
     * @memberOf MouseHoverGesture#
     * @see [enterEnabled]{@linkcode MouseHoverGesture#enterEnabled}
     * @see [hoverEnabled]{@linkcode MouseHoverGesture#hoverEnabled}
         */
        public leaveEnabled = true;

        constructor(config: IMouseHoverGestureConfig) {
            super(config);
            if (config.enterEventEnabled != null)
                this.enterEnabled = !!config.enterEventEnabled;
            if (config.hoverEventEnabled != null)
                this.hoverEnabled = !!config.hoverEventEnabled;
            if (config.leaveEventEnabled != null)
                this.leaveEnabled = !!config.leaveEventEnabled;

        }

        /**
         * @override
         */
        handleEvent(event: WindowEvent): boolean {
            return BrowserUtils.isDesktop() ? this.desktopHandleEvent(event) : this.mobileHandleEvent(event);
        }

        private desktopHandleEvent(event: WindowEvent): boolean {
            switch (event.evt.type) {
                case MouseEvent.ENTER:
                case MouseEvent.MOVE:
                {
                    if (this._checkHit(event)) {
                        if (this.isActive()) {
                            this._state = GestureState.CONTINUED;
                            if (this.hoverEnabled)
                                this._invokeHandler(event);
                        } else {
                            this._state = GestureState.STARTED;
                            if (this.enterEnabled)
                                this._invokeHandler(event);
                        }

                        return true;
                    } else if (this.isActive()) {
                        this._state = GestureState.FINISHED;
                        if (this.leaveEnabled)
                            this._invokeHandler(event);

                        return true;
                    }

                    break;
                }
                case MouseEvent.LEAVE:
                {
                    if (this.isActive()) {
                        this._state = GestureState.FINISHED;
                        if (this.leaveEnabled)
                            this._invokeHandler(event);

                        return true;
                    }
                    break;
                }
            }

            return false;
        }

        private mobileHandleEvent(event: WindowEvent): boolean {
            return false; // no hover effect exists for mobile
        }

}
