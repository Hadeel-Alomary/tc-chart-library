import { IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { FilledShapeDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class DisjointAngleDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    private beforeDraggingCartesianPoints;
    static get className(): string;
    get pointsNeeded(): number;
    protected onMoveChartPointInUserDrawingState(): void;
    protected onAddNewChartPointInUserDrawingState(): void;
    hitTest(point: IPoint): boolean;
    private _markerPoints;
    draw(): void;
    private savePointsBeforeDragging;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    canControlPointsBeManuallyChanged(): boolean;
}
//# sourceMappingURL=DisjointAngleDrawing.d.ts.map