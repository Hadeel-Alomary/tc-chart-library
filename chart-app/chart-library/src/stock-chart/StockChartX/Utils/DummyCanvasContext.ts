/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {ITextTheme} from "../Theme";
import {HtmlUtil} from "./HtmlUtil";

/**
 * Represents dummy canvas context.
 * @namespace
 * @memberOf StockChartX
 */
export class DummyCanvasContext {

    private static _context: CanvasRenderingContext2D;

    /**
     * Canvas rendering context.
     * @name context
     * @type {CanvasRenderingContext2D}
     * @memberOf DummyCanvasContext
     */
    static get context(): CanvasRenderingContext2D {
        if (!DummyCanvasContext._context)
            DummyCanvasContext._context = (<HTMLCanvasElement> $('<canvas></canvas>')[0]).getContext('2d');

        return DummyCanvasContext._context;
    }

    /**
     * Applies text theme to the context.
     * @method applyTextTheme
     * @param {TextTheme} theme The text theme.
     * @memberOf DummyCanvasContext
     */
    static applyTextTheme(theme: ITextTheme) {
        this.context.scxApplyTextTheme(theme);
    }

    /**
     * Returns width that is necessary to render given text.
     * @method textWidth
     * @param {string} text The text to be measured.
     * @param {TextTheme} [textTheme] The text theme.
     * @returns {Number}
     * @memberOf DummyCanvasContext
     */
    static textWidth(text: string, textTheme?: ITextTheme): number {
        let context = this.context;

        if (textTheme)
            context.scxApplyTextTheme(textTheme);

        return context.measureText(text).width;
    }

    /**
     * Returns text size that is required to render text using a given theme.
     * @method measureText
     * @param {String} text The text to be measured.
     * @param {TextTheme} [textTheme] The text theme.
     * @returns {Size}
     * @memberOf DummyCanvasContext
     */
    static measureText(text: string, textTheme: ITextTheme) {
        return {
            width: Math.round(this.textWidth(text, textTheme)),
            height: Math.round(HtmlUtil.getFontSize(textTheme) + 1)
        };
    }
}
