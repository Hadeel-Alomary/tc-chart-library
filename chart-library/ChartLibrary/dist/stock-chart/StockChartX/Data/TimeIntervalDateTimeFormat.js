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
import { DateTimeFormat } from "./DateTimeFormat";
import { TimeSpan } from "./TimeFrame";
export var DateTimeFormatName = {
    YEAR_MONTH: "year-month",
    MONTH_DAY: "month-day",
    DATE: "date",
    SHORT_DATE_TIME: "short_date_time",
    LONG_DATE_TIME: "long_date_time",
    SHORT_TIME: "short_time",
    LONG_TIME: "long_time",
};
var TimeIntervalDateTimeFormat = (function (_super) {
    __extends(TimeIntervalDateTimeFormat, _super);
    function TimeIntervalDateTimeFormat(timeInterval) {
        var _this = _super.call(this) || this;
        _this._formatters = {};
        _this._timeInterval = timeInterval;
        return _this;
    }
    Object.defineProperty(TimeIntervalDateTimeFormat, "className", {
        get: function () {
            return 'StockChartX.TimeIntervalDateTimeFormat';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TimeIntervalDateTimeFormat.prototype, "timeInterval", {
        get: function () {
            return this._timeInterval;
        },
        set: function (value) {
            this._timeInterval = value;
        },
        enumerable: false,
        configurable: true
    });
    TimeIntervalDateTimeFormat.prototype._onLocaleChanged = function () {
        this._clearFormatters();
    };
    TimeIntervalDateTimeFormat.prototype._clearFormatters = function () {
        this._formatters = {};
    };
    TimeIntervalDateTimeFormat.prototype._createFormatter = function (options) {
        var locale = this.locale || 'en';
        return new Intl.DateTimeFormat(locale, options);
    };
    TimeIntervalDateTimeFormat.prototype.format = function (date, timeInterval) {
        if (!timeInterval) {
            timeInterval = this._timeInterval;
        }
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_YEAR) {
            return date.getFullYear().toString();
        }
        var formatName = DateTimeFormatName;
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_MONTH) {
            return this.formatter(formatName.YEAR_MONTH).format(date);
        }
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_DAY) {
            return this.formatter(formatName.DATE).format(date);
        }
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_MINUTE) {
            return this.formatter(formatName.SHORT_DATE_TIME).format(date);
        }
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_SECOND) {
            return this.formatter(formatName.SHORT_DATE_TIME).format(date);
        }
        return this.formatter(formatName.LONG_DATE_TIME).format(date);
    };
    TimeIntervalDateTimeFormat.prototype.formatWithFormatter = function (date, formatName) {
        try {
            return this.formatter(formatName).format(date);
        }
        catch (ex) {
            throw ('fail to format date ' + date + ' with format ' + formatName + ' - exception message: ' + ex.message);
        }
    };
    TimeIntervalDateTimeFormat.prototype.formatter = function (name) {
        var formatter = this._formatters[name];
        if (formatter)
            return formatter;
        var formatName = DateTimeFormatName;
        switch (name) {
            case formatName.YEAR_MONTH:
                formatter = this._createFormatter({
                    year: "numeric",
                    month: "numeric"
                });
                break;
            case formatName.MONTH_DAY:
                formatter = this._createFormatter({
                    month: "numeric",
                    day: "2-digit"
                });
                break;
            case formatName.DATE:
                formatter = this._createFormatter({
                    year: "numeric",
                    month: "numeric",
                    day: "2-digit"
                });
                break;
            case formatName.SHORT_DATE_TIME:
                formatter = this._createFormatter({
                    year: "numeric",
                    month: "numeric",
                    day: "2-digit",
                    hour: "2-digit",
                    hour12: false,
                    minute: "2-digit"
                });
                break;
            case formatName.LONG_DATE_TIME:
                formatter = this._createFormatter({
                    year: "numeric",
                    month: "numeric",
                    day: "2-digit",
                    hour: "2-digit",
                    hour12: false,
                    minute: "2-digit",
                    second: "2-digit"
                });
                break;
            case formatName.SHORT_TIME:
                formatter = this._createFormatter({
                    hour: "2-digit",
                    hour12: false,
                    minute: "2-digit"
                });
                break;
            case formatName.LONG_TIME:
                formatter = this._createFormatter({
                    hour: "2-digit",
                    hour12: false,
                    minute: "2-digit",
                    second: "2-digit"
                });
                break;
            default:
                throw new Error("Unknown formatter name: " + name);
        }
        this._formatters[name] = formatter;
        return formatter;
    };
    TimeIntervalDateTimeFormat.prototype.saveState = function () {
        var state = _super.prototype.saveState.call(this);
        state.timeInterval = this.timeInterval;
        return state;
    };
    TimeIntervalDateTimeFormat.prototype.loadState = function (state) {
        _super.prototype.loadState.call(this, state);
        this.timeInterval = state && state.timeInterval;
    };
    return TimeIntervalDateTimeFormat;
}(DateTimeFormat));
export { TimeIntervalDateTimeFormat };
DateTimeFormat.register(TimeIntervalDateTimeFormat);
//# sourceMappingURL=TimeIntervalDateTimeFormat.js.map