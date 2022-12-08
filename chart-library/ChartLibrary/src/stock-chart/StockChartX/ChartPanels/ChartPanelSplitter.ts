/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {FrameControl} from "../Controls/FrameControl";
import {ChartPanel} from "./ChartPanel";
import {Chart, ChartState} from "../Chart";
import {GestureArray} from "../Gestures/GestureArray";
import {MouseHoverGesture} from "../Gestures/MouseHoverGesture";
import {PanGesture} from "../Gestures/PanGesture";
import {GestureState, WindowEvent} from "../Gestures/Gesture";
import {IPoint} from "../Graphics/ChartPoint";
import {Rect} from "../Graphics/Rect";
import {Tc} from '../../../utils';
import {Config} from '../../../config/config';

const Class = {
    CONTAINER: 'scxPanelSplitter',
    HOVER: 'scxHover',
    MOVE: 'scxSplitterMove'
};

/**
 * Represents splitter between two chart panels.
 * @constructor ChartPanelSplitter
 */
export class ChartPanelSplitter extends FrameControl {
    _topPanel: ChartPanel;
    /**
     * The chart panel.
     * @name topPanel
     * @type {ChartPanel}
     * @readonly
     * @memberOf ChartPanelSplitter#
     */
    get topPanel(): ChartPanel {
        return this._topPanel;
    }

    _bottomPanel: ChartPanel;
    /**
     * The bottom chart panel.
     * @name bottomPanel
     * @type {ChartPanel}
     * @readonly
     * @memberOf ChartPanelSplitter#
     */
    get bottomPanel(): ChartPanel {
        return this._bottomPanel;
    }

    /**
     * Returns parent chart.
     * @name chart
     * @type {Chart}
     * @readonly
     * @memberOf ChartPanelSplitter#
     */
    get chart(): Chart {
        return this._topPanel && this._topPanel.chart;
    }

    /**
     * The index of splitter.
     * @name _index
     * @type {Number}
     * @memberOf ChartPanelSplitter#
     * @private
     */
    _index: number = null;

    private _isMoving: boolean = false;
    isThemeApplied: boolean = false;

    static getHeight(): number {
        return 1;
    }

    protected _initGestures(): GestureArray {

        if(Config.isElementBuild()) {
            return new GestureArray();
        }

        return new GestureArray([
            new MouseHoverGesture({
                handler: this._handleMouseHoverGesture,
                hoverEventEnabled: false
            }),
            new PanGesture({
                handler: this._handlePanGesture,
                horizontalMoveEnabled: false
            })
        ], this, this.hitTest);
    }

    private _handlePanGesture(gesture: PanGesture) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._isMoving = true;
                this.chart.state = ChartState.RESIZING_PANELS;
                this._startMove();
                break;
            case GestureState.CONTINUED:
                if (this.move(gesture.moveOffset.y)) {
                    this.chart.updateSplitter(this);
                }
                break;
            case GestureState.FINISHED:
                this._isMoving = false;
                this.chart.state = ChartState.NORMAL;
                break;
        }
    }

    private _handleMouseHoverGesture(gesture: MouseHoverGesture, event: WindowEvent) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._startMove();
                break;
            case GestureState.FINISHED:
                this._stopMove();
                this.chart.crossHair.setPosition(event.pointerPosition, true);
                break;
        }
    }

    private _startMove() {
        this.chart.rootDiv.addClass(Class.MOVE);
        this.rootDiv.addClass(Class.HOVER);
        this._applyTheme(true);

        this.chart.crossHair.hide();
    }

    private _stopMove() {
        this.chart.rootDiv.removeClass(Class.MOVE);
        this.rootDiv.removeClass(Class.HOVER);
        this._applyTheme(false);

        this.chart.crossHair.show();
    }

    private _applyTheme(isHovered: boolean) {
        let theme = this.chart.theme.splitter,
            color = isHovered ? theme.hoverFillColor : theme.fillColor;

        this.rootDiv.css('background-color', color);
        this.isThemeApplied = true;
    }

    /**
     * Moves splitter onto a given offset.
     * @method move
     * @param {Number} offset The offset in pixels.
     * @returns True if move was applied, otherwise false.
     * @memberOf ChartPanelSplitter#
     */
    move(offset: number): boolean {
        if (offset === 0)
            return false;

        let topPanel = this._topPanel,
            bottomPanel = this._bottomPanel,
            chart = topPanel.chart,
            topPanelNewHeight = topPanel.frame.height + offset,
            panelsHeight = chart.chartPanelsContainer.getTotalPanelsHeight(),
            topPanelNewRatio = topPanelNewHeight / panelsHeight,
            ratioDiff = topPanel.heightRatio - topPanelNewRatio,
            bottomPanelNewRatio = bottomPanel.heightRatio + ratioDiff;

        if (topPanelNewRatio < topPanel.minHeightRatio ||
            topPanelNewRatio > topPanel.maxHeightRatio ||
            bottomPanelNewRatio < bottomPanel.minHeightRatio ||
            bottomPanelNewRatio > bottomPanel.maxHeightRatio)
            return false;

        topPanel.heightRatio = topPanelNewRatio;
        bottomPanel.heightRatio = bottomPanelNewRatio;

        return true;
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        return this._isMoving
            ? true
            : super.hitTest(point);
    }

    protected _createRootDiv(): JQuery {
        let parentDiv = this.chart.chartPanelsContainer.rootDiv;

        return parentDiv.scxAppend('div', Class.CONTAINER);
    }

    /**
     * @inheritdoc
     */
    layout(frame: Rect) {
        super.layout(frame);

        this.frame.top += this._topPanel.chartPanelsContainer.frame.top;

        if (!this.isThemeApplied)
            this._applyTheme(false);
    }
}
