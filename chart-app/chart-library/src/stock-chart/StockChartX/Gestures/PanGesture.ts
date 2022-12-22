/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Gesture, GestureConfig, GestureState, WindowEvent, TouchEvent, MouseEvent} from "./Gesture";
import {IPoint} from "../Graphics/ChartPoint";
import {JsUtil} from "../Utils/JsUtil";
import {Animation} from "../Graphics/Animation";
import {BrowserUtils, Tc} from '../../../utils';
import {ISwipeObject, Swipe} from '../Graphics/Swipe';


export interface SwipeHandler {
    (event: ISwipeObject): void;
}

export interface IPanGestureConfig extends GestureConfig {
        minMoveDistance?: number;
        horizontalMoveEnabled?: boolean;
        verticalMoveEnabled?: boolean;
        swipeHandler?: SwipeHandler;
}

/**
     * Represents pan gesture.
     * @param {Object} [config] The configuration object.
     * @param {Number} [config.minMoveDistance = 1] The min move distance. Gesture raises move events only if pointer moved more than this distance.
     * @param {Boolean} [config.horizontalMoveEnabled = true] The flag that indicates whether horizontal move is enabled.
     * @param {Boolean} [config.verticalMoveEnabled = true] The flag that indicates whether vertical move is enabled.
 * @constructor PanGesture
 * @augments Gesture
     */
export class PanGesture extends Gesture {
        /**
         * The current move offset in pixels.
         * @name moveOffset
     * @type {Point}
         * @readonly
     * @memberOf PanGesture#
         */
        moveOffset: IPoint = {
            x: 0,
            y: 0
        };

    public swipeHandler: SwipeHandler = null;

        /**
         * Gets/Sets min move distance. Move events are raised only if pointer moved more than this value.
         * @name minMoveDistance
         * @type {number}
     * @memberOf PanGesture#
         */
        private _minMoveDistance: number = 1;
        get minMoveDistance(): number {
            return this._minMoveDistance;
        }

        set minMoveDistance(value: number) {
            if (!JsUtil.isPositiveNumber(value))
                throw new Error('minMoveDistance must be a positive number.');

            this._minMoveDistance = value;
        }

        /**
         * Gets/Sets flag that indicates whether horizontal move is enabled.
         * @name horizontalMoveEnabled
         * @type {boolean}
     * @memberOf PanGesture#
     * @see [verticalMoveEnabled]{@linkcode PanGesture#verticalMoveEnabled}
         */
        public horizontalMoveEnabled: boolean = true;

        /**
         * Gets/Sets flag that indicates whether vertical move is enabled.
         * @name verticalMoveEnabled
         * @type {boolean}
     * @memberOf PanGesture#
     * @see [horizontalMoveEnabled]{@linkcode PanGesture#horizontalMoveEnabled}
         */
        public verticalMoveEnabled: boolean = true;


        /**
         * The previously handled point.
         * @name _prevPoint
     * @type {Point}
     * @memberOf PanGesture#
         * @private
         */
        private _prevPoint: IPoint = null;

        /**
         * The last received point.
         * @name _lastPoint
     * @type {Point}
     * @memberOf PanGesture#
         * @private
         */
        private _lastPoint: IPoint = null;

        private _animation: Animation = new Animation({
            context: this,
            recurring: false
        });
        private _swipe: Swipe = new Swipe();
        private _which: number = 0;

        constructor(config: IPanGestureConfig) {
            super(config);
            if (config.minMoveDistance != null)
                this.minMoveDistance = config.minMoveDistance;
            if (config.horizontalMoveEnabled != null)
                this.horizontalMoveEnabled = !!config.horizontalMoveEnabled;
            if (config.verticalMoveEnabled)
                this.verticalMoveEnabled = !!config.verticalMoveEnabled;
            if (config.swipeHandler) {
                this.swipeHandler = config.swipeHandler;
            }
        }

        /**
         * @override
         */
        handleEvent(event: WindowEvent): boolean {
            return BrowserUtils.isDesktop() ? this.desktopHandleEvent(event) : this.mobileHandleEvent(event);
        }

        private desktopHandleEvent(event: WindowEvent): boolean {
            let pos = this._lastPoint = {x: event.pointerPosition.x, y: event.pointerPosition.y};

            switch (event.evt.type) {
                case MouseEvent.DOWN: {
                    if (this._checkButton(event) && this._checkHit(event)) {
                        this._prevPoint = {x: pos.x, y: pos.y};
                        this._which = event.evt.type === TouchEvent.START ? 1 : event.evt.which;
                    this._state = GestureState.STARTED;
                        this._invokeHandler(event);

                        return true;
                    }
                    break;
                }
                case MouseEvent.MOVE: {
                    let offset = this.moveOffset;
                    if (this.isActive()) {
                        offset.x = pos.x - this._prevPoint.x;
                        offset.y = pos.y - this._prevPoint.y;

                        let minMoveDistance = this.minMoveDistance;
                        //noinspection JSSuspiciousNameCombination
                        if ((this.horizontalMoveEnabled && Math.abs(offset.x) >= minMoveDistance) ||
                            (this.verticalMoveEnabled && Math.abs(offset.y) >= minMoveDistance)) {

                            let animation = this._animation;

                            this._state = GestureState.CONTINUED;
                            if (!animation.started) {
                                let e = $.extend(true, {}, event);
                                animation.callback = function () {
                                    this._prevPoint = this._lastPoint;
                                    e.evt.which = this._which;
                                    this._invokeHandler(e);
                                };
                                animation.start();
                            }

                        }

                        return true;
                    }
                    break;
                }
                case MouseEvent.UP:
                case MouseEvent.LEAVE:{
                    if (this.isActive()) {
                        this._animation.stop();

                        this._state = GestureState.FINISHED;
                        this._invokeHandler(event);

                        return true;
                    }
                    break;
                }
            }

            return false;
        }

        private mobileHandleEvent(event: WindowEvent): boolean {
            let pos = this._lastPoint = {x: event.pointerPosition.x, y: event.pointerPosition.y};

            switch (event.evt.type) {
                case TouchEvent.START: {
                    if (this._checkButton(event) && this._checkHit(event)) {
                        //HA : If we start event at the time when swipe animation is not finished yet , then terminate it .
                        this._swipe.terminate();
                        this._prevPoint = {x: pos.x, y: pos.y};
                        this._which = event.evt.type === TouchEvent.START ? 1 : event.evt.which;
                        this._state = GestureState.STARTED;
                        this._invokeHandler(event);

                        return true;
                    }
                    break;
                }
                case TouchEvent.MOVE: {
                    let offset = this.moveOffset;
                    if (this.isActive()) {

                        // MA 1.5 is a factor to speed up panning on the mobile devices
                        offset.x = 1.5 * (pos.x - this._prevPoint.x);
                        offset.y = 1.5 * (pos.y - this._prevPoint.y);

                        let minMoveDistance = this.minMoveDistance;
                        //noinspection JSSuspiciousNameCombination
                        if ((this.horizontalMoveEnabled && Math.abs(offset.x) >= minMoveDistance) ||
                            (this.verticalMoveEnabled && Math.abs(offset.y) >= minMoveDistance)) {

                            this._swipe.handleTouchedPoint(event, {caller:this.context, handler:this.swipeHandler});
                            let animation = this._animation;

                            this._state = GestureState.CONTINUED;
                            if (!animation.started) {
                                let e = $.extend(true, {}, event);
                                animation.callback = function () {
                                    this._prevPoint = this._lastPoint;
                                    e.evt.which = this._which;
                                    this._invokeHandler(e);
                                };
                                animation.start();
                            }

                        }

                        return true;
                    }
                    break;
                }
                case TouchEvent.END: {
                    if (this.isActive()) {
                        this._animation.stop();
                        this._state = GestureState.FINISHED;
                        this._invokeHandler(event);
                        this._swipe.startIfNeeded(event);
                        return true;
                    }
                    break;
                }
            }

            return false;
        }
}
