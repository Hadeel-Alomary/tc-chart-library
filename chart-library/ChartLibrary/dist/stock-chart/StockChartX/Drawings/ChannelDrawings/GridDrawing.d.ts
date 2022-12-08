import { ThemedDrawing } from '../ThemedDrawing';
import { LineDrawingTheme } from '../DrawingThemeTypes';
import { IPoint } from '../../Graphics/ChartPoint';
import { WindowEvent } from '../../Gestures/Gesture';
import { PanGesture } from '../../Gestures/PanGesture';
export declare class GridDrawing extends ThemedDrawing<LineDrawingTheme> {
    private gridLines;
    private linesPoints;
    static get className(): string;
    get pointsNeeded(): number;
    private _markerPoints;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private drawLines;
    private _calculateLinesPoints;
}
//# sourceMappingURL=GridDrawing.d.ts.map