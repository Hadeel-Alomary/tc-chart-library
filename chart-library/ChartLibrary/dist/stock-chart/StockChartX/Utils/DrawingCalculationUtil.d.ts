import { IPoint } from "../Graphics/ChartPoint";
export interface ILinearRegressionResult {
    slope: number;
    firstValue: number;
}
export declare class DrawingCalculationUtil {
    static calculateLinearRegression(values: number[]): ILinearRegressionResult;
    static calculateAngleBetweenTwoPointsInRadians(point1: IPoint, point2: IPoint): number;
    static calculatePointFromAngleAndPoint(radians: number, point: IPoint, distance?: number): IPoint;
    static convertRadianToDegree(radians: number): number;
    static convertDegreeToRadian(degrees: number): number;
    static calculateSlope(point1: IPoint, point2: IPoint): number;
    static calculateDistanceBetweenTwoPoints(point1: IPoint, point2: IPoint): number;
    static centerPointOfLine(linePoint1: IPoint, linePoint2: IPoint): IPoint;
}
//# sourceMappingURL=DrawingCalculationUtil.d.ts.map