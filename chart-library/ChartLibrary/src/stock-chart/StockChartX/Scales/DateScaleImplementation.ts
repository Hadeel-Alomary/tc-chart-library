import {DateTimeFormat, IDateTimeFormat, IDateTimeFormatState} from "../Data/DateTimeFormat";
import {DateScaleCalibrator, IDateScaleCalibrator, IDateScaleCalibratorState} from "./DateScaleCalibrator";
import {IPadding, IRect, Rect} from "../Graphics/Rect";
import {ChartComponent, IChartComponentConfig} from '../Controls/ChartComponent';
import {DateScalePanel} from "./DateScalePanel";
import {Projection} from "./Projection";
import {TimeIntervalDateTimeFormat} from "../Data/TimeIntervalDateTimeFormat";
import {Chart, ChartEvent} from "../Chart";
import {DataSeries, DataSeriesSuffix, IMinMaxValues} from "../Data/DataSeries";
import {JsUtil} from "../Utils/JsUtil";
import {IValueChangedEvent} from "../Utils/EventableObject";
import {WindowEvent} from "../Gestures/Gesture";
import {AutoDateScaleCalibrator} from "./AutoDateScaleCalibrator";
import {DateScale, DateScaleScrollKind, DateScaleZoomKind, DateScaleZoomMode, IDateScaleState} from "./DateScale";
import {BrowserUtils, Tc} from '../../../utils';

const Class = {
    TOP_SCALE: "scxTopDateScale",
    BOTTOM_SCALE: "scxBottomDateScale"
};

const MIN_SCROLL_PIXELS = 3;
const MIN_ZOOM_PIXELS = 3;
const EVENT_SUFFIX = '.scxDateScale';

/**
 * Represents date scale on the chart.
 * @param {Object} config The configuration object.
 * @param {Chart} config.chart The parent chart.
 * @param {Number} [config.firstVisibleRecord] The first visible record.
 * @param {Number} [config.lastVisibleRecord] The last visible record.
 * @param {Number} [config.minVisibleRecords] The minimum visible records count.
 * @param {Boolean} [config.useManualHeight] The flag that indicates if manual height value should be used. Otherwise height is calculated automatically.
 * @param {Number} [config.height] The manual panel height.
 * @param {Number} [config.theme] The theme.
 * @constructor DateScale
 * @augments ChartComponent
 */
export class DateScaleImplementation extends ChartComponent implements DateScale{
    private _topPanel: DateScalePanel;
    /**
     * The top date scale panel.
     * @name topPanel
     * @type {DateScalePanel}
     * @readonly
     * @memberOf DateScale#
     */
    get topPanel(): DateScalePanel {
        return this._topPanel;
    }

    private _bottomPanel: DateScalePanel;
    /**
     * The bottom date scale panel.
     * @name bottomPanel
     * @type {DateScalePanel}
     * @readonly
     * @memberOf DateScale#
     */
    get bottomPanel(): DateScalePanel {
        return this._bottomPanel;
    }

    // maintain the zoomed state for the chart
    private _zoomed: boolean;
    get zoomed(): boolean {
        return this._zoomed;
    }

    set zoomed(zoomed: boolean) {
        this._zoomed = zoomed;
    }


    // noinspection JSMethodCanBeStatic
    /**
     * Gets CSS class name of top date scale root div element.
     * @name topPanelCssClass
     * @type {string}
     * @readonly
     * @memberOf DateScale#
     */
    get topPanelCssClass(): string {
        return Class.TOP_SCALE;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Gets CSS class name of bottom date scale root div element.
     * @name bottomPanelCssClass
     * @type {string}
     * @readonly
     * @memberOf DateScale#
     */
    get bottomPanelCssClass(): string {
        return Class.BOTTOM_SCALE;
    }

    get topPanelVisible(): boolean {
        return this._topPanel.visible;
    }

    get bottomPanelVisible(): boolean {
        return this._bottomPanel.visible;
    }

    private _projection: Projection;
    /**
     * Gets projection object to convert coordinates.
     * @name projection
     * @type {Projection}
     * @readonly
     * @memberOf DateScale#
     */
    get projection(): Projection {
        return this._projection;
    }

    /**
     * The projection frame rectangle.
     * @name projectionFrame
     * @type {Rect}
     * @readonly
     * @memberOf DateScale#
     * @private
     */
    private _projectionFrame: Rect = new Rect();
    get projectionFrame(): Rect {
        return this._projectionFrame;
    }

    /**
     * The column width.
     * @type {number}
     * @private
     */
    private _columnWidth: number = 0;

    private _calibrator: IDateScaleCalibrator;
    get calibrator(): IDateScaleCalibrator {
        return this._calibrator;
    }

    set calibrator(value: IDateScaleCalibrator) {
        this._calibrator = value;
    }

    /**
     * The date & time formatter..
     * @type {DateTimeFormat}
     * @private
     */
    private _formatter: IDateTimeFormat = new TimeIntervalDateTimeFormat();

    /**
     * The date scale options.
     * @type {Object}
     * @private
     */
    private _options: IDateScaleState;

    private _firstVisibleIndex: number;
    /**
     * The index of first visible record (it's integral value unlike firstVisibleRecord).
     * @name firstVisibleIndex
     * @type {number}
     * @readonly
     * @memberOf DateScale#
     */
    get firstVisibleIndex(): number {
        return this._firstVisibleIndex;
    }

    private _lastVisibleIndex: number;
    /**
     * The index of last visible record (it's integral value unlike lastVisibleRecord).
     * @type {number}
     * @readonly
     * @memberOf DateScale#
     */
    get lastVisibleIndex(): number {
        return this._lastVisibleIndex;
    }

    /**
     * Gets/Sets first visible record.
     * @name firstVisibleRecord
     * @type {number}
     * @memberOf DateScale#
     */
    get firstVisibleRecord(): number {
        return this._options.firstVisibleRecord;
    }

    set firstVisibleRecord(record: number) {
        if (!this.allowPartialRecords)
            record = Math.trunc(record);

        let oldValue = this._options.firstVisibleRecord;
        if (oldValue !== record) {
            this._options.firstVisibleRecord = Math.round(record * 100) / 100;
            this._firstVisibleIndex = Math.floor(record);
            this.chart.fireValueChanged(ChartEvent.FIRST_VISIBLE_RECORD_CHANGED, oldValue, record);
        }
    }

    /**
     * Gets/Sets last visible record.
     * @name lastVisibleRecord
     * @type {number}
     * @memberOf DateScale#
     */
    get lastVisibleRecord(): number {
        return this._options.lastVisibleRecord;
    }

    set lastVisibleRecord(value: number) {
        if (!this.allowPartialRecords)
            value = Math.trunc(value);

        let oldValue = this._options.lastVisibleRecord;
        if (oldValue !== value) {
            this._options.lastVisibleRecord = value;
            this._lastVisibleIndex = Math.ceil(value);
            this.chart.fireValueChanged(ChartEvent.LAST_VISIBLE_RECORD_CHANGED, oldValue, value);
        }
    }

    get visibleDateRange(): IMinMaxValues<Date> {
        let frame = this.projectionFrame;

        return {
            min: this.projection.dateByX(frame.left),
            max: this.projection.dateByX(frame.right)
        };
    }

    /**
     * Gets/Sets the flag that indicate whether manual height should be used.
     * @name useManualHeight
     * @type {boolean}
     * @memberOf DateScale#
     */
    get useManualHeight(): boolean {
        return this._options.useManualHeight;
    }

    set useManualHeight(value: boolean) {
        this._options.useManualHeight = !!value;
    }

    /**
     * Gets/Sets manual height of date scale.
     * @name manualHeight
     * @type {Number}
     * @memberOf DateScale#
     */
    get manualHeight(): number {
        return this._options.height;
    }

    set manualHeight(value: number) {
        if (!JsUtil.isPositiveNumber(value))
            throw new Error("Height must be a positive number.");

        this._options.height = value;
    }

    /**
     * Gets/Sets minimum number of visible records.
     * @name minVisibleRecords
     * @type {Number}
     * @memberOf DateScale#
     */
    get minVisibleRecords(): number {
        return this._options.minVisibleRecords;
    }

    set minVisibleRecords(value: number) {
        if (!JsUtil.isPositiveNumber(value))
            throw new Error("Records must be a finite number greater than 0.");

        this._options.minVisibleRecords = value;
    }

    get rightAdditionalSpaceRatio(): number {
        return this._options.rightAdditionalSpaceRatio;
    }

    set rightAdditionalSpaceRatio(value: number) {
        if (!JsUtil.isPositiveNumber(value))
            throw new TypeError("Ratio must be a positive number.");

        this._options.rightAdditionalSpaceRatio = value;
    }

    /**
     * Gets/Sets scroll kind.
     * @name scrollKind
     * @type {DateScaleScrollKind}
     * @memberOf DateScale#
     */
    get scrollKind(): string {
        return this._options.scrollKind;
    }

    set scrollKind(value: string) {
        this._options.scrollKind = value;
    }

    /**
     * Gets/Sets zoom kind.
     * @name zoomKind
     * @type {DateScaleZoomKind}
     * @default {@linkcode DateScaleZoomKind.AUTOSCALED}
     * @memberOf DateScale#
     */
    get zoomKind(): string {
        return this._options.zoomKind;
    }

    set zoomKind(value: string) {
        this._options.zoomKind = value;
    }

    /**
     * Gets/Sets zoom mode.
     * @name zoomMode
     * @type {DateScaleZoomMode}
     * @default {@linkcode DateScaleZoomMode.PIN_CENTER}
     * @memberOf DateScale#
     */
    get zoomMode(): string {
        return this._options.zoomMode;
    }

    set zoomMode(value: string) {
        this._options.zoomMode = value;
    }

    /**
     * Returns actual theme.
     * @name getActualTheme
     * @type {object}
     * @memberOf DateScale#
     */
    get actualTheme() {
        return this.chart.theme.dateScale;
    }

    /**
     * Gets number of columns in the chart.
     * @name columnsCount
     * @type {number}
     * @readonly
     * @memberOf DateScale#
     */
    get columnsCount(): number {
        if (this.needsAutoScale())
            return 0;

        return this._options.lastVisibleRecord - this._options.firstVisibleRecord + 1;
    }

    /**
     * Get column width.
     * @name columnWidth
     * @type {number}
     * @readonly
     * @memberOf DateScale#
     */
    get columnWidth(): number {
        return this._columnWidth;
    }

    /**
     * Gets maximum allowed record number that can be set.
     * @name maxAllowedRecord
     * @type {Number}
     * @readonly
     * @memberOf DateScale#
     */
    get maxAllowedRecord(): number {
        let additionalColumns = (this._projectionFrame.width * this.rightAdditionalSpaceRatio) / this._columnWidth;
        return this.getDateDataSeries().length - 1 + additionalColumns;
    }

    get majorTickMarkLength(): number {
        return this._options.majorTickMarkLength;
    }

    set majorTickMarkLength(value: number) {
        this._options.majorTickMarkLength = value;
    }

    get minorTickMarkLength(): number {
        return this._options.minorTickMarkLength;
    }

    set minorTickMarkLength(value: number) {
        this._options.minorTickMarkLength = value;
    }

    get textPadding(): IPadding {
        return this._options.textPadding;
    }

    set textPadding(value: IPadding) {
        this._options.textPadding = value;
    }

    get allowPartialRecords(): boolean {
        return this._options.allowPartialRecords;
    }

    set allowPartialRecords(value: boolean) {
        if (this._options.allowPartialRecords !== value) {
            this._options.allowPartialRecords = value;
            this.firstVisibleRecord = this.firstVisibleRecord;
            this.lastVisibleRecord = this.lastVisibleRecord;
        }
    }

    get showGridSessionLines(): boolean {
        return this._options.showGridSessionLines;
    }

    set showGridSessionLines(value: boolean) {
        this._options.showGridSessionLines = value;
    }

    get gridSessionLinesColor(): string {
        return "#888";
    }

    private _moreHistoryRequested: boolean = false;

    constructor(config: IChartComponentConfig) {
        super(config);

        this._projection = new Projection(this);

        this._topPanel = new DateScalePanel({
            dateScale: this,
            cssClass: Class.TOP_SCALE,
            visible: false
        });
        this._bottomPanel = new DateScalePanel({
            dateScale: this,
            cssClass: Class.BOTTOM_SCALE
        });

        this.loadState(config);
    }

    protected _subscribeEvents() {
        this.chart.on(ChartEvent.LOCALE_CHANGED + EVENT_SUFFIX, (event: IValueChangedEvent) => {
            this._formatter.locale = event.value as string;
        });
    }

    protected _unsubscribeEvents() {
        this.chart.off(EVENT_SUFFIX);
    }

    _calculateProjectionMetrics() {
        this._columnWidth = this._projectionFrame.width / this.columnsCount;
    }

    /**
     * Marks that scale needs to be auto-scaled on next layout.
     * @method setNeedsAutoScale
     * @memberOf DateScale#
     */
    setNeedsAutoScale() {
        this.firstVisibleRecord = null;
        this.lastVisibleRecord = null;
    }

    /**
     * Determines if auto-scaling is needed.
     * @method needsAutoScale
     * @returns {boolean}
     * @memberOf DateScale#
     */
    needsAutoScale(): boolean {
        return this.firstVisibleRecord == null || this.lastVisibleRecord == null;
    }

    /**
     * Auto-scales date scale to show all records.
     * @method autoScale
     * @memberOf DateScale#
     */
    autoScale() {
        let count = this.chart.recordCount;

        this.firstVisibleRecord = count > 0 ? 0 : null;
        this.lastVisibleRecord = count > 0 ? count - 1 : null;
    }

    /**
     * Returns date data series.
     * @method getDateDataSeries
     * @returns {DataSeries}
     * @memberOf DateScale#
     */
    getDateDataSeries(): DataSeries {
        return this.chart.primaryDataSeries(DataSeriesSuffix.DATE);
    }

    handleEvent(event: WindowEvent): boolean {
        return this._bottomPanel.handleEvent(event) || this._topPanel.handleEvent(event);
    }

    /**
     * Returns string representation of a given date according to the chart's time interval.
     * @method formatDate
     * @param {Date} date The date.
     * @returns {string}
     * @memberOf DateScale#
     */
    formatDate(date: Date): string {
        return this._formatter.format(date, this.chart.timeInterval);
    }

    /**
     * Scrolls date scale on a given number of pixels.
     * @method scrollOnPixels
     * @param {number} pixels The number of pixels to scroll.
     * @returns {boolean} True if scroll was performed, false otherwise.
     * @memberOf DateScale#
     */
    scrollOnPixels(pixels: number): boolean {
        if (!isFinite(pixels))
            throw new Error("Finite number expected.");
        if (Math.abs(pixels) < MIN_SCROLL_PIXELS)
            return false;

        let records = Math.abs(pixels) / this.columnWidth;
        if (!this.allowPartialRecords)
            records = Math.ceil(records);

        return this.scrollOnRecords(pixels >= 0 ? records : -records);
    }

    canScroll():boolean {
        return this.chart.dateScale.firstVisibleRecord !== 0 && this.chart.dateScale._canSetVisibleRecord(this.chart.dateScale.lastVisibleRecord + 1);
    }

    /**
     * Scrolls date scale on a given number of records.
     * @method scrollOnRecords
     * @param {Number} records The number of records to scroll.
     * @returns {boolean} True if scroll was performed, false otherwise.
     * @memberOf DateScale#
     */
    scrollOnRecords(records: number): boolean {
        if (records === 0)
            return false;

        let allowPartialRecords = this.allowPartialRecords,
            oldFirstRecord = this.firstVisibleRecord,
            oldLastRecord = this.lastVisibleRecord,
            newFirstRecord = oldFirstRecord - records,
            newLastRecord = oldLastRecord - records;
        if (!allowPartialRecords) {
            newFirstRecord = Math.round(newFirstRecord);
            newLastRecord = Math.round(newLastRecord);
        }

        if (!this._canSetVisibleRecord(newFirstRecord) || !this._canSetVisibleRecord(newLastRecord)) {
            if (newFirstRecord >= 0)
                return false;

            newFirstRecord = 0;
            newLastRecord = oldLastRecord - oldFirstRecord;
            if (!this._canSetVisibleRecord(newFirstRecord) || !this._canSetVisibleRecord(newLastRecord))
                return false;
        }

        if(newFirstRecord == 0 && oldFirstRecord == 0) {
            return false;
        }

        this.firstVisibleRecord = newFirstRecord;
        this.lastVisibleRecord = newLastRecord;
        this.zoomed = true;

        this._requestMoreHistoryIfNeed();

        return true;
    }

    /**
     * Zooms date scale on a given number of pixels.
     * @method zoomOnPixels
     * @param {Number} leftPixels The number of pixels to zoom from the left side.
     * @param {Number} [rightPixels] The number of pixels to zoom from the right side.
     * @returns {Boolean} True if zoom was performed, false otherwise.
     * @memberOf DateScale#
     */
    zoomOnPixels(leftPixels: number, rightPixels?: number) {
        if (rightPixels == null)
            rightPixels = leftPixels;

        if (!isFinite(leftPixels) || !isFinite(rightPixels))
            throw new Error("Pixels must be a finite number.");
        if (Math.abs(leftPixels) < MIN_ZOOM_PIXELS && Math.abs(rightPixels) < MIN_ZOOM_PIXELS)
            return false;

        let columnWidth = this.columnWidth,
            allowPartialRecords = this.allowPartialRecords,
            leftRecords = Math.abs(leftPixels) / columnWidth,
            rightRecords = Math.abs(rightPixels) / columnWidth;
        if (!allowPartialRecords) {
            leftRecords = Math.ceil(leftRecords);
            rightRecords = Math.ceil(rightRecords);
        }

        return this.zoomOnRecords(leftPixels > 0 ? leftRecords : -leftRecords, rightPixels > 0 ? rightRecords : -rightRecords);
    }

    /**
     * Zooms date scale on a given number of records.
     * @method zoomOnRecords
     * @param {Number} leftRecords Number of records to zoom from the left side.
     * @param {Number} [rightRecords] Number of records to zoom from the right side.
     * @returns {boolean} True if zoom was performed, false otherwise.
     * @memberOf DateScale#
     */
    zoomOnRecords(leftRecords: number, rightRecords?: number) {
        if (rightRecords == null)
            rightRecords = leftRecords;

        if (leftRecords === 0 && rightRecords === 0)
            return false;

        let allowPartialRecords = this.allowPartialRecords,
            oldFirstRecord = this.firstVisibleRecord,
            oldLastRecord = this.lastVisibleRecord,
            newFirstRecord = oldFirstRecord + leftRecords,
            newLastRecord = oldLastRecord - rightRecords;
        if (!allowPartialRecords) {
            newFirstRecord = Math.round(newFirstRecord);
            newLastRecord = Math.round(newLastRecord);
        }

        if (newFirstRecord > newLastRecord)
            newFirstRecord = newLastRecord = Math.max(newLastRecord, oldLastRecord);

        if (!this._canSetVisibleRecord(newFirstRecord))
            newFirstRecord = 0; // this.getMinAllowedRecord();
        if (!this._canSetVisibleRecord(newLastRecord))
            newLastRecord = this.maxAllowedRecord;

        let isChanged = newFirstRecord !== oldFirstRecord || newLastRecord !== oldLastRecord;
        if (isChanged) {
            let oldVisibleRecords = oldLastRecord - oldFirstRecord + 1,
                newVisibleRecords = newLastRecord - newFirstRecord + 1;
            if (newVisibleRecords < oldVisibleRecords && newVisibleRecords < this.minVisibleRecords)
                return false;

            if (newFirstRecord >= this.getDateDataSeries().length)
                return false;

            this.zoomed = true;
            this.firstVisibleRecord = newFirstRecord;
            this.lastVisibleRecord = newLastRecord;

            this._requestMoreHistoryIfNeed();
        }

        return isChanged;
    }

    _handleZoom(pixels: number) {
        switch (this.zoomMode) {
            case DateScaleZoomMode.PIN_CENTER:
                this.zoomOnPixels(pixels);
                break;
            case DateScaleZoomMode.PIN_LEFT:
                this.zoomOnPixels(0, pixels);
                break;
            case DateScaleZoomMode.PIN_RIGHT:
                this.zoomOnPixels(pixels, 0);
                break;
            default:
                throw new Error("Unknown zoom mode: " + this.zoomMode);
        }

        let needsAutoscale = false;
        if (this.zoomKind === DateScaleZoomKind.AUTOSCALED)
            needsAutoscale = true;
        this.chart.setNeedsUpdate(needsAutoscale);
    }

    private _requestMoreHistoryIfNeed() {
        let chart = this.chart;
        if (chart.firstVisibleIndex > 0)
            this._moreHistoryRequested = false;
        else if (!this._moreHistoryRequested) {
            chart.fireValueChanged(ChartEvent.MORE_HISTORY_REQUESTED);
            this._moreHistoryRequested = true;
        }
    }

    /**
     * @inheritdoc
     */
    saveState(): IDateScaleState {
        let state = <IDateScaleState> JsUtil.clone(this._options);
        state.formatter = <IDateTimeFormatState> this._formatter.saveState();
        state.calibrator = <IDateScaleCalibratorState> this._calibrator.saveState();

        return state;
    }

    /**
     * @inheritdoc
     */
    loadState(stateOrConfig: IDateScaleState | IChartComponentConfig) {
        stateOrConfig = stateOrConfig || <IDateScaleState> {};
        let state = stateOrConfig as IDateScaleState;

        this._options = <IDateScaleState>{};

        this.firstVisibleRecord = state.firstVisibleRecord != null ? state.firstVisibleRecord : null;
        this.lastVisibleRecord = state.lastVisibleRecord != null ? state.lastVisibleRecord : null;
        this.minVisibleRecords = state.minVisibleRecords || 5;
        this.textPadding = state.textPadding || {
            left: 3,
            top: null,
            right: 3,
            bottom: 3
        };
        this.manualHeight = state.height || 15;
        this.useManualHeight = state.useManualHeight != null ? state.useManualHeight : false;
        this.scrollKind = state.scrollKind || DateScaleScrollKind.AUTOSCALED;
        this.zoomKind = state.zoomKind || DateScaleZoomKind.AUTOSCALED;
        //HA : state.zoomMode is pin_center in mobile , the previous condition will always return true and apply DateScaleZoomMode.PIN_RIGHT .
        this.zoomMode = BrowserUtils.isDesktop() ? state.zoomMode ? state.zoomMode : DateScaleZoomMode.PIN_RIGHT : DateScaleZoomMode.PIN_CENTER;
        this.rightAdditionalSpaceRatio = state.rightAdditionalSpaceRatio || 0.9;
        if (state.formatter)
            this._formatter = DateTimeFormat.deserialize(state.formatter);
        this._formatter.locale = this.chart.locale;
        this.majorTickMarkLength = state.majorTickMarkLength || 5;
        this.minorTickMarkLength = state.minorTickMarkLength || 3;
        this.allowPartialRecords = state.allowPartialRecords != null ? !!state.allowPartialRecords : true;
        this.showGridSessionLines = state.showGridSessionLines != undefined ? state.showGridSessionLines : true;
        if (state.calibrator)
            this._calibrator = DateScaleCalibrator.deserialize(state.calibrator);
        else
            this._calibrator = new AutoDateScaleCalibrator();
    }

    // MA typescript compile - make it public
    public _canSetVisibleRecord(record: number) {
        return record >= 0 && record <= this.maxAllowedRecord;
    }

    /**
     * Layouts scale container only.
     * @method layoutScalePanel
     * @param {Rect} chartFrame The chart frame rectangle.
     * @memberOf DateScale#
     */
    layoutScalePanel(chartFrame: Rect) {
        if (this.needsAutoScale())
            this.autoScale();

        let topFrame = this._topPanel.layoutPanel(chartFrame, true);
        let bottomFrame = this._bottomPanel.layoutPanel(chartFrame, false);

        let remainingFrame = chartFrame.clone();
        if (topFrame)
            remainingFrame.cropTop(topFrame);
        if (bottomFrame)
            remainingFrame.cropBottom(bottomFrame);

        return remainingFrame;
    }

    /**
     * Layouts date scale elements.
     * @method layout
     * @param {Rect} frame The frame rectangle.
     * @param {Rect} projectionFrame The projection frame rectangle.
     * @memberOf DateScale#
     */
    layout(frame: Rect, projectionFrame: Rect) {
        if (this.needsAutoScale())
            this.autoScale();

        this._projectionFrame.copyFrom(projectionFrame);
        this._projectionFrame.applyPadding(this.chart.chartPanelsContainer.panelPadding);
        this._calculateProjectionMetrics();

        this._calibrator.calibrate(this);

        this._topPanel.layout(frame, true);
        this._bottomPanel.layout(frame, false);
    }

    public _canvasStartX(): number {
        return this._projectionFrame.left - this.chart.chartPanelsFrame.left - this.chart.chartPanelsContainer.panelPadding.left;
    }

    _textDrawBounds(): IRect {
        return {
            left: this.textPadding.left,
            top: null,
            width: this.chart.chartPanelsContainer.frame.width,
            height: null
        };
    }

    /**
     * @inheritdoc
     */
    draw() {
        this._topPanel.draw();
        this._bottomPanel.draw();
    }
}
