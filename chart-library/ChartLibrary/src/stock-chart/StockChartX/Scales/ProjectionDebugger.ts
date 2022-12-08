import {Interval, Market} from '../../../services/loader';
import {IntervalUtils} from '../../../utils/interval.utils';
import {Config} from '../../../config/config';

export class ProjectionDebugger {

    // MA validation of numberOfFutureCandles computation. This is done by looking the date for computed numberOfFutureCandles, and
    // compare it to the passed date. Ideally, they should match.
    static validateNumberOfFutureCandlesComputation(market: Market, interval: Interval, seriesLastDate: Date, date: Date, numberOfFutureCandles: number) {

        return; // enable debugger when needed

        if(Config.isProd()) {
            return;
        }

        let dateAsString = IntervalUtils.getGroupingMomentTime(market.abbreviation, interval, moment(date)).format('YYYY-MM-DD HH:mm:ss');
        let seriesDateAsString = moment(seriesLastDate).format('YYYY-MM-DD HH:mm:ss');
        let recomputedDate = moment(market.findProjectedFutureDate(seriesLastDate, numberOfFutureCandles, interval));
        let recomputedDateAsString = recomputedDate.format('YYYY-MM-DD HH:mm:ss');

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // MA when date belongs to a daily interval, while interval chosen is intra-day interval, then if no matching happens,
        // it should be correct if the "dates" both matches.
        let matching = recomputedDateAsString == dateAsString;
        if(!matching && !Interval.isDaily(interval) && dateAsString.endsWith(" 00:00:00")) {
            matching = dateAsString.substr(0, 10) == recomputedDateAsString.substr(0, 10);
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if(!matching ){
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FAIL TO VALIDATE NUMBER OF FUTURE CANDLES COMPUTATION =>');
            console.log("interval        : " + interval.base);
            console.log("interval repeat : " + interval.repeat);
            console.log("series date     : " + seriesDateAsString);
            console.log("future candles  : " + numberOfFutureCandles);
            console.log("date            : " + dateAsString);
            console.log("recomputed date : " + moment(recomputedDate).format('YYYY-MM-DD HH:mm:ss'));
        }

    }


    // MA validation of futureDate computation. This is done by looking number of candles of computed future date, and compare it with the
    // original number of candles passed in.
    static validateFutureDateComputation(market: Market, interval: Interval, seriesLastDate: Date, numberOfCandles: number, futureDate: Date) {

        return; // enable debugger when needed

        if(Config.isProd()) {
            return;
        }

        let recomputedNumberOfCandles = market.findProjectNumberOfCandlesBetweenDates(seriesLastDate, futureDate, interval);
        let seriesDateAsString = moment(seriesLastDate).format('YYYY-MM-DD HH:mm:ss');
        let futureDateAsString = moment(futureDate).format('YYYY-MM-DD HH:mm:ss');

        if(numberOfCandles != recomputedNumberOfCandles) {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< FAIL TO VALIDATE FUTURE DATE COMPUTATION =>');
            console.log("interval                   : " + interval.base);
            console.log("interval repeat            : " + interval.repeat);
            console.log("series date                : " + seriesDateAsString);
            console.log("future date                : " + futureDateAsString);
            console.log("numberOfCandles            : " + numberOfCandles);
            console.log("recomputed numberOfCandles : " + recomputedNumberOfCandles);
        }


    }


}
