import { ArrowDrawingBase } from './ArrowDrawingBase';
import { IRect } from '../../Graphics/Rect';
import { IPoint } from '../../Graphics/ChartPoint';
export declare class ArrowUpDrawing extends ArrowDrawingBase {
    static get className(): string;
    bounds(): IRect;
    textBounds(): IRect;
    hitTest(point: IPoint): boolean;
    draw(): void;
    onLoadState(): void;
}
//# sourceMappingURL=ArrowUpDrawing.d.ts.map