import { ChartPanelObject } from "../ChartPanels/ChartPanelObject";
import { ChartPoint, IPoint, IPointBehavior } from "../Graphics/ChartPoint";
import { ValueScale } from "../Scales/ValueScale";
import { Gesture, WindowEvent } from "../Gestures/Gesture";
import { IRect } from "../Graphics/Rect";
import { ChartPanel } from "../ChartPanels/ChartPanel";
import { Chart } from '../Chart';
export declare const TradingDrawingDragPoint: {
    [key: string]: number;
};
export declare abstract class TradingDrawing extends ChartPanelObject {
    static get subClassName(): string;
    static get className(): string;
    private _gestures;
    private _createClickGesture;
    private _createMoveGesture;
    private _dragPoint;
    private _chartPoint;
    get className(): string;
    get chartPoint(): ChartPoint;
    set chartPoint(value: ChartPoint);
    get createPointBehavior(): IPointBehavior;
    constructor(chart: Chart);
    handleEvent(event: WindowEvent): boolean;
    drawValueMarkers(): void;
    protected canMove(point: IPoint): boolean;
    protected _onChartPanelChanged(oldValue: ChartPanel): void;
    protected _onValueScaleChanged(oldValue: ValueScale): void;
    protected _onVisibleChanged(oldValue: boolean): void;
    private _clickGestureHitTest;
    private _panGestureHitTest;
    private _handlePanGestureInternal;
    protected _handleClickGesture(gesture: Gesture, event: WindowEvent): void;
    protected _handleDoubleClickGesture(): void;
    protected _handleMouseHover(gesture: Gesture, event: WindowEvent): void;
    protected cartesianPoint(): IPoint;
    protected bounds(): IRect;
    protected hitTest(point: IPoint): boolean;
    protected handleDragFinished(): void;
    protected handleDragStarted(): void;
    private _initGestures;
    private _setDragPoint;
}
//# sourceMappingURL=TradingDrawing.d.ts.map