import { IRect } from "../../Graphics/Rect";
import { IPoint } from "../../Graphics/ChartPoint";
import { PanGesture } from "../../Gestures/PanGesture";
import { WindowEvent } from "../../Gestures/Gesture";
import { LineDrawingTheme } from '../DrawingThemeTypes';
import { ThemedDrawing } from '../ThemedDrawing';
export declare class TrendChannelDrawing extends ThemedDrawing<LineDrawingTheme> {
    static get className(): string;
    get pointsNeeded(): number;
    bounds(): IRect;
    _finishUserDrawing(): void;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
}
//# sourceMappingURL=TrendChannelDrawing.d.ts.map