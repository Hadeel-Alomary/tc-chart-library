import { IPoint } from './ChartPoint';
import { IRect } from './Rect';
export declare module Geometry {
    const DEVIATION: number;
    function length(point1: IPoint, point2: IPoint): number;
    function xProjectionLength(point1: IPoint, point2: IPoint): number;
    function yProjectionLength(point1: IPoint, point2: IPoint): number;
    function isValueNearValue(value1: number, value2: number): boolean;
    function isValueBetweenOrNearValues(value: number, value1: number, value2: number): boolean;
    function isPointNearPoint(point: IPoint, checkPoint: IPoint | IPoint[]): boolean;
    function isPointNearRectPoints(point: IPoint, rectPoint1: IPoint, rectPoint2: IPoint): boolean;
    function isPointInsideOrNearRect(point: IPoint, rect: IRect): any;
    function isPointInsideOrNearRectPoints(point: IPoint, rectPoint1: IPoint, rectPoint2: IPoint): boolean;
    function isPointNearCircle(point: IPoint, centerPoint: IPoint, radius: number | IPoint): boolean;
    function isPointInsideOrNearCircle(point: IPoint, centerPoint: IPoint, radius: number | IPoint): boolean;
    function isPointNearPolygon(point: IPoint, polygonPoints: IPoint[]): boolean;
    function isPointNearLine(point: IPoint, linePoint1: IPoint, linePoint2: IPoint): boolean;
    function isPointNearPolyline(point: IPoint, polylinePoints: IPoint[]): boolean;
    function isPointNearEllipse(point: IPoint, centerPoint: IPoint, radiusPoint: IPoint): boolean;
    function isPointNearEllipseWithRadiuses(point: IPoint, centerPoint: IPoint, horRadius: number, verRadius: number): boolean;
}
//# sourceMappingURL=Geometry.d.ts.map