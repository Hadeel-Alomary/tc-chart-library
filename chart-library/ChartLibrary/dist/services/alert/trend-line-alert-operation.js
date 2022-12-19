import { Tc } from '../../utils';
var TrendLineAlertOperation = (function () {
    function TrendLineAlertOperation(type, arabic, english) {
        this.type = type;
        this.arabic = arabic;
        this.english = english;
    }
    TrendLineAlertOperation.getTrendLineAlertOperations = function () {
        if (TrendLineAlertOperation.trendLineAlertOperations.length == 0) {
            TrendLineAlertOperation.trendLineAlertOperations.push(new TrendLineAlertOperation(TrendLineAlertOperationType.CROSS_UP, 'اختراق خط اتجاه للأعلى', 'Break Up Trend Line'));
            TrendLineAlertOperation.trendLineAlertOperations.push(new TrendLineAlertOperation(TrendLineAlertOperationType.CROSS_DOWN, 'اختراق خط اتجاه للأسفل', 'Break Down Trend Line'));
        }
        return TrendLineAlertOperation.trendLineAlertOperations;
    };
    TrendLineAlertOperation.fromType = function (type) {
        var result = TrendLineAlertOperation.getTrendLineAlertOperations().find(function (operation) { return operation.type == type; });
        Tc.assert(result != null, 'Unsupported Trend Line Alert Operation Value');
        return result;
    };
    TrendLineAlertOperation.trendLineAlertOperations = [];
    return TrendLineAlertOperation;
}());
export { TrendLineAlertOperation };
export var TrendLineAlertOperationType;
(function (TrendLineAlertOperationType) {
    TrendLineAlertOperationType[TrendLineAlertOperationType["CROSS_UP"] = 1] = "CROSS_UP";
    TrendLineAlertOperationType[TrendLineAlertOperationType["CROSS_DOWN"] = 2] = "CROSS_DOWN";
})(TrendLineAlertOperationType || (TrendLineAlertOperationType = {}));
//# sourceMappingURL=trend-line-alert-operation.js.map