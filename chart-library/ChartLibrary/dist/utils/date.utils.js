var DateUtils = (function () {
    function DateUtils() {
    }
    DateUtils.subtractBusinessDays = function (marketAbrv, days) {
        var date = new Date();
        var remainingDays = days;
        while (remainingDays > 0) {
            date = moment(date).subtract(1, 'days').toDate();
            if (DateUtils.isBusinessDay(marketAbrv, date)) {
                remainingDays -= 1;
            }
        }
        return date;
    };
    DateUtils.getLastBusinessDay = function (marketAbrv) {
        var date = new Date();
        while (!DateUtils.isBusinessDay(marketAbrv, date)) {
            date = moment(date).subtract(1, 'days').toDate();
        }
        return date;
    };
    DateUtils.toDate = function (dateTime) {
        return dateTime.substr(0, 'YYYY-MM-DD'.length);
    };
    DateUtils.isBusinessDay = function (marketAbrv, date) {
        if (marketAbrv == "USA" || marketAbrv == "FRX" || marketAbrv == "DFM" || marketAbrv == "ADX") {
            return date.getDay() != 6 && date.getDay() != 0;
        }
        return date.getDay() != 5 && date.getDay() != 6;
    };
    return DateUtils;
}());
export { DateUtils };
//# sourceMappingURL=date.utils.js.map