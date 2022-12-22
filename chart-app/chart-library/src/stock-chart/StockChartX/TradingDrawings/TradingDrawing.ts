import {ChartPanelObject, IChartPanelObjectOptions} from "../ChartPanels/ChartPanelObject";
import {ChartPoint, IPoint, IPointBehavior, XPointBehavior, YPointBehavior} from "../Graphics/ChartPoint";
import {MouseHoverGesture} from "../Gestures/MouseHoverGesture";
import {ClickGesture} from "../Gestures/ClickGesture";
import {GestureArray} from "../Gestures/GestureArray";
import {ValueScale} from "../Scales/ValueScale";
import {DoubleClickGesture} from "../Gestures/DoubleClickGesture";
import {PanGesture} from "../Gestures/PanGesture";
import {Gesture, GestureState, WindowEvent} from "../Gestures/Gesture";
import {IRect} from "../Graphics/Rect";
import {ChartPanel} from "../ChartPanels/ChartPanel";
import {TradingDrawingsDefaultSettings, TradingOrderTheme} from './TradingDrawingsDefaultSettings';
import {Chart} from '../Chart';

export const TradingDrawingDragPoint: {[key: string]: number} = {
    NONE: null,
    ALL: -1
};

export abstract class TradingDrawing extends ChartPanelObject {
    static get subClassName(): string {
        return 'abstract';
    }

    static get className(): string {
        return '';
    }

    private _gestures: GestureArray;
    private _createClickGesture: ClickGesture;
    private _createMoveGesture: MouseHoverGesture;
    private _dragPoint: number = TradingDrawingDragPoint.NONE;
    private _chartPoint: ChartPoint;


    get className(): string {
        return (this.constructor as typeof TradingDrawing).className;
    }

    get chartPoint(): ChartPoint {
        return this._chartPoint;
    }

    set chartPoint(value: ChartPoint) {
        this._chartPoint = value;
    }

    get createPointBehavior(): IPointBehavior {
        return {
            x: XPointBehavior.DATE,
            y: YPointBehavior.VALUE
        };
    }

    constructor(chart:Chart) {
        super(chart, {});
        this._initGestures();
    }

    public handleEvent(event: WindowEvent): boolean {
        if (this._createClickGesture) {
            return this._createClickGesture.handleEvent(event) ||
                this._createMoveGesture.handleEvent(event);
        }

        return this._gestures.handleEvent(event);
    }

    public drawValueMarkers() {
    }

    protected canMove(point: IPoint): boolean {
        return false;
    }

    protected _onChartPanelChanged(oldValue: ChartPanel) {
    }

    protected _onValueScaleChanged(oldValue: ValueScale) {
    }

    protected _onVisibleChanged(oldValue: boolean) {
    }

    private _clickGestureHitTest(point: IPoint) {
        return this.hitTest(point);
    }

    private _panGestureHitTest(point: IPoint) {
        return this.canMove(point) && this.hitTest(point);
    }

    private _handlePanGestureInternal(gesture: PanGesture, event: WindowEvent) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._setDragPoint(TradingDrawingDragPoint.ALL);
                this.handleDragStarted();
                break;
            case GestureState.FINISHED:
                this._setDragPoint(TradingDrawingDragPoint.NONE);
                break;
            case GestureState.CONTINUED:
                if (this._dragPoint === TradingDrawingDragPoint.ALL) {
                    let projection = this.projection,
                        offset = gesture.moveOffset;

                    this.chartPoint.moveToPoint(event.pointerPosition, this.projection);
                }

                break;
        }

        this.chartPanel.setNeedsUpdate();
    }

    protected _handleClickGesture(gesture: Gesture, event: WindowEvent) {
    }

    protected _handleDoubleClickGesture() {
    }

    protected _handleMouseHover(gesture: Gesture, event: WindowEvent) {
        switch (gesture.state) {
            case GestureState.STARTED:
            case GestureState.CONTINUED:
                this.chartPanel.rootDiv.addClass('trading-drawing-mouse-hover');
                break;
            case GestureState.FINISHED:
                this.chartPanel.rootDiv.removeClass('trading-drawing-mouse-hover');
                break;
        }
    }

    protected cartesianPoint(): IPoint {
        let point = this.chartPoint;

        return point && point.toPoint(this.projection);
    }

    protected bounds(): IRect {
        return null;
    }

    protected hitTest(point: IPoint): boolean {
        return false;
    }

    protected handleDragFinished() {
    }

    protected handleDragStarted() {}

    private _initGestures() {
        this._gestures = new GestureArray([
            new ClickGesture({
                handler: this._handleClickGesture,
                hitTest: this._clickGestureHitTest
            }),
            new DoubleClickGesture({
                handler: this._handleDoubleClickGesture,
                hitTest: this.hitTest
            }),
            new PanGesture({
                handler: this._handlePanGestureInternal,
                hitTest: this._panGestureHitTest
            }),
            new MouseHoverGesture({
                enterEventEnabled: true,
                hoverEventEnabled: true,
                leaveEventEnabled: true,
                handler: this._handleMouseHover,
                hitTest: this.hitTest
            })
        ], this);
    }

    private _setDragPoint(dragPoint: number) {
        if (this._dragPoint !== dragPoint) {
            this._dragPoint = dragPoint;

            if (this._dragPoint === TradingDrawingDragPoint.NONE)
                this.handleDragFinished();
        }
    }
}
