import { JsUtil } from "../Utils/JsUtil";
export var TimeSpan = {
    MILLISECONDS_IN_YEAR: 31556926000,
    MILLISECONDS_IN_MONTH: 2629743830,
    MILLISECONDS_IN_WEEK: 604800000,
    MILLISECONDS_IN_DAY: 86400000,
    MILLISECONDS_IN_HOUR: 3600000,
    MILLISECONDS_IN_MINUTE: 60000,
    MILLISECONDS_IN_SECOND: 1000
};
Object.freeze(TimeSpan);
export var Periodicity = {
    TICK: "t",
    SECOND: "s",
    MINUTE: "",
    HOUR: "h",
    DAY: "d",
    WEEK: "w",
    MONTH: "m",
    YEAR: "y"
};
Object.freeze(Periodicity);
var TimeFrame = (function () {
    function TimeFrame(periodicity, interval) {
        this.periodicity = periodicity || Periodicity.MINUTE;
        this.interval = JsUtil.isFiniteNumber(interval) ? interval : 1;
    }
    TimeFrame.prototype.toString = function () {
        return "".concat(this.interval, " ").concat(TimeFrame.periodicityToString);
    };
    TimeFrame.periodicityToString = function (periodicity) {
        switch (periodicity) {
            case Periodicity.TICK:
                return "tick";
            case Periodicity.SECOND:
                return "second";
            case Periodicity.MINUTE:
                return "minute";
            case Periodicity.HOUR:
                return "hour";
            case Periodicity.DAY:
                return "day";
            case Periodicity.WEEK:
                return "week";
            case Periodicity.MONTH:
                return "month";
            case Periodicity.YEAR:
                return "year";
            default:
                throw new Error("Unsupported periodicity: " + periodicity);
        }
    };
    TimeFrame.timeIntervalToTimeFrame = function (timeInterval) {
        if (timeInterval >= TimeSpan.MILLISECONDS_IN_YEAR) {
            return new TimeFrame(Periodicity.YEAR, timeInterval / TimeSpan.MILLISECONDS_IN_YEAR);
        }
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_MONTH) {
            return new TimeFrame(Periodicity.MONTH, timeInterval / TimeSpan.MILLISECONDS_IN_MONTH);
        }
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_WEEK) {
            return new TimeFrame(Periodicity.WEEK, timeInterval / TimeSpan.MILLISECONDS_IN_WEEK);
        }
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_DAY) {
            return new TimeFrame(Periodicity.DAY, timeInterval / TimeSpan.MILLISECONDS_IN_DAY);
        }
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_HOUR) {
            return new TimeFrame(Periodicity.HOUR, timeInterval / TimeSpan.MILLISECONDS_IN_HOUR);
        }
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_MINUTE) {
            return new TimeFrame(Periodicity.MINUTE, timeInterval / TimeSpan.MILLISECONDS_IN_MINUTE);
        }
        else if (timeInterval >= TimeSpan.MILLISECONDS_IN_SECOND) {
            return new TimeFrame(Periodicity.SECOND, timeInterval / TimeSpan.MILLISECONDS_IN_SECOND);
        }
        else {
            throw new Error("Unsupported time interval: " + timeInterval);
        }
    };
    return TimeFrame;
}());
export { TimeFrame };
//# sourceMappingURL=TimeFrame.js.map