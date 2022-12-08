import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { IPoint } from '../../Graphics/ChartPoint';
import { FilledShapeDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class TrianglePatternDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private drawTriangle;
    private getExtendedTrianglePoints;
    private drawLine;
    private slope;
    private getSortedPoints;
}
//# sourceMappingURL=TrianglePatternDrawing.d.ts.map