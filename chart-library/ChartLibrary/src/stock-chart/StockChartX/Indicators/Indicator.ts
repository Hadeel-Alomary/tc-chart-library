/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {Chart, ChartEvent} from '../Chart';
import {HorizontalLine} from './HorizontalLine';
import {ChartPanel} from '../ChartPanels/ChartPanel';
import {ValueScale} from '../Scales/ValueScale';
import {GestureArray} from '../Gestures/GestureArray';
import {Plot, PlotType} from '../Plots/Plot';
import {IndicatorContextMenu} from '../../StockChartX.UI/IndicatorContextMenu';
import {JsUtil} from '../Utils/JsUtil';
import {DataSeries} from '../Data/DataSeries';
import {HistogramPlot} from '../Plots/HistogramPlot';
import {FillPlot} from '../Plots/FillPlot';
import {LineConnectedPointsPlot} from '../Plots/LineConnectedPointsPlot';
import {LabelConnectedPointsPlot} from '../Plots/LabelConnectedPointsPlot';
import {PointPlot} from '../Plots/PointPlot';
import {LinePlot} from '../Plots/LinePlot';
import {IValueChangedEvent} from '../Utils/EventableObject';
import {DoubleClickGesture} from '../Gestures/DoubleClickGesture';
import {ContextMenuGesture} from '../Gestures/ContextMenuGesture';
import {PanGesture} from '../Gestures/PanGesture';
import {Gesture, GestureState, WindowEvent} from '../Gestures/Gesture';
import {IPoint} from '../Graphics/ChartPoint';
import {ChannelRequestType, ChartAccessorService, ChartAlert, ViewLoaderType} from '../../../services/index';
import {IndicatorField, IndicatorParam, IndicatorPlotTypes} from './IndicatorConst';
import {BrowserUtils} from '../../../utils';
import {IndicatorHelper} from './IndicatorHelper';
import {ConfirmationCaller, ConfirmationRequest} from '../../../components/modals/popup';
import {TAIndicatorParameters} from './TAIndicatorParameters';
import {LineParameter} from './IndicatorsDefaultSettings';
import {Recordset} from '../..';
import {ShowIndicatorSettingsDialogRequest} from '../../../services/shared-channel/channel-request';
import {
    ColumnPlotTheme,
    LabelConnectedPlotTheme,
    LineConnectedPlotTheme,
    LinePlotTheme,
    PlotTheme,
    PointPlotTheme,
    VolumeProfilerPlotTheme
} from '../Theme';
import {Config} from '../../../config/config';
import {ThemeType} from '../ThemeType';
import {MathUtils} from '../../../utils/math.utils';


export type ParameterValueType = number | string | LineParameter[] | boolean;

const Class = {
    TITLE_CAPTION: 'scxPanelTitleCaption',
    TITLE_ICON: 'scxPanelTitleIcon',
    TITLE_REMOVE_ICON: 'scxIndicatorRemoveIcon',
    TITLE_SETTINGS_ICON: 'scxIndicatorSettingsIcon',
    TITLE_VISIBLE_ICON: 'scxIndicatorVisibleIcon',
    TITLE_VALUE: 'scxPanelTitleValue'
};

export interface IIndicatorConfig {
    id?: string;
    chart: Chart;
    panelHeightRatio?: number;
    showParamsInTitle?: boolean;
    showValueMarkers?: boolean;
    showValuesInTitle?: boolean;
    visible?: boolean;
    valueScaleIndex?: number;
    panelIndex?: number;
    isCustomIndicator?: boolean;
    parameters?: Object;
    horizontalLines?: HorizontalLine[];
    customSourceIndicatorId?: string;
}

export interface IIndicatorOptions {
    id?: string;
    valueScaleIndex?: number;
    horizontalLines: HorizontalLine[];
    panelHeightRatio: number;
    showValueMarkers: boolean;
    showValuesInTitle: boolean;
    showParamsInTitle: boolean;
    parameters: {[key: string]: ParameterValueType};
    visible: boolean;
    customSourceIndicatorId: string;
    panelIndex?: number
}

interface IIndicatorTitleControls {
    name: JQuery;
    parameters: JQuery;
    rootDiv: JQuery;
}

/**
 * Represent abstract chart indicator.
 * @param {Object} config The configuration object.
 * @param {Chart} [config.chart] The parent chart.
 * @param {Object} [config.parameters] The TA indicator parameters.
 * @param {Number} [config.panelHeightRatio] The height ratio of the chart panel.
 * @param {Boolean} [config.showValueMarkers] The flag that indicates whether value markers are visible.
 * @param {Boolean} [config.showValuesInTitle] The flag that indicates whether values are visible in the title.
 * @constructor Indicator
 */
export abstract class Indicator implements ConfirmationCaller{
    protected _chart: Chart;
    protected _isOverlay = false;
    protected _fieldNames: string[];
    protected _panel: ChartPanel;
    private _titleControls: IIndicatorTitleControls;
    protected _plotItems: PlotItem[] = [];
    protected _options: IIndicatorOptions = <IIndicatorOptions> {};
    private _valueScale: ValueScale;
    protected _gestures: GestureArray;
    _usePrimaryDataSeries = true; // TODO: Temporary solution for renko. Needs to be updated.

    private _contextMenuPositionPrice: number = null;

    get indicatorTypeId(): number {
        return null;
    }

    /**
     * Shows indicator properties dialog.
     * @method showPropertiesDialog
     * @memberOf Indicator#
     */

    // private _propertiesDialog;


    /**
     * The parent chart
     * @name chart
     * @type {Chart}
     * @memberOf Indicator#
     */
    get chart(): Chart {
        return this._chart;
    }

    set chart(value: Chart) {
        this._removeTitleControls();
        this._chart = value;
        if (value && this._options.valueScaleIndex)
            this.valueScale = this._chart.valueScales[this._options.valueScaleIndex];
    }

    /**
     * The parent chart panel.
     * @name chartPanel
     * @type {ChartPanel}
     * @readonly
     * @memberOf Indicator#
     */
    get chartPanel(): ChartPanel {
        return this._panel;
    }

    get valueScale(): ValueScale {
        return this._valueScale;
    }

    set valueScale(value: ValueScale) {
        this._valueScale = value;
    }

    /**
     * True if it's an overlay indicator, false otherwise.
     * @name isOverlay
     * @type {boolean}
     * @memberOf Indicator#
     */
    get isOverlay(): boolean {
        return this._isOverlay;
    }

    /**
     * Gets panel height ratio. It is not used in case of overlay indicator.
     * @name panelHeightRatio
     * @type {number}
     * @readonly
     * @memberOf Indicator#
     */
    get panelHeightRatio(): number {
        return this._options.panelHeightRatio;
    }

    /**
     * Gets/Sets flag that indicates whether value markers are visible on the value scale.
     * @name showValueMarkers
     * @type {boolean}
     * @memberof Indicator#
     */
    get showValueMarkers(): boolean {
        return this._options.showValueMarkers;
    }

    set showValueMarkers(value: boolean) {
        value = !!value;

        if (this._options.showValueMarkers !== value) {
            this._options.showValueMarkers = value;
            this.updateTitleControlsVisibility();
        }
    }

    /**
     * Gets/Sets flag that indicates whether values are visible in the title.
     * @name showValuesInTitle
     * @type {boolean}
     * @memberOf Indicator#
     */
    get showValuesInTitle(): boolean {
        return this._options.showValuesInTitle;
    }

    set showValuesInTitle(value: boolean) {
        value = !!value;

        if (this._options.showValuesInTitle !== value) {
            this._options.showValuesInTitle = value;
            this.updateTitleControlsVisibility();
        }
    }

    get showParamsInTitle(): boolean {
        return this._options.showParamsInTitle;
    }

    set showParamsInTitle(value: boolean) {
        value = !!value;
        if (this._options.showParamsInTitle !== value) {
            this._options.showParamsInTitle = value;
            this.updateTitleControlsVisibility();
        }
    }

    /**
     * The indicator parameters.
     * @name parameters
     * @type {object}
     * @memberOf Indicator#
     */
    get parameters() {
        return this._options.parameters;
    }

    set parameters(value:{[key: string]: ParameterValueType}) {
         this._options.parameters = value;
    }

    get fieldNames(): string[] {
        return this._fieldNames;
    }

    get plots(): Plot[] {
        let plots: Plot[] = [];
        for (let item of this._plotItems) {
            plots.push(item.plot);
        }

        return plots;
    }

    get visible(): boolean {
        return this._options.visible;
    }

    set visible(value: boolean) {
        value = !!value;
        this._options.visible = value;
        for (let i = 0, count = this._plotItems.length; i < count; i++) {
            let plot = this._plotItems[i].plot;
            if (plot)
                plot.visible = value;
        }
    }

    get isInitialized(): boolean {
        return this._plotItems.length > 0;
    }

    get plotItems() {
        if (!this.isInitialized)
            return [];
        return this._plotItems;
    }

    get horizontalLines(): HorizontalLine[] {
        return this._options.horizontalLines;
    }

    private _contextMenu: IndicatorContextMenu;

    public get customSourceIndicatorId(): string {
        return this._options.customSourceIndicatorId;
    }

    public set customSourceIndicatorId(value: string) {
        this._options.customSourceIndicatorId = value;
    }

    public get id(): string {
        return this._options.id;
    }

    public set id(value: string) {
        this._options.id = value;
    }

    public get titleControl(): IIndicatorTitleControls {
        return this._titleControls;
    }

    public isValidAlertParameters(): boolean {
        return true;
    }

    constructor(config: IIndicatorConfig) {
        if (!config || typeof config !== 'object')
            throw new TypeError("Config expected.");

        this._chart = config.chart;

        this._options = <IIndicatorOptions> {
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

        let contextMenuConfig = {
            indicator: this,
            onItemSelected: (menuItem: JQuery, checked: boolean) => {
                switch (menuItem.data('id')) {
                    case IndicatorContextMenu.menuItems.SETTINGS:
                        this.showSettingsDialog();
                        break;
                    case IndicatorContextMenu.menuItems.ALERT:
                        let value:AddChartAlertEventValue = {price: this._contextMenuPositionPrice, panelIndex: this._panel.getIndex(), selectedIndicatorId: this.id};
                        this.chart.fireValueChanged(ChartEvent.ADD_ALERT, value);
                        break;
                    case IndicatorContextMenu.menuItems.VISIBLE:
                        this.visible = !this.visible;
                        this._updateVisibilityIconState(this._titleControls.rootDiv);
                        this._panel.setNeedsUpdate();
                        break;
                    case IndicatorContextMenu.menuItems.DELETE:
                        this._remove();
                        break;
                }
            },
            onShow: () => {
                if(IndicatorHelper.isAlertable(this.indicatorTypeId)) {
                    $('#scxIndicatorContextMenu').find('li[data-id="alert"]').show();
                } else {
                    $('#scxIndicatorContextMenu').find('li[data-id="alert"]').hide();
                }
            }
        };

        this._contextMenu = $('body').scx().indicatorContextMenu(contextMenuConfig);

        this._initGestures();
    }

    public isAlertable():boolean {
        return IndicatorHelper.isAlertable(this.indicatorTypeId);
    }

    /**
     * Returns true if value is set for a given parameter name, false otherwise.
     * @method hasParameter
     * @param {String} paramName The parameter name.
     * @returns {boolean}
     * @memberOf Indicator#
     */
    hasParameter(paramName: string): boolean {
        return this._options.parameters[paramName] !== undefined;
    }

    /**
     * Returns parameter value by name.
     * @method getParameterValue
     * @param {string} paramName The parameter name.
     * @returns {*}
     * @memberOf Indicator#
     */
    getParameterValue(paramName: string): ParameterValueType {
        return this._options.parameters[paramName];
    }

    /**
     * Sets parameter value.
     * @method setParameterValue
     * @param {string} paramName
     * @param {*} paramValue The
     * @memberOf Indicator#
     */
    setParameterValue(paramName: string, paramValue: ParameterValueType) {
        this._options.parameters[paramName] = paramValue;
    }

    /**
     * Returns indicator name (e.g. 'Simple Moving Average').
     * @method getName
     * @returns {string}
     * @memberOf Indicator#
     */
    getName(): string {
        return IndicatorHelper.indicatorToString(this.indicatorTypeId);
    }

    /**
     * Returns short indicator name (e.g. 'SMA').
     * @method getShortName
     * @returns {string}
     * @memberOf Indicator#
     */
    getShortName(): string {
        return BrowserUtils.isDesktop() ? IndicatorHelper.getDesktopShortName(this.indicatorTypeId) : IndicatorHelper.getMobileShortName(this.indicatorTypeId);
    }

    /**
     * Returns plot's name. E.g. 'Top', 'Bottom', 'Median', ..
     * @method getPlotName
     * @param {string} fieldName the TA field name.
     * @returns {string}
     * @memberOf Indicator#
     */
    getPlotName(fieldName: string): string {
        return IndicatorHelper.getPlotName(fieldName);
    }

    getPlots(): Plot[] {
        return this._plotItems.map((value: PlotItem) => value.plot);
    }

    /**
     * Serializes indicator state.
     * @method serialize
     * @returns {object}
     * @memberOf Indicator#
     */
    serialize(): IIndicatorOptions {
        let panel = this._panel;
        if (panel) {
            this._options.panelHeightRatio = panel.heightRatio;
        }
        if (this.valueScale)
            this._options.valueScaleIndex = this.valueScale.index;
        else
            delete this._options.valueScaleIndex;

        let state: IIndicatorOptions = $.extend(true, {}, this._options);
        if (panel) {
            state.panelIndex = panel.getIndex();
        }

        return state;
    }

    calculate(): CalculationResult {
        return null;
    }

    protected _initPanel() {

    }

    protected _updatePlotItem(index: number): boolean {
        return false;
    }

    protected _preUpdateSetup() {
    }

    /**
     * Updates indicator.
     * @method update
     * @memberOf Indicator#
     */
    update() {
        this._preUpdateSetup();

        let result: CalculationResult = this.calculate(),
            indicatorName = this.getShortName(),
            parameters = result.parameters ? '(' + result.parameters + ')' : '',
            indicatorTitle = indicatorName + parameters;

        if (!this._panel) {
            if (this._isOverlay) {
                this._panel = this._chart.mainPanel;
            } else {
                this._panel = this._chart.addChartPanel(this._chart.chartPanels.length, this.panelHeightRatio, true);
                this._initPanel();
                this._chart.layout();
                this._panel.setNeedsAutoScale();
            }
        }

        this._initPanelTitle();
        this._titleControls.name.text(indicatorName);
        this._titleControls.parameters.text(parameters);

        let selectedPlotIndex = -1;
        // Remove old plots.
        for (let i = 0; i < this._plotItems.length; i++) {
            let plot = this._plotItems[i].plot;
            if (plot) {
                if (plot.selected) {
                    selectedPlotIndex = i;
                }
                this._panel.removePlot(plot);
            }
        }

        for (let i = 0; i < this._fieldNames.length; i++) {
            let plotItem = this._plotItems[i],
                fieldName: string,
                fieldTitle: string;

            if (!this._updatePlotItem(i)) {
                fieldName = this._fieldNames[i];
                fieldTitle = this.getPlotName(fieldName);

                let field = result.recordSet && result.recordSet.getField(fieldName),
                    dataSeries = field ? DataSeries.fromField(field, result.startIndex) : new DataSeries(fieldName);

                plotItem.dataSeries = dataSeries;

                if (this._fieldNames.length === 1 || !fieldTitle)
                    dataSeries.name = indicatorTitle;
                else
                    dataSeries.name = indicatorTitle + "." + fieldTitle;

                this._chart.dataManager.addDataSeries(dataSeries, true);

                let theme: PlotTheme;
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
                        plotItem.color = (theme as LineConnectedPlotTheme).upLine.strokeColor;
                        break;
                    case IndicatorPlotTypes.LABEL_CONNECTED_POINTS_PLOT:
                        theme = this._getLabelConnectedPointsTheme(i);
                        plotItem.plot = new LabelConnectedPointsPlot(this.chart, {
                            connectedPointsSeries: dataSeries,
                            theme: theme
                        });
                        plotItem.dataSeries = plotItem.plot.dataSeries[0];
                        plotItem.color = (theme as LabelConnectedPlotTheme).stroke.strokeColor;
                        break;
                    case IndicatorPlotTypes.POINTS_PLOT:
                        theme = this._getPointsTheme(i);
                        plotItem.plot = new PointPlot(this.chart, {
                            dataSeries: dataSeries,
                            theme: theme
                        });
                        plotItem.color = (theme as PointPlotTheme).strokeColor;
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
                        plotItem.color = (theme as LinePlotTheme).strokeColor;
                        break;
                }
            }
            plotItem.plot.plotType = PlotType.INDICATOR; // MA compile typescript
            plotItem.plot.showValueMarkers = this.showValueMarkers;
            plotItem.plot.visible = this.visible;
            plotItem.plot.valueScale = this._valueScale;

            // NK restore selected property for plot
            if (selectedPlotIndex === i) {
                plotItem.plot.selected = true;
                this.chart.selectObject(plotItem.plot);
            }
            this._panel.addPlot(plotItem.plot);

            if (fieldName != IndicatorField.INDICATOR_FILL) { //NK the fill plot does not need any title text or value (until now)
                plotItem.titlePlotSpan
                    .css('color', plotItem.color)
                    .text(fieldTitle ? fieldTitle + ':' : '');
                plotItem.titleValueSpan
                    .css('color', plotItem.color)
                    .attr('title', (fieldName !== IndicatorField.INDICATOR) ? fieldName : this.getName());
            }
        }

        this.updateHoverRecord();
    }

    _getFillTheme() {
        return {
            fill: {
                fillColor: this.getParameterValue(IndicatorParam.FILL_COLOR)
            }
        }
    }

    _getFillDataSeries(): DataSeries[] {
        return null;
    }

    _getHistogramTheme(fieldIndex: number): ColumnPlotTheme {
        let paramName: string[] = [];

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
                paramName[1] = IndicatorParam.LINE4_COLOR_DOWN
                break;
            default:
                return null;
        }
        return {
            upColumn: {
                border: {
                    strokeEnabled: true,
                    width: 1,
                    strokeColor: this.getParameterValue(paramName[0]) as string
                },
                fill: {
                    fillColor: this.getParameterValue(paramName[0]) as string
                }
            },
            downColumn: {
                border: {
                    strokeEnabled: true,
                    width: 1,
                    strokeColor: this.getParameterValue(paramName[1]) as string
                },
                fill: {
                    fillColor: this.getParameterValue(paramName[1]) as string
                }
            }
        };
    }

    _getLineConnectedPointsTheme(fieldIndex: number): LineConnectedPlotTheme {
        let upColorParamName: string = '',
            downColorParamName: string = '',
            widthParamName: string = '',
            lineStyleParamName: string = '';
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
                width: this.getParameterValue(widthParamName) as number,
                strokeColor: this.getParameterValue(upColorParamName) as string,
                lineStyle: this.getParameterValue(lineStyleParamName) as string
            },
            downLine: {
                strokeEnabled: true,
                width: this.getParameterValue(widthParamName) as number,
                strokeColor: this.getParameterValue(downColorParamName) as string,
                lineStyle: this.getParameterValue(lineStyleParamName) as string
            }
        };
    }

    _getLabelConnectedPointsTheme(fieldIndex: number): LabelConnectedPlotTheme {
        let colorParamName = IndicatorParam.LINE_COLOR,
            widthParamName = IndicatorParam.LINE_WIDTH,
            lineStyleParamName = IndicatorParam.LINE_STYLE;

        return {
            stroke: {
                strokeEnabled: true,
                width: this.getParameterValue(widthParamName) as number,
                strokeColor: this.getParameterValue(colorParamName) as string,
                lineStyle: this.getParameterValue(lineStyleParamName) as string
            }
        };
    }

    _getPointsTheme(fieldIndex: number): PointPlotTheme {
        let colorParamName: string,
            widthParamName: string,
            lineStyleParamName: string;

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
            width: this.getParameterValue(widthParamName) as number,
            strokeColor: this.getParameterValue(colorParamName) as string,
            lineStyle: this.getParameterValue(lineStyleParamName) as string
        };
    }

    _getLineTheme(fieldIndex: number): LinePlotTheme {
        let colorParamName: string,
            widthParamName: string,
            lineStyleParamName: string;

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
            width: this.getParameterValue(widthParamName) as number,
            strokeColor: this.getParameterValue(colorParamName) as string,
            lineStyle: this.getParameterValue(lineStyleParamName) as string
        };
    }

    draw() {
        for (let horizontalLine of this.horizontalLines) {
            (<HorizontalLine>horizontalLine).draw(this);
        }
    }

    drawHorizontalLineValueMarkers() {
        for (let horizontalLine of this.horizontalLines) {
            (<HorizontalLine>horizontalLine).drawValueMarkers(this);
        }
    }

    destroy() {
        this._removeTitleControls();
    }

    private _removeTitleControls() {
        if (this._titleControls) {
            this._unSubscribeEvents();

            this._titleControls.rootDiv.remove();
            this._titleControls = null;
        }
    }

    showSettingsDialog() {
        let showIndicatorSettingsRequest : ShowIndicatorSettingsDialogRequest = {type: ChannelRequestType.IndicatorSettingsDialog,indicator:this};
        ChartAccessorService.instance.sendSharedChannelRequest(showIndicatorSettingsRequest);
    }

    _getIndicatorPlotType(fieldName: string): string {
        return '';
    }

    /**
     * Updates values in the title.
     * @method updateHoverRecord
     * @param {number} [record] The hover record.
     * @memberOf Indicator#
     * @private
     */
    updateHoverRecord(record?: number) {
        if (!this.showValuesInTitle)
            return;

        if (record == null)
            record = this._chart.hoveredRecord;

        for (let i = 0; i < this._plotItems.length; i++) {
            let item = this._plotItems[i],
                recordCount = item.dataSeries ? item.dataSeries.length : 0;

            let fieldName = this._fieldNames[i];
            if (fieldName == IndicatorField.INDICATOR_FILL)// NK Fill plot does not need any title item
                continue;

            if (recordCount <= 0)
                continue;
            if (record == null || record < 0 || record >= recordCount)
                record = recordCount - 1;

            let value = item.dataSeries.valueAtIndex(record),
                text = this._panel.formatValue(value as number);

            item.titleValueSpan.text(text);
        }
    }

    _addPlot(plot: Plot, titleColor: string) {
        this._panel.addPlot(plot);

        this._initPanelTitle();

        let items = this._plotItems;
        for (let i = 0; i < items.length; i++) {
            let plotItem = items[i];
            if (!plotItem.plot) {
                plotItem.plot = plot;
                plotItem.dataSeries = plot.dataSeries[0];
                plotItem.color = titleColor;

                this._updatePanelTitle();

                return plotItem;
            }
        }
    }

    _initPanelTitle() {
        if (this._titleControls)
            return;

        // MA add this back if you want to show ContextMenu
        // let menuConfig: IIndicatorContextMenuConfig = {
        //     menuContainer: null,
        //     showOnClick: true,
        //     indicator: this,
        //     onItemSelected: (menuItem, checked) => {
        //         switch (menuItem.data('id')) {
        //             case IndicatorContextMenu.MenuItem.ABOUT:
        //                 this.showInfoDialog();
        //                 break;
        //             case IndicatorContextMenu.MenuItem.SETTINGS:
        //                 this.showSettingsDialog();
        //                 break;
        //             case IndicatorContextMenu.MenuItem.SHOW_PARAMS:
        //                 this.showParamsInTitle = checked;
        //                 this._panel.setNeedsUpdate();
        //                 break;
        //             case IndicatorContextMenu.MenuItem.SHOW_MARKERS:
        //                 this.showValueMarkers = checked;
        //                 this._panel.setNeedsUpdate();
        //                 break;
        //             case IndicatorContextMenu.MenuItem.SHOW_VALUES:
        //                 this.showValuesInTitle = checked;
        //                 this._panel.setNeedsUpdate();
        //                 break;
        //             case IndicatorContextMenu.MenuItem.VISIBLE:
        //                 this.visible = checked;
        //                 this._panel.setNeedsUpdate();
        //                 break;
        //             case IndicatorContextMenu.MenuItem.DELETE:
        //                 this._remove();
        //                 break;
        //         }
        //     }
        // };

        let controls = this._titleControls = <IIndicatorTitleControls> {};
        let div = controls.rootDiv = this._panel.titleDiv.scxAppend('div');
        controls.name = div.scxAppend('div', Class.TITLE_CAPTION).text(this.getShortName());
        controls.parameters = div.scxAppend('div', Class.TITLE_CAPTION);

        // MA add this back if you want to show ContextMenu
        // controls.name.scx().indicatorContextMenu(menuConfig);
        // controls.parameters.scx().indicatorContextMenu(menuConfig);

        if(BrowserUtils.isDesktop()) {
            div.scxAppend('span', [Class.TITLE_ICON, Class.TITLE_VISIBLE_ICON])
                .attr('title', 'Change Visibility')
                .on('click', () => {
                    this.visible = !this.visible;
                    this._updateVisibilityIconState(div);
                    this._panel.setNeedsUpdate();
                    if (this.visible) this.update();
                });
        }
        this._updateVisibilityIconState(div);

        div.scxAppend('span', [Class.TITLE_ICON, Class.TITLE_SETTINGS_ICON])
            .attr('title', 'Indicator Settings')
            .on('click', () => {
                if(BrowserUtils.isDesktop()) {
                    this.showSettingsDialog();
                } else {
                    this.chart.fireValueChanged(ChartEvent.SHOW_OBJECTS_TREE);
                }
        });

        if(BrowserUtils.isDesktop()) {
            div.scxAppend('span', [Class.TITLE_ICON, Class.TITLE_REMOVE_ICON])
                .attr('title', 'Remove indicator')
                .on('click', () => {
                    this._remove();
                });
        }


        for (let i = 0, count = this._fieldNames.length; i < count; i++) {
            this._plotItems.push({
                titlePlotSpan: div.scxAppend('span', Class.TITLE_VALUE),
                titleValueSpan: div.scxAppend('span', Class.TITLE_VALUE)
            });
        }

        this.updateTitleControlsVisibility();

        this._subscribeEvents();
    }

    private _updateVisibilityIconState(container: JQuery) {
        if(BrowserUtils.isDesktop()) {
            container.find('.' + Class.TITLE_VISIBLE_ICON).removeClass('activated');
            container.find('.' + Class.TITLE_VISIBLE_ICON).addClass(this.visible ? '' : 'activated');
        }
    }

    // It is used in custom indicators.
    getParametersString(): string {
        return null;
    }

    getParameters(): TAIndicatorParameters {
        return null;
    }

    getAlertParameters(): (string | number)[] {
        return [];
    }

    _updatePanelTitle() {
        let paramters = this.getParametersString();
        this._titleControls.name.text(this.getShortName());
        this._titleControls.parameters.text(paramters != '' ? '(' + paramters + ')' : '');

        for (let i = 0; i < this._plotItems.length; i++) {
            let plotItem = this._plotItems[i],
                field = this.getPlotName(this._fieldNames[i]);

            plotItem.titlePlotSpan
                .css('color', plotItem.color)
                .text(field ? field + ':' : '');
            plotItem.titleValueSpan
                .css('color', plotItem.color)
                .attr('title', field);
        }
    }

    updateTitleControlsVisibility() {
        let showMarkers = this.showValueMarkers,
            showValuesInTitle = this.showValuesInTitle,
            valueDisplay = showValuesInTitle ? 'inline-block' : 'none',
            controls = this._titleControls;

        if (controls)
            controls.parameters.css('display', this.showParamsInTitle ? 'inline-block' : 'none');

        for (let item of this._plotItems) {
            if (item.plot)
                item.plot.showValueMarkers = showMarkers;
            item.titlePlotSpan.css('display', valueDisplay);
            item.titleValueSpan.css('display', valueDisplay);
        }
    }

    addHorizontalLine(horizontalLine: HorizontalLine) {
        if (this.horizontalLines.indexOf(horizontalLine) !== -1) {
            throw new TypeError('hLine is already existed');
        }

        this.horizontalLines.push(horizontalLine);
    }

    removeHorizontalLine(index: number) {
        this.horizontalLines.splice(index, 1);
    }

    canHaveHorizontalLine(): boolean {
        return this._panel !== this.chart.mainPanel;
    }

    setHorizontalLines(horizontalLines: HorizontalLine[]) {
        //NK empty the horizontal lines array
        //https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
        this.horizontalLines.splice(0, this.horizontalLines.length);
        for (let horizontalLine of horizontalLines) {
            this.horizontalLines.push(horizontalLine);
        }
    }

    /* Default settings */

    resetDefaultSettings() {
    }

    saveAsDefaultSettings() {
    }

    onSettingsUpdated() {
        let indicatorAlerts = ChartAccessorService.instance.getAlertService().getIndicatorChartAlerts(this._chart.hostId, this.id);
        if(indicatorAlerts.length == 0) {
            return;
        }
        if(this._hasDifferentParametersThanAlert(indicatorAlerts[0])) {
            indicatorAlerts.forEach(alert => {
                alert.parameter.indicatorParameters = this.getAlertParameters();
                ChartAccessorService.instance.getAlertService().updateAlert(alert);
            })
        }
    }

    private _hasDifferentParametersThanAlert(alert: ChartAlert) {
        let newIndicatorAlertParameters = this.getAlertParameters();
        for(let i = 0; i < newIndicatorAlertParameters.length; i++) {
            let param = newIndicatorAlertParameters[i];
            if(param != alert.parameter.indicatorParameters[i]) {
                return true;
            }
        }
        return false;
    }

    _initIndicator(config: IIndicatorConfig) {
        this._isOverlay = false;
        this._options.parameters = {};
    }

    protected _initIndicatorParameters(config: IIndicatorConfig) {

    }

    protected _initIndicatorHorizontalLines(config: IIndicatorConfig) {

    }


    _subscribeEvents() {
        this._chart.on(ChartEvent.HOVER_RECORD_CHANGED + '.scxIndicator', (event: IValueChangedEvent) => {
            this.updateHoverRecord(event.value as number);
        }, this);
    }

    _unSubscribeEvents() {
        if (this._chart)
            this._chart.off(ChartEvent.HOVER_RECORD_CHANGED + '.scxIndicator', this);
    }

    _remove() {
        if(ChartAccessorService.instance.getAlertService().getIndicatorChartAlerts(this.chart.hostId, this.id).length == 0) {
            this._onRemoveIndicator();
            return;
        }

        let openRequest: ConfirmationRequest =  {
            type: ChannelRequestType.Confirmation,
            messageLine: ChartAccessorService.instance.translate( 'حذف هذا المؤشر سيؤدي إلى حذف تنبيهات الرسم البياني المرتبطة به'),
            messageLine2: ChartAccessorService.instance.translate('هل أنت متأكد من الحذف؟'),
            caller: this
        };
        ChartAccessorService.instance.sendSharedChannelRequest(openRequest);
    }

    onConfirmation(confirmed: boolean, param: unknown): void {
        if(confirmed) {
            this._onRemoveIndicator();
        }
    }

    _onRemoveIndicator() {
        this._chart.fireValueChanged(ChartEvent.DELETE_INDICATOR_ALERTS, this.id);
        this._chart.removeChildIndicators(this.id);
        this._chart.removeIndicators(this);
        this._chart.setNeedsUpdate(true);
    }

    protected _getOverlayIndicatorDefaultSource(): string {
        return '';
    }

    public getOverlayIndicatorDefaultSource() {
        return this._getOverlayIndicatorDefaultSource();
    }

    /* Gestures methods */

    protected _initGestures() {
        if(Config.isElementBuild()) {
            this._gestures = new GestureArray([]); // no indicator gesture in viewer
            return;
        }
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
    }

    protected _handleDoubleClick() {
        this.showSettingsDialog();
    }

    protected _handlePanGesture(gesture: PanGesture, event: WindowEvent) {
        let point = event.pointerPosition;
        let newPanel = this._getIndicatorNewPanel(point.y);

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
    }

    moveIndicatorToNewPanel(newPanel: ChartPanel) {
        let oldPanelIndex: number = this._panel.getIndex();
        let movedFromMainPanel = oldPanelIndex == 0;
        this._chart.removeChildIndicators(this.id);
        let panelContainsAnotherIndicator: boolean = this._panel.indicators.length > 1;
        this._resetCurrentPanelPlots();
        this._panel = newPanel;
        this._reInitiateNewPanelTitle();

        //Abu5, in order to make sure that every panel main indicator exist on index 0
        // then, we need to move all child indicators to the end of indicators array
        this._chart.moveIndicatorIndexToEnd(this);

        if (!movedFromMainPanel && !panelContainsAnotherIndicator) {
            this.chart.chartPanelsContainer.removePanel(oldPanelIndex);
        }
    }

    setSelectedSource(source: string) {
        if(source !== null) {
            let isCustomSource: boolean = source.includes('_');
            if (!isCustomSource) {
                this.customSourceIndicatorId = null;
                this.setParameterValue(IndicatorParam.SOURCE, source);
            } else {
                this.customSourceIndicatorId = source.split('_')[0];
                this.setParameterValue(IndicatorParam.SOURCE, source);
            }
        }
    }

    moveIndicatorToNewAddedPanel() {
        let newPanel = this._chart.addChartPanel(this._chart.chartPanels.length , 0.2 , true);
        this._initPanel();
        this._chart.layout();
        this._reInitiateNewPanelTitle();
        this.moveIndicatorToNewPanel(newPanel);
    }

    protected hitTest(point: IPoint): boolean {
        for (let horizontalLine of this.horizontalLines) {
            if ((<HorizontalLine>horizontalLine).hitTest(point, this)) {
                return true;
            }
        }

        return false;
    }

    public handleEvent(event: WindowEvent) {
        return this._gestures.handleEvent(event);
    }

    protected _handleContextMenuGesture(gesture: Gesture, event: WindowEvent) {
        this._contextMenuPositionPrice = MathUtils.roundAccordingMarket(this._panel.projection.valueByY(event.pointerPosition.y), this.chart.instrument.symbol);
        this._contextMenu.show(event.evt);
        event.evt.stopPropagation();
        event.evt.preventDefault();
    }


    /* Change Indicator Panel */

    private _getIndicatorNewPanel(y: number): ChartPanel {
        let chartPanel = this.chart.chartPanelsContainer.findPanelAt(this._panel.contentFrame.top + y);
        if (chartPanel && chartPanel != this._panel) {
            return chartPanel;
        }

        return null;
    }

    private _reInitiateNewPanelTitle() {
        this._titleControls.rootDiv.remove();
        this._titleControls = null;
        this._initPanelTitle();
    }

    private _resetCurrentPanelPlots() {
        this._panel.removePlot(this.plots);
        this._plotItems = [];
    }

    private _onFinishIndicatorDrag() {
        if (this._panel.getIndex() == 0) {
            // NK moved to main panel so clean the custom source id
            this.customSourceIndicatorId = null;
            this.setParameterValue(IndicatorParam.SOURCE, this._getOverlayIndicatorDefaultSource());
        } else {
            let sourceIndicator = this._panel.indicators[0];
            this.customSourceIndicatorId = sourceIndicator.id;

            //NK set the first plot of the source indicator as the source one by default
            let firstPlotIndex: number = 0;
            this.setParameterValue(IndicatorParam.SOURCE, this.customSourceIndicatorId + '_' + firstPlotIndex);
        }
    }

    private _addCssClassesForNewIndicatorPanel(panel: ChartPanel) {
        panel.rootDiv.addClass('change-indicator-panel').addClass('new-panel');
    }

    private _removeCssClassesForAllChartPanels() {
        for (let panel of this.chart.chartPanels) {
            // NK remove plot-mouse-hover class to reset the cursor to default
            panel.rootDiv.removeClass('change-indicator-panel').removeClass('new-panel').removeClass('plot-mouse-hover');
        }
    }

    private _applyCurrentPanelCssClasses(add: boolean) {
        if (add) {
            this._panel.rootDiv.removeClass('plot-mouse-hover').addClass('change-indicator-panel');
        } else {
            this._panel.rootDiv.removeClass('change-indicator-panel');
        }
    }

    private _canChangeIndicatorPanel(newPanel: ChartPanel): boolean {
        // NK we can not move indicator to main panel unless it is overlay
        // overlay means when we add it for the first time it will be added to the main panel
        // Abu5, disallow dragging any indicator other than overlay ones
        if (!this._isOverlay ) {
            return false;
        }

        // NK do not drag two sources indicators
        if (this.hasParameter(IndicatorParam.SOURCE2)) {
            return false;
        }

        return true;
    }

    private _updateCustomSourceIndicatorIdIfNeeded() {
        if (!this.customSourceIndicatorId) {
            return;
        }

        let sourceIndicator: Indicator = this._chart.getIndicatorById(this.customSourceIndicatorId);
        let currentSourceParam: string = this.getParameterValue(IndicatorParam.SOURCE) as string;

        if (sourceIndicator.hasSourcePlot(currentSourceParam)) {
            return;
        }

        let chartPanelIndicators: Indicator[] = this.chartPanel.indicators.filter(ind => ind != this && ind != sourceIndicator);

        for (let indicator of chartPanelIndicators) {
            for (let i = 0; i < indicator.plots.length; i++) {
                if (indicator.id + '_' + i == currentSourceParam) {
                    this.customSourceIndicatorId = indicator.id;
                    return;
                }
            }
        }

        throw new Error('Current custom source indicator is not exist in this chart panel');
    }

    private hasSourcePlot(sourceId: string): boolean {
        for (let i = 0; i < this.plots.length; i++) {
            if (this.id + '_' + i == sourceId) {
                return true;
            }
        }
        return false;
    }


    protected getVolumeProfilerPlot(index: number, dataSeries: DataSeries, theme: PlotTheme):Plot {
        return null;
    }

    private _getVolumeProfilerTheme():VolumeProfilerPlotTheme {
        return {
            line:{
                width: this.getParameterValue(IndicatorParam.LINE_WIDTH) as number,
                strokeColor: this.getParameterValue(IndicatorParam.LINE_COLOR) as string,
                lineStyle: this.getParameterValue(IndicatorParam.LINE_STYLE) as string,
                strokeEnabled:this.getParameterValue(IndicatorParam.STROKE_ENABLED) as boolean,
            },
            showVolumeProfile:this.getParameterValue(IndicatorParam.SHOW_VOLUME_PROFILE_BARS) as boolean,
            boxWidth:this.getParameterValue(IndicatorParam.BOX_WIDTH) as number,
            placement:this.getParameterValue(IndicatorParam.PLACEMENT) as string,
            upVolume: {fillColor:this.getParameterValue(IndicatorParam.UP_VOLUME) as string},
            downVolume: {fillColor:this.getParameterValue(IndicatorParam.DOWN_VOLUME) as string},
            upArea: {fillColor:this.getParameterValue(IndicatorParam.UP_AREA) as string},
            downArea: {fillColor:this.getParameterValue(IndicatorParam.DOWN_AREA) as string},
            fillBox: {fillColor:this.getParameterValue(IndicatorParam.BOX_FILL) as string},
        };
    }

}

export interface PlotItem {
    titlePlotSpan: JQuery,
    titleValueSpan: JQuery,
    dataSeries?: DataSeries,
    plot?: Plot,
    color?: string
}

export interface CalculationResult {
    parameters: string,
    recordSet: Recordset,
    startIndex: number
}

export interface AddChartAlertEventValue {
    price:number,
    panelIndex:number,
    selectedIndicatorId:string
}
