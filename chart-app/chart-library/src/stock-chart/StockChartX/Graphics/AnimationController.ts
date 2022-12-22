/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Environment} from "../Environment";
import {Animation} from "./Animation";

window.requestAnimationFrame =
    window.requestAnimationFrame ||
    (window).webkitRequestAnimationFrame ||
    (window as ExtendedWindow).mozRequestAnimationFrame ||
    (window as ExtendedWindow).msRequestAnimationFrame;

interface ExtendedWindow extends Window {
    mozRequestAnimationFrame?:(callback: FrameRequestCallback) => number;
    msRequestAnimationFrame?:(callback: FrameRequestCallback) => number;

}

const ANIMATION_INTERVAL = 1000 / (Environment.isMobile ? 40 : 40);

/**
 * Represents global animations controller.
 * @namespace Animations
 */
export namespace AnimationController {
    /**
     * The array of animations to run.
     * @name _animations
     * @type Animation[]
     * @memberOf Animations
     * @private
     */
    export const _animations: Animation[] = [];

    /**
     * The previous animation start time.
     * @name _prevStartTime
     * @type number
     * @memberOf Animations
     * @private
     */
    export let _prevStartTime: number = Date.now();

    /**
     * Checks if there is at least one animation to run.
     * @method hasAnimationsToRun
     * @returns {boolean}
     * @memberOf Animations
     */
    export function hasAnimationsToRun(): boolean {
        return this._animations.length > 0;
    }

    /**
     * Checks if a given animation exists in the list of animations.
     * @method contains
     * @param {Animation} animation The animation.
     * @returns {boolean}
     * @memberOf Animations
     */
    export function contains(animation: Animation): boolean {
        let animations = this._animations;
        for (let item of animations) {
            if (item === animation)
                return true;
        }

        return false;
    }

    /**
     * Adds animation.
     * @method add
     * @param {Animation} animation The animation to be added.
     * @returns {boolean} True if animation has been added, false otherwise.
     * @memberOf Animations
     */
    export function add(animation: Animation): boolean {
        if (this.contains(animation))
            return false;

        let isStarted = this.hasAnimationsToRun();

        this._animations.push(animation);
        if (!isStarted)
            runAnimation();

        return true;
    }

    /**
     * Removes animation.
     * @method remove
     * @param {Animation} animation The animation to be removed.
     * @returns {boolean} True if animation has been removed, false otherwise.
     * @memberOf Animations
     */
    export function remove(animation: Animation): boolean {
        let animations = this._animations;

        for (let i = 0, count = animations.length; i < count; i++) {
            if (animations[i] === animation) {
                animations.splice(i, 1);

                return true;
            }
        }

        return false;
    }
}

function runAnimation() {
    requestAnimationFrame(handleAnimationFrame);
}

function handleAnimationFrame() {
    let controller = AnimationController;

    if ((Date.now() - controller._prevStartTime) >= ANIMATION_INTERVAL) {
        controller._prevStartTime = Date.now();
        let animations = controller._animations;
        for (let i = 0; i < animations.length; i++) {
            let animation = animations[i];

            animation.handleAnimationFrame();
            if (!animation.recurring) {
                animation.stop();
                i--;
            }
        }
    }
    if (controller.hasAnimationsToRun())
        runAnimation();
}
