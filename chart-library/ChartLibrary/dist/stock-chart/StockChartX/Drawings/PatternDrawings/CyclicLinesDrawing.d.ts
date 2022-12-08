import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { CyclicLinesDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class CyclicLinesDrawing extends ThemedDrawing<CyclicLinesDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    private isNearLines;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private distance;
    private ThereIsADistanceBetweenTheTwoPoints;
    private drawDashedLine;
    private drawLines;
    private drawLeftLines;
    private drawRightLines;
}
//# sourceMappingURL=CyclicLinesDrawing.d.ts.map