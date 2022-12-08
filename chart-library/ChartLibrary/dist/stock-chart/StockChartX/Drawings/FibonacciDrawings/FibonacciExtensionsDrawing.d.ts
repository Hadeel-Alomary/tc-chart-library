import { FibonacciDrawingBase } from "./FibonacciDrawingBase";
import { IRect } from "../../Graphics/Rect";
import { IPoint } from "../../Graphics/ChartPoint";
import { PanGesture } from "../../Gestures/PanGesture";
import { WindowEvent } from "../../Gestures/Gesture";
import { FibonacciExtendedLevelsDrawingTheme } from '../DrawingThemeTypes';
export declare class FibonacciExtensionsDrawing extends FibonacciDrawingBase<FibonacciExtendedLevelsDrawingTheme> {
    static get className(): string;
    get reverse(): boolean;
    get levelLinesExtension(): string;
    get pointsNeeded(): number;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    private getLevelY;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private _getQuarter;
    private _calculateValueByY;
    private _linesXRange;
    private _adjustWithTextWidth;
}
//# sourceMappingURL=FibonacciExtensionsDrawing.d.ts.map