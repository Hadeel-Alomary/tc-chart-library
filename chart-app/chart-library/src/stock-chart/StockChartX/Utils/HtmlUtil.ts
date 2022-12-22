/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IStrokeTheme, ITextTheme} from "../Theme";

const DEFAULT_LINE_WIDTH = 1;
const DEFAULT_FONT_SIZE = 12;

/**
 * HTML utilities.
 * @class
 * @memberOf StockChartX
 * @private
 */
export class HtmlUtil {
    static getLineWidth(theme: IStrokeTheme): number {
        if (theme && theme.strokeEnabled === false)
            return 0;

        return (theme && theme.width) || DEFAULT_LINE_WIDTH;
    }

    static getFontSize(theme: ITextTheme): number {
        return (theme && theme.fontSize) || DEFAULT_FONT_SIZE;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    // MA this method used tinycolor, library that currently part of spectrum external lib
    // As part of my approach to decouple chart from any external library (except jQuery and bootstrap), I replaced
    // tinyColor.isDark implementation with my own implementation that is based on tinyColor code.
    // Trickiest part in the implementation is the way to convert color string to rgb for parsing. color can be
    // provided in so many different formats, as in string (white, red, etc), hex (#333, #343456) or rgb
    // Rather than doing parsing manually, I used browser getComputedStyle which can convert any color to rgb based
    // color. However, in order to do that, I needed to add a div to the body. Also, I cached the colors as I have
    // no idea on how fast is getComputedStyle API.
    private static colorDiv:HTMLElement;
    private static colorTypeCache:{[key:string]:boolean} = {};
    static isDarkColor(color: string): boolean {

        if(!window.getComputedStyle) {
            return true; // MA in case getComputedStyle is not supported by browser
        }

        if(color in HtmlUtil.colorTypeCache){
            return HtmlUtil.colorTypeCache[color];
        }

        if(!HtmlUtil.colorDiv) {
            HtmlUtil.colorDiv = document.createElement('div');
            HtmlUtil.colorDiv.style.display = 'none';
            $("body").append(HtmlUtil.colorDiv);
        }

        // converting color string to rgb from https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
        HtmlUtil.colorDiv.style.color = color;
        let rgbColor = getComputedStyle(HtmlUtil.colorDiv).color;

        // parsing from https://stackoverflow.com/questions/10970958/get-a-color-component-from-an-rgb-string-in-javascript
        let rgbParts:string[] = rgbColor.substring(4, rgbColor.length-1).replace(/ /g, '').split(',');

        // computation of brightness and using it to determine dark color is taken from tinyColor code
        let brightness = (+rgbParts[0] * 299 + +rgbParts[1] * 587 + +rgbParts[2] * 114) / 1000;
        HtmlUtil.colorTypeCache[color] = brightness < 128;

        return HtmlUtil.colorTypeCache[color];

    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    static setVisibility(control: JQuery, visible: boolean) {
        control.css('visibility', visible ? 'visible' : 'hidden');
    }

    static isHidden(control: JQuery):boolean {
        return control.css('visibility') != 'hidden';
    }
}
