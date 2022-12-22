import {Tc} from '../../../utils/index';
import {BaseIntervalType, IntervalType} from '../price-loader/interval-type';
import {Interval} from '../price-loader/interval';
import {IntervalUtils} from '../../../utils/interval.utils';
import {TimeSpan} from '../../../stock-chart/StockChartX/Data/TimeFrame';
import Moment = moment.Moment;

export class MarketDateProjector {

    private marketStartTimeInMsecs:number;
    private marketEndTimeInMsecs:number;

    constructor (private abbreviation:string, private startTime: string, private endTime: string){
        let momentStartTime = moment(startTime, 'HH:mm:ss');
        let momentEndTime = moment(endTime, 'HH:mm:ss');
        this.marketStartTimeInMsecs = momentStartTime.valueOf() - momentStartTime.startOf('day').valueOf();
        this.marketEndTimeInMsecs = momentEndTime.valueOf() - momentEndTime.startOf('day').valueOf();
    }

    public findProjectedFutureDate(from: Date, numberOfCandles: number, interval: Interval): Date {
        return this.findProjectedFutureMomentDate(this.mapDateByInterval(from, interval), numberOfCandles, interval).toDate();
    }

    public findProjectNumberOfCandlesBetweenDates(from:Date, to: Date, interval: Interval):number {
        return this.findProjectNumberOfCandlesBetweenMomentDates(this.mapDateByInterval(from, interval), this.mapDateByInterval(to, interval), interval);
    }

    private findProjectedFutureMomentDate(from: Moment, numberOfCandles: number, interval: Interval): Moment {
        return Interval.isDaily(interval) ?
            this.projectDateForDailyInterval(interval, from, numberOfCandles) :
            this.projectDateForIntradayInterval(interval, from, numberOfCandles);
    }

    private findProjectNumberOfCandlesBetweenMomentDates(from: moment.Moment, to: moment.Moment, interval: Interval):number {
        return Interval.isDaily(interval) ?
            this.projectNumberOfCandlesForDailyInterval(interval, from, to) :
            this.projectNumberOfCandlesForIntradayInterval(interval, from, to);
    }

    private projectDateForIntradayInterval(interval: Interval, fromDateTime: moment.Moment, numberOfCandles: number):Moment {

        let fromDateTimeInMsecs = fromDateTime.valueOf();
        let fromDate = moment(fromDateTime).startOf('day');
        let intervalInMsecs = Interval.toChartInterval(interval);

        let remainingMsecsInFromTradingSession = this.marketEndTimeInMsecs - (fromDateTimeInMsecs - fromDate.valueOf());
        // MA ceil is indeed when trading time is not multiple of interval (US market and 1-hour interval)
        let remainingCandlesInFromTradingSession = Math.ceil(remainingMsecsInFromTradingSession / intervalInMsecs);
        let numberOfCandlesPerDay = Math.ceil((this.marketEndTimeInMsecs - this.marketStartTimeInMsecs) / intervalInMsecs);

        let differentTradingDates = remainingCandlesInFromTradingSession < numberOfCandles;

        let toDateTimeInMsecs:number;

        if(differentTradingDates) {
            // MA to compute future "DateTime", we need to find future "Date" from number of trading dates remaining. Once future "Date" is
            // computed, add to it the timestamp of last trading session to find "DateTime".
            let numberOfCandlesAfterFromTradingDate = numberOfCandles - remainingCandlesInFromTradingSession;
            let numberOfTradingDates = Math.ceil(numberOfCandlesAfterFromTradingDate / numberOfCandlesPerDay);
            let numberOfCandlesInToDate = (numberOfCandlesAfterFromTradingDate % numberOfCandlesPerDay);
            if(numberOfCandlesInToDate == 0) { // 0 means all candles
                numberOfCandlesInToDate = numberOfCandlesPerDay;
            }
            let toDateTradingTimeInMsecs =  numberOfCandlesInToDate * Interval.toChartInterval(interval);
            let toDate = this.findProjectedFutureMomentDate(fromDate, numberOfTradingDates, Interval.getIntervalByType(IntervalType.Day));
            toDateTimeInMsecs = toDate.valueOf() + this.marketStartTimeInMsecs + toDateTradingTimeInMsecs;

        } else {
            // MA to find future date in same trading date, just add the interval for numberOfCandles
            toDateTimeInMsecs = fromDateTimeInMsecs + numberOfCandles * intervalInMsecs;
        }

        return moment(toDateTimeInMsecs);

    }

    private projectDateForDailyInterval(interval: Interval, from: moment.Moment, numberOfCandles: number):Moment {
        switch(interval.type) {
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
    }

    private isWeekend(dayOfWeek: number) {
        // MA in USA, weekend is Sat & Sun, while it is Fri & Sat in regional markets
        return this.abbreviation == 'USA' || this.abbreviation == 'FRX' || this.abbreviation == 'DFM' || this.abbreviation == 'ADX' ? (dayOfWeek == 6 || dayOfWeek == 0) : (dayOfWeek == 5 || dayOfWeek == 6);
    }

    private computeTradingDaysFromCalendarDays(fromTradingDate: moment.Moment, numberOfTradingDays: number) {

        let dayOfWeek = fromTradingDate.day();

        let numberOfCalendarDays = 0;

        for (let tradingDateIndex = 0; tradingDateIndex < numberOfTradingDays;) {

            dayOfWeek = (dayOfWeek + 1) % 7;

            numberOfCalendarDays += 1;

            if (!this.isWeekend(dayOfWeek)) { // MA advance trading days for non-weekends
                tradingDateIndex += 1;
            }

        }

        return numberOfCalendarDays;

    }

    private computeCalendarDaysFromTradingDays(fromCalendarDate: moment.Moment, toCalendarDate: moment.Moment) {

        let dayOfWeek = fromCalendarDate.day();

        let numberOfCalendarDays = toCalendarDate.diff(fromCalendarDate, 'days');

        let numberOfTradingDays = 0;

        for (let i = 0; i < numberOfCalendarDays; ++i) {

            dayOfWeek = (dayOfWeek + 1) % 7;

            if (!this.isWeekend(dayOfWeek)) { // MA advance trading days for non-weekends
                numberOfTradingDays += 1;
            }

        }

        return numberOfTradingDays;

    }


    private projectNumberOfCandlesForDailyInterval(interval: Interval, fromDateTime: moment.Moment, toDateTime: moment.Moment) {

        switch(interval.type) {
            case IntervalType.Day:
                return this.computeCalendarDaysFromTradingDays(fromDateTime, toDateTime);
            case IntervalType.Week:
                return (toDateTime.valueOf() - fromDateTime.valueOf()) / Interval.toChartInterval(interval);
            case IntervalType.Month:
            case IntervalType.Quarter:
            case IntervalType.Year:
                // MA for month, quarter and year, time in msec changes from one to another, so we use rounding to overcome that.
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
    }

    private projectNumberOfCandlesForIntradayInterval(interval: Interval, fromDateTime: moment.Moment, toDateTime: moment.Moment) {

        let fromDateTimeInMsecs = fromDateTime.valueOf();
        let fromDate = moment(fromDateTime).startOf('day');
        let intervalInMsecs = Interval.toChartInterval(interval);

        let remainingMsecsInFromTradingSession = this.marketEndTimeInMsecs - (fromDateTimeInMsecs - fromDate.valueOf());

        // MA ceil is indeed when trading time is not multiple of interval (US market and 1-hour interval)
        let numberOfCandlesPerDay = Math.ceil((this.marketEndTimeInMsecs - this.marketStartTimeInMsecs) / intervalInMsecs);

        let differentDates = !toDateTime.isSame(fromDateTime, 'day');

        let numberOfCandles:number;

        if(differentDates) {
            let toDate = moment(toDateTime).startOf('day');
            let numberOfCandlesRemainingInFromTradingDate = Math.ceil(remainingMsecsInFromTradingSession / intervalInMsecs);
            let numberOfCandlesInToTradingDate = toDate.valueOf() < toDateTime.valueOf() ? (toDateTime.valueOf() - toDate.valueOf() - this.marketStartTimeInMsecs)/intervalInMsecs : 0;
            let numberOfTradingDays = this.projectNumberOfCandlesForDailyInterval(Interval.getIntervalByType(IntervalType.Day), fromDate, toDate);
            numberOfCandles = (numberOfTradingDays - 1) * numberOfCandlesPerDay + numberOfCandlesInToTradingDate + numberOfCandlesRemainingInFromTradingDate;

        } else {
            numberOfCandles = (toDateTime.valueOf() - fromDateTime.valueOf()) / intervalInMsecs;
        }

        return numberOfCandles;

    }

    // MA when requested projection, dateTime may not be aligned with interval. For example, this is common when user draws a trend
    // line on one interval, and then switch the interval to another one. The trend line chart points won't change, and will keep
    // using their original value which may not align with the new interval. In order for projection logic to works easily, both
    // dateTime and interval "should" be aligned (specially between intraday and daily ones). This is why we do the below mapping
    // on the dateTime values before processing further.
    private mapDateByInterval(dateTime:Date, interval:Interval):Moment {

        let momentDateTime = moment(dateTime);
        let momentDate = moment(dateTime).startOf('day');

        let isDailyDate = momentDate.valueOf() == momentDateTime.valueOf();
        let isDailyInterval = Interval.isDaily(interval);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // MA for "daily" date and "intraday" interval, then move dateTime to represent the first trading candle in trading date.
        // MA for "intraday" date and "daily" interval, then change dateTime to point to date only (no time component).
        if(isDailyDate !== isDailyInterval) {
            if(isDailyInterval) {
               momentDateTime = momentDate; // if interval is daily, then use Date (and not DateTime)
            } else {
                // if interval is intraday, then move Date to be DateTime representing first candle in the market
                momentDateTime.add(this.marketStartTimeInMsecs + TimeSpan.MILLISECONDS_IN_MINUTE, 'milliseconds');
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // re-group moment for the given interval
        return IntervalUtils.getGroupingMomentTime(this.abbreviation, interval, momentDateTime);

    }


}




