import { IPoint } from "../../Graphics/ChartPoint";
import { OneOpenEndLineSegmentDrawing } from "./OneOpenEndLineSegmentDrawing";
export declare class TwoOpenEndLineSegmentDrawing extends OneOpenEndLineSegmentDrawing {
    static get className(): string;
    private secondEndPoint;
    hitTest(point: IPoint): boolean;
    draw(): void;
    protected canAlertExtendRight(): boolean;
    protected canAlertExtendLeft(): boolean;
}
//# sourceMappingURL=TwoOpenEndLineSegmentDrawing.d.ts.map