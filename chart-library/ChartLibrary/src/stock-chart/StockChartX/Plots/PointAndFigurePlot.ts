/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {BarPlot} from "./BarPlot";
import {IPlotBarDrawParams} from "./Plot";
import {IPoint} from "../Graphics/ChartPoint";
import {Geometry} from "../Graphics/Geometry";
import {LineCandlePlotTheme} from '../Theme';

export class PointAndFigurePlot extends BarPlot {
    private _boxSize: number;
    get boxSize(): number {
        return this._boxSize;
    }

    set boxSize(value: number) {
        this._boxSize = value;
    }

    draw() {
        if (!this.visible)
            return;

        let params = this._barDrawParams();
        if (params.values.length === 0)
            return;

        // Draw X columns.
        params.context.beginPath();
        this._drawColumns(params, true);
        params.context.scxStroke((params.theme as LineCandlePlotTheme).upCandle.border);

        // Draw O columns.
        this._drawColumns(params, false);
    }

    private _drawColumns(params: IPlotBarDrawParams, drawXColumns: boolean) {
        let context = params.context,
            projection = params.projection,
            boxSize = this.boxSize,
            columnWidth = this.chart.dateScale.columnWidth,
            barWidth = Math.max(columnWidth * this.columnWidthRatio, this.minWidth),
            halfBarWidth = Math.round(barWidth / 2),
            theme = drawXColumns ? null : (params.theme as LineCandlePlotTheme).downCandle.border;

        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {
            let open = params.open[i],
                close = params.close[i];

            if (open == null || close == null)
                continue;

            let isRaisingBar = close >= open;
            if (drawXColumns !== isRaisingBar)
                continue;

            let x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByColumn(column),
                low = params.low[i],
                high = params.high[i];

            while (high - low > 1E-6) {
                let yLow = projection.yByValue(low),
                    yHigh = projection.yByValue(low + boxSize);

                if (drawXColumns) {
                    context.moveTo(x - halfBarWidth, yLow);
                    context.lineTo(x + halfBarWidth, yHigh);
                    context.moveTo(x - halfBarWidth, yHigh);
                    context.lineTo(x + halfBarWidth, yLow);
                } else {
                    let horRadius = halfBarWidth,
                        verRadius = (yHigh - yLow) / 2;

                    context.beginPath();
                    context.save();
                    context.translate(x, (yLow + yHigh) / 2);
                    if (horRadius !== verRadius)
                        context.scale(1, verRadius / horRadius);
                    context.arc(0, 0, horRadius, 0, 2 * Math.PI);
                    context.restore();
                    context.closePath();
                    context.scxStroke(theme);
                }

                low += boxSize;
            }
        }
    }

    hitTest(point: IPoint): boolean {
        let params = this._barDrawParams();
        if (params.values.length === 0)
            return false;

        let projection = params.projection,
            boxSize = this.boxSize,
            columnWidth = this.chart.dateScale.columnWidth,
            barWidth = Math.max(columnWidth * this.columnWidthRatio, this.minWidth),
            halfBarWidth = Math.round(barWidth / 2);

        for (let i = params.startIndex, column = params.startColumn; i <= params.endIndex; i++, column++) {

            let open = params.open[i],
                close = params.close[i],
                low = params.low[i],
                high = params.high[i];

            if (open == null || close == null)
                continue;

            let x = params.dates ? projection.xByDate(params.dates[i]) : projection.xByColumn(column);

            if (x - halfBarWidth <= point.x && x + halfBarWidth >= point.x) {
                while (high - low > 1E-6) {
                    let yLow = projection.yByValue(low),
                        yHigh = projection.yByValue(low + boxSize);

                    let rectanglePoint1 = {x: x - halfBarWidth, y: yLow};
                    let rectanglePoint2 = {x: x + halfBarWidth, y: yHigh};

                    if (Geometry.isPointInsideOrNearRectPoints(point, rectanglePoint1, rectanglePoint2))
                        return true;

                    low += boxSize;
                }
            }
        }
    }
}
