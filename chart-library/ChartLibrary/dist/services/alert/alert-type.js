import { Tc } from '../../utils';
var AlertTypeWrapper = (function () {
    function AlertTypeWrapper(type, arabic, english) {
        this.type = type;
        this.arabic = arabic;
        this.english = english;
    }
    AlertTypeWrapper.getAlertTypeWrappers = function () {
        if (AlertTypeWrapper.allWrappers.length == 0) {
            this.allWrappers.push(new AlertTypeWrapper(AlertType.NORMAL, 'تنبيه بسيط', 'Simple Alert'));
            this.allWrappers.push(new AlertTypeWrapper(AlertType.TREND, 'تنبيه خط اتجاه', 'Trend Line Alert'));
            this.allWrappers.push(new AlertTypeWrapper(AlertType.TECHNICAL, 'تنبيه رسم بياني', 'Chart Alert'));
        }
        return AlertTypeWrapper.allWrappers;
    };
    AlertTypeWrapper.fromType = function (alertType) {
        var result = AlertTypeWrapper.getAlertTypeWrappers().find(function (wrapper) { return wrapper.type == alertType; });
        Tc.assert(result != null, 'Unsupported Alert Type Value: ' + alertType);
        return result;
    };
    AlertTypeWrapper.allWrappers = [];
    return AlertTypeWrapper;
}());
export { AlertTypeWrapper };
export var AlertType;
(function (AlertType) {
    AlertType[AlertType["NORMAL"] = 1] = "NORMAL";
    AlertType[AlertType["TREND"] = 2] = "TREND";
    AlertType[AlertType["TECHNICAL"] = 3] = "TECHNICAL";
})(AlertType || (AlertType = {}));
//# sourceMappingURL=alert-type.js.map