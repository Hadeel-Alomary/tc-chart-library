/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {
    FibonacciDrawingBase
} from "./FibonacciDrawingBase";
import {Geometry} from "../../Graphics/Geometry";
import {IRect} from "../../Graphics/Rect";
import {IPoint} from "../../Graphics/ChartPoint";
import {PanGesture} from "../../Gestures/PanGesture";
import {GestureState, WindowEvent} from "../../Gestures/Gesture";
import {IMinMaxValues} from "../../Data/DataSeries";
import {Drawing} from "../Drawing";
import {FibonacciLevelLineExtension} from "./FibonacciDrawingLevelLineExtension";
import {DrawingTextHorizontalPosition, DrawingTextVerticalPosition} from '../DrawingTextPosition';
import {FibonacciSpeedResistanceFanDrawingTheme, FibonacciTimeZonesDrawingTheme} from '../DrawingThemeTypes';

/**
 * Represents fibonacci timezones drawing.
 * @param {object} [config] The configuration object.
 * @param {number[]} [config.levels] The level values.
 * @constructor FibonacciTimeZonesDrawing
 * @augments Drawing
 * @example
 *  // Create fibonacci timezones drawing.
 *  var timeZones1 = new FibonacciTimeZonesDrawing({
     *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
     *  });
 *
 *  // Create fibonacci timezones drawing.
 *  var timeZones2 = new FibonacciTimeZonesDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
     *  });
 *
 *  // Create fibonacci timezones drawing with a custom theme.
 *  var timeZones3 = new FibonacciTimeZonesDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
     *      theme: {
     *          line: {
     *              strokeColor: '#FF0000'
     *              width: 1
     *          }
     *      },
     *      levels: [{value: 0}, {value: 1}, {value: 2}, {value: 3}, {value: 5},
     *               {value: 8}, {value: 13}, {value: 21}, {value: 34}, {value: 55}, {value: 89}]
     *  });
 */
export class FibonacciTimeZonesDrawing extends FibonacciDrawingBase<FibonacciTimeZonesDrawingTheme> {
    static get className(): string {
        return 'fibonacciTimeZones';
    }

    /**
     * The level lines extension.
     * @name levelLinesExtension
     * @type {string}
     * @memberOf FibonacciDrawingBase#
     */
    get levelLinesExtension(): string {
        return FibonacciLevelLineExtension.BOTH;
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

        let square = Geometry.length(points[0], points[1]);

        return {
            left: points[0].x - square,
            top: points[0].y - square,
            width: 2 * square,
            height: 2 * square
        };
    }

    /**
     * @inheritdoc
     */
    hitTest(point: IPoint): boolean {
        let points = this.cartesianPoints();
        if (points.length < 2)
            return false;

        if (this.getDrawingTheme().trendLine.strokeEnabled && Geometry.isPointNearPolyline(point, points))
            return true;

        if (this.showLevelLines) {
            let yRange = this._linesYRange(points);

            for (let level of this.levels) {
                if (!this._isLevelVisible(level))
                    continue;

                let x = Math.round((points[1].x - points[0].x) * level.value + points[0].x),
                    point1 = {x: x, y: yRange.max},
                    point2 = {x: x, y: yRange.min};

                if (Geometry.isPointNearLine(point, point1, point2))
                    return true;
            }
        }

        return this.selected && Geometry.isPointNearPoint(point, points);
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

    private _applyTextHorizontalPosition() {
        let align :string;
        switch (this.getDrawingTheme().levelTextHorPosition) {
            case DrawingTextHorizontalPosition.CENTER:
                align = 'center';
                break;
            case DrawingTextHorizontalPosition.LEFT:
                align = 'right';
                break;
            case DrawingTextHorizontalPosition.RIGHT:
                align = 'left';
                break;
            default:
                throw new Error('Unsupported level text horizontal position: ' + this.getDrawingTheme().levelTextHorPosition);
        }
        this.context.textAlign = align as CanvasTextAlign;
    }

    private _applyTextVerticalPosition() {
        let baseline :string;
        switch (this.getDrawingTheme().levelTextVerPosition) {
            case DrawingTextVerticalPosition.MIDDLE:
                baseline = 'middle';
                break;
            case DrawingTextVerticalPosition.TOP:
                baseline = 'top';
                break;
            case DrawingTextVerticalPosition.BOTTOM:
                baseline = 'bottom';
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
            let yRange = this._linesYRange(points),
                prevX: number,
                textY: number;

            if (this.getDrawingTheme().showLevelValues) {
                switch (this.getDrawingTheme().levelTextVerPosition) {
                    case DrawingTextVerticalPosition.MIDDLE:
                        textY = (yRange.min + yRange.max) / 2;
                        break;
                    case DrawingTextVerticalPosition.TOP:
                        textY = yRange.min;
                        break;
                    case DrawingTextVerticalPosition.BOTTOM:
                        textY = yRange.max;
                        break;
                }
            }

            for (let level of this.levels) {
                if (!this._isLevelVisible(level))
                    continue;

                let levelTheme = level.theme ? level.theme : theme.defaultTheme,
                    x = Math.round((points[1].x - points[0].x) * level.value + points[0].x);


                if (this.showLevelLines) {
                    context.beginPath();

                    context.moveTo(x, yRange.min);
                    context.lineTo(x, yRange.max);

                    context.scxStroke(levelTheme.line || theme.defaultTheme.line);
                }

                if (this.getDrawingTheme().showLevelValues) {
                    let text = Number(level.value).toFixed(0);

                    context.scxApplyTextTheme(levelTheme.text || theme.defaultTheme.text);
                    this._applyTextHorizontalPosition();
                    this._applyTextVerticalPosition();
                    context.fillText(text, this._adjustXWithTextOffset(this.getDrawingTheme(), x),textY);
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

    private _linesYRange(points: IPoint[]): IMinMaxValues<number> {
        let contentFrame = this.chartPanel.contentFrame,
            max = Math.max(points[0].y, points[1].y),
            min = Math.min(points[0].y, points[1].y);

        switch (this.levelLinesExtension) {
            case FibonacciLevelLineExtension.NONE:
                break;
            case FibonacciLevelLineExtension.TOP:
                min = contentFrame.top;
                break;
            case FibonacciLevelLineExtension.BOTTOM:
                max = contentFrame.bottom;
                break;
            case FibonacciLevelLineExtension.BOTH:
                min = contentFrame.top;
                max = contentFrame.bottom;
                break;
            default:
                throw new Error('Unknown level lines extension: ' + this.levelLinesExtension);
        }

        return {
            min: min,
            max: max
        };
    }
}

Drawing.register(FibonacciTimeZonesDrawing);
