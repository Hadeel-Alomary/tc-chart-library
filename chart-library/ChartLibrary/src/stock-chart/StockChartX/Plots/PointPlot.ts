/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IPlotConfig, IPlotDefaults, IPlotOptions, Plot} from "./Plot";
import {IPoint} from "../Graphics/ChartPoint";
import {Geometry} from "../Graphics/Geometry";
import {IMinMaxValues} from "../Data/DataSeries";
import {Chart} from '../Chart';

export interface IPointPlotOptions extends IPlotOptions {
    pointSize: number;
}

export interface IPointPlotConfig extends IPlotConfig {
    pointSize?: number;
}

export interface IPointPlotDefaults extends IPlotDefaults {
    pointSize: number;
}

const PointPlotStyle = {
    DOT: "dot"
};
Object.freeze(PointPlotStyle);


/**
 * Describes points plot.
 * @param {Object} [config] The configuration object.
 * @constructor PointPlot
 * @augments Plot
 * @example
 *  var plot = new PointPlot({
     *      dataSeries: closeDataSeries
     *  });
 */
export class PointPlot extends Plot {
    static Style = PointPlotStyle;
    static defaults: IPointPlotDefaults = {
        plotStyle: PointPlot.Style.DOT,
        pointSize: 2
    };

    /**
     * Gets plot's point size.
     * @name pointSize
     * @type {number}
     * @memberOf PointPlot#
     */
    get pointSize(): number {
        //NK in case there is no data
        if (this.chart.dateScale.columnWidth <= 0) {
            return 0;
        }

        // MA size the circle to be relative to the dateScale of the chart (growing on zooming in and
        // shrinking on zooming out)
        return this.chart.dateScale.columnWidth / 4;
    }

    constructor(chart:Chart, config?: IPointPlotConfig) {
        super(chart, config);

        this._plotThemeKey = 'point';
    }

    /**
     * @inheritdoc
     */
    draw() {
        if (!this.visible)
            return;

        let params = this._valueDrawParams();
        if (params.values.length === 0)
            return;

        let context = params.context,
            projection = params.projection,
            dates = params.dates,
            prevX: number = null,
            valuesSameX: number[] = [],
            ySameX: number[] = [],
            x: number;

        context.scxApplyStrokeTheme(params.theme);
        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let value = params.values[i];
            if (value == null)
                continue;

            x = dates ? projection.xByDate(dates[i]) : projection.xByColumn(column);
            if (x === prevX) {
                if (valuesSameX.indexOf(value) >= 0)
                    continue;

                let y = projection.yByValue(value);
                if (ySameX.indexOf(y) >= 0)
                    continue;

                valuesSameX.push(value);
                ySameX.push(y);
                continue;
            }

            if (prevX != null) {
                this.drawPoints(context, prevX, ySameX);
                ySameX.length = valuesSameX.length = 0;
            }

            prevX = x;
            valuesSameX.push(value);
            ySameX.push(projection.yByValue(value));
        }
        this.drawPoints(context, x, ySameX);
    }

    public drawSelectionPoints(): void {
        if (!this.visible) {
            return;
        }

        let params = this._valueDrawParams();
        if (params.values.length === 0)
            return;

        for (let i = params.endIndex - 10; i >= params.startIndex; i = i - 10) {
            let value = params.values[i];
            if (value == null || isNaN(value))
                continue;

            let x = params.projection.xByRecord(i),
                y = params.projection.yByValue(value);

            this.drawSelectionCircle(x, y);
        }
    }

    private drawPoints(context: CanvasRenderingContext2D, x: number, ySameX: number[]) {
        for (let j = 0, yCount = ySameX.length; j < yCount; j++) {
            context.beginPath();
            context.arc(x, ySameX[j], this.pointSize, 0, 2 * Math.PI);
            context.stroke();
        }
    }

    hitTest(point: IPoint) {
        let params = this._valueDrawParams();

        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let value = params.values[i];
            if (value == null)
                continue;

            let x = this.projection.xByColumn(column);
            if (x <= point.x && point.x <= x + this.chart.dateScale.columnWidth) {
                let y = this.projection.yByValue(value);
                if (Geometry.isPointInsideOrNearCircle(point, {x: x, y: y}, this.pointSize)) {
                    return true;
                }
            }
        }
        return false;
    }

    updateMinMaxForSomePlotsIfNeeded(min: number, max: number): IMinMaxValues<number> {
        let height = this.valueScale.rightPanel.frame.height,
            pixelsPerUnit = (max - min) / height,
            yOffset = this.pointSize * pixelsPerUnit * 2;

        return {
            min: min - yOffset,
            max: max + yOffset
        };
    }
}
