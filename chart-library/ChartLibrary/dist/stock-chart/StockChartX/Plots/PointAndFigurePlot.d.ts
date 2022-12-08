import { BarPlot } from "./BarPlot";
import { IPoint } from "../Graphics/ChartPoint";
export declare class PointAndFigurePlot extends BarPlot {
    private _boxSize;
    get boxSize(): number;
    set boxSize(value: number);
    draw(): void;
    private _drawColumns;
    hitTest(point: IPoint): boolean;
}
//# sourceMappingURL=PointAndFigurePlot.d.ts.map