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
 * Represents circle drawing.
 * @constructor CircleDrawing
 * @augments Drawing
 * @example
 *  // Create circle drawing.
 *  var circle1 = new CircleDrawing({
     *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
     *  });
 *
 *  // Create circle drawing.
 *  var circle2 = new CircleDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
     *  });
 *
 *  // Create circle drawing with a custom theme.
 *  var circle3 = new CircleDrawing({
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
export class CircleDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string {
        return 'circle';
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

        let radius = Geometry.length(points[0], points[1]);
        return {
            left: points[0].x - radius,
            top: points[0].y - radius,
            width: 2 * radius,
            height: 2 * radius
        };
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();

        return points.length > 1 && Geometry.isPointNearCircle(point, points[0], points[1]);
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
                    this.chartPoints[1].moveToPoint(magnetChartPoint, this.projection);
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
            let radius = Geometry.length(points[0], points[1]);

            context.beginPath();
            context.arc(points[0].x, points[0].y, radius, 0, 2 * Math.PI);
            context.scxFillStroke(this.getDrawingTheme().fill, this.getDrawingTheme().line);
        }

        if (this.selected) {
            let markers = this._markerPoints(points);
            this._drawSelectionMarkers(markers);
        }
    }

    private _markerPoints(points?: IPoint[]): IPoint[] {
        points = points || this.cartesianPoints();
        if (points.length === 0)
            return null;

        let center = points[0];
        if (points.length === 1)
            return [{x: center.x, y: center.y}];

        let radius = Geometry.length(points[0], points[1]);
        return [
            {x: center.x - radius, y: center.y},  // left
            {x: center.x, y: center.y - radius},  // top
            {x: center.x + radius, y: center.y},  // right
            {x: center.x, y: center.y + radius},  // bottom
        ];
    }

    canControlPointsBeManuallyChanged() : boolean {
        return false;
    }

}

Drawing.register(CircleDrawing);
