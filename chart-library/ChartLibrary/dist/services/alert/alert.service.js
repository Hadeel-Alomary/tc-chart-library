var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Streamer } from '../streaming/index';
import { AlertLoader } from '../loader/index';
import { Tc, TcTracker } from '../../utils/index';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HostedAlert } from './hosted-alert';
var AlertService = (function () {
    function AlertService(alertLoader, streamer) {
        var _this = this;
        this.alertLoader = alertLoader;
        this.alerts = [];
        this.alertUpdatedStream = new Subject();
        this.alertsHistoryLoadedStream = new BehaviorSubject(false);
        var userName = null;
        this.alertLoader.loadAlerts().subscribe(function (alerts) {
            _this.onLoadHistoricalAlerts(alerts);
            streamer.getGeneralPurposeStreamer().subscribeAlerts(userName);
            streamer.getGeneralPurposeStreamer().getAlertsStream().subscribe(function (message) { return _this.onAlertFromStreamer(message); });
        });
    }
    AlertService.prototype.createAlert = function (alert) {
        var _this = this;
        Tc.assert(this.alerts.indexOf(alert) == -1, "create an alert that already exists");
        TcTracker.trackSaveAlert();
        this.alertLoader.createAlert(alert)
            .subscribe(function (alertId) {
            alert.id = alertId;
            _this.alerts.push(alert);
            _this.alertUpdatedStream.next(alert);
        });
    };
    AlertService.prototype.updateAlert = function (alert) {
        var _this = this;
        Tc.assert(this.alerts.indexOf(alert) !== -1, "delete an alert that does not exist");
        TcTracker.trackUpdateAlert();
        this.alertLoader.updateAlert(alert).subscribe(function () {
            _this.alertUpdatedStream.next(alert);
        });
    };
    AlertService.prototype.getAlertUpdatedStream = function () {
        return this.alertUpdatedStream;
    };
    AlertService.prototype.getAlertsHistoryLoadedStream = function () {
        return this.alertsHistoryLoadedStream;
    };
    AlertService.prototype.deleteAlert = function (alert) {
        var _this = this;
        Tc.assert(this.alerts.indexOf(alert) !== -1, "delete an alert that does not exist");
        TcTracker.trackDeleteAlert();
        this.alerts.splice(this.alerts.indexOf(alert), 1);
        alert.deleted = true;
        this.alertLoader.deleteAlert(alert).subscribe(function () {
            _this.alertUpdatedStream.next(alert);
        });
    };
    AlertService.prototype.getActiveAlerts = function () {
        return this.alerts.filter(function (alert) { return alert.isActive(); });
    };
    AlertService.prototype.getInactiveAlerts = function () {
        return this.alerts.filter(function (alert) { return !alert.isActive(); });
    };
    AlertService.prototype.getAchievedAlerts = function () {
        return this.alerts.filter(function (alert) { return alert.isAchieved(); });
    };
    AlertService.prototype.getTrendLineAlertByDrawingId = function (drawingId) {
        return this.getActiveAlerts().find(function (alert) { return alert.isTrendLineAlert() && alert.drawingId == drawingId; });
    };
    AlertService.prototype.getAchievedTrendLineAlertByDrawingId = function (drawingId) {
        return this.getAchievedAlerts().find(function (alert) { return alert.isTrendLineAlert() && alert.drawingId == drawingId; });
    };
    AlertService.prototype.getTrendLineAlertsHostedByChart = function (hostId) {
        var activeTrendLineAlerts = this.getActiveAlerts().filter(function (alert) { return alert.isTrendLineAlert(); });
        return activeTrendLineAlerts.filter(function (alert) { return alert.hostId == hostId; });
    };
    AlertService.prototype.getChartAlertsHostedByChart = function (hostId) {
        var activeChartAlerts = this.getActiveAlerts().filter(function (alert) { return alert.isChartAlert(); });
        return activeChartAlerts.filter(function (alert) { return alert.hostId == hostId; });
    };
    AlertService.prototype.getAlertsHostedByChart = function (hostId) {
        return [].concat(this.getTrendLineAlertsHostedByChart(hostId), this.getChartAlertsHostedByChart(hostId));
    };
    AlertService.prototype.getIndicatorChartAlerts = function (hostId, indicatorId) {
        return this.getChartAlertsHostedByChart(hostId).filter(function (alert) { return alert.parameter.indicatorId == indicatorId; });
    };
    AlertService.prototype.onLoadHistoricalAlerts = function (alerts) {
        var _this = this;
        alerts.forEach(function (alert) {
            _this.alerts.push(alert);
        });
        this.alertsHistoryLoadedStream.next(true);
    };
    AlertService.prototype.onAlertFromStreamer = function (message) {
        var alert = this.alerts.find(function (alert) { return alert.id == message.id; });
        if (alert) {
            alert.lastTriggerTime = message.time;
            alert.history.push({ time: message.time, price: +message.price });
            alert.expired = true;
            this.alertUpdatedStream.next(alert);
        }
    };
    AlertService.prototype.getAlertsHostedByPage = function (pageId) {
        return this.alerts.filter(function (alert) {
            return (alert instanceof HostedAlert) && alert.hostId.startsWith(pageId + '|');
        });
    };
    AlertService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AlertLoader, Streamer])
    ], AlertService);
    return AlertService;
}());
export { AlertService };
//# sourceMappingURL=alert.service.js.map