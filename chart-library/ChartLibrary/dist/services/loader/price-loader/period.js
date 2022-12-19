import { DateUtils, Tc } from '../../../utils/index';
import { PeriodType } from './period-type';
var Period = (function () {
    function Period(type, serverPeriod, name) {
        this.type = type;
        this.serverPeriod = serverPeriod;
        this.name = name;
    }
    Period.getPeriodByType = function (type) {
        var result = Period.getPeriods().find(function (period) { return period.type == type; });
        Tc.assert(result != null, "fail to find period");
        return result;
    };
    Period.getPeriodByString = function (serverPeriod) {
        var result = Period.getPeriods().find(function (period) { return period.serverPeriod == serverPeriod; });
        Tc.assert(result != null, "fail to find period");
        return result;
    };
    Period.getLargerPeriod = function (period1, period2) {
        return period1.type < period2.type ? period2 : period1;
    };
    Period.getStartDate = function (marketAbrv, periodType) {
        var startDate;
        switch (periodType) {
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
                startDate = moment(new Date()).subtract(20, 'years').format('YYYY-MM-DD');
                break;
        }
        return startDate;
    };
    Period.getClosestPeriodContainingDate = function (marketAbrv, date) {
        for (var periodType = PeriodType.Day; periodType < PeriodType.All; ++periodType) {
            if (Period.getStartDate(marketAbrv, periodType) < date) {
                return Period.getPeriodByType(periodType);
            }
        }
        return Period.getPeriodByType(PeriodType.All);
    };
    Period.getPeriods = function () {
        if (!Period.periods.length) {
            Period.periods.push(new Period(PeriodType.Day, '1day', 'يوم'));
            Period.periods.push(new Period(PeriodType.TwoDays, '2days', 'يومان'));
            Period.periods.push(new Period(PeriodType.ThreeDays, '3days', 'ثلاثة أيام'));
            Period.periods.push(new Period(PeriodType.Week, '1week', 'اسبوع'));
            Period.periods.push(new Period(PeriodType.TwoWeeks, '2weeks', 'اسبوعان'));
            Period.periods.push(new Period(PeriodType.Month, '1month', 'شهر'));
            Period.periods.push(new Period(PeriodType.TwoMonths, '2months', 'شهران'));
            Period.periods.push(new Period(PeriodType.ThreeMonths, '3months', 'ثلاثة شهور'));
            Period.periods.push(new Period(PeriodType.SixthMonths, '6months', 'ستة شهور'));
            Period.periods.push(new Period(PeriodType.YearToDate, 'ytd', 'من بداية السنة'));
            Period.periods.push(new Period(PeriodType.Year, '1year', 'سنة'));
            Period.periods.push(new Period(PeriodType.TwoYears, '2years', 'سنتان'));
            Period.periods.push(new Period(PeriodType.ThreeYears, '3years', 'ثلاث سنوات'));
            Period.periods.push(new Period(PeriodType.FiveYears, '5years', 'خمس سنوات'));
            Period.periods.push(new Period(PeriodType.TenYears, '10years', 'عشر سنوات'));
            Period.periods.push(new Period(PeriodType.All, 'all', 'جميع البيانات'));
        }
        return Period.periods;
    };
    Period.periods = [];
    return Period;
}());
export { Period };
//# sourceMappingURL=period.js.map