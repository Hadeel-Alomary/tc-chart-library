import { __extends } from "tslib";
import { ChartPanelObject } from '../ChartPanels/ChartPanelObject';
import { ChartPoint } from '../Graphics/ChartPoint';
import { MouseHoverGesture } from '../Gestures/MouseHoverGesture';
import { GestureArray } from '../Gestures/GestureArray';
import { DoubleClickGesture } from '../Gestures/DoubleClickGesture';
import { PanGesture } from '../Gestures/PanGesture';
import { GestureState } from '../Gestures/Gesture';
import { ChartAccessorService, ChartTooltipType } from '../../../services/chart';
import { ChartEvent } from '../Chart';
import { AlertDrawingsDefaultSettings } from './AlertDrawingsDefaultSettings';
import { AlertDrawingContextMenu } from '../../StockChartX.UI/AlertDrawingContextMenu';
import { ContextMenuGesture } from '../../StockChartX/Gestures/ContextMenuGesture';
import { DrawingDragPoint } from '../Drawings/Drawing';
import { Geometry } from '../Graphics/Geometry';
import { MathUtils } from '../../../utils/math.utils';
export var AlertDrawingDragPoint = {
    NONE: null,
    ALL: -1,
    MOVE_POINT1: 0,
    MOVE_POINT2: 1
};
var ChartAlertDrawing = (function (_super) {
    __extends(ChartAlertDrawing, _super);
    function ChartAlertDrawing(chart, alert) {
        var _this = _super.call(this, chart, {}) || this;
        _this._visible = true;
        _this._dragPoint = AlertDrawingDragPoint.NONE;
        _this._alert = alert;
        _this._setChartPoints(alert);
        _this._theme = AlertDrawingsDefaultSettings.getChartAlertDrawingTheme(_this.className);
        _this._initContextMenu();
        _this._initGestures();
        return _this;
    }
    Object.defineProperty(ChartAlertDrawing, "className", {
        get: function () {
            return 'chartAlert';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartAlertDrawing.prototype, "className", {
        get: function () {
            return this.constructor.className;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartAlertDrawing.prototype, "actualTheme", {
        get: function () {
            return this.chart ? this._theme : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartAlertDrawing.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (value) {
            this._visible = value;
        },
        enumerable: false,
        configurable: true
    });
    ChartAlertDrawing.prototype.getAlert = function () {
        return this._alert;
    };
    ChartAlertDrawing.prototype.setAlert = function (alert) {
        this._setChartPoints(alert);
        this._alert = alert;
    };
    ChartAlertDrawing.prototype.handleEvent = function (event) {
        return this._gestures.handleEvent(event);
    };
    ChartAlertDrawing.prototype.draw = function () {
        if (!this.visible)
            return;
        var points = this._cartesianPoints();
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            this._drawLine(point);
        }
        this._completeLinesDrawing();
    };
    ChartAlertDrawing.prototype.drawValueMarkers = function () {
        if (!this.visible)
            return;
        for (var i = 0; i < this._cartesianPoints().length; i++) {
            this._drawValueMarker(this._cartesianPoint(i), this._chartPoint(i).value);
        }
    };
    ChartAlertDrawing.prototype._completeLinesDrawing = function () {
    };
    ChartAlertDrawing.prototype._fireShowAlertDetailsEvent = function (newValue, newSecondValue) {
        this._hideTooltipOnEvent();
        var value = { alertId: this._alert.id, newValue: newValue, newSecondValue: newSecondValue };
        this.fire(ChartEvent.SHOW_CHART_ALERT_DETAILS, value);
    };
    ChartAlertDrawing.prototype._fireDeleteAlertEvent = function () {
        this._hideTooltipOnEvent();
        var eventValue = { alertId: this._alert.id, shouldConfirm: true, returnToObjectsTree: false };
        this.chart.fireValueChanged(ChartEvent.DELETE_ALERT, eventValue);
    };
    ChartAlertDrawing.prototype._setDashedLineWidth = function (width) {
        var panel = this.chartPanel, theme = this._theme;
        theme.dashedLine.width = width;
        if (panel) {
            panel.setNeedsUpdate();
        }
    };
    ChartAlertDrawing.prototype._chartPoint = function (index) {
        if (index === void 0) { index = 0; }
        return this._chartPoints[index];
    };
    ChartAlertDrawing.prototype._cartesianPoint = function (index) {
        if (index === void 0) { index = 0; }
        var point = this._chartPoints[index];
        return point && point.toPoint(this.projection);
    };
    ChartAlertDrawing.prototype._cartesianPoints = function () {
        return [this._cartesianPoint()];
    };
    ChartAlertDrawing.prototype._bounds = function () {
        var point = this._cartesianPoint();
        if (!point)
            return null;
        var frame = this.chartPanel.contentFrame;
        return {
            left: frame.left,
            top: point.y,
            width: frame.width,
            height: 1
        };
    };
    ChartAlertDrawing.prototype._hitTest = function (point) {
        if (!this.visible)
            return false;
        if (!point)
            return false;
        for (var i = 0; i < this._cartesianPoints().length; i++) {
            if (this._pointHitTest(point, i)) {
                return true;
            }
        }
        return false;
    };
    ChartAlertDrawing.prototype._pointHitTest = function (point, pointIndex) {
        var p = this._cartesianPoint(pointIndex);
        return Geometry.isPointNearPolyline(point, [p, { x: this.chartPanel.contentFrame.right, y: p.y }]);
    };
    ChartAlertDrawing.prototype._handleDoubleClickGesture = function () {
        this._fireShowAlertDetailsEvent(this.getAlert().equationDefinition.value1, this.getAlert().equationDefinition.value2);
    };
    ChartAlertDrawing.prototype._handlePanGestureInternal = function (gesture, event) {
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
    };
    ChartAlertDrawing.prototype._getHoverCartesianPoint = function (pointerPosition) {
        return this._cartesianPoint();
    };
    ChartAlertDrawing.prototype._handleMouseHover = function (gesture, event) {
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
    };
    ChartAlertDrawing.prototype._handleContextMenuGesture = function (gesture, event) {
        this._contextMenu.show(event.evt);
        event.evt.stopPropagation();
        event.evt.preventDefault();
    };
    ChartAlertDrawing.prototype._setDragPoint = function (dragPoint) {
        if (this._dragPoint !== dragPoint) {
            this._dragPoint = dragPoint;
        }
    };
    ChartAlertDrawing.prototype.onMouseHoverStarted = function () {
        this.chartPanel.rootDiv.addClass('alert-drawing-mouse-hover');
        this._focusAlertDrawing();
    };
    ChartAlertDrawing.prototype._onMouseHoverContinued = function (pointerPosition, hoverPoint) {
        if (this._dragPoint === AlertDrawingDragPoint.NONE) {
            this._showTooltip(pointerPosition, hoverPoint);
        }
    };
    ChartAlertDrawing.prototype._onMouseHoverFinished = function () {
        this.chartPanel.rootDiv.removeClass('alert-drawing-mouse-hover');
        if (this._dragPoint === AlertDrawingDragPoint.NONE) {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Alert);
            this._unfocusAlertDrawing();
        }
    };
    ChartAlertDrawing.prototype._onDragStarted = function (pointerPosition) {
        this._focusAlertDrawing();
        this._showTooltip(pointerPosition, this._getHoverCartesianPoint(pointerPosition));
        var points = this._cartesianPoints();
        for (var i = 0; i < points.length; i++) {
            if (this._pointHitTest(pointerPosition, i)) {
                this._setDragPoint(i);
                return true;
            }
        }
    };
    ChartAlertDrawing.prototype._onDragContinued = function (pointerPosition, moveOffset) {
        this._showTooltip(pointerPosition, this._getHoverCartesianPoint(pointerPosition));
        if (this._dragPoint != null && this._dragPoint >= 0) {
            var projection = this.projection, offset = moveOffset;
            this._chartPoint(this._dragPoint).translate(offset.x, offset.y, projection);
        }
    };
    ChartAlertDrawing.prototype._onDragFinished = function () {
        var value = this._chartPoint(this._dragPoint).value;
        var newPrice = MathUtils.roundAccordingMarket(value, this.chart.instrument.symbol);
        if (this._dragPoint == 0) {
            if (this.getAlert().equationDefinition.value1 != newPrice) {
                this._fireShowAlertDetailsEvent(newPrice, this.getAlert().equationDefinition.value2);
                this._unfocusAlertDrawing();
            }
        }
        else {
            if (this.getAlert().equationDefinition.value2 != newPrice) {
                this._fireShowAlertDetailsEvent(this.getAlert().equationDefinition.value1, newPrice);
                this._unfocusAlertDrawing();
            }
        }
        this._setDragPoint(DrawingDragPoint.NONE);
    };
    ChartAlertDrawing.prototype._focusAlertDrawing = function () {
        this.chart.crossHair.hide();
        this._setDashedLineWidth(3);
    };
    ChartAlertDrawing.prototype._unfocusAlertDrawing = function () {
        this.chart.crossHair.show();
        this._setDashedLineWidth(1);
    };
    ChartAlertDrawing.prototype._showTooltip = function (pointerPosition, hoverPoint) {
        ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Alert, {
            chartPanel: this.chartPanel,
            position: { x: pointerPosition.x, y: hoverPoint.y },
            text: ChartAccessorService.instance.translate('تنبيه') + ': ' + this.getAlert().message
        });
    };
    ChartAlertDrawing.prototype._setChartPoints = function (alert) {
        this._chartPoints = [
            new ChartPoint({ x: 0, value: alert.equationDefinition.value1, record: 0 }),
            new ChartPoint({ x: 0, value: alert.equationDefinition.value2, record: 0 }),
        ];
    };
    ChartAlertDrawing.prototype._hideTooltipOnEvent = function () {
        window.setTimeout(function () {
            ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Alert);
        }, 100);
    };
    ChartAlertDrawing.prototype._initContextMenu = function () {
        var _this = this;
        this._contextMenu = new AlertDrawingContextMenu({
            onItemSelected: function (menuItem, checked) {
                switch (menuItem.data('id')) {
                    case AlertDrawingContextMenu.MenuItem.UPDATE:
                        _this._fireShowAlertDetailsEvent(_this._alert.equationDefinition.value1, _this._alert.equationDefinition.value2);
                        break;
                    case AlertDrawingContextMenu.MenuItem.DELETE:
                        _this._fireDeleteAlertEvent();
                        break;
                }
            }
        });
    };
    ChartAlertDrawing.prototype._initGestures = function () {
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
    };
    ChartAlertDrawing.prototype._drawValueMarker = function (point, value) {
        if (!this.visible)
            return;
        var context = this.chartPanel.context, text = "" + this.chartPanel.formatValue(MathUtils.roundAccordingMarket(value, this.chart.instrument.symbol)), theme = this.actualTheme, textSize = theme.valueMarketText.fontSize, padding = 2, frame = this.chartPanel.contentFrame, width = Math.round(this.chartPanel.valueScale.rightFrame.width), height = Math.round(textSize + (2 * padding)), halfHeight = Math.round(height / 2), x = Math.round(frame.left + frame.width), y = Math.round(point.y - halfHeight);
        context.beginPath();
        context.rect(x, y, width, height);
        context.scxFillStroke(theme.valueMarkerFill, theme.line);
        context.scxApplyTextTheme(theme.valueMarketText);
        context.fillText(text, x + padding, y + textSize - 1);
    };
    ChartAlertDrawing.prototype._drawLine = function (point) {
        var context = this.chartPanel.context, frame = this.chartPanel.contentFrame, theme = this.actualTheme;
        context.beginPath();
        context.moveTo(frame.left, point.y);
        context.lineTo(frame.right, point.y);
        context.scxStroke(theme.dashedLine);
    };
    return ChartAlertDrawing;
}(ChartPanelObject));
export { ChartAlertDrawing };
//# sourceMappingURL=ChartAlertDrawing.js.map