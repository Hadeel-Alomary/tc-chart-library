import { IDrawingOptions } from '../Drawing';
import { IChartPoint, IPoint } from '../../Graphics/ChartPoint';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { FilledShapeDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export interface IPolyLineDrawingOptions extends IDrawingOptions {
    closeTheShape: boolean;
}
export declare class PolyLineDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    hitTest(point: IPoint): boolean;
    protected _handleUserDrawingPoint(point: IChartPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private lastDrawnLine;
    canControlPointsBeManuallyChanged(): boolean;
    get closeTheShape(): boolean;
    set closeTheShape(value: boolean);
    protected shouldDrawMarkers(): boolean;
}
//# sourceMappingURL=PolyLineDrawing.d.ts.map