import { ChartPanelObject, IChartPanelObjectConfig, IChartPanelObjectOptions, IChartPanelObjectState } from '../ChartPanels/ChartPanelObject';
import { ChartPoint, IChartPoint, IPoint, IPointBehavior } from '../Graphics/ChartPoint';
import { GestureArray } from '../Gestures/GestureArray';
import { ValueScale } from '../Scales/ValueScale';
import { PanGesture } from '../Gestures/PanGesture';
import { Gesture, WindowEvent } from '../Gestures/Gesture';
import { IRect } from '../Graphics/Rect';
import { ChartPanel } from '../ChartPanels/ChartPanel';
import { ICloneable } from '../Data/ICloneable';
import { ConfirmationCaller } from '../../../components/modals/popup';
import { DrawingTheme, LevelThemeElement, LineThemeElement } from './DrawingThemeTypes';
import { Chart } from '../Chart';
import { DrawingLevelsFormatType } from './DrawingLevelsFormatType';
export interface IDrawingConfig extends IChartPanelObjectConfig {
    id?: string;
    points?: IPoint[];
    locked?: boolean;
    resizable?: boolean;
    selectable?: boolean;
    theme?: unknown;
    createPointBehavior: IPointBehavior;
}
export interface IDrawingOptions extends IChartPanelObjectOptions {
    id: string;
    points: ChartPoint[];
    locked: boolean;
    resizable: boolean;
    selectable: boolean;
    theme: DrawingTheme;
    createPointBehavior: IPointBehavior;
}
export interface IDrawingState extends IChartPanelObjectState {
    className: string;
}
export interface IDrawingDefaults {
    createPointBehavior?: IPointBehavior;
    visible?: boolean;
    selectable?: boolean;
    locked?: boolean;
    resizable?: boolean;
}
export declare namespace DrawingEvent {
    const PANEL_CHANGED = "drawingPanelChanged";
    const VALUE_SCALE_CHANGED = "drawingValueScaleChanged";
    const VISIBLE_CHANGED = "drawingVisibleChanged";
    const POINTS_CHANGED = "drawingPointsChanged";
    const LOCKED_CHANGED = "drawingLockedChanged";
    const RESIZABLE_CHANGED = "drawingResizableChanged";
    const SELECTABLE_CHANGED = "drawingSelectableChanged";
    const SELECTED_CHANGED = "drawingSelectedChanged";
    const THEME_CHANGED = "drawingThemeChanged";
    const DRAG_STARTED = "chartUserDrawingDragStarted";
    const DRAG_FINISHED = "chartUserDrawingDragFinished";
    const DOUBLE_CLICK = "chartDrawingDoubleClick";
    const CONTEXT_MENU = "chartDrawingContextMenu";
}
export interface IDrawingLevel {
    value: number;
    visible?: boolean;
    theme?: LevelThemeElement;
}
export declare const DrawingDragPoint: {
    [key: string]: null | number;
};
export declare abstract class Drawing extends ChartPanelObject implements ICloneable<Drawing>, ConfirmationCaller {
    static get subClassName(): string;
    static get className(): string;
    static defaults: IDrawingDefaults;
    static registeredDrawings: Object;
    static register: (type: typeof Drawing) => void;
    static deserialize: (chart: Chart, state: IDrawingState) => Drawing;
    get className(): string;
    get chartPoints(): ChartPoint[];
    set chartPoints(value: ChartPoint[]);
    get locked(): boolean;
    set locked(value: boolean);
    get resizable(): boolean;
    set resizable(value: boolean);
    get selectable(): boolean;
    set selectable(value: boolean);
    get theme(): DrawingTheme;
    set theme(value: DrawingTheme);
    get createPointBehavior(): IPointBehavior;
    set createPointBehavior(value: IPointBehavior);
    private _selected;
    get selected(): boolean;
    set selected(value: boolean);
    protected _gestures: GestureArray;
    private _createClickGesture;
    private _createMoveGesture;
    protected _lastCreatePoint: IPoint;
    private _createPanGestureForMobile;
    protected _dragPoint: number;
    get canSelect(): boolean;
    get canMove(): boolean;
    get canResize(): boolean;
    get pointsNeeded(): number;
    private _contextMenu;
    get magnetRadius(): number;
    get id(): string;
    set id(value: string);
    get hasTooltip(): boolean;
    get levels(): IDrawingLevel[];
    private drawingMarkers;
    constructor(chart: Chart, config?: IDrawingConfig);
    private _onDeleteDrawing;
    onConfirmation(confirmed: boolean, param: unknown): void;
    protected _onChartPanelChanged(oldValue: ChartPanel): void;
    protected _onValueScaleChanged(oldValue: ValueScale): void;
    protected _onVisibleChanged(oldValue: boolean): void;
    setChartPoints(points: IChartPoint | IChartPoint[]): void;
    private _initGestures;
    private _clickGestureHitTest;
    protected _panGestureHitTest(point: IPoint): boolean;
    private xOffsetForInitialPoint;
    private xOffsetSum;
    private _handlePanGestureInternal;
    private _handleClickGesture;
    protected _handleDoubleClickGesture(): void;
    protected _handleContextMenuGesture(gesture: Gesture, event: WindowEvent): void;
    protected _handleMouseHover(gesture: Gesture, event: WindowEvent): void;
    private changeCursorStyle;
    private isPointerNearDrawingPoints;
    private removeCursorStyleIfThereIsNoDraggedPoint;
    protected _handleUserDrawingPoint(point: IChartPoint): boolean;
    private _handleUserDrawingClickGesture;
    private _handleUserDrawingMoveGesture;
    private _normalizeUserDrawingPoint;
    private _handleUserDrawingPanGestureForMobile;
    private _handleUserDrawingClickPoint;
    showSettingsDialog(): void;
    duplicate(): void;
    appendChartPoint(point: IChartPoint): ChartPoint[];
    cartesianPoint(index: number): IPoint;
    cartesianPoints(): IPoint[];
    select(): void;
    translate(dx: number, dy: number): void;
    bounds(): IRect;
    startUserDrawing(): void;
    cleanGestures(): void;
    _finishUserDrawing(): void;
    hitTest(point: IPoint): boolean;
    handleEvent(event: WindowEvent): boolean;
    _setDragPoint(dragPoint: number): void;
    protected finishedDragging(): void;
    resetDefaultSettings(): void;
    saveAsDefaultSettings(): void;
    drawTextInBox(lineTheme: LineThemeElement, point: IPoint, text: string, abovePoint: boolean, fontSize?: number, fontFamily?: string): void;
    drawLineWithBoxNumber(lineTheme: LineThemeElement, point1: IPoint, point2: IPoint, number: string): void;
    findWidthForBoxContainingText(text: string): number;
    drawBoxNumberOnAnExistingLine(lineTheme: LineThemeElement, point1: IPoint, point2: IPoint, number: string): void;
    drawBowsWithLetters(lineTheme: LineThemeElement, point: IPoint, letter: string, position: number): void;
    bowsPosition(point: IPoint, initPosition: string): number;
    showDrawingTooltip(): void;
    hideDrawingTooltip(): void;
    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent): boolean;
    protected _drawSelectionMarkers(points: IPoint | IPoint[]): void;
    protected _magnetChartPointIfNeeded(point: IPoint): IPoint;
    private getHoveredCandlePoints;
    saveState(): IDrawingState;
    loadState(state: IDrawingState | IDrawingConfig): void;
    protected getDefaultPointBehaviour(): IPointBehavior;
    protected onLoadState(): void;
    drawSelectionMarkers(): void;
    protected shouldDrawMarkers(): boolean;
    clone(): Drawing;
    preDeleteCleanUp(): void;
    onRemove(): void;
    protected onAddNewChartPointInUserDrawingState(): void;
    protected onMoveChartPointInUserDrawingState(): void;
    canControlPointsBeManuallyChanged(): boolean;
    canAddAlerts(): boolean;
    addOrEditAlert(): void;
    deleteDrawingIfNoTextExists(): boolean;
    onApplySettings(): void;
    protected pointsCompleted(): boolean;
    private mapThemeForBackwardCompatibility;
    protected formatLevelText(value: number, formatType: DrawingLevelsFormatType): string;
    private isPointCloseToThePrice;
    private pointerPointTheme;
}
//# sourceMappingURL=Drawing.d.ts.map