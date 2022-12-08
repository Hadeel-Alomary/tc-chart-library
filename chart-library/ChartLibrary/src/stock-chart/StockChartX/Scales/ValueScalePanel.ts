/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {ValueScale} from "./ValueScale";
import {FrameControl} from "../Controls/FrameControl";
import {Chart, ChartEvent} from "../Chart";
import {ISize, Rect} from "../Graphics/Rect";

export interface IValueScalePanelConfig {
    valueScale: ValueScale;
    cssClass: string;
    visible?: boolean;
}

const CLASS_CONTAINER = "scxValueScale";

/**
 * Describes value scale panel on the chart.
 * @param {Object} config The configuration object.
 * @param {ValueScale} config.valueScale The parent value scale.
 * @param {String} config.cssClass The css class name of div element that holds value scale panel.
 * @param {Boolean} [config.visible] The flag that indicates whether panel is visible.
 * @constructor ValueScalePanel
 * @augments FrameControl
 */
export class ValueScalePanel extends FrameControl {
    private _valueScale: ValueScale;
    /**
     * The parent value scale.
     * @name valueScale
     * @type {ValueScale}
     * @readonly
     * @memberOf ValueScalePanel#
     */
    get valueScale(): ValueScale {
        return this._valueScale;
    }

    private _cssClass: string;
    /**
     * The css class name of div element that holds value scale panel.
     * @name cssClass
     * @type {String}
     * @readonly
     * @memberOf ValueScalePanel#
     */
    get cssClass(): string {
        return this._cssClass;
    }

    /**
     * The flag that indicates whether panel is visible.
     * @name visible
     * @type {boolean}
     * @memberOf ValueScalePanel#
     */
    private _isVisible: boolean = true;

    get visible(): boolean {
        return this._isVisible;
    }

    set visible(value: boolean) {
        this._isVisible = !!value;
    }

    /**
     * Return parent chart.
     * @name chart
     * @type {Chart}
     * @readonly
     * @memberOf ValueScalePanel#
     */
    get chart(): Chart {
        return this._valueScale && this._valueScale.chart;
    }

    get size(): ISize {
        let div = this.rootDiv;

        return div && div.scxSize();
    }

    get contentSize(): ISize {
        let div = this.rootDiv;

        return div && div.scxContentSize();
    }

    constructor(config: IValueScalePanelConfig) {
        super();

        if (!config)
            throw new Error("Config is not specified.");

        this._valueScale = config.valueScale;

        if (!config.cssClass)
            throw new Error("'config.cssClass' is not specified.");
        this._cssClass = config.cssClass;

        this._isVisible = config.visible != null ? !!config.visible : true;

        this.chart.on(ChartEvent.THEME_CHANGED + '.scxValueScalePanel', () => {
            this.applyTheme();
        });
    }

    /**
     * Layouts value scale panel elements
     * @method layout
     * @param {Rect} frame The chart panels container frame rectangle.
     * @param {Boolean} isLeftPanel True if it is a left panel, false if it is a right panel.
     * @memberOf ValueScalePanel#
     */
    layout(frame: Rect, isLeftPanel?: boolean) {
        let div = this.rootDiv,
            scaleFrame: Rect = null;

        if (this._isVisible) {
            if (!div) {
                let parentDiv = this.chart.chartPanelsContainer.rootDiv;

                this._rootDiv = div = parentDiv.scxAppend('div', CLASS_CONTAINER).addClass(this._cssClass);
                this.applyTheme();
            }

            div.width(this.getWidth()).outerHeight(frame.height);

            scaleFrame = this.frame;
            scaleFrame.width = div.outerWidth();
            scaleFrame.left = isLeftPanel ? frame.left : frame.right - scaleFrame.width;
            scaleFrame.height = frame.height;

            div.css('left', scaleFrame.left);
        } else {
            if (div) {
                div.remove();
                this._rootDiv = null;
            }
        }

        return scaleFrame;
    }

    getWidth(): number {
        let valueScale = this._valueScale;

        if (valueScale.useManualWidth)
            return valueScale.manualWidth;

        let maxWidth = 0;
        for (let panel of this.chart.chartPanels) {
            maxWidth = Math.max(panel.getPreferredValueScaleWidth(this._valueScale), maxWidth);
        }

        return maxWidth;
    }

    applyTheme() {
        if (!this.rootDiv)
            return;

        let theme = this.chart.theme.valueScale.border,
            cssKey = this._cssClass === this._valueScale.leftPanelCssClass ? 'border-right' : 'border-left';

        this.rootDiv.css(cssKey, theme.width + 'px ' + theme.lineStyle + ' ' + theme.strokeColor);
    }
}
