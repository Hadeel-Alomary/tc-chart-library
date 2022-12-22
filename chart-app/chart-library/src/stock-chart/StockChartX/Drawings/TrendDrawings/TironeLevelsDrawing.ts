/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Drawing} from "../Drawing";
import {IPoint} from "../../Graphics/ChartPoint";
import {IRect} from "../../Graphics/Rect";
import {Geometry} from "../../Graphics/Geometry";
import {PanGesture} from "../../Gestures/PanGesture";
import {GestureState, WindowEvent} from "../../Gestures/Gesture";
import {DataSeriesSuffix} from "../../Data/DataSeries";
import {LineDrawingTheme} from '../DrawingThemeTypes';
import {ThemedDrawing} from '../ThemedDrawing';

/**
 * Represents tirone levels drawing.
 * @constructor TironeLevelsDrawing
 * @augments Drawing
 * @example
 *  // Create tirone levels drawing.
 *  var drawing1 = new TironeLevelsDrawing({
     *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
     *  });
 *
 *  // Create tirone levels drawing.
 *  var drawing2 = new TironeLevelsDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
     *  });
 *
 *  // Create tirone levels drawing with a custom theme.
 *  var drawing3 = new TironeLevelsDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
     *      theme: {
     *          line: {
     *              strokeColor: 'white'
     *              width: 2
     *          }
     *      }
     *  });
 */
export class TironeLevelsDrawing extends ThemedDrawing<LineDrawingTheme> {
    static get className(): string {
        return 'tironeLevels';
    }

    private _drawingPoints: IPoint[];

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

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        if (this.chartPoints.length < this.pointsNeeded)
            return false;

        let p = this._drawingPoints;
        return Geometry.isPointNearLine(point, p[0], p[1]) ||
            Geometry.isPointNearLine(point, p[2], p[3]) ||
            Geometry.isPointNearLine(point, p[4], p[5]);
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

    _finishUserDrawing() {
        super._finishUserDrawing();

        let points = this.cartesianPoints();

        if (points[0].x > points[1].x) {
            this.chartPoints[0].moveToPoint(points[1], this.projection);
            this.chartPoints[1].moveToPoint(points[0], this.projection);
        }

        this._drawingPoints = this._calculateDrawingPoints(points);
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

        if (points.length > 1) {
            context.beginPath();

            let p = this._drawingPoints = this._calculateDrawingPoints(points);
            this._moveMainLineYPoint(p[2].y, p[3].y);

            context.moveTo(p[0].x, p[0].y);
            context.lineTo(p[1].x, p[1].y);

            context.moveTo(p[2].x, p[2].y);
            context.lineTo(p[3].x, p[3].y);

            context.moveTo(p[4].x, p[4].y);
            context.lineTo(p[5].x, p[5].y);

            context.scxStroke(theme.line);

            points = this._getMainLinePoints();
        }
        if (this.selected)
            this._drawSelectionMarkers(points);
    }

    protected _calculateDrawingPoints(points: IPoint[]): IPoint[] {
        let point1 = points[0],
            point2 = points[1],
            projection = this.projection,
            r1 = projection.recordByX(point1.x),
            r2 = projection.recordByX(point2.x);

        let record1 = Math.min(r1, r2),
            record2 = Math.max(r1, r2);

        let high = this.chart.primaryDataSeries(DataSeriesSuffix.HIGH),
            highestHigh = 0;
        for (let i = record1; i < record2; i++) {
            let value = <number> high.valueAtIndex(i);

            if (value > highestHigh) {
                highestHigh = value;
            }
        }

        let low = this.chart.primaryDataSeries(DataSeriesSuffix.LOW),
            lowestLow = highestHigh;
        for (let i = record1; i < record2; i++) {
            let value = <number> low.valueAtIndex(i);
            if (value < lowestLow) {
                lowestLow = value;
            }
        }

        let value = highestHigh - ((highestHigh - lowestLow) / 3);
        let y1 = projection.yByValue(value),
            y2 = y1;

        value = lowestLow + (highestHigh - lowestLow) / 2;
        let y3 = projection.yByValue(value),
            y4 = y3;

        value = lowestLow + (highestHigh - lowestLow) / 3;
        let y5 = projection.yByValue(value),
            y6 = y5;

        return [
            {x: point1.x, y: y1},
            {x: point2.x, y: y2},
            {x: point1.x, y: y3},
            {x: point2.x, y: y4},
            {x: point1.x, y: y5},
            {x: point2.x, y: y6}
        ];
    }

    private _getMainLinePoints(): IPoint[] {
        return [
            this._drawingPoints[2],
            this._drawingPoints[3]
        ];
    }

    private _moveMainLineYPoint(y1: number, y2: number): void {
        this.chartPoints[0].moveToY(y1, this.projection);
        this.chartPoints[1].moveToY(y2, this.projection);
    }
}

Drawing.register(TironeLevelsDrawing);
