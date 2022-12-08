import { FrameControl } from "../Controls/FrameControl";
import { DateScale } from "./DateScale";
import { Chart } from "../Chart";
import { GestureArray } from "../Gestures/GestureArray";
import { IPoint } from "../Graphics/ChartPoint";
import { Rect } from "../Graphics/Rect";
import { DrawingMarkers } from '../Drawings/DrawingMarkers';
import { Projection } from './Projection';
export declare class DateScalePanel extends FrameControl {
    private _dateScale;
    get dateScale(): DateScale;
    get chart(): Chart;
    private _cssClass;
    get cssClass(): string;
    private _isVisible;
    get visible(): boolean;
    private _canvas;
    private _context;
    constructor(config: DateScalePanelState);
    protected _initGestures(): GestureArray;
    private _handleDoubleClickGesture;
    private _handlePanGesture;
    private _handleMouseWheel;
    drawSelectionMarker(drawingMarkers: DrawingMarkers, points: IPoint[], projection: Projection): void;
    applyTheme(): void;
    private _getClientHeight;
    hitTest(point: IPoint): boolean;
    layoutPanel(frameInChart: Rect, isTopPanel: boolean): Rect;
    layout(frameInChart: Rect, isTopPanel?: boolean): void;
    draw(): void;
}
interface DateScalePanelState {
    dateScale: DateScale;
    cssClass: string;
    visible?: boolean;
}
export {};
//# sourceMappingURL=DateScalePanel.d.ts.map