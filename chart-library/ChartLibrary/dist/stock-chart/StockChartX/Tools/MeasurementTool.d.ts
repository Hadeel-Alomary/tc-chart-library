import { ChartComponent, IChartComponentConfig, IChartComponentState } from "../Controls/ChartComponent";
import { ChartPanel } from "../ChartPanels/ChartPanel";
import { WindowEvent } from '../Gestures/Gesture';
export interface IMeasurementToolState extends IChartComponentState {
}
export interface IMeasurementToolConfig extends IChartComponentConfig {
}
export declare class MeasurementTool extends ChartComponent {
    private _state;
    private _mouseHoverGesture;
    private _mouseClickGesture;
    private _panGesture;
    private _chartPanel;
    private _points;
    private _values;
    constructor(config: IMeasurementToolConfig);
    startMeasuring(): void;
    finishMeasuring(): void;
    handleEvent(event: WindowEvent): boolean;
    private handleMobileEvent;
    private handleDesktopEvent;
    isMeasuringPanel(panel: ChartPanel): boolean;
    draw(): void;
    loadState(): void;
    saveState(): IMeasurementToolState;
    private _handleMouseClick;
    private _handleMouseHover;
    private _handlePanGesture;
    private _resetGestures;
    private _initializeGestures;
    private _drawValuesRectangle;
    private _drawArrowsRectangle;
    private _drawArrows;
    private _updateLastPoint;
    private _getArrowsRectangleBounds;
    private _getValuesRectangleBounds;
    private _forceBoundsInsideChartPanel;
    private _startInternalMeasuringProcess;
    private _finishInternalMeasuringProcess;
    private _getValuesTextSize;
    private _getTextThatWillBeDrawn;
    private _updateChartPanel;
    private _isMeasuringInSamePanel;
    private _isMouseHoverValueScale;
    private _getPointCoordinationBasedOnChartPanel;
    private _magnetChartPointIfNeeded;
}
//# sourceMappingURL=MeasurementTool.d.ts.map