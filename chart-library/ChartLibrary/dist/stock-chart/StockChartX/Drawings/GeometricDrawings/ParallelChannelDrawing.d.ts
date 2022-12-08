import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { ParallelChanelDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class ParallelChannelDrawing extends ThemedDrawing<ParallelChanelDrawingTheme> {
    private _splits;
    private _linePoints;
    private _distance;
    static get className(): string;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private computeDistance;
    private drawMiddleLine;
    private addLinePoints;
    private setCenterPoint;
    _finishUserDrawing(): void;
}
//# sourceMappingURL=ParallelChannelDrawing.d.ts.map