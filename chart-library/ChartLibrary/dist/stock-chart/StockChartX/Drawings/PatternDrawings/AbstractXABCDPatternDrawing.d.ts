import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { IPoint } from '../../Graphics/ChartPoint';
import { FilledShapeDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare abstract class AbstractXABCDPatternDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    protected abstract calculatePointZeroToFourRatio(): number;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    protected calculateRatio(anglePoint: number, point1: number, point2: number): number;
}
//# sourceMappingURL=AbstractXABCDPatternDrawing.d.ts.map