import { Projection } from "../Scales/Projection";
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
    xPercent?: number;
    yPercent?: number;
}
export declare const XPointBehavior: {
    X: string;
    X_PERCENT: string;
    RECORD: string;
    DATE: string;
};
export declare const YPointBehavior: {
    Y: string;
    Y_PERCENT: string;
    VALUE: string;
};
export interface IPointBehavior {
    x: string;
    y: string;
}
export declare class ChartPoint implements IChartPoint {
    x: number;
    date: Date;
    record: number;
    y: number;
    value: number;
    xPercent: number;
    yPercent: number;
    constructor(config?: IChartPoint);
    static convert(point: IPoint, behavior: IPointBehavior, projection: Projection): ChartPoint;
    clear(): void;
    getX(projection: Projection): number;
    getY(projection: Projection): number;
    toPoint(projection: Projection): IPoint;
    moveTo(x: number, y: number, projection: Projection): ChartPoint;
    moveToPoint(point: IPoint, projection: Projection): ChartPoint;
    moveToX(x: number, projection: Projection): ChartPoint;
    moveToY(y: number, projection: Projection): ChartPoint;
    translate(dx: number, dy: number, projection: Projection): ChartPoint;
    isPercentBasedChartPoint(): boolean;
}
//# sourceMappingURL=ChartPoint.d.ts.map