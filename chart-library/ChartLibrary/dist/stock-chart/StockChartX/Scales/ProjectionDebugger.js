import { IntervalUtils } from '../../../utils/interval.utils';
import { Interval } from "../../../services/loader/price-loader/interval";
var ProjectionDebugger = (function () {
    function ProjectionDebugger() {
    }
    ProjectionDebugger.validateNumberOfFutureCandlesComputation = function (market, interval, seriesLastDate, date, numberOfFutureCandles) {
        return;
        var dateAsString = IntervalUtils.getGroupingMomentTime(market.abbreviation, interval, moment(date)).format('YYYY-MM-DD HH:mm:ss');
        var seriesDateAsString = moment(seriesLastDate).format('YYYY-MM-DD HH:mm:ss');
        var recomputedDate = moment(market.findProjectedFutureDate(seriesLastDate, numberOfFutureCandles, interval));
        var recomputedDateAsString = recomputedDate.format('YYYY-MM-DD HH:mm:ss');
        var matching = recomputedDateAsString == dateAsString;
        if (!matching && !Interval.isDaily(interval) && dateAsString.endsWith(" 00:00:00")) {
            matching = dateAsString.substr(0, 10) == recomputedDateAsString.substr(0, 10);
        }
        if (!matching) {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FAIL TO VALIDATE NUMBER OF FUTURE CANDLES COMPUTATION =>');
            console.log("interval        : " + interval.base);
            console.log("interval repeat : " + interval.repeat);
            console.log("series date     : " + seriesDateAsString);
            console.log("future candles  : " + numberOfFutureCandles);
            console.log("date            : " + dateAsString);
            console.log("recomputed date : " + moment(recomputedDate).format('YYYY-MM-DD HH:mm:ss'));
        }
    };
    ProjectionDebugger.validateFutureDateComputation = function (market, interval, seriesLastDate, numberOfCandles, futureDate) {
        return;
        var recomputedNumberOfCandles = market.findProjectNumberOfCandlesBetweenDates(seriesLastDate, futureDate, interval);
        var seriesDateAsString = moment(seriesLastDate).format('YYYY-MM-DD HH:mm:ss');
        var futureDateAsString = moment(futureDate).format('YYYY-MM-DD HH:mm:ss');
        if (numberOfCandles != recomputedNumberOfCandles) {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< FAIL TO VALIDATE FUTURE DATE COMPUTATION =>');
            console.log("interval                   : " + interval.base);
            console.log("interval repeat            : " + interval.repeat);
            console.log("series date                : " + seriesDateAsString);
            console.log("future date                : " + futureDateAsString);
            console.log("numberOfCandles            : " + numberOfCandles);
            console.log("recomputed numberOfCandles : " + recomputedNumberOfCandles);
        }
    };
    return ProjectionDebugger;
}());
export { ProjectionDebugger };
//# sourceMappingURL=ProjectionDebugger.js.map