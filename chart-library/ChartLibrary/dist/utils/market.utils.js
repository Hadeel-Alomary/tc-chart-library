import { Tc } from "./tc.utils";
var MarketUtils = (function () {
    function MarketUtils() {
    }
    MarketUtils.marketAbbr = function (symbol) {
        var dotPosition = symbol.lastIndexOf('.');
        Tc.assert(dotPosition !== -1, "invalid symbol " + symbol);
        return symbol.substring(dotPosition + 1);
    };
    MarketUtils.symbolWithoutMarket = function (symbol) {
        var segments = MarketUtils.splitSymbol(symbol);
        Tc.assert(segments.length == 2, "invalid symbol " + symbol);
        return segments[0];
    };
    MarketUtils.marketsOpenCloseTime = function () {
        var allMarkets = [];
        allMarkets.push({ name: 'ASE', openTime: moment('10:30:00', 'HH:mm:ss'), closeTime: moment('12:30:00', 'HH:mm:ss') });
        allMarkets.push({ name: 'TAD', openTime: moment('10:00:00', 'HH:mm:ss'), closeTime: moment('15:20:00', 'HH:mm:ss') });
        allMarkets.push({ name: 'DFM', openTime: moment('10:00:00', 'HH:mm:ss'), closeTime: moment('15:00:00', 'HH:mm:ss') });
        allMarkets.push({ name: 'ADX', openTime: moment('10:00:00', 'HH:mm:ss'), closeTime: moment('15:00:00', 'HH:mm:ss') });
        allMarkets.push({ name: 'KSE', openTime: moment('09:00:00', 'HH:mm:ss'), closeTime: moment('12:45:00', 'HH:mm:ss') });
        allMarkets.push({ name: 'DSM', openTime: moment('09:30:00', 'HH:mm:ss'), closeTime: moment('13:15:00', 'HH:mm:ss') });
        allMarkets.push({ name: 'EGY', openTime: moment('10:00:00', 'HH:mm:ss'), closeTime: moment('14:30:00', 'HH:mm:ss') });
        allMarkets.push({ name: 'USA', openTime: moment('09:30:00', 'HH:mm:ss'), closeTime: moment('16:00:00', 'HH:mm:ss') });
        allMarkets.push({ name: 'FRX', openTime: moment('00:00:00', 'HH:mm:ss'), closeTime: moment('23:59:00', 'HH:mm:ss') });
        return allMarkets;
    };
    MarketUtils.getMarketOpenCloseTime = function (marketAbbr) {
        return this.marketsOpenCloseTime().find(function (market) { return market.name == marketAbbr; });
    };
    MarketUtils.GetShiftHour = function (marketAbbr, time) {
        if (marketAbbr !== 'FRX')
            return 0;
        var daylightSavingTime = this.getForexDaylightSavingTimeRange(time.year());
        if (time.isBetween(daylightSavingTime.start, daylightSavingTime.end))
            return 3;
        return 2;
    };
    MarketUtils.getForexDaylightSavingTimeRange = function (year) {
        if (!this.forexDayLightSavingRangeCache[year]) {
            var timeRange = {
                start: moment(this.nthDayOfMonth(moment("".concat(year, "-03-01")), 7, 2)),
                end: moment(this.nthDayOfMonth(moment("".concat(year, "-11-01")), 7, 1))
            };
            this.forexDayLightSavingRangeCache[year] = timeRange;
        }
        return this.forexDayLightSavingRangeCache[year];
    };
    MarketUtils.nthDayOfMonth = function (time, day, weekNumber) {
        var m = time.clone()
            .startOf('month')
            .day(day);
        if (m.month() !== time.month())
            m.add(7, 'd');
        return m.add(7 * (weekNumber - 1), 'd').format('YYYY-MM-DD');
    };
    MarketUtils.splitTopic = function (topic) {
        var indexOfFirstDot = topic.indexOf('.');
        var indexOfLastDot = topic.lastIndexOf('.');
        var firstWord = topic.substr(0, indexOfFirstDot);
        var secondWord = topic.substr(indexOfFirstDot + 1, indexOfLastDot - (firstWord.length + 1));
        var lastWord = topic.substr(indexOfLastDot + 1);
        return [firstWord, secondWord, lastWord];
    };
    MarketUtils.splitSymbol = function (symbol) {
        var indexOfLastDot = symbol.lastIndexOf('.');
        var firstWord = symbol.substr(0, indexOfLastDot);
        var secondWord = symbol.substr(indexOfLastDot + 1);
        return [firstWord, secondWord];
    };
    MarketUtils.forexDayLightSavingRangeCache = {};
    return MarketUtils;
}());
export { MarketUtils };
//# sourceMappingURL=market.utils.js.map