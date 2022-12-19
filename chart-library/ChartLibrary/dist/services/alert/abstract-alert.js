import { AlertType } from './alert-type';
import { IntervalType } from '../loader/price-loader/interval-type';
var AbstractAlert = (function () {
    function AbstractAlert(id, interval, paused, reactivateMinutes, triggerType, fireOnChange, expiryDate, message, language, expired, createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, alertType, deleted) {
        this.id = id;
        this.interval = interval;
        this.paused = paused;
        this.reactivateMinutes = reactivateMinutes;
        this.triggerType = triggerType;
        this.fireOnChange = fireOnChange;
        this.expiryDate = expiryDate;
        this.message = message;
        this.language = language;
        this.expired = expired;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.company = company;
        this.lastTriggerTime = lastTriggerTime;
        this.history = history;
        this.notificationMethods = notificationMethods;
        this.alertType = alertType;
        this.deleted = deleted;
    }
    AbstractAlert.isSupportedInterval = function (interval) {
        switch (interval.type) {
            case IntervalType.TenMinutes:
            case IntervalType.TwentyMinutes:
            case IntervalType.Quarter:
            case IntervalType.Year:
            case IntervalType.Custom:
                return false;
            default:
                return true;
        }
    };
    AbstractAlert.prototype.getLastHistoryPoint = function () {
        return this.history.length == 0 ? null : this.history[this.history.length - 1];
    };
    AbstractAlert.prototype.getExpiryInDays = function () {
        return moment(this.expiryDate.substr(0, 10)).diff(this.createdAt.substr(0, 10), 'days');
    };
    AbstractAlert.prototype.isActive = function () {
        return !this.deleted && !this.paused && !this.expired && this.lastTriggerTime == null;
    };
    AbstractAlert.prototype.isAchieved = function () {
        return !this.deleted && this.expired && this.lastTriggerTime != null;
    };
    AbstractAlert.prototype.isTrendLineAlert = function () {
        return this.alertType == AlertType.TREND;
    };
    AbstractAlert.prototype.isNormalAlert = function () {
        return this.alertType == AlertType.NORMAL;
    };
    AbstractAlert.prototype.isChartAlert = function () {
        return this.alertType == AlertType.TECHNICAL;
    };
    return AbstractAlert;
}());
export { AbstractAlert };
//# sourceMappingURL=abstract-alert.js.map