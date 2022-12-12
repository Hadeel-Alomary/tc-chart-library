import {Interval, IntervalType} from '../../loader';
import {Tc} from '../../../utils';

export class LiquidityIntervalUtils {

    public static fromIntervalString(intervalString: string): Interval {
        switch (intervalString) {
            case '1min' :
                return Interval.getIntervalByType(IntervalType.Minute);
            case '5min' :
                return Interval.getIntervalByType(IntervalType.FiveMinutes);
            case '10min' :
                return Interval.getIntervalByType(IntervalType.TenMinutes);
            case '15min' :
                return Interval.getIntervalByType(IntervalType.FifteenMinutes);
            case '30min' :
                return Interval.getIntervalByType(IntervalType.ThirtyMinutes);
            case '60min' :
                return Interval.getIntervalByType(IntervalType.SixtyMinutes);
            case '1day' :
                return Interval.getIntervalByType(IntervalType.Day);
            case '1week' :
                return Interval.getIntervalByType(IntervalType.Week);
            case '1month' :
                return Interval.getIntervalByType(IntervalType.Month);
            case 'quarter' :
                return Interval.getIntervalByType(IntervalType.Quarter);
            case '1year' :
                return Interval.getIntervalByType(IntervalType.Year);
            default:
                Tc.error('Unsupported Liquidity Interval: ' + intervalString);
        }
    }

    public static toIntervalString(interval: Interval): string {
        switch (interval.type) {
            case IntervalType.ThirtyMinutes:
                return '30min';
            case IntervalType.SixtyMinutes:
                return '60min';
            case IntervalType.Day:
                return '1day';
            case IntervalType.Week:
                return '1week';
            case IntervalType.Month:
                return '1month';
            default:
                return interval.serverInterval;
        }
    }

    public static getBaseInterval(interval: Interval): Interval {
        let mappedInterval = Interval.mapIntervalToServerInterval(interval);

        switch (mappedInterval.type) {
            case IntervalType.TenMinutes:
                return Interval.getIntervalByType(IntervalType.FiveMinutes);
            case IntervalType.TwentyMinutes:
                return Interval.getIntervalByType(IntervalType.FiveMinutes);
            case IntervalType.FourHours:
                return Interval.getIntervalByType(IntervalType.SixtyMinutes);
            case IntervalType.Quarter:
            case IntervalType.Year:
                return Interval.getIntervalByType(IntervalType.Month);
            default:
                return mappedInterval;
        }
    }

}
