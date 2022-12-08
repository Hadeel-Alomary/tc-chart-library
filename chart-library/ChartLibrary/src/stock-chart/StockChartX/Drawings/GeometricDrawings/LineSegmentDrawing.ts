/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Drawing} from '../Drawing';
import {IRect} from '../../Graphics/Rect';
import {Geometry} from '../../Graphics/Geometry';
import {ChartPoint, IPoint} from '../../Graphics/ChartPoint';
import {PanGesture} from '../../Gestures/PanGesture';
import {GestureState, WindowEvent} from '../../Gestures/Gesture';
import {BrowserUtils} from '../../../../utils';
import {ChartAccessorService} from '../../../../services/chart';
import {AlertableDrawing} from '../AlertableDrawing';
import {FilledShapeDrawingTheme} from '../DrawingThemeTypes';


/**
 * Represents line segment drawing.
 * @constructor LineSegmentDrawing
 * @augments Drawing
 * @example
 *  // Create line segment drawing.
 *  var line1 = new LineSegmentDrawing({
     *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
     *  });
 *
 *  // Create line segment drawing.
 *  var line2 = new LineSegmentDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
     *  });
 *
 *  // Create line segment drawing with a custom theme.
 *  var line3 = new LineSegmentDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
     *      theme: {
     *          line: {
     *              strokeColor: 'white'
     *              width: 1
     *          }
     *      }
     *  });
 */
export class LineSegmentDrawing extends AlertableDrawing<FilledShapeDrawingTheme> {
    static get className(): string {
        return 'lineSegment';
    }

    get pointsNeeded(): number {
        return 2;
    }


    public get hasTooltip():boolean{
        return BrowserUtils.isDesktop();
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

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();

        return points.length > 1 && Geometry.isPointNearPolyline(point, points);
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                if (Geometry.isPointNearPoint(this.cartesianPoint(0), event.pointerPosition))
                    this._setDragPoint(0);
                else if (Geometry.isPointNearPoint(this.cartesianPoint(1), event.pointerPosition))
                    this._setDragPoint(1);
                else
                    return false;

                return true;
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

    protected canAlertExtendRight(): boolean {
        return false;
    }

    protected canAlertExtendLeft(): boolean {
        return false;
    }

    protected getAlertFirstChartPoint():ChartPoint {
        return this.chartPoints[0].date < this.chartPoints[1].date ? this.chartPoints[0] : this.chartPoints[1];
    }

    protected getAlertSecondChartPoint():ChartPoint {
        return this.chartPoints[0].date >= this.chartPoints[1].date ? this.chartPoints[0] : this.chartPoints[1];
    }

    /**
     * @inheritdoc
     */
    draw() {
        if (!this.visible)
            return;

        let points = this.cartesianPoints();

        if (points.length > 1) {
            this.context.scxStrokePolyline(points, this.getDrawingTheme().line);
        }

        if (this.selected)
            this._drawSelectionMarkers(points);

        this.drawAlertBellIfNeeded();
    }


}

Drawing.register(LineSegmentDrawing);
