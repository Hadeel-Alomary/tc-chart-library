import {ChartPanelObject} from '../ChartPanels/ChartPanelObject';
import {ChartPoint, IPoint} from '../Graphics/ChartPoint';
import {MouseHoverGesture} from '../Gestures/MouseHoverGesture';
import {GestureArray} from '../Gestures/GestureArray';
import {DoubleClickGesture} from '../Gestures/DoubleClickGesture';
import {PanGesture} from '../Gestures/PanGesture';
import {Gesture, GestureState, WindowEvent} from '../Gestures/Gesture';
import {IRect} from '../Graphics/Rect';
import {ChartAccessorService, ChartTooltipType} from '../../../services/chart';
import {Chart, ChartEvent} from '../Chart';
import {ChartAlert} from '../../../services/alert';
import {AlertDrawingsDefaultSettings, AlertDrawingTheme} from './AlertDrawingsDefaultSettings';
import {AlertDrawingContextMenu} from '../../StockChartX.UI/AlertDrawingContextMenu';
import {ContextMenuGesture} from '../../StockChartX/Gestures/ContextMenuGesture';
import {DrawingDragPoint} from '../Drawings/Drawing';
import {Geometry} from '../Graphics/Geometry';
import {MathUtils} from '../../../utils/math.utils';


export const AlertDrawingDragPoint:{[key:string]:null | number} = {
    NONE: null,
    ALL: -1,
    MOVE_POINT1: 0,
    MOVE_POINT2: 1
};

export abstract class ChartAlertDrawing extends ChartPanelObject {
    static get className(): string {
        return 'chartAlert';
    }

    private _alert: ChartAlert;

    private _contextMenu: AlertDrawingContextMenu;

    private _gestures: GestureArray;

    private _chartPoints: ChartPoint[];

    private _theme: AlertDrawingTheme;

    private _visible: boolean = true;

    private _dragPoint: number = AlertDrawingDragPoint.NONE;

    get className(): string {
        return (this.constructor as typeof ChartAlertDrawing).className;
    }

    get actualTheme(): AlertDrawingTheme {
        return this.chart ? this._theme : null;
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
    }

    constructor(chart:Chart, alert: ChartAlert) {
        super(chart, {});

        this._alert = alert;

        this._setChartPoints(alert);

        this._theme = AlertDrawingsDefaultSettings.getChartAlertDrawingTheme(this.className);

        this._initContextMenu();

        this._initGestures();
    }

    public getAlert(): ChartAlert {
        return this._alert;
    }

    public setAlert(alert: ChartAlert) {
        this._setChartPoints(alert);
        this._alert = alert;
    }

    public handleEvent(event: WindowEvent): boolean {
        return this._gestures.handleEvent(event);
    }

    public draw() {
        if (!this.visible)
            return;

        let points = this._cartesianPoints();
        for(let point of points) {
            this._drawLine(point);
        }
        this._completeLinesDrawing();
    }

    public drawValueMarkers() {
        if (!this.visible)
            return;

        for(let i = 0; i < this._cartesianPoints().length; i++) {
            this._drawValueMarker(this._cartesianPoint(i), this._chartPoint(i).value);
        }
    }

    protected _completeLinesDrawing() {
    }

    protected _fireShowAlertDetailsEvent(newValue: number, newSecondValue: number) {
        this._hideTooltipOnEvent();
        let value:ChartAlertShowEventValue = {alertId: this._alert.id, newValue: newValue, newSecondValue: newSecondValue};
        this.fire(ChartEvent.SHOW_CHART_ALERT_DETAILS, value);
    }

    protected _fireDeleteAlertEvent() {
        this._hideTooltipOnEvent();
        let eventValue:DeleteChartAlertEventValue = {alertId: this._alert.id, shouldConfirm: true, returnToObjectsTree: false};
        this.chart.fireValueChanged(ChartEvent.DELETE_ALERT, eventValue);
    }

    protected _setDashedLineWidth(width: number) {
        let panel = this.chartPanel,
            theme = this._theme;

        theme.dashedLine.width = width;
        if (panel) {
            panel.setNeedsUpdate();
        }
    }

    protected _chartPoint(index: number = 0): ChartPoint {
        return this._chartPoints[index];
    }

    protected _cartesianPoint(index: number = 0): IPoint {
        let point = this._chartPoints[index];

        return point && point.toPoint(this.projection);
    }

    protected _cartesianPoints(): IPoint[] {
        return [this._cartesianPoint()];
    }

    protected _bounds(): IRect {
        let point = this._cartesianPoint();
        if (!point)
            return null;

        let frame = this.chartPanel.contentFrame;

        return {
            left: frame.left,
            top: point.y,
            width: frame.width,
            height: 1
        };
    }

    protected _hitTest(point: IPoint): boolean {
        if (!this.visible)
            return false;

        if(!point)
            return false;

        for(let i = 0; i < this._cartesianPoints().length; i++) {
            if(this._pointHitTest(point, i)) {
                return true;
            }

        }
        return false;
    }

    protected _pointHitTest(point: IPoint, pointIndex: number) {
        let p = this._cartesianPoint(pointIndex);
        return Geometry.isPointNearPolyline(point, [p, {x: this.chartPanel.contentFrame.right, y: p.y}]);
    }

    protected _handleDoubleClickGesture() {
        this._fireShowAlertDetailsEvent(this.getAlert().equationDefinition.value1, this.getAlert().equationDefinition.value2);
    }

    protected _handlePanGestureInternal(gesture: PanGesture, event: WindowEvent) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this._onDragStarted(event.pointerPosition);
                break;
            case GestureState.CONTINUED:
                this._onDragContinued(event.pointerPosition, gesture.moveOffset);
                break;
            case GestureState.FINISHED:
                this._onDragFinished();
                break;
        }
        this.chartPanel.setNeedsUpdate();
    }

    protected _getHoverCartesianPoint(pointerPosition: IPoint) {
        return this._cartesianPoint();
    }

    protected _handleMouseHover(gesture: Gesture, event: WindowEvent) {
        switch (gesture.state) {
            case GestureState.STARTED:
                this.onMouseHoverStarted();
                break;
            case GestureState.CONTINUED:
                this._onMouseHoverContinued(event.pointerPosition, this._getHoverCartesianPoint(event.pointerPosition));
                break;
            case GestureState.FINISHED:
                this._onMouseHoverFinished();
                break;
        }
    }

    protected _handleContextMenuGesture(gesture: PanGesture, event: WindowEvent) {
        this._contextMenu.show(event.evt);
        event.evt.stopPropagation();
        event.evt.preventDefault();
    }

    private _setDragPoint(dragPoint: number) {
        if (this._dragPoint !== dragPoint) {
            this._dragPoint = dragPoint;
        }
    }

    private onMouseHoverStarted() {
        this.chartPanel.rootDiv.addClass('alert-drawing-mouse-hover');
        this._focusAlertDrawing();
    }

    private _onMouseHoverContinued(pointerPosition: IPoint, hoverPoint: IPoint) {
        if (this._dragPoint === AlertDrawingDragPoint.NONE) {
            this._showTooltip(pointerPosition, hoverPoint);
        }
    }

    private _onMouseHoverFinished() {
        this.chartPanel.rootDiv.removeClass('alert-drawing-mouse-hover');
        if (this._dragPoint === AlertDrawingDragPoint.NONE) {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Alert);
            this._unfocusAlertDrawing();
        }
    }

    private _onDragStarted(pointerPosition: IPoint) {
        this._focusAlertDrawing();
        this._showTooltip(pointerPosition, this._getHoverCartesianPoint(pointerPosition));
        let points = this._cartesianPoints();
        for (let i = 0; i < points.length; i++) {
            if (this._pointHitTest(pointerPosition, i)) {
                this._setDragPoint(i);
                return true;
            }
        }
    }

    private _onDragContinued(pointerPosition: IPoint, moveOffset: IPoint) {
        this._showTooltip(pointerPosition, this._getHoverCartesianPoint(pointerPosition));
        if (this._dragPoint != null && this._dragPoint >= 0) {
            let projection = this.projection,
                offset = moveOffset;

            this._chartPoint(this._dragPoint).translate(offset.x, offset.y, projection);
        }
    }

    private _onDragFinished() {
        let value = this._chartPoint(this._dragPoint).value;
        let newPrice = MathUtils.roundAccordingMarket(value, this.chart.instrument.symbol);

        if(this._dragPoint == 0) {
            if (this.getAlert().equationDefinition.value1 != newPrice) {
                this._fireShowAlertDetailsEvent(newPrice, this.getAlert().equationDefinition.value2);
                this._unfocusAlertDrawing();
            }
        } else {
            if (this.getAlert().equationDefinition.value2 != newPrice) {
                this._fireShowAlertDetailsEvent(this.getAlert().equationDefinition.value1, newPrice);
                this._unfocusAlertDrawing();
            }
        }

        this._setDragPoint(DrawingDragPoint.NONE);
    }

    private _focusAlertDrawing() {
        this.chart.crossHair.hide();
        this._setDashedLineWidth(3);
    }

    private _unfocusAlertDrawing() {
        this.chart.crossHair.show();
        this._setDashedLineWidth(1);
    }

    private _showTooltip(pointerPosition: IPoint, hoverPoint: IPoint) {
        ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Alert, {
            chartPanel: this.chartPanel,
            position: {x: pointerPosition.x, y: hoverPoint.y},
            text: ChartAccessorService.instance.translate('تنبيه') + ': ' + this.getAlert().message
        });
    }

    private _setChartPoints(alert: ChartAlert) {
        this._chartPoints = [
            new ChartPoint({x: 0, value: alert.equationDefinition.value1, record: 0}),
            new ChartPoint({x: 0, value: alert.equationDefinition.value2, record: 0}),
        ];
    }

    private _hideTooltipOnEvent() {
        // MA when firing an event, a modal is opened with a mask that could disrupt tooltip. So, wait for some
        // time (for the mask to load) and then hide the tooltip.
        window.setTimeout(() => {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Alert);
        }, 100);
    }

    private _initContextMenu() {
        this._contextMenu = new AlertDrawingContextMenu({
            onItemSelected: (menuItem, checked) => {
                switch (menuItem.data('id')) {
                    case AlertDrawingContextMenu.MenuItem.UPDATE:
                        this._fireShowAlertDetailsEvent(this._alert.equationDefinition.value1, this._alert.equationDefinition.value2);
                        break;
                    case AlertDrawingContextMenu.MenuItem.DELETE:
                        this._fireDeleteAlertEvent();
                        break;
                }
            }
        });
    }

    private _initGestures() {
        this._gestures = new GestureArray([
            new DoubleClickGesture({
                handler: this._handleDoubleClickGesture,
                hitTest: this._hitTest
            }),
            new PanGesture({
                handler: this._handlePanGestureInternal,
                hitTest: this._hitTest
            }),
            new MouseHoverGesture({
                enterEventEnabled: true,
                hoverEventEnabled: true,
                leaveEventEnabled: true,
                handler: this._handleMouseHover,
                hitTest: this._hitTest
            }),
            new ContextMenuGesture({
                handler: this._handleContextMenuGesture,
                hitTest: this._hitTest
            }),
        ], this);
    }

    private _drawValueMarker(point: IPoint, value: number) {
        if (!this.visible)
            return;

        let context = this.chartPanel.context,
            text = `${this.chartPanel.formatValue(MathUtils.roundAccordingMarket(value, this.chart.instrument.symbol))}`,
            theme = this.actualTheme,
            textSize = theme.valueMarketText.fontSize,
            padding = 2,
            frame = this.chartPanel.contentFrame,
            width = Math.round(this.chartPanel.valueScale.rightFrame.width),
            height = Math.round(textSize + (2 * padding)),
            halfHeight = Math.round(height / 2),
            x = Math.round(frame.left + frame.width),
            y = Math.round(point.y - halfHeight);

        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.valueMarkerFill, theme.line);

        context.scxApplyTextTheme(theme.valueMarketText);
        context.fillText(text, x + padding, y + textSize - 1);
    }

    private _drawLine(point: IPoint) {
        let context = this.chartPanel.context,
            frame = this.chartPanel.contentFrame,
            theme = this.actualTheme;

        context.beginPath();
        context.moveTo(frame.left, point.y);
        context.lineTo(frame.right, point.y);
        context.scxStroke(theme.dashedLine);
    }
}

export interface DeleteChartAlertEventValue {
    alertId:string,
    shouldConfirm:boolean,
    returnToObjectsTree:boolean
}

export interface ChartAlertShowEventValue {
    alertId:string,
    newValue:number,
    newSecondValue:number
}
