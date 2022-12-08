import { IRect } from "../../Graphics/Rect";
import { IPoint } from "../../Graphics/ChartPoint";
import { PanGesture } from "../../Gestures/PanGesture";
import { WindowEvent } from "../../Gestures/Gesture";
import { LineDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class AndrewsPitchforkDrawing extends ThemedDrawing<LineDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
}
//# sourceMappingURL=AndrewsPitchforkDrawing.d.ts.map