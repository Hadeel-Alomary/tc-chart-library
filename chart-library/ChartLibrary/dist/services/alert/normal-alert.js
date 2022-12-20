var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { AlertOperator } from './alert-operator';
import { AlertField } from './alert-field';
import { AbstractAlert } from './abstract-alert';
import { AlertType } from './alert-type';
import { NotificationMethods } from '../notification';
import { AlertTriggerType } from './alert-trigger';
import { IntervalType } from '../loader/price-loader/interval-type';
var NormalAlert = (function (_super) {
    __extends(NormalAlert, _super);
    function NormalAlert(id, interval, paused, reactivateMinutes, triggerTypeValue, fireOnChange, expiryDate, message, language, expired, createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted, field, operator, value) {
        var _this = _super.call(this, id, interval, paused, reactivateMinutes, triggerTypeValue, fireOnChange, expiryDate, message, language, expired, createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted) || this;
        _this.field = field;
        _this.operator = operator;
        _this.value = value;
        return _this;
    }
    NormalAlert.createNewAlert = function (language, company, value) {
        if (value === void 0) { value = 0; }
        return new NormalAlert(null, IntervalType.Day, false, false, AlertTriggerType.ONCE, false, moment().add(3, 'days').format('YYYY-MM-DD 00:00:00'), '', language, false, moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 00:00:00'), company, null, [], new NotificationMethods(), AlertType.NORMAL, false, 'last', AlertOperator.fromOperationSymbol('>').id, +value.toFixed(2));
    };
    NormalAlert.prototype.getCondition = function (languageService) {
        var fieldText = languageService.translate(AlertField.getFieldById(this.field).name);
        var operatorText = languageService.translate(AlertOperator.fromId(this.operator).name);
        return fieldText + " " + operatorText + " " + this.value;
    };
    NormalAlert.prototype.getEquation = function () {
        return this.field + " " + AlertOperator.fromId(this.operator).operationSymbol + " " + this.value;
    };
    NormalAlert.prototype.getEquationDescription = function () {
        return JSON.stringify({
            Operands: [this.field, "" + this.value],
            Operation: AlertOperator.fromId(this.operator).operationSymbol
        });
    };
    return NormalAlert;
}(AbstractAlert));
export { NormalAlert };
//# sourceMappingURL=normal-alert.js.map