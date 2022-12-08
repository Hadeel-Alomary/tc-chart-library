import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { IPoint } from '../../Graphics/ChartPoint';
import { LineDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare abstract class ElliottThreePointsWaveDrawing extends ThemedDrawing<LineDrawingTheme> {
    protected abstract getLabels(): string[];
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
}
//# sourceMappingURL=ElliotThreePointsWaveDrawing.d.ts.map