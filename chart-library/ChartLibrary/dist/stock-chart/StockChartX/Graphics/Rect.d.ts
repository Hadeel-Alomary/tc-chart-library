import { IPoint } from "./ChartPoint";
export interface IRect {
    left: number;
    top: number;
    width: number;
    height: number;
}
export interface IPadding {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export interface ISize {
    width: number;
    height: number;
}
export declare class Rect implements IRect {
    left: number;
    top: number;
    width: number;
    height: number;
    get bottom(): number;
    get right(): number;
    constructor(rect?: IRect);
    clone(): Rect;
    equals(rect: IRect): boolean;
    toString(): string;
    containsPoint(point: IPoint): boolean;
    cropLeft(rect: Rect): void;
    cropRight(rect: Rect): void;
    cropTop(rect: Rect): void;
    cropBottom(rect: Rect): void;
    copyFrom(rect: IRect): void;
    applyPadding(padding: IPadding): void;
}
//# sourceMappingURL=Rect.d.ts.map