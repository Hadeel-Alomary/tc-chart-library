import { FilledShapeDrawingTheme } from '../DrawingThemeTypes';
import { IPoint } from "../../Graphics/ChartPoint";
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class BandDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    private _markerPoints;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
}
//# sourceMappingURL=BandDrawing.d.ts.map