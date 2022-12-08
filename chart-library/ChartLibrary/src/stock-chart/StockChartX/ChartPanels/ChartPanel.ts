/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {ChartPanelsContainer} from "./ChartPanelsContainer";
import {Chart} from "../Chart";
import {ChartPanelValueScale} from "../Scales/ChartPanelValueScale";
import {INumberFormat} from "../Data/NumberFormat";
import {Plot} from "../Plots/Plot";
import {Drawing} from "../Drawings/Drawing";
import {Projection} from "../Scales/Projection";
import {Indicator} from "../Indicators/Indicator";
import {Rect} from "../Graphics/Rect";
import {ValueScale} from "../Scales/ValueScale";
import {IMinMaxValues} from "../Data/DataSeries";
import {AxisScaleType} from '../Scales/axis-scale-type';
import {TradingDrawing} from '../TradingDrawings/TradingDrawing';
import {TradingOrder, TradingPosition} from '../../../services/trading/broker/models';
import {IChartPanelState} from './ChartPanelImplementation';
import {ChartAlertDrawing} from '../AlertDrawings/ChartAlertDrawing';
import {ChartAlert} from '../../../services/data/alert';
import {WindowEvent} from '../..';


/**
 * Chart panel move direction enum values.
 * @name PanelMoveDirection
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const PanelMoveDirection = {
    /** Move is disabled. */
    NONE: "none",
    /** Horizontal move is enabled. */
    HORIZONTAL: "horizontal",
    /** Vertical move is enabled. */
    VERTICAL: "vertical",
    /** Panel can be moved in any direction. */
    ANY: "any"
};
Object.freeze(PanelMoveDirection);

/**
 * Chart panel move kind enum values.
 * @name PanelMoveKind
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const PanelMoveKind = {
    /** Normal move. */
    NORMAL: "normal",
    /** Auto-scale value scales on move. */
    AUTOSCALED: "autoscaled"
};
Object.freeze(PanelMoveKind);

/**
 * Chart panel events enumeration values.
 * @enum {string}
 * @readonly
 * @memberOf StockChartX
 */
export const PanelEvent = {
    /** Theme changed. */
    THEME_CHANGED: 'panelThemeChanged',

    /** X grid lines visibility changed (visible | invisible). */
    X_GRID_VISIBLE_CHANGED: 'panelXGridVisibleChanged',

    /** Y grid lines visibility changed (visible | invisible). */
    Y_GRID_VISIBLE_CHANGED: 'panelYGridVisibleChanged',

    /** New plot added. */
    PLOT_ADDED: 'panelPlotAdded',

    /** Plot removed. */
    PLOT_REMOVED: 'panelPlotRemoved',

    /** Panel double clicked. */
    DOUBLE_CLICKED: 'panelDoubleClicked'
};
Object.freeze(PanelEvent);

export interface ChartPanel {
    indicators: Indicator[];
    plots: Plot[];
    drawings: Drawing[];
    tradingDrawings: TradingDrawing[];
    chartAlertDrawing: ChartAlertDrawing[];
    chart: Chart;
    rootDiv: JQuery;
    chartPanelsContainer: ChartPanelsContainer;
    projection: Projection;
    context: CanvasRenderingContext2D;
    frame: Rect;
    heightRatio: number;
    minHeightRatio: number;
    maxHeightRatio: number;
    maximized: boolean;
    valueScales: ChartPanelValueScale[];
    valueScale: ChartPanelValueScale;
    contentFrame: Rect;
    canvas: JQuery;
    titleDiv:JQuery;
    formatter: INumberFormat;

    deleteDrawings(drawings?: Drawing | Drawing[]): void;

    clearPanelOnLoadState(): void;

    addDrawings(drawings: Drawing | Drawing[]): void;

    getTradingOrders():TradingOrder[];
    updateTradingOrder(order: TradingOrder): void;
    addTradingOrder(order: TradingOrder): void;
    addTradingPosition(position: TradingPosition): void;
    removeTradingPosition():void;
    removeTradingOrder(order:TradingOrder):void;

    getChartAlerts():ChartAlert[];
    updateChartAlert(alert: ChartAlert):void;
    addChartAlert(alert: ChartAlert):void;
    removeChartAlert(alert:ChartAlert):void;

    getIndex(): number;

    formatValue(value: number): string;

    setNeedsUpdate(needsAutoScale?: boolean): void;

    setNeedsAutoScale(): void;

    setAxisScale(axisScaleType:AxisScaleType):void;
    getAxisScale():AxisScaleType;

    update(): void;

    destroy(): void;

    layout(frame: Rect): void;

    hasIndicator(id: string): boolean;

    getPlotIndicator(plot: Plot): Indicator;

    removePlot(plot: Plot | Plot[]): void;

    addPlot(plot: Plot | Plot[]): void;

    updatePriceStylePlotDataSeriesIfNeeded(): void;

    getValueScale(chartValueScale: ValueScale): ChartPanelValueScale;

    getProjection(chartValueScale: ValueScale): Projection;

    saveState(): IChartPanelState;

    loadState(state: IChartPanelState): void;

    handleEvent(event: WindowEvent): boolean;

    draw(): void;

    getMinMaxValues(startIndex: number, count: number, valueScale: ValueScale): IMinMaxValues<number>;

    getPreferredValueScaleWidth(chartScale: ValueScale): number;

    getAutoScaledMinMaxValues(valueScale: ValueScale): IMinMaxValues<number>;
}
