var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Rect } from "../Graphics/Rect";
import { ChartFrameControl } from '../Controls/ChartFrameControl';
import { ChartPanelImplementation } from "./ChartPanelImplementation";
import { JsUtil } from "../Utils/JsUtil";
import { ChartPanelSplitter } from "./ChartPanelSplitter";
import { GestureArray } from "../Gestures/GestureArray";
import { MouseHoverGesture } from "../Gestures/MouseHoverGesture";
import { ChartEvent } from "../Chart";
import { AxisScaleType } from '../Scales/axis-scale-type';
import { ContextMenuGesture } from '../Gestures/ContextMenuGesture';
import { BrowserUtils } from '../../../utils';
var CLASS_CONTAINER = 'scxPanelsContainer';
var EVENTS_SUFFIX = '.scxPanelsContainer';
var ChartPanelsContainerImplementation = (function (_super) {
    __extends(ChartPanelsContainerImplementation, _super);
    function ChartPanelsContainerImplementation(config) {
        var _this = _super.call(this, config) || this;
        _this._panels = [];
        _this._splitters = [];
        _this._options = {};
        _this._panelsContentFrame = new Rect();
        _this.loadState(config);
        if (_this._panels.length === 0) {
            _this._panels.push(new ChartPanelImplementation({
                chartPanelsContainer: _this
            }));
        }
        return _this;
    }
    Object.defineProperty(ChartPanelsContainerImplementation.prototype, "panels", {
        get: function () {
            return this._panels;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartPanelsContainerImplementation.prototype, "newPanelHeightRatio", {
        get: function () {
            return this._options.newPanelHeightRatio;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumber(value) || value >= 1)
                throw new Error("Ratio must be a number in range (0..1)");
            this._options.newPanelHeightRatio = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartPanelsContainerImplementation.prototype, "panelPadding", {
        get: function () {
            return this._options.panelPadding;
        },
        set: function (value) {
            this._options.panelPadding = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartPanelsContainerImplementation.prototype, "panelsContentFrame", {
        get: function () {
            return this._panelsContentFrame;
        },
        enumerable: true,
        configurable: true
    });
    ChartPanelsContainerImplementation.prototype._initGestures = function () {
        var gestures = [
            new MouseHoverGesture({
                handler: this._handleMouseHoverGesture,
                hitTest: this._mouseHoverHitTest
            })
        ];
        if (BrowserUtils.isMobile()) {
            gestures.push(new ContextMenuGesture({
                handler: this._handleMobileContextMenuGesture,
                hitTest: this.hitTest
            }));
        }
        return new GestureArray(gestures, this);
    };
    ChartPanelsContainerImplementation.prototype._handleMobileContextMenuGesture = function () {
        this.chart.fireValueChanged(ChartEvent.MOBILE_LONG_PRESS);
    };
    ChartPanelsContainerImplementation.prototype._subscribeEvents = function () {
        var _this = this;
        this.chart.on(ChartEvent.THEME_CHANGED + EVENTS_SUFFIX, function () {
            for (var _i = 0, _a = _this._splitters; _i < _a.length; _i++) {
                var splitter = _a[_i];
                splitter.isThemeApplied = false;
            }
        });
    };
    ChartPanelsContainerImplementation.prototype._unsubscribeEvents = function () {
        this.chart.off(EVENTS_SUFFIX);
    };
    ChartPanelsContainerImplementation.prototype.addPanel = function (index, heightRatio, shrinkMainPanel) {
        var panels = this._panels;
        var newHeightRatio = heightRatio || this.newPanelHeightRatio;
        var panel = new ChartPanelImplementation({
            chartPanelsContainer: this,
            options: {
                heightRatio: newHeightRatio
            }
        });
        try {
            if (shrinkMainPanel && panels.length > 0) {
                var mainPanel = this.chart.mainPanel, mainPanelRatio = mainPanel.heightRatio - newHeightRatio;
                if (mainPanelRatio >= mainPanel.minHeightRatio)
                    mainPanel.heightRatio = mainPanelRatio;
                else
                    this._adjustHeightRatiosToEncloseNewRatio(newHeightRatio);
            }
            else {
                this._adjustHeightRatiosToEncloseNewRatio(newHeightRatio);
            }
        }
        catch (exception) {
            var availableHeightRatio = this._getAvailableHeightRatio();
            if (availableHeightRatio > 0 && availableHeightRatio >= panel.minHeightRatio)
                panel.heightRatio = availableHeightRatio;
            else
                throw exception;
        }
        if (index == null)
            panels.push(panel);
        else
            panels.splice(index, 0, panel);
        this._updateSplitters();
        this.chart.fireValueChanged(ChartEvent.PANEL_ADDED, panel);
        return panel;
    };
    ChartPanelsContainerImplementation.prototype.removePanel = function (panel) {
        var chartPanel;
        if (typeof panel === 'number') {
            chartPanel = this._panels[panel];
        }
        else {
            chartPanel = panel;
        }
        var chart = this.chart, mainPanel = chart.mainPanel;
        if (chartPanel === mainPanel)
            throw new Error("Main panel cannot be removed.");
        var panels = this._panels;
        for (var i = 0; i < panels.length; i++) {
            if (panels[i] === chartPanel) {
                chart.removeIndicators(chartPanel.indicators, false);
                mainPanel.heightRatio = Math.roundToDecimals(mainPanel.heightRatio + chartPanel.heightRatio, 8);
                panels.splice(i, 1);
                chartPanel.destroy();
                this._updateSplitters();
                chart.fireValueChanged(ChartEvent.PANEL_REMOVED, chartPanel);
                break;
            }
        }
    };
    ChartPanelsContainerImplementation.prototype.movePanel = function (panel, offset) {
        if (!JsUtil.isFiniteNumber(offset))
            throw new TypeError("Offset must be a number.");
        var panels = this._panels;
        for (var i = 0; i < panels.length; i++) {
            if (panels[i] === panel) {
                var newIndex = Math.min(Math.max(i - offset, 0), panels.length - 1);
                if (newIndex !== i) {
                    panels.splice(i, 1);
                    panels.splice(newIndex, 0, panel);
                }
                break;
            }
        }
        this._updateSplitters();
    };
    ChartPanelsContainerImplementation.prototype.getTotalPanelsHeight = function () {
        var size = this.rootDiv.scxContentSize(), splitterHeight = ChartPanelSplitter.getHeight();
        return size.height - splitterHeight * (this._panels.length - 1);
    };
    ChartPanelsContainerImplementation.prototype.findPanelAt = function (y) {
        y -= this.frame.top;
        for (var _i = 0, _a = this._panels; _i < _a.length; _i++) {
            var panel = _a[_i];
            var frame = panel.frame;
            if (y >= frame.top && y <= frame.bottom)
                return panel;
        }
        return null;
    };
    ChartPanelsContainerImplementation.prototype._updateSplitters = function () {
        var panels = this._panels, splitters = this._splitters, newSplittersCount = panels.length - 1, removeStartIndex = splitters.length - 1 - newSplittersCount;
        if (removeStartIndex >= 0) {
            for (var i = removeStartIndex; i < splitters.length; i++)
                splitters[i].destroy();
            splitters.splice(removeStartIndex, splitters.length - removeStartIndex);
        }
        for (var i = 0; i < newSplittersCount; i++) {
            var isNewObj = i >= splitters.length, splitter = isNewObj ? new ChartPanelSplitter() : splitters[i];
            splitter._index = i;
            splitter._topPanel = panels[i];
            splitter._bottomPanel = panels[i + 1];
            if (isNewObj)
                splitters.push(splitter);
        }
    };
    ChartPanelsContainerImplementation.prototype._getAvailableHeightRatio = function () {
        return 1 - this._panels.reduce(function (sum, panel) {
            return sum + panel.heightRatio;
        }, 0);
    };
    ChartPanelsContainerImplementation.prototype._adjustHeightRatiosToEncloseNewRatio = function (newRatio) {
        while (true) {
            var excess = newRatio - this._getAvailableHeightRatio();
            if (excess <= 1E-5)
                break;
            var isUpdated = false;
            for (var _i = 0, _a = this._panels; _i < _a.length; _i++) {
                var panel = _a[_i];
                var decreasedRatio = panel.heightRatio - excess * panel.heightRatio;
                if (decreasedRatio >= panel.minHeightRatio) {
                    panel.heightRatio = decreasedRatio;
                    isUpdated = true;
                }
            }
            if (!isUpdated) {
                throw new Error("Insufficient height. Other panels use too much height. " +
                    "You have to update minimum height weight of existing panels to free some space.");
            }
        }
    };
    ChartPanelsContainerImplementation.prototype.setPanelHeightRatio = function (panel, ratio) {
        var mainPanel = this.chart.mainPanel;
        if (panel === mainPanel) {
            panel.heightRatio = ratio;
        }
        else {
            var oldRatio = panel.heightRatio;
            panel.heightRatio = ratio;
            mainPanel.heightRatio -= panel.heightRatio - oldRatio;
        }
    };
    ChartPanelsContainerImplementation.prototype.handleEvent = function (event) {
        for (var _i = 0, _a = this._splitters; _i < _a.length; _i++) {
            var splitter = _a[_i];
            if (splitter.handleEvent(event))
                return true;
        }
        _super.prototype.handleEvent.call(this, event);
        event.pointerPosition.x -= this.frame.left;
        event.pointerPosition.y -= this.frame.top;
        for (var _b = 0, _c = this._panels; _b < _c.length; _b++) {
            var panel = _c[_b];
            if (panel.handleEvent(event))
                return true;
        }
        return false;
    };
    ChartPanelsContainerImplementation.prototype._handleMouseHoverGesture = function (gesture, event) {
        this.chart.crossHair.handleMouseHoverGesture(gesture, event);
    };
    ChartPanelsContainerImplementation.prototype._mouseHoverHitTest = function (point) {
        return this._panelsContentFrame.containsPoint(point);
    };
    ChartPanelsContainerImplementation.prototype.setNeedsAutoScale = function () {
        for (var _i = 0, _a = this._panels; _i < _a.length; _i++) {
            var panel = _a[_i];
            panel.setNeedsAutoScale();
        }
    };
    ChartPanelsContainerImplementation.prototype.setAxisScale = function (axisScaleType) {
        for (var _i = 0, _a = this._panels; _i < _a.length; _i++) {
            var panel = _a[_i];
            if (panel == this.chart.mainPanel) {
                panel.setAxisScale(axisScaleType);
            }
        }
    };
    ChartPanelsContainerImplementation.prototype.getAxisScale = function () {
        for (var _i = 0, _a = this._panels; _i < _a.length; _i++) {
            var panel = _a[_i];
            if (panel == this.chart.mainPanel) {
                return panel.getAxisScale();
            }
        }
        return AxisScaleType.Linear;
    };
    ChartPanelsContainerImplementation.prototype.saveState = function () {
        var state = $.extend(true, {}, this._options);
        state.panels = [];
        for (var _i = 0, _a = this._panels; _i < _a.length; _i++) {
            var panel = _a[_i];
            state.panels.push(panel.saveState());
        }
        return state;
    };
    ChartPanelsContainerImplementation.prototype.loadState = function (stateOrConfig) {
        var state = stateOrConfig || {};
        this._options = {};
        this.newPanelHeightRatio = state.newPanelHeightRatio || 0.2;
        this.panelPadding = state.panelPadding || {
            left: 5,
            top: 10,
            right: 5,
            bottom: 10
        };
        var panels = this._panels;
        for (var _i = 0, panels_1 = panels; _i < panels_1.length; _i++) {
            var panel = panels_1[_i];
            panel.destroy();
        }
        panels.length = 0;
        if (state.panels) {
            for (var _a = 0, _b = state.panels; _a < _b.length; _a++) {
                var panelState = _b[_a];
                var config = $.extend({ chartPanelsContainer: this }, panelState);
                var panel = new ChartPanelImplementation(config);
                panels.push(panel);
            }
        }
        this._updateSplitters();
    };
    ChartPanelsContainerImplementation.prototype._createRootDiv = function () {
        return this.chart.rootDiv.scxAppend('div', CLASS_CONTAINER);
    };
    ChartPanelsContainerImplementation.prototype.layoutScalePanel = function (chartPanelsFrame) {
        _super.prototype.layout.call(this, chartPanelsFrame);
        var size = this.rootDiv.scxContentSize();
        var contentFrame = this._panelsContentFrame;
        contentFrame.left = chartPanelsFrame.left;
        contentFrame.top = chartPanelsFrame.top;
        contentFrame.width = size.width;
        contentFrame.height = size.height;
        var scales = this.chart.valueScales;
        for (var i = scales.length - 1; i >= 0; i--) {
            contentFrame = scales[i].layout(contentFrame);
        }
        this._panelsContentFrame = contentFrame;
        return new Rect({
            left: contentFrame.left,
            top: contentFrame.top,
            width: contentFrame.width,
            height: chartPanelsFrame.height
        });
    };
    ChartPanelsContainerImplementation.prototype.layout = function (frame) {
        if (this.hasMaximizedPanel()) {
            this.maximizedLayout();
            this.chart.fireValueChanged(ChartEvent.PANEL_TOGGLE_MAXIMIZE, true);
        }
        else {
            this.normalLayout();
            this.chart.fireValueChanged(ChartEvent.PANEL_TOGGLE_MAXIMIZE, false);
        }
    };
    ChartPanelsContainerImplementation.prototype.maximizedLayout = function () {
        var size = this.rootDiv.scxContentSize();
        var panelsCount = this._panels.length;
        var contentHeight = this.getTotalPanelsHeight();
        for (var i = 0; i < panelsCount; i++) {
            var panel = this._panels[i];
            if (panel.maximized) {
                panel.layout(new Rect({
                    top: 0,
                    left: 0,
                    width: size.width,
                    height: contentHeight
                }));
            }
            else {
                panel.layout(new Rect({
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0
                }));
            }
            if (i < panelsCount - 1) {
                this._splitters[i].layout(new Rect({
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0
                }));
            }
        }
    };
    ChartPanelsContainerImplementation.prototype.normalLayout = function () {
        var size = this.rootDiv.scxContentSize();
        var splitterHeight = ChartPanelSplitter.getHeight();
        var panelsCount = this._panels.length;
        var contentHeight = this.getTotalPanelsHeight();
        var top = 0;
        for (var i = 0; i < panelsCount; i++) {
            var panel = this._panels[i];
            var height = Math.round(contentHeight * panel.heightRatio);
            var panelFrame = new Rect({
                left: 0,
                top: top,
                width: size.width,
                height: height
            });
            top += height;
            panel.layout(panelFrame);
            if (i < panelsCount - 1) {
                var splitterFrame = new Rect({
                    left: 0,
                    top: top,
                    width: size.width,
                    height: splitterHeight
                });
                this._splitters[i].layout(splitterFrame);
                top += splitterHeight;
            }
        }
    };
    ChartPanelsContainerImplementation.prototype.hasMaximizedPanel = function () {
        for (var i = 0; i < this._panels.length; i++) {
            if (this._panels[i].maximized) {
                return true;
            }
        }
        return false;
    };
    ChartPanelsContainerImplementation.prototype.layoutSplitterPanels = function (splitter) {
        var contentHeight = this.getTotalPanelsHeight(), updatePanelFunc = function (panel) {
            panel.frame.height = Math.round(contentHeight * panel.heightRatio);
            panel.setNeedsUpdate();
        };
        var topPanel = splitter.topPanel;
        updatePanelFunc(topPanel);
        var splitterFrame = splitter.frame;
        splitterFrame.top = topPanel.frame.bottom;
        splitter.layout(splitterFrame);
        var bottomPanel = splitter.bottomPanel;
        bottomPanel.frame.top = splitterFrame.top + ChartPanelSplitter.getHeight();
        updatePanelFunc(bottomPanel);
    };
    ChartPanelsContainerImplementation.prototype.draw = function () {
        for (var _i = 0, _a = this._panels; _i < _a.length; _i++) {
            var panel = _a[_i];
            panel.draw();
        }
    };
    ChartPanelsContainerImplementation.prototype.destroy = function () {
        for (var _i = 0, _a = this._panels; _i < _a.length; _i++) {
            var panel = _a[_i];
            panel.destroy();
        }
        for (var _b = 0, _c = this._splitters; _b < _c.length; _b++) {
            var splitter = _c[_b];
            splitter.destroy();
        }
        _super.prototype.destroy.call(this);
    };
    return ChartPanelsContainerImplementation;
}(ChartFrameControl));
export { ChartPanelsContainerImplementation };
//# sourceMappingURL=ChartPanelsContainerImplementation.js.map