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
 * Represents rectangle drawing.
 * @constructor RectangleDrawing
 * @augments Drawing
 * @example
 *  // Create rectangle drawing.
 *  var rect1 = new RectangleDrawing({
     *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
     *  });
 *
 *  // Create rectangle drawing.
 *  var rect2 = new RectangleDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
     *  });
 *
 *  // Create rectangle drawing with a custom theme.
 *  var rect3 = new RectangleDrawing({
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
export class RectangleDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string {
        return 'rectangle';
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
            left: Math.min(points[0].x, points[1].x),
            top: Math.min(points[0].y, points[1].y),
            width: Math.abs(points[0].x - points[1].x),
            height: Math.abs(points[0].y - points[1].y)
        };
    }

    private _markerPoints(rect?: IRect): IPoint[] {
        if (!rect)
            rect = this.bounds();
        if (!rect) {
            let point = this.cartesianPoint(0);

            return point && [point];
        }

        let midX = Math.round(rect.left + rect.width / 2),
            midY = Math.round(rect.top + rect.height / 2),
            right = rect.left + rect.width,
            bottom = rect.top + rect.height;

        return [
            {x: rect.left, y: rect.top},   // left top point
            {x: midX, y: rect.top},        // middle top point
            {x: right, y: rect.top},       // right top point
            {x: right, y: midY},           // middle right point
            {x: right, y: bottom},         // right bottom point
            {x: midX, y: bottom},          // middle bottom point
            {x: rect.left, y: bottom},     // left bottom point
            {x: rect.left, y: midY},       // left middle point
        ];
    }

    private _normalizePoints() {
        let rect = this.bounds();
        if (rect) {
            let projection = this.projection,
                points = this.chartPoints;

            points[0].moveTo(rect.left, rect.top, projection);
            points[1].moveTo(rect.left + rect.width, rect.top + rect.height, projection);
        }
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();

        return points.length > 1 && Geometry.isPointNearRectPoints(point, points[0], points[1]);
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._normalizePoints();

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
                    let projection = this.projection,
                        points = this.chartPoints;

                    switch (this._dragPoint) {
                        case 0: // left top point
                            points[0].moveTo(magnetChartPoint.x, magnetChartPoint.y, projection);
                            break;
                        case 1: // middle top point
                            points[0].moveToY(magnetChartPoint.y, projection);
                            break;
                        case 2: // right top point
                            points[0].moveToY(magnetChartPoint.y, projection);
                            points[1].moveToX(magnetChartPoint.x, projection);
                            break;
                        case 3: // middle right point
                            points[1].moveToX(magnetChartPoint.x, projection);
                            break;
                        case 4: // right bottom point
                            points[1].moveTo(magnetChartPoint.x, magnetChartPoint.y, projection);
                            break;
                        case 5: // middle bottom point
                            points[1].moveToY(magnetChartPoint.y, projection);
                            break;
                        case 6: // left bottom point
                            points[0].moveToX(magnetChartPoint.x, projection);
                            points[1].moveToY(magnetChartPoint.y, projection);
                            break;
                        case 7: // left middle point
                            points[0].moveToX(magnetChartPoint.x, projection);
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

        let rect = this.bounds(),
            context = this.context,
            theme = this.getDrawingTheme();

        if (rect) {
            context.beginPath();
            context.rect(rect.left, rect.top, rect.width, rect.height);
            context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
        }

        if (this.selected) {
            let points = this._markerPoints(rect);
            this._drawSelectionMarkers(points);
        }
    }

}

Drawing.register(RectangleDrawing);
