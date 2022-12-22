/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {JsUtil} from "../Utils/JsUtil";
import {AnimationController} from "./AnimationController";

export interface IAnimationFrameCallback {
    (): void;
}


export interface IAnimationConfig {
    context?: Object;
    recurring?: boolean;
    callback?: IAnimationFrameCallback;
}

/**
 * The callback to handle next animation frame.
 * @callback Animation~AnimationFrameCallback
 * @memberOf StockChartX
 */

/**
 * Represents basic animation.
 * @param {object} [config] The configuration object
 * @param {Object} [config.context] 'This' context.
 * @param {boolean} [config.recurring = true] The flag that indicates whether this is a recurring animation.
 * @param {Animation~AnimationFrameCallback} [config.callback] The animation frame callback.
 * @constructor Animation
 */
export class Animation {
    private _callback: IAnimationFrameCallback;
    /**
     * The animation frame callback.
     * @name callback
     * @type {Animation~AnimationFrameCallback}
     * @memberOf Animation#
     */
    get callback(): IAnimationFrameCallback {
        return this._callback;
    }

    set callback(value: IAnimationFrameCallback) {
        if (value != null && !JsUtil.isFunction(value))
            throw new TypeError("Callback must be a function.");

        this._callback = value;
    }

    /**
     * The flag that indicates whether animation is started.
     * @name started
     * @type {boolean}
     * @readonly
     * @memberOf Animation#
     */
    private _isStarted = false;

    get started(): boolean {
        return this._isStarted;
    }

    /**
     * 'This' context object.
     * @name context
     * @type {Object}
     * @memberOf Animation#
     */
    context: Object = null;

    /**
     * The flag that indicates whether this is a recurring animation.
     * @name recurring
     * @type {boolean}
     * @memberOf Animation#
     */
    private _recurring = true;
    get recurring(): boolean {
        return this._recurring;
    }

    set recurring(value: boolean) {
        this._recurring = value;
    }

    constructor(config?: IAnimationConfig) {
        if (config) {
            this.context = config.context;
            if (config.recurring != null)
                this.recurring = config.recurring;
            this.callback = config.callback;
        }
    }

    /**
     * Starts animation.
     * @method start
     * @returns {boolean} True if animation was started, false otherwise.
     * @memberOf Animation#
     * @see [stop]{@linkcode Animation#stop}
     */
    start(): boolean {
        if (!this.callback)
            throw new Error("Callback is not assigned.");
        if (this._isStarted)
            return false;

        if (AnimationController.add(this)) {
            this._isStarted = true;

            return true;
        }

        return false;
    }

    /**
     * Stops animation.
     * @name stop
     * @memberOf Animation#
     * @see [start]{@linkcode Animation#start}
     */
    stop() {
        AnimationController.remove(this);
        this._isStarted = false;
    }

    /**
     * Handles next animation frame.
     * For internal use only. It is called by AnimationController.
     * @name handleAnimationFrame
     * @memberOf Animation#
     */
    handleAnimationFrame() {
        this.callback.call(this.context);
    }
}
