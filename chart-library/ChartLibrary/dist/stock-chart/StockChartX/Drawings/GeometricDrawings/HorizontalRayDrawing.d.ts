import { IRect } from "../../Graphics/Rect";
import { IPoint } from "../../Graphics/ChartPoint";
import { HorizontalLineDrawing } from "./HorizontalLineDrawing";
export declare class HorizontalRayDrawing extends HorizontalLineDrawing {
    static get className(): string;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    draw(): void;
    protected getTextHorizontalPosition(point: IPoint): number;
    protected getAlertIconPoint(): IPoint;
    shouldDrawMarkers(): boolean;
}
//# sourceMappingURL=HorizontalRayDrawing.d.ts.map