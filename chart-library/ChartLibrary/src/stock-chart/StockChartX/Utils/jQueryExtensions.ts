/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


import {IRect, ISize, Rect} from "../Graphics/Rect";
import {IPoint} from "../Graphics/ChartPoint";
import {ITextTheme, IStrokeTheme, IFillTheme} from "../Theme";

$.fn.extend({
    /**
     * Returns element's frame rectangle relative to a given element.
     * If relativeElement is not specified it returns frame rectangle relative to a parent.
     * @param {jQuery} [relativeElement] The relative element.
     * @returns {Rect}
     * @private
     */
    scxGetFrame: function (relativeElement: JQuery): Rect {
        let width = this.outerWidth(),
            height = this.outerHeight(),
            pos: JQueryCoordinates;

        if (relativeElement) {
            let parentPos = relativeElement.offset();

            pos = this.offset();
            pos.left -= parentPos.left;
            pos.top -= parentPos.top;
        } else {
            pos = this.position();
        }

        return new Rect({
            left: pos.left,
            top: pos.top,
            width: width,
            height: height
        });
    },

    /**
     * Returns size of HTML element (including border).
     * @returns {Size}
     * @private
     */
    scxSize: function (): ISize {
        return {
            width: this.outerWidth(),
            height: this.outerHeight()
        };
    },

    /**
     * Returns content size of HTML element (excluding border).
     * @returns {Size}
     * @private
     */
    scxContentSize: function (): ISize {
        return {
            width: this.innerWidth(),
            height: this.innerHeight()
        };
    },

    /**
     * Create canvas element absolutely positioned in the parent container.
     * @returns {jQuery}
     * @private
     */
    scxAppendCanvas: function (): JQuery {
        return $('<canvas></canvas>')
            .css('position', 'absolute')
            .appendTo(this);
    },

    /**
     * Creates HTML element with a given tag and class name and attaches it into the parent element.
     * @param {String} tag The tag name.
     * @param {String | String[]} [className] The class name of div element.
     * @returns {jQuery} The created div element.
     * @private
     */
    scxAppend: function (tag: string, className: string | string[]): JQuery {
        let elem = $('<' + tag + '></' + tag + '>').appendTo(this);
        if (className) {
            if (typeof className === 'string') {
                elem.addClass(className);
            } else {
                for (let item of <string[]> className)
                    elem.addClass(item);
            }
        }

        return elem;
    },

    /**
     * Sets element's frame.
     * @param {Rect} frame The frame rectangle.
     * @private
     */
    scxFrame: function (frame: IRect) {
        this.css('left', frame.left)
            .css('top', frame.top)
            .outerWidth(frame.width)
            .outerHeight(frame.height);
    },

    scxPosition: function (left: number, top: number): JQuery {
        this.css('left', left).css('top', top);

        return this;
    },

    scxCanvasSize: function (width: number, height: number): void {
        if (this.width() != width || this.height() != height) {
            if (window.devicePixelRatio > 1) {
                // https://stackoverflow.com/questions/4720262/canvas-drawing-and-retina-display-doable
                this.attr('width', width * window.devicePixelRatio);
                this.attr('height', height * window.devicePixelRatio);
                this.css("width", width);
                this.css("height", height);
                this[0].getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
            } else {
                this.attr('width', width);
                this.attr('height', height);
            }
        }


    },

    /**
     * Converts point from client coordinates system to element's coordinate system.
     * @param {Number} clientX The x coordinate.
     * @param {Number} clientY The y coordinate.
     * @return {{x: Number, y: Number}}
     * @private
     */
    scxClientToLocalPoint: function (clientX: number, clientY: number): IPoint {
        let pos = this.offset();

        return {
            x: Math.round(clientX - pos.left),
            y: Math.round(clientY - pos.top)
        };
    },

    scxLocalToClientPoint: function (localX: number, localY: number): IPoint {
        let pos = this.offset();

        return {
            x: Math.round(localX + pos.left),
            y: Math.round(localY + pos.top)
        };
    },

    scxTextStyle: function (theme: ITextTheme): JQuery {
        return this
            .css('color', theme.fillColor)
            .css('font-size', (theme.fontSize / 10) + 'rem')
            .css('font-family', theme.fontFamily)
            .css('font-weight', theme.fontStyle);
    },

    scxTextColor: function (theme: ITextTheme): JQuery {
        return this.css('color', theme.fillColor);
    },

    scxBorder: function (border: string, theme: IStrokeTheme): JQuery {
        return this.css(border, theme.width + 'px ' + theme.lineStyle + ' ' + theme.strokeColor);
    },

    scxFill: function (theme: IFillTheme): JQuery {
        if (theme.fillEnabled === false)
            return this;

        return this.css('background-color', theme.fillColor);
    }
});
