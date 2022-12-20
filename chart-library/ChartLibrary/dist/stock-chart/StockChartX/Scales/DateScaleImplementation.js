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
import { DateTimeFormat } from "../Data/DateTimeFormat";
import { DateScaleCalibrator } from "./DateScaleCalibrator";
import { Rect } from "../Graphics/Rect";
import { ChartComponent } from '../Controls/ChartComponent';
import { DateScalePanel } from "./DateScalePanel";
import { Projection } from "./Projection";
import { TimeIntervalDateTimeFormat } from "../Data/TimeIntervalDateTimeFormat";
import { ChartEvent } from "../Chart";
import { DataSeriesSuffix } from "../Data/DataSeries";
import { JsUtil } from "../Utils/JsUtil";
import { AutoDateScaleCalibrator } from "./AutoDateScaleCalibrator";
import { DateScaleScrollKind, DateScaleZoomKind, DateScaleZoomMode } from "./DateScale";
import { BrowserUtils } from '../../../utils';
var Class = {
    TOP_SCALE: "scxTopDateScale",
    BOTTOM_SCALE: "scxBottomDateScale"
};
var MIN_SCROLL_PIXELS = 3;
var MIN_ZOOM_PIXELS = 3;
var EVENT_SUFFIX = '.scxDateScale';
var DateScaleImplementation = (function (_super) {
    __extends(DateScaleImplementation, _super);
    function DateScaleImplementation(config) {
        var _this = _super.call(this, config) || this;
        _this._projectionFrame = new Rect();
        _this._columnWidth = 0;
        _this._formatter = new TimeIntervalDateTimeFormat();
        _this._moreHistoryRequested = false;
        _this._projection = new Projection(_this);
        _this._topPanel = new DateScalePanel({
            dateScale: _this,
            cssClass: Class.TOP_SCALE,
            visible: false
        });
        _this._bottomPanel = new DateScalePanel({
            dateScale: _this,
            cssClass: Class.BOTTOM_SCALE
        });
        _this.loadState(config);
        return _this;
    }
    Object.defineProperty(DateScaleImplementation.prototype, "topPanel", {
        get: function () {
            return this._topPanel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "bottomPanel", {
        get: function () {
            return this._bottomPanel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "zoomed", {
        get: function () {
            return this._zoomed;
        },
        set: function (zoomed) {
            this._zoomed = zoomed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "topPanelCssClass", {
        get: function () {
            return Class.TOP_SCALE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "bottomPanelCssClass", {
        get: function () {
            return Class.BOTTOM_SCALE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "topPanelVisible", {
        get: function () {
            return this._topPanel.visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "bottomPanelVisible", {
        get: function () {
            return this._bottomPanel.visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "projection", {
        get: function () {
            return this._projection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "projectionFrame", {
        get: function () {
            return this._projectionFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "calibrator", {
        get: function () {
            return this._calibrator;
        },
        set: function (value) {
            this._calibrator = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "firstVisibleIndex", {
        get: function () {
            return this._firstVisibleIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "lastVisibleIndex", {
        get: function () {
            return this._lastVisibleIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "firstVisibleRecord", {
        get: function () {
            return this._options.firstVisibleRecord;
        },
        set: function (record) {
            if (!this.allowPartialRecords)
                record = Math.trunc(record);
            var oldValue = this._options.firstVisibleRecord;
            if (oldValue !== record) {
                this._options.firstVisibleRecord = Math.round(record * 100) / 100;
                this._firstVisibleIndex = Math.floor(record);
                this.chart.fireValueChanged(ChartEvent.FIRST_VISIBLE_RECORD_CHANGED, oldValue, record);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "lastVisibleRecord", {
        get: function () {
            return this._options.lastVisibleRecord;
        },
        set: function (value) {
            if (!this.allowPartialRecords)
                value = Math.trunc(value);
            var oldValue = this._options.lastVisibleRecord;
            if (oldValue !== value) {
                this._options.lastVisibleRecord = value;
                this._lastVisibleIndex = Math.ceil(value);
                this.chart.fireValueChanged(ChartEvent.LAST_VISIBLE_RECORD_CHANGED, oldValue, value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "visibleDateRange", {
        get: function () {
            var frame = this.projectionFrame;
            return {
                min: this.projection.dateByX(frame.left),
                max: this.projection.dateByX(frame.right)
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "useManualHeight", {
        get: function () {
            return this._options.useManualHeight;
        },
        set: function (value) {
            this._options.useManualHeight = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "manualHeight", {
        get: function () {
            return this._options.height;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumber(value))
                throw new Error("Height must be a positive number.");
            this._options.height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "minVisibleRecords", {
        get: function () {
            return this._options.minVisibleRecords;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumber(value))
                throw new Error("Records must be a finite number greater than 0.");
            this._options.minVisibleRecords = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "rightAdditionalSpaceRatio", {
        get: function () {
            return this._options.rightAdditionalSpaceRatio;
        },
        set: function (value) {
            if (!JsUtil.isPositiveNumber(value))
                throw new TypeError("Ratio must be a positive number.");
            this._options.rightAdditionalSpaceRatio = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "scrollKind", {
        get: function () {
            return this._options.scrollKind;
        },
        set: function (value) {
            this._options.scrollKind = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "zoomKind", {
        get: function () {
            return this._options.zoomKind;
        },
        set: function (value) {
            this._options.zoomKind = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "zoomMode", {
        get: function () {
            return this._options.zoomMode;
        },
        set: function (value) {
            this._options.zoomMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "actualTheme", {
        get: function () {
            return this.chart.theme.dateScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "columnsCount", {
        get: function () {
            if (this.needsAutoScale())
                return 0;
            return this._options.lastVisibleRecord - this._options.firstVisibleRecord + 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "columnWidth", {
        get: function () {
            return this._columnWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "maxAllowedRecord", {
        get: function () {
            var additionalColumns = (this._projectionFrame.width * this.rightAdditionalSpaceRatio) / this._columnWidth;
            return this.getDateDataSeries().length - 1 + additionalColumns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "majorTickMarkLength", {
        get: function () {
            return this._options.majorTickMarkLength;
        },
        set: function (value) {
            this._options.majorTickMarkLength = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "minorTickMarkLength", {
        get: function () {
            return this._options.minorTickMarkLength;
        },
        set: function (value) {
            this._options.minorTickMarkLength = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "textPadding", {
        get: function () {
            return this._options.textPadding;
        },
        set: function (value) {
            this._options.textPadding = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "allowPartialRecords", {
        get: function () {
            return this._options.allowPartialRecords;
        },
        set: function (value) {
            if (this._options.allowPartialRecords !== value) {
                this._options.allowPartialRecords = value;
                this.firstVisibleRecord = this.firstVisibleRecord;
                this.lastVisibleRecord = this.lastVisibleRecord;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "showGridSessionLines", {
        get: function () {
            return this._options.showGridSessionLines;
        },
        set: function (value) {
            this._options.showGridSessionLines = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateScaleImplementation.prototype, "gridSessionLinesColor", {
        get: function () {
            return "#888";
        },
        enumerable: true,
        configurable: true
    });
    DateScaleImplementation.prototype._subscribeEvents = function () {
        var _this = this;
        this.chart.on(ChartEvent.LOCALE_CHANGED + EVENT_SUFFIX, function (event) {
            _this._formatter.locale = event.value;
        });
    };
    DateScaleImplementation.prototype._unsubscribeEvents = function () {
        this.chart.off(EVENT_SUFFIX);
    };
    DateScaleImplementation.prototype._calculateProjectionMetrics = function () {
        this._columnWidth = this._projectionFrame.width / this.columnsCount;
    };
    DateScaleImplementation.prototype.setNeedsAutoScale = function () {
        this.firstVisibleRecord = null;
        this.lastVisibleRecord = null;
    };
    DateScaleImplementation.prototype.needsAutoScale = function () {
        return this.firstVisibleRecord == null || this.lastVisibleRecord == null;
    };
    DateScaleImplementation.prototype.autoScale = function () {
        var count = this.chart.recordCount;
        this.firstVisibleRecord = count > 0 ? 0 : null;
        this.lastVisibleRecord = count > 0 ? count - 1 : null;
    };
    DateScaleImplementation.prototype.getDateDataSeries = function () {
        return this.chart.primaryDataSeries(DataSeriesSuffix.DATE);
    };
    DateScaleImplementation.prototype.handleEvent = function (event) {
        return this._bottomPanel.handleEvent(event) || this._topPanel.handleEvent(event);
    };
    DateScaleImplementation.prototype.formatDate = function (date) {
        return this._formatter.format(date, this.chart.timeInterval);
    };
    DateScaleImplementation.prototype.scrollOnPixels = function (pixels) {
        if (!isFinite(pixels))
            throw new Error("Finite number expected.");
        if (Math.abs(pixels) < MIN_SCROLL_PIXELS)
            return false;
        var records = Math.abs(pixels) / this.columnWidth;
        if (!this.allowPartialRecords)
            records = Math.ceil(records);
        return this.scrollOnRecords(pixels >= 0 ? records : -records);
    };
    DateScaleImplementation.prototype.canScroll = function () {
        return this.chart.dateScale.firstVisibleRecord !== 0 && this.chart.dateScale._canSetVisibleRecord(this.chart.dateScale.lastVisibleRecord + 1);
    };
    DateScaleImplementation.prototype.scrollOnRecords = function (records) {
        if (records === 0)
            return false;
        var allowPartialRecords = this.allowPartialRecords, oldFirstRecord = this.firstVisibleRecord, oldLastRecord = this.lastVisibleRecord, newFirstRecord = oldFirstRecord - records, newLastRecord = oldLastRecord - records;
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
        if (newFirstRecord == 0 && oldFirstRecord == 0) {
            return false;
        }
        this.firstVisibleRecord = newFirstRecord;
        this.lastVisibleRecord = newLastRecord;
        this.zoomed = true;
        this._requestMoreHistoryIfNeed();
        return true;
    };
    DateScaleImplementation.prototype.zoomOnPixels = function (leftPixels, rightPixels) {
        if (rightPixels == null)
            rightPixels = leftPixels;
        if (!isFinite(leftPixels) || !isFinite(rightPixels))
            throw new Error("Pixels must be a finite number.");
        if (Math.abs(leftPixels) < MIN_ZOOM_PIXELS && Math.abs(rightPixels) < MIN_ZOOM_PIXELS)
            return false;
        var columnWidth = this.columnWidth, allowPartialRecords = this.allowPartialRecords, leftRecords = Math.abs(leftPixels) / columnWidth, rightRecords = Math.abs(rightPixels) / columnWidth;
        if (!allowPartialRecords) {
            leftRecords = Math.ceil(leftRecords);
            rightRecords = Math.ceil(rightRecords);
        }
        return this.zoomOnRecords(leftPixels > 0 ? leftRecords : -leftRecords, rightPixels > 0 ? rightRecords : -rightRecords);
    };
    DateScaleImplementation.prototype.zoomOnRecords = function (leftRecords, rightRecords) {
        if (rightRecords == null)
            rightRecords = leftRecords;
        if (leftRecords === 0 && rightRecords === 0)
            return false;
        var allowPartialRecords = this.allowPartialRecords, oldFirstRecord = this.firstVisibleRecord, oldLastRecord = this.lastVisibleRecord, newFirstRecord = oldFirstRecord + leftRecords, newLastRecord = oldLastRecord - rightRecords;
        if (!allowPartialRecords) {
            newFirstRecord = Math.round(newFirstRecord);
            newLastRecord = Math.round(newLastRecord);
        }
        if (newFirstRecord > newLastRecord)
            newFirstRecord = newLastRecord = Math.max(newLastRecord, oldLastRecord);
        if (!this._canSetVisibleRecord(newFirstRecord))
            newFirstRecord = 0;
        if (!this._canSetVisibleRecord(newLastRecord))
            newLastRecord = this.maxAllowedRecord;
        var isChanged = newFirstRecord !== oldFirstRecord || newLastRecord !== oldLastRecord;
        if (isChanged) {
            var oldVisibleRecords = oldLastRecord - oldFirstRecord + 1, newVisibleRecords = newLastRecord - newFirstRecord + 1;
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
    };
    DateScaleImplementation.prototype._handleZoom = function (pixels) {
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
        var needsAutoscale = false;
        if (this.zoomKind === DateScaleZoomKind.AUTOSCALED)
            needsAutoscale = true;
        this.chart.setNeedsUpdate(needsAutoscale);
    };
    DateScaleImplementation.prototype._requestMoreHistoryIfNeed = function () {
        var chart = this.chart;
        if (chart.firstVisibleIndex > 0)
            this._moreHistoryRequested = false;
        else if (!this._moreHistoryRequested) {
            chart.fireValueChanged(ChartEvent.MORE_HISTORY_REQUESTED);
            this._moreHistoryRequested = true;
        }
    };
    DateScaleImplementation.prototype.saveState = function () {
        var state = JsUtil.clone(this._options);
        state.formatter = this._formatter.saveState();
        state.calibrator = this._calibrator.saveState();
        return state;
    };
    DateScaleImplementation.prototype.loadState = function (stateOrConfig) {
        stateOrConfig = stateOrConfig || {};
        var state = stateOrConfig;
        this._options = {};
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
    };
    DateScaleImplementation.prototype._canSetVisibleRecord = function (record) {
        return record >= 0 && record <= this.maxAllowedRecord;
    };
    DateScaleImplementation.prototype.layoutScalePanel = function (chartFrame) {
        if (this.needsAutoScale())
            this.autoScale();
        var topFrame = this._topPanel.layoutPanel(chartFrame, true);
        var bottomFrame = this._bottomPanel.layoutPanel(chartFrame, false);
        var remainingFrame = chartFrame.clone();
        if (topFrame)
            remainingFrame.cropTop(topFrame);
        if (bottomFrame)
            remainingFrame.cropBottom(bottomFrame);
        return remainingFrame;
    };
    DateScaleImplementation.prototype.layout = function (frame, projectionFrame) {
        if (this.needsAutoScale())
            this.autoScale();
        this._projectionFrame.copyFrom(projectionFrame);
        this._projectionFrame.applyPadding(this.chart.chartPanelsContainer.panelPadding);
        this._calculateProjectionMetrics();
        this._calibrator.calibrate(this);
        this._topPanel.layout(frame, true);
        this._bottomPanel.layout(frame, false);
    };
    DateScaleImplementation.prototype._canvasStartX = function () {
        return this._projectionFrame.left - this.chart.chartPanelsFrame.left - this.chart.chartPanelsContainer.panelPadding.left;
    };
    DateScaleImplementation.prototype._textDrawBounds = function () {
        return {
            left: this.textPadding.left,
            top: null,
            width: this.chart.chartPanelsContainer.frame.width,
            height: null
        };
    };
    DateScaleImplementation.prototype.draw = function () {
        this._topPanel.draw();
        this._bottomPanel.draw();
    };
    return DateScaleImplementation;
}(ChartComponent));
export { DateScaleImplementation };
//# sourceMappingURL=DateScaleImplementation.js.map