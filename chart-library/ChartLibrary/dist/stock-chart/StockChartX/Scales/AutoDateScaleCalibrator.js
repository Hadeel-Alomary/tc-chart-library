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
import { DateScaleCalibrator } from './DateScaleCalibrator';
import { JsUtil } from "../Utils/JsUtil";
import { TimeIntervalDateTimeFormat } from "../Data/TimeIntervalDateTimeFormat";
import { DummyCanvasContext } from "../Utils/DummyCanvasContext";
import { TimeSpan } from "../Data/TimeFrame";
export var TickType;
(function (TickType) {
    TickType[TickType["ThreeYears"] = 1] = "ThreeYears";
    TickType[TickType["TwoYears"] = 2] = "TwoYears";
    TickType[TickType["OneYear"] = 3] = "OneYear";
    TickType[TickType["SixMonths"] = 4] = "SixMonths";
    TickType[TickType["FourMonths"] = 5] = "FourMonths";
    TickType[TickType["ThreeMonths"] = 6] = "ThreeMonths";
    TickType[TickType["OneMonth"] = 7] = "OneMonth";
    TickType[TickType["FifteenDays"] = 8] = "FifteenDays";
    TickType[TickType["TenDays"] = 9] = "TenDays";
    TickType[TickType["FiveDays"] = 10] = "FiveDays";
    TickType[TickType["OneDay"] = 11] = "OneDay";
    TickType[TickType["HalfTradingDay"] = 12] = "HalfTradingDay";
    TickType[TickType["OneHour"] = 13] = "OneHour";
    TickType[TickType["ThirteenMinutes"] = 14] = "ThirteenMinutes";
    TickType[TickType["FifteenMinutes"] = 15] = "FifteenMinutes";
    TickType[TickType["TenMinutes"] = 16] = "TenMinutes";
    TickType[TickType["FiveMinutes"] = 17] = "FiveMinutes";
    TickType[TickType["OneMinute"] = 18] = "OneMinute";
})(TickType || (TickType = {}));
var AutoDateScaleCalibrator = (function (_super) {
    __extends(AutoDateScaleCalibrator, _super);
    function AutoDateScaleCalibrator(config) {
        var _this = _super.call(this, config) || this;
        _this._formatter = new TimeIntervalDateTimeFormat();
        return _this;
    }
    Object.defineProperty(AutoDateScaleCalibrator, "className", {
        get: function () {
            return 'StockChartX.AutoDateScaleCalibrator';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoDateScaleCalibrator.prototype, "minLabelsOffset", {
        get: function () {
            var majorTicks = this._options.majorTicks;
            return majorTicks && majorTicks.minOffset != null
                ? majorTicks.minOffset
                : AutoDateScaleCalibrator.defaults.majorTicks.minOffset;
        },
        set: function (value) {
            if (value != null && JsUtil.isNegativeNumber(value))
                throw new Error("Min labels offset must be greater or equal to 0.");
            var options = this._options;
            (options.majorTicks || (options.majorTicks = {})).minOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoDateScaleCalibrator.prototype, "minorTicksCount", {
        get: function () {
            var minorTicks = this._options.minorTicks;
            return minorTicks && minorTicks.count != null
                ? minorTicks.count
                : AutoDateScaleCalibrator.defaults.minorTicks.count;
        },
        set: function (value) {
            if (value != null && JsUtil.isNegativeNumber(value))
                throw new Error('Ticks count must be a positive number or 0.');
            var options = this._options;
            (options.minorTicks || (options.minorTicks = {})).count = value;
        },
        enumerable: true,
        configurable: true
    });
    AutoDateScaleCalibrator.prototype.calibrate = function (dateScale) {
        _super.prototype.calibrate.call(this, dateScale);
        this._calibrateMajorTicks(dateScale);
        this._calibrateMinorTicks(this.minorTicksCount);
    };
    AutoDateScaleCalibrator.prototype._calibrateMajorTicks = function (dateScale) {
        var chart = dateScale.chart, projection = dateScale.projection, textDrawBounds = dateScale._textDrawBounds(), minTextX = textDrawBounds.left, maxTextX = textDrawBounds.left + textDrawBounds.width, dummyContext = DummyCanvasContext;
        this._formatter.timeInterval = chart.timeInterval;
        this._formatter.locale = chart.locale;
        dummyContext.applyTextTheme(dateScale.actualTheme.text);
        if (!dateScale || !dateScale.getDateDataSeries().values || dateScale.getDateDataSeries().values.length == 0) {
            return;
        }
        var dates = dateScale.getDateDataSeries().values;
        var visibleDates = dates.filter(function (date) { return dateScale.projectionFrame.left < dateScale.projection.xByDate(date) - (dateScale.columnWidth / 2) && dateScale.projection.xByDate(date) + (dateScale.columnWidth / 2) < dateScale.projectionFrame.right; });
        if (visibleDates.length == 0) {
            return;
        }
        var charWidth = dummyContext.textWidth('9');
        var textWidth = 11 * charWidth;
        var scaleWidth = projection.xByDate(visibleDates[visibleDates.length - 1]) - projection.xByDate(visibleDates[0]);
        if (scaleWidth <= textWidth) {
            return;
        }
        var ticksCount = Math.floor(scaleWidth / (textWidth + this.minLabelsOffset));
        var marketTradingMinutesCount = this.getMarketTradingMinutesCount(dateScale);
        var timeRangeAsMinutes = this.getTimeRangeAsMinutes(visibleDates, marketTradingMinutesCount);
        var tickType = this.getTickType(marketTradingMinutesCount, timeRangeAsMinutes / ticksCount);
        var prevDate = visibleDates[0];
        for (var _i = 0, visibleDates_1 = visibleDates; _i < visibleDates_1.length; _i++) {
            var date = visibleDates_1[_i];
            if (!this.passTickTypeCondition(tickType, prevDate, date, marketTradingMinutesCount)) {
                continue;
            }
            var x = projection.xByDate(date);
            var textStartX = x - (textWidth / 2);
            var textX = x;
            var textAlign = "center";
            if (textStartX < minTextX) {
                textAlign = "left";
                textStartX = minTextX;
                textX = minTextX;
            }
            else if (maxTextX < textStartX + textWidth) {
                textAlign = "right";
                textStartX = maxTextX - textWidth;
                textX = maxTextX;
            }
            this.majorTicks.push({
                x: x,
                textX: textX,
                textAlign: textAlign,
                date: date,
                text: this.getFormattedDateAsString(tickType, prevDate, date),
                major: this.isMajorTick(tickType, prevDate, date)
            });
            prevDate = date;
        }
        this.removeOverlappingTicks(charWidth);
        this.addFirstTickIfNeeded(visibleDates, tickType, projection, minTextX);
    };
    AutoDateScaleCalibrator.prototype.getTimeRangeAsMinutes = function (visibleDates, marketTradingMinutesCount) {
        var interval = 0;
        if (TimeSpan.MILLISECONDS_IN_YEAR <= this._formatter.timeInterval) {
            interval = marketTradingMinutesCount * 30 * 12;
        }
        else if (TimeSpan.MILLISECONDS_IN_MONTH * 3 <= this._formatter.timeInterval) {
            interval = marketTradingMinutesCount * 30 * 3;
        }
        else if (TimeSpan.MILLISECONDS_IN_MONTH <= this._formatter.timeInterval) {
            interval = marketTradingMinutesCount * 30;
        }
        else if (TimeSpan.MILLISECONDS_IN_WEEK <= this._formatter.timeInterval) {
            interval = marketTradingMinutesCount * 7;
        }
        else if (TimeSpan.MILLISECONDS_IN_DAY <= this._formatter.timeInterval) {
            interval = marketTradingMinutesCount;
        }
        else if (TimeSpan.MILLISECONDS_IN_HOUR <= this._formatter.timeInterval) {
            interval = 60;
        }
        else {
            interval = this._formatter.timeInterval / TimeSpan.MILLISECONDS_IN_MINUTE;
        }
        return interval * visibleDates.length;
    };
    AutoDateScaleCalibrator.prototype.getTickType = function (marketTradingMinutesCount, tickDurationInMinutes) {
        var tickType;
        var dayAsMinutes = marketTradingMinutesCount;
        var monthAsMinutes = 30 * dayAsMinutes;
        var yearAsMinutes = 12 * monthAsMinutes;
        if (0 < Math.round(tickDurationInMinutes / (yearAsMinutes * 3))) {
            tickType = TickType.ThreeYears;
        }
        else if (0 < Math.round(tickDurationInMinutes / (yearAsMinutes * 2))) {
            tickType = TickType.TwoYears;
        }
        else if (0 < Math.round(tickDurationInMinutes / yearAsMinutes)) {
            tickType = TickType.OneYear;
        }
        else if (0 < Math.round(tickDurationInMinutes / (monthAsMinutes * 6))) {
            tickType = TickType.SixMonths;
        }
        else if (0 < Math.round(tickDurationInMinutes / (monthAsMinutes * 4))) {
            tickType = TickType.FourMonths;
        }
        else if (0 < Math.round(tickDurationInMinutes / (monthAsMinutes * 3))) {
            tickType = TickType.ThreeMonths;
        }
        else if (0 < Math.round(tickDurationInMinutes / monthAsMinutes)) {
            tickType = TickType.OneMonth;
        }
        else if (0 < Math.round(tickDurationInMinutes / (dayAsMinutes * 15))) {
            tickType = TickType.FifteenDays;
        }
        else if (0 < Math.round(tickDurationInMinutes / (dayAsMinutes * 10))) {
            tickType = TickType.TenDays;
        }
        else if (0 < Math.round(tickDurationInMinutes / (dayAsMinutes * 5))) {
            tickType = TickType.FiveDays;
        }
        else if (0 < Math.round(tickDurationInMinutes / dayAsMinutes)) {
            tickType = TickType.OneDay;
        }
        else if (0 < Math.round(tickDurationInMinutes / (marketTradingMinutesCount / 2))) {
            tickType = TickType.HalfTradingDay;
        }
        else if (0 < Math.round(tickDurationInMinutes / 60)) {
            tickType = TickType.OneHour;
        }
        else if (0 < Math.round(tickDurationInMinutes / 30)) {
            tickType = TickType.ThirteenMinutes;
        }
        else if (0 < Math.round(tickDurationInMinutes / 15)) {
            tickType = TickType.FifteenMinutes;
        }
        else if (0 < Math.round(tickDurationInMinutes / 10)) {
            tickType = TickType.TenMinutes;
        }
        else if (0 < Math.round(tickDurationInMinutes / 5)) {
            tickType = TickType.FiveMinutes;
        }
        else {
            tickType = TickType.OneMinute;
        }
        return tickType;
    };
    AutoDateScaleCalibrator.prototype.passTickTypeCondition = function (tickType, prevDate, date, marketTradingMinutesCount) {
        switch (tickType) {
            case TickType.ThreeYears:
                return 3 <= date.getFullYear() - prevDate.getFullYear();
            case TickType.TwoYears:
                return 2 <= date.getFullYear() - prevDate.getFullYear();
            case TickType.OneYear:
                return date.getFullYear() != prevDate.getFullYear();
            case TickType.SixMonths:
                if (date.getFullYear() != prevDate.getFullYear()) {
                    return true;
                }
                if (date.getMonth() != prevDate.getMonth()) {
                    return date.getMonth() + 1 == 6 || 6 < date.getMonth() - prevDate.getMonth();
                }
                return false;
            case TickType.FourMonths:
                if (date.getFullYear() != prevDate.getFullYear()) {
                    return true;
                }
                if (date.getMonth() != prevDate.getMonth()) {
                    return [5, 9].indexOf(date.getMonth() + 1) != -1 || 4 < date.getMonth() - prevDate.getMonth();
                }
                return false;
            case TickType.ThreeMonths:
                if (date.getFullYear() != prevDate.getFullYear()) {
                    return true;
                }
                if (date.getMonth() != prevDate.getMonth()) {
                    return [4, 7, 10].indexOf(date.getMonth() + 1) != -1 || 3 < date.getMonth() - prevDate.getMonth();
                }
                return false;
            case TickType.OneMonth:
                if (date.getFullYear() != prevDate.getFullYear()) {
                    return true;
                }
                return date.getMonth() != prevDate.getMonth();
            case TickType.FifteenDays:
                if (date.getMonth() != prevDate.getMonth()) {
                    return true;
                }
                if (date.getDate() != prevDate.getDate()) {
                    return date.getDate() == 15 || 15 < date.getDate() - prevDate.getDate();
                }
                return false;
            case TickType.TenDays:
                if (date.getMonth() != prevDate.getMonth()) {
                    return true;
                }
                if (date.getDate() != prevDate.getDate()) {
                    return [10, 20].indexOf(date.getDate()) != -1 || 10 < date.getDate() - prevDate.getDate();
                }
                return false;
            case TickType.FiveDays:
                if (date.getMonth() != prevDate.getMonth()) {
                    return true;
                }
                if (date.getDate() != prevDate.getDate()) {
                    return [5, 10, 15, 20, 25].indexOf(date.getDate()) != -1 || 5 < date.getDate() - prevDate.getDate();
                }
                return false;
            case TickType.OneDay:
                if (date.getMonth() != prevDate.getMonth()) {
                    return true;
                }
                return date.getDate() != prevDate.getDate();
            case TickType.HalfTradingDay:
                if (date.getDate() != prevDate.getDate()) {
                    return true;
                }
                return (marketTradingMinutesCount / 2) < moment(date).diff(moment(prevDate), 'minutes');
            case TickType.OneHour:
                if (date.getDate() != prevDate.getDate()) {
                    return true;
                }
                return date.getHours() != prevDate.getHours();
            case TickType.ThirteenMinutes:
                if (date.getDate() != prevDate.getDate()) {
                    return true;
                }
                if (date.getMinutes() != prevDate.getMinutes()) {
                    return [0, 30].indexOf(date.getMinutes()) != -1 || 30 < moment(date).diff(moment(prevDate), 'minutes');
                }
                return false;
            case TickType.FifteenMinutes:
                if (date.getDate() != prevDate.getDate()) {
                    return true;
                }
                if (date.getMinutes() != prevDate.getMinutes()) {
                    return [0, 15, 30, 45].indexOf(date.getMinutes()) != -1 || 15 < moment(date).diff(moment(prevDate), 'minutes');
                }
                return false;
            case TickType.TenMinutes:
                if (date.getDate() != prevDate.getDate()) {
                    return true;
                }
                if (date.getMinutes() != prevDate.getMinutes()) {
                    return [0, 10, 20, 30, 40, 50].indexOf(date.getMinutes()) != -1 || 10 < moment(date).diff(moment(prevDate), 'minutes');
                }
                return false;
            case TickType.FiveMinutes:
                if (date.getDate() != prevDate.getDate()) {
                    return true;
                }
                if (date.getMinutes() != prevDate.getMinutes()) {
                    return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].indexOf(date.getMinutes()) != -1 || 5 < moment(date).diff(moment(prevDate), 'minutes');
                }
                return false;
            case TickType.OneMinute:
                return true;
            default:
                throw new Error('Unknown date tick type: ' + tickType);
        }
    };
    AutoDateScaleCalibrator.prototype.getFormattedDateAsString = function (tickType, prevDate, date) {
        var differentYears = date.getFullYear() != prevDate.getFullYear();
        var differentMonths = date.getMonth() != prevDate.getMonth();
        var differentDays = date.getDate() != prevDate.getDate();
        switch (tickType) {
            case TickType.ThreeYears:
            case TickType.TwoYears:
            case TickType.OneYear:
                return date.getFullYear().toString();
            case TickType.SixMonths:
            case TickType.FourMonths:
            case TickType.ThreeMonths:
            case TickType.OneMonth:
                return differentYears ? date.getFullYear().toString() : moment(date).format("MMMM").substring(0, 3);
            case TickType.FifteenDays:
            case TickType.TenDays:
            case TickType.FiveDays:
            case TickType.OneDay:
                if (differentMonths || differentYears) {
                    return moment(date).format("MMMM").substring(0, 3);
                }
                return date.getDate() < 10 ? "0" + date.getDate().toString() + "/" + (date.getMonth() + 1) : date.getDate().toString() + "/" + (date.getMonth() + 1);
            case TickType.HalfTradingDay:
            case TickType.OneHour:
            case TickType.ThirteenMinutes:
            case TickType.FifteenMinutes:
            case TickType.TenMinutes:
            case TickType.FiveMinutes:
            case TickType.OneMinute:
                var dayAsString = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
                if (differentMonths || differentYears) {
                    return moment(date).format("MMMM").substring(0, 3);
                }
                var hourAsString = date.getHours() < 10 ? "0" + date.getHours().toString() : date.getHours().toString();
                var minutesAsString = date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
                if (differentDays) {
                    return dayAsString + "/" + (date.getMonth() + 1);
                }
                return hourAsString + ":" + minutesAsString;
            default:
                throw new Error('Unknown date tick type: ' + tickType);
        }
    };
    AutoDateScaleCalibrator.prototype.addFirstTickIfNeeded = function (visibleDates, tickType, projection, minTextX) {
        var firstVisibleDate = visibleDates[0];
        var firstVisibleDateAsString = this.getFormattedDateAsString(tickType, firstVisibleDate, firstVisibleDate);
        var canAddFirstRecord = this.majorTicks.length == 0;
        if (!canAddFirstRecord) {
            var firstMajorTick = this.majorTicks[0];
            if (minTextX <= firstMajorTick.textX - DummyCanvasContext.textWidth(firstMajorTick.text) - this.minLabelsOffset) {
                if (firstVisibleDateAsString != firstMajorTick.text) {
                    canAddFirstRecord = true;
                }
            }
        }
        if (canAddFirstRecord) {
            var x = projection.xByDate(firstVisibleDate);
            this.majorTicks.unshift({
                x: x,
                textX: x,
                textAlign: x - (DummyCanvasContext.textWidth(firstVisibleDateAsString) / 2) <= minTextX ? "left" : "center",
                date: firstVisibleDate,
                text: firstVisibleDateAsString,
                major: false
            });
        }
    };
    AutoDateScaleCalibrator.prototype.removeOverlappingTicks = function (charWidth) {
        var notOverlappingTicks = [];
        var lastTick = null;
        for (var i = 0; i < this.majorTicks.length; i++) {
            var tick = this.majorTicks[i];
            if (lastTick == null) {
                lastTick = tick;
                continue;
            }
            var lastTickOverlappingWithCurrentTick = !(lastTick.textX + (lastTick.text.length * charWidth) + (this.minLabelsOffset / 4) < tick.textX);
            if (!lastTickOverlappingWithCurrentTick) {
                notOverlappingTicks.push(lastTick);
                lastTick = tick;
                continue;
            }
            if (!lastTick.major && tick.major) {
                lastTick = tick;
            }
        }
        if (lastTick != null) {
            notOverlappingTicks.push(lastTick);
        }
        this._majorTicks = notOverlappingTicks;
    };
    AutoDateScaleCalibrator.prototype.getMarketTradingMinutesCount = function (dateScale) {
        return dateScale.chart.marketTradingMinutesCount;
    };
    AutoDateScaleCalibrator.prototype.isMajorTick = function (tickType, prevDate, date) {
        switch (tickType) {
            case TickType.ThreeYears:
            case TickType.TwoYears:
            case TickType.OneYear:
                return false;
            case TickType.SixMonths:
            case TickType.FourMonths:
            case TickType.ThreeMonths:
            case TickType.OneMonth:
                return date.getFullYear() != prevDate.getFullYear();
            case TickType.FifteenDays:
            case TickType.TenDays:
            case TickType.FiveDays:
            case TickType.OneDay:
                return date.getMonth() != prevDate.getMonth();
            case TickType.HalfTradingDay:
            case TickType.OneHour:
            case TickType.ThirteenMinutes:
            case TickType.FifteenMinutes:
            case TickType.TenMinutes:
            case TickType.FiveMinutes:
            case TickType.OneMinute:
                return date.getDate() != prevDate.getDate();
            default:
                throw new Error('Unknown date tick type: ' + tickType);
        }
    };
    AutoDateScaleCalibrator.defaults = {
        majorTicks: {
            minOffset: 30
        },
        minorTicks: {
            count: 0
        }
    };
    return AutoDateScaleCalibrator;
}(DateScaleCalibrator));
export { AutoDateScaleCalibrator };
DateScaleCalibrator.register(AutoDateScaleCalibrator);
//# sourceMappingURL=AutoDateScaleCalibrator.js.map