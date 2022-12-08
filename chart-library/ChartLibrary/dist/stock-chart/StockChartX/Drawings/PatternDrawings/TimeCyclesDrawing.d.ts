import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { IPoint } from '../../Graphics/ChartPoint';
import { FilledShapeDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class TimeCyclesDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    inDrawingState: boolean;
    hitTest(point: IPoint): boolean;
    private isPointNearTimeCycles;
    private hoverCycleCenterPoint;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    startUserDrawing(): void;
    private radius;
    private diameter;
    private centerPoint;
    private getMarkerPoints;
    private drawCycles;
    private drawRightCycle;
    private drawLeftCycle;
    _finishUserDrawing(): void;
}
//# sourceMappingURL=TimeCyclesDrawing.d.ts.map