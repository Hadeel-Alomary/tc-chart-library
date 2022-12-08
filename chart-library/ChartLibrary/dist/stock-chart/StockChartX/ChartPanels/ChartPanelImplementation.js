import { __extends } from "tslib";
import { PanelEvent, PanelMoveDirection, PanelMoveKind } from "./ChartPanel";
import { FrameControl } from "../Controls/FrameControl";
import { GestureArray } from "../Gestures/GestureArray";
import { PanGesture } from "../Gestures/PanGesture";
import { MouseWheelGesture } from "../Gestures/MouseWheelGesture";
import { ClickGesture } from "../Gestures/ClickGesture";
import { DoubleClickGesture } from "../Gestures/DoubleClickGesture";
import { GestureState } from '../Gestures/Gesture';
import { ChartEvent, ChartState } from "../Chart";
import { JsUtil } from "../Utils/JsUtil";
import { Plot, PlotDrawingOrderType, PlotType } from "../Plots/Plot";
import { Drawing } from "../Drawings/Drawing";
import { Rect } from "../Graphics/Rect";
import { Animation } from "../Graphics/Animation";
import { ChartPanelValueScaleImplementation } from "../Scales/ChartPanelValueScaleImplementation";
import { ViewLoaderType, ChartAccessorService } from '../../../services/index';
import { BrowserUtils, ColorUtils, Tc } from '../../../utils';
import { OrderDrawing } from '../TradingDrawings/OrderDrawing';
import { PositionDrawing } from '../TradingDrawings/PositionDrawing';
import { TakeProfitDrawing } from '../TradingDrawings/TakeProfitDrawing';
import { StopLossDrawing } from '../TradingDrawings/StopLossDrawing';
import { ValueMarkerOwnerOperations } from '../ValueMarkerOwner';
import { ChartAlertCrossDrawing } from '../AlertDrawings/ChartAlertCrossDrawing';
import { ChartAlertChannelDrawing } from '../AlertDrawings/ChartAlertChannelDrawing';
import { ThemeType } from '../ThemeType';
import { HtmlUtil } from '../Utils/HtmlUtil';
import { ChartPanelMenu } from '../../StockChartX.UI/ChartPanelMenu';
import { TAIndicator } from '../Indicators/TAIndicator';
var Class = {
    CONTAINER: 'scxChartPanel',
    SCROLL: 'scxPanelScroll',
    WATERMARK: 'scxWatermark',
    WATERMARK_CONTENT: 'scxWatermarkContent',
    WATERMARK_SYMBOL: 'scxWatermarkSymbol',
    WATERMARK_INFO: 'scxWatermarkInfo',
    WATERMARK_LOGO: 'scxWatermarkLogo',
    TITLE: 'scxPanelTitle',
    TITLE_CAPTION: 'scxPanelTitleCaption',
    TITLE_VALUE: 'scxPanelTitleValue',
    OPTIONS: 'scxPanelOptions',
    OPTIONS_ICON: 'scxPanelTitleIcon',
    OPTIONS_CLOSE: 'scxPanelClose',
    OPTIONS_MOVE_UP: 'scxPanelMoveUp',
    OPTIONS_MOVE_DOWN: 'scxPanelMoveDown',
    OPTIONS_SETTINGS: 'scxPanelSettings',
    OPTIONS_MAXIMIZE: 'scxPanelMaximize',
    OPTIONS_MENU: 'scxPanelMenu'
};
var ChartPanelImplementation = (function (_super) {
    __extends(ChartPanelImplementation, _super);
    function ChartPanelImplementation(config) {
        var _this = _super.call(this) || this;
        _this._valueScales = [];
        _this._plots = [];
        _this._drawings = [];
        _this._tradingDrawings = [];
        _this._futureOrderDrawings = [];
        _this._chartAlertDrawings = [];
        _this._contentFrame = new Rect();
        _this._controls = {
            title: null,
            options: null,
            watermark: null,
            moveUp: null,
            moveDown: null,
            close: null,
            settings: null,
            maximize: null,
            menu: null,
        };
        _this._barInfoControls = null;
        _this._updateAnimation = new Animation({
            context: _this,
            recurring: false,
            callback: _this._onUpdateAnimationCallback,
        });
        _this._updateHoverRecordAnimation = new Animation({
            context: _this,
            recurring: false,
            callback: _this._onUpdateHoverRecordAnimationCallback,
        });
        if (typeof config !== 'object')
            throw new Error('Config must be an object.');
        _this._panelsContainer = config.chartPanelsContainer;
        _this.loadState(config);
        _this._initChartPanelMenu();
        return _this;
    }
    Object.defineProperty(ChartPanelImplementation.prototype, "chartPanelsContainer", {
        get: function () {
            return this._panelsContainer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "chart", {
        get: function () {
            return this._panelsContainer.chart;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "valueScales", {
        get: function () {
            return this._valueScales;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "valueScale", {
        get: function () {
            return this._valueScales[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "formatter", {
        get: function () {
            return this.valueScale.formatter;
        },
        set: function (value) {
            this.valueScale.formatter = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "canvas", {
        get: function () {
            return this._canvas;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "heightRatio", {
        get: function () {
            return this._options.heightRatio;
        },
        set: function (ratio) {
            if (!JsUtil.isFiniteNumber(ratio) || ratio < this._options.minHeightRatio || ratio > this._options.maxHeightRatio)
                throw new Error("Height ratio must be a number in range [minHeightRatio..maxHeightRatio]");
            this._options.heightRatio = ratio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "minHeightRatio", {
        get: function () {
            return this._options.minHeightRatio;
        },
        set: function (ratio) {
            if (!JsUtil.isFiniteNumber(ratio) || ratio < 0 || ratio > this._options.maxHeightRatio)
                throw new Error("Min height ratio must be a number in range [0..maxHeightRatio].");
            this._options.minHeightRatio = ratio;
            if (this._options.heightRatio < ratio)
                this._options.heightRatio = ratio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "maxHeightRatio", {
        get: function () {
            return this._options.maxHeightRatio;
        },
        set: function (ratio) {
            if (!JsUtil.isFiniteNumber(ratio) || ratio < this._options.minHeightRatio || ratio > 1)
                throw new Error("Max height ratio must be a number in range [minHeightRatio..1]");
            this._options.maxHeightRatio = ratio;
            if (this._options.heightRatio > ratio)
                this._options.heightRatio = ratio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "moveDirection", {
        get: function () {
            return this._options.moveDirection;
        },
        set: function (direction) {
            this._options.moveDirection = direction;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "moveKind", {
        get: function () {
            return this._options.moveKind;
        },
        set: function (value) {
            this._options.moveKind = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "xGridVisible", {
        get: function () {
            return this._options.showXGrid;
        },
        set: function (visible) {
            var newValue = !!visible, oldValue = this._options.showXGrid;
            if (oldValue !== newValue) {
                this._options.showXGrid = newValue;
                this._fire(PanelEvent.X_GRID_VISIBLE_CHANGED, newValue, oldValue);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "yGridVisible", {
        get: function () {
            return this._options.showYGrid;
        },
        set: function (visible) {
            var newValue = !!visible, oldValue = this._options.showYGrid;
            if (oldValue !== newValue) {
                this._options.showYGrid = newValue;
                this._fire(PanelEvent.Y_GRID_VISIBLE_CHANGED, newValue, oldValue);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "plots", {
        get: function () {
            return this._plots;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "drawings", {
        get: function () {
            return this._drawings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "tradingDrawings", {
        get: function () {
            return this._tradingDrawings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "chartAlertDrawing", {
        get: function () {
            return this._chartAlertDrawings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "actualTheme", {
        get: function () {
            return this.chart.theme.chartPanel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "projection", {
        get: function () {
            return this.valueScale.projection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "titleDiv", {
        get: function () {
            return this._controls.title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "indicators", {
        get: function () {
            var chart = this.chart;
            var chartIndicators = chart.indicators;
            var panelIndicators = [];
            for (var _i = 0, chartIndicators_1 = chartIndicators; _i < chartIndicators_1.length; _i++) {
                var indicator = chartIndicators_1[_i];
                if (indicator.chartPanel === this)
                    panelIndicators.push(indicator);
            }
            return panelIndicators;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "contentFrame", {
        get: function () {
            return this._contentFrame;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartPanelImplementation.prototype, "maximized", {
        get: function () {
            return this._options.maximized;
        },
        set: function (value) {
            this._options.maximized = value;
        },
        enumerable: false,
        configurable: true
    });
    ChartPanelImplementation.prototype._fire = function (event, newValue, oldValue) {
        var chart = this.chart;
        if (chart)
            chart.fireTargetValueChanged(this, event, newValue, oldValue);
    };
    ChartPanelImplementation.prototype.getIndex = function () {
        return this._panelsContainer.panels.indexOf(this);
    };
    ChartPanelImplementation.prototype.getProjection = function (chartValueScale) {
        var index = chartValueScale ? chartValueScale.index : 0;
        return this.valueScales[index].projection;
    };
    ChartPanelImplementation.prototype.getValueScale = function (chartValueScale) {
        var index = chartValueScale ? chartValueScale.index : 0;
        return this.valueScales[index];
    };
    ChartPanelImplementation.prototype.setHeightRatio = function (ratio) {
        this._panelsContainer.setPanelHeightRatio(this, ratio);
    };
    ChartPanelImplementation.prototype.setNeedsAutoScale = function () {
        for (var _i = 0, _a = this._valueScales; _i < _a.length; _i++) {
            var scale = _a[_i];
            scale.setNeedsAutoScale();
        }
    };
    ChartPanelImplementation.prototype.setAxisScale = function (axisScaleType) {
        this._valueScales[0].axisScale = axisScaleType;
    };
    ChartPanelImplementation.prototype.getAxisScale = function () {
        return this._valueScales[0].axisScale;
    };
    ChartPanelImplementation.prototype.containsPlot = function (plot) {
        for (var _i = 0, _a = this._plots; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item === plot)
                return true;
        }
        return false;
    };
    ChartPanelImplementation.prototype.addPlot = function (plot) {
        if (Array.isArray(plot)) {
            for (var _i = 0, plot_1 = plot; _i < plot_1.length; _i++) {
                var plotItem = plot_1[_i];
                this.addPlot(plotItem);
            }
        }
        else {
            if (!(plot instanceof Plot))
                throw new TypeError('Plot must be an instance of Plot.');
            if (this.containsPlot(plot))
                return;
            plot.chartPanel = this;
            this._plots.push(plot);
            this._fire(PanelEvent.PLOT_ADDED, plot);
        }
    };
    ChartPanelImplementation.prototype.removePlot = function (plot) {
        if (Array.isArray(plot)) {
            for (var _i = 0, plot_2 = plot; _i < plot_2.length; _i++) {
                var plotItem = plot_2[_i];
                this.removePlot(plotItem);
            }
        }
        else {
            var plots = this._plots;
            for (var i = 0; i < plots.length; i++) {
                if (plots[i] === plot) {
                    plots.splice(i, 1);
                    this._fire(PanelEvent.PLOT_REMOVED, plot);
                }
            }
            if (this.chart.selectedObject == plot) {
                this.chart.selectObject(null);
            }
        }
    };
    ChartPanelImplementation.prototype.containsDrawing = function (drawing) {
        for (var _i = 0, _a = this._drawings; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item === drawing) {
                return true;
            }
        }
        return false;
    };
    ChartPanelImplementation.prototype.addDrawings = function (drawings) {
        if (Array.isArray(drawings)) {
            for (var _i = 0, drawings_1 = drawings; _i < drawings_1.length; _i++) {
                var item = drawings_1[_i];
                this.addDrawings(item);
            }
        }
        else {
            var drawing = drawings;
            if (!(drawing instanceof Drawing))
                throw new TypeError("Drawing is not an instance of Drawing.");
            if (this.containsDrawing(drawing)) {
                throw new Error("Drawing already added.");
            }
            drawing.chartPanel = this;
            this._drawings.push(drawing);
        }
    };
    ChartPanelImplementation.prototype.getTradingOrders = function () {
        return this._tradingDrawings.filter(function (d) { return d instanceof OrderDrawing; }).map(function (d) { return d.getOrder(); });
    };
    ChartPanelImplementation.prototype.updateTradingOrder = function (order) {
        var orderDrawing = this._tradingDrawings.find(function (d) { return (d instanceof OrderDrawing) && d.getOrder().id == order.id; });
        if (orderDrawing) {
            this.removeTradingOrder(order);
            this.addTradingOrder(order);
        }
    };
    ChartPanelImplementation.prototype.addTradingOrder = function (order) {
        var orderDrawing = new OrderDrawing(this.chart, order);
        orderDrawing.chartPanel = this;
        this._tradingDrawings.push(orderDrawing);
        this.addFutureOrders(order);
    };
    ChartPanelImplementation.prototype.addTradingPosition = function (position) {
        var existingPosition = this._tradingDrawings.find(function (d) { return d instanceof PositionDrawing; });
        Tc.assert(existingPosition == null, "already position drawing exists, can't add another");
        var positionDrawing = new PositionDrawing(this.chart, position);
        positionDrawing.chartPanel = this;
        this._tradingDrawings.push(positionDrawing);
    };
    ChartPanelImplementation.prototype.removeTradingPosition = function () {
        var positionDrawing = this._tradingDrawings.find(function (d) { return d instanceof PositionDrawing; });
        if (positionDrawing) {
            this._tradingDrawings.splice(this._tradingDrawings.indexOf(positionDrawing), 1);
        }
    };
    ChartPanelImplementation.prototype.removeTradingOrder = function (order) {
        var orderDrawing = this._tradingDrawings.find(function (d) { return (d instanceof OrderDrawing) && d.getOrder().id == order.id; });
        if (orderDrawing) {
            this._tradingDrawings.splice(this._tradingDrawings.indexOf(orderDrawing), 1);
            this.removeFutureOrders(order);
        }
    };
    ChartPanelImplementation.prototype.removeFutureOrders = function (order) {
        var _this = this;
        var specialOrderDrawings = this._futureOrderDrawings.filter(function (d) { return d.getOrder().id == order.id; });
        specialOrderDrawings.forEach(function (specialOrderDrawing) { return _this._futureOrderDrawings.splice(_this._futureOrderDrawings.indexOf(specialOrderDrawing), 1); });
    };
    ChartPanelImplementation.prototype.addFutureOrders = function (order) {
        if (order.takeProfit) {
            var takeProfitDrawing = new TakeProfitDrawing(this.chart, order);
            takeProfitDrawing.chartPanel = this;
            this._futureOrderDrawings.push(takeProfitDrawing);
        }
        if (order.stopLoss) {
            var stopLossDrawing = new StopLossDrawing(this.chart, order);
            stopLossDrawing.chartPanel = this;
            this._futureOrderDrawings.push(stopLossDrawing);
        }
    };
    ChartPanelImplementation.prototype.getChartAlerts = function () {
        return this._chartAlertDrawings.map(function (d) { return d.getAlert(); });
    };
    ChartPanelImplementation.prototype.updateChartAlert = function (alert) {
        var alertDrawing = this._chartAlertDrawings.find(function (d) { return d.getAlert().id == alert.id; });
        if (alertDrawing) {
            alertDrawing.setAlert(alert);
        }
    };
    ChartPanelImplementation.prototype.addChartAlert = function (alert) {
        var alertDrawing = alert.hasChannelFunction() ?
            new ChartAlertChannelDrawing(this.chart, alert) :
            new ChartAlertCrossDrawing(this.chart, alert);
        alertDrawing.chartPanel = this;
        this._chartAlertDrawings.push(alertDrawing);
    };
    ChartPanelImplementation.prototype.removeChartAlert = function (alert) {
        var alertDrawing = this._chartAlertDrawings.find(function (d) { return d.getAlert().id == alert.id; });
        if (alertDrawing) {
            this._chartAlertDrawings.splice(this._chartAlertDrawings.indexOf(alertDrawing), 1);
        }
    };
    ChartPanelImplementation.prototype.deleteDrawings = function (drawings) {
        var drawingsToDelete;
        if (!drawings) {
            drawingsToDelete = this._drawings;
        }
        else if (drawings instanceof Array) {
            drawingsToDelete = drawings;
        }
        else {
            drawingsToDelete = [drawings];
        }
        for (var _i = 0, drawingsToDelete_1 = drawingsToDelete; _i < drawingsToDelete_1.length; _i++) {
            var drawing = drawingsToDelete_1[_i];
            drawing.preDeleteCleanUp();
        }
        this.removeDrawingsFromPanel(drawings);
    };
    ChartPanelImplementation.prototype.clearPanelOnLoadState = function () {
        this.removeDrawingsFromPanel();
    };
    ChartPanelImplementation.prototype.removeDrawingsFromPanel = function (drawings) {
        var shouldRemove = function (item) {
            if (!drawings || drawings === item)
                return true;
            for (var _i = 0, _a = drawings; _i < _a.length; _i++) {
                var drawing = _a[_i];
                if (drawing === item)
                    return true;
            }
            return false;
        };
        var chart = this.chart, panelDrawings = this._drawings, userDrawingToCancel = null;
        for (var i = 0; i < panelDrawings.length; i++) {
            var item = panelDrawings[i];
            if (shouldRemove(item)) {
                item.onRemove();
                if (drawings)
                    panelDrawings.splice(i, 1);
                if (chart.selectedObject === item) {
                    chart.selectedObject.hideDrawingTooltip();
                    if (chart.state === ChartState.USER_DRAWING)
                        userDrawingToCancel = chart.selectedObject;
                    else
                        chart.selectObject(null);
                    if (item.chartPanel.rootDiv.hasClass('drawing-mouse-hover'))
                        item.chartPanel.rootDiv.removeClass('drawing-mouse-hover');
                }
                break;
            }
        }
        if (userDrawingToCancel)
            chart.cancelUserDrawing();
        if (!drawings)
            panelDrawings.length = 0;
        this.setNeedsUpdate();
    };
    ChartPanelImplementation.prototype.handleEvent = function (event) {
        if (this.chart.readOnly) {
            return true;
        }
        var oldX = event.pointerPosition.x, oldY = event.pointerPosition.y;
        event.pointerPosition.x -= this.frame.left;
        event.pointerPosition.y -= this.frame.top;
        for (var _i = 0, _a = this._valueScales; _i < _a.length; _i++) {
            var scale = _a[_i];
            if (scale.handleEvent(event)) {
                return true;
            }
        }
        try {
            var chart = this.chart;
            if (chart.state == ChartState.ZOOMING) {
                if (!this.hitTest(event.pointerPosition))
                    return false;
                if (this.chart.zoomTool.handleEvent(event))
                    return true;
            }
            if (chart.state == ChartState.MEASURING) {
                if (this.chart.measurementTool.handleEvent(event)) {
                    return true;
                }
            }
            if (chart.state === ChartState.USER_DRAWING) {
                event.pointerPosition.x = oldX;
                event.pointerPosition.y = oldY;
                if (!this.hitTest(event.pointerPosition)) {
                    return false;
                }
                var drawing = chart.selectedObject, drawingPanel = drawing.chartPanel;
                if (drawingPanel && drawingPanel !== this)
                    return;
                event.pointerPosition.x -= this.frame.left;
                event.pointerPosition.y -= this.frame.top;
                event.chartPanel = this;
                if (drawing.handleEvent(event)) {
                    return true;
                }
                else {
                    return _super.prototype.handleEvent.call(this, event);
                }
            }
            for (var _b = 0, _c = this.chart.getChartAnnotations(); _b < _c.length; _b++) {
                var customChartPanelObject = _c[_b];
                if (customChartPanelObject.handleEvent(event)) {
                    return true;
                }
            }
            for (var _d = 0, _e = this._drawings; _d < _e.length; _d++) {
                var drawing = _e[_d];
                if (drawing.handleEvent(event)) {
                    return true;
                }
            }
            for (var _f = 0, _g = this._tradingDrawings; _f < _g.length; _f++) {
                var drawing = _g[_f];
                if (drawing.handleEvent(event)) {
                    return true;
                }
            }
            for (var _h = 0, _j = this._futureOrderDrawings; _h < _j.length; _h++) {
                var drawing = _j[_h];
                if (drawing.handleEvent(event)) {
                    return true;
                }
            }
            if (BrowserUtils.isDesktop()) {
                for (var _k = 0, _l = this._chartAlertDrawings; _k < _l.length; _k++) {
                    var drawing = _l[_k];
                    if (drawing.handleEvent(event)) {
                        return true;
                    }
                }
                for (var _m = 0, _o = this.indicators; _m < _o.length; _m++) {
                    var indicator = _o[_m];
                    if (indicator.handleEvent(event))
                        return true;
                }
                for (var i = 0; i < this.plots.length; i++) {
                    var plot = this.plots[i];
                    if (plot.handleEvent(event))
                        return true;
                }
            }
        }
        finally {
            event.pointerPosition.x = oldX;
            event.pointerPosition.y = oldY;
        }
        return _super.prototype.handleEvent.call(this, event);
    };
    ChartPanelImplementation.prototype.getMinMaxValues = function (startIndex, count, valueScale) {
        var min = Infinity, max = -Infinity;
        for (var _i = 0, _a = this._plots; _i < _a.length; _i++) {
            var plot = _a[_i];
            if (valueScale && plot.valueScale !== valueScale)
                continue;
            if (plot.shouldAffectAutoScalingMaxAndMinLimits()) {
                var res = plot.minMaxValues(startIndex, count);
                if (res.min < min)
                    min = res.min;
                if (res.max > max)
                    max = res.max;
            }
        }
        if (!isFinite(min))
            min = -1;
        if (!isFinite(max))
            max = 1;
        if (min === max) {
            min--;
            max++;
        }
        return {
            min: min,
            max: max
        };
    };
    ChartPanelImplementation.prototype.getAutoScaledMinMaxValues = function (valueScale) {
        var dateScale = this.chart.dateScale, startIndex = dateScale.firstVisibleIndex, count = dateScale.lastVisibleIndex - startIndex + 1;
        return this.getMinMaxValues(startIndex, count, valueScale);
    };
    ChartPanelImplementation.prototype.formatValue = function (value) {
        return this.valueScale.formatAllDigitsValue(value);
    };
    ChartPanelImplementation.prototype.hitTest = function (point) {
        return this._contentFrame.containsPoint(point);
    };
    ChartPanelImplementation.prototype.saveState = function () {
        var state = {
            options: JsUtil.clone(this._options),
            valueScales: []
        };
        for (var _i = 0, _a = this._valueScales; _i < _a.length; _i++) {
            var scale = _a[_i];
            state.valueScales.push(scale.saveState());
        }
        return state;
    };
    ChartPanelImplementation.prototype.loadState = function (state) {
        state = state || {};
        var optionsState = state.options || {};
        this._options = {};
        this.minHeightRatio = optionsState.minHeightRatio !== undefined ? optionsState.minHeightRatio : 0.05;
        this.maxHeightRatio = optionsState.maxHeightRatio || 1;
        this.heightRatio = optionsState.heightRatio || 1;
        this.xGridVisible = optionsState.showXGrid !== undefined ? !!optionsState.showXGrid : true;
        this.yGridVisible = optionsState.showYGrid !== undefined ? !!optionsState.showYGrid : true;
        this.moveDirection = optionsState.moveDirection || PanelMoveDirection.HORIZONTAL;
        this.moveKind = optionsState.moveKind || PanelMoveKind.AUTOSCALED;
        this.maximized = optionsState.maximized || false;
        var scales = this._valueScales = [], scalesState = state.valueScales || [state.valueScale];
        for (var i = 0, count = this.chart.valueScales.length; i < count; i++) {
            var scale = new ChartPanelValueScaleImplementation({
                chartPanel: this
            });
            scales.push(scale);
            scale.loadState(scalesState[i]);
        }
    };
    ChartPanelImplementation.prototype.getPreferredValueScaleWidth = function (chartScale) {
        var maxWidth = 0;
        for (var _i = 0, _a = this._valueScales; _i < _a.length; _i++) {
            var scale = _a[_i];
            if (scale.chartValueScale === chartScale)
                maxWidth = Math.max(maxWidth, scale.preferredWidth());
        }
        return maxWidth;
    };
    ChartPanelImplementation.prototype.layout = function (frame) {
        this._layoutHtmlElements(frame);
        for (var _i = 0, _a = this._valueScales; _i < _a.length; _i++) {
            var scale = _a[_i];
            scale.layout(frame);
        }
    };
    ChartPanelImplementation.prototype.draw = function () {
        var context = this._context, width = this._canvas.width(), height = this._canvas.height();
        var isMainPanel = this === this.chart.mainPanel;
        context.save();
        context.clearRect(0, 0, width, height);
        context.translate(0.5, 0.5);
        this.formatter.setDecimalDigits(this.chart.numberOfDigitFormat);
        this.drawGridLines();
        for (var _i = 0, _a = this._valueScales; _i < _a.length; _i++) {
            var scale = _a[_i];
            scale.draw();
        }
        if (this.chart.cutOffDataIsLoaded()) {
            this.drawSeparatorForCutOffData();
        }
        var chartIndicators = this.chart.indicators;
        for (var _b = 0, chartIndicators_2 = chartIndicators; _b < chartIndicators_2.length; _b++) {
            var indicator = chartIndicators_2[_b];
            if (indicator.chartPanel === this)
                indicator.drawHorizontalLineValueMarkers();
        }
        this.drawValueMarkers();
        var clipFrame = this._contentFrame;
        context.beginPath();
        context.rect(clipFrame.left, 0, clipFrame.width, clipFrame.height);
        context.clip();
        if (this.chart.state == ChartState.ZOOMING && isMainPanel)
            this.chart.zoomTool.draw();
        this.drawPlots();
        for (var _c = 0, chartIndicators_3 = chartIndicators; _c < chartIndicators_3.length; _c++) {
            var indicator = chartIndicators_3[_c];
            if (indicator.chartPanel === this)
                indicator.draw();
        }
        for (var _d = 0, _e = this._tradingDrawings; _d < _e.length; _d++) {
            var drawing = _e[_d];
            drawing.draw();
        }
        if (isMainPanel) {
            for (var _f = 0, _g = this._futureOrderDrawings; _f < _g.length; _f++) {
                var drawing = _g[_f];
                drawing.draw();
            }
        }
        for (var _h = 0, _j = this._chartAlertDrawings; _h < _j.length; _h++) {
            var drawing = _j[_h];
            drawing.draw();
        }
        if (this.chart.showDrawings) {
            for (var _k = 0, _l = this._drawings; _k < _l.length; _k++) {
                var drawing = _l[_k];
                drawing.draw();
            }
        }
        if (this.chart.state == ChartState.MEASURING) {
            if (this.chart.measurementTool.isMeasuringPanel(this)) {
                this.chart.measurementTool.draw();
            }
        }
        if (isMainPanel) {
            for (var _m = 0, _o = this.chart.getChartAnnotations(); _m < _o.length; _m++) {
                var customChartPanelObject = _o[_m];
                customChartPanelObject.draw();
            }
        }
        context.restore();
        this.setNeedsUpdateHoverRecord();
    };
    ChartPanelImplementation.prototype.getReferenceValueMarkerOwner = function () {
        var pricePlot = this._plots.find(function (p) { return p.plotType == PlotType.PRICE_STYLE; });
        if (pricePlot == null && this._plots.length > 0) {
            return this._plots[0];
        }
        return pricePlot;
    };
    ChartPanelImplementation.prototype.getValueMarkerOwners = function (referenceValueMarker) {
        var owners = [];
        for (var _i = 0, _a = this._plots; _i < _a.length; _i++) {
            var plot = _a[_i];
            if (plot.plotType == PlotType.INDICATOR && plot != referenceValueMarker) {
                owners.push(plot);
            }
        }
        return owners;
    };
    ChartPanelImplementation.prototype.drawValueMarkers = function () {
        var referenceValueMarker = this.getReferenceValueMarkerOwner();
        var owners = this.getValueMarkerOwners(referenceValueMarker);
        ValueMarkerOwnerOperations.fixValueMarkersOverlapping(referenceValueMarker, owners);
        for (var _i = 0, _a = this._plots; _i < _a.length; _i++) {
            var plot = _a[_i];
            plot.drawValueMarkers();
        }
        for (var _b = 0, _c = this._drawings; _b < _c.length; _b++) {
            var drawing = _c[_b];
            drawing.drawSelectionMarkers();
        }
        for (var _d = 0, _e = this._tradingDrawings; _d < _e.length; _d++) {
            var drawing = _e[_d];
            drawing.drawValueMarkers();
        }
        for (var _f = 0, _g = this._futureOrderDrawings; _f < _g.length; _f++) {
            var drawing = _g[_f];
            drawing.drawValueMarkers();
        }
        for (var _h = 0, _j = this._chartAlertDrawings; _h < _j.length; _h++) {
            var drawing = _j[_h];
            drawing.drawValueMarkers();
        }
    };
    ChartPanelImplementation.prototype.drawPlots = function () {
        for (var i = 1; i < PlotDrawingOrderType.PlotsMaxOrder; i++) {
            for (var _i = 0, _a = this._plots; _i < _a.length; _i++) {
                var plot = _a[_i];
                if (plot.drawingOrder == i) {
                    plot.draw();
                }
                if (plot.drawingOrder == PlotDrawingOrderType.SelectedPlot) {
                    plot.drawSelectionPoints();
                }
            }
        }
    };
    ChartPanelImplementation.prototype.drawGridLines = function () {
        var options = this._options;
        if (!options.showXGrid && !options.showYGrid)
            return;
        var theme = this.actualTheme, frame = this._contentFrame, context = this.context;
        context.scxApplyStrokeTheme(theme.grid);
        if (options.showXGrid && theme.grid.verticalLines.strokeEnabled) {
            var majorTicks = this.chart.dateScale.calibrator.majorTicks;
            var showGridSessionLines = this.chart.dateScale.showGridSessionLines;
            var gridSessionLineColor = this.chart.dateScale.gridSessionLinesColor;
            var sessionBreaksLinesTheme = {
                width: 1,
                strokeColor: gridSessionLineColor,
                lineStyle: 'dash'
            };
            for (var _i = 0, majorTicks_1 = majorTicks; _i < majorTicks_1.length; _i++) {
                var tick = majorTicks_1[_i];
                context.beginPath();
                context.moveTo(tick.x, 0);
                context.lineTo(tick.x, frame.height);
                if (tick.major && showGridSessionLines) {
                    context.scxApplyStrokeTheme(sessionBreaksLinesTheme);
                }
                else {
                    context.scxApplyStrokeTheme(theme.grid.verticalLines);
                }
                context.stroke();
            }
        }
        context.beginPath();
        context.scxApplyStrokeTheme(theme.grid);
        if (options.showYGrid && theme.grid.horizontalLines.strokeEnabled) {
            var majorTicks = this.valueScale.calibrator.majorTicks;
            for (var _a = 0, majorTicks_2 = majorTicks; _a < majorTicks_2.length; _a++) {
                var tick = majorTicks_2[_a];
                context.moveTo(frame.left, tick.y);
                context.lineTo(frame.left + frame.width, tick.y);
                context.scxApplyStrokeTheme(theme.grid.horizontalLines);
            }
        }
        context.stroke();
    };
    ChartPanelImplementation.prototype.update = function () {
        this.layout(this.frame);
        this.draw();
    };
    ChartPanelImplementation.prototype.setNeedsUpdate = function (needsAutoScale) {
        if (needsAutoScale)
            this.setNeedsAutoScale();
        this._updateAnimation.start();
    };
    ChartPanelImplementation.prototype._onUpdateAnimationCallback = function () {
        this.update();
    };
    ChartPanelImplementation.prototype.setNeedsUpdateHoverRecord = function (record) {
        this._hoverRecord = record;
        this._updateHoverRecordAnimation.start();
    };
    ChartPanelImplementation.prototype._onUpdateHoverRecordAnimationCallback = function () {
        this.updateHoverRecord();
    };
    ChartPanelImplementation.prototype.destroy = function () {
        this._unSubscribeEvents();
        _super.prototype.destroy.call(this);
    };
    ChartPanelImplementation.prototype._initInstrumentPanelTitle = function () {
        var _this = this;
        var symbolTitle = this._controls.title.scxAppend('div'), symbol = symbolTitle.scxAppend('span', Class.TITLE_CAPTION);
        symbolTitle.scxAppend('span', Class.TITLE_VALUE).text('O:');
        var open = symbolTitle.scxAppend('span', Class.TITLE_VALUE);
        symbolTitle.scxAppend('span', Class.TITLE_VALUE).text('H: ');
        var high = symbolTitle.scxAppend('span', Class.TITLE_VALUE);
        symbolTitle.scxAppend('span', Class.TITLE_VALUE).text('L: ');
        var low = symbolTitle.scxAppend('span', Class.TITLE_VALUE);
        symbolTitle.scxAppend('span', Class.TITLE_VALUE).text('C: ');
        var close = symbolTitle.scxAppend('span', Class.TITLE_VALUE);
        symbolTitle.scxAppend('span', [Class.TITLE_VALUE, Class.OPTIONS_ICON, Class.OPTIONS_MENU])
            .attr('title', 'Menu')
            .on('click', function (event) {
            _this._chartPanelMenu.show(event);
        });
        this._barInfoControls = {
            rootDiv: symbolTitle,
            symbol: symbol,
            open: open,
            high: high,
            low: low,
            close: close,
            series: this.chart.primaryBarDataSeries()
        };
        this._titleNeedsUpdate = true;
        this._updateInstrument();
        this.updateHoverRecord();
    };
    ChartPanelImplementation.prototype.showPriceStyleFormatDialog = function () {
        var _this = this;
        ChartAccessorService.instance.getViewLoaderService().load(ViewLoaderType.PriceStyleDialog, function (dialog) {
            dialog.show({
                chart: _this.chart,
                priceStyle: _this.chart.priceStyle
            });
        });
    };
    ChartPanelImplementation.prototype.updateHoverRecord = function (record) {
        if (!this._barInfoControls)
            return;
        var series = this._barInfoControls.series, recordCount = series.close.length;
        if (recordCount <= 0)
            return;
        if (record == null)
            record = this.chart.hoveredRecord;
        if (record == null || record < 0 || record >= recordCount || isNaN(record))
            record = recordCount - 1;
        var controls = this._barInfoControls, openPrice = series.open.valueAtIndex(record), closePrice = series.close.valueAtIndex(record), isRaising = closePrice >= openPrice, theme = this.chart.theme, color = this.chart.getThemeType() == ThemeType.Light ? (isRaising ? '#006400' : '#800000') : (isRaising ? '#13e000' : '#ff4500');
        controls.open.text(this.formatValue(openPrice)).css('color', color);
        controls.high.text(this.formatValue(series.high.valueAtIndex(record))).css('color', color);
        controls.low.text(this.formatValue(series.low.valueAtIndex(record))).css('color', color);
        controls.close.text(this.formatValue(closePrice)).css('color', color);
        if (this._titleNeedsUpdate) {
            this._titleNeedsUpdate = false;
        }
    };
    ChartPanelImplementation.prototype.hasIndicator = function (id) {
        return this.indicators.find(function (indicator) { return indicator.id == id; }) != null;
    };
    ChartPanelImplementation.prototype.getPlotIndicator = function (plot) {
        for (var _i = 0, _a = this.indicators; _i < _a.length; _i++) {
            var indicator = _a[_i];
            for (var _b = 0, _c = indicator.plots; _b < _c.length; _b++) {
                var indicatorPlot = _c[_b];
                if (plot == indicatorPlot) {
                    return indicator;
                }
            }
        }
        return null;
    };
    ChartPanelImplementation.prototype.updatePriceStylePlotDataSeriesIfNeeded = function () {
        for (var _i = 0, _a = this.plots; _i < _a.length; _i++) {
            var plot = _a[_i];
            if (plot.plotType == PlotType.PRICE_STYLE) {
                plot.updateDataSeriesIfNeeded();
            }
        }
    };
    ChartPanelImplementation.prototype._subscribeEvents = function () {
        var _this = this;
        var chart = this.chart;
        chart.on(ChartEvent.THEME_CHANGED + '.scxPanel', function () {
            _this._applyTheme();
        }, this);
        if (chart.mainPanel === this) {
            chart.on(ChartEvent.HOVER_RECORD_CHANGED + '.scxPanel', function (event) {
                _this.setNeedsUpdateHoverRecord(event.value);
            }, this);
            chart.on(ChartEvent.INSTRUMENT_CHANGED + '.scxPanel', function () {
                _this._updateWatermark();
                _this._updateInstrument();
            }, this);
        }
        chart.on(ChartEvent.VALUE_SCALE_ADDED + '.scxPanel', function () {
            _this._valueScales.push(new ChartPanelValueScaleImplementation({ chartPanel: _this }));
        }, this);
        chart.on(ChartEvent.VALUE_SCALE_REMOVED + '.scxPanel', function (event) {
            _this._valueScales.splice(event.value, 1);
        }, this);
        chart.on(ChartEvent.PRICE_STYLE_CHANGED + '.scxPanel', function (event) {
            if (_this._barInfoControls)
                _this._barInfoControls.series = _this.chart.primaryBarDataSeries();
        }, this);
    };
    ChartPanelImplementation.prototype._unSubscribeEvents = function () {
        var chart = this.chart;
        if (chart) {
            chart
                .off(ChartEvent.THEME_CHANGED + '.scxPanel', this)
                .off(ChartEvent.HOVER_RECORD_CHANGED + '.scxPanel', this)
                .off(ChartEvent.VALUE_SCALE_ADDED + '.scxPanel', this)
                .off(ChartEvent.VALUE_SCALE_REMOVED + '.scxPanel', this);
        }
    };
    ChartPanelImplementation.prototype._initGestures = function () {
        var gestures;
        if (BrowserUtils.isMobile()) {
            gestures = new GestureArray([
                new MouseWheelGesture({
                    handler: this._handleMobileMouseWheel,
                    hitTest: this.hitTest
                }),
                new PanGesture({
                    handler: this._handlePanGesture,
                    hitTest: this._panGestureHitTest,
                    swipeHandler: this._handleSwipe
                }),
                new DoubleClickGesture({
                    handler: this._handleDoubleClickGesture,
                    hitTest: this.hitTest
                }),
                new ClickGesture({
                    handler: this._handleClickGesture,
                    hitTest: this.hitTest
                })
            ], this);
        }
        else {
            gestures = new GestureArray([
                new PanGesture({
                    handler: this._handlePanGesture,
                    hitTest: this._panGestureHitTest
                }),
                new MouseWheelGesture({
                    handler: this._handleDesktopMouseWheel,
                    hitTest: this.hitTest
                }),
                new ClickGesture({
                    handler: this._handleClickGesture,
                    hitTest: this.hitTest
                }),
                new DoubleClickGesture({
                    handler: this._handleDoubleClickGesture,
                    hitTest: this.hitTest
                })
            ], this);
        }
        return gestures;
    };
    ChartPanelImplementation.prototype._panGestureHitTest = function (point) {
        if (this.moveDirection === PanelMoveDirection.NONE)
            return false;
        return this.hitTest(point);
    };
    ChartPanelImplementation.prototype._handlePanGesture = function (gesture) {
        var chart = this.chart;
        switch (gesture.state) {
            case GestureState.STARTED:
                chart.rootDiv.addClass(Class.SCROLL);
                break;
            case GestureState.FINISHED:
                chart.rootDiv.removeClass(Class.SCROLL);
                break;
            case GestureState.CONTINUED:
                var offset = gesture.moveOffset, i = void 0, valueScales = void 0;
                switch (this.moveDirection) {
                    case PanelMoveDirection.HORIZONTAL:
                        if (chart.dateScale.scrollOnPixels(offset.x)) {
                            var autoscale = this.moveKind === PanelMoveKind.AUTOSCALED;
                            chart.setNeedsUpdate(autoscale);
                        }
                        break;
                    case PanelMoveDirection.VERTICAL:
                        for (i = 0, valueScales = this.valueScales; i < valueScales.length; i++)
                            valueScales[i]._zoomOrScrollWithUpdate(offset.y, this.valueScale.scrollOnPixels);
                        break;
                    case PanelMoveDirection.ANY:
                        if (chart.dateScale.scrollOnPixels(offset.x) || this.moveKind === PanelMoveKind.AUTOSCALED) {
                            for (i = 0, valueScales = this.valueScales; i < valueScales.length; i++)
                                valueScales[i].scrollOnPixels(offset.y);
                            var autoscale = this.moveKind === PanelMoveKind.AUTOSCALED;
                            chart.setNeedsUpdate(autoscale);
                        }
                        else {
                            for (i = 0, valueScales = this.valueScales; i < valueScales.length; i++)
                                valueScales[i]._zoomOrScrollWithUpdate(offset.y, this.valueScale.scrollOnPixels);
                        }
                        break;
                    default:
                        return;
                }
                break;
        }
    };
    ChartPanelImplementation.prototype._handleSwipe = function (event) {
        if (this.chart.dateScale.scrollOnPixels(event.pixels)) {
            this.chart.setNeedsUpdate(this.moveKind === PanelMoveKind.AUTOSCALED);
            return false;
        }
        else {
            return !this.chart.dateScale.canScroll();
        }
    };
    ChartPanelImplementation.prototype._handleMobileMouseWheel = function (gesture) {
        switch (gesture.state) {
            case GestureState.CONTINUED:
                var middlePointPosition = (this.chart.dateScale.projectionFrame.width - gesture.middlePoint.x) / this.chart.dateScale.projectionFrame.width;
                var directionSignal = gesture.scale < 1 ? -1 : 1;
                var zoomFactor = gesture.scale < 1 ? gesture.scale * 40 : 40 / gesture.scale;
                var leftPixel = directionSignal * (zoomFactor * (1 - middlePointPosition));
                var rightPixel = directionSignal * (zoomFactor * middlePointPosition);
                if (this.chart.dateScale.zoomOnPixels(leftPixel, rightPixel)) {
                    var autoScale = this.moveKind === PanelMoveKind.AUTOSCALED;
                    this.chart.setNeedsUpdate(autoScale);
                }
                break;
            default:
                return;
        }
    };
    ChartPanelImplementation.prototype._handleDesktopMouseWheel = function (gesture) {
        var zoomFactor = 0.05;
        var frame = this.frame;
        this.chart.dateScale._handleZoom(-gesture.delta * zoomFactor * frame.width);
    };
    ChartPanelImplementation.prototype._handleClickGesture = function () {
        var chart = this.chart, selectedObject = chart.selectedObject;
        if (selectedObject) {
            chart.selectObject(null);
            if ((selectedObject instanceof Drawing && this.containsDrawing(selectedObject)) || (selectedObject instanceof Plot && this.containsPlot(selectedObject))) {
                this.setNeedsUpdate();
            }
            else {
                chart.setNeedsUpdate();
            }
        }
    };
    ChartPanelImplementation.prototype._handleDoubleClickGesture = function () {
        if (BrowserUtils.isMobile()) {
            this.chart.resetToPeriodDefaultZoomForMobile();
            this.chart.setAllowsAutoScaling(true);
            this.chart.setNeedsUpdate(true);
        }
        this._fire(PanelEvent.DOUBLE_CLICKED, this);
    };
    ChartPanelImplementation.prototype._createRootDiv = function () {
        var div = this.chartPanelsContainer.rootDiv.scxAppend('div', Class.CONTAINER), isMainPanel = this === this.chart.mainPanel;
        if (isMainPanel) {
            var watermark = this._controls.watermark = div.scxAppend('div', Class.WATERMARK);
            var contentDiv = watermark.scxAppend('div', Class.WATERMARK_CONTENT);
            contentDiv.scxAppend('div', Class.WATERMARK_SYMBOL);
            contentDiv.scxAppend('div', Class.WATERMARK_INFO);
            if (!this.chart.readOnly) {
                contentDiv.scxAppend('div', Class.WATERMARK_LOGO);
            }
            this._updateWatermark();
        }
        this._canvas = div.scxAppendCanvas();
        this._context = (this._canvas[0]).getContext('2d');
        this._controls.title = div.scxAppend('div', Class.TITLE);
        if (isMainPanel)
            this._initInstrumentPanelTitle();
        this._applyTheme();
        this._subscribeEvents();
        return div;
    };
    ChartPanelImplementation.prototype._layoutHtmlElements = function (frame) {
        _super.prototype.layout.call(this, frame);
        var containerFrame = this._panelsContainer.panelsContentFrame;
        this._contentFrame.copyFrom(frame);
        this._contentFrame.left = containerFrame.left;
        this._contentFrame.width = containerFrame.width;
        var isMainPanel = this === this.chart.mainPanel;
        this._canvas.scxCanvasSize(this.rootDiv.width(), this.rootDiv.height());
        if (isMainPanel) {
            this._controls.watermark.scxFrame(frame);
            this._barInfoControls.rootDiv.css('display', this.chart.showBarInfoInTitle ? 'block' : 'none');
        }
        var titleDiv = this._controls.title;
        titleDiv.scxPosition(this._contentFrame.left, 0).outerWidth(this._contentFrame.width);
        this._layoutOptions(titleDiv, isMainPanel);
    };
    ChartPanelImplementation.prototype._layoutOptions = function (title, isMainPanel) {
        var _this = this;
        if (isMainPanel)
            return;
        var controls = this._controls;
        if (!controls.options) {
            var optionsDiv = controls.options = title.scxAppend('div', Class.OPTIONS);
            if (BrowserUtils.isDesktop()) {
                controls.moveUp = optionsDiv.scxAppend('span', [Class.OPTIONS_ICON, Class.OPTIONS_MOVE_UP])
                    .attr('title', 'Move Panel Up')
                    .on('click', function () {
                    if (_this.getIndex() > 1) {
                        _this._panelsContainer.movePanel(_this, 1);
                        _this.chart.setNeedsUpdate();
                    }
                });
                controls.moveDown = optionsDiv.scxAppend('span', [Class.OPTIONS_ICON, Class.OPTIONS_MOVE_DOWN])
                    .attr('title', 'Move Panel Down')
                    .on('click', function () {
                    _this._panelsContainer.movePanel(_this, -1);
                    _this.chart.setNeedsUpdate();
                });
            }
            var updateMaximizeOptionLayout_1 = function () {
                if (this.maximized) {
                    controls.options.closest('.scxChartPanel').addClass('maximized');
                }
                else {
                    controls.options.closest('.scxChartPanel').removeClass('maximized');
                }
            }.bind(this);
            controls.maximize = optionsDiv.scxAppend('span', [Class.OPTIONS_ICON, Class.OPTIONS_MAXIMIZE])
                .attr('title', 'Maximize Panel')
                .on('click', function () {
                _this.maximized = !_this.maximized;
                _this.chart.setNeedsUpdate(true);
                setTimeout(function () {
                    _this.chart.setNeedsUpdate(true);
                });
                updateMaximizeOptionLayout_1();
            });
            updateMaximizeOptionLayout_1();
            controls.menu = optionsDiv.scxAppend('span', [Class.OPTIONS_ICON, Class.OPTIONS_MENU])
                .attr('title', 'Menu')
                .on('click', function (event) {
                _this._chartPanelMenu.show(event);
            });
            optionsDiv.css('display', this.chart.showPanelOptions ? 'block' : 'none');
        }
        if (controls.options && BrowserUtils.isDesktop()) {
            var index = this.getIndex();
            controls.moveUp.css('display', index > 1 ? 'inline-block' : 'none');
            controls.moveDown.css('display', index == this._panelsContainer.panels.length - 1 ? 'none' : 'inline-block');
        }
    };
    ChartPanelImplementation.prototype._updateInstrument = function () {
        if (this._barInfoControls) {
            var instrument = this.chart.instrument;
            if (instrument)
                this._barInfoControls.symbol.text(instrument.symbol);
        }
    };
    ChartPanelImplementation.prototype._applyTheme = function () {
        var title = this.titleDiv;
        if (!title)
            return;
        this._titleNeedsUpdate = true;
        var theme = this.actualTheme, watermark = this._controls.watermark;
        title.scxTextStyle(theme.title);
        title.css('color', HtmlUtil.isDarkColor(this.chart.theme.chart.background[0]) ? '#fff' : '#000');
        if (watermark) {
            var watermarkTheme = this.chart.theme.chart.instrumentWatermark;
            watermark.find('.' + Class.WATERMARK_SYMBOL).scxTextColor(watermarkTheme.symbol);
            watermark.find('.' + Class.WATERMARK_INFO).scxTextColor(watermarkTheme.details);
        }
    };
    ChartPanelImplementation.prototype._updateWatermark = function () {
        var watermark = this._controls.watermark;
        if (watermark) {
            var instrument = this.chart.instrument;
            if (instrument) {
                watermark.find('.' + Class.WATERMARK_SYMBOL).text(instrument.symbol);
                var info = instrument.company;
                if (instrument.exchange)
                    info += " - " + instrument.exchange;
                watermark.find('.' + Class.WATERMARK_INFO).text(info);
            }
        }
    };
    ChartPanelImplementation.prototype.drawSeparatorForCutOffData = function () {
        var context = this.context;
        var projection = this.projection;
        var frame = this.contentFrame;
        var x = projection.xByDate(moment(this.chart.getCutOffDate()).toDate());
        context.moveTo(x, 0);
        context.lineTo(x, frame.height);
        context.scxStroke({ strokeColor: "rgb(0,0,0,0.3)" });
        context.fillStyle = 'rgb(0, 128, 255,0.1)';
        context.fillRect(x, 0, frame.right - x, frame.height);
    };
    ChartPanelImplementation.prototype._initChartPanelMenu = function () {
        var _this = this;
        var chartPanelMenuConfig = {
            chartPanel: this,
            isArabic: ChartAccessorService.instance.isArabic(),
            onItemSelected: function (menuItem, checked) {
                switch (menuItem.data('id')) {
                    case ChartPanelMenu.menuItems.ALERT:
                        var value = {
                            price: 0.00,
                            panelIndex: _this.getIndex(),
                            selectedIndicatorId: _this == _this.chart.mainPanel ? null : _this.indicators[0].id
                        };
                        _this.chart.fireValueChanged(ChartEvent.ADD_ALERT, value);
                        break;
                    case ChartPanelMenu.menuItems.DELETE:
                        _this.indicators[0]._remove();
                        break;
                    case ChartPanelMenu.menuItems.CHART_ELEMENTS:
                        _this.chart.fireValueChanged(ChartEvent.SHOW_OBJECTS_TREE);
                        break;
                    case ChartPanelMenu.menuItems.SETTINGS:
                        if (_this == _this.chart.mainPanel) {
                            _this.chart.fireValueChanged(ChartEvent.SHOW_SETTINGS_DIALOG);
                        }
                        else {
                            _this.indicators[0].showSettingsDialog();
                        }
                        break;
                    case ChartPanelMenu.menuItems.SIMPLE_MOVING_AVERAGE:
                    case ChartPanelMenu.menuItems.EXPO_MOVING_AVERAGE:
                        _this.onSelectingMovingAverage(menuItem.data('id'), menuItem.data('period'));
                        break;
                }
            },
        };
        this._chartPanelMenu = $('body').scx().chartPanelMenu(chartPanelMenuConfig);
    };
    ChartPanelImplementation.prototype.onSelectingMovingAverage = function (movingAverageType, period) {
        var ma = new TAIndicator({ chart: this.chart, taIndicator: movingAverageType, panelIndex: this.getIndex() });
        ma.setParameterValue('Periods', period);
        ma.setParameterValue('Line Color', ColorUtils.getRandomDarkColorFromPallete());
        ma.setParameterValue('Line Width', 2);
        this.addMovingAverageToCurrentPanel(ma);
    };
    ChartPanelImplementation.prototype.addMovingAverageToCurrentPanel = function (ma) {
        if (this == this.chart.mainPanel) {
            this.chart.addIndicators(ma);
        }
        else {
            ma.setParameterValue('Source', this.indicators[0].id + '_' + 0);
            ma.customSourceIndicatorId = this.indicators[0].id;
            this.chart.addIndicators(ma);
        }
    };
    return ChartPanelImplementation;
}(FrameControl));
export { ChartPanelImplementation };
//# sourceMappingURL=ChartPanelImplementation.js.map