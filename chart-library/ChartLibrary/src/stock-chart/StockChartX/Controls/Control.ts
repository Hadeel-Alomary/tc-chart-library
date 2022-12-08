/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Component, IComponent} from "./Component";
import {IPoint} from "../Graphics/ChartPoint";
import {Rect} from "../Graphics/Rect";
import {WindowEvent} from "../Gestures/Gesture";
import {GestureArray} from "../Gestures/GestureArray";

export interface IControl extends IComponent {
    hitTest(point: IPoint): boolean;

    layout(frame: Rect): void;

    handleEvent(event: WindowEvent): boolean;

    draw(): void;
}

/**
 * Represents abstract chart control.
 * @constructor Control
 * @abstract
 * @augments Component
 */
export abstract class Control extends Component implements IControl {
    /**
     * The collection of gestures.
     * @name _gestures
     * @type {GestureArray}
     * @memberOf Control#
     * @private
     */
    private _gestures: GestureArray;


    constructor() {
        super();

        this._gestures = this._initGestures() || new GestureArray();
    }

    protected _initGestures(): GestureArray {
        return null;
    }

    /**
     * Checks if a given point belongs to a frame rectangle.
     * @method hitTest
     * @param {Point} point The point.
     * @returns {boolean}
     * @memberOf Control#
     */
    hitTest(point: IPoint): boolean {
        return false;
    }

    /**
     * Layouts controls.
     * @method layout
     * @param {Rect} frame The frame rectangle related to parent container.
     * @memberOf Control#
     */
    layout(frame: Rect) {
    }

    /**
     * Handles event.
     * @method handleEvent
     * @param {WindowEvent} event The event object.
     * @returns {boolean}
     * @memberOf Control#
     */
    handleEvent(event: WindowEvent): boolean {
        return this._gestures.handleEvent(event);
    }

    /**
     * Draws control.
     * @method draw
     * @memberOf Control#
     */
    draw() {
    }

    /**
     * @inheritdoc
     */
    destroy() {
    }
}
