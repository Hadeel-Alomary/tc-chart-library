/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {Control, IControl} from "./Control";
import {Rect} from "../Graphics/Rect";
import {IPoint} from "../Graphics/ChartPoint";
import {Geometry} from "../Graphics/Geometry";

export interface IFrameControl extends IControl {
    rootDiv: JQuery;
    frame: Rect;
}

/**
 * Represents abstract control with frame.
 * @constructor FrameControl
 * @augments Control
 * @abstract
 */
export abstract class FrameControl extends Control implements IFrameControl {
    protected _rootDiv: JQuery;
    /**
     * The root div element.
     * @name rootDiv
     * @type {jQuery}
     * @readonly
     * @memberOf FrameControl#
     */
    get rootDiv(): JQuery {
        return this._rootDiv;
    }

    private _frame = new Rect();
    /**
     * Returns frame rectangle.
     * @name frame
     * @type {Rect}
     * @readonly
     * @memberOf FrameControl#
     */
    get frame(): Rect {
        return this._frame;
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        return Geometry.isPointInsideOrNearRect(point, this._frame);
    }

    /**
     * @inheritdoc
     */
    layout(frame: Rect) {
        if (!this._rootDiv) {
            this._rootDiv = this._createRootDiv();
        }

        this._rootDiv.scxFrame(frame);
        this._frame.copyFrom(frame);
    }

    // noinspection JSMethodCanBeStatic
    protected _createRootDiv(): JQuery {
        return null;
    }

    /**
     * @inheritdoc
     */
    destroy() {
        if (this._rootDiv) {
            this._rootDiv.remove();
            this._rootDiv = null;
        }

        super.destroy();
    }
}
