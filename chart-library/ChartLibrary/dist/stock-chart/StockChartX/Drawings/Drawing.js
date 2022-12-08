import { __extends } from "tslib";
import { ChartPanelObject } from '../ChartPanels/ChartPanelObject';
import { ChartPoint, XPointBehavior, YPointBehavior } from '../Graphics/ChartPoint';
import { MouseHoverGesture } from '../Gestures/MouseHoverGesture';
import { ClickGesture } from '../Gestures/ClickGesture';
import { GestureArray } from '../Gestures/GestureArray';
import { DrawingContextMenu } from '../../StockChartX.UI/DrawingContextMenu';
import { DoubleClickGesture } from '../Gestures/DoubleClickGesture';
import { ContextMenuGesture } from '../Gestures/ContextMenuGesture';
import { PanGesture } from '../Gestures/PanGesture';
import { GestureState } from '../Gestures/Gesture';
import { DrawingsDefaultSettings } from './DrawingsDefaultSettings';
import { JsUtil } from '../Utils/JsUtil';
import { ClassRegistrar } from '../Utils/ClassRegistrar';
import { ChannelRequestType, ChartAccessorService, ChartTooltipType } from '../../../services/index';
import { BrowserUtils, StringUtils, Tc } from '../../../utils';
import { Config } from '../../../config/config';
import { Theme, ThemeUtils } from '../Theme';
import { DrawingMarkers } from './DrawingMarkers';
import { HtmlUtil } from '../../StockChartX/Utils/HtmlUtil';
import { DrawingLevelsFormatType } from './DrawingLevelsFormatType';
import { ThemeType } from '../ThemeType';
import { Geometry } from '../../StockChartX/Graphics/Geometry';
var cloneDeep = require('lodash/cloneDeep');
export var DrawingEvent;
(function (DrawingEvent) {
    DrawingEvent.PANEL_CHANGED = 'drawingPanelChanged';
    DrawingEvent.VALUE_SCALE_CHANGED = 'drawingValueScaleChanged';
    DrawingEvent.VISIBLE_CHANGED = 'drawingVisibleChanged';
    DrawingEvent.POINTS_CHANGED = 'drawingPointsChanged';
    DrawingEvent.LOCKED_CHANGED = 'drawingLockedChanged';
    DrawingEvent.RESIZABLE_CHANGED = 'drawingResizableChanged';
    DrawingEvent.SELECTABLE_CHANGED = 'drawingSelectableChanged';
    DrawingEvent.SELECTED_CHANGED = 'drawingSelectedChanged';
    DrawingEvent.THEME_CHANGED = 'drawingThemeChanged';
    DrawingEvent.DRAG_STARTED = 'chartUserDrawingDragStarted';
    DrawingEvent.DRAG_FINISHED = 'chartUserDrawingDragFinished';
    DrawingEvent.DOUBLE_CLICK = 'chartDrawingDoubleClick';
    DrawingEvent.CONTEXT_MENU = 'chartDrawingContextMenu';
})(DrawingEvent || (DrawingEvent = {}));
export var DrawingDragPoint = {
    NONE: null,
    ALL: -1,
    MOVE_POINT1: 1,
    MOVE_POINT2: 2
};
var DrawingRegistrar = (function () {
    function DrawingRegistrar() {
    }
    Object.defineProperty(DrawingRegistrar, "registeredDrawings", {
        get: function () {
            return this._drawings.registeredItems;
        },
        enumerable: false,
        configurable: true
    });
    DrawingRegistrar.register = function (type) {
        this._drawings.register(type.className, type);
    };
    DrawingRegistrar.deserialize = function (chart, state) {
        if (!state)
            return null;
        if (typeof state === 'string')
            state = JSON.parse(state);
        var drawing = this._drawings.createChartBasedInstance(state.className, chart);
        drawing.loadState(state);
        return drawing;
    };
    DrawingRegistrar._drawings = new ClassRegistrar();
    return DrawingRegistrar;
}());
var Drawing = (function (_super) {
    __extends(Drawing, _super);
    function Drawing(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this._selected = false;
        _this._dragPoint = DrawingDragPoint.NONE;
        _this.drawingMarkers = new DrawingMarkers();
        _this.loadState(config);
        _this._initGestures();
        _this._contextMenu = new DrawingContextMenu({
            drawing: _this,
            onItemSelected: function (menuItem, checked) {
                switch (menuItem.data('id')) {
                    case DrawingContextMenu.MenuItem.SETTINGS:
                        _this.showSettingsDialog();
                        break;
                    case DrawingContextMenu.MenuItem.DELETE:
                        _this._onDeleteDrawing();
                        break;
                    case DrawingContextMenu.MenuItem.CLONE:
                        _this.duplicate();
                        break;
                    case DrawingContextMenu.MenuItem.LOCK:
                        _this.locked = !_this.locked;
                        break;
                    case DrawingContextMenu.MenuItem.TREND_LINE_ALERT:
                        _this.addOrEditAlert();
                        break;
                }
            },
            onShow: function () {
                if (_this.canAddAlerts()) {
                    $('#scxDrawingContextMenu').find('li[data-id="trend-line-alert"]').show();
                }
                else {
                    $('#scxDrawingContextMenu').find('li[data-id="trend-line-alert"]').hide();
                }
                var lockElement = $('#scxDrawingContextMenu').find('li[data-id="lock"]');
                if (_this.locked) {
                    if (!lockElement.hasClass('activated')) {
                        lockElement.addClass('activated');
                    }
                }
                else {
                    if (lockElement.hasClass('activated')) {
                        lockElement.removeClass('activated');
                    }
                }
            }
        });
        return _this;
    }
    Object.defineProperty(Drawing, "subClassName", {
        get: function () {
            return 'abstract';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing, "className", {
        get: function () {
            return '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "className", {
        get: function () {
            return this.constructor.className;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "chartPoints", {
        get: function () {
            var points = this._options.points;
            return this._lastCreatePoint ? points.concat(this._lastCreatePoint) : points;
        },
        set: function (value) {
            this.setChartPoints(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "locked", {
        get: function () {
            return this._options.locked;
        },
        set: function (value) {
            this._setOption('locked', !!value, DrawingEvent.LOCKED_CHANGED);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "resizable", {
        get: function () {
            return this._options.resizable;
        },
        set: function (value) {
            this._setOption('resizable', !!value, DrawingEvent.RESIZABLE_CHANGED);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "selectable", {
        get: function () {
            return this._options.selectable;
        },
        set: function (value) {
            this._setOption('selectable', !!value, DrawingEvent.SELECTABLE_CHANGED);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "theme", {
        get: function () {
            return this._options.theme;
        },
        set: function (value) {
            this._options.theme = value;
            this.fire(DrawingEvent.THEME_CHANGED, value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "createPointBehavior", {
        get: function () {
            return this._options.createPointBehavior;
        },
        set: function (value) {
            this._options.createPointBehavior = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            value = !!value;
            var oldValue = this._selected, isChanged = oldValue !== value;
            if (isChanged) {
                this._selected = value;
                var chart = this.chart;
                if (chart) {
                    if (value) {
                        chart.selectedObject = this;
                    }
                    else if (this === chart.selectedObject) {
                        chart.selectedObject = null;
                    }
                }
                if (this.pointsCompleted()) {
                    this.fire(DrawingEvent.SELECTED_CHANGED, value, oldValue);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "canSelect", {
        get: function () {
            return this.selectable;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "canMove", {
        get: function () {
            return this.selectable && !this.locked;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "canResize", {
        get: function () {
            return this.selectable && this.resizable && !this.locked;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "pointsNeeded", {
        get: function () {
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "magnetRadius", {
        get: function () {
            if (this.chart.magnetRatio == 0) {
                return 5;
            }
            return this.chart.magnetRatio * 25;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "id", {
        get: function () {
            return this._options.id;
        },
        set: function (value) {
            this._options.id = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "hasTooltip", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawing.prototype, "levels", {
        get: function () {
            return [];
        },
        enumerable: false,
        configurable: true
    });
    Drawing.prototype._onDeleteDrawing = function () {
        if (this.canAddAlerts() && ChartAccessorService.instance.getAlertService().getTrendLineAlertByDrawingId(this.id)) {
            var openRequest = {
                type: ChannelRequestType.Confirmation,
                messageLine: ChartAccessorService.instance.translate('حذف الرسم سيؤدي إلى حذف التنبيه المرتبط به'),
                messageLine2: ChartAccessorService.instance.translate('هل أنت متأكد من الحذف؟'),
                caller: this
            };
            ChartAccessorService.instance.sendSharedChannelRequest(openRequest);
        }
        else {
            this.chartPanel.deleteDrawings(this);
        }
    };
    Drawing.prototype.onConfirmation = function (confirmed, param) {
        if (confirmed) {
            this.chartPanel.deleteDrawings(this);
        }
    };
    Drawing.prototype._onChartPanelChanged = function (oldValue) {
        this.fire(DrawingEvent.PANEL_CHANGED, this.chartPanel, oldValue);
    };
    Drawing.prototype._onValueScaleChanged = function (oldValue) {
        this.fire(DrawingEvent.VALUE_SCALE_CHANGED, this.valueScale, oldValue);
    };
    Drawing.prototype._onVisibleChanged = function (oldValue) {
        this.fire(DrawingEvent.VISIBLE_CHANGED, this.visible, oldValue);
    };
    Drawing.prototype.setChartPoints = function (points) {
        var chartPoints;
        if (!points) {
            chartPoints = [];
        }
        if (points instanceof ChartPoint) {
            chartPoints = [points];
        }
        else if (Array.isArray(points)) {
            chartPoints = [];
            for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
                var point = points_1[_i];
                chartPoints.push(new ChartPoint(point));
            }
        }
        else {
            chartPoints = [new ChartPoint(points)];
        }
        this._setOption('points', chartPoints, DrawingEvent.POINTS_CHANGED);
    };
    Drawing.prototype._initGestures = function () {
        if (Config.isElementBuild()) {
            this._gestures = new GestureArray([]);
            return;
        }
        this._gestures = new GestureArray([
            new DoubleClickGesture({
                handler: this._handleDoubleClickGesture,
                hitTest: this.hitTest
            }),
            new ClickGesture({
                handler: this._handleClickGesture,
                hitTest: this._clickGestureHitTest
            }),
            new ContextMenuGesture({
                handler: this._handleContextMenuGesture,
                hitTest: this._clickGestureHitTest
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
    };
    Drawing.prototype._clickGestureHitTest = function (point) {
        return this.canSelect && this.hitTest(point);
    };
    Drawing.prototype._panGestureHitTest = function (point) {
        return this.canMove && this.hitTest(point);
    };
    Drawing.prototype._handlePanGestureInternal = function (gesture, event) {
        if (!this.canResize || !this._handlePanGesture(gesture, event)) {
            switch (gesture.state) {
                case GestureState.STARTED:
                    var chart = this.chart, oldSelectedObject = chart.selectedObject;
                    this._setDragPoint(DrawingDragPoint.ALL);
                    this.xOffsetForInitialPoint = this.chartPoints[0].getX(this.projection);
                    this.xOffsetSum = 0;
                    if (oldSelectedObject !== this) {
                        chart.setNeedsUpdate();
                        return;
                    }
                    break;
                case GestureState.FINISHED:
                    this._setDragPoint(DrawingDragPoint.NONE);
                    break;
                case GestureState.CONTINUED:
                    if (this._dragPoint === DrawingDragPoint.ALL) {
                        var projection = this.projection, offset = gesture.moveOffset;
                        this.xOffsetSum += offset.x;
                        var xOffsetBetweenPoints = this.xOffsetForInitialPoint - this.chartPoints[0].getX(projection);
                        for (var _i = 0, _a = this.chartPoints; _i < _a.length; _i++) {
                            var point = _a[_i];
                            var xOffset = xOffsetBetweenPoints + this.xOffsetSum;
                            point.translate(xOffset, offset.y, projection);
                        }
                    }
                    break;
            }
        }
        if (gesture.state == GestureState.CONTINUED) {
            this.showDrawingTooltip();
        }
        else {
            this.hideDrawingTooltip();
        }
        this.chartPanel.setNeedsUpdate();
    };
    Drawing.prototype._handleClickGesture = function () {
        if (!this.selected && this.canSelect) {
            this.select();
            this.chart.setNeedsUpdate();
        }
    };
    Drawing.prototype._handleDoubleClickGesture = function () {
        if (BrowserUtils.isMobile()) {
            return;
        }
        this.fire(DrawingEvent.DOUBLE_CLICK, this);
        if (this.selectable) {
            this.showSettingsDialog();
        }
    };
    Drawing.prototype._handleContextMenuGesture = function (gesture, event) {
        this.fire(DrawingEvent.CONTEXT_MENU, this);
        if (this.selectable) {
            this._contextMenu.show(event.evt);
            event.evt.stopPropagation();
            event.evt.preventDefault();
        }
    };
    Drawing.prototype._handleMouseHover = function (gesture, event) {
        switch (gesture.state) {
            case GestureState.STARTED:
            case GestureState.CONTINUED:
                this.changeCursorStyle(event);
                this.showDrawingTooltip();
                break;
            case GestureState.FINISHED:
                this.removeCursorStyleIfThereIsNoDraggedPoint();
                this.hideDrawingTooltip();
                break;
        }
    };
    Drawing.prototype.changeCursorStyle = function (event) {
        var isPointerNearDrawingPoints = this.isPointerNearDrawingPoints(event);
        if ((this._dragPoint !== null && this._dragPoint > -1) || isPointerNearDrawingPoints) {
            this.chartPanel.rootDiv.removeClass('drawing-mouse-hover');
            this.chartPanel.rootDiv.removeClass('plot-mouse-hover');
        }
        else {
            this.chartPanel.rootDiv.addClass('drawing-mouse-hover');
        }
    };
    Drawing.prototype.isPointerNearDrawingPoints = function (event) {
        var points = this.cartesianPoints();
        for (var i = 0; i < points.length; i++) {
            if (Geometry.isPointNearPoint(event.pointerPosition, points[i]))
                return true;
        }
        return false;
    };
    Drawing.prototype.removeCursorStyleIfThereIsNoDraggedPoint = function () {
        if (this._dragPoint == DrawingDragPoint.NONE) {
            this.chartPanel.rootDiv.removeClass('drawing-mouse-hover');
        }
    };
    Drawing.prototype._handleUserDrawingPoint = function (point) {
        return false;
    };
    Drawing.prototype._handleUserDrawingClickGesture = function (gesture, event) {
        if (BrowserUtils.isMobile())
            return;
        if (!this.chartPanel) {
            event.chartPanel.addDrawings(this);
        }
        this._handleUserDrawingClickPoint(event.pointerPosition);
        if (this.chartPoints.length >= this.pointsNeeded)
            this._finishUserDrawing();
        this.chartPanel.setNeedsUpdate();
    };
    Drawing.prototype._handleUserDrawingMoveGesture = function (gesture, event) {
        if (this.chartPoints.length > 0) {
            this._lastCreatePoint = this._normalizeUserDrawingPoint(event.pointerPosition);
            this.onMoveChartPointInUserDrawingState();
            this.showDrawingTooltip();
            this.chartPanel.setNeedsUpdate();
        }
    };
    Drawing.prototype._normalizeUserDrawingPoint = function (point) {
        var magnetPoint = this._magnetChartPointIfNeeded(point);
        return ChartPoint.convert(magnetPoint, this.createPointBehavior, this.projection);
    };
    Drawing.prototype._handleUserDrawingPanGestureForMobile = function (gesture, event) {
        var eventPoint = event.pointerPosition;
        switch (gesture.state) {
            case GestureState.STARTED:
                if (!this.chartPanel) {
                    event.chartPanel.addDrawings(this);
                    this._handleUserDrawingClickPoint(eventPoint);
                }
                this.chartPanel.setNeedsUpdate();
                break;
            case GestureState.CONTINUED:
                this._lastCreatePoint = this._normalizeUserDrawingPoint(eventPoint);
                this.onMoveChartPointInUserDrawingState();
                this.chartPanel.setNeedsUpdate();
                break;
            case GestureState.FINISHED:
                if (this._lastCreatePoint !== null)
                    this._handleUserDrawingClickPoint(eventPoint);
                if (this.chartPoints.length >= this.pointsNeeded)
                    this._finishUserDrawing();
                this.chartPanel.setNeedsUpdate();
                break;
        }
    };
    Drawing.prototype._handleUserDrawingClickPoint = function (eventPoint) {
        var point = this._normalizeUserDrawingPoint(eventPoint);
        this._lastCreatePoint = null;
        if (!this._handleUserDrawingPoint(point)) {
            this.appendChartPoint(point);
            this.onAddNewChartPointInUserDrawingState();
        }
    };
    Drawing.prototype.showSettingsDialog = function () {
        var showDrawingSettingsRequest = { type: ChannelRequestType.DrawingSettingsDialog, drawing: this };
        ChartAccessorService.instance.sendSharedChannelRequest(showDrawingSettingsRequest);
    };
    Drawing.prototype.duplicate = function () {
        this.chart._copyDrawing(this);
        this.chart._pasteDrawing();
    };
    Drawing.prototype.appendChartPoint = function (point) {
        var points = this._options.points;
        points.push(new ChartPoint(point));
        return points;
    };
    Drawing.prototype.cartesianPoint = function (index) {
        var point = this.chartPoints[index];
        return point && point.toPoint(this.projection);
    };
    Drawing.prototype.cartesianPoints = function () {
        var projection = this.projection;
        return this.chartPoints.map(function (item) { return item.toPoint(projection); });
    };
    Drawing.prototype.select = function () {
        if (!this.selected && this.canSelect)
            this.chart.selectObject(this);
    };
    Drawing.prototype.translate = function (dx, dy) {
        var projection = this.projection;
        for (var _i = 0, _a = this.chartPoints; _i < _a.length; _i++) {
            var chartPoint = _a[_i];
            chartPoint.translate(dx, dy, projection);
        }
    };
    Drawing.prototype.bounds = function () {
        return null;
    };
    Drawing.prototype.startUserDrawing = function () {
        if (BrowserUtils.isMobile()) {
            this._createPanGestureForMobile = new PanGesture({
                hitTest: function () {
                    return true;
                },
                handler: this._handleUserDrawingPanGestureForMobile,
                context: this
            });
        }
        this._createClickGesture = new ClickGesture({
            hitTest: function () {
                return true;
            },
            handler: this._handleUserDrawingClickGesture,
            context: this,
        });
        this._createMoveGesture = new MouseHoverGesture({
            enterEventEnabled: false,
            leaveEventEnabled: false,
            hitTest: function () {
                return true;
            },
            handler: this._handleUserDrawingMoveGesture,
            context: this,
        });
        this.chartPoints = [];
        this.selected = true;
        var panel = this.chartPanel;
        if (panel) {
            panel.deleteDrawings(this);
            panel.setNeedsUpdate();
            this.chartPanel = null;
        }
    };
    Drawing.prototype.cleanGestures = function () {
        this._createClickGesture = null;
        this._createMoveGesture = null;
        this._createPanGestureForMobile = null;
        this._lastCreatePoint = null;
    };
    Drawing.prototype._finishUserDrawing = function () {
        this.cleanGestures();
        this.chart._finishUserDrawing(this);
    };
    Drawing.prototype.hitTest = function (point) {
        return false;
    };
    Drawing.prototype.handleEvent = function (event) {
        if (BrowserUtils.isMobile()) {
            if (this._createPanGestureForMobile && this._createPanGestureForMobile.handleEvent(event)) {
                return true;
            }
        }
        if (this._createClickGesture) {
            return this._createClickGesture.handleEvent(event) ||
                this._createMoveGesture.handleEvent(event);
        }
        return this._gestures.handleEvent(event);
    };
    Drawing.prototype._setDragPoint = function (dragPoint) {
        if (this._dragPoint !== dragPoint) {
            this._dragPoint = dragPoint;
            if (this._dragPoint === DrawingDragPoint.NONE)
                this.finishedDragging();
            else {
                this.fire(DrawingEvent.DRAG_STARTED);
                this.select();
            }
        }
    };
    Drawing.prototype.finishedDragging = function () {
        this.fire(DrawingEvent.DRAG_FINISHED);
    };
    Drawing.prototype.resetDefaultSettings = function () {
        this._options = DrawingsDefaultSettings.getResettedDrawingSettings(this.chart.getThemeType(), this.className, this._options);
    };
    Drawing.prototype.saveAsDefaultSettings = function () {
        DrawingsDefaultSettings.setDrawingDefaultSettings(this.chart.getThemeType(), this.className, this._options);
    };
    Drawing.prototype.drawTextInBox = function (lineTheme, point, text, abovePoint, fontSize, fontFamily) {
        if (fontSize === void 0) { fontSize = 13; }
        if (fontFamily === void 0) { fontFamily = 'arial'; }
        var margin = 6;
        var padding = 4;
        var textTheme = { fillColor: HtmlUtil.isDarkColor(lineTheme.strokeColor) ? 'white' : 'black', fontSize: fontSize, fontFamily: fontFamily, textBaseline: 'middle', fontWeight: 'bold' };
        this.context.scxApplyTextTheme(textTheme);
        var width = this.findWidthForBoxContainingText(text) + padding;
        var height = textTheme.fontSize + padding * 2;
        var yPosition = abovePoint ? point.y - height - margin : point.y + margin;
        this.context.scxApplyFillTheme({ fillColor: lineTheme.strokeColor });
        this.context.fillRect(point.x - Math.floor(width / 2), yPosition, width, height);
        this.context.scxApplyTextTheme(textTheme);
        this.context.fillText(text, point.x - Math.floor(width / 2) + padding + 1, yPosition + Math.floor(height / 2));
    };
    Drawing.prototype.drawLineWithBoxNumber = function (lineTheme, point1, point2, number) {
        var numberTheme = { fillColor: HtmlUtil.isDarkColor(lineTheme.strokeColor) ? 'white' : 'black', fontSize: 12, fontFamily: 'arial', textBaseline: 'top', fontWeight: 'bold' };
        this.context.scxApplyTextTheme(numberTheme);
        var width = this.findWidthForBoxContainingText(number);
        this.context.moveTo(point1.x, point1.y);
        this.context.lineTo(point2.x, point2.y);
        this.context.scxStroke({ strokeColor: lineTheme.strokeColor, width: 1 });
        this.context.scxApplyFillTheme({ fillColor: lineTheme.strokeColor });
        this.context.fillRect((point1.x + point2.x - width) / 2, (point1.y + point2.y - 18) / 2, width, parseInt('12px arial', 15));
        this.context.scxApplyTextTheme(numberTheme);
        this.context.fillText(number, ((point1.x + point2.x - width) / 2) + 3, ((point1.y + point2.y - 11) / 2));
    };
    Drawing.prototype.findWidthForBoxContainingText = function (text) {
        var metrics = this.context.measureText(text);
        return metrics.width + 6;
    };
    Drawing.prototype.drawBoxNumberOnAnExistingLine = function (lineTheme, point1, point2, number) {
        var numberTheme = { fillColor: HtmlUtil.isDarkColor(lineTheme.strokeColor) ? 'white' : 'black', fontSize: 12, fontFamily: 'arial', textBaseline: 'top', fontWeight: 'bold' };
        this.context.scxApplyTextTheme(numberTheme);
        var width = this.findWidthForBoxContainingText(number);
        this.context.scxApplyFillTheme({ fillColor: lineTheme.strokeColor });
        this.context.fillRect((point1.x + point2.x - width) / 2, (point1.y + point2.y - 18) / 2, width, parseInt('12px arial', 15));
        this.context.scxApplyTextTheme(numberTheme);
        this.context.fillText(number, ((point1.x + point2.x - width) / 2) + 3, ((point1.y + point2.y - 11) / 2));
    };
    Drawing.prototype.drawBowsWithLetters = function (lineTheme, point, letter, position) {
        var textTheme = { fillColor: lineTheme.strokeColor, fontSize: 20, fontFamily: 'arial', textBaseline: 'top' };
        this.context.scxApplyTextTheme(textTheme);
        this.context.fillText('(' + letter + ')', point.x - 13, position);
    };
    Drawing.prototype.bowsPosition = function (point, initPosition) {
        if (this.cartesianPoints()[2] !== undefined && this.cartesianPoints()[3] !== undefined) {
            if (this.cartesianPoints()[2].y <= this.cartesianPoints()[1].y) {
                if (initPosition == 'bottom') {
                    return point.y - 25;
                }
                else if (initPosition == 'top') {
                    return point.y + 3;
                }
                else {
                    return;
                }
            }
        }
        if (initPosition == 'bottom') {
            return point.y + 3;
        }
        else if (initPosition == 'top') {
            return point.y - 25;
        }
        else {
            return;
        }
    };
    Drawing.prototype.showDrawingTooltip = function () {
        if (this.hasTooltip) {
            ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Drawing, {
                chartPanel: this.chartPanel,
                points: this.chartPoints
            });
        }
    };
    Drawing.prototype.hideDrawingTooltip = function () {
        ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Drawing);
    };
    Drawing.prototype._handlePanGesture = function (gesture, event) {
        return false;
    };
    Drawing.prototype._drawSelectionMarkers = function (points) {
        if (!points)
            return;
        var marker = this.chart.selectionMarker;
        if (Array.isArray(points)) {
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                var inDrawingMode = this._lastCreatePoint != null;
                var isPointBeingDragged = this._dragPoint == i || (inDrawingMode && i == points.length - 1);
                if (inDrawingMode || isPointBeingDragged) {
                    var isPointCloseToThePrice = this.isPointCloseToThePrice(point);
                    if (isPointCloseToThePrice) {
                        marker.draw(this.context, point, this.pointerPointTheme().onPriceSelectionMarker);
                    }
                    else {
                        marker.draw(this.context, point, this.pointerPointTheme().movingSelectionMarker);
                    }
                }
                if (!isPointBeingDragged) {
                    marker.draw(this.context, point, this.pointerPointTheme().selectionMarker);
                }
            }
        }
        else {
            marker.draw(this.context, points, this.pointerPointTheme().selectionMarker);
        }
    };
    Drawing.prototype._magnetChartPointIfNeeded = function (point) {
        var candlePoints = this.getHoveredCandlePoints();
        var updatedPoint = point;
        var smallestDistance = this.magnetRadius;
        for (var _i = 0, candlePoints_1 = candlePoints; _i < candlePoints_1.length; _i++) {
            var candlePoint = candlePoints_1[_i];
            var distance = Math.abs(point.y - candlePoint.y);
            if (distance <= smallestDistance) {
                smallestDistance = distance;
                updatedPoint = candlePoint;
            }
        }
        return updatedPoint;
    };
    Drawing.prototype.getHoveredCandlePoints = function () {
        var dataSeries = this.chart.barDataSeries();
        var hoveredRecord = this.chart.hoveredRecord;
        var open = dataSeries.open.valueAtIndex(hoveredRecord), high = dataSeries.high.valueAtIndex(hoveredRecord), low = dataSeries.low.valueAtIndex(hoveredRecord), close = dataSeries.close.valueAtIndex(hoveredRecord);
        var hoveredRecordX = this.chartPanel.projection.xByRecord(hoveredRecord);
        var openPoint = { x: hoveredRecordX, y: this.chartPanel.projection.yByValue(open) }, highPoint = { x: hoveredRecordX, y: this.chartPanel.projection.yByValue(high) }, lowPoint = { x: hoveredRecordX, y: this.chartPanel.projection.yByValue(low) }, closePoint = { x: hoveredRecordX, y: this.chartPanel.projection.yByValue(close) };
        var points = [openPoint, highPoint, lowPoint, closePoint];
        return points;
    };
    Drawing.prototype.saveState = function () {
        var state = _super.prototype.saveState.call(this);
        state.className = this.className;
        return state;
    };
    Drawing.prototype.loadState = function (state) {
        state = state || {};
        var runMappingForBackwardCompatibility = false;
        if (state.options) {
            runMappingForBackwardCompatibility = true;
        }
        _super.prototype.loadState.call(this, state);
        this._options = $.extend({}, DrawingsDefaultSettings.getDrawingDefaultSettings(this.chart.getThemeType(), this.className), state.options);
        if (DrawingsDefaultSettings.hasCustomSettings(this.chart.getThemeType(), this.className)) {
            runMappingForBackwardCompatibility = true;
        }
        if (runMappingForBackwardCompatibility) {
            this.mapThemeForBackwardCompatibility(this._options);
        }
        this.onLoadState();
        var options = this._options, suppress = this.suppressEvents(true);
        if (!this.createPointBehavior) {
            this.createPointBehavior = this.getDefaultPointBehaviour();
        }
        this.chartPoints = (options && options.points);
        if (options.visible == null)
            this.visible = Drawing.defaults.visible;
        if (options.selectable == null)
            this.selectable = Drawing.defaults.selectable;
        if (options.locked == null)
            this.locked = Drawing.defaults.locked;
        if (options.resizable == null)
            this.resizable = Drawing.defaults.resizable;
        this.id = options.id ? options.id : JsUtil.guid();
        this.suppressEvents(suppress);
    };
    Drawing.prototype.getDefaultPointBehaviour = function () {
        return {
            x: XPointBehavior.DATE,
            y: YPointBehavior.VALUE
        };
    };
    Drawing.prototype.onLoadState = function () { };
    Drawing.prototype.drawSelectionMarkers = function () {
        if (!this.shouldDrawMarkers())
            return;
        if (!this.visible)
            return;
        var points = this.cartesianPoints();
        if (points.length >= 1 && this.selected) {
            this.drawingMarkers.drawSelectionValueMarkers(this.chart, points, this.context, this.projection, this.panelValueScale);
            this.chart.dateScale.bottomPanel.drawSelectionMarker(this.drawingMarkers, points, this.projection);
        }
    };
    Drawing.prototype.shouldDrawMarkers = function () {
        return this.canControlPointsBeManuallyChanged();
    };
    Drawing.prototype.clone = function () {
        var state = this.saveState();
        state.options.id = null;
        return Drawing.deserialize(this.chart, state);
    };
    Drawing.prototype.preDeleteCleanUp = function () { };
    Drawing.prototype.onRemove = function () { };
    Drawing.prototype.onAddNewChartPointInUserDrawingState = function () { };
    Drawing.prototype.onMoveChartPointInUserDrawingState = function () { };
    Drawing.prototype.canControlPointsBeManuallyChanged = function () {
        return true;
    };
    Drawing.prototype.canAddAlerts = function () {
        return false;
    };
    Drawing.prototype.addOrEditAlert = function () {
        Tc.error("drawing not support alert");
    };
    Drawing.prototype.deleteDrawingIfNoTextExists = function () {
        return false;
    };
    Drawing.prototype.onApplySettings = function () { };
    Drawing.prototype.pointsCompleted = function () {
        return this.chartPoints.length == this.pointsNeeded;
    };
    Drawing.prototype.mapThemeForBackwardCompatibility = function (options) {
        if (!options.theme) {
            return;
        }
        var originalSettings = DrawingsDefaultSettings.getDrawingOriginalSettings(this.chart.getThemeType(), this.className);
        if (originalSettings.theme) {
            var theme = options.theme;
            ThemeUtils.mapThemeValuesForBackwardCompatibility(theme, originalSettings.theme);
        }
    };
    Drawing.prototype.formatLevelText = function (value, formatType) {
        var numberOfDigitFormat = 0;
        switch (formatType) {
            case DrawingLevelsFormatType.LEVEL:
                numberOfDigitFormat = 3;
                break;
            case DrawingLevelsFormatType.PERCENT:
                numberOfDigitFormat = 2;
                break;
            case DrawingLevelsFormatType.PRICE:
                numberOfDigitFormat = this.chart.numberOfDigitFormat;
                break;
            default:
                Tc.error("fail to find format type of drawing level" + formatType);
        }
        return StringUtils.formatMoney(value, numberOfDigitFormat);
    };
    Drawing.prototype.isPointCloseToThePrice = function (point) {
        var candlePoints = this.getHoveredCandlePoints();
        var smallestDistance = this.magnetRadius;
        for (var _i = 0, candlePoints_2 = candlePoints; _i < candlePoints_2.length; _i++) {
            var candlePoint = candlePoints_2[_i];
            if (Math.abs(point.y - candlePoint.y) <= smallestDistance) {
                return true;
            }
        }
    };
    Drawing.prototype.pointerPointTheme = function () {
        return this.chart.getThemeType() == ThemeType.Light ? Theme.Light.pointerPoint : Theme.Dark.pointerPoint;
    };
    Drawing.defaults = {
        visible: true,
        selectable: true,
        locked: false,
        resizable: true
    };
    return Drawing;
}(ChartPanelObject));
export { Drawing };
JsUtil.applyMixins(Drawing, [DrawingRegistrar]);
//# sourceMappingURL=Drawing.js.map