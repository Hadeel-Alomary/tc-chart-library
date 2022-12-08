import { ChartComponent, IChartComponentConfig, IChartComponentState } from "../Controls/ChartComponent";
import { WindowEvent } from "../Gestures/Gesture";
export interface IZoomToolState extends IChartComponentState {
}
export interface IZoomToolConfig extends IChartComponentConfig {
}
export declare class ZoomTool extends ChartComponent {
    private _options;
    private _state;
    private _mouseHoverGesture;
    private _mouseClickGesture;
    private _panGesture;
    private _startZoomDate;
    private _endZoomDate;
    private _bounds;
    private _points;
    private _theme;
    constructor(config?: IZoomToolConfig);
    startZooming(): void;
    handleEvent(event: WindowEvent): boolean;
    private handleMobileEvent;
    private handleDesktopEvent;
    finishZoomingWithoutEvent(): void;
    destroy(): void;
    draw(): void;
    loadState(state: IZoomToolState): void;
    saveState(): IZoomToolState;
    private _getZoomRange;
    private _startDrawingZoomRectangle;
    private _handlePanGesture;
    private _handleMouseHoverGesture;
    private _handleMouseClickGesture;
    private _getDateByX;
    private _getRecordByX;
    private _getChartMainPanel;
    private _calculateBounds;
    private _finishZooming;
    private _isValidZoomRange;
    private _resetGestures;
}
export interface ChartZoomingEventValue {
    startDate: Date;
    endDate: Date;
}
//# sourceMappingURL=ZoomTool.d.ts.map