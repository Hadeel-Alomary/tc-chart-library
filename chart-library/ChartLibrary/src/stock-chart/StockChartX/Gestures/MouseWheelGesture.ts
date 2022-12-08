/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {Gesture, GestureConfig, GestureEvent, GestureState, WindowEvent, MouseEvent, TouchEvent} from "./Gesture";
import {Animation} from "../Graphics/Animation";
import {BrowserUtils, Tc} from '../../../utils';

export interface IMouseWheelGestureConfig extends GestureConfig {

}

/**
     * Represents mouse wheel gesture.
     * @param {Object} [config] The configuration object
 * @constructor MouseWheelGesture
 * @augments Gesture
     */
export class MouseWheelGesture extends Gesture {
        /**
         * The wheel delta.
         * @name delta
         * @type {number}
         * @readonly
     * @memberOf MouseWheelGesture#
         */
        public delta: number = 0;
        public length: number = 0;

        private _prevLength: number = 0;
        private _lengthThreshold: number = 5;
        private _animation: Animation = new Animation({
            context: this,
            recurring: false
        });

        public scale:number;
        public middlePoint:{x:number,y:number};


    constructor(config: IMouseWheelGestureConfig) {
            super(config);
        }

        /**
         * @override
         */
        handleEvent(event: WindowEvent): boolean {
            return BrowserUtils.isDesktop() ? this.desktopHandleEvent(event) : this.mobileHandleEvent(event);
        }

        private desktopHandleEvent(event: WindowEvent): boolean {
            let evt = event.evt,
            origEvent = evt.originalEvent as GestureEvent;


            switch (evt.type) {
                case MouseEvent.WHEEL:
                case MouseEvent.SCROLL:
                    if (this._checkHit(event)) {
                        if (evt.type == MouseEvent.SCROLL)
                            this.delta = origEvent.detail > 0 ? 1 : -1;
                        else
                            this.delta = origEvent.wheelDelta < 0 ? 1 : -1;
                        this._state = GestureState.FINISHED;
                        this._invokeHandler(event);

                        return true;
                    }
                    break;
            }

            return false;
        }


        private mobileHandleEvent(event: WindowEvent): boolean {
            let evt = event.evt,
                origEvent = evt.originalEvent as GestureEvent;


            switch (evt.type) {
                case TouchEvent.START:
                    if(this._state == GestureState.STARTED) {
                        this._state = GestureState.FINISHED;
                    }
                    if (this._checkHit(event) && !this.isActive() && origEvent.touches.length === 2) {
                        this.middlePoint = this.calculateMiddlePoint(origEvent.touches);
                        this._prevLength = MouseWheelGesture._calculateLength(origEvent.touches);

                        this._state = GestureState.STARTED;
                        return true;
                    }
                    break;
                case TouchEvent.MOVE:
                    if (this.isActive()) {
                        let touches = origEvent.touches;
                        if (touches.length !== 2)
                            return true;

                        let middlePoint =  this.calculateMiddlePoint(origEvent.touches);
                        let length = MouseWheelGesture._calculateLength(touches);

                        let offset = length - this._prevLength,
                            isSignChanged = (this._prevLength > 0 && length < 0) || (this._prevLength < 0 && length > 0),
                            threshold = (isSignChanged ? 2 : 1) * this._lengthThreshold;
                        if (Math.abs(offset) >= threshold) {
                            this.delta = offset < 0 ? 1 : -1;
                            this.length = offset;
                            this._state = GestureState.CONTINUED;


                            let animation = this._animation;
                            if (!animation.started) {
                                let e = $.extend(true, {}, event);
                                this.scale = length / this._prevLength;
                                this._prevLength = length;
                                this.middlePoint = middlePoint;
                                animation.callback = function () {
                                    this._invokeHandler(e);
                                };
                                animation.start();
                            }
                        }

                        return true;
                    }
                    break;
                case TouchEvent.END:
                    if (this.isActive()) {
                        if(origEvent.touches.length == 0){
                            this._state = GestureState.FINISHED;
                        }
                        return true;
                    }
                    break;
            }

            return false;
        }

    private static _calculateLength(touches: {pageX:number, pageY:number}[]) {
            let dx = touches[0].pageX - touches[1].pageX,
                dy = touches[0].pageY - touches[1].pageY,
                len = Math.sqrt(dx * dx + dy * dy);
            return len;
        }


    private calculateMiddlePoint(touches: { pageX: number, pageY: number }[]): { x: number, y: number } {
        let point0 = touches[0];
        let point1 = touches[1];

        let x = (point0.pageX + point1.pageX) / 2;
        let y = (point0.pageY + point1.pageY) / 2;

        return {x: x, y: y};
    }
}
