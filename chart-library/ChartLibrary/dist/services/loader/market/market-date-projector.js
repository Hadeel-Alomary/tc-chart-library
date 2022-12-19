import { Tc } from '../../../utils/index';
import { BaseIntervalType, IntervalType } from '../price-loader/interval-type';
import { Interval } from '../price-loader/interval';
import { IntervalUtils } from '../../../utils/interval.utils';
import { TimeSpan } from '../../../stock-chart/StockChartX/Data/TimeFrame';
var MarketDateProjector = (function () {
    function MarketDateProjector(abbreviation, startTime, endTime) {
        this.abbreviation = abbreviation;
        this.startTime = startTime;
        this.endTime = endTime;
        var momentStartTime = moment(startTime, 'HH:mm:ss');
        var momentEndTime = moment(endTime, 'HH:mm:ss');
        this.marketStartTimeInMsecs = momentStartTime.valueOf() - momentStartTime.startOf('day').valueOf();
        this.marketEndTimeInMsecs = momentEndTime.valueOf() - momentEndTime.startOf('day').valueOf();
    }
    MarketDateProjector.prototype.findProjectedFutureDate = function (from, numberOfCandles, interval) {
        return this.findProjectedFutureMomentDate(this.mapDateByInterval(from, interval), numberOfCandles, interval).toDate();
    };
    MarketDateProjector.prototype.findProjectNumberOfCandlesBetweenDates = function (from, to, interval) {
        return this.findProjectNumberOfCandlesBetweenMomentDates(this.mapDateByInterval(from, interval), this.mapDateByInterval(to, interval), interval);
    };
    MarketDateProjector.prototype.findProjectedFutureMomentDate = function (from, numberOfCandles, interval) {
        return Interval.isDaily(interval) ?
            this.projectDateForDailyInterval(interval, from, numberOfCandles) :
            this.projectDateForIntradayInterval(interval, from, numberOfCandles);
    };
    MarketDateProjector.prototype.findProjectNumberOfCandlesBetweenMomentDates = function (from, to, interval) {
        return Interval.isDaily(interval) ?
            this.projectNumberOfCandlesForDailyInterval(interval, from, to) :
            this.projectNumberOfCandlesForIntradayInterval(interval, from, to);
    };
    MarketDateProjector.prototype.projectDateForIntradayInterval = function (interval, fromDateTime, numberOfCandles) {
        var fromDateTimeInMsecs = fromDateTime.valueOf();
        var fromDate = moment(fromDateTime).startOf('day');
        var intervalInMsecs = Interval.toChartInterval(interval);
        var remainingMsecsInFromTradingSession = this.marketEndTimeInMsecs - (fromDateTimeInMsecs - fromDate.valueOf());
        var remainingCandlesInFromTradingSession = Math.ceil(remainingMsecsInFromTradingSession / intervalInMsecs);
        var numberOfCandlesPerDay = Math.ceil((this.marketEndTimeInMsecs - this.marketStartTimeInMsecs) / intervalInMsecs);
        var differentTradingDates = remainingCandlesInFromTradingSession < numberOfCandles;
        var toDateTimeInMsecs;
        if (differentTradingDates) {
            var numberOfCandlesAfterFromTradingDate = numberOfCandles - remainingCandlesInFromTradingSession;
            var numberOfTradingDates = Math.ceil(numberOfCandlesAfterFromTradingDate / numberOfCandlesPerDay);
            var numberOfCandlesInToDate = (numberOfCandlesAfterFromTradingDate % numberOfCandlesPerDay);
            if (numberOfCandlesInToDate == 0) {
                numberOfCandlesInToDate = numberOfCandlesPerDay;
            }
            var toDateTradingTimeInMsecs = numberOfCandlesInToDate * Interval.toChartInterval(interval);
            var toDate = this.findProjectedFutureMomentDate(fromDate, numberOfTradingDates, Interval.getIntervalByType(IntervalType.Day));
            toDateTimeInMsecs = toDate.valueOf() + this.marketStartTimeInMsecs + toDateTradingTimeInMsecs;
        }
        else {
            toDateTimeInMsecs = fromDateTimeInMsecs + numberOfCandles * intervalInMsecs;
        }
        return moment(toDateTimeInMsecs);
    };
    MarketDateProjector.prototype.projectDateForDailyInterval = function (interval, from, numberOfCandles) {
        switch (interval.type) {
            case IntervalType.Day:
                return from.add(this.computeTradingDaysFromCalendarDays(from, numberOfCandles), 'day');
                break;
            case IntervalType.Week:
                return from.add(numberOfCandles, 'week');
                break;
            case IntervalType.Month:
                return from.add(numberOfCandles, 'month');
                break;
            case IntervalType.Quarter:
                return from.add(numberOfCandles * 3, 'month');
                break;
            case IntervalType.Year:
                return from.add(numberOfCandles, 'year');
                break;
            case IntervalType.Custom:
                switch (interval.base) {
                    case BaseIntervalType.Day:
                        return from.add(this.computeTradingDaysFromCalendarDays(from, numberOfCandles * interval.repeat), 'day');
                        break;
                    case BaseIntervalType.Week:
                        return from.add(numberOfCandles * interval.repeat, 'week');
                        break;
                    case BaseIntervalType.Month:
                        return from.add(numberOfCandles * interval.repeat, 'month');
                        break;
                }
                break;
            default:
                Tc.error("should never be here");
                break;
        }
    };
    MarketDateProjector.prototype.isWeekend = function (dayOfWeek) {
        return this.abbreviation == 'USA' || this.abbreviation == 'FRX' || this.abbreviation == 'DFM' || this.abbreviation == 'ADX' ? (dayOfWeek == 6 || dayOfWeek == 0) : (dayOfWeek == 5 || dayOfWeek == 6);
    };
    MarketDateProjector.prototype.computeTradingDaysFromCalendarDays = function (fromTradingDate, numberOfTradingDays) {
        var dayOfWeek = fromTradingDate.day();
        var numberOfCalendarDays = 0;
        for (var tradingDateIndex = 0; tradingDateIndex < numberOfTradingDays;) {
            dayOfWeek = (dayOfWeek + 1) % 7;
            numberOfCalendarDays += 1;
            if (!this.isWeekend(dayOfWeek)) {
                tradingDateIndex += 1;
            }
        }
        return numberOfCalendarDays;
    };
    MarketDateProjector.prototype.computeCalendarDaysFromTradingDays = function (fromCalendarDate, toCalendarDate) {
        var dayOfWeek = fromCalendarDate.day();
        var numberOfCalendarDays = toCalendarDate.diff(fromCalendarDate, 'days');
        var numberOfTradingDays = 0;
        for (var i = 0; i < numberOfCalendarDays; ++i) {
            dayOfWeek = (dayOfWeek + 1) % 7;
            if (!this.isWeekend(dayOfWeek)) {
                numberOfTradingDays += 1;
            }
        }
        return numberOfTradingDays;
    };
    MarketDateProjector.prototype.projectNumberOfCandlesForDailyInterval = function (interval, fromDateTime, toDateTime) {
        switch (interval.type) {
            case IntervalType.Day:
                return this.computeCalendarDaysFromTradingDays(fromDateTime, toDateTime);
            case IntervalType.Week:
                return (toDateTime.valueOf() - fromDateTime.valueOf()) / Interval.toChartInterval(interval);
            case IntervalType.Month:
            case IntervalType.Quarter:
            case IntervalType.Year:
                return Math.round((toDateTime.valueOf() - fromDateTime.valueOf()) / Interval.toChartInterval(interval));
            case IntervalType.Custom:
                switch (interval.base) {
                    case BaseIntervalType.Day:
                        return this.computeCalendarDaysFromTradingDays(fromDateTime, toDateTime);
                    case BaseIntervalType.Week:
                        return (toDateTime.valueOf() - fromDateTime.valueOf()) / Interval.toChartInterval(interval);
                    case BaseIntervalType.Month:
                        return Math.round((toDateTime.valueOf() - fromDateTime.valueOf()) / Interval.toChartInterval(interval));
                }
                break;
            default:
                Tc.error("should never be here");
                break;
        }
    };
    MarketDateProjector.prototype.projectNumberOfCandlesForIntradayInterval = function (interval, fromDateTime, toDateTime) {
        var fromDateTimeInMsecs = fromDateTime.valueOf();
        var fromDate = moment(fromDateTime).startOf('day');
        var intervalInMsecs = Interval.toChartInterval(interval);
        var remainingMsecsInFromTradingSession = this.marketEndTimeInMsecs - (fromDateTimeInMsecs - fromDate.valueOf());
        var numberOfCandlesPerDay = Math.ceil((this.marketEndTimeInMsecs - this.marketStartTimeInMsecs) / intervalInMsecs);
        var differentDates = !toDateTime.isSame(fromDateTime, 'day');
        var numberOfCandles;
        if (differentDates) {
            var toDate = moment(toDateTime).startOf('day');
            var numberOfCandlesRemainingInFromTradingDate = Math.ceil(remainingMsecsInFromTradingSession / intervalInMsecs);
            var numberOfCandlesInToTradingDate = toDate.valueOf() < toDateTime.valueOf() ? (toDateTime.valueOf() - toDate.valueOf() - this.marketStartTimeInMsecs) / intervalInMsecs : 0;
            var numberOfTradingDays = this.projectNumberOfCandlesForDailyInterval(Interval.getIntervalByType(IntervalType.Day), fromDate, toDate);
            numberOfCandles = (numberOfTradingDays - 1) * numberOfCandlesPerDay + numberOfCandlesInToTradingDate + numberOfCandlesRemainingInFromTradingDate;
        }
        else {
            numberOfCandles = (toDateTime.valueOf() - fromDateTime.valueOf()) / intervalInMsecs;
        }
        return numberOfCandles;
    };
    MarketDateProjector.prototype.mapDateByInterval = function (dateTime, interval) {
        var momentDateTime = moment(dateTime);
        var momentDate = moment(dateTime).startOf('day');
        var isDailyDate = momentDate.valueOf() == momentDateTime.valueOf();
        var isDailyInterval = Interval.isDaily(interval);
        if (isDailyDate !== isDailyInterval) {
            if (isDailyInterval) {
                momentDateTime = momentDate;
            }
            else {
                momentDateTime.add(this.marketStartTimeInMsecs + TimeSpan.MILLISECONDS_IN_MINUTE, 'milliseconds');
            }
        }
        return IntervalUtils.getGroupingMomentTime(this.abbreviation, interval, momentDateTime);
    };
    return MarketDateProjector;
}());
export { MarketDateProjector };
//# sourceMappingURL=market-date-projector.js.map