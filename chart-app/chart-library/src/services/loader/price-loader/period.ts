import {DateUtils, Tc} from '../../../utils/index';
import {PeriodType} from './period-type';

export type PeriodString = '1day'|'2days'|'3days'|'1week'|'2weeks'|'1month'|'2months'|'3months'|'6months'|'ytd'|'1year'|'2years'|'3years'|'5years'|'10years'|'all';

export class Period {

    private static periods:Period[] = [];

    constructor(public type:PeriodType,
                public serverPeriod:PeriodString,
                public name:string) { }

    static getPeriodByType(type:PeriodType):Period {
        let result:Period = Period.getPeriods().find(period => period.type == type);
        Tc.assert(result != null, "fail to find period");
        return result;
    }

    static getPeriodByString(serverPeriod:PeriodString):Period {
        let result:Period = Period.getPeriods().find(period => period.serverPeriod == serverPeriod);
        Tc.assert(result != null, "fail to find period");
        return result;
    }

    static getLargerPeriod(period1:Period, period2:Period):Period {
        return period1.type < period2.type ? period2: period1;
    }

    // MA return the start date of the period, compared to today. Used by chart for zooming on period
    static getStartDate(marketAbrv: string, periodType:PeriodType):string {

        let startDate:string;

        switch(periodType) {
            case PeriodType.Day:
                startDate = moment(DateUtils.getLastBusinessDay(marketAbrv)).format('YYYY-MM-DD');
                break;
            case PeriodType.TwoDays:
                startDate = moment(DateUtils.subtractBusinessDays(marketAbrv, 2)).format('YYYY-MM-DD');
                break;
            case PeriodType.ThreeDays:
                startDate = moment(DateUtils.subtractBusinessDays(marketAbrv, 3)).format('YYYY-MM-DD');
                break;
            case PeriodType.Week:
                startDate = moment(new Date()).subtract(1, 'weeks').format('YYYY-MM-DD');
                break;
            case PeriodType.TwoWeeks:
                startDate = moment(new Date()).subtract(2, 'weeks').format('YYYY-MM-DD');
                break;
            case PeriodType.Month:
                startDate = moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD');
                break;
            case PeriodType.TwoMonths:
                startDate = moment(new Date()).subtract(2, 'months').format('YYYY-MM-DD');
                break;
            case PeriodType.ThreeMonths:
                startDate = moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD');
                break;
            case PeriodType.SixthMonths:
                startDate = moment(new Date()).subtract(6, 'months').format('YYYY-MM-DD');
                break;
            case PeriodType.YearToDate:
                startDate = moment(new Date()).startOf('year').format('YYYY-MM-DD');
                break;
            case PeriodType.Year:
                startDate = moment(new Date()).subtract(1, 'years').format('YYYY-MM-DD');
                break;
            case PeriodType.TwoYears:
                startDate = moment(new Date()).subtract(2, 'years').format('YYYY-MM-DD');
                break;
            case PeriodType.ThreeYears:
                startDate = moment(new Date()).subtract(3, 'years').format('YYYY-MM-DD');
                break;
            case PeriodType.FiveYears:
                startDate = moment(new Date()).subtract(5, 'years').format('YYYY-MM-DD');
                break;
            case PeriodType.TenYears:
                startDate = moment(new Date()).subtract(10, 'years').format('YYYY-MM-DD');
                break;
            case PeriodType.All:
                startDate = moment(new Date()).subtract(20, 'years').format('YYYY-MM-DD'); // all == 20 years!
                break;
        }

        return startDate;

    }


    public static getClosestPeriodContainingDate(marketAbrv:string, date:string):Period {
        // MA try to find a defined period that encapsulate the date. If none is found, then return all.
        for(let periodType = PeriodType.Day; periodType < PeriodType.All; ++periodType){
            if(Period.getStartDate(marketAbrv, periodType) < date){
                return Period.getPeriodByType(periodType);
            }
        }
        return Period.getPeriodByType(PeriodType.All);
    }

    private static getPeriods():Period[] {

        if(!Period.periods.length){
            Period.periods.push(new Period(PeriodType.Day         , '1day'    , 'يوم'));
            Period.periods.push(new Period(PeriodType.TwoDays     , '2days'   , 'يومان'));
            Period.periods.push(new Period(PeriodType.ThreeDays   , '3days'   , 'ثلاثة أيام'));
            Period.periods.push(new Period(PeriodType.Week        , '1week'   , 'اسبوع'));
            Period.periods.push(new Period(PeriodType.TwoWeeks    , '2weeks'  , 'اسبوعان'));
            Period.periods.push(new Period(PeriodType.Month       , '1month'  , 'شهر'));
            Period.periods.push(new Period(PeriodType.TwoMonths   , '2months' , 'شهران'));
            Period.periods.push(new Period(PeriodType.ThreeMonths , '3months' , 'ثلاثة شهور'));
            Period.periods.push(new Period(PeriodType.SixthMonths , '6months' , 'ستة شهور'));
            Period.periods.push(new Period(PeriodType.YearToDate  , 'ytd'     , 'من بداية السنة'));
            Period.periods.push(new Period(PeriodType.Year        , '1year'   , 'سنة'));
            Period.periods.push(new Period(PeriodType.TwoYears    , '2years'  , 'سنتان'));
            Period.periods.push(new Period(PeriodType.ThreeYears  , '3years'  , 'ثلاث سنوات'));
            Period.periods.push(new Period(PeriodType.FiveYears   , '5years'  , 'خمس سنوات'));
            Period.periods.push(new Period(PeriodType.TenYears    , '10years' , 'عشر سنوات'));
            Period.periods.push(new Period(PeriodType.All         , 'all'     , 'جميع البيانات'));
        }

        return Period.periods;

    }

}
