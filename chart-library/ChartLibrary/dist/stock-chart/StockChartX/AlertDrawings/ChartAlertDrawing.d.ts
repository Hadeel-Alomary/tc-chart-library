import { ChartPanelObject } from '../ChartPanels/ChartPanelObject';
import { ChartPoint, IPoint } from '../Graphics/ChartPoint';
import { PanGesture } from '../Gestures/PanGesture';
import { Gesture, WindowEvent } from '../Gestures/Gesture';
import { IRect } from '../Graphics/Rect';
import { Chart } from '../Chart';
import { ChartAlert } from '../../../services/data/alert';
import { AlertDrawingTheme } from './AlertDrawingsDefaultSettings';
export declare const AlertDrawingDragPoint: {
    [key: string]: null | number;
};
export declare abstract class ChartAlertDrawing extends ChartPanelObject {
    static get className(): string;
    private _alert;
    private _contextMenu;
    private _gestures;
    private _chartPoints;
    private _theme;
    private _visible;
    private _dragPoint;
    get className(): string;
    get actualTheme(): AlertDrawingTheme;
    get visible(): boolean;
    set visible(value: boolean);
    constructor(chart: Chart, alert: ChartAlert);
    getAlert(): ChartAlert;
    setAlert(alert: ChartAlert): void;
    handleEvent(event: WindowEvent): boolean;
    draw(): void;
    drawValueMarkers(): void;
    protected _completeLinesDrawing(): void;
    protected _fireShowAlertDetailsEvent(newValue: number, newSecondValue: number): void;
    protected _fireDeleteAlertEvent(): void;
    protected _setDashedLineWidth(width: number): void;
    protected _chartPoint(index?: number): ChartPoint;
    protected _cartesianPoint(index?: number): IPoint;
    protected _cartesianPoints(): IPoint[];
    protected _bounds(): IRect;
    protected _hitTest(point: IPoint): boolean;
    protected _pointHitTest(point: IPoint, pointIndex: number): boolean;
    protected _handleDoubleClickGesture(): void;
    protected _handlePanGestureInternal(gesture: PanGesture, event: WindowEvent): void;
    protected _getHoverCartesianPoint(pointerPosition: IPoint): IPoint;
    protected _handleMouseHover(gesture: Gesture, event: WindowEvent): void;
    protected _handleContextMenuGesture(gesture: PanGesture, event: WindowEvent): void;
    private _setDragPoint;
    private onMouseHoverStarted;
    private _onMouseHoverContinued;
    private _onMouseHoverFinished;
    private _onDragStarted;
    private _onDragContinued;
    private _onDragFinished;
    private _focusAlertDrawing;
    private _unfocusAlertDrawing;
    private _showTooltip;
    private _setChartPoints;
    private _hideTooltipOnEvent;
    private _initContextMenu;
    private _initGestures;
    private _drawValueMarker;
    private _drawLine;
}
export interface DeleteChartAlertEventValue {
    alertId: string;
    shouldConfirm: boolean;
    returnToObjectsTree: boolean;
}
export interface ChartAlertShowEventValue {
    alertId: string;
    newValue: number;
    newSecondValue: number;
}
//# sourceMappingURL=ChartAlertDrawing.d.ts.map