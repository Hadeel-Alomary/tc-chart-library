import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { FilledShapeDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class RotatedRectangleDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    distanceBeforeRotate: number;
    rotateState: boolean;
    static get className(): string;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    private _markerPoints;
    private calculateDistance;
    private slope;
    draw(): void;
    private drawLine;
    private drawRectangle;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    private getTopPoints;
    private getBottomPoints;
    canControlPointsBeManuallyChanged(): boolean;
}
//# sourceMappingURL=RotatedRectangleDrawing.d.ts.map