import { IDrawingOptions } from '../Drawing';
import { ClickGesture } from '../../Gestures/ClickGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { IPoint } from '../../Graphics/ChartPoint';
import { FilledShapeDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export interface IBrushDrawingOptions extends IDrawingOptions {
    applyFillDrawing: boolean;
}
export declare class BrushDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string;
    private _createBrushPanGesture;
    private _createBrushClickGesture;
    private _createBrushMoveGesture;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    startUserDrawing(): void;
    _handleUserDrawingPanGesture(gesture: ClickGesture, event: WindowEvent): void;
    draw(): void;
    private _normalizePoint;
    handleEvent(event: WindowEvent): boolean;
    private removeDrawingIfNotSeen;
    get applyFillDrawing(): boolean;
    set applyFillDrawing(value: boolean);
    canControlPointsBeManuallyChanged(): boolean;
    _finishUserDrawing(): void;
}
//# sourceMappingURL=BrushDrawing.d.ts.map