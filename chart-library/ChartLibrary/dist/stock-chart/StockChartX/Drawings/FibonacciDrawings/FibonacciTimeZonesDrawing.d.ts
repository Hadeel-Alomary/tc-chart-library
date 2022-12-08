import { FibonacciDrawingBase } from "./FibonacciDrawingBase";
import { IRect } from "../../Graphics/Rect";
import { IPoint } from "../../Graphics/ChartPoint";
import { PanGesture } from "../../Gestures/PanGesture";
import { WindowEvent } from "../../Gestures/Gesture";
import { FibonacciTimeZonesDrawingTheme } from '../DrawingThemeTypes';
export declare class FibonacciTimeZonesDrawing extends FibonacciDrawingBase<FibonacciTimeZonesDrawingTheme> {
    static get className(): string;
    get levelLinesExtension(): string;
    get pointsNeeded(): number;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    private _applyTextHorizontalPosition;
    private _applyTextVerticalPosition;
    draw(): void;
    private _linesYRange;
}
//# sourceMappingURL=FibonacciTimeZonesDrawing.d.ts.map