import { IDateTimeFormatState } from "../Data/DateTimeFormat";
import { IDateScaleCalibrator, IDateScaleCalibratorState } from "./DateScaleCalibrator";
import { IPadding, IRect, Rect } from "../Graphics/Rect";
import { DateScalePanel } from "./DateScalePanel";
import { Projection } from "./Projection";
import { Chart } from "../Chart";
import { DataSeries, IMinMaxValues } from "../Data/DataSeries";
import { DateScaleTheme } from '../Theme';
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
export declare const DateScaleScrollKind: {
    NORMAL: string;
    AUTOSCALED: string;
};
export declare const DateScaleZoomKind: {
    NORMAL: string;
    AUTOSCALED: string;
};
export declare const DateScaleZoomMode: {
    PIN_CENTER: string;
    PIN_LEFT: string;
    PIN_RIGHT: string;
};
export interface DateScale {
    projection: Projection;
    projectionFrame: Rect;
    minVisibleRecords: number;
    firstVisibleRecord: number;
    lastVisibleRecord: number;
    firstVisibleIndex: number;
    lastVisibleIndex: number;
    zoomed: boolean;
    showGridSessionLines: boolean;
    columnsCount: number;
    columnWidth: number;
    topPanelVisible: boolean;
    bottomPanelVisible: boolean;
    topPanel: DateScalePanel;
    bottomPanel: DateScalePanel;
    chart: Chart;
    calibrator: IDateScaleCalibrator;
    gridSessionLinesColor: string;
    visibleDateRange: IMinMaxValues<Date>;
    actualTheme: DateScaleTheme;
    scrollKind: string;
    zoomKind: string;
    topPanelCssClass: string;
    useManualHeight: boolean;
    manualHeight: number;
    textPadding: IPadding;
    majorTickMarkLength: number;
    minorTickMarkLength: number;
    _canSetVisibleRecord(record: number): boolean;
    _textDrawBounds(): IRect;
    _handleZoom(pixels: number): void;
    saveState(): IDateScaleState;
    loadState(state: IDateScaleState): void;
    setNeedsAutoScale(): void;
    layoutScalePanel(chartFrame: Rect): Rect;
    layout(frame: Rect, projectionFrame: Rect): void;
    draw(): void;
    scrollOnPixels(pixels: number): boolean;
    scrollOnRecords(records: number): boolean;
    zoomOnPixels(leftPixels: number, rightPixels?: number): boolean;
    zoomOnRecords(leftRecords: number, rightRecords?: number): boolean;
    formatDate(date: Date): string;
    getDateDataSeries(): DataSeries;
    canScroll(): boolean;
}
//# sourceMappingURL=DateScale.d.ts.map