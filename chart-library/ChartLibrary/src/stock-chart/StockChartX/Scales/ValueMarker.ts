/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {ChartPanelValueScale} from "./ChartPanelValueScale";
import {IFillTheme, IStrokeTheme, ITextTheme} from "../Theme";
import {JsUtil} from "../Utils/JsUtil";
import {BrowserUtils} from '../../../utils';
import {PlotType} from '../../StockChartX/Plots/Plot';
import {IChartComponentConfig} from '../Controls/ChartComponent';
import {Chart} from '../Chart';

/**
 * The value marker theme structure.
 * @typedef {object} ValueMarkerTheme
 * @type {object}
 * @property {StrokeTheme} [line] The border line theme.
 * @property {FillTheme} fill The fill theme.
 * @property {TextTheme} text The text theme.
 * @memberOf
 * @example
 * // Value marker with white background
 * var theme = {
 *   fill: {
 *     fillColor: 'white'
 *   },
 *   text: {
 *     fontFamily: 'Calibri',
 *     fontSize: 12,
 *     fillColor: 'red'
 *   }
 * };
 */

export interface IValueMarker {
    textOffset: number;
    theme: IValueMarkerTheme;

    draw(value: number, panelValueScale: ChartPanelValueScale, offset: number, plotType: string): void;
}

export interface IValueMarkerTheme {
    text: ITextTheme;
    line?: IStrokeTheme;
    fill: IFillTheme;
}

export interface IValueMarkerDefaults {
    textOffset: number;
}

/**
 * Represents value marker on the value scale.
 * @constructor ValueMarker
 * @memberOf
 */
export class ValueMarker implements IValueMarker {
    static defaults: IValueMarkerDefaults = {
        textOffset: 8,
    };

    constructor(theme:IValueMarkerTheme) {
        this.theme = theme;
    }

    private _textOffset: number;
    /**
     * The horizontal text offset.
     * @name textOffset
     * @type {number}
     * @memberOf ValueMarker#
     */
    get textOffset(): number {
        let offset = this._textOffset;

        return offset != null ? offset : ValueMarker.defaults.textOffset;
    }

    set textOffset(value: number) {
        if (value != null && JsUtil.isNegativeNumber(value))
            throw new Error('Text offset must be greater or equal to 0.');

        this._textOffset = value;
    }

    private _theme: IValueMarkerTheme;
    /**
     * The value marker theme.
     * @name theme
     * @type {ValueMarkerTheme}
     * @memberOf ValueMarker#
     */
    get theme(): IValueMarkerTheme {
        return this._theme;
    }

    set theme(value: IValueMarkerTheme) {
        this._theme = value;
    }

    /**
     * Draws value marker.
     * @method draw
     * @param {number} value The value to draw.
     * @param {ChartPanelValueScale} panelValueScale The value scale to draw on.
     * @param {number} offset The value marker vertical offset.
     * @param {string} plotType The type of plot which owns the value marker.
     * @memberOf ValueMarker#
     */
    draw(value: number, panelValueScale: ChartPanelValueScale, offset: number, plotType: string) {
        if(plotType == PlotType.PRICE_STYLE) {
            this.drawArrowValueMarker(value, panelValueScale, offset);
        } else {
            this.drawRectangleValueMarker(value, panelValueScale, offset);
        }
    }

    private drawArrowValueMarker(value: number, panelValueScale: ChartPanelValueScale, offset: number) {
        let leftFrame = panelValueScale.leftFrame,
            rightFrame = panelValueScale.rightFrame;
        if (!leftFrame && !rightFrame)
            return;

        let context = panelValueScale.chartPanel.context,
            text = panelValueScale.formatValue(value),
            y = panelValueScale.projection.yByValue(value) + offset,
            theme = this.theme,
            xTextOffset = this.textOffset,
            yOffset = theme.text.fontSize / 2 + (BrowserUtils.isMobileScreenDimensions() ? 3 : 1);
        context.save();
        panelValueScale.clip();
        context.beginPath();

        if (leftFrame) {
            let right = leftFrame.right - 1;

            context.moveTo(right, y);
            context.lineTo(right - yOffset, y + yOffset);
            context.lineTo(leftFrame.left, y + yOffset);
            context.lineTo(leftFrame.left, y - yOffset);
            context.lineTo(right - yOffset, y - yOffset);
            context.closePath();
            context.scxFillStroke(theme.fill, theme.line);

            context.scxApplyTextTheme(theme.text);
            context.textAlign = 'right';
            context.textBaseline = "middle";
            context.fillText(text, leftFrame.right - xTextOffset, y);
        }
        if (rightFrame) {
            let right = rightFrame.right - 1;

            context.moveTo(rightFrame.left, y);
            context.lineTo(rightFrame.left + yOffset, y - yOffset);
            context.lineTo(right, y - yOffset);
            context.lineTo(right, y + yOffset);
            context.lineTo(rightFrame.left + yOffset, y + yOffset);
            context.closePath();
            context.scxFillStroke(theme.fill, theme.line);

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////
            // MA unfortunately, fillColor keeps changing by another code who sets it on the fly to draw other things.
            // For now, set it manually to be white whenever we draw the marker.
            theme.text.fillColor = '#fff';
            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            context.scxApplyTextTheme(theme.text);
            context.textAlign = 'left';
            context.textBaseline = "middle";
            context.fillText(text, rightFrame.left + xTextOffset, y);
        }

        context.restore();
    }

    private drawRectangleValueMarker(value: number, panelValueScale: ChartPanelValueScale, offset: number) {
        let leftFrame = panelValueScale.leftFrame,
            rightFrame = panelValueScale.rightFrame;
        if (!leftFrame && !rightFrame)
            return;

        let context = panelValueScale.chartPanel.context,
            text = panelValueScale.formatValue(value),
            y = panelValueScale.projection.yByValue(value) + offset,
            theme = this.theme,
            xTextOffset = this.textOffset,
            yOffset = theme.text.fontSize / 2 + (BrowserUtils.isMobileScreenDimensions() ? 3 : 1);
        context.save();
        panelValueScale.clip();
        context.beginPath();

        if (leftFrame) {
            let right = leftFrame.right - 1;

            context.beginPath();
            context.rect(leftFrame.left, y - yOffset, right - leftFrame.left, yOffset * 2);
            context.scxFillStroke(theme.fill, theme.line);

            context.scxApplyTextTheme(theme.text);
            context.textAlign = 'right';
            context.textBaseline = "middle";
            context.fillText(text, leftFrame.right - xTextOffset, y);
        }
        if (rightFrame) {
            let right = rightFrame.right - 1;

            context.beginPath();
            context.rect(rightFrame.left, y - yOffset, right - rightFrame.left, yOffset * 2);
            context.scxFillStroke(theme.fill, theme.line);

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////
            // MA unfortunately, fillColor keeps changing by another code who sets it on the fly to draw other things.
            // For now, set it manually to be white whenever we draw the marker.
            theme.text.fillColor = '#fff';
            //////////////////////////////////////////////////////////////////////////////////////////////////////////

            context.scxApplyTextTheme(theme.text);
            context.textAlign = 'left';
            context.textBaseline = "middle";
            context.fillText(text, rightFrame.left + xTextOffset, y);
        }

        context.restore();
    }
}
