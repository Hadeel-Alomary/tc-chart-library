/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IPoint} from "../Graphics/ChartPoint";

export interface ILinearRegressionResult { // MA compile typescript - generate declarations
    slope: number;
    firstValue: number;
}

export class DrawingCalculationUtil {

    public static calculateLinearRegression(values: number[]): ILinearRegressionResult {
        let xAvg: number = 0,
            yAvg: number = 0,
            count = values.length;

        for (let i = 0; i < count; i++) {
            xAvg += i;
            yAvg += values[i];
        }
        xAvg = count === 0 ? 0 : xAvg / count;
        yAvg = count === 0 ? 0 : yAvg / count;

        let v1: number = 0,
            v2: number = 0;
        for (let i = 0; i < count; i++) {
            v1 += (i - xAvg) * (values[i] - yAvg);
            v2 += Math.pow(i - xAvg, 2);
        }

        let slope = v2 === 0 ? 0 : v1 / v2;
        let firstValue = yAvg - slope * xAvg;

        return {
            slope: slope,
            firstValue: firstValue
        };
    }

    public static calculateAngleBetweenTwoPointsInRadians(point1:IPoint, point2:IPoint):number {
        let diffX: number = point2.x - point1.x;
        let diffY: number = point1.y - point2.y;
        return Math.atan2(diffY, diffX);
    }

    public static calculatePointFromAngleAndPoint(radians:number, point:IPoint, distance:number = 1):IPoint{
        let x:number = distance * Math.cos(radians);
        let y:number = distance * Math.sin(radians);

        return {
            x: Math.floor(point.x + x),
            y: Math.floor(point.y - y)
        };
    }

    public static convertRadianToDegree(radians:number):number{
        return radians * (180 / Math.PI);
    }

    public static convertDegreeToRadian(degrees:number):number{
        return degrees * (Math.PI / 180);
    }

    public static calculateSlope(point1:IPoint, point2:IPoint):number{
        if(point2.x == point1.x){
            //NK to avoid Infinity by dived on zero
            return 0;
        }
        return (point2.y - point1.y) / (point2.x - point1.x);
    }

    public static calculateDistanceBetweenTwoPoints(point1:IPoint, point2:IPoint):number {
        let diffX: number = point1.x - point2.x;
        let diffY: number = point1.y - point2.y;
        return Math.sqrt((diffX * diffX) + (diffY * diffY));
    }

    public static centerPointOfLine(linePoint1:IPoint, linePoint2:IPoint):IPoint{
        return {
            x: (linePoint1.x + linePoint2.x) / 2,
            y: (linePoint1.y + linePoint2.y) / 2
        };
    }
}