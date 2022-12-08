/// <reference path="../Drawing.d.ts" />
import { IPoint } from "../../Graphics/ChartPoint";
import { IRect } from "../../Graphics/Rect";
import { PanGesture } from "../../Gestures/PanGesture";
import { WindowEvent } from "../../Gestures/Gesture";
import { LineDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class QuadrantLinesDrawing extends ThemedDrawing<LineDrawingTheme> {
    static get className(): string;
    private _drawingPoints;
    get pointsNeeded(): number;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    _finishUserDrawing(): void;
    draw(): void;
    protected _calculateDrawingPoints(points: IPoint[]): Array<IPoint[]>;
    private _moveMainLineYPoint;
}
//# sourceMappingURL=QuadrantLinesDrawing.d.ts.map