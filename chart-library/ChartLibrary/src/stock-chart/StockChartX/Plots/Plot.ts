/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {ChartPanelObject, IChartPanelObjectConfig, IChartPanelObjectOptions} from "../ChartPanels/ChartPanelObject";
import {DataSeries, DataSeriesSuffix, IMinMaxValues} from "../Data/DataSeries";
import {ChartPanel} from "../ChartPanels/ChartPanel";
import {ValueScale} from "../Scales/ValueScale";
import {Projection} from "../Scales/Projection";
import {GestureArray} from "../Gestures/GestureArray";
import {HtmlUtil} from "../Utils/HtmlUtil";
import {Gesture, GestureState, WindowEvent} from "../Gestures/Gesture";
import {IPoint} from "../Graphics/ChartPoint";
import {MouseHoverGesture} from "../Gestures/MouseHoverGesture";
import {ClickGesture} from "../Gestures/ClickGesture";
import {ChartTooltipType, ChartAccessorService} from '../../../services/index';
import {ValueMarkerOwner} from '../ValueMarkerOwner';
import {Tc} from '../../../utils';
import {FillPlotTheme, IStrokeTheme, MountainLinePlotTheme, PlotTheme} from '../Theme';
import {Chart} from '../Chart';

export interface IPlotOptions extends IChartPanelObjectOptions {
  plotStyle: string;
  showValueMarkers: boolean;
}

export interface IPlotConfig extends IChartPanelObjectConfig {
  dataSeries?: DataSeries | DataSeries[];
  chartPanel?: ChartPanel;
  theme?: PlotTheme;
  plotType?: string;
  valueScale?: ValueScale;
  plotStyle?: string;
}

export interface IPlotDrawParams {
  context: CanvasRenderingContext2D;
  projection: Projection;
  dates: Date[];
  values: number[];
  startIndex: number;
  endIndex: number;
  startColumn: number;
  theme: PlotTheme;
}

export interface IPlotValueDrawParams extends IPlotDrawParams {
}

export interface IPlotBarDrawParams extends IPlotDrawParams {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
}

export interface IPlotDefaults {
  plotStyle: string;
}

export const PlotType = {
  INDICATOR: 'indicator',
  PRICE_STYLE: 'priceStyle',
  USER: 'user'
};
Object.freeze(PlotType);

export enum PlotDrawingOrderType {
  IndicatorPlot = 1,
  PricePlot,
  LabelConnectedPlot,
  SelectedPlot,
  PlotsMaxOrder
}

/** 
 * Plot events enumeration values. 
 * @name PlotEvent 
 * @enum {string} 
 * @property {string} DATA_SERIES_CHANGED Data series has been changed
 * @property {string} PANEL_CHANGED Plot panel has been changed
 * @property {string} THEME_CHANGED  Plot theme has been changed
 * @property {string} STYLE_CHANGED  Plot style has been changed
 * @property {string} SHOW_VALUE_MARKERS_CHANGED  Show value markers option has been enabled or disabled
 * @property {string} VISIBLE_CHANGED  Plot visibility has been changed (visible | invisible)
 * @property {string} VALUE_SCALE_CHANGED  Plot value scale has been changed
 * @property {string} BASE_VALUE_CHANGED  Plot base value has been changed
 * @readonly 
 * @memberOf  
 */
export namespace PlotEvent {
  export const DATA_SERIES_CHANGED = "plotDataSeriesChanged";
  export const PANEL_CHANGED = "plotPanelChanged";
  export const THEME_CHANGED = "plotThemeChanged";
  export const STYLE_CHANGED = "plotStyleChanged";
  export const SHOW_VALUE_MARKERS_CHANGED = "plotShowValueMarkersChanged";
  export const VISIBLE_CHANGED = "plotVisibleChanged";
  export const VALUE_SCALE_CHANGED = "plotValueScaleChanged";
  export const BASE_VALUE_CHANGED = "plotBaseValueChanged";
  export const COLUMN_WIDTH_RATIO_CHANGED = "plotColumnWidthRatioChanged";
  export const MIN_WIDTH_CHANGED = "plotMinWidthChanged";
  export const POINT_SIZE_CHANGED = "plotPointSizeChanged";
}

/**
 * Represents abstract plot.
 * @param {Object} [config] The configuration object.
 * @param {DataSeries[]} [config.dataSeries] An array of data series for the plot.
 * @param {Object} [config.chartPanel] The parent chart panel.
 * @param {Object} [config.theme] The plot's theme.
 * @param {String} [config.plotType] The plot type.
 * @constructor Plot
 * @augments ChartPanelObject
 * @abstract
 */
export abstract class Plot extends ChartPanelObject implements ValueMarkerOwner {
  static defaults: IPlotDefaults;

  private _valueMarkerOffset: number = 0;
  public get valueMarkerOffset(): number {
	return this._valueMarkerOffset;
  }
  public set valueMarkerOffset(value: number) {
	this._valueMarkerOffset = value;
  }

  public get top(): number {
	return this.panelValueScale.projection.yByValue(<number> this.lastVisibleValue);
  }

  private get lastVisibleValue(): number {
	let lastIdx = Math.ceil(this.chart.dateScale.lastVisibleRecord);
	let lastValue = <number> this._dataSeries[0].valueAtIndex(lastIdx);
	if(!lastValue) {
	  lastValue = <number> this._dataSeries[0].lastValue;
	}
	return lastValue;
  }

  protected _plotThemeKey = '';
  protected _gestures: GestureArray;

  /**
   * An array of data series used by plot.
   * @name dataSeries
   * @type {Array}
   * @memberOf Plot#
   */
  private _dataSeries: DataSeries[] = [];
  get dataSeries(): DataSeries[] {
	return this._dataSeries;
  }

  set dataSeries(value: DataSeries[]) {
	this.setDataSeries(value);
  }

  /**
   * Sets 1 or more data series.
   * @method setDataSeries
   * @param {DataSeries | DataSeries[]} dataSeries The data series.
   * @memberOf Plot#
   */
  setDataSeries(dataSeries: DataSeries | DataSeries[]) {
	let newValue: DataSeries[];

	if (dataSeries instanceof DataSeries)
	  newValue = [dataSeries];
	else if (Array.isArray(dataSeries))
	  newValue = dataSeries;
	else
	  throw new TypeError("Single data series or an array of data series expected.");

	let oldValue = this._dataSeries;
	if (oldValue !== newValue) {
	  this._dataSeries = newValue;
	  this.fire(PlotEvent.DATA_SERIES_CHANGED, newValue, oldValue);
	}
  }

  private _theme: PlotTheme;
  /**
   * The theme.
   * @name theme
   * @type {Object}
   * @memberOf Plot#
   */
  get theme():PlotTheme {
	return this._theme;
  }

  set theme(value:PlotTheme) {
	let oldValue = this._theme;
	this._theme = value;
	this.fire(PlotEvent.THEME_CHANGED, value, oldValue);
  }

  /**
   * Gets actual plot theme.
   * @name actualTheme
   * @type {Object}
   * @memberOf Plot#
   */
  get actualTheme(): PlotTheme {
	if (this._theme)
	  return this._theme;

	return this.chart.theme.plot[this._plotThemeKey][this.plotStyle];
  }

  /**
   * Gets/Sets plot style.
   * @name plotStyle
   * @type {string}
   * @memberOf Plot#
   */
  get plotStyle(): string {
	let style = (<IPlotOptions> this._options).plotStyle;
	if (style)
	  return style;

	let defaults = <IPlotDefaults> (this.constructor as typeof Plot).defaults;

	return defaults && defaults.plotStyle;
  }

  set plotStyle(value: string) {
	this._setOption("plotStyle", value, PlotEvent.STYLE_CHANGED);
  }

  /**
   * Gets/Sets the flag that indicates whether value markers are visible.
   * @name showValueMarkers
   * @type {boolean}
   * @memberOf Plot#
   */
  get showValueMarkers(): boolean {
	return (<IPlotOptions> this._options).showValueMarkers;
  }

  set showValueMarkers(value: boolean) {
	this._setOption("showValueMarkers", !!value, PlotEvent.SHOW_VALUE_MARKERS_CHANGED);
  }

  /**
   * Gets plot type.
   * @name plotType
   * @type {string}
   * @memberOf Plot#
   */
  protected _plotType = PlotType.USER;
  get plotType(): string {
	return this._plotType;
  }

  set plotType(value: string) { // MA compile typescript
	this._plotType = value;
  }

  public selected: boolean = false;

  public get drawingOrder(): PlotDrawingOrderType {
	if (this.selected) {
	  return PlotDrawingOrderType.SelectedPlot;
	}

	if (this._plotType == PlotType.PRICE_STYLE) {
	  return PlotDrawingOrderType.PricePlot;
	}

	//NK indicator plot
	return PlotDrawingOrderType.IndicatorPlot;
  }

  constructor(chart:Chart, config?: IPlotConfig) {
	super(chart, config);

	let suppress = this.suppressEvents(true);

	if (config) {
	  if (config.dataSeries != null)
		this.setDataSeries(config.dataSeries);
	  if (config.chartPanel != null)
		this.chartPanel = config.chartPanel;
	  if (config.theme != null)
		this.theme = config.theme;
	  if (config.plotType)
		this._plotType = config.plotType;
	  if (config.options)
		this._options = config.options;
	  if (config.valueScale)
		this.valueScale = config.valueScale;
	  this.plotStyle = config.plotStyle;
	}

	let options = <IPlotOptions> this._options;
	if (options.showValueMarkers == null)
	  options.showValueMarkers = true;
	if (options.visible == null)
	  options.visible = true;

	this.suppressEvents(suppress);
	this._initGestures();
  }

  protected _onChartPanelChanged(oldValue: ChartPanel) {
	this.fire(PlotEvent.PANEL_CHANGED, this.chartPanel, oldValue);
  }

  protected _onValueScaleChanged(oldValue: ValueScale) {
	this.fire(PlotEvent.VALUE_SCALE_CHANGED, this.valueScale, oldValue);
  }

  protected _onVisibleChanged(oldValue: boolean) {
	this.fire(PlotEvent.VISIBLE_CHANGED, this.visible, oldValue)
  }

  protected findDataSeries(nameSuffix: string): DataSeries {
	for (let dataSeries of this._dataSeries) {
	  if (dataSeries.nameSuffix === nameSuffix)
		return dataSeries;
	}

	return null;
  }

  /**
   * Returns minimum and maximum values in a given range.
   * @method minMaxValues
   * @param {Number} [startIndex] The start search index. 0 if omitted.
   * @param {Number} [count] The number of values to iterate through. Iterates through all values after startIndex if omitted.
   * @returns {{min: Number, max: Number}} An object that contains min and max values.
   * @memberOf Plot#
   * @example
   *  var values1 = plot.getMinMaxValues();
   *  var values2 = plot.getMinMaxValues(1, 5);
   */
  minMaxValues(startIndex: number, count: number): IMinMaxValues<number> {

	Tc.assert(this.shouldAffectAutoScalingMaxAndMinLimits(), "minMax is called for a non autoscaled plot");

	let min = Infinity,
	  max = -Infinity;

	for (let dataSeries of this._dataSeries) {
	  if (dataSeries.isValueDataSeries) {
		let values = dataSeries.minMaxValues(startIndex, count);
		if (values.min < min)
		  min = values.min;
		if (values.max > max)
		  max = values.max;
	  }
	}
	return {
	  min: min,
	  max: max
	}
  }

  updateMinMaxForSomePlotsIfNeeded(min: number, max: number): IMinMaxValues<number> {
	return {
	  min: min,
	  max: max
	};
  }

  //NK, force every inherited plot to implement this method
  public abstract drawSelectionPoints(): void;

  protected _valueDrawParams(): IPlotValueDrawParams {
	let chart = this.chart,
	  valueSeries = this._dataSeries[0],
	  dateSeries = this.findDataSeries(DataSeriesSuffix.DATE),
	  projection = this.projection,
	  firstVisibleIndex: number,
	  lastVisibleIndex: number;

	if (dateSeries) {
	  let dateRange = chart.dateScale.visibleDateRange;

	  firstVisibleIndex = dateSeries.floorIndex(dateRange.min);
	  lastVisibleIndex = dateSeries.ceilIndex(dateRange.max);
	} else {
	  firstVisibleIndex = chart.firstVisibleIndex;
	  lastVisibleIndex = chart.lastVisibleIndex;
	}

	let startIndex = Math.max(valueSeries.leftNearestVisibleValueIndex(firstVisibleIndex) - 1, 0),
	  endIndex = Math.min(valueSeries.rightNearestVisibleValueIndex(lastVisibleIndex) + 1, valueSeries.length - 1),
	  startColumn = dateSeries ? 0 : projection.columnByRecord(startIndex);

	return {
	  context: this.context,
	  projection: projection,
	  dates: <Date[]> (dateSeries && dateSeries.values),
	  values: <number[]> valueSeries.values,
	  startIndex: startIndex,
	  endIndex: endIndex,
	  startColumn: startColumn,
	  theme: this.actualTheme
	};
  }

  protected _barDrawParams(): IPlotBarDrawParams {
	let chart = this.chart,
	  dataSeries = this._dataSeries,
	  projection = this.projection,
	  dateSeries: DataSeries = null,
	  openSeries: DataSeries = null,
	  highSeries: DataSeries = null,
	  lowSeries: DataSeries = null,
	  closeSeries: DataSeries = null,
	  firstVisibleIndex: number,
	  lastVisibleIndex: number;

	for (let item of dataSeries) {
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
	  let dateRange = chart.dateScale.visibleDateRange;

	  firstVisibleIndex = dateSeries.floorIndex(dateRange.min);
	  lastVisibleIndex = dateSeries.ceilIndex(dateRange.max);
	} else {
	  firstVisibleIndex = chart.firstVisibleIndex;
	  lastVisibleIndex = chart.lastVisibleIndex;
	}

	let startIndex = Math.max(dataSeries[0].leftNearestVisibleValueIndex(firstVisibleIndex) - 1, 0),
	  endIndex = Math.min(dataSeries[0].rightNearestVisibleValueIndex(lastVisibleIndex) + 1, dataSeries[0].length - 1),
	  startColumn = dateSeries ? 0 : projection.columnByRecord(startIndex);

	return {
	  context: this.context,
	  projection: projection,
	  values: <number[]> this._dataSeries[0].values,
	  dates: <Date[]> (dateSeries && dateSeries.values),
	  open: <number[]> (openSeries && openSeries.values),
	  high: <number[]> (highSeries && highSeries.values),
	  low: <number[]> (lowSeries && lowSeries.values),
	  close: <number[]> (closeSeries && closeSeries.values),
	  startIndex: startIndex,
	  endIndex: endIndex,
	  startColumn: startColumn,
	  theme: this.actualTheme
	};
  }

  drawValueMarkers() {
	if (!this.showValueMarkers)
	  return;

	let marker = this.chart.valueMarker,
	  value = this.lastVisibleValue,
	  markerTheme = marker.theme,
	  theme = this.actualTheme,
	  fillColor: string;

	if ((theme as IStrokeTheme).strokeColor && (theme as IStrokeTheme).strokeEnabled !== false)
	  fillColor = (theme as IStrokeTheme).strokeColor;
	else if ((theme as FillPlotTheme).fill && (theme as FillPlotTheme).fill.fillEnabled !== false)
	  fillColor = (theme as FillPlotTheme).fill.fillColor;
	else if ((theme as MountainLinePlotTheme).line && (theme as MountainLinePlotTheme).line.strokeEnabled !== false)
	  fillColor = (theme as MountainLinePlotTheme).line.strokeColor;
	else
	  fillColor = markerTheme.fill.fillColor;

	// MA if fillColor has opacity, then we should it remove it for the markerTheme (as markers should have no opacity)
	if(fillColor.indexOf('0.') !== -1) {
	  fillColor = fillColor.replace(/0.[0-9]+/, "1");
	}

	markerTheme.fill.fillColor = fillColor;
	markerTheme.text.fillColor = HtmlUtil.isDarkColor(fillColor) ? 'white' : 'black';

	marker.draw(value, this.panelValueScale, this.valueMarkerOffset, this.plotType);
  }

  updateDataSeriesIfNeeded() {
  }

  handleEvent(event: WindowEvent) {
	return this._gestures.handleEvent(event);
  }

  public hitTest(point: IPoint): boolean {
	return false;
  }

  protected drawSelectionCircle(x: number, y: number): void {
	let context = this.chartPanel.context,
	  radius = 3;

	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI);
	context.strokeStyle = 'black';
	context.stroke();
	context.fillStyle = '#d6d6d6';
	context.fill();
  }

  /* Gestures methods */

  protected _initGestures() {
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
  }

  private _handleMouseClick(gesture: Gesture, event: WindowEvent) {
	if (!this.selected) {
	  this.selected = true;
	  this.chart.selectObject(this);
	  this.chartPanel.setNeedsUpdate();
	}
  }

  private _handleMouseHover(gesture: Gesture, event: WindowEvent) {
	if (this.plotType == PlotType.INDICATOR) {
	  this._handleMouseHoverForIndicatorPlot(gesture, event);
	} else if (this.plotType == PlotType.PRICE_STYLE) {
	  this._handleMouseHoverForPricePlot(gesture, event);
	} else {
	  throw new Error('Unknown plot type');
	}
	this._applyCss(gesture);
  }

  private _handleMouseHoverForIndicatorPlot(gesture: Gesture, event: WindowEvent) {
	let mousePosition = event.pointerPosition;
	let indicator = this.chartPanel.getPlotIndicator(this);
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
	} else {
	  throw new Error('Unknown indicator for plot ' + this);
	}
  }

  private _handleMouseHoverForPricePlot(gesture: Gesture, event: WindowEvent) {
	let mousePosition = event.pointerPosition;
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
  }

  private _applyCss(gesture: Gesture) {
	if (gesture.state == GestureState.FINISHED) {
	  this.chartPanel.rootDiv.removeClass('plot-mouse-hover');
	} else {
	  this.chartPanel.rootDiv.addClass('plot-mouse-hover');
	}
  }

  shouldAffectAutoScalingMaxAndMinLimits() {
	return true;
  }
}
