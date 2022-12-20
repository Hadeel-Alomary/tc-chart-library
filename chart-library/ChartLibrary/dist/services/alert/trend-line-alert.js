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
import { TrendLineAlertOperation, TrendLineAlertOperationType } from './trend-line-alert-operation';
import { AlertTriggerType } from './alert-trigger';
import { AlertType } from './alert-type';
import { NotificationMethods } from '../notification';
import { HostedAlert } from './hosted-alert';
var isEqual = require("lodash/isEqual");
var TrendLineAlert = (function (_super) {
    __extends(TrendLineAlert, _super);
    function TrendLineAlert(id, interval, paused, reactivateMinutes, triggerType, fireOnChange, expiryDate, message, language, expired, createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted, hostId, operation, trendLine, drawingId) {
        var _this = _super.call(this, id, interval, paused, reactivateMinutes, triggerType, fireOnChange, expiryDate, message, language, expired, createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted, hostId) || this;
        _this.operation = operation;
        _this.trendLine = trendLine;
        _this.drawingId = drawingId;
        return _this;
    }
    TrendLineAlert.createNewAlert = function (interval, company, drawingDefinition, hostId, drawingId, language) {
        return new TrendLineAlert(null, interval, false, false, AlertTriggerType.ONCE, false, moment().add(3, 'days').format('YYYY-MM-DD 00:00:00'), '', language, false, moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 00:00:00'), company, null, [], new NotificationMethods(), AlertType.TREND, false, hostId, TrendLineAlertOperation.fromType(TrendLineAlertOperationType.CROSS_UP), drawingDefinition, drawingId);
    };
    TrendLineAlert.prototype.updateTrendLineDefinitionAndInterval = function (drawingInfo, interval) {
        this.trendLine = drawingInfo;
        this.interval = interval;
    };
    TrendLineAlert.prototype.getCondition = function (languageService) {
        return languageService.arabic ? this.operation.arabic : this.operation.english;
    };
    TrendLineAlert.prototype.getEquation = function () {
        var equationObject = {
            'operation': TrendLineAlertOperationType[this.operation.type],
            'date1': this.trendLine.date1,
            'date2': this.trendLine.date2,
            'price1': this.trendLine.price1,
            'price2': this.trendLine.price2,
            'extend-left': this.trendLine.extendLeft,
            'extend-right': this.trendLine.extendRight,
            'logarithmic': this.trendLine.logarithmic
        };
        return JSON.stringify(equationObject);
    };
    TrendLineAlert.prototype.getEquationDescription = function () {
        var equationDescriptionObject = {
            'web': true,
            'hostId': this.hostId,
            'drawingId': this.drawingId
        };
        return JSON.stringify(equationDescriptionObject);
    };
    TrendLineAlert.prototype.hasDifferentTrendLineDefinition = function (trendLineDefinition) {
        return !isEqual(this.trendLine, trendLineDefinition);
    };
    return TrendLineAlert;
}(HostedAlert));
export { TrendLineAlert };
//# sourceMappingURL=trend-line-alert.js.map