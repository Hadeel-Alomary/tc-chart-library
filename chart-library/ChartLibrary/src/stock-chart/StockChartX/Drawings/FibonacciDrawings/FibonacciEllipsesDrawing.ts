/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {FibonacciDrawingBase} from "./FibonacciDrawingBase";
import {IRect} from "../../Graphics/Rect";
import {Geometry} from "../../Graphics/Geometry";
import {IPoint} from "../../Graphics/ChartPoint";
import {PanGesture} from "../../Gestures/PanGesture";
import {GestureState, WindowEvent} from "../../Gestures/Gesture";
import {Drawing} from "../Drawing";
import {FibonacciEllipsesDrawingTheme, LevelThemeElement} from '../DrawingThemeTypes';
import {DrawingLevelsFormatType} from '../DrawingLevelsFormatType';

/**
 * Represents fibonacci ellipses drawing.
 * @param {object} [config] The configuration object.
 * @param {number[]} [config.levels] The level values.
 * @constructor FibonacciEllipsesDrawing
 * @augments FibonacciDrawingBase
 * @example
 *  // Create fibonacci ellipses drawing.
 *  var ellipses1 = new FibonacciEllipsesDrawing({
     *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
     *  });
 *
 *  // Create fibonacci ellipses drawing.
 *  var ellipses2 = new FibonacciEllipsesDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
     *  });
 *
 *  // Create fibonacci ellipses drawing with a custom theme and levels.
 *  var ellipses3 = new FibonacciEllipsesDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
     *      theme: {
     *          line: {
     *              strokeColor: '#FF0000'
     *              width: 1
     *          }
     *      },
     *      levels: [{value: 0.382}, {value: 0.5}, {value: 0.618}]
     *  });
 */
export class FibonacciEllipsesDrawing extends FibonacciDrawingBase<FibonacciEllipsesDrawingTheme> {
    static get className(): string {
        return 'fibonacciEllipses';
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
        if (points.length < this.pointsNeeded)
            return false;

        if (this.getDrawingTheme().trendLine.strokeEnabled && Geometry.isPointNearPolyline(point, points))
            return true;

        if (this.showLevelLines || this.getDrawingTheme().showLevelBackgrounds) {
            let horRadius = Geometry.xProjectionLength(points[0], points[1]),
                verRadius = Geometry.yProjectionLength(points[0], points[1]);

            for (let level of this.levels) {
                if (!this._isLevelVisible(level))
                    continue;

                let h = Math.round(horRadius * level.value),
                    v = Math.round(verRadius * level.value);

                if (Geometry.isPointNearEllipseWithRadiuses(point, points[0], h, v))
                    return true;
            }
        }

        return this.selected && Geometry.isPointNearPoint(point, points);
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean {
        switch (gesture.state) {
            case GestureState.STARTED:
                let point = this.cartesianPoint(1);
                if (point && Geometry.isPointNearPoint(event.pointerPosition, point)) {
                    this._setDragPoint(1);
                    return true;
                }
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint === 1) {
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

        let points = this.cartesianPoints();
        if (points.length === 0)
            return;

        let context = this.context,
            theme = this.getDrawingTheme();

        if (points.length > 1) {
            let centerX = points[0].x,
                centerY = points[0].y,
                horRadius = Geometry.xProjectionLength(points[0], points[1]),
                verRadius = Geometry.yProjectionLength(points[0], points[1]),
                prevH: number;


            for (let level of this.levels) {
                if (!this._isLevelVisible(level))
                    continue;

                let levelTheme:LevelThemeElement = level.theme ? level.theme : theme.defaultTheme,
                    h = Math.round(horRadius * level.value),
                    v = Math.round(verRadius * level.value);

                if (this.getDrawingTheme().showLevelBackgrounds) {
                    let fillTheme = levelTheme.fill || theme.defaultTheme.fill;

                    context.save();
                    context.beginPath();
                    context.translate(centerX, centerY);
                    if (h !== v)
                        context.scale(1, v / h);
                    context.arc(0, 0, h, 0, 2 * Math.PI, false);
                    if (prevH) {
                        context.arc(0, 0, prevH, 0, 2 * Math.PI, false);
                        context.scxApplyFillTheme(fillTheme);
                        context.fill("evenodd");
                    } else {
                        context.scxFill(fillTheme);
                    }
                    context.restore();

                    prevH = h;
                }

                if (this.showLevelLines) {
                    context.beginPath();
                    context.save();
                    context.translate(centerX, centerY);
                    if (h !== v)
                        context.scale(1, v / h);
                    context.arc(0, 0, h, 0, 2 * Math.PI);
                    context.restore();
                    context.scxStroke(levelTheme.line || theme.defaultTheme.line);
                }

                if (this.getDrawingTheme().showLevelValues) {
                    let levelText = this.getDrawingTheme().showLevelPercents
                        ?  this.formatLevelText(level.value * 100 , DrawingLevelsFormatType.PERCENT) + "%"
                        :  this.formatLevelText(level.value , DrawingLevelsFormatType.LEVEL);

                    context.scxApplyTextTheme(levelTheme.text || theme.defaultTheme.text);
                    this._applyTextPosition(this.getDrawingTheme());
                    context.fillText(levelText, centerX, centerY + v);
                }
            }

            if (this.getDrawingTheme().trendLine.strokeEnabled) {
                context.scxStrokePolyline(points, theme.trendLine);
            }
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }
}

Drawing.register(FibonacciEllipsesDrawing);
