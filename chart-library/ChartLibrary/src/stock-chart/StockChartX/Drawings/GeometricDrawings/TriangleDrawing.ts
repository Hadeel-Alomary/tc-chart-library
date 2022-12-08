/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Drawing} from "../Drawing";
import {IRect} from "../../Graphics/Rect";
import {Geometry} from "../../Graphics/Geometry";
import {IPoint} from "../../Graphics/ChartPoint";
import {PanGesture} from "../../Gestures/PanGesture";
import {GestureState, WindowEvent} from "../../Gestures/Gesture";
import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

/**
 * Represents triangle drawing.
 * @constructor TriangleDrawing
 * @augments Drawing
 * @example
 *  // Create triangle drawing.
 *  var triangle1 = new TriangleDrawing({
     *      points: [{x: 10, y: 20}, {x: 50, y: 60}, {x: 100, y: 100}]
     *  });
 *
 *  // Create triangle drawing.
 *  var triangle2 = new TriangleDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}, {record: 100, value: 100.0}]
     *  });
 *
 *  // Create triangle drawing with a custom theme.
 *  var triangle3 = new TriangleDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}, {record: 100, value: 100.0}],
     *      theme: {
     *          line: {
     *              strokeColor: 'white'
     *              width: 1
     *          },
     *          fill: {
     *              fillColor: 'green'
     *          }
     *      }
     *  });
 */
export class TriangleDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string {
        return 'triangle';
    }

    get pointsNeeded(): number {
        return 3;
    }

    /**
     * @inheritdoc
     */
    bounds(): IRect {
        let points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;

        let left = Math.min(points[0].x, points[1].x, points[2].x),
            top = Math.min(points[0].y, points[1].y, points[2].y),
            width = Math.max(points[0].x, points[1].x, points[2].x) - left,
            height = Math.max(points[0].y, points[1].y, points[2].y) - top;

        return {
            left: left,
            top: top,
            width: width,
            height: height
        };
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();

        return points.length > 1 && Geometry.isPointNearPolygon(point, points);
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent) {
        switch (gesture.state) {
            case GestureState.STARTED:
                let points = this.cartesianPoints();
                for (let i = 0; i < points.length; i++) {
                    if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                        this._setDragPoint(i);
                        return true;
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    return true;
                }
                break;
        }

        return false;
    }

    /**
     * @inheritdoc
     */
    draw() {
        if (!this.visible)
            return;

        let points = this.cartesianPoints(),
            context = this.context,
            theme = this.getDrawingTheme();

        if (points.length > 1) {
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++)
                context.lineTo(points[i].x, points[i].y);
            context.closePath();
            context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }
}

Drawing.register(TriangleDrawing);
