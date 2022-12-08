import { ArrowDrawingBase } from "./ArrowDrawingBase";
import { IRect } from "../../Graphics/Rect";
import { IPoint } from '../../Graphics/ChartPoint';
export declare class ArrowDownDrawing extends ArrowDrawingBase {
    static get className(): string;
    bounds(): IRect;
    textBounds(): IRect;
    hitTest(point: IPoint): boolean;
    draw(): void;
    onLoadState(): void;
}
//# sourceMappingURL=ArrowDownDrawing.d.ts.map