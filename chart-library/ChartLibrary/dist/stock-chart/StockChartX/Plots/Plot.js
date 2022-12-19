var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ChartPanelObject } from "../ChartPanels/ChartPanelObject";
import { DataSeries, DataSeriesSuffix } from "../Data/DataSeries";
import { GestureArray } from "../Gestures/GestureArray";
import { HtmlUtil } from "../Utils/HtmlUtil";
import { GestureState } from "../Gestures/Gesture";
import { MouseHoverGesture } from "../Gestures/MouseHoverGesture";
import { ClickGesture } from "../Gestures/ClickGesture";
import { ChartTooltipType, ChartAccessorService } from '../../../services/index';
import { Tc } from '../../../utils';
export var PlotType = {
    INDICATOR: 'indicator',
    PRICE_STYLE: 'priceStyle',
    USER: 'user'
};
Object.freeze(PlotType);
export var PlotDrawingOrderType;
(function (PlotDrawingOrderType) {
    PlotDrawingOrderType[PlotDrawingOrderType["IndicatorPlot"] = 1] = "IndicatorPlot";
    PlotDrawingOrderType[PlotDrawingOrderType["PricePlot"] = 2] = "PricePlot";
    PlotDrawingOrderType[PlotDrawingOrderType["LabelConnectedPlot"] = 3] = "LabelConnectedPlot";
    PlotDrawingOrderType[PlotDrawingOrderType["SelectedPlot"] = 4] = "SelectedPlot";
    PlotDrawingOrderType[PlotDrawingOrderType["PlotsMaxOrder"] = 5] = "PlotsMaxOrder";
})(PlotDrawingOrderType || (PlotDrawingOrderType = {}));
export var PlotEvent;
(function (PlotEvent) {
    PlotEvent.DATA_SERIES_CHANGED = "plotDataSeriesChanged";
    PlotEvent.PANEL_CHANGED = "plotPanelChanged";
    PlotEvent.THEME_CHANGED = "plotThemeChanged";
    PlotEvent.STYLE_CHANGED = "plotStyleChanged";
    PlotEvent.SHOW_VALUE_MARKERS_CHANGED = "plotShowValueMarkersChanged";
    PlotEvent.VISIBLE_CHANGED = "plotVisibleChanged";
    PlotEvent.VALUE_SCALE_CHANGED = "plotValueScaleChanged";
    PlotEvent.BASE_VALUE_CHANGED = "plotBaseValueChanged";
    PlotEvent.COLUMN_WIDTH_RATIO_CHANGED = "plotColumnWidthRatioChanged";
    PlotEvent.MIN_WIDTH_CHANGED = "plotMinWidthChanged";
    PlotEvent.POINT_SIZE_CHANGED = "plotPointSizeChanged";
})(PlotEvent || (PlotEvent = {}));
var Plot = (function (_super) {
    __extends(Plot, _super);
    function Plot(chart, config) {
        var _this = _super.call(this, chart, config) || this;
        _this._valueMarkerOffset = 0;
        _this._plotThemeKey = '';
        _this._dataSeries = [];
        _this._plotType = PlotType.USER;
        _this.selected = false;
        var suppress = _this.suppressEvents(true);
        if (config) {
            if (config.dataSeries != null)
                _this.setDataSeries(config.dataSeries);
            if (config.chartPanel != null)
                _this.chartPanel = config.chartPanel;
            if (config.theme != null)
                _this.theme = config.theme;
            if (config.plotType)
                _this._plotType = config.plotType;
            if (config.options)
                _this._options = config.options;
            if (config.valueScale)
                _this.valueScale = config.valueScale;
            _this.plotStyle = config.plotStyle;
        }
        var options = _this._options;
        if (options.showValueMarkers == null)
            options.showValueMarkers = true;
        if (options.visible == null)
            options.visible = true;
        _this.suppressEvents(suppress);
        _this._initGestures();
        return _this;
    }
    Object.defineProperty(Plot.prototype, "valueMarkerOffset", {
        get: function () {
            return this._valueMarkerOffset;
        },
        set: function (value) {
            this._valueMarkerOffset = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Plot.prototype, "top", {
        get: function () {
            return this.panelValueScale.projection.yByValue(this.lastVisibleValue);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Plot.prototype, "lastVisibleValue", {
        get: function () {
            var lastIdx = Math.ceil(this.chart.dateScale.lastVisibleRecord);
            var lastValue = this._dataSeries[0].valueAtIndex(lastIdx);
            if (!lastValue) {
                lastValue = this._dataSeries[0].lastValue;
            }
            return lastValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Plot.prototype, "dataSeries", {
        get: function () {
            return this._dataSeries;
        },
        set: function (value) {
            this.setDataSeries(value);
        },
        enumerable: false,
        configurable: true
    });
    Plot.prototype.setDataSeries = function (dataSeries) {
        var newValue;
        if (dataSeries instanceof DataSeries)
            newValue = [dataSeries];
        else if (Array.isArray(dataSeries))
            newValue = dataSeries;
        else
            throw new TypeError("Single data series or an array of data series expected.");
        var oldValue = this._dataSeries;
        if (oldValue !== newValue) {
            this._dataSeries = newValue;
            this.fire(PlotEvent.DATA_SERIES_CHANGED, newValue, oldValue);
        }
    };
    Object.defineProperty(Plot.prototype, "theme", {
        get: function () {
            return this._theme;
        },
        set: function (value) {
            var oldValue = this._theme;
            this._theme = value;
            this.fire(PlotEvent.THEME_CHANGED, value, oldValue);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Plot.prototype, "actualTheme", {
        get: function () {
            if (this._theme)
                return this._theme;
            return this.chart.theme.plot[this._plotThemeKey][this.plotStyle];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Plot.prototype, "plotStyle", {
        get: function () {
            var style = this._options.plotStyle;
            if (style)
                return style;
            var defaults = this.constructor.defaults;
            return defaults && defaults.plotStyle;
        },
        set: function (value) {
            this._setOption("plotStyle", value, PlotEvent.STYLE_CHANGED);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Plot.prototype, "showValueMarkers", {
        get: function () {
            return this._options.showValueMarkers;
        },
        set: function (value) {
            this._setOption("showValueMarkers", !!value, PlotEvent.SHOW_VALUE_MARKERS_CHANGED);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Plot.prototype, "plotType", {
        get: function () {
            return this._plotType;
        },
        set: function (value) {
            this._plotType = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Plot.prototype, "drawingOrder", {
        get: function () {
            if (this.selected) {
                return PlotDrawingOrderType.SelectedPlot;
            }
            if (this._plotType == PlotType.PRICE_STYLE) {
                return PlotDrawingOrderType.PricePlot;
            }
            return PlotDrawingOrderType.IndicatorPlot;
        },
        enumerable: false,
        configurable: true
    });
    Plot.prototype._onChartPanelChanged = function (oldValue) {
        this.fire(PlotEvent.PANEL_CHANGED, this.chartPanel, oldValue);
    };
    Plot.prototype._onValueScaleChanged = function (oldValue) {
        this.fire(PlotEvent.VALUE_SCALE_CHANGED, this.valueScale, oldValue);
    };
    Plot.prototype._onVisibleChanged = function (oldValue) {
        this.fire(PlotEvent.VISIBLE_CHANGED, this.visible, oldValue);
    };
    Plot.prototype.findDataSeries = function (nameSuffix) {
        for (var _i = 0, _a = this._dataSeries; _i < _a.length; _i++) {
            var dataSeries = _a[_i];
            if (dataSeries.nameSuffix === nameSuffix)
                return dataSeries;
        }
        return null;
    };
    Plot.prototype.minMaxValues = function (startIndex, count) {
        Tc.assert(this.shouldAffectAutoScalingMaxAndMinLimits(), "minMax is called for a non autoscaled plot");
        var min = Infinity, max = -Infinity;
        for (var _i = 0, _a = this._dataSeries; _i < _a.length; _i++) {
            var dataSeries = _a[_i];
            if (dataSeries.isValueDataSeries) {
                var values = dataSeries.minMaxValues(startIndex, count);
                if (values.min < min)
                    min = values.min;
                if (values.max > max)
                    max = values.max;
            }
        }
        return {
            min: min,
            max: max
        };
    };
    Plot.prototype.updateMinMaxForSomePlotsIfNeeded = function (min, max) {
        return {
            min: min,
            max: max
        };
    };
    Plot.prototype._valueDrawParams = function () {
        var chart = this.chart, valueSeries = this._dataSeries[0], dateSeries = this.findDataSeries(DataSeriesSuffix.DATE), projection = this.projection, firstVisibleIndex, lastVisibleIndex;
        if (dateSeries) {
            var dateRange = chart.dateScale.visibleDateRange;
            firstVisibleIndex = dateSeries.floorIndex(dateRange.min);
            lastVisibleIndex = dateSeries.ceilIndex(dateRange.max);
        }
        else {
            firstVisibleIndex = chart.firstVisibleIndex;
            lastVisibleIndex = chart.lastVisibleIndex;
        }
        var startIndex = Math.max(valueSeries.leftNearestVisibleValueIndex(firstVisibleIndex) - 1, 0), endIndex = Math.min(valueSeries.rightNearestVisibleValueIndex(lastVisibleIndex) + 1, valueSeries.length - 1), startColumn = dateSeries ? 0 : projection.columnByRecord(startIndex);
        return {
            context: this.context,
            projection: projection,
            dates: (dateSeries && dateSeries.values),
            values: valueSeries.values,
            startIndex: startIndex,
            endIndex: endIndex,
            startColumn: startColumn,
            theme: this.actualTheme
        };
    };
    Plot.prototype._barDrawParams = function () {
        var chart = this.chart, dataSeries = this._dataSeries, projection = this.projection, dateSeries = null, openSeries = null, highSeries = null, lowSeries = null, closeSeries = null, firstVisibleIndex, lastVisibleIndex;
        for (var _i = 0, dataSeries_1 = dataSeries; _i < dataSeries_1.length; _i++) {
            var item = dataSeries_1[_i];
            switch (item.nameSuffix) {
                case DataSeriesSuffix.DATE:
                    dateSeries = item;
                    break;
                case DataSeriesSuffix.OPEN:
                    openSeries = item;
                    break;
                case DataSeriesSuffix.HIGH:
                    highSeries = item;
                    break;
                case DataSeriesSuffix.LOW:
                    lowSeries = item;
                    break;
                case DataSeriesSuffix.CLOSE:
                    closeSeries = item;
                    break;
            }
        }
        if (dateSeries) {
            var dateRange = chart.dateScale.visibleDateRange;
            firstVisibleIndex = dateSeries.floorIndex(dateRange.min);
            lastVisibleIndex = dateSeries.ceilIndex(dateRange.max);
        }
        else {
            firstVisibleIndex = chart.firstVisibleIndex;
            lastVisibleIndex = chart.lastVisibleIndex;
        }
        var startIndex = Math.max(dataSeries[0].leftNearestVisibleValueIndex(firstVisibleIndex) - 1, 0), endIndex = Math.min(dataSeries[0].rightNearestVisibleValueIndex(lastVisibleIndex) + 1, dataSeries[0].length - 1), startColumn = dateSeries ? 0 : projection.columnByRecord(startIndex);
        return {
            context: this.context,
            projection: projection,
            values: this._dataSeries[0].values,
            dates: (dateSeries && dateSeries.values),
            open: (openSeries && openSeries.values),
            high: (highSeries && highSeries.values),
            low: (lowSeries && lowSeries.values),
            close: (closeSeries && closeSeries.values),
            startIndex: startIndex,
            endIndex: endIndex,
            startColumn: startColumn,
            theme: this.actualTheme
        };
    };
    Plot.prototype.drawValueMarkers = function () {
        if (!this.showValueMarkers)
            return;
        var marker = this.chart.valueMarker, value = this.lastVisibleValue, markerTheme = marker.theme, theme = this.actualTheme, fillColor;
        if (theme.strokeColor && theme.strokeEnabled !== false)
            fillColor = theme.strokeColor;
        else if (theme.fill && theme.fill.fillEnabled !== false)
            fillColor = theme.fill.fillColor;
        else if (theme.line && theme.line.strokeEnabled !== false)
            fillColor = theme.line.strokeColor;
        else
            fillColor = markerTheme.fill.fillColor;
        if (fillColor.indexOf('0.') !== -1) {
            fillColor = fillColor.replace(/0.[0-9]+/, "1");
        }
        markerTheme.fill.fillColor = fillColor;
        markerTheme.text.fillColor = HtmlUtil.isDarkColor(fillColor) ? 'white' : 'black';
        marker.draw(value, this.panelValueScale, this.valueMarkerOffset, this.plotType);
    };
    Plot.prototype.updateDataSeriesIfNeeded = function () {
    };
    Plot.prototype.handleEvent = function (event) {
        return this._gestures.handleEvent(event);
    };
    Plot.prototype.hitTest = function (point) {
        return false;
    };
    Plot.prototype.drawSelectionCircle = function (x, y) {
        var context = this.chartPanel.context, radius = 3;
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.strokeStyle = 'black';
        context.stroke();
        context.fillStyle = '#d6d6d6';
        context.fill();
    };
    Plot.prototype._initGestures = function () {
        this._gestures = new GestureArray([
            new MouseHoverGesture({
                enterEventEnabled: true,
                hoverEventEnabled: true,
                leaveEventEnabled: true,
                handler: this._handleMouseHover,
                hitTest: this.hitTest
            }),
            new ClickGesture({
                handler: this._handleMouseClick,
                hitTest: this.hitTest
            })
        ], this);
    };
    Plot.prototype._handleMouseClick = function (gesture, event) {
        if (!this.selected) {
            this.selected = true;
            this.chart.selectObject(this);
            this.chartPanel.setNeedsUpdate();
        }
    };
    Plot.prototype._handleMouseHover = function (gesture, event) {
        if (this.plotType == PlotType.INDICATOR) {
            this._handleMouseHoverForIndicatorPlot(gesture, event);
        }
        else if (this.plotType == PlotType.PRICE_STYLE) {
            this._handleMouseHoverForPricePlot(gesture, event);
        }
        else {
            throw new Error('Unknown plot type');
        }
        this._applyCss(gesture);
    };
    Plot.prototype._handleMouseHoverForIndicatorPlot = function (gesture, event) {
        var mousePosition = event.pointerPosition;
        var indicator = this.chartPanel.getPlotIndicator(this);
        if (indicator) {
            switch (gesture.state) {
                case GestureState.STARTED:
                    ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Indicator, {
                        chartPanel: this.chartPanel,
                        mousePosition: mousePosition,
                        indicator: indicator
                    });
                    break;
                case GestureState.CONTINUED:
                    ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Indicator, {
                        chartPanel: this.chartPanel,
                        mousePosition: mousePosition,
                        indicator: indicator
                    });
                    break;
                case GestureState.FINISHED:
                    ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Indicator);
                    break;
            }
        }
        else {
            throw new Error('Unknown indicator for plot ' + this);
        }
    };
    Plot.prototype._handleMouseHoverForPricePlot = function (gesture, event) {
        var mousePosition = event.pointerPosition;
        switch (gesture.state) {
            case GestureState.STARTED:
            case GestureState.CONTINUED:
                ChartAccessorService.instance.getChartTooltipService().show(ChartTooltipType.Price, {
                    chartPanel: this.chartPanel,
                    mousePosition: mousePosition
                });
                break;
            case GestureState.FINISHED:
                ChartAccessorService.instance.getChartTooltipService().hide(ChartTooltipType.Price);
                break;
        }
    };
    Plot.prototype._applyCss = function (gesture) {
        if (gesture.state == GestureState.FINISHED) {
            this.chartPanel.rootDiv.removeClass('plot-mouse-hover');
        }
        else {
            this.chartPanel.rootDiv.addClass('plot-mouse-hover');
        }
    };
    Plot.prototype.shouldAffectAutoScalingMaxAndMinLimits = function () {
        return true;
    };
    return Plot;
}(ChartPanelObject));
export { Plot };
//# sourceMappingURL=Plot.js.map