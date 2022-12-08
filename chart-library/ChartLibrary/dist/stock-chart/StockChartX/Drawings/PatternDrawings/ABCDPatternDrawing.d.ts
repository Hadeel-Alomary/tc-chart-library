import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { IPoint } from '../../Graphics/ChartPoint';
import { LineDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class ABCDPatternDrawing extends ThemedDrawing<LineDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private calculateRatio;
}
//# sourceMappingURL=ABCDPatternDrawing.d.ts.map