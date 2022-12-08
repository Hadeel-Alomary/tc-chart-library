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
import {DrawingCalculationUtil} from "../../Utils/DrawingCalculationUtil";
import {ChannelBase} from './ChannelBase';

/**
 * Represents error channel drawing.
 * @constructor ErrorChannelDrawing
 * @augments Drawing
 * @example
 *  // Create error channel drawing.
 *  var drawing1 = new ErrorChannelDrawing({
     *      points: [{x: 10, y: 20}, {x: 50, y: 60}]
     *  });
 *
 *  // Create error channel drawing.
 *  var drawing2 = new ErrorChannelDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}]
     *  });
 *
 *  // Create error channel drawing with a custom theme.
 *  var drawing3 = new ErrorChannelDrawing({
     *      points: [{record: 10, value: 20.0}, {record: 50, value: 60.0}],
     *      theme: {
     *          line: {
     *              strokeColor: 'white'
     *              width: 2
     *          }
     *      }
     *  });
 */
export class ErrorChannelDrawing extends ChannelBase {
    static get className(): string {
        return 'errorChannel';
    }

    _calculateDrawingPoints(points: IPoint[]): IPoint[] {
        let point1 = points[0].x < points[1].x ? points[0] : points[1],
            point2 = points[1].x > points[0].x ? points[1] : points[0],
            projection = this.projection,
            dataSeries = this.chart.primaryBarDataSeries();

        let r1 = projection.recordByX(point1.x),
            r2 = projection.recordByX(point2.x);

        let record1 = Math.min(r1, r2),
            record2 = Math.max(r1, r2);

        let high = dataSeries.high,
            highestHigh: number = 0;
        for (let i = record1; i < record2; i++) {
            if (<number> high.valueAtIndex(i) > highestHigh) {
                highestHigh = <number> high.valueAtIndex(i);
            }
        }

        let low = dataSeries.low,
            lowestLow = highestHigh;
        for (let i = record1; i < record2; i++) {
            if (<number> low.valueAtIndex(i) < lowestLow) {
                lowestLow = <number> low.valueAtIndex(i);
            }
        }

        let range = (highestHigh - lowestLow) * 0.5,
            recordCount = record2 - record1 + 1,
            values: number[] = [];
        for (let i = 0; i < recordCount; i++) {
            values.push(<number> dataSeries.low.valueAtIndex(record1 + i));
        }

        let regression = DrawingCalculationUtil.calculateLinearRegression(values);
        let slope = regression.slope,
            leftValue = regression.firstValue,
            rightValue = leftValue + (slope * (recordCount - 1));

        let y1 = projection.yByValue(leftValue + range),
            y2 = projection.yByValue(rightValue + range),
            y3 = projection.yByValue(leftValue),
            y4 = projection.yByValue(rightValue),
            y5 = projection.yByValue(leftValue - range),
            y6 = projection.yByValue(rightValue - range);

        return [
            {x: point1.x, y: y1},
            {x: point2.x, y: y2},
            {x: point1.x, y: y3},
            {x: point2.x, y: y4},
            {x: point1.x, y: y5},
            {x: point2.x, y: y6}
        ];
    }
}

Drawing.register(ErrorChannelDrawing);
