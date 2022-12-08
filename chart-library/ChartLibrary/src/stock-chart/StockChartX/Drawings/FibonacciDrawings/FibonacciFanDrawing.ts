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
import {IPoint} from "../../Graphics/ChartPoint";
import {Geometry} from "../../Graphics/Geometry";
import {PanGesture} from "../../Gestures/PanGesture";
import {GestureState, WindowEvent} from "../../Gestures/Gesture";
import {Drawing} from "../Drawing";
import {DrawingTextHorizontalPosition, DrawingTextVerticalPosition} from '../DrawingTextPosition';
import {FibonacciFanDrawingTheme} from '../DrawingThemeTypes';
import {DrawingLevelsFormatType} from '../DrawingLevelsFormatType';

/**
 * Represents fibonacci fan drawing.
 * @param {object} [config] The configuration object.
 * @param {number[]} [config.levels] The level values.
 * @constructor FibonacciFanDrawing
 * @augments FibonacciDrawingBase
 * @example
 *  // Create fibonacci fan drawing.
 *  var retracements1 = new FibonacciFanDrawing({
     *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
     *  });
 *
 *  // Create fibonacci fan drawing.
 *  var retracements2 = new FibonacciFanDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
     *  });
 *
 *  // Create fibonacci fan drawing with a custom theme.
 *  var retracemnts3 = new FibonacciFanDrawing({
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
export class FibonacciFanDrawing extends FibonacciDrawingBase<FibonacciFanDrawingTheme> {
    static get className(): string {
        return 'fibonacciFan';
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
            x3 = this.getX3(points);

        if (this.getDrawingTheme().trendLine.strokeEnabled && Geometry.isPointNearPolyline(point, points))
            return true;

        if (this.showLevelLines || this.getDrawingTheme().showLevelBackgrounds) {
            for (let level of this.levels) {
                if (!this._isLevelVisible(level))
                    continue;

                let fanY = this.getFanY(points,x3,level.value),
                    point1 = {x: x1, y: y1},
                    point2 = {x: x3, y: fanY};

                if (Geometry.isPointNearLine(point, point1, point2))
                    return true;
            }
        }

        return this.selected && Geometry.isPointNearPoint(point, points[1]);
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
                    return true;
                }
                break;
        }

        return false;
    }

    private _applyTextVerticalPosition() {
        let  baseline: string ;
        switch (this.getDrawingTheme().levelTextVerPosition) {
            case DrawingTextVerticalPosition.MIDDLE:
                baseline = 'middle';
                break;
            case DrawingTextVerticalPosition.TOP:
                baseline = 'bottom';
                break;
            case DrawingTextVerticalPosition.BOTTOM:
                baseline = 'top';
                break;
            default:
                throw new Error('Unsupported level text vertical position: ' + this.getDrawingTheme().levelTextVerPosition);
        }
        this.context.textBaseline = baseline as CanvasTextBaseline;
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
            let x1 = points[0].x,
                y1 = points[0].y,
                x2 = points[1].x,
                isOnLeftSide = x1 > x2,
                x3 = this.getX3(points),
                pointsBuffer: IPoint[] = [];

            for (let level of this.levels) {
                if (!this._isLevelVisible(level))
                    continue;

                let levelTheme = level.theme ? level.theme : theme.defaultTheme,
                    y3 =this.getFanY(points,x3,level.value);

                if (this.getDrawingTheme().showLevelBackgrounds) {
                    if (pointsBuffer.length === 2) {
                        context.beginPath();
                        context.moveTo(pointsBuffer[0].x, pointsBuffer[0].y);   // Go to first point
                        context.lineTo(pointsBuffer[1].x, pointsBuffer[1].y);   // Draw to second point
                        context.lineTo(x1, y1);                                 // Draw to third point
                        context.lineTo(x3, y3);                                 // Draw to last point
                        context.closePath();
                        context.scxFill(levelTheme.fill || theme.defaultTheme.fill);

                        pointsBuffer[0] = {x: x3, y: y3};
                        pointsBuffer[1] = {x: x1, y: y1};
                    } else {
                        pointsBuffer.push({x: x3, y: y3});
                        pointsBuffer.push({x: x1, y: y1});
                    }
                }

                if (this.showLevelLines) {
                    context.beginPath();
                    context.moveTo(x1, y1);
                    context.lineTo(x3, y3);
                    context.scxStroke(levelTheme.line || theme.defaultTheme.line);
                }

                if (this.getDrawingTheme().showLevelValues) {
                    let levelText = this.getDrawingTheme().showLevelPercents
                        ? this.formatLevelText(level.value * 100 , DrawingLevelsFormatType.PERCENT) + "%"
                        : this.formatLevelText(level.value , DrawingLevelsFormatType.LEVEL),
                        textX = isOnLeftSide ? x3 + 3 : x3 - 3;

                    if (this.getDrawingTheme().showLevelPrices) {
                        let priceText = this.formatLevelText(this.projection.valueByY(y3), DrawingLevelsFormatType.PRICE);

                        levelText += ` (${priceText})`;
                    }

                    context.scxApplyTextTheme(levelTheme.text || theme.defaultTheme.text);
                    context.textAlign = isOnLeftSide ? 'left' : 'right';
                    this._applyTextVerticalPosition();
                    context.fillText(levelText, textX, y3);
                }
            }
        }
        if (points.length > 1 && this.getDrawingTheme().trendLine.strokeEnabled) {
            context.scxStrokePolyline(points, theme.trendLine);
        }

        if (this.selected) {
            this._drawSelectionMarkers(points);
        }
    }

    private getX3(points:IPoint[]) {
        let isOnLeftSide = points[0].x > points[1].x,
            contentFrame = this.chartPanel.contentFrame;
        return isOnLeftSide ? contentFrame.left : contentFrame.right;
    }

    getFanY(points: IPoint[], x3: number, levelValue: number) {
        let value = (this.chartPoints[0].value - this.chartPoints[1].value) * levelValue + this.chartPoints[1].value,
            y = Math.round(this.projection.yByValue(value));
        return (points[0].y + (x3 - points[0].x) * (y - points[0].y) / (points[1].x - points[0].x))
    }
}

Drawing.register(FibonacciFanDrawing);
