var AlertTrigger = (function () {
    function AlertTrigger(type, arabic, english) {
        this.type = type;
        this.arabic = arabic;
        this.english = english;
    }
    AlertTrigger.getTrendLineAlertTriggers = function () {
        if (AlertTrigger.trendLineAlertTriggers.length == 0) {
            AlertTrigger.trendLineAlertTriggers.push(new AlertTrigger(AlertTriggerType.ONCE, 'عند الاختراق', 'On cross'));
            AlertTrigger.trendLineAlertTriggers.push(new AlertTrigger(AlertTriggerType.ONCE_ON_CANDLE_CLOSE, 'عند الاختراق مع إغلاق الشمعة', 'On cross with candle close'));
        }
        return AlertTrigger.trendLineAlertTriggers;
    };
    AlertTrigger.getChartAlertTriggers = function () {
        if (AlertTrigger.chartAlertTriggers.length == 0) {
            AlertTrigger.chartAlertTriggers.push(new AlertTrigger(AlertTriggerType.ONCE, 'مرة واحدة', 'Once'));
            AlertTrigger.chartAlertTriggers.push(new AlertTrigger(AlertTriggerType.ONCE_ON_CANDLE_CLOSE, 'مرة واحدة عند إغلاق الشمعة', 'Once on candle close'));
            AlertTrigger.chartAlertTriggers.push(new AlertTrigger(AlertTriggerType.EVERY_CANDLE, 'مرة لكل شمعة', 'Every candle'));
            AlertTrigger.chartAlertTriggers.push(new AlertTrigger(AlertTriggerType.EVERY_CANDLE_CLOSE, 'عند إغلاق كل شمعة', 'Every candle close'));
        }
        return AlertTrigger.chartAlertTriggers;
    };
    AlertTrigger.trendLineAlertTriggers = [];
    AlertTrigger.chartAlertTriggers = [];
    return AlertTrigger;
}());
export { AlertTrigger };
export var AlertTriggerType;
(function (AlertTriggerType) {
    AlertTriggerType[AlertTriggerType["ONCE"] = 1] = "ONCE";
    AlertTriggerType[AlertTriggerType["ONCE_ON_CANDLE_CLOSE"] = 2] = "ONCE_ON_CANDLE_CLOSE";
    AlertTriggerType[AlertTriggerType["EVERY_CANDLE"] = 3] = "EVERY_CANDLE";
    AlertTriggerType[AlertTriggerType["EVERY_CANDLE_CLOSE"] = 4] = "EVERY_CANDLE_CLOSE";
})(AlertTriggerType || (AlertTriggerType = {}));
//# sourceMappingURL=alert-trigger.js.map