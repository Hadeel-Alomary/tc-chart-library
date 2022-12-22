/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {ArrowDrawingBase} from "./ArrowDrawingBase";
import {IRect} from "../../Graphics/Rect";
import {Drawing, IDrawingOptions} from '../Drawing';
import {IPoint} from '../../Graphics/ChartPoint';
import {Geometry} from '../../Graphics/Geometry';
import {ArrowDrawingTheme} from '../DrawingThemeTypes';

/**
 * Represents left arrow drawing.
 * @constructor ArrowLeftDrawing
 * @augments ArrowDrawingBase
 * @example
 *  // Create arrow left drawing at point (10, 20).
 *  var arrowLeft1 = new ArrowLeftDrawing({
     *      point: {x: 10, y: 20}
     *  });
 *
 *  // Create arrow left drawing at record 10 and value 20.0.
 *  var arrowLeft2 = new ArrowLeftDrawing({
     *      point: {record: 10, value: 20.0}
     *  });
 *
 *  // Create red arrow left drawing at point (10, 20).
 *  var arrowLeft3 = new ArrowLeftDrawing({
     *      point: {x: 10, y: 20},
     *      theme: {
     *          fill: {
     *              fillColor: '#FF0000'
     *          }
     *      }
     *  });
 */
export class ArrowLeftDrawing extends ArrowDrawingBase {
    static get className(): string {
        return 'arrowLeft';
    }

    /**
     * @inheritdoc
     */
    bounds(): IRect {
        let leftPoint = this.cartesianPoint(0);
        if (!leftPoint)
            return null;

        let size = this.size;

        return {
            left: leftPoint.x,
            top: Math.round(leftPoint.y - size.height / 2),
            width: size.width,
            height: size.height
        };
    }

    textBounds(): IRect {
        let leftPoint = this.cartesianPoint(0);
        if (!leftPoint)
            return null;

        let size = this.size;
        let textWidth = this.context.measureText(this.text).width;

        return {
            left: leftPoint.x + size.width,
            top: leftPoint.y,
            width: textWidth * 2,
            height: size.height / 2
        };
    }

    hitTest(point: IPoint): boolean {
        if (this.text != ' ') {
            return Geometry.isPointInsideOrNearRect(point, this.textBounds()) || Geometry.isPointInsideOrNearRect(point, this.bounds());
        } else {
            return Geometry.isPointInsideOrNearRect(point, this.bounds());
        }
    }

    /**
     * @inheritdoc
     */
    draw() {
        if (!this.visible)
            return;

        let leftPoint = this.cartesianPoint(0);
        if (!leftPoint)
            return;

        let x = leftPoint.x,
            y = leftPoint.y,
            context = this.context,
            theme = this.getDrawingTheme(),
            size = this.size,
            width = size.width,
            triangleWidth = width * this.headRatio,
            halfHeight = size.height / 2,
            halfTailHeight = size.height * this.tailRatio / 2;

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + triangleWidth, y - halfHeight);
        context.lineTo(x + triangleWidth, y - halfTailHeight);
        context.lineTo(x + width, y - halfTailHeight);
        context.lineTo(x + width, y + halfTailHeight);
        context.lineTo(x + triangleWidth, y + halfTailHeight);
        context.lineTo(x + triangleWidth, y + halfHeight);
        context.closePath();
        context.scxStroke(this.getDrawingTheme());
        context.scxFill(this.getDrawingTheme().fill);
        context.scxApplyTextTheme(this.getDrawingTheme().text);
        context.fillText(this.text, x + width + 2, y + halfHeight - 3 );

        if (this.selected) {
            let point = {
                x: Math.round(x + triangleWidth),
                y: y
            };
            this._drawSelectionMarkers(point);
        }
    }

    onLoadState() {
        let theme = (<IDrawingOptions> this._options).theme as ArrowDrawingTheme;
        theme.text.textAlign = 'left';
    }

}

Drawing.register(ArrowLeftDrawing);
