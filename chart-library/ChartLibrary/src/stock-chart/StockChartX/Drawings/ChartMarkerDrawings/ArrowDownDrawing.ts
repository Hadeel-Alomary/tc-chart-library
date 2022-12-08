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
 * Represents down arrow drawing.
 * @constructor ArrowDownDrawing
 * @augments GeometricMarkerDrawingBase
 * @example
 *  // Create arrow down drawing at point (10, 20).
 *  var arrowDown1 = new ArrowDownDrawing({
     *      point: {x: 10, y: 20}
     *  });
 *
 *  // Create arrow down drawing at record 10 and value 20.0.
 *  var arrowDown2 = new ArrowDownDrawing({
     *      point: {record: 10, value: 20.0}
     *  });
 *
 *  // Create red arrow down drawing at point (10, 20).
 *  var arrowDown3 = new ArrowDownDrawing({
     *      point: {x: 10, y: 20},
     *      theme: {
     *          fill: {
     *              fillColor: '#FF0000'
     *          }
     *      }
     *  });
 */
export class ArrowDownDrawing extends ArrowDrawingBase {
    static get className(): string {
        return 'arrowDown';
    }

    /**
     * @inheritdoc
     */
    bounds(): IRect {
        let bottomPoint = this.cartesianPoint(0);
        if (!bottomPoint)
            return null;

        let size = this.size;

        return {
            left: Math.round(bottomPoint.x - size.width / 2),
            top: Math.round(bottomPoint.y - size.height),
            width: size.width,
            height: size.height
        };
    }

    textBounds(): IRect {
        let bottomPoint = this.cartesianPoint(0);
        if (!bottomPoint)
            return null;

        let size = this.size;
        let textWidth = this.context.measureText(this.text).width;

        return {
            left: bottomPoint.x - textWidth,
            top: bottomPoint.y - (size.height) * 2,
            width: textWidth * 2,
            height: size.height
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

        let bottomPoint = this.cartesianPoint(0);
        if (!bottomPoint)
            return;

        let x = bottomPoint.x,
            y = bottomPoint.y,
            context = this.context,
            theme = this.getDrawingTheme(),
            size = this.size,
            halfWidth = size.width / 2,
            halfTailWidth = size.width * this.tailRatio / 2,
            height = size.height,
            triangleHeight = height * this.headRatio;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - halfWidth, y - triangleHeight);
        context.lineTo(x - halfTailWidth, y - triangleHeight);
        context.lineTo(x - halfTailWidth, y - height);
        context.lineTo(x + halfTailWidth, y - height);
        context.lineTo(x + halfTailWidth, y - triangleHeight);
        context.lineTo(x + halfWidth, y - triangleHeight);
        context.closePath();
        context.scxStroke(this.getDrawingTheme());
        context.scxFill(this.getDrawingTheme().fill);
        context.scxApplyTextTheme(this.getDrawingTheme().text);
        context.fillText(this.text,x , y - 23 - triangleHeight/2);

        if (this.selected) {
            let point = {
                x: x,
                y: Math.round(y - triangleHeight)
            };
            this._drawSelectionMarkers(point);
        }
    }

    onLoadState() {
        let theme = (<IDrawingOptions> this._options).theme as ArrowDrawingTheme;
        theme.text.textAlign = 'center';
    }

}

Drawing.register(ArrowDownDrawing);
