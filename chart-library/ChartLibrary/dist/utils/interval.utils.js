import { Interval } from '../services/loader/price-loader/interval';
import { BaseIntervalType, IntervalType } from '../services/loader/price-loader/interval-type';
import { Tc } from './tc.utils';
import { TimeSpan } from '../stock-chart/StockChartX/Data/TimeFrame';
import { MarketUtils } from './market.utils';
import { DateUtils } from './date.utils';
var IntervalUtils = (function () {
    function IntervalUtils() {
    }
    IntervalUtils.getGroupingTime = function (marketAbbr, interval, time) {
        var result = this.getGroupingMomentTime(marketAbbr, interval, moment(time));
        return Interval.isDaily(interval) ? result.format('YYYY-MM-DD') : result.format('YYYY-MM-DD HH:mm:ss');
    };
    IntervalUtils.getGroupingMomentTime = function (marketAbbr, interval, time) {
        return Interval.isDaily(interval) ?
            IntervalUtils.getDailyGroupingTime(marketAbbr, time, interval) :
            IntervalUtils.getIntraDayGroupingTime(marketAbbr, time, interval);
    };
    IntervalUtils.getIntraDayGroupingTime = function (marketAbbr, time, interval) {
        if (interval.type == IntervalType.Minute) {
            return time;
        }
        time = moment(time).add('-1', 'minutes');
        var marketStartTime = MarketUtils.getMarketOpenCloseTime(marketAbbr).openTime;
        var marketStartTimeTotalMinutes = marketStartTime.hour() * 60 + marketStartTime.minute();
        var timeTotalMinutes = (moment(time).add(MarketUtils.GetShiftHour(marketAbbr, time), 'hours')).hour() * 60 + time.minute();
        var minutesDiff = timeTotalMinutes - marketStartTimeTotalMinutes;
        var minutesDuration = Interval.getMinutesDuration(interval);
        var minutesToAdd = minutesDuration - (minutesDiff % minutesDuration);
        var groupedTime = moment(time).add(minutesToAdd, 'minutes');
        return groupedTime;
    };
    IntervalUtils.getDailyGroupingTime = function (marketAbbr, time, interval) {
        var momentInterval;
        switch (interval.type) {
            case IntervalType.Day:
                momentInterval = 'day';
                return time.startOf(momentInterval);
            case IntervalType.Week:
                momentInterval = 'week';
                return time.startOf(momentInterval);
            case IntervalType.Month:
                momentInterval = 'month';
                return time.startOf(momentInterval);
            case IntervalType.Quarter:
                momentInterval = 'quarter';
                return time.startOf(momentInterval);
            case IntervalType.Year:
                momentInterval = 'year';
                return time.startOf(momentInterval);
            case IntervalType.Custom:
                var OAdate = this.getOaDateTime(time);
                var subtractDays = 0;
                switch (interval.base) {
                    case BaseIntervalType.Day:
                        subtractDays = (OAdate % interval.repeat);
                        var startDate = time.startOf('day').add(-subtractDays, 'day');
                        while (!DateUtils.isBusinessDay(marketAbbr, startDate.toDate())) {
                            startDate = startDate.add(1, 'day');
                        }
                        return startDate;
                    case BaseIntervalType.Week:
                        subtractDays = (OAdate % ((interval.repeat) * 7));
                        var startWeek = time.add(-subtractDays, 'day');
                        return startWeek.startOf('week').add(1, 'week');
                    case BaseIntervalType.Month:
                        var subtractMonths = ((time.year() * 12 + time.month()) % interval.repeat);
                        return time.startOf('month').add(-subtractMonths, 'month');
                }
            default:
                Tc.error("unkown interval");
        }
    };
    IntervalUtils.getOaDateTime = function (time) {
        var timeString = time.format('YYYY-MM-DD');
        return (Date.parse(timeString + ' GMT') + (25569 * TimeSpan.MILLISECONDS_IN_DAY)) / TimeSpan.MILLISECONDS_IN_DAY;
    };
    return IntervalUtils;
}());
export { IntervalUtils };
//# sourceMappingURL=interval.utils.js.map