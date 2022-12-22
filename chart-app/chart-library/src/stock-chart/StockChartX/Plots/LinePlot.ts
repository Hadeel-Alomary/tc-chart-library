/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IPlotConfig, IPlotDefaults, Plot} from "./Plot";
import {IPoint} from "../Graphics/ChartPoint";
import {Geometry} from "../Graphics/Geometry";
import {MountainLinePlotTheme} from '../Theme';
import {Chart} from '../Chart';

export interface ILinePlotConfig extends IPlotConfig {

}

export interface ILinePlotDefaults extends IPlotDefaults {

}

const LinePlotStyle = {
    SIMPLE: "simple",
    MOUNTAIN: "mountain",
    STEP: "step"
};
Object.freeze(LinePlotStyle);

const PointEpsilon = 1.8;
const ValueEpsilon = 1E-5;

/**
 * Describes line plot.
 * @param {Object} [config] The configuration object.
 * @constructor LinePlot
 * @augments Plot
 * @example
 *  var plot = new LinePlot({
     *      dataSeries: closeDataSeries
     *  });
 */
export class LinePlot extends Plot {
    static Style = LinePlotStyle;

    static defaults: ILinePlotDefaults = {
        plotStyle: LinePlotStyle.SIMPLE
    };

    constructor(chart:Chart, config?: ILinePlotConfig) {
        super(chart, config);

        this._plotThemeKey = 'line';
    }

    /**
     * @inheritdoc
     */
    draw() {
        if (!this.visible)
            return;

        switch (this.plotStyle) {
            case LinePlotStyle.MOUNTAIN:
                this._drawMountainLine();
                break;
            case LinePlotStyle.STEP:
                this._drawStepLine();
                break;
            default:
                this._drawSimpleLine();
                break;
        }
    }

    public drawSelectionPoints(): void {
        if (!this.visible) {
            return;
        }

        let params = this._valueDrawParams();
        if (params.values.length === 0)
            return;

        let projection = params.projection;

        for (let i = params.endIndex - 10; i >= params.startIndex; i = i - 10) {
            let value = params.values[i];
            if (value == null || isNaN(value))
                continue;

            let x = projection.xByRecord(i),
                y = projection.yByValue(value);

            this.drawSelectionCircle(x, y);
        }
    }

    private _drawSimpleLine() {
        let params = this._valueDrawParams();
        if (params.values.length === 0)
            return;

        let context = params.context,
            projection = params.projection,
            dates = params.dates,
            prevX: number = null,
            lastValue: number = null,
            minValue = Infinity,
            maxValue = -Infinity,
            breakLine = true,
            curY: number = null;

        context.beginPath();

        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let value = params.values[i];
            if (value == null)
                continue;

            let isNaNValue = value !== value;
            if (isNaNValue && breakLine)
                continue;

            let x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column);

            if (breakLine) {
                context.moveTo(x, projection.yByValue(value));
                breakLine = false;
                continue;
            }
            if (isNaNValue)
                breakLine = true;
            if (!breakLine && x == prevX) {
                // We have several records at the same X coordinate.
                // Save min/max/last values to draw just 1 vertical line later.
                minValue = Math.min(minValue, value);
                maxValue = Math.max(maxValue, value);
                lastValue = value;

                continue;
            }

            if (minValue !== Infinity) {
                // We have several records at the same X coordinate. Draw single vertical line.
                let minY = projection.yByValue(minValue);
                let isNewMinY = Math.abs(curY - minY) > PointEpsilon;

                if (Math.abs(maxValue - minValue) < ValueEpsilon) {
                    // We have the same min/max values. So just draw line to this point.
                    if (isNewMinY)
                        context.lineTo(prevX, minY);
                } else {
                    let maxY = projection.yByValue(maxValue);
                    if (Math.abs(maxY - minY) < PointEpsilon) {
                        // Min/Max values are different but they are pointed to the same Y coordinate.
                        // Draw line to this coordinate.
                        if (isNewMinY)
                            context.lineTo(prevX, minY);
                    } else {
                        // Min/Max values are different. Draw vertical line.
                        if (isNewMinY)
                            context.moveTo(prevX, minY);
                        context.lineTo(prevX, maxY);
                        // Move to the Y of the last value.
                        if (Math.abs(lastValue - maxValue) > ValueEpsilon) {
                            let y = projection.yByValue(lastValue);
                            if (Math.abs(y - maxY) > PointEpsilon)
                                context.moveTo(prevX, y);
                        }
                    }
                }
            }

            if (!breakLine) {
                // Add line to the current point
                curY = projection.yByValue(value);
                context.lineTo(x, curY);
                minValue = maxValue = lastValue = value;
            } else {
                minValue = Infinity;
                maxValue = lastValue = -Infinity;
                curY = null;
            }

            prevX = x;
        }
        if (minValue !== Infinity && minValue !== maxValue) {
            context.moveTo(prevX, projection.yByValue(minValue));
            context.lineTo(prevX, projection.yByValue(maxValue));
        }
        context.scxApplyStrokeTheme((params.theme as MountainLinePlotTheme).line || params.theme);
        context.stroke();
    }

    private _drawMountainLine() {
        let params = this._valueDrawParams();
        if (params.values.length === 0)
            return;

        let context = params.context,
            projection = params.projection,
            startX: number = null,
            prevX: number = null,
            minValue = Infinity,
            breakLine = true,
            maxY = this.chartPanel.canvas.height();

        context.scxApplyFillTheme((params.theme as MountainLinePlotTheme).fill);
        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let value = params.values[i];
            if (value == null)
                continue;

            let isNaNValue = value !== value;
            if (isNaNValue && breakLine)
                continue;

            let x = projection.xByColumn(column);
            if (breakLine) {
                context.beginPath();
                context.moveTo(x, projection.yByValue(value));
                startX = prevX = x;
                breakLine = false;
                continue;
            }
            if (isNaNValue)
                breakLine = true;
            if (!breakLine && x === prevX) {
                // We have several records at the same X coordinate. Save min/max/last values to draw just 1 vertical line later.
                minValue = Math.min(minValue, value);

                continue;
            }

            if (minValue !== Infinity) {
                context.lineTo(prevX, projection.yByValue(minValue));
            }

            if (!breakLine) {
                // Add line to current point
                context.lineTo(x, projection.yByValue(value));
                minValue = value;
            } else {
                minValue = Infinity;

                context.lineTo(prevX, maxY);
                context.lineTo(startX, maxY);
                context.closePath();
                context.fill();
                startX = x;
            }

            prevX = x;
        }
        if (minValue !== Infinity) {
            context.lineTo(prevX, projection.yByValue(minValue));
        }

        context.lineTo(prevX, maxY);
        context.lineTo(startX, maxY);
        context.closePath();
        context.fill();

        this._drawSimpleLine();
    }

    private _drawStepLine() {
        let params = this._valueDrawParams();
        if (params.values.length === 0)
            return;

        let context = params.context,
            projection = params.projection,
            dates = params.dates,
            prevX: number = null,
            prevY: number = null,
            lastValue: number = null,
            minValue: number = Infinity,
            maxValue: number = -Infinity,
            x: number,
            breakLine = true;

        context.beginPath();
        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let value = params.values[i];
            if (value == null)
                continue;

            let isNaNValue = value !== value;
            if (isNaNValue && breakLine)
                continue;

            x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column);
            if (breakLine) {
                prevX = x;
                prevY = projection.yByValue(value);
                context.moveTo(x, prevY);
                minValue = maxValue = value;
                breakLine = false;
                continue;
            }
            if (isNaNValue)
                breakLine = true;
            if (!breakLine && x === prevX) {
                // We have several records at the same X coordinate. Save min/max/last values to draw just 1 vertical line later.
                minValue = Math.min(minValue, value);
                maxValue = Math.max(maxValue, value);
                lastValue = value;

                continue;
            }
            if (!breakLine) {
                context.lineTo(prevX, prevY);

                let minY = projection.yByValue(minValue);
                if (Math.abs(maxValue - minValue) < ValueEpsilon) {
                    context.lineTo(prevX, minY);
                    prevY = minY;
                } else {
                    let maxY = projection.yByValue(maxValue);
                    if (Math.abs(maxY - minY) < PointEpsilon) {
                        context.lineTo(prevX, minY);
                        prevY = minY;
                    } else {
                        context.moveTo(prevX, minY);
                        context.lineTo(prevX, maxY);

                        prevY = projection.yByValue(lastValue);
                        context.moveTo(prevX, prevY);
                    }
                }

                minValue = maxValue = lastValue = value;
            } else {
                minValue = Infinity;
                maxValue = lastValue = -Infinity;
            }

            prevX = x;
        }

        if (lastValue != null && lastValue !== -Infinity) {
            context.lineTo(x, prevY);
            context.lineTo(x, projection.yByValue(lastValue));
        }

        context.scxApplyStrokeTheme((params.theme as MountainLinePlotTheme).line || params.theme);
        context.stroke();
    }


    hitTest(point: IPoint): boolean {
        let params = this._valueDrawParams();
        if (params.values.length === 0)
            return false;

        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let value = params.values[i];

            if (value == null)
                continue;

            let x = this.projection.xByColumn(column);

            if (x <= point.x && point.x <= x + this.chart.dateScale.columnWidth) {

                let nextX = this.projection.xByColumn(column + 1);

                let nextEntry = Math.min(i + 1, params.endIndex);

                let y = this.projection.yByValue(value);
                let nextY = this.projection.yByValue(params.values[nextEntry]);

                if (Geometry.isPointNearLine(point, {x: x, y: y}, {x: nextX, y: nextY}))
                    return true;
            }
        }

        return false;
    }
}
