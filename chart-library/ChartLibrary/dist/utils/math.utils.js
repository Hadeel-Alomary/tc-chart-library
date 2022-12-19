import { Tc } from './tc.utils';
import { MarketUtils } from './market.utils';
var MathUtils = (function () {
    function MathUtils() {
    }
    MathUtils.roundToNearestStep = function (value, step) {
        value *= 1000;
        step *= 1000;
        var mod = value % step;
        var halfStep = step / 2.0;
        if (mod < halfStep) {
            return (value - mod) / 1000;
        }
        else {
            return (value - mod + step) / 1000;
        }
    };
    MathUtils.roundAccordingMarket = function (value, symbol) {
        var splitted = MarketUtils.splitSymbol(symbol);
        Tc.assert(splitted.length == 2, "fail to roundToRequiredDigits. Invalid symbol " + symbol);
        if (splitted[1] == "FRX") {
            return this._5digits(value);
        }
        else
            return this._3digits(value);
    };
    MathUtils._3digits = function (num) {
        return Math.round(num * 1000) / 1000;
    };
    MathUtils._5digits = function (num) {
        return Math.round(num * 100000) / 100000;
    };
    return MathUtils;
}());
export { MathUtils };
//# sourceMappingURL=math.utils.js.map