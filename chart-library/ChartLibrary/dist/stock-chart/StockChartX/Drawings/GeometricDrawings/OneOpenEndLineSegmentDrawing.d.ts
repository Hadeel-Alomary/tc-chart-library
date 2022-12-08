import { IPoint } from "../../Graphics/ChartPoint";
import { LineSegmentDrawing } from "./LineSegmentDrawing";
export declare class OneOpenEndLineSegmentDrawing extends LineSegmentDrawing {
    static get className(): string;
    get hasTooltip(): boolean;
    private endPoint;
    hitTest(point: IPoint): boolean;
    draw(): void;
    protected getExtendedLineEndPoint(point1: IPoint, point2: IPoint): {
        x: number;
        y: number;
    };
    protected canAlertExtendRight(): boolean;
    protected canAlertExtendLeft(): boolean;
}
//# sourceMappingURL=OneOpenEndLineSegmentDrawing.d.ts.map