import { IDrawingConfig, IDrawingDefaults, IDrawingOptions } from '../Drawing';
import { IPoint } from '../../Graphics/ChartPoint';
import { IRect } from '../../Graphics/Rect';
import { PanGesture } from '../../Gestures/PanGesture';
import { WindowEvent } from '../../Gestures/Gesture';
import { FibonacciDrawingBase } from '../FibonacciDrawings/FibonacciDrawingBase';
import { GannFanDrawingTheme } from '../DrawingThemeTypes';
export interface IGannFanAngle {
    value: number;
}
export interface IGannFanConfig extends IDrawingConfig {
    angles?: IGannFanAngle[];
}
export interface IGannFanOptions extends IDrawingOptions {
    angles?: IGannFanAngle[];
}
export interface IGannFanDefaults extends IDrawingDefaults {
    angles?: IGannFanAngle[];
}
export declare namespace DrawingEvent {
    const ANGLES_CHANGED = "drawingAnglesChanged";
    const SHOW_ANGLE_LINE_CHANGED = "drawingShowAngleLineChanged";
}
export declare class GannFanDrawing extends FibonacciDrawingBase<GannFanDrawingTheme> {
    static get className(): string;
    private numberOfLastTwoLineDrawn;
    private angles;
    private pointsOfLines;
    get pointsNeeded(): number;
    get anglesText(): string[];
    bounds(): IRect;
    hitTest(point: IPoint): boolean;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    draw(): void;
    private drawLine;
    private drawText;
    private fillDrawing;
    private fillAboveCenterLines;
    private fillBelowCenterLines;
    private calculate_X_ForHorizontalTextUsing_Y_OfLineCenterPoint;
    private _calculateLinesPoints;
}
//# sourceMappingURL=GannFanDrawing.d.ts.map