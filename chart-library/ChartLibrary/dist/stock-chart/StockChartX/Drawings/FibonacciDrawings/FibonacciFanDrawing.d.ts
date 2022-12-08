import { FibonacciDrawingBase } from "./FibonacciDrawingBase";
import { IRect } from "../../Graphics/Rect";
import { IPoint } from "../../Graphics/ChartPoint";
import { PanGesture } from "../../Gestures/PanGesture";
import { WindowEvent } from "../../Gestures/Gesture";
import { FibonacciFanDrawingTheme } from '../DrawingThemeTypes';
export declare class FibonacciFanDrawing extends FibonacciDrawingBase<FibonacciFanDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    private _applyTextVerticalPosition;
    draw(): void;
    private getX3;
    getFanY(points: IPoint[], x3: number, levelValue: number): number;
}
//# sourceMappingURL=FibonacciFanDrawing.d.ts.map