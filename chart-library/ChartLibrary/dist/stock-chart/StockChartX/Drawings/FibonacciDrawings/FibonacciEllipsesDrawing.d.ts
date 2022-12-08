import { FibonacciDrawingBase } from "./FibonacciDrawingBase";
import { IRect } from "../../Graphics/Rect";
import { IPoint } from "../../Graphics/ChartPoint";
import { PanGesture } from "../../Gestures/PanGesture";
import { WindowEvent } from "../../Gestures/Gesture";
import { FibonacciEllipsesDrawingTheme } from '../DrawingThemeTypes';
export declare class FibonacciEllipsesDrawing extends FibonacciDrawingBase<FibonacciEllipsesDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
}
//# sourceMappingURL=FibonacciEllipsesDrawing.d.ts.map