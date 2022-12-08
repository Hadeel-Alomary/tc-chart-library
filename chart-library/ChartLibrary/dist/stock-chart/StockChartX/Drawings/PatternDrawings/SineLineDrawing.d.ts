import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { LineDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class SineLineDrawing extends ThemedDrawing<LineDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private frequency;
    private amplitude;
    private angle;
    private drawSine;
}
//# sourceMappingURL=SineLineDrawing.d.ts.map