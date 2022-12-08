import { LineSegmentDrawing } from "./LineSegmentDrawing";
import { IDrawingOptions } from "../Drawing";
import { PanGesture } from "../../Gestures/PanGesture";
import { WindowEvent } from "../../Gestures/Gesture";
export interface IAngleLineSegmentDrawingOptions extends IDrawingOptions {
    angle: number;
    distance: number;
}
export declare class AngleLineSegmentDrawing extends LineSegmentDrawing {
    static get className(): string;
    private _angleLineTheme;
    private get angleLineTheme();
    private _angleLineTextTheme;
    private get angleLineTextTheme();
    private get basicRadius();
    private get angle();
    private set angle(value);
    private get distance();
    private set distance(value);
    draw(): void;
    protected onMoveChartPointInUserDrawingState(): void;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    private keepOnCurrentAngle;
    private compute;
    private drawBasicTrendLine;
    private drawAngle;
    private fillDegreeText;
}
//# sourceMappingURL=AngleLineSegmentDrawing.d.ts.map