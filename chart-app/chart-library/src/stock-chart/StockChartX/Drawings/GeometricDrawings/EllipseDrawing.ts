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
 * Represents ellipse drawing.
 * @constructor EllipseDrawing
 * @augments Drawing
 * @example
 *  // Create ellipse drawing.
 *  var ellipse1 = new EllipseDrawing({
     *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
     *  });
 *
 *  // Create ellipse drawing.
 *  var ellipse2 = new EllipseDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
     *  });
 *
 *  // Create ellipse drawing with a custom theme.
 *  var ellipse3 = new EllipseDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
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
export class EllipseDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string {
        return 'ellipse';
    }

    get pointsNeeded(): number {
        return 2;
    }

    private _markerPoints(points?: IPoint[]): IPoint[] {
        points = points || this.cartesianPoints();
        if (points.length === 0)
            return null;

        let center = points[0];
        if (points.length === 1)
            return [{x: center.x, y: center.y}];

        let horRadius = Geometry.xProjectionLength(points[0], points[1]),
            verRadius = Geometry.yProjectionLength(points[0], points[1]);

        return [
            {x: center.x - horRadius, y: center.y},  // left
            {x: center.x, y: center.y - verRadius},  // top
            {x: center.x + horRadius, y: center.y},  // right
            {x: center.x, y: center.y + verRadius},  // bottom
        ];
    }

    /**
     * @inheritdoc
     */
    bounds(): IRect {
        let points = this.cartesianPoints();
        if (points.length < this.pointsNeeded)
            return null;

        let horRadius = Geometry.xProjectionLength(points[0], points[1]),
            verRadius = Geometry.yProjectionLength(points[0], points[1]);

        return {
            left: points[0].x - horRadius,
            top: points[0].y - verRadius,
            width: 2 * horRadius,
            height: 2 * verRadius
        };
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();

        return points.length > 1 && Geometry.isPointNearEllipse(point, points[0], points[1]);
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                let markerPoints = this._markerPoints();
                if (markerPoints && markerPoints.length > 1) {
                    for (let i = 0; i < markerPoints.length; i++) {
                        if (Geometry.isPointNearPoint(event.pointerPosition, markerPoints[i])) {
                            this._setDragPoint(i);
                            return true;
                        }
                    }
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint >= 0) {
                    let magnetChartPoint = this._magnetChartPointIfNeeded(event.pointerPosition);
                    switch (this._dragPoint) {
                        case 0: // left
                        case 2: // right
                            this.chartPoints[1].moveToX(magnetChartPoint.x, this.projection);
                            break;
                        case 1: // top
                        case 3: // bottom
                            this.chartPoints[1].moveToY(magnetChartPoint.y, this.projection);
                            break;
                    }
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
            context = this.chartPanel.context,
            theme = this.getDrawingTheme();

        if (points.length > 1) {
            let horRadius = Geometry.xProjectionLength(points[0], points[1]),
                verRadius = Geometry.yProjectionLength(points[0], points[1]);

            context.beginPath();
            context.save();
            context.translate(points[0].x, points[0].y);
            if (horRadius !== verRadius)
                context.scale(1, verRadius / horRadius);
            context.arc(0, 0, horRadius, 0, 2 * Math.PI);
            context.restore();
            context.closePath();
            context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
        }

        if (this.selected) {
            let markers = this._markerPoints(points);
            this._drawSelectionMarkers(markers);
        }
    }

}

Drawing.register(EllipseDrawing);
