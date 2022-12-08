import { TimeSpan } from "../Data/TimeFrame";
var MeasuringUtil = (function () {
    function MeasuringUtil() {
    }
    MeasuringUtil.getMeasuringValues = function (points, chartPanel) {
        var measuringPoint1 = { date: points[0].date, price: points[0].value }, measuringPoint2 = { date: points[1].date, price: points[1].value }, changeValues = MeasuringUtil.getChangValues(measuringPoint1, measuringPoint2), barsCount = MeasuringUtil.getBarsCount(measuringPoint1, measuringPoint2, chartPanel), period = MeasuringUtil.getPeriod(measuringPoint1, measuringPoint2, chartPanel);
        return {
            change: changeValues.change,
            changePercentage: changeValues.changePercentage,
            barsCount: barsCount,
            period: period
        };
    };
    MeasuringUtil.getChangValues = function (measuringPoint1, measuringPoint2) {
        var change = measuringPoint2.price - measuringPoint1.price;
        return {
            change: change,
            changePercentage: (change / measuringPoint1.price) * 100
        };
    };
    MeasuringUtil.getBarsCount = function (measuringPoint1, measuringPoint2, chartPanel) {
        var bars = 0;
        var firstDate = measuringPoint1.date > measuringPoint2.date ? measuringPoint2.date : measuringPoint1.date;
        var secondDate = measuringPoint1.date > measuringPoint2.date ? measuringPoint1.date : measuringPoint2.date;
        for (var _i = 0, _a = chartPanel.chart.barDataSeries().date.values; _i < _a.length; _i++) {
            var date = _a[_i];
            if (date <= firstDate)
                continue;
            if (date > secondDate)
                break;
            bars += 1;
        }
        if (measuringPoint1.date > measuringPoint2.date) {
            bars = bars * -1;
        }
        return bars;
    };
    MeasuringUtil.getPeriod = function (measuringPoint1, measuringPoint2, chartPanel) {
        var firstDate = measuringPoint1.date > measuringPoint2.date ? MeasuringUtil.mapToCandleDate(measuringPoint2.date, chartPanel) : MeasuringUtil.mapToCandleDate(measuringPoint1.date, chartPanel);
        var secondDate = measuringPoint1.date > measuringPoint2.date ? MeasuringUtil.mapToCandleDate(measuringPoint1.date, chartPanel) : MeasuringUtil.mapToCandleDate(measuringPoint2.date, chartPanel);
        var period;
        if (TimeSpan.MILLISECONDS_IN_DAY <= chartPanel.chart.timeInterval) {
            var days = moment(secondDate).diff(moment(firstDate), 'days');
            if (measuringPoint1.date > measuringPoint2.date) {
                days *= -1;
            }
            period = days + 'd';
        }
        else {
            var minutes = moment(secondDate).diff(moment(firstDate), 'minutes');
            var hours = Math.floor(minutes / 60);
            minutes = minutes % 60;
            var days = Math.floor(hours / 24);
            hours = hours % 24;
            if (days) {
                period = days + 'd  ' + hours + 'h  ' + minutes + 'm';
            }
            else if (hours) {
                period = hours + 'h ' + minutes + 'm';
            }
            else {
                period = minutes + 'm';
            }
            if (measuringPoint1.date > measuringPoint2.date) {
                period = '- ' + period;
            }
        }
        return period;
    };
    MeasuringUtil.mapToCandleDate = function (date, chartPanel) {
        var column = chartPanel.projection.columnByDate(date);
        return chartPanel.projection.dateByColumn(column);
    };
    return MeasuringUtil;
}());
export { MeasuringUtil };
//# sourceMappingURL=MeasuringUtil.js.map