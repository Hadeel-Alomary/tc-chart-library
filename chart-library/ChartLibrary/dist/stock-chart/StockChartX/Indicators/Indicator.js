import { ChartEvent } from '../Chart';
import { GestureArray } from '../Gestures/GestureArray';
import { PlotType } from '../Plots/Plot';
import { IndicatorContextMenu } from '../../StockChartX.UI/IndicatorContextMenu';
import { JsUtil } from '../Utils/JsUtil';
import { DataSeries } from '../Data/DataSeries';
import { HistogramPlot } from '../Plots/HistogramPlot';
import { FillPlot } from '../Plots/FillPlot';
import { LineConnectedPointsPlot } from '../Plots/LineConnectedPointsPlot';
import { LabelConnectedPointsPlot } from '../Plots/LabelConnectedPointsPlot';
import { PointPlot } from '../Plots/PointPlot';
import { LinePlot } from '../Plots/LinePlot';
import { DoubleClickGesture } from '../Gestures/DoubleClickGesture';
import { ContextMenuGesture } from '../Gestures/ContextMenuGesture';
import { PanGesture } from '../Gestures/PanGesture';
import { GestureState } from '../Gestures/Gesture';
import { ChannelRequestType, ChartAccessorService } from '../../../services/index';
import { IndicatorField, IndicatorParam, IndicatorPlotTypes } from './IndicatorConst';
import { BrowserUtils } from '../../../utils';
import { IndicatorHelper } from './IndicatorHelper';
import { ThemeType } from '../ThemeType';
import { MathUtils } from '../../../utils/math.utils';
var Class = {
    TITLE_CAPTION: 'scxPanelTitleCaption',
    TITLE_ICON: 'scxPanelTitleIcon',
    TITLE_REMOVE_ICON: 'scxIndicatorRemoveIcon',
    TITLE_SETTINGS_ICON: 'scxIndicatorSettingsIcon',
    TITLE_VISIBLE_ICON: 'scxIndicatorVisibleIcon',
    TITLE_VALUE: 'scxPanelTitleValue'
};
var Indicator = (function () {
    function Indicator(config) {
        var _this = this;
        this._isOverlay = false;
        this._plotItems = [];
        this._options = {};
        this._usePrimaryDataSeries = true;
        this._contextMenuPositionPrice = null;
        if (!config || typeof config !== 'object')
            throw new TypeError("Config expected.");
        this._chart = config.chart;
        this._options = {
            panelHeightRatio: config.panelHeightRatio,
            showParamsInTitle: true,
            showValueMarkers: true,
            showValuesInTitle: true,
            visible: true,
            horizontalLines: []
        };
        this.showParamsInTitle = config.showParamsInTitle !== undefined ? config.showParamsInTitle : true;
        this.showValueMarkers = config.showValueMarkers !== undefined ? config.showValueMarkers : true;
        this.showValuesInTitle = config.showValuesInTitle !== undefined ? config.showValuesInTitle : true;
        this.visible = config.visible !== undefined ? config.visible : true;
        this._options.valueScaleIndex = config.valueScaleIndex;
        this.id = config.id !== undefined ? config.id : JsUtil.guid();
        this.customSourceIndicatorId = config.customSourceIndicatorId != undefined ? config.customSourceIndicatorId : null;
        if (this._chart) {
            if (config.panelIndex != null)
                this._panel = this._chart.chartPanelsContainer.panels[config.panelIndex];
            if (config.valueScaleIndex)
                this.valueScale = this._chart.valueScales[config.valueScaleIndex];
        }
        this._initIndicator(config);
        this._initIndicatorParameters(config);
        this._initIndicatorHorizontalLines(config);
        var contextMenuConfig = {
            indicator: this,
            onItemSelected: function (menuItem, checked) {
                switch (menuItem.data('id')) {
                    case IndicatorContextMenu.menuItems.SETTINGS:
                        _this.showSettingsDialog();
                        break;
                    case IndicatorContextMenu.menuItems.ALERT:
                        var value = { price: _this._contextMenuPositionPrice, panelIndex: _this._panel.getIndex(), selectedIndicatorId: _this.id };
                        _this.chart.fireValueChanged(ChartEvent.ADD_ALERT, value);
                        break;
                    case IndicatorContextMenu.menuItems.VISIBLE:
                        _this.visible = !_this.visible;
                        _this._updateVisibilityIconState(_this._titleControls.rootDiv);
                        _this._panel.setNeedsUpdate();
                        break;
                    case IndicatorContextMenu.menuItems.DELETE:
                        _this._remove();
                        break;
                }
            },
            onShow: function () {
                if (IndicatorHelper.isAlertable(_this.indicatorTypeId)) {
                    $('#scxIndicatorContextMenu').find('li[data-id="alert"]').show();
                }
                else {
                    $('#scxIndicatorContextMenu').find('li[data-id="alert"]').hide();
                }
            }
        };
        this._contextMenu = $('body').scx().indicatorContextMenu(contextMenuConfig);
        this._initGestures();
    }
    Object.defineProperty(Indicator.prototype, "indicatorTypeId", {
        get: function () {
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "chart", {
        get: function () {
            return this._chart;
        },
        set: function (value) {
            this._removeTitleControls();
            this._chart = value;
            if (value && this._options.valueScaleIndex)
                this.valueScale = this._chart.valueScales[this._options.valueScaleIndex];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "chartPanel", {
        get: function () {
            return this._panel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "valueScale", {
        get: function () {
            return this._valueScale;
        },
        set: function (value) {
            this._valueScale = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "isOverlay", {
        get: function () {
            return this._isOverlay;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "panelHeightRatio", {
        get: function () {
            return this._options.panelHeightRatio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "showValueMarkers", {
        get: function () {
            return this._options.showValueMarkers;
        },
        set: function (value) {
            value = !!value;
            if (this._options.showValueMarkers !== value) {
                this._options.showValueMarkers = value;
                this.updateTitleControlsVisibility();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "showValuesInTitle", {
        get: function () {
            return this._options.showValuesInTitle;
        },
        set: function (value) {
            value = !!value;
            if (this._options.showValuesInTitle !== value) {
                this._options.showValuesInTitle = value;
                this.updateTitleControlsVisibility();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "showParamsInTitle", {
        get: function () {
            return this._options.showParamsInTitle;
        },
        set: function (value) {
            value = !!value;
            if (this._options.showParamsInTitle !== value) {
                this._options.showParamsInTitle = value;
                this.updateTitleControlsVisibility();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "parameters", {
        get: function () {
            return this._options.parameters;
        },
        set: function (value) {
            this._options.parameters = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "fieldNames", {
        get: function () {
            return this._fieldNames;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "plots", {
        get: function () {
            var plots = [];
            for (var _i = 0, _a = this._plotItems; _i < _a.length; _i++) {
                var item = _a[_i];
                plots.push(item.plot);
            }
            return plots;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "visible", {
        get: function () {
            return this._options.visible;
        },
        set: function (value) {
            value = !!value;
            this._options.visible = value;
            for (var i = 0, count = this._plotItems.length; i < count; i++) {
                var plot = this._plotItems[i].plot;
                if (plot)
                    plot.visible = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "isInitialized", {
        get: function () {
            return this._plotItems.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "plotItems", {
        get: function () {
            if (!this.isInitialized)
                return [];
            return this._plotItems;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "horizontalLines", {
        get: function () {
            return this._options.horizontalLines;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "customSourceIndicatorId", {
        get: function () {
            return this._options.customSourceIndicatorId;
        },
        set: function (value) {
            this._options.customSourceIndicatorId = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "id", {
        get: function () {
            return this._options.id;
        },
        set: function (value) {
            this._options.id = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Indicator.prototype, "titleControl", {
        get: function () {
            return this._titleControls;
        },
        enumerable: false,
        configurable: true
    });
    Indicator.prototype.isValidAlertParameters = function () {
        return true;
    };
    Indicator.prototype.isAlertable = function () {
        return IndicatorHelper.isAlertable(this.indicatorTypeId);
    };
    Indicator.prototype.hasParameter = function (paramName) {
        return this._options.parameters[paramName] !== undefined;
    };
    Indicator.prototype.getParameterValue = function (paramName) {
        return this._options.parameters[paramName];
    };
    Indicator.prototype.setParameterValue = function (paramName, paramValue) {
        this._options.parameters[paramName] = paramValue;
    };
    Indicator.prototype.getName = function () {
        return IndicatorHelper.indicatorToString(this.indicatorTypeId);
    };
    Indicator.prototype.getShortName = function () {
        return BrowserUtils.isDesktop() ? IndicatorHelper.getDesktopShortName(this.indicatorTypeId) : IndicatorHelper.getMobileShortName(this.indicatorTypeId);
    };
    Indicator.prototype.getPlotName = function (fieldName) {
        return IndicatorHelper.getPlotName(fieldName);
    };
    Indicator.prototype.getPlots = function () {
        return this._plotItems.map(function (value) { return value.plot; });
    };
    Indicator.prototype.serialize = function () {
        var panel = this._panel;
        if (panel) {
            this._options.panelHeightRatio = panel.heightRatio;
        }
        if (this.valueScale)
            this._options.valueScaleIndex = this.valueScale.index;
        else
            delete this._options.valueScaleIndex;
        var state = $.extend(true, {}, this._options);
        if (panel) {
            state.panelIndex = panel.getIndex();
        }
        return state;
    };
    Indicator.prototype.calculate = function () {
        return null;
    };
    Indicator.prototype._initPanel = function () {
    };
    Indicator.prototype._updatePlotItem = function (index) {
        return false;
    };
    Indicator.prototype._preUpdateSetup = function () {
    };
    Indicator.prototype.update = function () {
        this._preUpdateSetup();
        var result = this.calculate(), indicatorName = this.getShortName(), parameters = result.parameters ? '(' + result.parameters + ')' : '', indicatorTitle = indicatorName + parameters;
        if (!this._panel) {
            if (this._isOverlay) {
                this._panel = this._chart.mainPanel;
            }
            else {
                this._panel = this._chart.addChartPanel(this._chart.chartPanels.length, this.panelHeightRatio, true);
                this._initPanel();
                this._chart.layout();
                this._panel.setNeedsAutoScale();
            }
        }
        this._initPanelTitle();
        this._titleControls.name.text(indicatorName);
        this._titleControls.parameters.text(parameters);
        var selectedPlotIndex = -1;
        for (var i = 0; i < this._plotItems.length; i++) {
            var plot = this._plotItems[i].plot;
            if (plot) {
                if (plot.selected) {
                    selectedPlotIndex = i;
                }
                this._panel.removePlot(plot);
            }
        }
        for (var i = 0; i < this._fieldNames.length; i++) {
            var plotItem = this._plotItems[i], fieldName = void 0, fieldTitle = void 0;
            if (!this._updatePlotItem(i)) {
                fieldName = this._fieldNames[i];
                fieldTitle = this.getPlotName(fieldName);
                var field = result.recordSet && result.recordSet.getField(fieldName), dataSeries = field ? DataSeries.fromField(field, result.startIndex) : new DataSeries(fieldName);
                plotItem.dataSeries = dataSeries;
                if (this._fieldNames.length === 1 || !fieldTitle)
                    dataSeries.name = indicatorTitle;
                else
                    dataSeries.name = indicatorTitle + "." + fieldTitle;
                this._chart.dataManager.addDataSeries(dataSeries, true);
                var theme = void 0;
                switch (this._getIndicatorPlotType(fieldName)) {
                    case IndicatorPlotTypes.HISTOGRAM_PLOT:
                        plotItem.plot = new HistogramPlot(this.chart, {
                            plotStyle: HistogramPlot.Style.COLUMNBYVALUE,
                            dataSeries: dataSeries,
                            theme: this._getHistogramTheme(i)
                        });
                        plotItem.color = this.chart.getThemeType() == ThemeType.Light ? 'rgb(51, 51, 51)' : 'rgb(200, 200, 200)';
                        break;
                    case IndicatorPlotTypes.FILL_PLOT:
                        plotItem.plot = new FillPlot(this.chart, {
                            dataSeries: this._getFillDataSeries(),
                            theme: this._getFillTheme()
                        });
                        plotItem.dataSeries = plotItem.plot.dataSeries[0];
                        break;
                    case IndicatorPlotTypes.LINE_CONNECTED_POINTS_PLOT:
                        theme = this._getLineConnectedPointsTheme(i);
                        plotItem.plot = new LineConnectedPointsPlot(this.chart, {
                            connectedPointsSeries: dataSeries,
                            theme: theme
                        });
                        plotItem.dataSeries = plotItem.plot.dataSeries[0];
                        plotItem.color = theme.upLine.strokeColor;
                        break;
                    case IndicatorPlotTypes.LABEL_CONNECTED_POINTS_PLOT:
                        theme = this._getLabelConnectedPointsTheme(i);
                        plotItem.plot = new LabelConnectedPointsPlot(this.chart, {
                            connectedPointsSeries: dataSeries,
                            theme: theme
                        });
                        plotItem.dataSeries = plotItem.plot.dataSeries[0];
                        plotItem.color = theme.stroke.strokeColor;
                        break;
                    case IndicatorPlotTypes.POINTS_PLOT:
                        theme = this._getPointsTheme(i);
                        plotItem.plot = new PointPlot(this.chart, {
                            dataSeries: dataSeries,
                            theme: theme
                        });
                        plotItem.color = theme.strokeColor;
                        break;
                    case IndicatorPlotTypes.VOLUME_PROFILER_SESSION_PLOT:
                    case IndicatorPlotTypes.VOLUME_PROFILER_VISIBLE_RANGE_PLOT:
                        theme = this._getVolumeProfilerTheme();
                        plotItem.plot = this.getVolumeProfilerPlot(i, dataSeries, theme);
                        break;
                    default:
                        theme = this._getLineTheme(i);
                        plotItem.plot = new LinePlot(this.chart, {
                            dataSeries: dataSeries,
                            theme: this._getLineTheme(i)
                        });
                        plotItem.color = theme.strokeColor;
                        break;
                }
            }
            plotItem.plot.plotType = PlotType.INDICATOR;
            plotItem.plot.showValueMarkers = this.showValueMarkers;
            plotItem.plot.visible = this.visible;
            plotItem.plot.valueScale = this._valueScale;
            if (selectedPlotIndex === i) {
                plotItem.plot.selected = true;
                this.chart.selectObject(plotItem.plot);
            }
            this._panel.addPlot(plotItem.plot);
            if (fieldName != IndicatorField.INDICATOR_FILL) {
                plotItem.titlePlotSpan
                    .css('color', plotItem.color)
                    .text(fieldTitle ? fieldTitle + ':' : '');
                plotItem.titleValueSpan
                    .css('color', plotItem.color)
                    .attr('title', (fieldName !== IndicatorField.INDICATOR) ? fieldName : this.getName());
            }
        }
        this.updateHoverRecord();
    };
    Indicator.prototype._getFillTheme = function () {
        return {
            fill: {
                fillColor: this.getParameterValue(IndicatorParam.FILL_COLOR)
            }
        };
    };
    Indicator.prototype._getFillDataSeries = function () {
        return null;
    };
    Indicator.prototype._getHistogramTheme = function (fieldIndex) {
        var paramName = [];
        switch (fieldIndex) {
            case 0:
                paramName[0] = IndicatorParam.LINE_COLOR;
                paramName[1] = IndicatorParam.LINE_COLOR_DOWN;
                break;
            case 1:
                paramName[0] = IndicatorParam.LINE2_COLOR;
                paramName[1] = IndicatorParam.LINE2_COLOR_DOWN;
                break;
            case 2:
                paramName[0] = IndicatorParam.LINE3_COLOR;
                paramName[1] = IndicatorParam.LINE3_COLOR_DOWN;
                break;
            case 3:
                paramName[0] = IndicatorParam.LINE4_COLOR;
                paramName[1] = IndicatorParam.LINE4_COLOR_DOWN;
                break;
            default:
                return null;
        }
        return {
            upColumn: {
                border: {
                    strokeEnabled: true,
                    width: 1,
                    strokeColor: this.getParameterValue(paramName[0])
                },
                fill: {
                    fillColor: this.getParameterValue(paramName[0])
                }
            },
            downColumn: {
                border: {
                    strokeEnabled: true,
                    width: 1,
                    strokeColor: this.getParameterValue(paramName[1])
                },
                fill: {
                    fillColor: this.getParameterValue(paramName[1])
                }
            }
        };
    };
    Indicator.prototype._getLineConnectedPointsTheme = function (fieldIndex) {
        var upColorParamName = '', downColorParamName = '', widthParamName = '', lineStyleParamName = '';
        switch (fieldIndex) {
            case 0:
                upColorParamName = IndicatorParam.LINE_COLOR;
                downColorParamName = IndicatorParam.LINE_COLOR_DOWN;
                widthParamName = IndicatorParam.LINE_WIDTH;
                lineStyleParamName = IndicatorParam.LINE_STYLE;
                break;
            case 1:
                upColorParamName = IndicatorParam.LINE2_COLOR;
                downColorParamName = IndicatorParam.LINE2_COLOR_DOWN;
                widthParamName = IndicatorParam.LINE2_WIDTH;
                lineStyleParamName = IndicatorParam.LINE2_STYLE;
                break;
            case 2:
                upColorParamName = IndicatorParam.LINE3_COLOR;
                downColorParamName = IndicatorParam.LINE3_COLOR_DOWN;
                widthParamName = IndicatorParam.LINE3_WIDTH;
                lineStyleParamName = IndicatorParam.LINE3_STYLE;
                break;
            case 3:
                upColorParamName = IndicatorParam.LINE4_COLOR;
                downColorParamName = IndicatorParam.LINE4_COLOR_DOWN;
                widthParamName = IndicatorParam.LINE4_WIDTH;
                lineStyleParamName = IndicatorParam.LINE4_STYLE;
                break;
        }
        return {
            upLine: {
                strokeEnabled: true,
                width: this.getParameterValue(widthParamName),
                strokeColor: this.getParameterValue(upColorParamName),
                lineStyle: this.getParameterValue(lineStyleParamName)
            },
            downLine: {
                strokeEnabled: true,
                width: this.getParameterValue(widthParamName),
                strokeColor: this.getParameterValue(downColorParamName),
                lineStyle: this.getParameterValue(lineStyleParamName)
            }
        };
    };
    Indicator.prototype._getLabelConnectedPointsTheme = function (fieldIndex) {
        var colorParamName = IndicatorParam.LINE_COLOR, widthParamName = IndicatorParam.LINE_WIDTH, lineStyleParamName = IndicatorParam.LINE_STYLE;
        return {
            stroke: {
                strokeEnabled: true,
                width: this.getParameterValue(widthParamName),
                strokeColor: this.getParameterValue(colorParamName),
                lineStyle: this.getParameterValue(lineStyleParamName)
            }
        };
    };
    Indicator.prototype._getPointsTheme = function (fieldIndex) {
        var colorParamName, widthParamName, lineStyleParamName;
        switch (fieldIndex) {
            case 0:
                colorParamName = IndicatorParam.LINE_COLOR;
                widthParamName = IndicatorParam.LINE_WIDTH;
                lineStyleParamName = IndicatorParam.LINE_STYLE;
                break;
            case 1:
                colorParamName = IndicatorParam.LINE2_COLOR;
                widthParamName = IndicatorParam.LINE2_WIDTH;
                lineStyleParamName = IndicatorParam.LINE2_STYLE;
                break;
            case 2:
                colorParamName = IndicatorParam.LINE3_COLOR;
                widthParamName = IndicatorParam.LINE3_WIDTH;
                lineStyleParamName = IndicatorParam.LINE3_STYLE;
                break;
            case 3:
                colorParamName = IndicatorParam.LINE4_COLOR;
                widthParamName = IndicatorParam.LINE4_WIDTH;
                lineStyleParamName = IndicatorParam.LINE4_STYLE;
                break;
            default:
                return null;
        }
        return {
            strokeEnabled: true,
            width: this.getParameterValue(widthParamName),
            strokeColor: this.getParameterValue(colorParamName),
            lineStyle: this.getParameterValue(lineStyleParamName)
        };
    };
    Indicator.prototype._getLineTheme = function (fieldIndex) {
        var colorParamName, widthParamName, lineStyleParamName;
        switch (fieldIndex) {
            case 0:
                colorParamName = IndicatorParam.LINE_COLOR;
                widthParamName = IndicatorParam.LINE_WIDTH;
                lineStyleParamName = IndicatorParam.LINE_STYLE;
                break;
            case 1:
                colorParamName = IndicatorParam.LINE2_COLOR;
                widthParamName = IndicatorParam.LINE2_WIDTH;
                lineStyleParamName = IndicatorParam.LINE2_STYLE;
                break;
            case 2:
                colorParamName = IndicatorParam.LINE3_COLOR;
                widthParamName = IndicatorParam.LINE3_WIDTH;
                lineStyleParamName = IndicatorParam.LINE3_STYLE;
                break;
            case 3:
                colorParamName = IndicatorParam.LINE4_COLOR;
                widthParamName = IndicatorParam.LINE4_WIDTH;
                lineStyleParamName = IndicatorParam.LINE4_STYLE;
                break;
            default:
                return null;
        }
        return {
            strokeEnabled: true,
            width: this.getParameterValue(widthParamName),
            strokeColor: this.getParameterValue(colorParamName),
            lineStyle: this.getParameterValue(lineStyleParamName)
        };
    };
    Indicator.prototype.draw = function () {
        for (var _i = 0, _a = this.horizontalLines; _i < _a.length; _i++) {
            var horizontalLine = _a[_i];
            horizontalLine.draw(this);
        }
    };
    Indicator.prototype.drawHorizontalLineValueMarkers = function () {
        for (var _i = 0, _a = this.horizontalLines; _i < _a.length; _i++) {
            var horizontalLine = _a[_i];
            horizontalLine.drawValueMarkers(this);
        }
    };
    Indicator.prototype.destroy = function () {
        this._removeTitleControls();
    };
    Indicator.prototype._removeTitleControls = function () {
        if (this._titleControls) {
            this._unSubscribeEvents();
            this._titleControls.rootDiv.remove();
            this._titleControls = null;
        }
    };
    Indicator.prototype.showSettingsDialog = function () {
        var showIndicatorSettingsRequest = { type: ChannelRequestType.IndicatorSettingsDialog, indicator: this };
        ChartAccessorService.instance.sendSharedChannelRequest(showIndicatorSettingsRequest);
    };
    Indicator.prototype._getIndicatorPlotType = function (fieldName) {
        return '';
    };
    Indicator.prototype.updateHoverRecord = function (record) {
        if (!this.showValuesInTitle)
            return;
        if (record == null)
            record = this._chart.hoveredRecord;
        for (var i = 0; i < this._plotItems.length; i++) {
            var item = this._plotItems[i], recordCount = item.dataSeries ? item.dataSeries.length : 0;
            var fieldName = this._fieldNames[i];
            if (fieldName == IndicatorField.INDICATOR_FILL)
                continue;
            if (recordCount <= 0)
                continue;
            if (record == null || record < 0 || record >= recordCount)
                record = recordCount - 1;
            var value = item.dataSeries.valueAtIndex(record), text = this._panel.formatValue(value);
            item.titleValueSpan.text(text);
        }
    };
    Indicator.prototype._addPlot = function (plot, titleColor) {
        this._panel.addPlot(plot);
        this._initPanelTitle();
        var items = this._plotItems;
        for (var i = 0; i < items.length; i++) {
            var plotItem = items[i];
            if (!plotItem.plot) {
                plotItem.plot = plot;
                plotItem.dataSeries = plot.dataSeries[0];
                plotItem.color = titleColor;
                this._updatePanelTitle();
                return plotItem;
            }
        }
    };
    Indicator.prototype._initPanelTitle = function () {
        var _this = this;
        if (this._titleControls)
            return;
        var controls = this._titleControls = {};
        var div = controls.rootDiv = this._panel.titleDiv.scxAppend('div');
        controls.name = div.scxAppend('div', Class.TITLE_CAPTION).text(this.getShortName());
        controls.parameters = div.scxAppend('div', Class.TITLE_CAPTION);
        if (BrowserUtils.isDesktop()) {
            div.scxAppend('span', [Class.TITLE_ICON, Class.TITLE_VISIBLE_ICON])
                .attr('title', 'Change Visibility')
                .on('click', function () {
                _this.visible = !_this.visible;
                _this._updateVisibilityIconState(div);
                _this._panel.setNeedsUpdate();
                if (_this.visible)
                    _this.update();
            });
        }
        this._updateVisibilityIconState(div);
        div.scxAppend('span', [Class.TITLE_ICON, Class.TITLE_SETTINGS_ICON])
            .attr('title', 'Indicator Settings')
            .on('click', function () {
            if (BrowserUtils.isDesktop()) {
                _this.showSettingsDialog();
            }
            else {
                _this.chart.fireValueChanged(ChartEvent.SHOW_OBJECTS_TREE);
            }
        });
        if (BrowserUtils.isDesktop()) {
            div.scxAppend('span', [Class.TITLE_ICON, Class.TITLE_REMOVE_ICON])
                .attr('title', 'Remove indicator')
                .on('click', function () {
                _this._remove();
            });
        }
        for (var i = 0, count = this._fieldNames.length; i < count; i++) {
            this._plotItems.push({
                titlePlotSpan: div.scxAppend('span', Class.TITLE_VALUE),
                titleValueSpan: div.scxAppend('span', Class.TITLE_VALUE)
            });
        }
        this.updateTitleControlsVisibility();
        this._subscribeEvents();
    };
    Indicator.prototype._updateVisibilityIconState = function (container) {
        if (BrowserUtils.isDesktop()) {
            container.find('.' + Class.TITLE_VISIBLE_ICON).removeClass('activated');
            container.find('.' + Class.TITLE_VISIBLE_ICON).addClass(this.visible ? '' : 'activated');
        }
    };
    Indicator.prototype.getParametersString = function () {
        return null;
    };
    Indicator.prototype.getParameters = function () {
        return null;
    };
    Indicator.prototype.getAlertParameters = function () {
        return [];
    };
    Indicator.prototype._updatePanelTitle = function () {
        var paramters = this.getParametersString();
        this._titleControls.name.text(this.getShortName());
        this._titleControls.parameters.text(paramters != '' ? '(' + paramters + ')' : '');
        for (var i = 0; i < this._plotItems.length; i++) {
            var plotItem = this._plotItems[i], field = this.getPlotName(this._fieldNames[i]);
            plotItem.titlePlotSpan
                .css('color', plotItem.color)
                .text(field ? field + ':' : '');
            plotItem.titleValueSpan
                .css('color', plotItem.color)
                .attr('title', field);
        }
    };
    Indicator.prototype.updateTitleControlsVisibility = function () {
        var showMarkers = this.showValueMarkers, showValuesInTitle = this.showValuesInTitle, valueDisplay = showValuesInTitle ? 'inline-block' : 'none', controls = this._titleControls;
        if (controls)
            controls.parameters.css('display', this.showParamsInTitle ? 'inline-block' : 'none');
        for (var _i = 0, _a = this._plotItems; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.plot)
                item.plot.showValueMarkers = showMarkers;
            item.titlePlotSpan.css('display', valueDisplay);
            item.titleValueSpan.css('display', valueDisplay);
        }
    };
    Indicator.prototype.addHorizontalLine = function (horizontalLine) {
        if (this.horizontalLines.indexOf(horizontalLine) !== -1) {
            throw new TypeError('hLine is already existed');
        }
        this.horizontalLines.push(horizontalLine);
    };
    Indicator.prototype.removeHorizontalLine = function (index) {
        this.horizontalLines.splice(index, 1);
    };
    Indicator.prototype.canHaveHorizontalLine = function () {
        return this._panel !== this.chart.mainPanel;
    };
    Indicator.prototype.setHorizontalLines = function (horizontalLines) {
        this.horizontalLines.splice(0, this.horizontalLines.length);
        for (var _i = 0, horizontalLines_1 = horizontalLines; _i < horizontalLines_1.length; _i++) {
            var horizontalLine = horizontalLines_1[_i];
            this.horizontalLines.push(horizontalLine);
        }
    };
    Indicator.prototype.resetDefaultSettings = function () {
    };
    Indicator.prototype.saveAsDefaultSettings = function () {
    };
    Indicator.prototype.onSettingsUpdated = function () {
        var _this = this;
        var indicatorAlerts = ChartAccessorService.instance.getAlertService().getIndicatorChartAlerts(this._chart.hostId, this.id);
        if (indicatorAlerts.length == 0) {
            return;
        }
        if (this._hasDifferentParametersThanAlert(indicatorAlerts[0])) {
            indicatorAlerts.forEach(function (alert) {
                alert.parameter.indicatorParameters = _this.getAlertParameters();
                ChartAccessorService.instance.getAlertService().updateAlert(alert);
            });
        }
    };
    Indicator.prototype._hasDifferentParametersThanAlert = function (alert) {
        var newIndicatorAlertParameters = this.getAlertParameters();
        for (var i = 0; i < newIndicatorAlertParameters.length; i++) {
            var param = newIndicatorAlertParameters[i];
            if (param != alert.parameter.indicatorParameters[i]) {
                return true;
            }
        }
        return false;
    };
    Indicator.prototype._initIndicator = function (config) {
        this._isOverlay = false;
        this._options.parameters = {};
    };
    Indicator.prototype._initIndicatorParameters = function (config) {
    };
    Indicator.prototype._initIndicatorHorizontalLines = function (config) {
    };
    Indicator.prototype._subscribeEvents = function () {
        var _this = this;
        this._chart.on(ChartEvent.HOVER_RECORD_CHANGED + '.scxIndicator', function (event) {
            _this.updateHoverRecord(event.value);
        }, this);
    };
    Indicator.prototype._unSubscribeEvents = function () {
        if (this._chart)
            this._chart.off(ChartEvent.HOVER_RECORD_CHANGED + '.scxIndicator', this);
    };
    Indicator.prototype._remove = function () {
        if (ChartAccessorService.instance.getAlertService().getIndicatorChartAlerts(this.chart.hostId, this.id).length == 0) {
            this._onRemoveIndicator();
            return;
        }
        var openRequest = {
            type: ChannelRequestType.Confirmation,
            messageLine: ChartAccessorService.instance.translate('حذف هذا المؤشر سيؤدي إلى حذف تنبيهات الرسم البياني المرتبطة به'),
            messageLine2: ChartAccessorService.instance.translate('هل أنت متأكد من الحذف؟'),
            caller: this
        };
        ChartAccessorService.instance.sendSharedChannelRequest(openRequest);
    };
    Indicator.prototype.onConfirmation = function (confirmed, param) {
        if (confirmed) {
            this._onRemoveIndicator();
        }
    };
    Indicator.prototype._onRemoveIndicator = function () {
        this._chart.fireValueChanged(ChartEvent.DELETE_INDICATOR_ALERTS, this.id);
        this._chart.removeChildIndicators(this.id);
        this._chart.removeIndicators(this);
        this._chart.setNeedsUpdate(true);
    };
    Indicator.prototype._getOverlayIndicatorDefaultSource = function () {
        return '';
    };
    Indicator.prototype.getOverlayIndicatorDefaultSource = function () {
        return this._getOverlayIndicatorDefaultSource();
    };
    Indicator.prototype._initGestures = function () {
        this._gestures = new GestureArray([
            new DoubleClickGesture({
                handler: this._handleDoubleClick,
                hitTest: this.hitTest
            }),
            new ContextMenuGesture({
                handler: this._handleContextMenuGesture,
                hitTest: this.hitTest
            }),
            new PanGesture({
                handler: this._handlePanGesture,
                hitTest: this.hitTest
            })
        ], this);
    };
    Indicator.prototype._handleDoubleClick = function () {
        this.showSettingsDialog();
    };
    Indicator.prototype._handlePanGesture = function (gesture, event) {
        var point = event.pointerPosition;
        var newPanel = this._getIndicatorNewPanel(point.y);
        ChartAccessorService.instance.getChartTooltipService().hideAllTooltips();
        switch (gesture.state) {
            case GestureState.STARTED:
                this._applyCurrentPanelCssClasses(true);
                break;
            case GestureState.CONTINUED:
                if (newPanel) {
                    this._addCssClassesForNewIndicatorPanel(newPanel);
                }
                break;
            case GestureState.FINISHED:
                this._applyCurrentPanelCssClasses(false);
                this._removeCssClassesForAllChartPanels();
                if (newPanel) {
                    if (!this._canChangeIndicatorPanel(newPanel)) {
                        break;
                    }
                    this.moveIndicatorToNewPanel(newPanel);
                    if (this.hasParameter('Source')) {
                        this._onFinishIndicatorDrag();
                    }
                    this.update();
                    this._chart.setNeedsUpdate(true);
                    this._chart.fireValueChanged(ChartEvent.DELETE_INDICATOR_ALERTS, this.id);
                }
                break;
        }
    };
    Indicator.prototype.moveIndicatorToNewPanel = function (newPanel) {
        var oldPanelIndex = this._panel.getIndex();
        var movedFromMainPanel = oldPanelIndex == 0;
        this._chart.removeChildIndicators(this.id);
        var panelContainsAnotherIndicator = this._panel.indicators.length > 1;
        this._resetCurrentPanelPlots();
        this._panel = newPanel;
        this._reInitiateNewPanelTitle();
        this._chart.moveIndicatorIndexToEnd(this);
        if (!movedFromMainPanel && !panelContainsAnotherIndicator) {
            this.chart.chartPanelsContainer.removePanel(oldPanelIndex);
        }
    };
    Indicator.prototype.setSelectedSource = function (source) {
        if (source !== null) {
            var isCustomSource = source.includes('_');
            if (!isCustomSource) {
                this.customSourceIndicatorId = null;
                this.setParameterValue(IndicatorParam.SOURCE, source);
            }
            else {
                this.customSourceIndicatorId = source.split('_')[0];
                this.setParameterValue(IndicatorParam.SOURCE, source);
            }
        }
    };
    Indicator.prototype.moveIndicatorToNewAddedPanel = function () {
        var newPanel = this._chart.addChartPanel(this._chart.chartPanels.length, 0.2, true);
        this._initPanel();
        this._chart.layout();
        this._reInitiateNewPanelTitle();
        this.moveIndicatorToNewPanel(newPanel);
    };
    Indicator.prototype.hitTest = function (point) {
        for (var _i = 0, _a = this.horizontalLines; _i < _a.length; _i++) {
            var horizontalLine = _a[_i];
            if (horizontalLine.hitTest(point, this)) {
                return true;
            }
        }
        return false;
    };
    Indicator.prototype.handleEvent = function (event) {
        return this._gestures.handleEvent(event);
    };
    Indicator.prototype._handleContextMenuGesture = function (gesture, event) {
        this._contextMenuPositionPrice = MathUtils.roundAccordingMarket(this._panel.projection.valueByY(event.pointerPosition.y), this.chart.instrument.symbol);
        this._contextMenu.show(event.evt);
        event.evt.stopPropagation();
        event.evt.preventDefault();
    };
    Indicator.prototype._getIndicatorNewPanel = function (y) {
        var chartPanel = this.chart.chartPanelsContainer.findPanelAt(this._panel.contentFrame.top + y);
        if (chartPanel && chartPanel != this._panel) {
            return chartPanel;
        }
        return null;
    };
    Indicator.prototype._reInitiateNewPanelTitle = function () {
        this._titleControls.rootDiv.remove();
        this._titleControls = null;
        this._initPanelTitle();
    };
    Indicator.prototype._resetCurrentPanelPlots = function () {
        this._panel.removePlot(this.plots);
        this._plotItems = [];
    };
    Indicator.prototype._onFinishIndicatorDrag = function () {
        if (this._panel.getIndex() == 0) {
            this.customSourceIndicatorId = null;
            this.setParameterValue(IndicatorParam.SOURCE, this._getOverlayIndicatorDefaultSource());
        }
        else {
            var sourceIndicator = this._panel.indicators[0];
            this.customSourceIndicatorId = sourceIndicator.id;
            var firstPlotIndex = 0;
            this.setParameterValue(IndicatorParam.SOURCE, this.customSourceIndicatorId + '_' + firstPlotIndex);
        }
    };
    Indicator.prototype._addCssClassesForNewIndicatorPanel = function (panel) {
        panel.rootDiv.addClass('change-indicator-panel').addClass('new-panel');
    };
    Indicator.prototype._removeCssClassesForAllChartPanels = function () {
        for (var _i = 0, _a = this.chart.chartPanels; _i < _a.length; _i++) {
            var panel = _a[_i];
            panel.rootDiv.removeClass('change-indicator-panel').removeClass('new-panel').removeClass('plot-mouse-hover');
        }
    };
    Indicator.prototype._applyCurrentPanelCssClasses = function (add) {
        if (add) {
            this._panel.rootDiv.removeClass('plot-mouse-hover').addClass('change-indicator-panel');
        }
        else {
            this._panel.rootDiv.removeClass('change-indicator-panel');
        }
    };
    Indicator.prototype._canChangeIndicatorPanel = function (newPanel) {
        if (!this._isOverlay) {
            return false;
        }
        if (this.hasParameter(IndicatorParam.SOURCE2)) {
            return false;
        }
        return true;
    };
    Indicator.prototype._updateCustomSourceIndicatorIdIfNeeded = function () {
        var _this = this;
        if (!this.customSourceIndicatorId) {
            return;
        }
        var sourceIndicator = this._chart.getIndicatorById(this.customSourceIndicatorId);
        var currentSourceParam = this.getParameterValue(IndicatorParam.SOURCE);
        if (sourceIndicator.hasSourcePlot(currentSourceParam)) {
            return;
        }
        var chartPanelIndicators = this.chartPanel.indicators.filter(function (ind) { return ind != _this && ind != sourceIndicator; });
        for (var _i = 0, chartPanelIndicators_1 = chartPanelIndicators; _i < chartPanelIndicators_1.length; _i++) {
            var indicator = chartPanelIndicators_1[_i];
            for (var i = 0; i < indicator.plots.length; i++) {
                if (indicator.id + '_' + i == currentSourceParam) {
                    this.customSourceIndicatorId = indicator.id;
                    return;
                }
            }
        }
        throw new Error('Current custom source indicator is not exist in this chart panel');
    };
    Indicator.prototype.hasSourcePlot = function (sourceId) {
        for (var i = 0; i < this.plots.length; i++) {
            if (this.id + '_' + i == sourceId) {
                return true;
            }
        }
        return false;
    };
    Indicator.prototype.getVolumeProfilerPlot = function (index, dataSeries, theme) {
        return null;
    };
    Indicator.prototype._getVolumeProfilerTheme = function () {
        return {
            line: {
                width: this.getParameterValue(IndicatorParam.LINE_WIDTH),
                strokeColor: this.getParameterValue(IndicatorParam.LINE_COLOR),
                lineStyle: this.getParameterValue(IndicatorParam.LINE_STYLE),
                strokeEnabled: this.getParameterValue(IndicatorParam.STROKE_ENABLED),
            },
            showVolumeProfile: this.getParameterValue(IndicatorParam.SHOW_VOLUME_PROFILE_BARS),
            boxWidth: this.getParameterValue(IndicatorParam.BOX_WIDTH),
            placement: this.getParameterValue(IndicatorParam.PLACEMENT),
            upVolume: { fillColor: this.getParameterValue(IndicatorParam.UP_VOLUME) },
            downVolume: { fillColor: this.getParameterValue(IndicatorParam.DOWN_VOLUME) },
            upArea: { fillColor: this.getParameterValue(IndicatorParam.UP_AREA) },
            downArea: { fillColor: this.getParameterValue(IndicatorParam.DOWN_AREA) },
            fillBox: { fillColor: this.getParameterValue(IndicatorParam.BOX_FILL) },
        };
    };
    return Indicator;
}());
export { Indicator };
//# sourceMappingURL=Indicator.js.map