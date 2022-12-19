import { AxisScaleType } from './axis-scale-type';
import { MarketUtils } from '../../../utils';
import { ProjectionDebugger } from './ProjectionDebugger';
import { Interval } from "../../../services/loader/price-loader/interval";
var Projection = (function () {
    function Projection(dateScale, valueScale) {
        this._dateScale = dateScale;
        this._valueScale = valueScale;
    }
    Object.defineProperty(Projection.prototype, "dateScale", {
        get: function () {
            return this._dateScale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Projection.prototype, "valueScale", {
        get: function () {
            return this._valueScale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Projection.prototype, "canResolveX", {
        get: function () {
            return !!this._dateScale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Projection.prototype, "canResolveY", {
        get: function () {
            return !!this._valueScale;
        },
        enumerable: false,
        configurable: true
    });
    Projection.prototype.columnByRecord = function (record, isIntegral) {
        var column = record - Math.trunc(this._dateScale.firstVisibleRecord);
        if (isIntegral !== false)
            column = Math.trunc(column);
        return column;
    };
    Projection.prototype.recordByColumn = function (column, isIntegral) {
        var record = column + Math.trunc(this._dateScale.firstVisibleRecord);
        if (isIntegral !== false)
            record = Math.trunc(record);
        return record;
    };
    Projection.prototype.xByColumn = function (column, isColumnIntegral, isXIntegral) {
        var dateScale = this._dateScale, columnWidth = dateScale.columnWidth, firstRecord = dateScale.firstVisibleRecord, firstColumnOffset = (firstRecord - Math.trunc(firstRecord)) * columnWidth, frame = dateScale.projectionFrame, x = frame.left - firstColumnOffset + column * columnWidth;
        if (isColumnIntegral !== false)
            x += columnWidth / 2;
        return isXIntegral !== false ? Math.round(x) : x;
    };
    Projection.prototype.columnByX = function (x, isIntegral) {
        var dateScale = this._dateScale, frame = dateScale.projectionFrame, firstRecord = dateScale.firstVisibleRecord, columnWidth = dateScale.columnWidth, firstColumnOffset = (firstRecord - Math.trunc(firstRecord)) * columnWidth, column = (x - frame.left + firstColumnOffset) / columnWidth;
        return isIntegral !== false ? Math.floor(column) : column;
    };
    Projection.prototype.xByRecord = function (record, isIntegral, isXIntegral) {
        return this.xByColumn(this.columnByRecord(record, isIntegral), isIntegral, isXIntegral);
    };
    Projection.prototype.recordByX = function (x, isIntegral) {
        return this.recordByColumn(this.columnByX(x, isIntegral), isIntegral);
    };
    Projection.prototype.dateByRecord = function (record) {
        var dates = this._dateScale.getDateDataSeries().values, recordTime;
        if (dates.length === 0)
            return new Date(0);
        if (record < 0) {
            var firstTime = dates[0].getTime();
            recordTime = firstTime + record * this._dateScale.chart.timeInterval;
            return new Date(recordTime);
        }
        if (record >= dates.length) {
            var marketAbbreviation = this.getMarketAbbreviation();
            var interval = Interval.fromChartInterval(this._dateScale.chart.timeInterval);
            var numberOfCandles = record - dates.length + 1;
            var market = null;
            var futureDate = null;
            ProjectionDebugger.validateFutureDateComputation(market, interval, dates[dates.length - 1], numberOfCandles, futureDate);
            return futureDate;
        }
        return dates[record];
    };
    Projection.prototype.recordByDate = function (date) {
        var dateScale = this._dateScale, dateDataSeries = dateScale.getDateDataSeries(), interval = Interval.fromChartInterval(this._dateScale.chart.timeInterval);
        if (dateDataSeries.length === 0)
            return -1;
        var index;
        if (Interval.isDaily(interval)) {
            index = dateDataSeries.floorIndex(date);
        }
        else {
            var lastCandleIndex = dateDataSeries.ceilIndex(date);
            if (lastCandleIndex === dateDataSeries.length) {
                lastCandleIndex -= 1;
            }
            if (dateDataSeries.values[lastCandleIndex].getDay() !== date.getDay()) {
                index = dateDataSeries.floorIndex(date);
            }
            else {
                index = dateDataSeries.ceilIndex(date);
            }
        }
        if ((0 < index) && (index == (dateDataSeries.length - 1))) {
            if ((date.getTime() > dateDataSeries.values[dateDataSeries.length - 1].getTime())) {
                index += 1;
            }
        }
        if (index < 0) {
            var leftTimeDiff = date.getTime() - dateDataSeries.firstValue.getTime();
            index = Math.floor(leftTimeDiff / dateScale.chart.timeInterval);
        }
        else if (index >= dateDataSeries.length) {
            var marketAbbreviation = this.getMarketAbbreviation();
            var market = null;
            var numberOfFutureCandles = 0;
            index = dateDataSeries.length - 1 + numberOfFutureCandles;
            ProjectionDebugger.validateNumberOfFutureCandlesComputation(market, interval, dateDataSeries.values[dateDataSeries.length - 1], date, numberOfFutureCandles);
        }
        return index;
    };
    Projection.prototype.getMarketAbbreviation = function () {
        return MarketUtils.marketAbbr(this._dateScale.chart.instrument.symbol);
    };
    Projection.prototype.dateByColumn = function (column) {
        var record = this.recordByColumn(column);
        return this.dateByRecord(record);
    };
    Projection.prototype.columnByDate = function (date) {
        var x = this.xByDate(date, false);
        return this.columnByX(x);
    };
    Projection.prototype.dateByX = function (x) {
        x = Math.round(x);
        var column = this.columnByX(x);
        return this.dateByColumn(column);
    };
    Projection.prototype.xByDate = function (date, isIntegral) {
        var record = this.recordByDate(date);
        var recordX = this.xByRecord(record, true, false);
        return isIntegral !== false ? Math.round(recordX) : recordX;
    };
    Projection.prototype.percentageByX = function (x) {
        return x / this.dateScale.projectionFrame.width;
    };
    Projection.prototype.xByPercentage = function (percentage) {
        return Math.floor(percentage * this.dateScale.projectionFrame.width);
    };
    Projection.prototype.percentageByY = function (y) {
        return y / this.valueScale.projectionFrame.height;
    };
    Projection.prototype.yByPercentage = function (percentage) {
        return Math.floor(percentage * this.valueScale.projectionFrame.height);
    };
    Projection.prototype.yByValue = function (value) {
        var valueScale = this._valueScale, frame = valueScale.projectionFrame, minValue = valueScale.minVisibleValue, maxValue = valueScale.maxVisibleValue, factor = frame.height / (maxValue - minValue);
        if (minValue == maxValue) {
            return 0;
        }
        return this.isLinearScale() ?
            this.yByValueLinearScale(frame, maxValue, value, factor) :
            this.yByValueLogScale(frame, minValue, maxValue, value, factor);
    };
    Projection.prototype.yByValueLinearScale = function (frame, maxValue, value, factor) {
        return Math.round(frame.top + (maxValue - value) * factor);
    };
    Projection.prototype.yByValueLogScale = function (frame, minValue, maxValue, value, factor) {
        value = this.log(value);
        minValue = this.log(minValue);
        maxValue = this.log(maxValue);
        var y = frame.bottom - frame.height * (value - minValue) / (maxValue - minValue);
        y = y < -100000 ? -100000 : y;
        y = 100000 < y ? 100000 : y;
        return y;
    };
    Projection.prototype.valueByY = function (y) {
        var valueScale = this._valueScale, frame = valueScale.projectionFrame, minValue = valueScale.minVisibleValue, maxValue = valueScale.maxVisibleValue, factor = (maxValue - minValue) / frame.height;
        if (minValue == maxValue) {
            return minValue;
        }
        return this.isLinearScale() ?
            this.valueByYLinearScale(maxValue, y, frame, factor) :
            this.valueByYLogScale(minValue, maxValue, y, frame, factor);
    };
    Projection.prototype.isLinearScale = function () {
        return !this.isMainPanel() || this.valueScale.axisScale == AxisScaleType.Linear;
    };
    Projection.prototype.valueByYLinearScale = function (maxValue, y, frame, factor) {
        return maxValue - (y - frame.top) * factor;
    };
    Projection.prototype.valueByYLogScale = function (minValue, maxValue, y, frame, factor) {
        minValue = this.log(minValue);
        maxValue = this.log(maxValue);
        return Math.exp((frame.bottom - y) / frame.height * (maxValue - minValue) + minValue);
    };
    Projection.prototype.log = function (val) {
        if (val <= 0)
            return 0;
        return Math.log(Math.abs(val));
    };
    Projection.prototype.isMainPanel = function () {
        return this._valueScale.chartPanel.chart.mainPanel == this._valueScale.chartPanel;
    };
    return Projection;
}());
export { Projection };
//# sourceMappingURL=Projection.js.map