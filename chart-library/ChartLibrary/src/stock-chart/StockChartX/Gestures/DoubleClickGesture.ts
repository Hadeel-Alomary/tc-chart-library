/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {Gesture, GestureConfig, GestureState, WindowEvent, MouseEvent, TouchEvent} from "./Gesture";
import {IPoint} from "../Graphics/ChartPoint";
import {BrowserUtils} from '../../../utils';

export interface IDoubleClickGestureConfig extends GestureConfig {

}

/**
     * Represents double click gesture.
     * @param {Object} [config] The configuration object.
 * @constructor DoubleClickGesture
 * @augments Gesture
     */
export class DoubleClickGesture extends Gesture {
        private _startDate: Date = null;
        private _maxClickSeparationInterval: number = 1500;
        private _minClickSeparationInterval: number = 100;
        private _resumeDoubleClickDetectionTime:Date;

        constructor(config: IDoubleClickGestureConfig) {
            super(config);
        }

        /**
         * @override
         */
        handleEvent(event: WindowEvent): boolean {
            return BrowserUtils.isDesktop() ? this.desktopHandleEvent(event) : this.mobileHandleEvent(event);
        }

        private desktopHandleEvent(event: WindowEvent): boolean {
            switch (event.evt.type) {
                case MouseEvent.DOUBLE_CLICK:
                    if (this._finishGesture(event))
                        return true;
                    break;
            }

            return false;
        }

        private mobileHandleEvent(event: WindowEvent): boolean {
            switch (event.evt.type) {
                case MouseEvent.CLICK:
                    if(this._resumeDoubleClickDetectionTime && (new Date().getTime() < this._resumeDoubleClickDetectionTime.getTime())) {
                        return false; // ignoring the click
                    }
                    if(this._startDate == null) {
                        this._startDate = new Date();
                    } else if((new Date().getTime() - this._startDate.getTime()) < this._minClickSeparationInterval) {
                        return false; // ignore very fast second click
                    } else if((new Date().getTime() - this._startDate.getTime()) > this._maxClickSeparationInterval) {
                        this._startDate = new Date(); // far away click, consider it a new click
                    } else {
                        this._startDate = null;
                        this._resumeDoubleClickDetectionTime = new Date();
                        this._resumeDoubleClickDetectionTime.setSeconds(this._resumeDoubleClickDetectionTime.getSeconds() + 1); // set it to one second in the future
                        if (this._finishGesture(event)){
                            return true;
                        }
                    }
                    break;
            }

            return false;
        }

        private _finishGesture(event: WindowEvent): boolean {
            if (this._checkButton(event) && this._checkHit(event)) {
                this._state = GestureState.FINISHED;
                this._invokeHandler(event);
                event.stopPropagation = true;

                return true;
            }

            return false;
        }
}
