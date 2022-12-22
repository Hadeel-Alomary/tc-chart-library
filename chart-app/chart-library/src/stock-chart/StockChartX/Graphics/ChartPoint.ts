/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */


/**
 * The point structure.
 * @typedef {object} Point
 * @type {object}
 * @property {number} x The X coordinate.
 * @property {number} y The Y coordinate.
 * @memberOf StockChartX
 * @example
 *  var point = {
 *      x: 10,
 *      y: 20
 *  };
 */

import {Projection} from "../Scales/Projection";

/**
 * The point behavior structure.
 * @typedef {object} PointBehavior
 * @type {object}
 * @property {XPointBehavior} x The X coordinate behavior.
 * @property {YPointBehavior} y The Y coordinate behavior.
 * @memberOf StockChartX
 * @see [XPointBehavior]{@linkcode XPointBehavior}
 * @see [YPointBehavior]{@linkcode YPointBehavior}
 * @example
 * var behavior = {
 *  x: XPointBehavior.DATE,
 *  y: YPointBehavior.VALUE
 * };
 */

export interface IPoint {
    x: number;
    y: number;
}

export interface IChartPoint {
    x?: number;
    date?: Date;
    record?: number;
    y?: number;
    value?: number;
    xPercent?:number;
    yPercent?:number;
}

/**
 * X point behavior enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const XPointBehavior = {
    /** Use x as X coordinate */
    X: 'x',

    /** Use xPercent as X Percentage coordinate */
    X_PERCENT: 'xPercent',

    /** Use record as X coordinate */
    RECORD: 'record',

    /** Use date as X coordinate */
    DATE: 'date'

};
Object.freeze(XPointBehavior);

/**
 * Y point behavior enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const YPointBehavior = {
    /** Use y as Y coordinate */
    Y: 'y',

    /** Use yPercent as Y Percentage coordinate */
    Y_PERCENT: 'yPercent',

    /** Use value as Y coordinate */
    VALUE: 'value'
};
Object.freeze(YPointBehavior);

export interface IPointBehavior {
    x: string;
    y: string;
}

/**
 * Represents chart point.
 * @param {Object} [config] The configuration object.
 * @param {Number} [config.x] The X coordinate of point.
 * @param {Number} [config.y] The Y coordinate of point.
 * @param {Date} [config.date] The date of point.
 * @param {Number} [config.record] The record of point.
 * @param {Number} [config.value] The value of point.
 * @example
 *  // Create cartesian point.
 *  var p1 = new ChartPoint({
     *      x: 10,
     *      y: 20
     *  });
 *
 *  // Create date-value point.
 *  var p2 = new ChartPoint({
     *      date: new Date(),
     *      value: 10.0
     *  });
 *
 *  // Create record-value point.
 *  var p3 = new ChartPoint({
     *      record: 1,
     *      value: 10.0
     *  });
 * @constructor ChartPoint
 */

/**
 * Raw point's X coordinate.
 * @name x
 * @type number
 * @memberOf ChartPoint#
 */

/**
 * Raw point's date value.
 * @name date
 * @type Date
 * @memberOf ChartPoint#
 */

/**
 * Raw point's record value.
 * @name record
 * @type number
 * @memberOf ChartPoint#
 */

/**
 * Raw point's Y coordinate
 * @name y
 * @type number
 * @memberOf ChartPoint#
 */

/**
 * Raw point's price value.
 * @name value
 * @type number
 * @memberOf ChartPoint#
 */
export class ChartPoint implements IChartPoint {
    public x: number;
    public date: Date;
    public record: number;
    public y: number;
    public value: number;
    public xPercent:number;
    public yPercent:number;

    constructor(config?: IChartPoint) {
        config = config || {};

        if (config.x != null)
            this.x = config.x;
        if (config.y != null)
            this.y = config.y;
        if (config.xPercent != null)
            this.xPercent = config.xPercent;
        if (config.yPercent != null)
            this.yPercent = config.yPercent;
        if (config.date != null) {
            if (typeof config.date === 'string')
                this.date = new Date(<string>config.date);
            else
                this.date = config.date;
        }
        if (config.value != null)
            this.value = config.value;
        if (config.record != null)
            this.record = config.record;
    }

    /**
     * Converts XY point into ChartPoint.
     * @param {Point} point The source point.
     * @param {PointBehavior} behavior The convert behavior.
     * @param {Projection} projection The projection.
     * @returns {ChartPoint}
     * @memberOf ChartPoint
     * @example
     * var point = {
         *  x: 10,
         *  y: 20
         * };
     * var behavior = {
         *  x: XPointBehavior.RECORD,
         *  y: YPointBehavior.VALUE
         * };
     * var chartPoint = ChartPoint.convert(point, behavior, projection);
     */
    static convert(point: IPoint, behavior: IPointBehavior, projection: Projection): ChartPoint {
        let config = <IChartPoint> {};

        switch (behavior.x) {
            case XPointBehavior.X:
                config.x = point.x;
                break;
            case XPointBehavior.RECORD:
                config.record = projection.recordByX(point.x, false);
                break;
            case XPointBehavior.DATE:
                config.date = projection.dateByX(point.x);
                break;
            case XPointBehavior.X_PERCENT:
                config.xPercent = projection.percentageByX(point.x);
                break;
            default:
                throw new Error("Unknown X point behavior: " + behavior.x);
        }

        switch (behavior.y) {
            case YPointBehavior.Y:
                config.y = point.y;
                break;
            case YPointBehavior.VALUE:
                config.value = projection.valueByY(point.y);
                break;
            case YPointBehavior.Y_PERCENT:
                config.yPercent = projection.percentageByY(point.y);
                break;
            default:
                throw new Error("Unknown Y point behavior: " + behavior.y);
        }

        return new ChartPoint(config);
    }

    /**
     * Clears point's values.
     * @method clear
     * @memberOf ChartPoint#
     */
    clear(): void {
        if (this.x != null)
            this.x = undefined;
        if (this.y != null)
            this.y = undefined;
        if (this.xPercent != null)
            this.xPercent = undefined;
        if (this.yPercent != null)
            this.yPercent = undefined;
        if (this.date != null)
            this.date = undefined;
        if (this.value != null)
            this.value = undefined;
        if (this.record != null)
            this.record = undefined;
    }

    /**
     * Returns point's X coordinate using a given projection.
     * @method getX
     * @param {Projection} projection The projection.
     * @returns {Number} The X coordinate.
     * @memberOf ChartPoint#
     * @see [getY]{@linkcode ChartPoint#getY}
     * @see [toPoint]{@linkcode ChartPoint#toPoint}
     * @example
     *  var x = point.getX(projection);
     */
    getX(projection: Projection): number {
        if (this.x != null)
            return this.x;
        if (this.xPercent != null)
            return projection.xByPercentage(this.xPercent);
        if (this.date != null)
            return projection.xByDate(this.date);
        if (this.record != null)
            return projection.xByRecord(this.record, false);

        throw new Error("Point is not initialized.");
    }

    /**
     * Returns point's Y coordinate using a given projection.
     * @method getY
     * @param {Projection} projection The projection.
     * @returns {Number} The Y coordinate.
     * @memberOf ChartPoint#
     * @see [getX]{@linkcode ChartPoint#getX}
     * @see [toPoint]{@linkcode ChartPoint#toPoint}
     * @example
     *  var y = point.getY(projection);
     */
    getY(projection: Projection): number {
        if (this.y != null)
            return this.y;
        if(this.yPercent != null)
            return projection.yByPercentage(this.yPercent);
        if (this.value != null)
            return projection.yByValue(this.value);

        throw new Error("Point is not initialized.");
    }

    /**
     * Converts chart point to cartesian point.
     * @method toPoint
     * @param {Projection} projection The projection.
     * @returns {Point} The cartesian point.
     * @memberOf ChartPoint#
     * @example
     *  var p = point.toPoint(projection);
     *  console.log("x: " + p.x + ", y: " + p.y);
     */
    toPoint(projection: Projection): IPoint {
        return {
            x: this.getX(projection),
            y: this.getY(projection)
        };
    }

    /**
     * Moves chart point to a given point.
     * @method moveTo
     * @param {Number} x The X coordinate.
     * @param {Number} y The Y coordinate.
     * @param {Projection} projection The projection.
     * @returns {ChartPoint} Returns self.
     * @memberOf ChartPoint#
     * @see [translate]{@linkcode ChartPoint#translate}
     * @example
     *  point.moveTo(10, 20, projection);
     */
    moveTo(x: number, y: number, projection: Projection): ChartPoint {
        return this
            .moveToX(x, projection)
            .moveToY(y, projection);
    }

    /**
     * Moves chart point to a given point.
     * @method moveToPoint
     * @param {Point} point The destination point.
     * @param {Projection} projection The projection.
     * @returns {ChartPoint} Returns self.
     * @memberOf ChartPoint#
     * @example
     *  point.moveToPoint({x: 10, y: 20}, projection);
     */
    moveToPoint(point: IPoint, projection: Projection): ChartPoint {
        return this.moveTo(point.x, point.y, projection);
    }

    /**
     * Moves chart point to a point with a given X coordinate.
     * @method moveToX
     * @param {Number} x The X coordinate.
     * @param {Projection} projection The projection.
     * @returns {ChartPoint} Returns self.
     * @memberOf ChartPoint#
     * @example
     *  point.moveToX(10, projection);
     */
    moveToX(x: number, projection: Projection): ChartPoint {
        if (this.x != null)
            this.x = x;
        if (this.xPercent != null)
            this.xPercent = projection.percentageByX(x);
        else if (this.date != null)
            this.date = projection.dateByX(x);
        else if (this.record != null)
            this.record = projection.recordByX(x, false);
        else
            throw new Error("Point is not initialized.");

        return this;
    }

    /**
     * Moves chart point to a point with a given Y coordinate.
     * @method moveToY
     * @param {Number} y The Y coordinate.
     * @param {Projection} projection The projection.
     * @returns {ChartPoint} Returns self.
     * @memberOf ChartPoint#
     * @example
     *  point.moveToY(20, projection);
     */
    moveToY(y: number, projection: Projection): ChartPoint {
        if (this.y != null)
            this.y = y;
        else if(this.yPercent != null)
            this.yPercent = projection.percentageByY(y);
        else if (this.value != null)
            this.value = projection.valueByY(y);
        else
            throw new Error("Point is not initialized.");

        return this;
    }

    /**
     * Translates chart point onto a given X, Y offsets.
     * @method translate
     * @param {Number} dx The X offset.
     * @param {Number} dy The Y offset.
     * @param {Projection} projection The projection.
     * @returns {ChartPoint} Returns self.
     * @memberOf ChartPoint#
     * @see [moveTo]{@linkcode ChartPoint#moveTo}
     * @example
     *  point.translate(10, 20, projection);
     */
    translate(dx: number, dy: number, projection: Projection): ChartPoint {
        let newX = this.getX(projection) + dx,
            newY = this.getY(projection) + dy;

        return this.moveTo(newX, newY, projection);
    }

    // MA check if ChartPoint is date and value based on the value set. Could be enhanced in the future
    // to be passed on typing (add a type to the chartPoint to indicate which point it is)
    isPercentBasedChartPoint() {
        return typeof this.xPercent !== 'undefined' && typeof this.yPercent !== 'undefined';
    }

}
