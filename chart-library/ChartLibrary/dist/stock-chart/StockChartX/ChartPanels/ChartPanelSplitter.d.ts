import { FrameControl } from "../Controls/FrameControl";
import { ChartPanel } from "./ChartPanel";
import { Chart } from "../Chart";
import { GestureArray } from "../Gestures/GestureArray";
import { IPoint } from "../Graphics/ChartPoint";
import { Rect } from "../Graphics/Rect";
export declare class ChartPanelSplitter extends FrameControl {
    _topPanel: ChartPanel;
    get topPanel(): ChartPanel;
    _bottomPanel: ChartPanel;
    get bottomPanel(): ChartPanel;
    get chart(): Chart;
    _index: number;
    private _isMoving;
    isThemeApplied: boolean;
    static getHeight(): number;
    protected _initGestures(): GestureArray;
    private _handlePanGesture;
    private _handleMouseHoverGesture;
    private _startMove;
    private _stopMove;
    private _applyTheme;
    move(offset: number): boolean;
    hitTest(point: IPoint): boolean;
    protected _createRootDiv(): JQuery;
    layout(frame: Rect): void;
}
//# sourceMappingURL=ChartPanelSplitter.d.ts.map