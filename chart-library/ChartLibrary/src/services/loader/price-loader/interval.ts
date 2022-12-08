import {Tc} from '../../../utils/index';
import {Period, PeriodString} from './period';
import {PeriodType} from './period-type';
import {BaseIntervalType, IntervalType} from './interval-type';
import {TimeSpan} from '../../../stock-chart/StockChartX/Data/TimeFrame';
import {LanguageService} from '../../state';

export class Interval {

    private static intervals:Interval[] = [];

    // MA Typescript didn't allow me to use interval:IntervalString
    private static periodSettings:{[interval:string]:{minUsablePeriod:PeriodType, maxUsablePeriod:PeriodType, defaultPeriod:PeriodString, minimumFetchedPeriod: PeriodType, enabledPeriods:PeriodString[]}} = {
        '1min'      : {minUsablePeriod: PeriodType.Day,       maxUsablePeriod: PeriodType.ThreeDays,            defaultPeriod :'2days'   , minimumFetchedPeriod: PeriodType.TwoDays ,       enabledPeriods :['1day','2days','3days','1week','2weeks','1month','2months','3months']},
        '5min'      : {minUsablePeriod: PeriodType.Day,       maxUsablePeriod: PeriodType.ThreeMonths,          defaultPeriod :'2days'   , minimumFetchedPeriod: PeriodType.Week ,          enabledPeriods :['1day','2days','3days','1week','2weeks','1month','2months','3months']},
        '10min'     : {minUsablePeriod: PeriodType.Day,       maxUsablePeriod: PeriodType.ThreeMonths,          defaultPeriod :'2days'   , minimumFetchedPeriod: PeriodType.TwoWeeks ,      enabledPeriods :['1day','2days','3days','1week','2weeks','1month','2months','3months']},
        '15min'     : {minUsablePeriod: PeriodType.Day,       maxUsablePeriod: PeriodType.TwoYears,             defaultPeriod :'2days'   , minimumFetchedPeriod: PeriodType.Month ,         enabledPeriods :['1day','2days','3days','1week','2weeks','1month','2months','3months','6months','ytd','1year','2years']},
        '20min'     : {minUsablePeriod: PeriodType.Day,       maxUsablePeriod: PeriodType.ThreeMonths,          defaultPeriod :'2days'   , minimumFetchedPeriod: PeriodType.TwoWeeks ,      enabledPeriods :['1day','2days','3days','1week','2weeks','1month','2months','3months']},
        'half_hour' : {minUsablePeriod: PeriodType.TwoDays,   maxUsablePeriod: PeriodType.TwoYears,             defaultPeriod :'2days'   , minimumFetchedPeriod: PeriodType.TwoMonths ,     enabledPeriods :['1day','2days','3days','1week','2weeks','1month','2months','3months','6months','ytd','1year','2years']},
        'hour'      : {minUsablePeriod: PeriodType.TwoDays,   maxUsablePeriod: PeriodType.TwoYears,             defaultPeriod :'2days'   , minimumFetchedPeriod: PeriodType.ThreeMonths ,   enabledPeriods :['1day','2days','3days','1week','2weeks','1month','2months','3months','6months','ytd','1year','2years']},
        '4hour'     : {minUsablePeriod: PeriodType.TwoDays,   maxUsablePeriod: PeriodType.TwoYears,             defaultPeriod :'2days'   , minimumFetchedPeriod: PeriodType.ThreeMonths ,   enabledPeriods :['1day','2days','3days','1week','2weeks','1month','2months','3months','6months','ytd','1year','2years']},
        'day'       : {minUsablePeriod: PeriodType.TwoWeeks,  maxUsablePeriod: PeriodType.All,                  defaultPeriod :'3months' , minimumFetchedPeriod: PeriodType.TwoYears ,      enabledPeriods :['1week','2weeks','1month','2months','3months','6months','ytd','1year','2years', '3years','5years','10years','all']},
        'week'      : {minUsablePeriod: PeriodType.TwoMonths, maxUsablePeriod: PeriodType.All,                  defaultPeriod :'6months' , minimumFetchedPeriod: PeriodType.All ,           enabledPeriods :['1month','2months','3months','6months','ytd','1year','2years', '3years','5years','10years','all']},
        'month'     : {minUsablePeriod: PeriodType.Year,      maxUsablePeriod: PeriodType.All,                  defaultPeriod :'2years'  , minimumFetchedPeriod: PeriodType.All ,           enabledPeriods :['3months','6months','ytd','1year','2years', '3years','5years','10years','all']},
        'quarter'   : {minUsablePeriod: PeriodType.TwoYears,  maxUsablePeriod: PeriodType.All,                  defaultPeriod :'3years'  , minimumFetchedPeriod: PeriodType.All ,           enabledPeriods :['1year','2years', '3years','5years','10years','all']},
        'year'      : {minUsablePeriod: PeriodType.TenYears,  maxUsablePeriod: PeriodType.All,                  defaultPeriod :'10years' , minimumFetchedPeriod: PeriodType.All ,           enabledPeriods :['3years','5years','10years','all']}
    };

    constructor(public type:IntervalType,
                public serverInterval:string,
                public name:string,
                public base: BaseIntervalType,
                public repeat: number) { }

    static getMinutesDuration(interval:Interval):number {
        Tc.assert(!Interval.isDaily(interval), "request minutes duration for daily interval");

        switch (interval.type) {
            case IntervalType.FiveMinutes:
                return 5;
            case IntervalType.TenMinutes:
                return 10;
            case IntervalType.FifteenMinutes:
                return 15;
            case IntervalType.TwentyMinutes:
                return 20;
            case IntervalType.ThirtyMinutes:
                return 30;
            case IntervalType.SixtyMinutes:
                return 60;
            case IntervalType.FourHours:
                return 240;
            case IntervalType.Custom:
                switch (interval.base) {
                    case BaseIntervalType.Minute:
                        return interval.repeat;
                    case BaseIntervalType.Hour:
                        return interval.repeat * 60;
                }
                Tc.error('getMinutesDuration invalid base interval ' + interval.base);
            default:
                Tc.error("unkown interval");
        }
    }

    public static isDaily(interval:Interval):boolean {
        if(interval.base){
            return interval.base > BaseIntervalType.Hour;
        }
        return [IntervalType.Day, IntervalType.Week, IntervalType.Month, IntervalType.Quarter, IntervalType.Year].includes(interval.type);
    }

    public static getIntervalByType(intervalType:IntervalType):Interval {
        let result:Interval = Interval.getIntervals().find(interval => interval.type == intervalType);
        Tc.assert(result != null, "fail to find interval");
        return result;
    }

    public static getNewCustomInterval(intervalBase: BaseIntervalType, repeat: number): Interval {
       return new Interval(IntervalType.Custom,  `${repeat}${this.getCustomServerInterval(intervalBase)}`, this.getCustomIntervalArabicName(intervalBase, repeat), intervalBase, repeat);
    }

    static getIntervalByServerFormat(serverInterval:string):Interval {
        let result:Interval = Interval.getIntervals().find(interval => interval.serverInterval == serverInterval);
        Tc.assert(result != null, "fail to find interval");
        return result;
    }

    static getDefaultPeriod(interval:Interval, currentPeriod?:Period):Period {
        let mappedInterval = Interval.mapIntervalToServerInterval(interval);
        // MA when switching interval, if currentPeriod is enabled for new interval and larger than "minUsablePeriod" and smaller than or equal "maxUsablePeriod", then keep it
        if(currentPeriod
            && (Interval.periodSettings[mappedInterval.serverInterval].enabledPeriods.includes(currentPeriod.serverPeriod))
            && (Interval.periodSettings[mappedInterval.serverInterval].minUsablePeriod <= currentPeriod.type)
            && (currentPeriod.type <= Interval.periodSettings[mappedInterval.serverInterval].maxUsablePeriod)) {
            return currentPeriod;
        }
        return Period.getPeriodByString(Interval.periodSettings[mappedInterval.serverInterval].defaultPeriod);
    }

    static getEnabledPeriods(interval:Interval):Period[] {
        let mappedInterval = Interval.mapIntervalToServerInterval(interval);

        let periods:Period[] = [];
        Interval.periodSettings[mappedInterval.serverInterval].enabledPeriods
            .forEach(serverPeriod => periods.push(Period.getPeriodByString(serverPeriod)));
        return periods;
    }

    static getMinimumFetchedPeriod(interval:Interval):Period {
        let mappedInterval = Interval.mapIntervalToServerInterval(interval);
        return Period.getPeriodByType(Interval.periodSettings[mappedInterval.serverInterval].minimumFetchedPeriod);
    }

    static mapIntervalToServerInterval(interval: Interval): Interval {
        if(interval.type == IntervalType.FourHours) {
            return Interval.getIntervalByType(IntervalType.SixtyMinutes);
        }
        if(interval.type != IntervalType.Custom) {
            return interval;
        }
        if(interval.base == BaseIntervalType.Minute) {
            return Interval.getIntervalByType(IntervalType.Minute);
        }
        else if(interval.base == BaseIntervalType.Hour) {
            return Interval.getIntervalByType(IntervalType.SixtyMinutes);
        }
        else if(interval.base == BaseIntervalType.Day) {
            return Interval.getIntervalByType(IntervalType.Day);
        }
        else if(interval.base == BaseIntervalType.Week) {
            return Interval.getIntervalByType(IntervalType.Week);
        }
        return Interval.getIntervalByType(IntervalType.Month);
    }

    public static getIntervals():Interval[] {
        if(!Interval.intervals.length){
            Interval.intervals.push(new Interval(IntervalType.Minute         , '1min'      , 'دقيقة', BaseIntervalType.Minute, 1));
            Interval.intervals.push(new Interval(IntervalType.FiveMinutes    , '5min'      , '5 دقائق', BaseIntervalType.Minute, 5));
            Interval.intervals.push(new Interval(IntervalType.TenMinutes     , '10min'     , '10 دقائق', BaseIntervalType.Minute, 10));
            Interval.intervals.push(new Interval(IntervalType.FifteenMinutes , '15min'     , '15 دقيقة', BaseIntervalType.Minute, 15));
            Interval.intervals.push(new Interval(IntervalType.TwentyMinutes  , '20min'     , '20 دقيقة', BaseIntervalType.Minute,20));
            Interval.intervals.push(new Interval(IntervalType.ThirtyMinutes  , 'half_hour' , '30 دقيقة', BaseIntervalType.Minute, 30));
            Interval.intervals.push(new Interval(IntervalType.SixtyMinutes   , 'hour'      , 'ساعة', BaseIntervalType.Hour, 1));
            Interval.intervals.push(new Interval(IntervalType.FourHours      , '4hour'      , '4 ساعات', BaseIntervalType.Hour, 4));
            Interval.intervals.push(new Interval(IntervalType.Day            , 'day'       , 'يوم', BaseIntervalType.Day, 1));
            Interval.intervals.push(new Interval(IntervalType.Week           , 'week'      , 'أسبوع', BaseIntervalType.Week, 1));
            Interval.intervals.push(new Interval(IntervalType.Month          , 'month'     , 'شهر', BaseIntervalType.Month, 1));
            Interval.intervals.push(new Interval(IntervalType.Quarter        , 'quarter'   , 'ربع سنة', BaseIntervalType.Month, 3));
            Interval.intervals.push(new Interval(IntervalType.Year           , 'year'      , 'سنة', BaseIntervalType.Month, 12));
        }
        return Interval.intervals;
    }

    private static getCustomServerInterval(baseIntervalType:BaseIntervalType):string {
        if (baseIntervalType == BaseIntervalType.Minute) {
            return '1min';
        } else if (baseIntervalType == BaseIntervalType.Hour) {
            return 'hour';
        } else if (baseIntervalType == BaseIntervalType.Day) {
            return 'day';
        } else if (baseIntervalType == BaseIntervalType.Week) {
            return 'week';
        } else if (baseIntervalType == BaseIntervalType.Month) {
            return 'month';
        }
        Tc.error("invalid base interval " + baseIntervalType);
        return null;
    }

    public static getCustomIntervalArabicName(baseIntervalType:BaseIntervalType, repeat:number): string {
        switch (baseIntervalType) {
            case BaseIntervalType.Minute :
                if (repeat == 2) {
                    return 'دقيقتان';
                }
                if (repeat >= 1 && repeat <= 10) {
                    return repeat + ' ' + 'دقائق';
                }
                return repeat + ' ' + 'دقيقة';
            case BaseIntervalType.Hour :
                if (repeat == 2) {
                    return 'ساعتان';
                }
                if (repeat >= 1 && repeat <= 10) {
                    return repeat + ' ' + 'ساعات';
                }
                return repeat + ' ' + 'ساعة';
            case BaseIntervalType.Day :
                if (repeat == 2) {
                    return 'يومان';
                }
                if (repeat >= 1 && repeat <= 10) {
                    return repeat + ' ' + 'أيام';
                }
                return repeat + ' ' + 'يوم';
            case BaseIntervalType.Week :
                if (repeat == 2) {
                    return 'أسبوعان';
                }
                if (repeat >= 1 && repeat <= 10) {
                    return repeat + ' ' + 'أسابيع';
                }
                return repeat + ' ' + 'أسبوع';
            case BaseIntervalType.Month :
                if (repeat == 2) {
                    return 'شهران';
                }
                if (repeat >= 1 && repeat <= 10) {
                    return repeat + ' ' + 'أشهر';
                }
                return repeat + ' ' + 'شهر';
        }
    }

    private static getCustomIntervalEnglishName(baseIntervalType:BaseIntervalType, repeat:number): string {
        switch (baseIntervalType) {
            case BaseIntervalType.Minute :
                return repeat + ' ' + 'Minutes';
            case BaseIntervalType.Hour :
                return repeat + ' ' + 'Hours';
            case BaseIntervalType.Day :
                return repeat + ' ' + 'Days';
            case BaseIntervalType.Week :
                return repeat + ' ' + 'Weeks';
            case BaseIntervalType.Month :
                return repeat + ' ' + 'Months';
        }
    }

    public static toChartInterval(interval: Interval):number {
        switch(interval.type) {
            case IntervalType.Minute:
                return TimeSpan.MILLISECONDS_IN_MINUTE;
            case IntervalType.FiveMinutes:
                return TimeSpan.MILLISECONDS_IN_MINUTE * 5;
            case IntervalType.TenMinutes:
                return TimeSpan.MILLISECONDS_IN_MINUTE * 10;
            case IntervalType.FifteenMinutes:
                return TimeSpan.MILLISECONDS_IN_MINUTE * 15;
            case IntervalType.ThirtyMinutes:
                return TimeSpan.MILLISECONDS_IN_MINUTE * 30;
            case IntervalType.TwentyMinutes:
                return TimeSpan.MILLISECONDS_IN_MINUTE * 20;
            case IntervalType.SixtyMinutes:
                return TimeSpan.MILLISECONDS_IN_HOUR;
            case IntervalType.FourHours:
                return TimeSpan.MILLISECONDS_IN_HOUR * 4;
            case IntervalType.Day:
                return TimeSpan.MILLISECONDS_IN_DAY;
            case IntervalType.Week:
                return TimeSpan.MILLISECONDS_IN_WEEK;
            case IntervalType.Month:
                return TimeSpan.MILLISECONDS_IN_MONTH;
            case IntervalType.Quarter:
                return TimeSpan.MILLISECONDS_IN_MONTH * 3;
            case IntervalType.Year:
                return TimeSpan.MILLISECONDS_IN_YEAR;
            case IntervalType.Custom:
                switch(interval.base) {
                    case BaseIntervalType.Minute:
                        return TimeSpan.MILLISECONDS_IN_MINUTE * interval.repeat;
                    case BaseIntervalType.Hour:
                        return TimeSpan.MILLISECONDS_IN_HOUR  * interval.repeat;
                    case BaseIntervalType.Day:
                        return TimeSpan.MILLISECONDS_IN_DAY  * interval.repeat;
                    case BaseIntervalType.Week:
                        return TimeSpan.MILLISECONDS_IN_WEEK  * interval.repeat;
                    case BaseIntervalType.Month:
                        return TimeSpan.MILLISECONDS_IN_MONTH  * interval.repeat;
                }
                Tc.error("toChartInterval invalid base interval " + interval.base);
        }
        Tc.error("toChartInterval invalid interval " + interval.type);
        return null;
    }

    public static fromChartInterval(timespan: number): Interval {
        switch(timespan) {
            case TimeSpan.MILLISECONDS_IN_MINUTE:
                return Interval.getIntervalByType(IntervalType.Minute);
            case TimeSpan.MILLISECONDS_IN_MINUTE * 5:
                return Interval.getIntervalByType(IntervalType.FiveMinutes);
            case TimeSpan.MILLISECONDS_IN_MINUTE * 10:
                return Interval.getIntervalByType(IntervalType.TenMinutes);
            case TimeSpan.MILLISECONDS_IN_MINUTE * 15:
                return Interval.getIntervalByType(IntervalType.FifteenMinutes);
            case TimeSpan.MILLISECONDS_IN_MINUTE * 20:
                return Interval.getIntervalByType(IntervalType.TwentyMinutes);
            case TimeSpan.MILLISECONDS_IN_MINUTE * 30:
                return Interval.getIntervalByType(IntervalType.ThirtyMinutes);
            case TimeSpan.MILLISECONDS_IN_HOUR:
                return Interval.getIntervalByType(IntervalType.SixtyMinutes);
            case TimeSpan.MILLISECONDS_IN_HOUR * 4:
                return Interval.getIntervalByType(IntervalType.FourHours);
            case TimeSpan.MILLISECONDS_IN_DAY:
                return Interval.getIntervalByType(IntervalType.Day);
            case TimeSpan.MILLISECONDS_IN_WEEK:
                return Interval.getIntervalByType(IntervalType.Week);
            case TimeSpan.MILLISECONDS_IN_MONTH:
                return Interval.getIntervalByType(IntervalType.Month);
            case TimeSpan.MILLISECONDS_IN_MONTH * 3:
                return Interval.getIntervalByType(IntervalType.Quarter);
            case TimeSpan.MILLISECONDS_IN_YEAR:
                return Interval.getIntervalByType(IntervalType.Year);
            default: // handle custom intervals
                if (timespan >= TimeSpan.MILLISECONDS_IN_MONTH && (timespan%TimeSpan.MILLISECONDS_IN_MONTH) == 0) {
                    let repeat = timespan / TimeSpan.MILLISECONDS_IN_MONTH ;
                    return new Interval(IntervalType.Custom, `${repeat}${this.getCustomServerInterval(BaseIntervalType.Month)}`, "", BaseIntervalType.Month, repeat);
                }
                else if (timespan >= TimeSpan.MILLISECONDS_IN_WEEK && (timespan%TimeSpan.MILLISECONDS_IN_WEEK) == 0) {
                    let repeat = timespan / TimeSpan.MILLISECONDS_IN_WEEK;
                    return new Interval(IntervalType.Custom, `${repeat}${this.getCustomServerInterval(BaseIntervalType.Week)}`, "", BaseIntervalType.Week, repeat);
                }
                else if (timespan >= TimeSpan.MILLISECONDS_IN_DAY && (timespan%TimeSpan.MILLISECONDS_IN_DAY) == 0) {
                    let repeat = timespan / TimeSpan.MILLISECONDS_IN_DAY;
                    return new Interval(IntervalType.Custom, `${repeat}${this.getCustomServerInterval(BaseIntervalType.Day)}`, "", BaseIntervalType.Day, repeat);
                }
                else if (timespan >= TimeSpan.MILLISECONDS_IN_HOUR && (timespan%TimeSpan.MILLISECONDS_IN_HOUR) == 0) {
                    let repeat = timespan / TimeSpan.MILLISECONDS_IN_HOUR;
                    return new Interval(IntervalType.Custom, `${repeat}${this.getCustomServerInterval(BaseIntervalType.Hour)}`, "", BaseIntervalType.Hour, repeat);
                }
                else if (timespan >= TimeSpan.MILLISECONDS_IN_MINUTE && (timespan%TimeSpan.MILLISECONDS_IN_MINUTE) == 0) {
                    let repeat = timespan / TimeSpan.MILLISECONDS_IN_MINUTE;
                    return new Interval(IntervalType.Custom, `${repeat}${this.getCustomServerInterval(BaseIntervalType.Minute)}`, "", BaseIntervalType.Minute, repeat);
                }
        }

        Tc.error("fromChartInterval invalid timespan " + timespan);
        return null;
    }

    public static toAlertServerInterval(interval: IntervalType): string {
        let intervalAsString = Interval.getIntervalByType(interval).serverInterval;
        switch (intervalAsString) {
            case 'half_hour': return '30min';
            case 'hour': return '60min';
            case 'day': return '1day';
            case 'week': return '1week';
            case 'month': return '1month';
            default: return intervalAsString;
        }
    }

    public static fromAlertServerInterval(intervalAsString: string): IntervalType {
        switch (intervalAsString) {
            case '30min':
                intervalAsString = 'half_hour';
                break;
            case '60min':
                intervalAsString = 'hour';
                break;
            case '1day':
                intervalAsString = 'day';
                break;
            case '1week':
                intervalAsString = 'week';
                break;
            case '1month':
                intervalAsString = 'month';
                break;
        }
        return Interval.getIntervalByServerFormat(intervalAsString).type;
    }

    public static getIntervalNameFromCommunityServerMessage(intervalName: string, intervalRepeat: string ,languageService:LanguageService): string {
        let intervalAsString: string = intervalRepeat + intervalName;

        switch (intervalAsString) {
            case '1minute':
                return languageService.translate('دقيقة');
            case '5minute':
                return languageService.translate('5 دقائق');
            case '10minute':
                return languageService.translate('10 دقائق');
            case '15minute':
                return languageService.translate('15 دقيقة');
            case '20minute':
                return languageService.translate('20 دقيقة');
            case '30minute':
                return languageService.translate('30 دقيقة');
            case '60minute':
                return languageService.translate('ساعة');
            case '240minute':
                return languageService.translate('4 ساعات');
            case '1day':
                return languageService.translate('يوم');
            case '1week':
                return languageService.translate('اسبوع');
            case '1month':
                return languageService.translate('شهر');
            case '1year':
                return languageService.translate('سنة');
            case '3month':
                return languageService.translate('ربع سنة');
            case `${intervalRepeat}minute`:
                if(+intervalRepeat % 60 == 0)
                    return languageService.arabic ? this.getCustomIntervalArabicName(BaseIntervalType.Hour, +intervalRepeat / 60) : this.getCustomIntervalEnglishName(BaseIntervalType.Hour,+intervalRepeat / 60);
                return languageService.arabic?` دقيقة  ( ${intervalRepeat} )`:`( ${intervalRepeat} ) Minute`;
            case `${intervalRepeat}day`:
                return languageService.arabic ? this.getCustomIntervalArabicName(BaseIntervalType.Day, +intervalRepeat) : this.getCustomIntervalEnglishName(BaseIntervalType.Day,+intervalRepeat);
            case `${intervalRepeat}week`:
                return languageService.arabic ? this.getCustomIntervalArabicName(BaseIntervalType.Week, +intervalRepeat) : this.getCustomIntervalEnglishName(BaseIntervalType.Week,+intervalRepeat);
            case `${intervalRepeat}month`:
                return languageService.arabic ? this.getCustomIntervalArabicName(BaseIntervalType.Month, +intervalRepeat) : this.getCustomIntervalEnglishName(BaseIntervalType.Month,+intervalRepeat);
                default:
                return null;
        }
    }

    public static translate(interval: Interval , languageService:LanguageService): string {
        if(interval.type == IntervalType.Custom ) {
            return languageService.arabic ? this.getCustomIntervalArabicName(interval.base,interval.repeat) : this.getCustomIntervalEnglishName(interval.base,interval.repeat);
        }
        return languageService.translate(interval.name) ;
    }

    public static getCommunityIntervalMap(intervalType: IntervalType, baseInterval: BaseIntervalType, repeat: number):CommunityInterval {
        switch (intervalType) {
            case IntervalType.Minute :
                return {intervalName: 'minute', intervalRepeat: '1'};
            case IntervalType.FiveMinutes :
                return {intervalName: 'minute', intervalRepeat: '5'};
            case IntervalType.TenMinutes :
                return {intervalName: 'minute', intervalRepeat: '10'};
            case IntervalType.FifteenMinutes :
                return {intervalName: 'minute', intervalRepeat: '15'};
            case IntervalType.TwentyMinutes :
                return {intervalName: 'minute', intervalRepeat: '20'};
            case IntervalType.ThirtyMinutes :
                return {intervalName: 'minute', intervalRepeat: '30'};
            case IntervalType.SixtyMinutes :
                return {intervalName: 'minute', intervalRepeat: '60'};
            case IntervalType.FourHours :
                return {intervalName: 'minute', intervalRepeat: '240'};
            case IntervalType.Day :
                return {intervalName: 'day', intervalRepeat: '1'};
            case IntervalType.Week :
                return {intervalName: 'week', intervalRepeat: '1'};
            case IntervalType.Month :
                return {intervalName: 'month', intervalRepeat: '1'};
            case IntervalType.Quarter :
                return {intervalName: 'month', intervalRepeat: '3'};
            case IntervalType.Year :
                return {intervalName: 'year', intervalRepeat: '1'};
            case IntervalType.Custom:
                switch (baseInterval) {
                    case BaseIntervalType.Minute:
                        return {intervalName: 'minute', intervalRepeat: repeat.toString()};
                    case BaseIntervalType.Hour:
                        return {intervalName: 'minute', intervalRepeat: (repeat * 60 ).toString()};
                    case BaseIntervalType.Day:
                        return {intervalName: 'day', intervalRepeat: repeat.toString()};
                    case BaseIntervalType.Week:
                        return {intervalName: 'week', intervalRepeat: repeat.toString()};
                    case BaseIntervalType.Month:
                        return {intervalName: 'month', intervalRepeat: repeat.toString()};
                }
        }
    }

    public static getIntervalTypeFromCommunityServerMessage(intervalName: string, intervalRepeat: string): IntervalType {
        let intervalAsString: string = intervalRepeat + intervalName;

        switch (intervalAsString) {
            case '1minute':
                return IntervalType.Minute;
            case '5minute':
                return IntervalType.FiveMinutes;
            case '10minute':
                return IntervalType.TenMinutes;
            case '15minute':
                return IntervalType.FifteenMinutes;
            case '30minute':
                return IntervalType.ThirtyMinutes;
            case '20minute':
                return IntervalType.TwentyMinutes;
            case '60minute':
                return IntervalType.SixtyMinutes;
            case '240minute':
                return IntervalType.SixtyMinutes;
            case '1day':
                return IntervalType.Day;
            case '1week':
                return IntervalType.Week;
            case '1month':
                return IntervalType.Month;
            case '1year':
                return IntervalType.Year;
            case '1quarter':
                return IntervalType.Quarter;
            case `${intervalRepeat}minute`:
            case `${intervalRepeat}day`:
            case `${intervalRepeat}week`:
            case `${intervalRepeat}month`:
                return IntervalType.Custom;
            default:
                return null;
        }
    }

    public static getIntervalBaseTypeFromCommunityServerMessage(intervalName: string, intervalRepeat: string): BaseIntervalType {
        if (+intervalRepeat == 60 && intervalName == 'minute')
            return BaseIntervalType.Hour;

        switch (intervalName) {
            case 'minute':
                return BaseIntervalType.Minute;
            case 'hour':
                return BaseIntervalType.Hour;
            case 'day':
                return BaseIntervalType.Day;
            case 'week':
                return BaseIntervalType.Week;
            case 'month':
            case 'year':
            case 'quarter':
                return BaseIntervalType.Month;
            default:
                return null;
        }
    }
}

export interface CommunityInterval {
    intervalName: string,
    intervalRepeat: string
}
