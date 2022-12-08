/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IPlotConfig, IPlotDefaults, Plot} from "./Plot";
import {DataSeries} from "../Data/DataSeries";
import {KumoPlotTheme} from '../Theme';
import {Chart} from '../Chart';

export interface IKumoPlotConfig extends IPlotConfig {

}

export interface IKumoPlotDefaults extends IPlotDefaults {

}

/**
 * Represents Kumo plot.
 * @param {Object} [config] The configuration object.
 * @constructor KumoPlot
 * @augments Plot
 * @example
 *  let plot = new KumoPlot({
     *      dataSeries: SenkouSpanADataSeries, SenkouSpanBDataSeries
     *  });
 */
export class KumoPlot extends Plot {

    constructor(chart:Chart, config?: IKumoPlotConfig) {
        super(chart, config);
        if (!KumoPlot.pattern) { // a dom canvas used to create colors for the cloud
            KumoPlot.pattern = document.createElement('canvas');
        }
    }

    private static pattern: HTMLCanvasElement;

    /**
     * @inheritdoc
     */
    draw() {
        if (!this.visible)
            return;

        let params = this._barDrawParams();
        if (params.values.length === 0)
            return;


        let context = this.context,
            projection = this.projection,
            x: number,
            y: number,
            value: number;

        context.beginPath();

        value = this.dataSeries[0].values[params.startIndex] as number;
        x = projection.xByRecord(params.startIndex);
        y = projection.yByValue(value);
        context.moveTo(x, y);

        for (let i = params.startIndex + 1; i <= params.endIndex; i++) {
            value = this.dataSeries[0].values[i] as number;
            if (value == null)
                continue;

            x = projection.xByRecord(i);
            y = projection.yByValue(value);
            context.lineTo(x, y);
        }

        value = this.dataSeries[1].values[params.endIndex + 1] as number;
        if (value == null) {
            value = this.dataSeries[1].values[this.getLastNotNullValueIndex(this.dataSeries[1])] as number;
            params.endIndex = this.getLastNotNullValueIndex(this.dataSeries[0]);
        }
        x = projection.xByRecord(params.endIndex);
        y = projection.yByValue(value);
        context.lineTo(x, y);

        for (let i = params.endIndex; i >= params.startIndex; i--) {
            value = this.dataSeries[1].values[i] as number;
            if (value == null)
                continue;

            x = projection.xByRecord(i);
            y = projection.yByValue(value);
            context.lineTo(x, y);
        }

        value = this.dataSeries[0].values[params.startIndex] as number;
        if (value == null) {
            value = this.dataSeries[0].values[this.getFirstNotNullValueIndex(this.dataSeries[0])] as number;
            params.startIndex = this.getFirstNotNullValueIndex(this.dataSeries[0]);
        }
        x = projection.xByRecord(params.startIndex);
        y = projection.yByValue(value);
        context.lineTo(x, y);

        context.fillStyle = this.buildCloudPattern(context);
        context.fill();

        //context.scxFill(params.theme);
    }

    public drawSelectionPoints(): void {
        //NK Kumo plot does not need selection points
    }

    buildCloudPattern(context: CanvasRenderingContext2D): CanvasPattern {

        let params = this._barDrawParams();

        let maxX: number = 0;
        let maxY: number = 0;
        let flipPoints: number[] = [];
        let flipDirections: string[] = [];

        let projection = this.projection;

        for (let i = params.startIndex + 1; i <= params.endIndex; i++) {

            let value1: number = this.dataSeries[0].values[i] as number;
            let value2: number = this.dataSeries[1].values[i] as number;

            if (value1 == null || value2 == null)
                continue;

            // update maxX and maxY
            let x = projection.xByRecord(i);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, projection.yByValue(value1), projection.yByValue(value2));

            // init flipDirections to have "initial" color
            if (flipDirections.length == 0) {
                flipDirections.push(value1 < value2 ? 'down' : 'up');
            }

            // compute flip points (of directions)
            let nextValue1: number = this.dataSeries[0].values[i + 1] as number;
            let nextValue2: number = this.dataSeries[1].values[i + 1] as number;

            if (nextValue1 == null || nextValue2 == null) // null, we are done
                continue;

            let diffValue1: number = value1 - value2;
            let diffValue2: number = nextValue1 - nextValue2;

            if (diffValue1 == 0 && diffValue2 == 0) // ignore when both are Zero diff points
                continue;

            if ((diffValue1 * diffValue2) <= 0) { // diffValue1 and diffValue2 don't have same sign (or are Zero)
                // compute the flip point with its direction
                flipDirections.push(nextValue1 < nextValue2 ? 'down' : 'up');
                // next code interpolate where "crossing" x is between, as it can be between x and nextX
                let nextX = projection.xByRecord(i + 1);
                let ratio = Math.abs(diffValue1) / (Math.abs(diffValue1) + Math.abs(diffValue2));
                let crossX = Math.floor(x + (nextX - x) * ratio);
                // save cross point
                flipPoints.push(crossX);
            }

        }

        if (maxX == 0 || maxY == 0) {
            return context; // no data, return to avoid an exception
        }

        // after finding cross point, let us add a pattern that has green and red rectangles between flip points

        let pattern = KumoPlot.pattern;
        pattern.width = maxX;
        pattern.height = maxY;
        let pctx = pattern.getContext('2d');
        let up = flipDirections.shift() == 'up';
        let previousX = 0;

        flipPoints.forEach(function (flipPoint) {
            let color = up ? (params.theme as KumoPlotTheme).upColor.fillColor : (params.theme as KumoPlotTheme).downColor.fillColor;
            pctx.fillStyle = color;
            pctx.fillRect(previousX, 0, flipPoint - previousX, maxY);
            up = flipDirections.shift() == 'up';
            previousX = flipPoint;
        });

        // handle the last segment, from last flip point till the end
        if (previousX < maxX) {
            let color = up ? (params.theme as KumoPlotTheme).upColor.fillColor : (params.theme as KumoPlotTheme).downColor.fillColor;
            pctx.fillStyle = color;
            pctx.fillRect(previousX, 0, maxX - previousX, maxY);
        }

        /**********************Handle Exception****************************/
        /*Exception Message: Failed to execute 'createPattern' on 'CanvasRenderingContext2D': The canvas height is 0 */
        if (pattern.height == 0) {
            return context;
        }
        /*******************************************************************/

        return context.createPattern(pattern, "no-repeat");
    }

    getFirstNotNullValueIndex(dataserie: DataSeries): number {
        let index: number = 0,
            isContinue: boolean = true;

        while (isContinue && index < dataserie.length) {
            if (dataserie.values[index] == null)
                index++;
            else
                isContinue = false;
        }

        return index;
    }

    getLastNotNullValueIndex(dataserie: DataSeries): number {
        let index: number = dataserie.length,
            isContinue: boolean = true;

        while (isContinue && index > 0) {
            if (dataserie.values[index] == null)
                index--;
            else
                isContinue = false;
        }

        return index;
    }
}
