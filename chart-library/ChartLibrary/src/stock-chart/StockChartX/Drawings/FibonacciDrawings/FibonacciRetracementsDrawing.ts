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
import {IRect} from "../../Graphics/Rect";
import {Geometry} from "../../Graphics/Geometry";
import {IPoint} from "../../Graphics/ChartPoint";
import {PanGesture} from "../../Gestures/PanGesture";
import {GestureState, WindowEvent} from "../../Gestures/Gesture";
import {IMinMaxValues} from "../../Data/DataSeries";
import {DummyCanvasContext} from "../../Utils/DummyCanvasContext";
import {Drawing, IDrawingLevel} from '../Drawing';
import {FibonacciLevelLineExtension} from "./FibonacciDrawingLevelLineExtension";
import {DrawingTextHorizontalPosition} from "../DrawingTextPosition";
import {FibonacciExtendedLevelsDrawingTheme, LevelTextThemeElement} from '../DrawingThemeTypes';
import {DrawingLevelsFormatType} from '../DrawingLevelsFormatType';

/**
 * Represents fibonacci retracements drawing.
 * @param {object} [config] The configuration object.
 * @param {number[]} [config.levels] The level values.
 * @constructor FibonacciRetracementsDrawing
 * @augments FibonacciDrawingBase
 * @example
 *  // Create fibonacci retracements drawing.
 *  var retracements1 = new FibonacciRetracementsDrawing({
     *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
     *  });
 *
 *  // Create fibonacci retracements drawing.
 *  var retracements2 = new FibonacciRetracementsDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
     *  });
 *
 *  // Create fibonacci retracements drawing with a custom theme.
 *  var retracemnts3 = new FibonacciRetracementsDrawing({
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
export class FibonacciRetracementsDrawing extends FibonacciDrawingBase<FibonacciExtendedLevelsDrawingTheme> {
    static get className(): string {
        return 'fibonacciRetracements';
    }

    /**
     * The flag that indicates whether levels are reversed.
     * @name reverse
     * @type {boolean}
     * @memberOf FibonacciDrawingBase#
     */
    get reverse(): boolean {
        return this.getDrawingTheme().reverse;
    }


    /**
     * The level lines extension.
     * @name levelLinesExtension
     * @type {string}
     * @memberOf FibonacciDrawingBase#
     */
    get levelLinesExtension(): string {
        return this.getDrawingTheme().levelLinesExtension;
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

        if (points.length < this.pointsNeeded)
            return false;

        if (this.getDrawingTheme().trendLine.strokeEnabled && Geometry.isPointNearPolyline(point, points))
            return true;

        if (this.showLevelLines || this.getDrawingTheme().showLevelBackgrounds) {

            let xRange = this._linesXRange(points),
                quarter = this._getQuarter(points);

            for (let level of this.levels) {
                if (!this._isLevelVisible(level))
                    continue;

                let levelY = this.getLevelY(quarter, points, level.value);
                let levelPoints: IPoint[] = [{x: xRange.min, y: levelY}, {x: xRange.max, y: levelY}];

                if (Geometry.isPointNearLine(point, levelPoints[0], levelPoints[1]))
                    return true;
            }
        }

        return this.selected && Geometry.isPointNearPoint(point, points);
    }

    private getLevelY(quarter: number, points: IPoint[], levelValue: number): number {
        let levelPrice = this._calculateValueByY(quarter, levelValue),
            y = this.projection.yByValue(levelPrice);
        return y;
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
            let xRange = this._linesXRange(points),
                prevY: number,
                textX: number;

            if (this.getDrawingTheme().showLevelValues) {
                switch (this.getDrawingTheme().levelTextHorPosition) {
                    case DrawingTextHorizontalPosition.CENTER:
                        textX = (xRange.min + xRange.max) / 2;
                        break;
                    case DrawingTextHorizontalPosition.LEFT:
                        textX = xRange.min;
                        break;
                    case DrawingTextHorizontalPosition.RIGHT:
                        textX = xRange.max;
                        break;
                    default:
                        throw new Error('Unknown text horizontal position: ' + this.getDrawingTheme().levelTextHorPosition);
                }
                textX = this._adjustXWithTextOffset(this.getDrawingTheme(), textX);
            }

            let quarter = this._getQuarter(points);

            for (let level of this.levels) {
                if (!this._isLevelVisible(level))
                    continue;

                let levelTheme = level.theme ? level.theme : theme.defaultTheme,
                    y = this.getLevelY(quarter, points, level.value);

                if (this.getDrawingTheme().showLevelBackgrounds) {
                    if (prevY) {
                        context.beginPath();
                        context.moveTo(xRange.min, prevY);  // Go to first point
                        context.lineTo(xRange.max, prevY);  // Draw to second point
                        context.lineTo(xRange.max, y);      // Draw to third point
                        context.lineTo(xRange.min, y);      // Draw to last point
                        context.closePath();
                        context.scxFill(levelTheme.fill || theme.defaultTheme.fill);
                    }
                    prevY = y;
                }

                if (this.showLevelLines) {
                    context.beginPath();
                    context.moveTo(xRange.min, y);
                    context.lineTo(xRange.max, y);
                    context.scxStroke(levelTheme.line || theme.defaultTheme.line);
                }

                if (this.getDrawingTheme().showLevelValues) {
                    let levelText = this.getDrawingTheme().showLevelPercents
                        ? this.formatLevelText((level.value * 100), DrawingLevelsFormatType.PERCENT) + '%'
                        : this.formatLevelText(level.value, DrawingLevelsFormatType.LEVEL);

                    if (this.getDrawingTheme().showLevelPrices) {
                        let priceText = this.formatLevelText(this.projection.valueByY(y), DrawingLevelsFormatType.PRICE);

                        levelText += ` (${priceText})`;
                    }

                    context.scxApplyTextTheme(levelTheme.text || theme.defaultTheme.text);
                    this._applyTextPosition(this.getDrawingTheme());
                    context.fillText(levelText, this._adjustWithTextWidth(textX, levelText, levelTheme.text || theme.defaultTheme.text),
                        this._adjustYWithTextOffset(this.getDrawingTheme(), y));
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

    private _getQuarter(points: IPoint[]) {
        let quarter = 0;
        if (points[0].y < points[1].y) {
            if (points[0].x < points[1].x) {
                quarter = 4;
            } else {
                quarter = 3;
            }
        } else {
            if (points[0].x < points[1].x) {
                quarter = 1;
            } else {
                quarter = 2;
            }
        }

        if (this.reverse) {
            quarter = quarter + 4;
        }

        return quarter;
    }

    private _calculateValueByY(quarter: number, levelValue: number): number {
        //NK we did this calculation to match ticker chart behavior
        let chartPoints = this.chartPoints;
        let firstPrice = chartPoints[0].value;
        let secondPrice = chartPoints[1].value;
        switch (quarter) {
            case 1:
                return secondPrice + ((firstPrice - secondPrice) * levelValue);
            case 2:
                return firstPrice - ((firstPrice - secondPrice) * levelValue);
            case 3:
                return firstPrice + ((secondPrice - firstPrice) * levelValue);
            case 4:
                return secondPrice - ((secondPrice - firstPrice) * levelValue);

            // Reverse cases
            case 5: // revers 1
                return firstPrice - ((firstPrice - secondPrice) * levelValue);
            case 6: // revers 2
                return secondPrice + ((firstPrice - secondPrice) * levelValue);
            case 7: // revers 3
                return secondPrice - ((secondPrice - firstPrice) * levelValue);
            case 8: // revers 4
                return firstPrice + ((secondPrice - firstPrice) * levelValue);
            default:
                throw new Error('Unknown quarter for Fibonacci');
        }
    }

    private _linesXRange(points: IPoint[]): IMinMaxValues<number> {
        let contentFrame = this.chartPanel.contentFrame,
            min = Math.min(points[0].x, points[1].x),
            max = Math.max(points[0].x, points[1].x);

        switch (this.levelLinesExtension) {
            case FibonacciLevelLineExtension.NONE:
                break;
            case FibonacciLevelLineExtension.LEFT:
                min = contentFrame.left;
                break;
            case FibonacciLevelLineExtension.RIGHT:
                max = contentFrame.right;
                break;
            case FibonacciLevelLineExtension.BOTH:
                min = contentFrame.left;
                max = contentFrame.right;
                break;
            default:
                throw new Error('Unknown level lines extension: ' + this.levelLinesExtension);
        }

        return {
            min: min,
            max: max
        };
    }

    private _adjustWithTextWidth(x: number, text: string, textTheme: LevelTextThemeElement): number {
        switch (this.levelLinesExtension) {
            case FibonacciLevelLineExtension.LEFT:
                if (this.getDrawingTheme().levelTextHorPosition == DrawingTextHorizontalPosition.LEFT) {
                    x = x + Math.ceil(DummyCanvasContext.textWidth(text, textTheme) + this._textOffset);
                }
                break;
            case FibonacciLevelLineExtension.RIGHT:
                if (this.getDrawingTheme().levelTextHorPosition == DrawingTextHorizontalPosition.RIGHT) {
                    x = x - Math.ceil(DummyCanvasContext.textWidth(text, textTheme) + this._textOffset);
                }
                break;
            case FibonacciLevelLineExtension.BOTH:
                if (this.getDrawingTheme().levelTextHorPosition == DrawingTextHorizontalPosition.RIGHT) {
                    x = x - Math.ceil(DummyCanvasContext.textWidth(text, textTheme) + this._textOffset);
                } else if (this.getDrawingTheme().levelTextHorPosition == DrawingTextHorizontalPosition.LEFT) {
                    x = x + Math.ceil(DummyCanvasContext.textWidth(text, textTheme) + this._textOffset);
                }
                break;
        }

        return x;
    }
}

Drawing.register(FibonacciRetracementsDrawing);
