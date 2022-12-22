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
import {ChartPoint, IPoint} from "../../Graphics/ChartPoint";
import {Geometry} from "../../Graphics/Geometry";
import {PanGesture} from "../../Gestures/PanGesture";
import {GestureState, WindowEvent} from "../../Gestures/Gesture";
import {LineDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

export class TrendChannelDrawing extends ThemedDrawing<LineDrawingTheme> {
    static get className(): string {
        return 'trendChannel';
    }

    get pointsNeeded(): number {
        return 2;
    }

    /**
     * @inheritdoc
     */
    bounds(): IRect {
        let points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;

        return {
            left: points[0].x,
            top: points[0].y,
            width: points[1].x - points[0].x,
            height: points[1].y - points[0].y
        };
    }

    _finishUserDrawing() {
        super._finishUserDrawing();

        let points = this.cartesianPoints(),
            point = ChartPoint.convert({
                x: points[0].x,
                y: points[0].y - 20
            }, this.createPointBehavior, this.projection);
        this.appendChartPoint(point);
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return false;

        let x1 = points[0].x,
            y1 = points[0].y,
            x2 = points[1].x,
            y2 = points[1].y,
            x3 = points[2].x,
            y3 = points[2].y,

            x4 = x3 + (x2 - x1),
            y4 = y2 + (y3 - y1),

            x5 = x1 - (x3 - x1),
            y5 = y1 - (y3 - y1),

            x6 = x5 + (x2 - x1),
            y6 = y2 - (y3 - y1),

            delta = Math.sqrt((x1 * x2 + y1 * y2)),
            centerDestinationX = Math.round((x1 + (x2 - x1) * delta)),
            centerDestinationY = Math.round((y1 + (y2 - y1) * delta)),

            delta1 = Math.sqrt((x3 * x4 + y3 * y4)),
            topDestinationX = Math.round((x3 + (x4 - x3) * delta1)),
            topDestinationY = Math.round((y3 + (y4 - y3) * delta1)),

            delta2 = Math.sqrt((x5 * x6 + y5 * y6)),
            bottomDestinationX = Math.round((x5 + (x6 - x5) * delta2)),
            bottomDestinationY = Math.round((y5 + (y6 - y5) * delta2));

        return (Geometry.isPointNearLine(point, {x: x1, y: y1}, {x: centerDestinationX, y: centerDestinationY}) ||
            Geometry.isPointNearLine(point, {x: x3, y: y3}, {x: topDestinationX, y: topDestinationY}) ||
            Geometry.isPointNearLine(point, {x: x5, y: y5}, {x: bottomDestinationX, y: bottomDestinationY}));
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                let points = this.cartesianPoints();
                if (points.length > 1) {
                    for (let i = 0; i < points.length; i++) {
                        if (Geometry.isPointNearPoint(event.pointerPosition, points[i])) {
                            this._setDragPoint(i);
                            return true;
                        }
                    }
                }

                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    this.chartPoints[this._dragPoint].moveToPoint(magnetChartPoint, this.projection);
                    if (this._dragPoint === 0)
                        this.chartPoints[2].translate(gesture.moveOffset.x, gesture.moveOffset.y, this.projection);
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

        let points = this.cartesianPoints();
        if (points.length === 0)
            return;

        let context = this.context,
            theme = this.getDrawingTheme();

        if (points.length > 2) {
            let x1 = points[0].x,
                y1 = points[0].y,
                x2 = points[1].x,
                y2 = points[1].y,
                x3 = points[2].x,
                y3 = points[2].y,

                x4 = x3 + (x2 - x1),
                y4 = y2 + (y3 - y1),

                x5 = x1 - (x3 - x1),
                y5 = y1 - (y3 - y1),

                x6 = x5 + (x2 - x1),
                y6 = y2 - (y3 - y1),

                delta = Math.sqrt((x1 * x2 + y1 * y2)),
                centerDestinationX = Math.round((x1 + (x2 - x1) * delta)),
                centerDestinationY = Math.round((y1 + (y2 - y1) * delta)),

                delta1 = Math.sqrt((x3 * x4 + y3 * y4)),
                topDestinationX = Math.round((x3 + (x4 - x3) * delta1)),
                topDestinationY = Math.round((y3 + (y4 - y3) * delta1)),

                delta2 = Math.sqrt((x5 * x6 + y5 * y6)),
                bottomDestinationX = Math.round((x5 + (x6 - x5) * delta2)),
                bottomDestinationY = Math.round((y5 + (y6 - y5) * delta2));

            context.beginPath();

            context.moveTo(x1, y1);
            context.lineTo(centerDestinationX, centerDestinationY);

            context.moveTo(x3, y3);
            context.lineTo(topDestinationX, topDestinationY);

            context.moveTo(x5, y5);
            context.lineTo(bottomDestinationX, bottomDestinationY);

            context.scxStroke(theme.line);
        } else if (points.length > 1) {
            context.scxStrokePolyline(points, theme.line);
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }
}

Drawing.register(TrendChannelDrawing);
