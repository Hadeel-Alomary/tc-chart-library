/*
 *   WARNING! This program and source code is owned and licensed by
 *   Modulus Financial Engineering, Inc. http://www.modulusfe.com
 *   Viewing or use this code requires your acceptance of the license
 *   agreement found at http://www.modulusfe.com/support/license.pdf
 *   Removal of this comment is a violation of the license agreement.
 *   Copyright 2002-2016 by Modulus Financial Engineering, Inc.
 */

import {IDateTimeFormatState} from "../Data/DateTimeFormat";
import {IDateScaleCalibrator, IDateScaleCalibratorState} from "./DateScaleCalibrator";
import {IPadding, IRect, Rect} from "../Graphics/Rect";
import {DateScalePanel} from "./DateScalePanel";
import {Projection} from "./Projection";
import {Chart} from "../Chart";
import {DataSeries, IMinMaxValues} from "../Data/DataSeries";
import {DateScaleTheme} from '../Theme';

export interface IDateScaleState {
    formatter: IDateTimeFormatState;
    calibrator: IDateScaleCalibratorState;
    firstVisibleRecord: number;
    lastVisibleRecord: number;
    minVisibleRecords: number;
    textPadding: IPadding;
    height: number;
    useManualHeight: boolean;
    scrollKind: string;
    zoomKind: string;
    zoomMode: string;
    rightAdditionalSpaceRatio: number;
    majorTickMarkLength: number;
    minorTickMarkLength: number;
    allowPartialRecords: boolean;
    showGridSessionLines: boolean;
}

/**
 * Date scale scroll kind enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const DateScaleScrollKind = {
    /** Normal scroll. */
    NORMAL: 'normal',
    /** Auto-scale value scales on scroll. */
    AUTOSCALED: 'autoscaled'
};
Object.freeze(DateScaleScrollKind);

/**
 * Date scale zoom kind enum values.
 * @readonly
 * @enum {string}
 * @memberOf StockChartX
 */
export const DateScaleZoomKind = {
    /** Normal zoom. */
    NORMAL: 'normal',
    /** Auto-scale value scales on zoom. */
    AUTOSCALED: 'autoscaled'
};
Object.freeze(DateScaleZoomKind);

/**
 * Date scale zoom mode enum values.
 * @readonly
 * @type {string}
 * @memberOf StockChartX
 */
export const DateScaleZoomMode = {
    /** Pin center of chart and zoom left and right sides evenly */
    PIN_CENTER: 'pin_center',
    /** Pin left side and zoom right side only. */
    PIN_LEFT: 'pin_left',
    /** Pin right side and zoom left side only. */
    PIN_RIGHT: 'pin_right'
};
Object.freeze(DateScaleZoomMode);

export interface DateScale {
    projection: Projection;
    projectionFrame:Rect;
    minVisibleRecords: number;
    firstVisibleRecord: number;
    lastVisibleRecord: number;
    firstVisibleIndex: number;
    lastVisibleIndex: number;
    zoomed: boolean;
    showGridSessionLines:boolean;
    columnsCount:number;
    columnWidth:number;
    topPanelVisible:boolean;
    bottomPanelVisible:boolean;
    topPanel:DateScalePanel;
    bottomPanel:DateScalePanel;
    chart:Chart;
    calibrator:IDateScaleCalibrator;
    gridSessionLinesColor:string;
    visibleDateRange:IMinMaxValues<Date>;
    actualTheme:DateScaleTheme;
    scrollKind:string;
    zoomKind:string;
    topPanelCssClass:string;
    useManualHeight:boolean;
    manualHeight:number;
    textPadding:IPadding;
    majorTickMarkLength:number;
    minorTickMarkLength:number;

    _canSetVisibleRecord(record: number): boolean;
    _textDrawBounds():IRect;
    _handleZoom(pixels: number):void;
    saveState(): IDateScaleState;
    loadState(state: IDateScaleState): void;
    setNeedsAutoScale(): void;
    layoutScalePanel(chartFrame: Rect): Rect;
    layout(frame: Rect, projectionFrame: Rect): void;
    draw(): void;
    scrollOnPixels(pixels: number): boolean;
    scrollOnRecords(records: number): boolean;
    zoomOnPixels(leftPixels: number, rightPixels?: number):boolean;
    zoomOnRecords(leftRecords: number, rightRecords?: number):boolean;
    formatDate(date: Date): string;
    getDateDataSeries(): DataSeries;
    canScroll():boolean ;
}
