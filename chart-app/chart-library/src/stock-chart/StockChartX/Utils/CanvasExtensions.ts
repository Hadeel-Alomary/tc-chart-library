/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {
    DashArray, FontDefaults, IFillTheme, IStrokeTheme, ITextTheme, LineStyle, StrokeDefaults,
    StrokePriority
} from "../Theme";
import {IRect} from "../Graphics/Rect";
import {IPoint} from "../Graphics/ChartPoint";

/* tslint:disable:interface-name */

/* tslint:enable:interface-name */

let _lineDashFunc: (dashArray: number[]) => void;


$.extend(CanvasRenderingContext2D.prototype, {
    /**
     * Applies specified stroke theme to the rendering context.
     * @param {StrokeTheme} [theme] The stroke theme.
     * @returns {CanvasRenderingContext2D}
     * @private
     */
    scxApplyStrokeTheme(theme: IStrokeTheme): CanvasRenderingContext2D {
        if (!theme || theme.strokeEnabled === false)
            return this;

        switch (theme.strokePriority || StrokeDefaults.strokePriority) {
            case StrokePriority.COLOR:
                this.strokeStyle = theme.strokeColor || StrokeDefaults.strokeColor;
                break;
        }
        this.lineCap = theme.lineCap || StrokeDefaults.lineCap;
        this.lineJoin = theme.lineJoin || StrokeDefaults.lineJoin;
        this.lineWidth = theme.width || StrokeDefaults.width;
        this.textAlign = theme.textAlign || StrokeDefaults.textAlign;
        this.textBaseline = theme.textBaseline || StrokeDefaults.textBaseline;

        // Set dash style
        let dashArray: number[];
        switch (theme.lineStyle || StrokeDefaults.lineStyle) {
            case LineStyle.DASH:
                dashArray = [DashArray.DASH[0] * this.lineWidth, DashArray.DASH[1] * this.lineWidth];
                break;
            case LineStyle.DOT:
                dashArray = [DashArray.DOT[0] * this.lineWidth, DashArray.DOT[1] * this.lineWidth];
                break;
            case LineStyle.DASH_DOT:
                dashArray = [DashArray.DASH_DOT[0] * this.lineWidth , DashArray.DASH_DOT[1] * this.lineWidth , DashArray.DASH_DOT[2] * this.lineWidth , DashArray.DASH_DOT[3] * this.lineWidth];
                break;
            default:
                dashArray = [];
                break;
        }
        getLineDashFunc.call(this).call(this, dashArray);

        return this;
    },

    /**
     * Applies fill theme to the rendering context.
     * @param {FillTheme} [theme] The fill theme.
     * @returns {CanvasRenderingContext2D}
     * @private
     */
    scxApplyFillTheme(theme: IFillTheme): CanvasRenderingContext2D {
        if (theme) {
            switch (theme.fillPriority) {
                default:
                    if (theme.fillColor) {
                        this.fillStyle = theme.fillColor || 'black';
                    }
                    break;
            }
        }

        return this;
    },

    /**
     * Applies text theme to the rendering context.
     * @param {TextTheme} [theme] The theme.
     * @returns {CanvasRenderingContext2D}
     * @private
     */
    scxApplyTextTheme(theme: ITextTheme): CanvasRenderingContext2D {
        this.font = getFont(theme);
        if (!theme || theme.fillEnabled !== false)
            this.scxApplyFillTheme(theme);
        if (!theme || theme.strokeEnabled !== false)
            this.scxApplyStrokeTheme(theme);

        return this;
    },

    scxFill(theme: IFillTheme, force?: boolean): CanvasRenderingContext2D {
        if (force || (theme && theme.fillEnabled !== false)) {
            this.scxApplyFillTheme(theme);
            this.fill();
        }

        return this;
    },

    scxStroke(theme: IStrokeTheme, force?: boolean): CanvasRenderingContext2D {
        if (force || (theme && theme.strokeEnabled !== false)) {
            this.scxApplyStrokeTheme(theme);
            this.stroke();
        }

        return this;
    },

    scxFillStroke(fillTheme: IFillTheme, strokeTheme: IStrokeTheme): CanvasRenderingContext2D {
        this.scxFill(fillTheme);
        this.scxStroke(strokeTheme);

        return this;
    },

    scxStrokePolyline(points: IPoint[], theme: IStrokeTheme): CanvasRenderingContext2D {
        let count = points.length;
        if (count < 2)
            throw new Error('Not enough points.');

        this.beginPath();

        this.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < count; i++) {
            this.lineTo(points[i].x, points[i].y);
        }

        this.scxStroke(theme);

        return this;
    },

    scxFillPolyLine(points:IPoint[], theme:IFillTheme):CanvasRenderingContext2D{
        let count = points.length;
        if (count < 2)
            throw new Error('Not enough points.');

        this.beginPath();

        this.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < count; i++) {
            this.lineTo(points[i].x, points[i].y);
        }
        this.closePath();
        this.scxFill(theme);
        return this;
    },

    // http://jsfiddle.net/cZ2gH/1/
    scxRounderRectangle(bounds: IRect, radius: number): CanvasRenderingContext2D {
        this.moveTo(bounds.left + radius, bounds.top);
        this.lineTo(bounds.left + bounds.width - radius, bounds.top);
        this.quadraticCurveTo(bounds.left + bounds.width, bounds.top, bounds.left + bounds.width, bounds.top + radius);
        this.lineTo(bounds.left + bounds.width, bounds.top + bounds.height - radius);
        this.quadraticCurveTo(bounds.left + bounds.width, bounds.top + bounds.height, bounds.left + bounds.width - radius, bounds.top + bounds.height);
        this.lineTo(bounds.left + radius, bounds.top + bounds.height);
        this.quadraticCurveTo(bounds.left, bounds.top + bounds.height, bounds.left, bounds.top + bounds.height - radius);
        this.lineTo(bounds.left, bounds.top + radius);
        this.quadraticCurveTo(bounds.left, bounds.top, bounds.left + radius, bounds.top);
        return this;
    },

    scxDrawAntiAliasingLine(point1: IPoint, point2: IPoint): CanvasRenderingContext2D {
        let translateValue = 0.5;
        this.moveTo(Math.floor(point1.x) + translateValue, Math.floor(point1.y) + translateValue);
        this.lineTo(Math.floor(point2.x) + translateValue, Math.floor(point2.y) + translateValue);
        return this;
    },


    scxDrawArrow(point:IPoint, radians:number, width:number, height:number):CanvasRenderingContext2D{
        radians += 2 * (Math.PI - radians) + Math.PI / 2;
        this.save();
        this.beginPath();
        this.translate(point.x, point.y);
        this.rotate(radians);
        this.moveTo(0, 0 );
        this.lineTo(width, height);
        this.moveTo(0, 0);
        this.lineTo(-width, height);
        this.restore();
        return this;
    }
});

function getFont(theme: ITextTheme): string {
    if (!theme) {
        return FontDefaults.fontSize + 'px ' + FontDefaults.fontFamily;
    }

    let fontStyle = theme.fontStyle || FontDefaults.fontStyle,
        fontVariant = theme.fontVariant || FontDefaults.fontVariant,
        fontWeight = theme.fontWeight || FontDefaults.fontWeight,
        fontSize = theme.fontSize || FontDefaults.fontSize,
        fontFamily = theme.fontFamily || FontDefaults.fontFamily;

    return fontStyle + ' ' + fontVariant + ' ' + fontWeight + ' ' + fontSize + 'px ' + fontFamily;
}

function getLineDashFunc() {
    if (!_lineDashFunc) {
        // works for Chrome and IE11
        if (this.setLineDash) {
            _lineDashFunc = function (dashArray: number[]) {
                // noinspection JSPotentiallyInvalidUsageOfThis
                this.setLineDash(dashArray);
            };
        }
        // verified that this works in firefox
        else if ('mozDash' in this) {
            _lineDashFunc = function (dashArray: number[]) {
                this.mozDash = dashArray;
            };
        }
        // does not currently work for Safari
        else if ('webkitLineDash' in this) {
            _lineDashFunc = function (dashArray: number[]) {
                this.webkitLineDash = dashArray;
            };
        }
        // no support for IE9 and IE10
        else {
            // noinspection JSUnusedLocalSymbols
            _lineDashFunc = function (dashArray: number[]) {
            };
        }
    }

    return _lineDashFunc;
}
