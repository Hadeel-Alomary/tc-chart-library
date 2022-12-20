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
import { AlertType } from './alert-type';
import { NotificationMethods } from '../notification';
import { ChartAlertFunction, ChartAlertFunctionType } from './chart-alert-function';
import { AlertTriggerType } from './alert-trigger';
import { Interval } from '../loader/price-loader/interval';
import { HostedAlert } from './hosted-alert';
import { StringUtils } from '../../utils';
import { MathUtils } from '../../utils/math.utils';
var ChartAlert = (function (_super) {
    __extends(ChartAlert, _super);
    function ChartAlert(id, interval, paused, reactivateMinutes, triggerType, fireOnChange, expiryDate, message, language, expired, createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted, hostId, equationDefinition) {
        var _this = _super.call(this, id, interval, paused, reactivateMinutes, triggerType, fireOnChange, expiryDate, message, language, expired, createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted, hostId) || this;
        _this.equationDefinition = equationDefinition;
        return _this;
    }
    Object.defineProperty(ChartAlert.prototype, "parameter", {
        get: function () {
            return this.equationDefinition.indicator;
        },
        set: function (indicator) {
            this.equationDefinition.indicator = indicator;
        },
        enumerable: true,
        configurable: true
    });
    ChartAlert.createNewAlert = function (language, company, intervalType, hostId, equationDefinition) {
        return new ChartAlert(null, intervalType, false, false, AlertTriggerType.ONCE, false, moment().add(3, 'days').format('YYYY-MM-DD 00:00:00'), '', language, false, moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 00:00:00'), company, null, [], new NotificationMethods(), AlertType.TECHNICAL, false, hostId, equationDefinition);
    };
    ChartAlert.prototype.getCondition = function (languageService) {
        var template = languageService.arabic ?
            ChartAlertFunction.fromType(this.equationDefinition.alertFunctionType).arabicMessageTemplate :
            ChartAlertFunction.fromType(this.equationDefinition.alertFunctionType).englishMessageTemplate;
        return template
            .replace('INDICATOR', StringUtils.markLeftToRightInRightToLeftContext(this.parameter.selectedIndicatorField + this.parameter.indicatorParametersString))
            .replace('VALUE1', StringUtils.formatVariableDigitsNumber(MathUtils.roundAccordingMarket(this.equationDefinition.value1, this.company.symbol)))
            .replace('VALUE2', StringUtils.formatVariableDigitsNumber(MathUtils.roundAccordingMarket(this.equationDefinition.value2, this.company.symbol)));
    };
    ChartAlert.prototype.getEquation = function () {
        var technicalFunction = this.getTechnicalFunction();
        var serverInterval = Interval.toAlertServerInterval(this.interval);
        var p1 = [this.parameter.selectedIndicatorField, serverInterval].concat(this.parameter.indicatorParameters).join('_');
        technicalFunction = this.replaceAll(technicalFunction, 'P_1', p1);
        technicalFunction = this.replaceAll(technicalFunction, 'P_2_prv1', this.equationDefinition.value1.toString());
        technicalFunction = this.replaceAll(technicalFunction, 'P_2_prv2', this.equationDefinition.value1.toString());
        technicalFunction = this.replaceAll(technicalFunction, 'P_2', this.equationDefinition.value1.toString());
        technicalFunction = this.replaceAll(technicalFunction, 'P_3_prv1', this.equationDefinition.value2.toString());
        technicalFunction = this.replaceAll(technicalFunction, 'P_3_prv2', this.equationDefinition.value2.toString());
        technicalFunction = this.replaceAll(technicalFunction, 'P_3', this.equationDefinition.value2.toString());
        return technicalFunction;
    };
    ChartAlert.prototype.getEquationDescription = function () {
        var equationDescriptionObject = {
            'indicatorType': this.parameter.indicatorType,
            'selectedIndicatorField': this.parameter.selectedIndicatorField,
            'indicatorParameters': this.parameter.indicatorParameters,
            'value': this.equationDefinition.value1,
            'alertFunction': this.equationDefinition.alertFunctionType,
            'hostId': this.hostId,
            'indicatorId': this.parameter.indicatorId,
            'secondValue': this.equationDefinition.value2
        };
        return JSON.stringify(equationDescriptionObject);
    };
    ChartAlert.prototype.hasChannelFunction = function () {
        return [ChartAlertFunctionType.ENTERING_CHANNEL, ChartAlertFunctionType.EXITING_CHANNEL].indexOf(this.equationDefinition.alertFunctionType) > -1;
    };
    ChartAlert.prototype.replaceAll = function (str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    };
    ChartAlert.prototype.getTechnicalFunction = function () {
        return this.getAlertFunction().technicalFunction;
    };
    ChartAlert.prototype.getAlertFunction = function () {
        return ChartAlertFunction.fromType(this.equationDefinition.alertFunctionType);
    };
    return ChartAlert;
}(HostedAlert));
export { ChartAlert };
//# sourceMappingURL=chart-alert.js.map