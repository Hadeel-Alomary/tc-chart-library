import { ThemedDrawing } from '../ThemedDrawing';
import { LineDrawingTheme } from '../DrawingThemeTypes';
import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
export declare class ChannelBase extends ThemedDrawing<LineDrawingTheme> {
    protected _drawingPoints: IPoint[];
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    protected drawLines(): void;
    protected moveChartPointsToMainLinePoints(): void;
    protected _getMainLinePoints(): IPoint[];
    protected _moveMainLineYPoint(y1: number, y2: number): void;
    protected _calculateDrawingPoints(points: IPoint[]): IPoint[];
}
//# sourceMappingURL=ChannelBase.d.ts.map