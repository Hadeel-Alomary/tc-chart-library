import { IRect } from "../../Graphics/Rect";
import { IPoint } from "../../Graphics/ChartPoint";
import { PanGesture } from "../../Gestures/PanGesture";
import { WindowEvent } from "../../Gestures/Gesture";
import { FilledShapeDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class CircleDrawing extends ThemedDrawing<FilledShapeDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private _markerPoints;
    canControlPointsBeManuallyChanged(): boolean;
}
//# sourceMappingURL=CircleDrawing.d.ts.map